'use client';

import { useEffect, useState } from 'react';
import {
  getExams,
  Exam,
  createExam,
  deleteExam,
  updateExam,
} from '@/lib/api/panel/admin/exams';
import DataTable from '@/components/ui/DataTable';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import moment from 'jalali-moment';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const columns = [
    { key: 'title', label: 'عنوان' },
    { 
      key: 'date', 
      label: 'تاریخ',
      format: (value: string | null) => value ? moment(value).locale('fa').format('YYYY/MM/DD') : '-'
    },
    { 
      key: 'duration', 
      label: 'مدت زمان',
      format: (value: number | null) => value ? `${value} دقیقه` : '-'
    },
    { 
      key: 'term_id', 
      label: 'ترم',
      format: (value: number | null) => value ? value.toString() : '-'
    }
  ];

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await getExams();
      const data = Array.isArray(response) ? response : [];
      setExams(data);
    } catch (error) {
      toast.error('خطا در دریافت لیست امتحانات');
      console.error('Failed to fetch exams:', error);
      setExams([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreate = () => {
    setSelectedExam(null);
    setIsModalOpen(true);
  };

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteExam(Number(id));
      toast.success('امتحان با موفقیت حذف شد');
      fetchExams();
    } catch (error) {
      toast.error('خطا در حذف امتحان');
      console.error('Failed to delete exam:', error);
    }
  };

  const handleSubmit = async (formData: Partial<Exam>) => {
    try {
      if (selectedExam) {
        await updateExam(selectedExam.id, formData);
        toast.success('امتحان با موفقیت بروزرسانی شد');
      } else {
        await createExam(formData);
        toast.success('امتحان با موفقیت ایجاد شد');
      }
      setIsModalOpen(false);
      fetchExams();
    } catch (error) {
      toast.error('خطا در ذخیره امتحان');
      console.error('Failed to save exam:', error);
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" />
      <h1 className="mb-4 text-2xl font-bold">امتحانات</h1>
      <DataTable<Exam>
        columns={columns}
        data={exams}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />

      {/* Exam Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {selectedExam ? 'ویرایش امتحان' : 'ایجاد امتحان جدید'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const duration = formData.get('duration');
              const termId = formData.get('term_id');

              handleSubmit({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                date: formData.get('date') as string || null,
                duration: duration ? parseInt(duration.toString()) : null,
                term_id: termId ? parseInt(termId.toString()) : null,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">عنوان</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedExam?.title}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">توضیحات</label>
                  <textarea
                    name="description"
                    defaultValue={selectedExam?.description}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">تاریخ</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={selectedExam?.date?.slice(0, 10)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">مدت زمان (دقیقه)</label>
                    <input
                      type="number"
                      name="duration"
                      defaultValue={selectedExam?.duration || ''}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ترم</label>
                  <input
                    type="number"
                    name="term_id"
                    defaultValue={selectedExam?.term_id || ''}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {selectedExam ? 'بروزرسانی' : 'ایجاد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
