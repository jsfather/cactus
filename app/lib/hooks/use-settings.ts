import { useCallback } from 'react';
import { useSettingsStore } from '@/app/lib/stores/setting.store';
import type { Settings } from '@/app/lib/types/settings';

export const useUser = () => {
  const store = useSettingsStore();

  // Memoized actions
  const fetchSettings = useCallback(
    () => store.fetchSettings(),
    [store.fetchSettings]
  );

  const updateSettings = useCallback(
    (settingsData: Settings) => store.updateSettings(settingsData),
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