"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import authService, { LoginPayload, SignupPayload } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { useLogin } from '@/hooks/auth/useLogin';
import { useSignup } from '@/hooks/auth/useSignup';
import { useLogout } from '@/hooks/auth/useLogout';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  signup: (data: SignupPayload) => Promise<void>;
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

  const login = async (data: LoginPayload) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        router.push(ROUTES.DASHBOARD.ROOT);
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
  
  const getErrorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) { 
      return (
        err.response?.data?.message || 
        (err.response?.data as { error?: string })?.error || 
        err.message
      );
    }
    if (err instanceof Error) {
      return err.message;
    }
    return null;
  };

  const error = manualError || 
               getErrorMessage(loginMutation.error) || 
               getErrorMessage(signupMutation.error) || 
               null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      error, 
      login, 
      signup, 
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
