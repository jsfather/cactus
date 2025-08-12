import { useCallback } from 'react';
import { useSettingsStore } from '@/app/lib/stores/settings.store';
import type { Settings } from '@/app/lib/types/settings';

export const useSettings = () => {
  const store = useSettingsStore();

  // Memoized actions
  const fetchSettings = useCallback(
    () => store.fetchSettings(),
    [store.fetchSettings]
  );

  const updateSettings = useCallback(
    (payload: Settings) => store.updateSettings(payload),
    [store.updateSettings]
  );

  return {
    // State
    settings: store.settings,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchSettings,
    updateSettings,
    clearError: store.clearError,
  };
};