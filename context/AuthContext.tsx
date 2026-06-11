"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService, { LoginPayload, SignupPayload, VerifyPayload } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { useLogin } from '@/hooks/auth/useLogin';
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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  signup: (data: SignupPayload) => Promise<void>;
  verify: (data: VerifyPayload) => Promise<any>;
  logout: () => Promise<void>;
  clearError: () => void;
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
  const signupMutation = useSignup();
  const logoutMutation = useLogout();

  // On mount, check if user is already authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsInitializing(true);
        const data = await authService.getProfile();
        setUser(data.user || data.data);
        setIsAuthenticated(true);
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

  const clearError = () => setManualError(null);

  const verify = async (data: VerifyPayload) => {
    try {
      const response = await authService.verifyEmail(data);
      const verifiedUser = response.user || response.data?.user || response.data;
      setUser(verifiedUser);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      console.error('Email verification sync error:', err);
      throw err;
    }
  };

  const login = async (data: LoginPayload) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.success) {
        const loggedUser = response.user || response.data?.user || response.data;
        setUser(loggedUser);
        setIsAuthenticated(true);

        // Dynamic onboarding redirection
        const isAlreadyOnboarded = loggedUser?.hasCompletedOnboarding === true || loggedUser?.onboardingCompleted === true;
        if (!isAlreadyOnboarded) {
          router.push(ROUTES.DASHBOARD.SETUP); // Redirect to onboarding /intro
        } else {
          router.push(ROUTES.DASHBOARD.ROOT);  // Redirect to dashboard
        }
      }
    } catch {
      // Error is managed globally by AuthContext via mutations
    }
  };

  const signup = async (data: SignupPayload) => {
    try {
      await signupMutation.mutateAsync(data);
      // After signup, redirect to verify email with the email in query params
      router.push(`${ROUTES.AUTH.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`);
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
      console.error('Logout error:', err);
    }
  };

  // Compute overall states
  const isLoading = isInitializing || loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending;

  const error = manualError ||
    (loginMutation.error ? getErrorMessage(loginMutation.error) : null) ||
    (signupMutation.error ? getErrorMessage(signupMutation.error) : null) ||
    null;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      signup,
      verify,
      logout,
      clearError
    }}>
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
