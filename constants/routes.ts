export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_EMAIL: '/auth/verifyemail',
    PASSWORD_RESET: '/auth/password-reset',
    NEW_PASSWORD: '/auth/new-password',
    PASSWORD_UPDATED: '/auth/password-updated',
    ONBOARDING_SUCCESS: '/auth/onboardingsuccess',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    SETTINGS: '/dashboard/settings',
    PROFILE: '/dashboard/profile',
  },
};

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.FORGOT_PASSWORD,
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD.ROOT,
];
