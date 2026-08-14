'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Clock3,
  FileText,
  Loader2,
  MessageCircle,
  Send,
  UserRound,
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import type { Message } from '@/app/lib/types/ticket';

interface TicketConversationProps {
  messages?: Message[];
  loading?: boolean;
  sendingMessage?: boolean;
  onSendMessage?: (message: string) => Promise<boolean>;
  ticketStatus?: string;
  viewerRole?: 'student' | 'support';
  composerLabel?: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TicketConversation({
  messages = [],
  loading = false,
  sendingMessage = false,
  onSendMessage,
  ticketStatus = 'open',
  viewerRole = 'support',
  composerLabel = 'پاسخ شما',
}: TicketConversationProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!onSendMessage || !newMessage.trim() || sendingMessage) return;
    const messageToSend = newMessage.trim();
    setNewMessage('');

    try {
      const success = await onSendMessage(messageToSend);
      if (!success) setNewMessage(messageToSend);
    } catch {
      setNewMessage(messageToSend);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendMessage();
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Loader2 className="text-primary-600 h-6 w-6 animate-spin" />
        <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">
          در حال دریافت گفتگو...
        </span>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-primary-600 dark:text-primary-400 h-5 w-5" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            گفتگوی تیکت
          </h2>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {messages.length.toLocaleString('fa-IR')} پیام
        </span>
      </header>

      <div
        ref={scrollContainerRef}
        className="max-h-[58vh] min-h-80 space-y-5 overflow-y-auto bg-gray-50/70 p-4 sm:p-6 dark:bg-gray-900/40"
      >
        {messages.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-3 font-medium text-gray-900 dark:text-white">
              هنوز پیامی ثبت نشده است
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              اولین پیام گفتگو پس از ثبت در این قسمت نمایش داده می‌شود.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isStudent = Boolean(message.is_student);
            const isOwn = viewerRole === 'student' ? isStudent : !isStudent;
            return (
              <article
                key={`${message.created_at}-${index}`}
                className={`flex items-end gap-2 ${isOwn ? 'justify-start' : 'justify-end'}`}
              >
                {isOwn && (
                  <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <UserRound className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-3 sm:max-w-[72%] ${
                    isOwn
                      ? 'bg-primary-600 rounded-br-md text-white'
                      : 'rounded-bl-md border border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs font-semibold">
                      {message.sender || (isOwn ? 'شما' : 'پشتیبانی')}
                    </span>
                    <span
                      className={`text-[11px] ${isOwn ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      {isStudent ? 'دانش‌پژوه' : 'پشتیبانی'}
                    </span>
                  </div>
                  <p className="text-sm leading-7 break-words whitespace-pre-wrap">
                    {message.message}
                  </p>
                  {message.attachment && (
                    <a
                      href={message.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                        isOwn
                          ? 'bg-white/15 text-white hover:bg-white/25'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      مشاهده فایل پیوست
                    </a>
                  )}
                  <time
                    className={`mt-2 flex items-center gap-1 text-[11px] ${isOwn ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <Clock3 className="h-3 w-3" />
                    {formatDate(message.created_at)}
                  </time>
                </div>
              </article>
            );
          })
        )}
      </div>

      {ticketStatus === 'closed' ? (
        <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
          <AlertCircle className="h-5 w-5" />
          این تیکت بسته شده و امکان ارسال پاسخ جدید وجود ندارد.
        </div>
      ) : onSendMessage ? (
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 p-4 sm:p-5 dark:border-gray-700"
        >
          <label
            htmlFor="ticket-message"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {composerLabel}
          </label>
          <textarea
            id="ticket-message"
            rows={4}
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                void sendMessage();
              }
            }}
            disabled={sendingMessage}
            placeholder="پیام را واضح و همراه با جزئیات لازم بنویسید..."
            className="focus:border-primary-500 focus:ring-primary-500 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm leading-6 text-gray-900 focus:ring-1 focus:outline-none disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              برای ارسال سریع از Ctrl + Enter استفاده کنید.
            </p>
            <Button
              type="submit"
              disabled={!newMessage.trim() || sendingMessage}
              loading={sendingMessage}
              className="w-full gap-2 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              ارسال پاسخ
            </Button>
          </div>
        </form>
      ) : (
        <div className="border-t border-gray-200 px-4 py-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          این گفتگو فقط برای مشاهده است.
        </div>
      )}
    </section>
  );
}
