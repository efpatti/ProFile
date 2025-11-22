import { apiClient } from './client';

export interface UploadResponse {
  url: string;
  key: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export const uploadService = {
  /**
   * Upload user profile image
   * Backend: POST /api/upload/profile-image
   */
  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/upload/profile-image`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        error: {
          message: error.message || 'Upload failed',
          statusCode: response.status,
        },
      };
    }

    const data = await response.json();
    return { data };
  },

  /**
   * Upload company logo for resume
   * Backend: POST /api/upload/company-logo/:resumeId
   */
  async uploadCompanyLogo(resumeId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/upload/company-logo/${resumeId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        error: {
          message: error.message || 'Upload failed',
          statusCode: response.status,
        },
      };
    }

    const data = await response.json();
    return { data };
  },

  /**
   * Delete uploaded file
   * Backend: DELETE /api/upload/file/:key
   */
  async deleteFile(key: string) {
    return apiClient.delete<DeleteResponse>(`/upload/file/${encodeURIComponent(key)}`);
  },
};
