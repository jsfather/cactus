import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { certificateService } from '@/app/lib/services/certificate.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  Certificate,
  CertificateCreateRequest,
  CertificateUpdateRequest,
  CertificateResponse,
} from '@/lib/types/certificate';

interface CertificateState {
  // State
  certificateList: Certificate[];
  currentCertificate: Certificate | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchCertificateList: () => Promise<void>;
  createCertificate: (payload: CertificateCreateRequest) => Promise<CertificateResponse>;
  updateCertificate: (id: string, payload: CertificateUpdateRequest) => Promise<CertificateResponse>;
  deleteCertificate: (id: string) => Promise<void>;
  fetchCertificateById: (id: string) => Promise<void>;
}

export const useCertificateStore = create<CertificateState>()(
  devtools((set, get) => ({
    // Initial state
    certificateList: [],
    currentCertificate: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchCertificateList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await certificateService.getList();
        set({
          certificateList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createCertificate: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newCertificate = await certificateService.create(payload);
        set((state) => ({
          certificateList: [newCertificate.data, ...state.certificateList],
          loading: false,
        }));
        return newCertificate;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateCertificate: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedCertificate = await certificateService.update(id, payload);
        set((state) => ({
          certificateList: state.certificateList.map((cert) =>
            cert.id === updatedCertificate.data.id ? updatedCertificate.data : cert
          ),
          currentCertificate: updatedCertificate.data,
          loading: false,
        }));
        return updatedCertificate;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteCertificate: async (id) => {
      try {
        set({ loading: true, error: null });
        await certificateService.delete(id);
        set((state) => ({
          certificateList: state.certificateList.filter((cert) => cert.id !== parseInt(id)),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchCertificateById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const certificate = await certificateService.getById(id);
        set({ currentCertificate: certificate.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
