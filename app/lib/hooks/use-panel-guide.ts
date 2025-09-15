import { useCallback } from 'react';
import { usePanelGuideStore } from '@/app/lib/stores/panel-guide.store';

export const usePanelGuide = () => {
  const {
    panelGuides,
    currentPanelGuide,
    isLoading,
    isListLoading,
    error,
    fetchPanelGuides,
    fetchPanelGuideById,
    createPanelGuide,
    updatePanelGuide,
    deletePanelGuide,
    clearCurrentPanelGuide,
    clearError,
  } = usePanelGuideStore();

  const handleFetchPanelGuides = useCallback(() => {
    return fetchPanelGuides();
  }, [fetchPanelGuides]);

  const handleFetchPanelGuideById = useCallback(
    (id: string) => {
      return fetchPanelGuideById(id);
    },
    [fetchPanelGuideById]
  );

  const handleCreatePanelGuide = useCallback(
    (payload: any) => {
      return createPanelGuide(payload);
    },
    [createPanelGuide]
  );

  const handleUpdatePanelGuide = useCallback(
    (id: string, payload: any) => {
      return updatePanelGuide(id, payload);
    },
    [updatePanelGuide]
  );

  const handleDeletePanelGuide = useCallback(
    (id: string) => {
      return deletePanelGuide(id);
    },
    [deletePanelGuide]
  );

  const handleClearCurrentPanelGuide = useCallback(() => {
    clearCurrentPanelGuide();
  }, [clearCurrentPanelGuide]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    panelGuides,
    currentPanelGuide,
    isLoading,
    isListLoading,
    error,
    fetchPanelGuides: handleFetchPanelGuides,
    fetchPanelGuideById: handleFetchPanelGuideById,
    createPanelGuide: handleCreatePanelGuide,
    updatePanelGuide: handleUpdatePanelGuide,
    deletePanelGuide: handleDeletePanelGuide,
    clearCurrentPanelGuide: handleClearCurrentPanelGuide,
    clearError: handleClearError,
  };
};
