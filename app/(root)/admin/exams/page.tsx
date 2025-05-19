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
    { key: 'date', label: 'تاریخ' },
    { key: 'duration', label: 'مدت زمان' },
    {
      key: 'created_at', 
      label: 'تاریخ ایجاد',
      format: (value: string) => moment(value).locale('fa').format('YYYY/MM/DD HH:mm')
    }
  ];

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const data = await getExams();
      setExams(data);
    } catch (error) {
      toast.error('خطا در دریافت لیست امتحانات');
      console.error('Failed to fetch exams:', error);
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

  const handleEdit = (blog: Exam) => {
    setSelectedExam(blog);
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

      {/* Blog Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {selectedExam ? 'ویرایش امتحان' : 'ایجاد امتحان جدید'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSubmit({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                date: formData.get('date') as string,
                duration: formData.get('duration') as number,
                term_id: formData.get('term_id') as number,
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
                  <label className="block text-sm font-medium text-gray-700">عنوان کوتاه</label>
                  <input
                    type="text"
                    name="little_description"
                    defaultValue={selectedExam?.little_description}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">عنوان متا</label>
                  <input
                    type="text"
                    name="meta_title"
                    defaultValue={selectedExam?.meta_title}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">توضیحات متا</label>
                  <textarea
                    name="meta_description"
                    defaultValue={selectedExam?.meta_description}
                    rows={2}
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
