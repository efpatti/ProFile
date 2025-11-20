import { apiClient } from './client';
import type { OnboardingData, OnboardingStatus } from './types';

export const onboardingService = {
  async completeOnboarding(data: OnboardingData) {
    return apiClient.post<{ message: string }>('/onboarding', data);
  },

  async getStatus() {
    return apiClient.get<OnboardingStatus>('/onboarding/status');
  },
};
