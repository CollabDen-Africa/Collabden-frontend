
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://collabden-backend.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/v1/user/signup`,
    LOGIN: `${API_BASE_URL}/api/v1/user/login`,
    PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
    VERIFY: `${API_BASE_URL}/api/v1/user/verify`,
    RESEND_VERIFY: `${API_BASE_URL}/api/v1/user/resend-verify`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/user/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/v1/user/reset-password`,
    GOOGLE_AUTH: `${API_BASE_URL}/api/v1/user/auth/google`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/api/v1/user/auth/google/callback`,
    ONBOARDING: `${API_BASE_URL}/api/v1/user/onboarding`,
  },
  DASHBOARD: {
    ROOT: `${API_BASE_URL}/api/v1/dashboard`,
  },
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/api/v1/notifications`,
    READ_ALL: `${API_BASE_URL}/api/v1/notifications/read-all`,
    READ_ONE: (id: string) => `${API_BASE_URL}/api/v1/notifications/${id}/read`,
  },
  PROJECTS: {
    LIST: `${API_BASE_URL}/api/v1/projects`,
    CREATE: `${API_BASE_URL}/api/v1/projects`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/v1/projects/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/projects/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/v1/projects/${id}`,
    INVITE: (id: string) => `${API_BASE_URL}/api/v1/projects/${id}/invite`,
    REMOVE_COLLABORATOR: (projectId: string, collaboratorId: string) => 
      `${API_BASE_URL}/api/v1/projects/${projectId}/collaborators/${collaboratorId}`,
    METADATA: (id: string) => `${API_BASE_URL}/api/v1/projects/${id}/metadata`,
  },
  AGREEMENTS: {
    UPLOAD: (projectId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/agreements`,
    LIST: (projectId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/agreements`,
    UPDATE: (projectId: string, id: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/agreements/${id}`,
    STATUS: (projectId: string, id: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/agreements/${id}/status`,
    SIGN: (projectId: string, id: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/agreements/${id}/sign`,
    ESIGN: (projectId: string, id: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/agreements/${id}/esign`,
  },
  CONNECTIONS: {
    SEND_REQUEST: `${API_BASE_URL}/api/v1/user/connections/request`,
    RESPOND_REQUEST: (id: string) => `${API_BASE_URL}/api/v1/user/connections/request/${id}`,
    LIST: `${API_BASE_URL}/api/v1/user/connections`,
    LIST_PENDING: `${API_BASE_URL}/api/v1/user/connections/pending`,
  },
};

export interface API_RESPONSE<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface USER_PROFILE {
  id: string;
  email: string;
  isVerified: boolean;
}
