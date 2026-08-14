'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { useOfflineSession } from '@/app/lib/hooks/use-offline-session';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import type { OfflineSession } from '@/app/lib/types/offline-session';

interface OfflineSessionFormProps {
  session?: OfflineSession;
}

export default function OfflineSessionForm({
  session,
}: OfflineSessionFormProps) {
  const router = useRouter();
  const { terms, fetchTerms } = useTeacherTerm();
  const { createOfflineSession, updateOfflineSession, loading } =
    useOfflineSession();
  const [form, setForm] = useState({
    title: session?.title || '',
    description: session?.description || '',
    video_url: session?.video_url || '',
    term_id: session?.term_id?.toString() || '',
    term_teacher_id: session?.term_teacher_id?.toString() || '',
  });

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  const selectedTerm = useMemo(
    () => terms.find((term) => term.id.toString() === form.term_id),
    [form.term_id, terms]
  );

  const handleTermChange = (termId: string) => {
    const term = terms.find((item) => item.id.toString() === termId);
    setForm((current) => ({
      ...current,
      term_id: termId,
      term_teacher_id: term?.teachers[0]?.id?.toString() || '',
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.video_url.trim()) {
      toast.error('عنوان و آدرس ویدئو الزامی است');
      return;
    }

    if (!session && (!form.term_id || !form.term_teacher_id)) {
      toast.error('ترم و مدرس ترم را انتخاب کنید');
      return;
    }

    try {
      if (session) {
        await updateOfflineSession(session.id.toString(), {
          title: form.title.trim(),
          description: form.description.trim(),
          video_url: form.video_url.trim(),
        });
        toast.success('کلاس آفلاین با موفقیت ویرایش شد');
      } else {
        await createOfflineSession({
          title: form.title.trim(),
          description: form.description.trim(),
          video_url: form.video_url.trim(),
          term_id: form.term_id,
          term_teacher_id: form.term_teacher_id,
        });
        toast.success('کلاس آفلاین با موفقیت ایجاد شد');
      }

      router.push('/teacher/offline-sessions');
    } catch {
      toast.error('ذخیره کلاس آفلاین انجام نشد');
    }
  };

  return (
    <Card className="mt-8 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {!session && (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                ترم <span className="text-red-500">*</span>
              </label>
              <select
                value={form.term_id}
                onChange={(event) => handleTermChange(event.target.value)}
                className="focus:border-primary-500 focus:ring-primary-200 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                required
              >
                <option value="">انتخاب ترم</option>
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                مدرس ترم <span className="text-red-500">*</span>
              </label>
              <select
                value={form.term_teacher_id}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    term_teacher_id: event.target.value,
                  }))
                }
                className="focus:border-primary-500 focus:ring-primary-200 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:ring-2 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                disabled={!selectedTerm}
                required
              >
                <option value="">انتخاب مدرس ترم</option>
                {selectedTerm?.teachers.map((teacher, index) => (
                  <option key={teacher.id} value={teacher.id}>
                    مدرس {index + 1} (شناسه {teacher.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <Input
          id="title"
          label="عنوان کلاس"
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({ ...current, title: event.target.value }))
          }
          required
        />

        <Textarea
          id="description"
          label="توضیحات"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />

        <Input
          id="video_url"
          type="url"
          dir="ltr"
          label="آدرس ویدئو"
          placeholder="https://..."
          value={form.video_url}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              video_url: event.target.value,
            }))
          }
          required
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/teacher/offline-sessions')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={loading}>
            {session ? 'ذخیره تغییرات' : 'ایجاد کلاس آفلاین'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
