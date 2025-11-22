import { apiClient } from './client';
import { saveSession, clearSession } from './session';
import type { LoginCredentials, SignupData, AuthResponse, RefreshTokenResponse } from './types';

export const authService = {
  /**
   * Register a new user
   * Backend: POST /api/auth/signup
   */
  async signup(data: SignupData) {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);

    if (response.data) {
      // Backend returns { success: true, token: "...", user: {...} }
      saveSession({
        accessToken: response.data.token,
        refreshToken: response.data.token, // Using same token for now
        user: response.data.user,
      });
    }

    return response;
  },

  /**
   * Login with email and password
   * Backend: POST /api/auth/login
   */
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.data) {
      saveSession({
        accessToken: response.data.token,
        refreshToken: response.data.token,
        user: response.data.user,
      });
    }

    return response;
  },

  /**
   * Logout user (clears local session)
   */
  async logout() {
    clearSession();
    window.location.href = '/auth/sign-in';
  },

  /**
   * Refresh JWT token
   * Backend: POST /api/auth/refresh (requires Authorization header)
   */
  async refreshToken(token: string) {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.data) {
      const currentSession = JSON.parse(localStorage.getItem('session') || '{}');
      saveSession({
        ...currentSession,
        accessToken: response.data.token,
        refreshToken: response.data.token,
        user: response.data.user,
      });
    }

    return response;
  },
};
