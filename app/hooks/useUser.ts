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
}

// Create a singleton to store the user data
let globalUser: User | null = null;
let globalLoading = true; // Start with true to prevent flashing
let globalError: Error | null = null;
let listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(globalUser);
  const [loading, setLoading] = useState<boolean>(globalLoading);
  const [error, setError] = useState<Error | null>(globalError);

  const fetchProfile = async () => {
    try {
      if (globalLoading && globalUser) return; // Don't fetch if we're loading and have a user
      
      globalLoading = true;
      setLoading(true);
      notifyListeners();

      const token = localStorage.getItem('authToken');
      if (!token) {
        globalUser = null;
        globalLoading = false;
        globalError = null;
        notifyListeners();
        return;
      }

      const data = await request<{ data: User }>('profile');
      globalUser = data.data;
      globalError = null;
    } catch (err) {
      globalUser = null;
      globalError = err as Error;
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('authToken');
      }
    } finally {
      globalLoading = false;
      notifyListeners();
    }
  };

  useEffect(() => {
    // Add listener for updates
    const listener = () => {
      setUser(globalUser);
      setLoading(globalLoading);
      setError(globalError);
    };
    listeners.push(listener);

    // Initial fetch if no data and has token
    if (!globalUser && localStorage.getItem('authToken')) {
      fetchProfile();
    } else {
      // If we already have data, just update the local state
      setUser(globalUser);
      setLoading(false); // Set loading to false if we have data
      globalLoading = false; // Update global loading state
      setError(globalError);
    }

    // Cleanup listener
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    globalUser = null;
    globalError = null;
    notifyListeners();
  };

  const refetch = async () => {
    await fetchProfile();
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
    refetch
  };
} 