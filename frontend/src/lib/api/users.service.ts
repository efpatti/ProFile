import { apiClient } from './client';
import type { UserProfile, UserPreferences, FullUserPreferences } from './types';

export const usersService = {
  /**
   * Get current user profile
   * Backend: GET /api/users/profile
   */
  async getProfile() {
    return apiClient.get<UserProfile>('/users/profile');
  },

  /**
   * Update current user profile
   * Backend: PATCH /api/users/profile
   */
  async updateProfile(data: Partial<UserProfile>) {
    return apiClient.patch<{ success: boolean; user: UserProfile }>('/users/profile', data);
  },

  /**
   * Get user preferences (basic)
   * Backend: GET /api/users/preferences
   */
  async getPreferences() {
    return apiClient.get<UserPreferences>('/users/preferences');
  },

  /**
   * Update user preferences (basic)
   * Backend: PATCH /api/users/preferences
   */
  async updatePreferences(data: Partial<UserPreferences>) {
    return apiClient.patch<{ success: boolean; message: string }>('/users/preferences', data);
  },

  /**
   * Get all user preferences
   * Backend: GET /api/users/preferences/full
   */
  async getFullPreferences() {
    return apiClient.get<FullUserPreferences>('/users/preferences/full');
  },

  /**
   * Update all user preferences
   * Backend: PATCH /api/users/preferences/full
   */
  async updateFullPreferences(data: Partial<FullUserPreferences>) {
    return apiClient.patch<{ success: boolean; preferences: FullUserPreferences }>('/users/preferences/full', data);
  },
};
