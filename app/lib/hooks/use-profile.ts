import { useCallback } from 'react';
import { useProfileStore } from '@/app/lib/stores/profile.store';
import { UpdateProfileRequest } from '@/app/lib/types';

export const useProfile = () => {
  const store = useProfileStore();

  const fetchProfile = useCallback(() => store.fetchProfile(), [store.fetchProfile]);

  const updateProfile = useCallback(
    (payload: UpdateProfileRequest) => store.updateProfile(payload),
    [store.updateProfile]
  );

  const setProfile = useCallback(
    (profile: any) => store.setProfile(profile),
    [store.setProfile]
  );

  const clearError = useCallback(() => store.clearError(), [store.clearError]);

  return {
    // State
    profile: store.profile,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchProfile,
    updateProfile,
    setProfile,
    clearError,
  };
};