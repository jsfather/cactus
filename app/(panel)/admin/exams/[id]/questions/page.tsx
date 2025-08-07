'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import {
  getExamQuestions,
  createExamQuestion,
  deleteExamQuestion,
} from '@/app/lib/api/admin/questions';
import { PlacementExamQuestion } from '@/app/lib/types/placement-exam';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import FileUpload from '@/app/components/ui/FileUpload';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';

const questionSchema = z.object({
  text: z.string().min(1, 'متن سوال الزامی است'),
  options: z
    .array(
      z.object({
        text: z.string().min(1, 'متن گزینه الزامی است'),
        is_correct: z.number(),
      })
    )
    .min(2, 'حداقل دو گزینه الزامی است'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function ExamQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const examId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<PlacementExamQuestion[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    setGlobalError,
    reset,
    watch,
    setValue,
  } = useFormWithBackendErrors<QuestionFormData>(questionSchema);

  const watchedOptions = watch('options');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await getExamQuestions(examId);
        setQuestions(response.data);
      } catch (error: any) {
        console.error('Error fetching questions:', error);
        toast.error(error.message || 'خطا در دریافت سوالات');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  const handleCorrectAnswerChange = (optionIndex: number) => {
    const newOptions = watchedOptions.map((option, index) => ({
      ...option,
      is_correct: index === optionIndex ? 1 : 0,
    }));
    setValue('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...watchedOptions, { text: '', is_correct: 0 }];
    setValue('options', newOptions);
  };

  const removeOption = (index: number) => {
    if (watchedOptions.length > 2) {
      const newOptions = watchedOptions.filter((_, i) => i !== index);
      setValue('options', newOptions);
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    console.log('Form data before FormData creation:', data);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('text', data.text);

    // Add options as form fields
    data.options.forEach((option, index) => {
      console.log(`Adding option ${index}:`, option);
      formData.append(`options[${index}][text]`, option.text);
      formData.append(
        `options[${index}][is_correct]`,
        option.is_correct.toString()
      );
    });

    // Add file if selected
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    // Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    await createExamQuestion(examId, formData);

    toast.success('سوال با موفقیت اضافه شد');
    setShowAddForm(false);
    setSelectedFile(null);
    reset({
      text: '',
      options: [
        { text: '', is_correct: 0 },
        { text: '', is_correct: 0 },
        { text: '', is_correct: 0 },
        { text: '', is_correct: 0 },
      ],
    });

    // Refresh questions list
    const response = await getExamQuestions(examId);
    setQuestions(response.data);
  };

  const handleError = (error: ApiError) => {
    console.log('Question form submission error:', error);

    // Show toast error message
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error('خطا در اضافه کردن سوال');
    }
  };

  const handleDeleteQuestion = async (questionId: number | string) => {
    if (!confirm('آیا از حذف این سوال اطمینان دارید؟')) {
      return;
    }

    try {
      await deleteExamQuestion(examId, questionId);
      toast.success('سوال با موفقیت حذف شد');

      // Refresh questions list
      const response = await getExamQuestions(examId);
      setQuestions(response.data);
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast.error(error.message || 'خطا در حذف سوال');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'آزمون‌ها', href: '/admin/exams' },
          { label: `آزمون ${examId}`, href: `/admin/exams/${examId}` },
          {
            label: 'سوالات',
            href: `/admin/exams/${examId}/questions`,
            active: true,
          },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            سوالات آزمون
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            مدیریت سوالات آزمون شماره {examId}
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true);
            // Reset form when showing add form
            reset({
              text: '',
              options: [
                { text: '', is_correct: 0 },
                { text: '', is_correct: 0 },
                { text: '', is_correct: 0 },
                { text: '', is_correct: 0 },
              ],
            });
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          افزودن سوال
        </Button>
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              افزودن سوال جدید
            </h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(
              submitWithErrorHandling(onSubmit, handleError)
            )}
            className="space-y-6"
          >
            {globalError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-700">
                {globalError}
              </div>
            )}
            <Textarea
              id="text"
              label="متن سوال"
              placeholder="متن سوال را وارد کنید"
              required
              error={errors.text?.message}
              {...register('text')}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                تصویر سوال (اختیاری)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedFile(file || null);
                }}
                className="file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/20 dark:file:text-primary-400 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold dark:text-gray-400"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  فایل انتخاب شده: {selectedFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
                گزینه‌های پاسخ
              </label>
              <div className="space-y-3">
                {watchedOptions.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                  >
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.is_correct === 1}
                      onChange={() => handleCorrectAnswerChange(index)}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <div className="flex-1">
                      <Input
                        placeholder={`گزینه ${index + 1}`}
                        error={errors.options?.[index]?.text?.message}
                        {...register(`options.${index}.text`)}
                      />
                    </div>
                    {watchedOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {watchedOptions.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 mt-3 flex items-center gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  افزودن گزینه
                </button>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                انصراف
              </Button>
              <Button type="submit" loading={isSubmitting}>
                ذخیره سوال
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    سوال {index + 1}
                  </h3>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-gray-900 dark:text-gray-100">
                  {question.text}
                </p>
              </div>

              {question.file && (
                <div className="mb-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${question.file}`}
                    alt={`تصویر سوال ${index + 1}`}
                    className="h-32 w-auto rounded-lg border border-gray-200 object-contain dark:border-gray-600"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  گزینه‌های پاسخ:
                </h4>
                {question.options.map((option, optionIndex) => (
                  <div
                    key={option.id}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      option.is_correct
                        ? 'border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : 'border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        option.is_correct
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {['الف', 'ب', 'ج', 'د', 'ه', 'و'][optionIndex]}
                    </div>
                    <span className="text-gray-900 dark:text-gray-100">
                      {option.text}
                    </span>
                    {option.is_correct === 1 && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        (پاسخ صحیح)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              هیچ سوالی تعریف نشده
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              برای این آزمون هنوز سوالی اضافه نشده است.
            </p>
            <Button
              onClick={() => {
                setShowAddForm(true);
                // Reset form when showing add form
                reset({
                  text: '',
                  options: [
                    { text: '', is_correct: 0 },
                    { text: '', is_correct: 0 },
                    { text: '', is_correct: 0 },
                    { text: '', is_correct: 0 },
                  ],
                });
              }}
              className="mt-4 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              افزودن اولین سوال
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
