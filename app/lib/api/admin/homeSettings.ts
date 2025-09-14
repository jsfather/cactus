import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { Settings, GetSettingsResponse } from '@/app/lib/types/settings';

// Simple in-memory store
class HomeSettingsStore {
  private data: Settings | null = null;
  private isLoading = false;
  private loadingPromise: Promise<Settings> | null = null;

  getData(): Settings | null {
    return this.data;
  }

  setData(data: Settings): void {
    this.data = data;
  }

  clearData(): void {
    this.data = null;
  }

  isDataLoaded(): boolean {
    return this.data !== null;
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  getLoadingState(): boolean {
    return this.isLoading;
  }

  setLoadingPromise(promise: Promise<Settings> | null): void {
    this.loadingPromise = promise;
  }

  getLoadingPromise(): Promise<Settings> | null {
    return this.loadingPromise;
  }
}

// Create a singleton store instance
const store = new HomeSettingsStore();

// Helper function to fetch data from API
const fetchData = async (): Promise<Settings> => {
  const res = await apiClient.get<GetSettingsResponse>(API_ENDPOINTS.SETTINGS.GET);
  return res.data;
};

export const homeSettingsService = {
  get: async (forceRefresh = false): Promise<Settings> => {
    // Return cached data if it exists and no force refresh
    if (!forceRefresh && store.isDataLoaded()) {
      return store.getData()!;
    }

    // If already loading, return the existing promise to prevent duplicate requests
    if (store.getLoadingState() && store.getLoadingPromise()) {
      return store.getLoadingPromise()!;
    }

    // Create new request
    store.setLoading(true);
    const loadingPromise = fetchData();
    store.setLoadingPromise(loadingPromise);

    try {
      const data = await loadingPromise;
      store.setData(data);
      return data;
    } finally {
      store.setLoading(false);
      store.setLoadingPromise(null);
    }
  },

  update: async (data: Omit<Settings, 'id'>): Promise<{ message?: string; data: Settings }> => {
    const res = await apiClient.post<{ message?: string; data: Settings }>(API_ENDPOINTS.SETTINGS.UPDATE, data);
    // Update the store with the new data after successful update
    store.setData(res.data);
    return res;
  },

  // Utility methods for store management
  getCachedData: (): Settings | null => {
    return store.getData();
  },

  clearCache: (): void => {
    store.clearData();
  },

  isLoading: (): boolean => {
    return store.getLoadingState();
  },

  // Force refresh data
  refresh: async (): Promise<Settings> => {
    return homeSettingsService.get(true);
  }
};