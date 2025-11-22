import { useCallback } from 'react';
import { useCertificateStore } from '@/app/lib/stores/certificate.store';
import { CertificateCreateRequest, CertificateUpdateRequest } from '@/lib/types/certificate';

export const useCertificate = () => {
  const store = useCertificateStore();

  const fetchCertificateList = useCallback(
    () => store.fetchCertificateList(),
    [store.fetchCertificateList]
  );

  const createCertificate = useCallback(
    (payload: CertificateCreateRequest) => store.createCertificate(payload),
    [store.createCertificate]
  );

  const updateCertificate = useCallback(
    (id: string, payload: CertificateUpdateRequest) => store.updateCertificate(id, payload),
    [store.updateCertificate]
  );

  const deleteCertificate = useCallback(
    (id: string) => store.deleteCertificate(id),
    [store.deleteCertificate]
  );

  const fetchCertificateById = useCallback(
    (id: string) => store.fetchCertificateById(id),
    [store.fetchCertificateById]
  );

  return {
    // State
    certificateList: store.certificateList,
    currentCertificate: store.currentCertificate,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchCertificateList,
    updateCertificate,
    createCertificate,
    deleteCertificate,
    fetchCertificateById,
    clearError: store.clearError,
  };
};
