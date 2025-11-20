import { apiClient } from './client';
import { saveSession, clearSession } from './session';
import type { LoginCredentials, SignupData, AuthResponse } from './types';

export const authService = {
  async signup(data: SignupData) {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);

    if (response.data) {
      saveSession(response.data);
    }

    return response;
  },

  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.data) {
      saveSession(response.data);
    }

    return response;
  },

  async logout() {
    clearSession();
  },

  async refreshToken(refreshToken: string) {
    return apiClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
  },
};
