'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Message } from '@/app/lib/types/ticket';

interface TicketConversationProps {
  messages: Message[] | undefined;
  loading: boolean;
  sendingMessage: boolean;
  onSendMessage: (message: string) => Promise<boolean>;
  ticketStatus?: string;
}

export default function TicketConversation({
  messages = [],
  loading,
  sendingMessage,
  onSendMessage,
  ticketStatus = 'open',
}: TicketConversationProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sendingMessage) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');

    try {
      const success = await onSendMessage(messageToSend);
      if (!success) {
        setNewMessage(messageToSend); // Restore message on failure
      }
    } catch (error) {
      setNewMessage(messageToSend); // Restore message on error
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return `امروز، ${date.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else if (diffDays === 2) {
      return `دیروز، ${date.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else {
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600 dark:text-gray-400">
              در حال بارگذاری گفتگو...
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages Container */}
      <Card className="overflow-hidden p-0">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2 space-x-reverse">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              گفتگوی تیکت
            </h3>
          </div>
        </div>

        <div className="h-96 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="mb-2 h-12 w-12 opacity-50" />
              <p>هنوز پیامی ارسال نشده است</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.is_student ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                    message.is_student
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div className="mb-1 flex items-center space-x-2 space-x-reverse">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {message.sender}
                    </span>
                    <span className="text-xs opacity-75">
                      {message.is_student ? '(دانش‌پژوه)' : '(مدرس)'}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <div className="mt-2 flex items-center space-x-1 space-x-reverse">
                    <Clock className="h-3 w-3 opacity-75" />
                    <span className="text-xs opacity-75">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Message Input */}
      {ticketStatus === 'open' ? (
        <Card className="p-4">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                پیام جدید
              </label>
              <textarea
                id="message"
                rows={3}
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="پیام خود را اینجا بنویسید..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sendingMessage}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                loading={sendingMessage}
                className="flex items-center space-x-2 space-x-reverse"
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{sendingMessage ? 'در حال ارسال...' : 'ارسال پیام'}</span>
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-5 w-5" />
            <span>
              این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
