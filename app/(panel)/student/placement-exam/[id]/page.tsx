'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Clock, CheckCircle } from 'lucide-react';
import {
  startPlacementExam,
  getExamQuestions,
  submitPlacementExamAnswer,
  finishPlacementExam,
} from '@/app/lib/api/student/placement-exams';
import {
  PlacementExamQuestion,
  PlacementExamAttempt,
} from '@/app/lib/types/placement-exam';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import ProgressBar from '@/app/components/ui/ProgressBar';
import QuestionCard from '@/app/components/ui/QuestionCard';
import ExamErrorBoundary from '@/app/components/ui/ExamErrorBoundary';

export default function PlacementExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const examId = resolvedParams.id;

  // State management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<PlacementExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [attempt, setAttempt] = useState<PlacementExamAttempt | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);

  // Initialize exam
  useEffect(() => {
    const initializeExam = async () => {
      try {
        setLoading(true);

        // Validate exam ID first
        if (!examId || examId.trim() === '') {
          toast.error('شناسه آزمون معتبر نیست');
          router.push('/student/placement-exam');
          return;
        }

        // Start the exam attempt
        const attemptResponse = await startPlacementExam(examId);
        setAttempt(attemptResponse.data);

        // Get exam questions
        const questionsResponse = await getExamQuestions(examId);
        setQuestions(questionsResponse.data);

        // Check if exam has questions
        if (!questionsResponse.data || questionsResponse.data.length === 0) {
          toast.error('این آزمون هنوز سوالی ندارد');
          router.push('/student/placement-exam');
          return;
        }

        setExamStarted(true);
        toast.success('آزمون با موفقیت شروع شد');
      } catch (error: any) {
        console.error('Error initializing exam:', error);

        // Handle specific error cases
        if (error.status === 404) {
          toast.error('آزمون با این شناسه یافت نشد');
        } else if (error.status === 403) {
          toast.error('شما مجاز به شرکت در این آزمون نیستید');
        } else if (error.status === 409) {
          toast.error('شما قبلاً در این آزمون شرکت کرده‌اید');
        } else {
          toast.error(error.message || 'خطا در شروع آزمون');
        }

        router.push('/student/placement-exam');
      } finally {
        setLoading(false);
      }
    };

    initializeExam();
  }, [examId, router]);

  // Timer effect
  useEffect(() => {
    if (!attempt || !examStarted) return;

    // Calculate time remaining (assuming duration is in minutes)
    const startTime = new Date(attempt.started_at).getTime();
    const duration = 60 * 60 * 1000; // 60 minutes in milliseconds (you can get this from exam data)
    const endTime = startTime + duration;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        handleFinishExam();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [attempt, examStarted]);

  // Format time remaining
  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle option selection
  const handleOptionSelect = async (optionId: number | string) => {
    if (!attempt || submitting) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      setSubmitting(true);

      // Submit answer to backend
      await submitPlacementExamAnswer({
        attempt_id: attempt.id,
        question_id: currentQuestion.id,
        option_id: optionId,
      });

      // Update local state
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));

      toast.success('پاسخ ثبت شد');
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      toast.error(error.message || 'خطا در ثبت پاسخ');
    } finally {
      setSubmitting(false);
    }
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Finish exam
  const handleFinishExam = async () => {
    if (!attempt) return;

    try {
      setSubmitting(true);
      await finishPlacementExam(attempt.id);
      toast.success('آزمون با موفقیت پایان یافت');
      router.push(`/student/placement-exam/${examId}/completed`);
    } catch (error: any) {
      console.error('Error finishing exam:', error);
      toast.error(error.message || 'خطا در پایان آزمون');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!examStarted || !attempt || questions.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            آزمون یافت نشد
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            آزمون مورد نظر یافت نشد یا قبلاً تکمیل شده است.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/student/dashboard')}
          >
            بازگشت به داشبورد
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <ExamErrorBoundary>
      <main className="space-y-6">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'داشبورد', href: '/student/dashboard' },
            {
              label: 'آزمون تعیین سطح',
              href: `/student/placement-exam/${examId}`,
              active: true,
            },
          ]}
        />

        {/* Header with timer and progress */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                آزمون تعیین سطح
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                سوال {currentQuestionIndex + 1} از {questions.length}
              </p>
            </div>

            {timeRemaining !== null && (
              <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 dark:bg-orange-900/20">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="font-mono text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={questions.length}
            />
          </div>
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedOptionId={answers[currentQuestion.id]}
          onOptionSelect={handleOptionSelect}
          disabled={submitting}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || submitting}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            سوال قبلی
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="h-4 w-4" />
            {answeredQuestions} از {questions.length} پاسخ داده شده
          </div>

          {isLastQuestion ? (
            <Button
              onClick={handleFinishExam}
              loading={submitting}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              پایان آزمون
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="flex items-center gap-2"
            >
              سوال بعدی
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </ExamErrorBoundary>
  );
}
