"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService, { SignupPayload, LoginPayload } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import axios from 'axios';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // On mount, check if user is already authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await authService.getProfile();
        setUser(data.user || data.data);
        setIsAuthenticated(true);
      } catch {
        // Not authenticated
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const clearError = () => setError(null);

  const login = async (data: LoginPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      // Note: We're calling our Next.js proxy route for secure cookie handling
      const response = await axios.post('/api/auth/login', data);

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        router.push(ROUTES.DASHBOARD.ROOT);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message || 'Login failed');
      } else {
        setError('Login failed');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signup(data);

      // After signup, redirect to verify email
      router.push(ROUTES.AUTH.VERIFY_EMAIL);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Signup failed');
      } else {
        setError('Signup failed');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await axios.post('/api/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      router.push(ROUTES.AUTH.LOGIN);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, login, signup, logout, clearError }}>
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
