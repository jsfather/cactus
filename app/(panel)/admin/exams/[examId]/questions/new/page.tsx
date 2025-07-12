'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createExamQuestion, updateExamQuestion, getExamQuestion } from '@/app/lib/api/admin/examQuestions';
import { ExamQuestion, ExamQuestionOption } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';

interface QuestionFormData {
  text: string;
  file: string | null;
  options: ExamQuestionOption[];
}

export default function ExamQuestionFormPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;
  const questionId = params.questionId as string;
  const isEditing = Boolean(questionId);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<QuestionFormData>({
    text: '',
    file: null,
    options: [
      { id: 1, text: '', is_correct: false },
      { id: 2, text: '', is_correct: false },
      { id: 3, text: '', is_correct: false },
      { id: 4, text: '', is_correct: false },
    ]
  });

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const question = await getExamQuestion(examId, questionId);
      setFormData({
        text: question.text,
        file: question.file,
        options: question.options
      });
    } catch (error) {
      toast.error('خطا در دریافت اطلاعات سوال');
      router.push(`/admin/exams/${examId}/questions`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.text.trim()) {
      toast.error('متن سوال الزامی است');
      return;
    }

    const hasEmptyOptions = formData.options.some(option => !option.text.trim());
    if (hasEmptyOptions) {
      toast.error('تمام گزینه‌ها باید تکمیل شوند');
      return;
    }

    const hasCorrectAnswer = formData.options.some(option => option.is_correct);
    if (!hasCorrectAnswer) {
      toast.error('حداقل یک گزینه صحیح باید انتخاب شود');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing) {
        await updateExamQuestion(examId, questionId, formData);
        toast.success('سوال با موفقیت بروزرسانی شد');
      } else {
        await createExamQuestion(examId, formData);
        toast.success('سوال با موفقیت ایجاد شد');
      }
      
      router.push(`/admin/exams/${examId}/questions`);
    } catch (error) {
      toast.error(isEditing ? 'خطا در بروزرسانی سوال' : 'خطا در ایجاد سوال');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (value: string) => {
    setFormData({ ...formData, text: value });
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text };
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], is_correct: isCorrect };
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    const newOption: ExamQuestionOption = {
      id: Date.now(),
      text: '',
      is_correct: false
    };
    setFormData({ 
      ...formData, 
      options: [...formData.options, newOption] 
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) {
      toast.error('حداقل دو گزینه باید وجود داشته باشد');
      return;
    }
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  useEffect(() => {
    if (isEditing && examId && questionId) {
      loadQuestion();
    }
  }, [isEditing, examId, questionId]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'ویرایش سوال' : 'افزودن سوال جدید'}
        </h1>
        <Button 
          variant="secondary" 
          onClick={() => router.push(`/admin/exams/${examId}/questions`)}
        >
          بازگشت
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            متن سوال *
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="متن سوال را وارد کنید..."
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              گزینه‌ها *
            </label>
            <Button type="button" onClick={addOption} size="sm">
              افزودن گزینه
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={option.id || index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`گزینه ${index + 1}`}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={option.is_correct}
                    onChange={(e) => handleCorrectChange(index, e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-600">صحیح</span>
                </div>
                {formData.options.length > 2 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>
            {isEditing ? 'بروزرسانی' : 'ایجاد'} سوال
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => router.push(`/admin/exams/${examId}/questions`)}
          >
            لغو
          </Button>
        </div>
      </form>
    </div>
  );
}
