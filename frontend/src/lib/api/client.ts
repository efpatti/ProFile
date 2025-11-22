import { getSession, clearSession, saveSession } from './session';

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const session = getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Token expired, try to refresh
        if (response.status === 401 && session?.refreshToken) {
          const refreshed = await this.refreshAccessToken(session.refreshToken);

          if (refreshed) {
            // Retry the original request with new token
            return this.request<T>(endpoint, options);
          } else {
            clearSession();
            window.location.href = '/auth/signin';
          }
        }

        return {
          error: {
            message: data?.message || 'An error occurred',
            statusCode: response.status,
            errors: data?.errors,
          },
        };
      }

      return { data };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          statusCode: 0,
        },
      };
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<boolean> {
    try {
      // Backend expects JWT token in Authorization header for refresh
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      // Backend returns { success: true, token: "...", user: {...} }
      if (data.token) {
        const session = getSession();
        if (session) {
          saveSession({
            ...session,
            accessToken: data.token,
          });
        }
        return true;
      }

      return false;
    } catch (error) {
      // Silent fail - will be handled by clearing session
      return false;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
