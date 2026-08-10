export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_EMAIL: "/auth/verifyemail",
    PASSWORD_RESET: "/auth/password-reset",
    NEW_PASSWORD: "/auth/new-password",
    PASSWORD_UPDATED: "/auth/password-updated",
    ONBOARDING_SUCCESS: "/auth/onboardingsuccess",
    CALLBACK: "/auth-callback",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    SETTINGS: "/dashboard/settings",
    PROFILE: "/dashboard/profile",
    SETUP: "/intro",
  },
  PROJECTS: {
    LIST: "/projects",
    CREATE: "/projects/new-project",
    DETAIL: (id: string) => `/projects/${id}`,
    SUCCESS: "/projects/success",
  },
  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin",
    DASHBOARD: "/admin/dashboard",
    WAITLIST: "/admin/waitlist",
    ROLES: "/admin/roles",
    ROLES_ACCOUNTS: "/admin/roles/accounts",
    ROLES_ACCESS_HISTORY: "/admin/roles/access-history",
    ROLE_EDIT: (id: string) => `/admin/roles/${id}/edit`,
  },
};

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.FORGOT_PASSWORD,
];

export const PROTECTED_ROUTES = [ROUTES.DASHBOARD.ROOT];
