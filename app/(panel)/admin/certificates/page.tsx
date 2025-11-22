'use client';

import { useState, useEffect } from 'react';
import Table, { Column } from '@/app/components/ui/Table';
import { toast } from 'react-hot-toast';
import { Certificate } from '@/lib/types/certificate';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useCertificate } from '@/app/lib/hooks/use-certificate';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Award, Plus, Calendar, MapPin, Building2, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Image from 'next/image';

export default function CertificatesPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Certificate | null>(null);
  const { certificateList, loading, fetchCertificateList, deleteCertificate } = useCertificate();

  useEffect(() => {
    fetchCertificateList();
  }, [fetchCertificateList]);

  // Calculate summary stats
  const totalCertificates = certificateList.length;
  const thisYearCertificates = certificateList.filter((cert) => {
    const certDate = new Date(cert.issued_at);
    const thisYear = new Date();
    return certDate.getFullYear() === thisYear.getFullYear();
  }).length;
  const uniqueOrganizations = new Set(certificateList.map((cert) => cert.organization)).size;
  const thisMonthCertificates = certificateList.filter((cert) => {
    const certDate = new Date(cert.created_at);
    const thisMonth = new Date();
    return (
      certDate.getMonth() === thisMonth.getMonth() &&
      certDate.getFullYear() === thisMonth.getFullYear()
    );
  }).length;

  const columns: Column<Certificate>[] = [
    {
      header: 'تصویر',
      accessor: 'image',
      render: (value): any => {
        return (
          <div className="relative h-12 w-16 overflow-hidden rounded">
            <Image
              src={String(value)}
              alt="گواهینامه"
              fill
              className="object-cover"
            />
          </div>
        );
      },
    },
    {
      header: 'عنوان',
      accessor: 'title',
      render: (value): string => {
        const title = String(value);
        return title.replace(/^"|"$/g, '').replace(/\\"/g, '"');
      },
    },
    {
      header: 'سازمان',
      accessor: 'organization',
      render: (value): string => {
        const org = String(value);
        return org.replace(/^"|"$/g, '').replace(/\\"/g, '"');
      },
    },
    {
      header: 'مکان',
      accessor: 'location',
      render: (value): string => {
        const loc = String(value);
        return loc.replace(/^"|"$/g, '').replace(/\\"/g, '"');
      },
    },
    {
      header: 'تاریخ صدور',
      accessor: 'issued_at',
      render: (value): string => {
        if (!value || typeof value !== 'string') return '-';
        return new Date(value).toLocaleDateString('fa-IR');
      },
    },
    {
      header: 'دسته‌بندی‌ها',
      accessor: 'categories',
      render: (value): any => {
        const categories = value as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {cat}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: 'تاریخ ایجاد',
      accessor: 'created_at',
      render: (value): any => {
        return <span className="dir-ltr inline-block">{String(value)}</span>;
      },
    },
  ];

  const handleDeleteClick = (certificate: Certificate) => {
    setItemToDelete(certificate);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteCertificate(itemToDelete.id.toString());
      toast.success('گواهینامه با موفقیت حذف شد');
      setShowDeleteModal(false);
      setItemToDelete(null);
      await fetchCertificateList();
    } catch (error) {
      toast.error('خطا در حذف گواهینامه');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setItemToDelete(null);
    }, 500);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'افتخارات و گواهینامه‌ها', href: '/admin/certificates', active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              افتخارات و گواهینامه‌ها
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              مدیریت گواهینامه‌ها و افتخارات آموزشگاه
            </p>
          </div>
          <Button onClick={() => router.push('/admin/certificates/new')}>
            <Plus className="ml-2 h-4 w-4" />
            افزودن گواهینامه جدید
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل گواهینامه‌ها
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {totalCertificates.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      امسال
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {thisYearCertificates.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      سازمان‌ها
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {uniqueOrganizations.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      این ماه
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {thisMonthCertificates.toLocaleString('fa-IR')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Table */}
        <div className="mt-6">
          <Table
            data={certificateList}
            columns={columns}
            loading={loading}
            emptyMessage="هیچ گواهینامه‌ای یافت نشد"
            onEdit={(certificate) => router.push(`/admin/certificates/${certificate.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف گواهینامه"
        description={`آیا از حذف گواهینامه "${itemToDelete?.title.replace(/^"|"$/g, '').replace(/\\"/g, '"')}" مطمئن هستید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
      />
    </main>
  );
}
