const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const exportService = {
  getResumeUrl(params: {
    userId: string;
    palette?: string;
    language?: string;
    bannerColor?: string;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    return `${API_BASE_URL}/export/resume/pdf?${searchParams.toString()}`;
  },

  getBannerUrl(params: {
    userId: string;
    palette?: string;
    logo?: string;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    return `${API_BASE_URL}/export/banner?${searchParams.toString()}`;
  },

  async downloadResume(params: Parameters<typeof this.getResumeUrl>[0]) {
    const url = this.getResumeUrl(params);
    window.open(url, '_blank');
  },

  async downloadBanner(params: Parameters<typeof this.getBannerUrl>[0]) {
    const url = this.getBannerUrl(params);
    window.open(url, '_blank');
  },
};
