import { apiClient } from './client';
import type { OnboardingData, OnboardingStatus } from './types';

export const onboardingService = {
  /**
   * Complete user onboarding with resume data
   * Backend: POST /api/onboarding
   */
  async completeOnboarding(data: OnboardingData) {
    return apiClient.post<{
      success: boolean;
      resumeId: string;
      message: string;
    }>('/onboarding', data);
  },

  /**
   * Get user onboarding status
   * Backend: GET /api/onboarding/status
   */
  async getStatus() {
    return apiClient.get<OnboardingStatus>('/onboarding/status');
  },
};
