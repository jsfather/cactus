'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ArrowRight, Save, Plus, Trash2 } from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import TagInput from '@/app/components/ui/TagInput';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useCoursePage } from '@/app/lib/hooks/use-course-page';

const schema = z.object({
  term_id: z.string().min(1, 'شناسه ترم الزامی است'),
  title: z.string().min(1, 'عنوان الزامی است'),
  supplementary_description: z.string().optional(),
  intro_video_url: z.string().optional(),
  certificate_video_url: z.string().optional(),
  related_blog_tags: z.array(z.string()),
  is_published: z.boolean(),
  faqs: z.array(
    z.object({
      question: z.string().min(1, 'سوال الزامی است'),
      answer: z.string().min(1, 'پاسخ الزامی است'),
    })
  ),
  video_testimonials: z.array(
    z.object({
      student_name: z.string().min(1, 'نام دانشجو الزامی است'),
      title: z.string().optional(),
      video_url: z.string().min(1, 'لینک ویدیو الزامی است'),
      thumbnail_url: z.string().optional(),
    })
  ),
  syllabus: z.array(
    z.object({
      title: z.string().min(1, 'عنوان فصل الزامی است'),
      items: z.array(z.string()),
    })
  ),
  recommended_tools: z.array(
    z.object({
      name: z.string().min(1, 'نام ابزار الزامی است'),
      description: z.string().optional(),
      link: z.string().url('لینک معتبر وارد کنید'),
      icon: z.string().optional(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

export default function CoursePageFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const {
    currentCoursePage,
    loading,
    fetchCoursePageById,
    createCoursePage,
    updateCoursePage,
    clearError,
  } = useCoursePage();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      term_id: '',
      title: '',
      supplementary_description: '',
      intro_video_url: '',
      certificate_video_url: '',
      related_blog_tags: [],
      is_published: true,
      faqs: [],
      video_testimonials: [],
      syllabus: [],
      recommended_tools: [],
    },
  });

  const faqFields = useFieldArray({ control, name: 'faqs' });
  const testimonialFields = useFieldArray({ control, name: 'video_testimonials' });
  const syllabusFields = useFieldArray({ control, name: 'syllabus' });
  const toolFields = useFieldArray({ control, name: 'recommended_tools' });

  useEffect(() => {
    if (!isNew && resolvedParams.id) {
      fetchCoursePageById(resolvedParams.id);
    }
  }, [isNew, resolvedParams.id, fetchCoursePageById]);

  useEffect(() => {
    if (currentCoursePage && !isNew) {
      reset({
        term_id: String(currentCoursePage.term_id),
        title: currentCoursePage.title,
        supplementary_description: currentCoursePage.supplementary_description || '',
        intro_video_url: currentCoursePage.intro_video_url || '',
        certificate_video_url: currentCoursePage.certificate_video_url || '',
        related_blog_tags: currentCoursePage.related_blog_tags || [],
        is_published: currentCoursePage.is_published,
        faqs: currentCoursePage.faqs.map(({ question, answer }) => ({
          question,
          answer,
        })),
        video_testimonials: currentCoursePage.video_testimonials.map((t) => ({
          student_name: t.student_name,
          title: t.title || '',
          video_url: t.video_url,
          thumbnail_url: t.thumbnail_url || '',
        })),
        syllabus: currentCoursePage.syllabus.map((s) => ({
          title: s.title,
          items: s.items,
        })),
        recommended_tools: currentCoursePage.recommended_tools.map((tool) => ({
          name: tool.name,
          description: tool.description || '',
          link: tool.link,
          icon: tool.icon || '',
        })),
      });
    }
  }, [currentCoursePage, isNew, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      clearError();
      const payload = {
        ...data,
        term_id: data.term_id,
      };

      if (isNew) {
        await createCoursePage(payload);
        toast.success('صفحه دوره با موفقیت ایجاد شد');
      } else {
        await updateCoursePage(resolvedParams.id, payload);
        toast.success('صفحه دوره با موفقیت به‌روزرسانی شد');
      }

      router.push('/admin/course-pages');
    } catch (error: any) {
      toast.error(
        error?.message ||
          'خطا در ذخیره. API بک‌اند هنوز پیاده‌سازی نشده — به محمد اطلاع دهید.'
      );
    }
  };

  if (loading && !isNew) return <LoadingSpinner />;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'داشبورد', href: '/admin/dashboard' },
          { label: 'صفحات دوره', href: '/admin/course-pages' },
          {
            label: isNew ? 'صفحه جدید' : 'ویرایش صفحه',
            href: `/admin/course-pages/${resolvedParams.id}`,
          },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">
          {isNew ? 'ایجاد صفحه دوره' : 'ویرایش صفحه دوره'}
        </h1>
        <Button variant="secondary" onClick={() => router.back()}>
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-bold dark:text-white">اطلاعات پایه</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="شناسه ترم (term_id)"
              {...register('term_id')}
              error={errors.term_id?.message}
              placeholder="مثلاً 1"
            />
            <Input
              label="عنوان صفحه"
              {...register('title')}
              error={errors.title?.message}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="توضیحات تکمیلی"
              {...register('supplementary_description')}
              rows={4}
              placeholder="توضیحات تکمیلی که در صفحه عمومی دوره نمایش داده می‌شود"
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="is_published" {...register('is_published')} />
            <label htmlFor="is_published" className="text-sm dark:text-gray-300">
              منتشر شده
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-bold dark:text-white">ویدیوها</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="لینک ویدیو معرفی (YouTube embed)"
              {...register('intro_video_url')}
              placeholder="https://www.youtube.com/embed/..."
            />
            <Input
              label="لینک ویدیو مدرک"
              {...register('certificate_video_url')}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold dark:text-white">سوالات متداول (FAQ)</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => faqFields.append({ question: '', answer: '' })}
            >
              <Plus className="h-4 w-4" />
              افزودن سوال
            </Button>
          </div>
          {faqFields.fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700"
            >
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">سوال {index + 1}</span>
                <button
                  type="button"
                  onClick={() => faqFields.remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Input
                label="سوال"
                {...register(`faqs.${index}.question`)}
                error={errors.faqs?.[index]?.question?.message}
              />
              <div className="mt-2">
                <Textarea
                  label="پاسخ"
                  {...register(`faqs.${index}.answer`)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold dark:text-white">
              نظرات ویدیویی دانشجویان
            </h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                testimonialFields.append({
                  student_name: '',
                  title: '',
                  video_url: '',
                  thumbnail_url: '',
                })
              }
            >
              <Plus className="h-4 w-4" />
              افزودن نظر
            </Button>
          </div>
          {testimonialFields.fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700"
            >
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">نظر {index + 1}</span>
                <button
                  type="button"
                  onClick={() => testimonialFields.remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  label="نام دانشجو"
                  {...register(`video_testimonials.${index}.student_name`)}
                />
                <Input
                  label="عنوان"
                  {...register(`video_testimonials.${index}.title`)}
                />
                <Input
                  label="لینک ویدیو"
                  {...register(`video_testimonials.${index}.video_url`)}
                />
                <Input
                  label="تصویر بندانگشتی"
                  {...register(`video_testimonials.${index}.thumbnail_url`)}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold dark:text-white">سرفصل‌های دوره</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => syllabusFields.append({ title: '', items: [] })}
            >
              <Plus className="h-4 w-4" />
              افزودن فصل
            </Button>
          </div>
          {syllabusFields.fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700"
            >
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">فصل {index + 1}</span>
                <button
                  type="button"
                  onClick={() => syllabusFields.remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Input
                label="عنوان فصل"
                {...register(`syllabus.${index}.title`)}
              />
              <div className="mt-2">
                <Controller
                  name={`syllabus.${index}.items`}
                  control={control}
                  render={({ field: itemsField }) => (
                    <TagInput
                      label="موارد سرفصل (هر مورد را با Enter اضافه کنید)"
                      value={itemsField.value || []}
                      onChange={itemsField.onChange}
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold dark:text-white">ابزارهای پیشنهادی</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                toolFields.append({
                  name: '',
                  description: '',
                  link: '',
                  icon: '',
                })
              }
            >
              <Plus className="h-4 w-4" />
              افزودن ابزار
            </Button>
          </div>
          {toolFields.fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-4 rounded-lg border border-gray-100 p-4 dark:border-gray-700"
            >
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">ابزار {index + 1}</span>
                <button
                  type="button"
                  onClick={() => toolFields.remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  label="نام ابزار"
                  {...register(`recommended_tools.${index}.name`)}
                />
                <Input
                  label="آیکون (ایموجی)"
                  {...register(`recommended_tools.${index}.icon`)}
                  placeholder="🔧"
                />
                <Input
                  label="لینک"
                  {...register(`recommended_tools.${index}.link`)}
                  error={errors.recommended_tools?.[index]?.link?.message}
                />
                <Input
                  label="توضیحات"
                  {...register(`recommended_tools.${index}.description`)}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-bold dark:text-white">مقالات مرتبط</h2>
          <Controller
            name="related_blog_tags"
            control={control}
            render={({ field }) => (
              <TagInput
                label="برچسب‌های وبلاگ (مقالات با این برچسب‌ها نمایش داده می‌شوند)"
                value={field.value || []}
                onChange={field.onChange}
              />
            )}
          />
        </section>

        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            <Save className="h-4 w-4" />
            ذخیره
          </Button>
        </div>
      </form>
    </main>
  );
}
