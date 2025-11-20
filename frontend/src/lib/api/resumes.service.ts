import { apiClient } from './client';
import type { Resume } from './types';

export const resumesService = {
  async getResumes() {
    return apiClient.get<Resume[]>('/resumes');
  },

  async getResume(id: string) {
    return apiClient.get<Resume>(`/resumes/${id}`);
  },

  async createResume(data: Partial<Resume>) {
    return apiClient.post<Resume>('/resumes', data);
  },

  async updateResume(id: string, data: Partial<Resume>) {
    return apiClient.patch<Resume>(`/resumes/${id}`, data);
  },

  async deleteResume(id: string) {
    return apiClient.delete<void>(`/resumes/${id}`);
  },
};
