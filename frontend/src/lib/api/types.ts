// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoURL?: string;
}

export interface UserPreferences {
  palette?: string;
  bannerColor?: string;
  displayName?: string;
  photoURL?: string;
}

export interface FullUserPreferences {
  theme?: {
    mode: 'light' | 'dark' | 'auto';
    palette: string;
    accentColor?: string;
  };
  language?: string;
  dateFormat?: string;
  timezone?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    updates: boolean;
    marketing: boolean;
  };
  privacy?: {
    profileVisibility: 'public' | 'private' | 'connections';
    showEmail: boolean;
    showPhone: boolean;
  };
  export?: {
    defaultFormat: 'pdf' | 'docx';
    includePhoto: boolean;
    paperSize: 'A4' | 'Letter';
  };
}

// Resume types
export interface Resume {
  id: string;
  userId: string;
  title?: string;
  template?: string;
  palette?: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  projects?: Project[];
  certifications?: Certification[];
  awards?: Award[];
  recommendations?: Recommendation[];
  interests?: Interest[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
  highlights?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  level?: number;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Recommendation {
  id: string;
  author: string;
  relationship: string;
  text: string;
  date?: string;
}

export interface Interest {
  id: string;
  name: string;
}

// Onboarding types
export interface OnboardingData {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
  };
  professionalProfile: {
    jobTitle: string;
    summary?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  skills?: Array<{
    name: string;
    category?: string;
    level?: number;
  }>;
  experiences?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }>;
  languages?: Array<{
    name: string;
    proficiency: string;
  }>;
  template?: {
    palette: string;
    template: string;
  };
}

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  currentStep?: number;
}
