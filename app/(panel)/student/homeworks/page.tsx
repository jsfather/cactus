'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useHomework } from '@/app/lib/hooks/use-homework';
import { useStudentTerm } from '@/app/lib/hooks/use-student-term';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import Select from '@/app/components/ui/Select';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  FileText,
  Upload,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';
import { Homework } from '@/app/lib/types/homework';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import FileUpload from '@/app/components/ui/FileUpload';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Answer submission form schema
const answerSchema = z.object({
  description: z.string().min(10, 'توضیحات باید حداقل 10 کاراکتر باشد'),
  file: z.any().optional(),
});

type AnswerFormData = z.infer<typeof answerSchema>;

// Message form schema
const messageSchema = z.object({
  message: z.string().min(1, 'پیام نمی‌تواند خالی باشد'),
});

type MessageFormData = z.infer<typeof messageSchema>;

export default function StudentHomeworksPage() {
  const router = useRouter();
  const {
    homeworkList,
    loading,
    error,
    submitting,
    fetchHomeworksByTerm,
    submitAnswer,
    sendMessage,
    replyMessage,
    clearError,
  } = useHomework();

  const { termList, loading: termsLoading, getTermList } = useStudentTerm();

  const [selectedTermId, setSelectedTermId] = useState<string>('');
  const [expandedHomework, setExpandedHomework] = useState<number | null>(null);
  const [showAnswerForm, setShowAnswerForm] = useState<number | null>(null);
  const [showMessageForm, setShowMessageForm] = useState<number | null>(null);
  const [expandedConversations, setExpandedConversations] = useState<
    Set<number>
  >(new Set());

  // Answer form
  const {
    register: registerAnswer,
    handleSubmit: handleAnswerSubmit,
    formState: { errors: answerErrors },
    reset: resetAnswerForm,
    setValue: setAnswerValue,
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
  });

  // Message form
  const {
    register: registerMessage,
    handleSubmit: handleMessageSubmit,
    formState: { errors: messageErrors },
    reset: resetMessageForm,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  useEffect(() => {
    getTermList();
  }, [getTermList]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    // Auto-select first term if only one exists
    if (termList.length === 1 && !selectedTermId) {
      const firstTermId = termList[0].term.id.toString();
      setSelectedTermId(firstTermId);
      fetchHomeworksByTerm(firstTermId);
    }
  }, [termList, selectedTermId, fetchHomeworksByTerm]);

  const handleTermChange = (termId: string) => {
    setSelectedTermId(termId);
    if (termId) {
      fetchHomeworksByTerm(termId);
      setExpandedHomework(null);
      setShowAnswerForm(null);
      setShowMessageForm(null);
      setExpandedConversations(new Set());
    }
  };

  const toggleHomework = (homeworkId: number) => {
    setExpandedHomework(expandedHomework === homeworkId ? null : homeworkId);
  };

  const toggleConversation = (conversationId: number) => {
    const newSet = new Set(expandedConversations);
    if (newSet.has(conversationId)) {
      newSet.delete(conversationId);
    } else {
      newSet.add(conversationId);
    }
    setExpandedConversations(newSet);
  };

  const onSubmitAnswer = async (homeworkId: number, data: AnswerFormData) => {
    try {
      await submitAnswer({
        homework_id: homeworkId,
        description: data.description,
        file: data.file,
      });
      toast.success('پاسخ با موفقیت ارسال شد');
      resetAnswerForm();
      setShowAnswerForm(null);
      // Refresh homeworks
      if (selectedTermId) {
        fetchHomeworksByTerm(selectedTermId);
      }
    } catch (error) {
      toast.error('خطا در ارسال پاسخ');
    }
  };

  const onSendMessage = async (homeworkId: number, data: MessageFormData) => {
    try {
      await sendMessage({
        homework_id: homeworkId,
        message: data.message,
      });
      toast.success('پیام با موفقیت ارسال شد');
      resetMessageForm();
      setShowMessageForm(null);
      // Refresh homeworks
      if (selectedTermId) {
        fetchHomeworksByTerm(selectedTermId);
      }
    } catch (error) {
      toast.error('خطا در ارسال پیام');
    }
  };

  const onReplyMessage = async (
    conversationId: number,
    data: MessageFormData
  ) => {
    try {
      await replyMessage({
        conversation_id: conversationId,
        message: data.message,
      });
      toast.success('پاسخ با موفقیت ارسال شد');
      resetMessageForm();
      // Refresh homeworks
      if (selectedTermId) {
        fetchHomeworksByTerm(selectedTermId);
      }
    } catch (error) {
      toast.error('خطا در ارسال پاسخ');
    }
  };

  const getTermOptions = () => {
    return termList.map((term) => ({
      value: term.term.id.toString(),
      label: `${term.term.title} - ${term.term.level.label}`,
    }));
  };

  if (termsLoading && termList.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'تکالیف', href: '/student/homeworks', active: true },
        ]}
      />

      <div className="mt-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            تکالیف من
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            مشاهده و پاسخ به تکالیف ترم‌های آموزشی
          </p>
        </div>

        {/* Term Selector */}
        <Card className="p-6">
          <div className="max-w-md">
            <Select
              id="term-select"
              label="انتخاب ترم"
              placeholder="یک ترم را انتخاب کنید"
              value={selectedTermId}
              onChange={(e) => handleTermChange(e.target.value)}
              options={getTermOptions()}
              required
            />
          </div>
        </Card>

        {/* Homeworks List */}
        {selectedTermId && (
          <>
            {loading && homeworkList.length === 0 ? (
              <Card className="p-12">
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              </Card>
            ) : homeworkList.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    تکلیفی یافت نشد
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    برای این ترم هنوز تکلیفی ثبت نشده است
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {homeworkList.map((homework) => (
                  <Card key={homework.id} className="overflow-hidden">
                    {/* Homework Header */}
                    <div
                      className="flex cursor-pointer items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => toggleHomework(homework.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              تکلیف جلسه {homework.schedule.session_date}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                مدرس: {homework.teacher.first_name}{' '}
                                {homework.teacher.last_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {homework.schedule.start_time} -{' '}
                                {homework.schedule.end_time}
                              </span>
                              <span className="flex items-center gap-1">
                                {homework.answers.length > 0 ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-green-600">
                                      پاسخ داده شده
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                    <span className="text-orange-600">
                                      در انتظار پاسخ
                                    </span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mr-4">
                        {expandedHomework === homework.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Homework Details */}
                    {expandedHomework === homework.id && (
                      <div className="border-t border-gray-200 p-6 dark:border-gray-700">
                        {/* Description */}
                        <div className="mb-6">
                          <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                            توضیحات تکلیف:
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {homework.description}
                          </p>
                          {homework.file_url && (
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${homework.file_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                              <FileText className="h-4 w-4" />
                              دانلود فایل پیوست
                            </a>
                          )}
                        </div>

                        {/* Answers Section */}
                        <div className="mb-6">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              پاسخ‌های شما ({homework.answers.length})
                            </h4>
                            <Button
                              onClick={() =>
                                setShowAnswerForm(
                                  showAnswerForm === homework.id
                                    ? null
                                    : homework.id
                                )
                              }
                              variant="white"
                            >
                              <Upload className="ml-2 h-4 w-4" />
                              ارسال پاسخ جدید
                            </Button>
                          </div>

                          {/* Answer Form */}
                          {showAnswerForm === homework.id && (
                            <form
                              onSubmit={handleAnswerSubmit((data) =>
                                onSubmitAnswer(homework.id, data)
                              )}
                              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                            >
                              <div className="space-y-4">
                                <Textarea
                                  id={`answer-desc-${homework.id}`}
                                  label="توضیحات پاسخ"
                                  rows={4}
                                  {...registerAnswer('description')}
                                  error={answerErrors.description?.message}
                                  required
                                />
                                <FileUpload
                                  id={`answer-file-${homework.id}`}
                                  label="فایل پاسخ (اختیاری)"
                                  accept="image/*,.pdf,.doc,.docx"
                                  onChange={(file) =>
                                    setAnswerValue('file', file)
                                  }
                                />
                                <div className="flex gap-2">
                                  <Button type="submit" disabled={submitting}>
                                    {submitting
                                      ? 'در حال ارسال...'
                                      : 'ارسال پاسخ'}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="white"
                                    onClick={() => {
                                      setShowAnswerForm(null);
                                      resetAnswerForm();
                                    }}
                                  >
                                    انصراف
                                  </Button>
                                </div>
                              </div>
                            </form>
                          )}

                          {/* Answers List */}
                          {homework.answers.length > 0 ? (
                            <div className="space-y-3">
                              {homework.answers.map((answer) => (
                                <div
                                  key={answer.id}
                                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                                >
                                  <p className="text-gray-700 dark:text-gray-300">
                                    {answer.description}
                                  </p>
                                  {answer.file_url && (
                                    <a
                                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${answer.file_url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                    >
                                      <FileText className="h-4 w-4" />
                                      دانلود فایل
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              هنوز پاسخی ارسال نکرده‌اید
                            </p>
                          )}
                        </div>

                        {/* Conversations Section */}
                        <div>
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              گفتگوها ({homework.conversations.length})
                            </h4>
                            <Button
                              onClick={() =>
                                setShowMessageForm(
                                  showMessageForm === homework.id
                                    ? null
                                    : homework.id
                                )
                              }
                              variant="white"
                            >
                              <MessageCircle className="ml-2 h-4 w-4" />
                              شروع گفتگوی جدید
                            </Button>
                          </div>

                          {/* Message Form */}
                          {showMessageForm === homework.id && (
                            <form
                              onSubmit={handleMessageSubmit((data) =>
                                onSendMessage(homework.id, data)
                              )}
                              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                            >
                              <div className="space-y-4">
                                <Textarea
                                  id={`message-${homework.id}`}
                                  label="پیام شما"
                                  rows={3}
                                  {...registerMessage('message')}
                                  error={messageErrors.message?.message}
                                  required
                                />
                                <div className="flex gap-2">
                                  <Button type="submit" disabled={submitting}>
                                    <Send className="ml-2 h-4 w-4" />
                                    {submitting
                                      ? 'در حال ارسال...'
                                      : 'ارسال پیام'}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="white"
                                    onClick={() => {
                                      setShowMessageForm(null);
                                      resetMessageForm();
                                    }}
                                  >
                                    انصراف
                                  </Button>
                                </div>
                              </div>
                            </form>
                          )}

                          {/* Conversations List */}
                          {homework.conversations.length > 0 ? (
                            <div className="space-y-3">
                              {homework.conversations.map((conversation) => (
                                <div
                                  key={conversation.id}
                                  className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                                >
                                  <div
                                    className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() =>
                                      toggleConversation(conversation.id)
                                    }
                                  >
                                    <div className="flex items-center gap-2">
                                      <MessageCircle className="h-5 w-5 text-blue-600" />
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        گفتگو #{conversation.id}
                                      </span>
                                      {conversation.messages && (
                                        <span className="text-sm text-gray-500">
                                          ({conversation.messages.length} پیام)
                                        </span>
                                      )}
                                    </div>
                                    {expandedConversations.has(
                                      conversation.id
                                    ) ? (
                                      <ChevronUp className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>

                                  {/* Conversation Messages */}
                                  {expandedConversations.has(conversation.id) &&
                                    conversation.messages && (
                                      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                                        <div className="mb-4 space-y-3">
                                          {conversation.messages.map((msg) => (
                                            <div
                                              key={msg.id}
                                              className={`rounded-lg p-3 ${
                                                msg.sender_type === 'student'
                                                  ? 'bg-blue-50 dark:bg-blue-900/20'
                                                  : 'bg-gray-100 dark:bg-gray-800'
                                              }`}
                                            >
                                              <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>
                                                  {msg.sender_type === 'student'
                                                    ? 'شما'
                                                    : 'مدرس'}
                                                </span>
                                                <span>{msg.created_at}</span>
                                              </div>
                                              <p className="text-gray-700 dark:text-gray-300">
                                                {msg.message}
                                              </p>
                                            </div>
                                          ))}
                                        </div>

                                        {/* Reply Form */}
                                        <form
                                          onSubmit={handleMessageSubmit(
                                            (data) =>
                                              onReplyMessage(
                                                conversation.id,
                                                data
                                              )
                                          )}
                                          className="space-y-3"
                                        >
                                          <Textarea
                                            id={`reply-${conversation.id}`}
                                            placeholder="پاسخ خود را بنویسید..."
                                            rows={2}
                                            {...registerMessage('message')}
                                            error={
                                              messageErrors.message?.message
                                            }
                                          />
                                          <Button
                                            type="submit"
                                            disabled={submitting}
                                          >
                                            <Send className="ml-2 h-4 w-4" />
                                            ارسال پاسخ
                                          </Button>
                                        </form>
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              هنوز گفتگویی آغاز نشده است
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
