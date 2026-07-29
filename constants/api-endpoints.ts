
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
  ADMIN_AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/admin/auth/login`,
    VERIFY_2FA: `${API_BASE_URL}/api/v1/admin/auth/verify-2fa`,
    RESEND_2FA: `${API_BASE_URL}/api/v1/admin/auth/resend-2fa`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/admin/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/v1/admin/auth/reset-password`,
    ME: `${API_BASE_URL}/api/v1/admin/auth/me`,
    ALL_USERS: `${API_BASE_URL}/api/v1/admin/users/all-users`,
    USER_DETAIL: (id: string) => `${API_BASE_URL}/api/v1/admin/users/all-users/${id}`,
    USER_ACTIVITY: (id: string) => `${API_BASE_URL}/api/v1/admin/users/all-users/${id}/activity`,
    USER_REPORTS: (id: string) => `${API_BASE_URL}/api/v1/admin/users/all-users/${id}/reports`,
    USER_AUDIT_HISTORY: (id: string) => `${API_BASE_URL}/api/v1/admin/users/all-users/${id}/audit-history`,
    USER_NOTES: (id: string) => `${API_BASE_URL}/api/v1/admin/users/all-users/${id}/notes`,
    ROLES: `${API_BASE_URL}/api/v1/admin/permissions`,
    ADMIN_ACCOUNTS: `${API_BASE_URL}/api/v1/admin/users`,
    ADMIN_ACCOUNT_DETAIL: (id: string) => `${API_BASE_URL}/api/v1/admin/users/${id}`,
    ADMIN_ACCESS_LOGS: `${API_BASE_URL}/api/v1/admin/users/all-users`,
  },
  DASHBOARD: {
    ROOT: `${API_BASE_URL}/api/v1/dashboard`,
  },
  ADMIN_DASHBOARD: {
    ROOT: `${API_BASE_URL}/api/v1/dashboard/admin`,
    USER_STATS: `${API_BASE_URL}/api/v1/dashboard/admin/stats/users`,
    PROJECT_STATS: `${API_BASE_URL}/api/v1/dashboard/admin/stats/projects`,
    PENDING_STATS: `${API_BASE_URL}/api/v1/dashboard/admin/stats/pending`,
    PENDING_ACTIONS: `${API_BASE_URL}/api/v1/dashboard/admin/pending-actions`,
    ACTIVITIES: `${API_BASE_URL}/api/v1/dashboard/admin/activities`,
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
  WAITLIST: {
    LIST: `${API_BASE_URL}/api/v1/waitlist`,
    JOIN: `${API_BASE_URL}/api/v1/waitlist`,
    DOWNLOAD: `${API_BASE_URL}/api/v1/waitlist/download`,
  },
  PROFILE: {
    UPDATE: `${API_BASE_URL}/api/v1/user/profile`,
    EMAIL: `${API_BASE_URL}/api/v1/user/profile/email`,
    PHONE: `${API_BASE_URL}/api/v1/user/profile/phone`,
    PASSWORD: `${API_BASE_URL}/api/v1/user/profile/password`,
    AVATAR: `${API_BASE_URL}/api/v1/user/profile/avatar`,
    COMPLETENESS: `${API_BASE_URL}/api/v1/user/profile/completeness`,
    BROWSE: `${API_BASE_URL}/api/v1/user/profile/browse`,
    DETAIL: (userId: string) => `${API_BASE_URL}/api/v1/user/profile/${userId}`,
    ENDORSE: (userId: string) => `${API_BASE_URL}/api/v1/user/profile/${userId}/endorsements`,
    PORTFOLIO: (userId: string) => `${API_BASE_URL}/api/v1/user/profile/portfolio/${userId}`,
    UPDATE_PORTFOLIO: (projectId: string) => `${API_BASE_URL}/api/v1/user/profile/portfolio/${projectId}`,
    PROJECT_ENDORSEMENT: (projectId: string) => `${API_BASE_URL}/api/v1/user/profile/portfolio/${projectId}/endorsements`,
  },
  MESSAGING: {
    SEND_REQUEST: `${API_BASE_URL}/api/v1/messaging/requests`,
    RESPOND_REQUEST: (id: string) => `${API_BASE_URL}/api/v1/messaging/requests/${id}`,
    LIST_REQUESTS: `${API_BASE_URL}/api/v1/messaging/requests`,
    LIST_CHATS: `${API_BASE_URL}/api/v1/messaging/chats`,
    MESSAGES: (chatId: string) => `${API_BASE_URL}/api/v1/messaging/chats/${chatId}/messages`,
    READ: (chatId: string) => `${API_BASE_URL}/api/v1/messaging/chats/${chatId}/read`,
    REACTION: (messageId: string) => `${API_BASE_URL}/api/v1/messaging/messages/${messageId}/reactions`,
    ARCHIVE: (chatId: string) => `${API_BASE_URL}/api/v1/messaging/chats/${chatId}/archive`,
    DELETE_CHAT: (chatId: string) => `${API_BASE_URL}/api/v1/messaging/chats/${chatId}`,
  },
  PAYMENTS: {
    WALLET: `${API_BASE_URL}/api/v1/payments/wallet`,
    TRANSACTIONS: `${API_BASE_URL}/api/v1/payments/transactions`,
    FUND_INITIALIZE: `${API_BASE_URL}/api/v1/payments/fund/initialize`,
    FUND_VERIFY: `${API_BASE_URL}/api/v1/payments/fund/verify`,
    BANKS: `${API_BASE_URL}/api/v1/payments/banks`,
    BANK_ACCOUNTS: `${API_BASE_URL}/api/v1/payments/bank-accounts`,
    BANK_ACCOUNT_DETAIL: (id: string) => `${API_BASE_URL}/api/v1/payments/bank-accounts/${id}`,
    WITHDRAW: `${API_BASE_URL}/api/v1/payments/withdraw`,
    WITHDRAWALS: `${API_BASE_URL}/api/v1/payments/withdrawals`,
  },
  SECURITY: {
    SETUP_2FA: `${API_BASE_URL}/api/v1/user/security/2fa/setup`,
    VERIFY_2FA: `${API_BASE_URL}/api/v1/user/security/2fa/verify`,
    LOGOUT_ALL: `${API_BASE_URL}/api/v1/user/security/logout-all`,
    DEACTIVATE: `${API_BASE_URL}/api/v1/user/security/deactivate`,
    DELETE: `${API_BASE_URL}/api/v1/user/security/delete`,
    DATA_EXPORT: `${API_BASE_URL}/api/v1/user/security/data-export`,
    EXPORT_STATUS: (id: string) => `${API_BASE_URL}/api/v1/user/security/data-export/${id}`,
    SUPPORT: `${API_BASE_URL}/api/v1/user/security/support-request`,
  },
  COLLABORATORS: {
    LIST: `${API_BASE_URL}/api/v1/user/collaborators`,
    SKILLS: `${API_BASE_URL}/api/v1/user/collaborators/skills`,
    GENRES: `${API_BASE_URL}/api/v1/user/collaborators/genres`,
    AVAILABILITY: `${API_BASE_URL}/api/v1/user/collaborators/availability`,
    DETAIL: (userId: string) => `${API_BASE_URL}/api/v1/user/collaborators/${userId}`,
  },
  NOTIFICATION_SETTINGS: {
    ROOT: `${API_BASE_URL}/api/v1/notification-settings`,
  },
  SUBSCRIPTIONS: {
    PLANS: `${API_BASE_URL}/api/v1/subscriptions/plans`,
    ME: `${API_BASE_URL}/api/v1/subscriptions/me`,
    SUBSCRIBE: `${API_BASE_URL}/api/v1/subscriptions/subscribe`,
    CANCEL: `${API_BASE_URL}/api/v1/subscriptions/cancel`,
    REACTIVATE: `${API_BASE_URL}/api/v1/subscriptions/reactivate`,
    BILLING_HISTORY: `${API_BASE_URL}/api/v1/subscriptions/billing/history`,
    INVOICE: (id: string) => `${API_BASE_URL}/api/v1/subscriptions/billing/invoices/${id}`,
    INVOICE_PDF: (id: string) => `${API_BASE_URL}/api/v1/subscriptions/billing/invoices/${id}/pdf`,
    PAYMENT_METHODS: `${API_BASE_URL}/api/v1/subscriptions/payment-methods`,
    DEFAULT_PAYMENT_METHOD: (id: string) => `${API_BASE_URL}/api/v1/subscriptions/payment-methods/${id}/default`,
    DELETE_PAYMENT_METHOD: (id: string) => `${API_BASE_URL}/api/v1/subscriptions/payment-methods/${id}`,
  },
  ESCROW: {
    MY_PAYMENTS: `${API_BASE_URL}/api/v1/projects/escrow/my-payments`,
    DISPUTES_RESOLVE: (milestoneId: string) => `${API_BASE_URL}/api/v1/projects/escrow/disputes/${milestoneId}/resolve`,
    CONFIGURE: (projectId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow`,
    DETAIL: (projectId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow`,
    STATUS: (projectId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow/status`,
    APPROVE_PROPOSAL: (projectId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow/approve`,
    FUND: (projectId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow/fund`,
    PAYMENT_HISTORY: (projectId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow/payments`,
    MILESTONE_DETAIL: (projectId: string, milestoneId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow/milestones/${milestoneId}`,
    MILESTONE_SUBMIT: (projectId: string, milestoneId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow/milestones/${milestoneId}/submit`,
    MILESTONE_APPROVE: (projectId: string, milestoneId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow/milestones/${milestoneId}/approve`,
    MILESTONE_DISPUTE: (projectId: string, milestoneId: string) => `${API_BASE_URL}/api/v1/projects/${projectId}/escrow/milestones/${milestoneId}/dispute`,
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
