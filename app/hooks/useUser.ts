import { useState, useEffect } from 'react';
import { User } from '@/app/lib/types';
import request from '@/app/lib/api/client';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  logout: () => void;
  refetch: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

let globalUser: User | null = null;
let globalLoading = false;
let globalError: Error | null = null;
let listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(globalUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(globalError);

  const fetchProfile = async () => {
    try {
      if (globalLoading) return;

      globalLoading = true;
      setLoading(true);
      notifyListeners();

      const token = localStorage.getItem('authToken');
      if (!token) {
        globalUser = null;
        globalLoading = false;
        globalError = null;
        setLoading(false);
        setUser(null);
        notifyListeners();
        return;
      }

      const data = await request<{ data: User }>('profile');
      globalUser = data.data;
      globalError = null;
      setUser(data.data);
    } catch (err) {
      globalUser = null;
      globalError = err as Error;
      setUser(null);
      setError(err as Error);
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('authToken');
      }
    } finally {
      globalLoading = false;
      setLoading(false);
      notifyListeners();
    }
  };

  useEffect(() => {
    let mounted = true;

    const listener = () => {
      if (mounted) {
        setUser(globalUser);
        setLoading(globalLoading);
        setError(globalError);
      }
    };
    listeners.push(listener);

    const token = localStorage.getItem('authToken');
    if (!globalUser && token) {
      fetchProfile();
    } else {
      setUser(globalUser);
      setLoading(false);
      globalLoading = false;
      setError(globalError);
    }

    return () => {
      mounted = false;
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    globalUser = null;
    globalError = null;
    setUser(null);
    setLoading(false);
    globalLoading = false;
    notifyListeners();
  };

  const refetch = async () => {
    await fetchProfile();
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await request<{ data: User }>('profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      globalUser = response.data;
      globalError = null;
      setUser(response.data);
      notifyListeners();
    } catch (err) {
      globalError = err as Error;
      setError(err as Error);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
    refetch,
    updateProfile
  };
} 