'use client';

import { create } from 'zustand';
import { authService } from '@/lib/api';
import type { LoginCredentials, SignupData } from '@/lib/api/types';
import { getSession, clearSession } from '@/lib/api/session';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  hasCompletedOnboarding?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  checkAuth: () => {
    const session = getSession();

    if (session) {
      set({
        user: session.user,
        isAuthenticated: true,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);

      if (response.error) {
        set({
          error: response.error.message,
          isLoading: false,
        });
        return false;
      }

      if (response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }

      return false;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  signup: async (data: SignupData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.signup(data);

      if (response.error) {
        set({
          error: response.error.message,
          isLoading: false,
        });
        return false;
      }

      if (response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }

      return false;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
