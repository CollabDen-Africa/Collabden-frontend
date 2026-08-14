"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import authService, { LoginPayload, SignupPayload, VerifyPayload } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { useLogin } from '@/hooks/auth/useLogin';
import { useAdminLogin } from "@/hooks/auth/useAdminLogin";
import { useAdminVerify2FA } from "@/hooks/auth/useAdminVerify2FA";
import { useAdminResend2FA } from "@/hooks/auth/useAdminResend2FA";
import { useSignup } from '@/hooks/auth/useSignup';
import { useLogout } from '@/hooks/auth/useLogout';
import { getErrorMessage } from '@/lib/error-handler';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hasCompletedOnboarding?: boolean;
  onboardingCompleted?: boolean;
  identityVerified?: boolean;
  legalName?: string | null;
  isAdmin?: boolean;
}

export interface AdminVerify2FAPayload {
  adminId: string;
  code: string;
}

export interface AdminResend2FAPayload {
  adminId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  adminLogin: (data: LoginPayload) => Promise<any>;
  adminVerify2FA: (data: AdminVerify2FAPayload) => Promise<any>;
  adminResend2FA: (data: AdminResend2FAPayload) => Promise<any>;
  signup: (data: SignupPayload) => Promise<void>;
  verify: (data: VerifyPayload) => Promise<any>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [manualError, setManualError] = useState<string | null>(null);

  const router = useRouter();

  // Integrated TanStack Mutations
  const loginMutation = useLogin();
  const adminLoginMutation = useAdminLogin();
  const adminVerify2FAMutation = useAdminVerify2FA();
  const adminResend2FAMutation = useAdminResend2FA();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();

  // Create refs to hold stable references to mutation reset functions
  const loginResetRef = useRef(loginMutation.reset);
  const adminLoginResetRef = useRef(adminLoginMutation.reset);
  const adminVerify2FAResetRef = useRef(adminVerify2FAMutation.reset);
  const adminResend2FAResetRef = useRef(adminResend2FAMutation.reset);
  const signupResetRef = useRef(signupMutation.reset);

  // Keep refs up-to-date
  loginResetRef.current = loginMutation.reset;
  adminLoginResetRef.current = adminLoginMutation.reset;
  adminVerify2FAResetRef.current = adminVerify2FAMutation.reset;
  adminResend2FAResetRef.current = adminResend2FAMutation.reset;
  signupResetRef.current = signupMutation.reset;

  // On mount, check if user is already authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsInitializing(true);
        const data = await authService.getProfile();
        const profileUser = data.user || data.data;
        setUser(profileUser);
        setIsAuthenticated(true);
        if (profileUser?.isAdmin) {
          localStorage.setItem("collabden_admin_logged_in", "true");
        }
      } catch {
        // Not authenticated
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchProfile();
  }, []);

  const clearError = useCallback(() => {
    setManualError(null);
    loginResetRef.current();
    adminLoginResetRef.current();
    adminVerify2FAResetRef.current();
    adminResend2FAResetRef.current();
    signupResetRef.current();
  }, []);

  const refreshUser = async () => {
    try {
      const data = await authService.getProfile();
      const updatedUser = data.user || data.data;
      setUser(updatedUser);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const verify = async (data: VerifyPayload) => {
    try {
      const response = await authService.verifyEmail(data);
      const verifiedUser =
        response.user || response.data?.user || response.data;
      setUser(verifiedUser);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      console.error("Email verification sync error:", err);
      throw err;
    }
  };

  const login = async (data: LoginPayload) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.success) {
        const loggedUser =
          response.user || response.data?.user || response.data;
        setUser(loggedUser);
        setIsAuthenticated(true);

        // Dynamic onboarding redirection
        const isAlreadyOnboarded =
          loggedUser?.hasCompletedOnboarding === true ||
          loggedUser?.onboardingCompleted === true;
        if (loggedUser?.isAdmin) {
          localStorage.setItem("collabden_admin_logged_in", "true");
          router.push("/admin/dashboard");
        } else if (!isAlreadyOnboarded) {
          router.push(ROUTES.DASHBOARD.SETUP); // Redirect to onboarding /intro
        } else {
          router.push(ROUTES.DASHBOARD.ROOT); // Redirect to dashboard
        }
      }
    } catch {
      // Error is managed globally by AuthContext via mutations
    }
  };

  const adminLogin = async (data: LoginPayload) => {
    try {
      const response = await adminLoginMutation.mutateAsync(data);
      // Proxy normalizes to: { success, requires2FA, adminId, email } or { success, user }
      if (response.requires2FA) {
        return response;
      }
      if (response.user) {
        setUser({ ...response.user, isAdmin: true });
        setIsAuthenticated(true);
        localStorage.setItem("collabden_admin_logged_in", "true");
        router.push("/admin/dashboard");
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const adminVerify2FA = async (data: AdminVerify2FAPayload) => {
    try {
      const response = await adminVerify2FAMutation.mutateAsync(data);
      // Proxy normalizes to: { success: true, user: adminUser }
      if (response.user) {
        setUser({ ...response.user, isAdmin: true });
        setIsAuthenticated(true);
        localStorage.setItem("collabden_admin_logged_in", "true");
        router.push("/admin/dashboard");
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const adminResend2FA = async (data: AdminResend2FAPayload) => {
    try {
      const response = await adminResend2FAMutation.mutateAsync(data);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const signup = async (data: SignupPayload) => {
    try {
      await signupMutation.mutateAsync(data);
      // After signup, redirect to verify email with the email in query params
      router.push(
        `${ROUTES.AUTH.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`
      );
    } catch {
      // Error is managed globally by AuthContext via mutations
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      setIsAuthenticated(false);
      router.push(ROUTES.AUTH.LOGIN);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Compute overall states
  const isLoading =
    isInitializing ||
    loginMutation.isPending ||
    adminLoginMutation.isPending ||
    adminVerify2FAMutation.isPending ||
    adminResend2FAMutation.isPending ||
    signupMutation.isPending ||
    logoutMutation.isPending;

  const error =
    manualError ||
    (loginMutation.error ? getErrorMessage(loginMutation.error) : null) ||
    (adminLoginMutation.error
      ? getErrorMessage(adminLoginMutation.error)
      : null) ||
    (adminVerify2FAMutation.error
      ? getErrorMessage(adminVerify2FAMutation.error)
      : null) ||
    (adminResend2FAMutation.error
      ? getErrorMessage(adminResend2FAMutation.error)
      : null) ||
    (signupMutation.error ? getErrorMessage(signupMutation.error) : null) ||
    null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        adminLogin,
        adminVerify2FA,
        adminResend2FA,
        signup,
        verify,
        logout,
        clearError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
