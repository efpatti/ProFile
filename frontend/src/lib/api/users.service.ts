import { apiClient } from './client';
import type { UserProfile, UserPreferences, FullUserPreferences } from './types';

export const usersService = {
  async getProfile() {
    return apiClient.get<UserProfile>('/users/profile');
  },

  async updateProfile(data: Partial<UserProfile>) {
    return apiClient.patch<UserProfile>('/users/profile', data);
  },

  async getPreferences() {
    return apiClient.get<UserPreferences>('/users/preferences');
  },

  async updatePreferences(data: Partial<UserPreferences>) {
    return apiClient.patch<UserPreferences>('/users/preferences', data);
  },

  async getFullPreferences() {
    return apiClient.get<FullUserPreferences>('/users/preferences/full');
  },

  async updateFullPreferences(data: Partial<FullUserPreferences>) {
    return apiClient.patch<FullUserPreferences>('/users/preferences/full', data);
  },
};
