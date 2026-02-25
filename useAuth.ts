'use client';

import { useEffect, useState } from 'react';
import { generateSessionToken } from '@/lib/crypto';
import { authRepository } from '@/db/repositories/auth.repository';
import { profileRepository } from '@/db/repositories/profile.repository';

interface SessionData {
  token: string;
  expiresAt: number;
}

const SESSION_KEY = 'fit90_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if setup is complete (profile exists)
      const profileExists = await profileRepository.exists();
      setIsSetupComplete(profileExists);

      // Check if user has valid session
      const session = getSession();
      if (session && session.expiresAt > Date.now()) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        clearSession();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setIsSetupComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (pin: string): Promise<boolean> => {
    try {
      const isValid = await authRepository.verifyCredentials(pin);
      if (isValid) {
        const token = generateSessionToken();
        const expiresAt = Date.now() + SESSION_DURATION;
        setSession({ token, expiresAt });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    clearSession();
    setIsAuthenticated(false);
  };

  const completeSetup = async () => {
    setIsSetupComplete(true);
    // After setup, auto-login
    const token = generateSessionToken();
    const expiresAt = Date.now() + SESSION_DURATION;
    setSession({ token, expiresAt });
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    isSetupComplete,
    isLoading,
    login,
    logout,
    completeSetup,
    checkAuthStatus,
  };
}

// Session management helpers
function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

function setSession(session: SessionData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
