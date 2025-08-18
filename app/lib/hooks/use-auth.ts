import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/app/lib/stores/auth.store';
import { SendOTPRequest, VerifyOTPRequest, UpdateProfileRequest } from '@/app/lib/types';

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    // Initialize auth on mount
    store.initialize();
  }, []);

  const sendOtp = useCallback(
    (payload: SendOTPRequest) => store.sendOtp(payload),
    [store.sendOtp]
  );

  const verifyOtp = useCallback(
    (payload: VerifyOTPRequest) => store.verifyOtp(payload),
    [store.verifyOtp]
  );

  const fetchProfile = useCallback(
    () => store.fetchProfile(),
    [store.fetchProfile]
  );

  const updateProfile = useCallback(
    (payload: UpdateProfileRequest) => store.updateProfile(payload),
    [store.updateProfile]
  );

  const logout = useCallback(
    () => store.logout(),
    [store.logout]
  );

  return {
    // State
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    error: store.error,

    // Actions
    sendOtp,
    verifyOtp,
    fetchProfile,
    updateProfile,
    logout,
    clearError: store.clearError,
    setToken: store.setToken,
    setUser: store.setUser,
  };
};
