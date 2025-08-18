import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/app/lib/stores/auth.store';

export const useAuth = () => {
  const store = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (store.token && !store.user && !store.loading) {
        try {
          await store.fetchProfile();
        } catch (error) {
          // Error is handled in the store
          console.error('Failed to initialize auth:', error);
        }
      }
    };

    initializeAuth();
  }, [store.token, store.user, store.loading, store.fetchProfile]);

  const login = useCallback(
    (token: string) => store.login(token),
    [store.login]
  );

  const logout = useCallback(() => {
    store.logout();
  }, [store.logout]);

  const fetchProfile = useCallback(
    (force?: boolean) => store.fetchProfile(force),
    [store.fetchProfile]
  );

  const updateProfile = useCallback(
    (payload: any) => store.updateProfile(payload),
    [store.updateProfile]
  );

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    token: store.token,
    loading: store.loading,
    error: store.error,

    // Actions
    login,
    logout,
    fetchProfile,
    updateProfile,
    clearError: store.clearError,
  };
};