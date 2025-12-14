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
  AlertCircle 
} from 'lucide-react';
import { TeacherHomeworkConversation, TeacherHomeworkMessage } from '@/app/lib/types/teacher-homework';

interface ConversationComponentProps {
  conversationId: string;
  conversation: TeacherHomeworkConversation | null;
  loading: boolean;
  sendingMessage: boolean;
  onFetchConversation: (conversationId: string) => void;
  onSendMessage: (conversationId: string, message: string) => Promise<boolean>;
}

export default function ConversationComponent({
  conversationId,
  conversation,
  loading,
  sendingMessage,
  onFetchConversation,
  onSendMessage,
}: ConversationComponentProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      onFetchConversation(conversationId);
    }
  }, [conversationId, onFetchConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');
    
    const success = await onSendMessage(conversationId, messageToSend);
    if (!success) {
      // If sending failed, restore the message
      setNewMessage(messageToSend);
    }
  };

  const formatMessageTime = (createdAt: string) => {
    // Convert "2025-04-01 15:04" format to Persian
    try {
      const [date, time] = createdAt.split(' ');
      const [year, month, day] = date.split('-');
      const persianDate = `${year}/${month}/${day}`;
      return `${persianDate} - ${time}`;
    } catch {
      return createdAt;
    }
  };

  const renderMessage = (message: TeacherHomeworkMessage) => {
    const isTeacher = message.sender_type === 'teacher';
    
    return (
      <div
        key={message.id}
        className={`flex ${isTeacher ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start gap-2 max-w-xs lg:max-w-md ${
          isTeacher ? 'flex-row-reverse' : 'flex-row'
        }`}>
          {/* Avatar */}
          <div className="flex-shrink-0">
            {message.sender?.profile_picture ? (
              <img
                src={message.sender.profile_picture}
                alt={`${message.sender.first_name} ${message.sender.last_name}`}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                isTeacher 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}>
                <User className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className={`${isTeacher ? 'text-right' : 'text-left'}`}>
            {/* Sender Name */}
            <div className="flex items-center gap-2 mb-1">
              {message.sender ? (
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {message.sender.first_name} {message.sender.last_name}
                </span>
              ) : (
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {isTeacher ? 'مدرس' : 'دانش‌پژوه'}
                </span>
              )}
              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                isTeacher 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              }`}>
                {isTeacher ? 'مدرس' : 'دانش‌پژوه'}
              </span>
            </div>

            {/* Message Bubble */}
            <div className={`rounded-lg px-3 py-2 ${
              isTeacher
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            </div>

            {/* Timestamp */}
            <div className={`flex items-center gap-1 mt-1 ${
              isTeacher ? 'justify-end' : 'justify-start'
            }`}>
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">
                {formatMessageTime(message.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="mr-2 text-gray-600 dark:text-gray-400">
            در حال بارگیری گفتگو...
          </span>
        </div>
      </Card>
    );
  }

  if (!conversation) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            گفتگو یافت نشد
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            خطایی در بارگیری گفتگو رخ داده است.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          گفتگو ({conversation.messages?.length || 0} پیام)
        </h3>
      </div>

      {/* Messages Container */}
      <div className="max-h-96 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        {conversation.messages && conversation.messages.length > 0 ? (
          <>
            {conversation.messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              هنوز پیامی در این گفتگو ارسال نشده است.
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <div className="flex-1">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            rows={2}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            disabled={sendingMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={!newMessage.trim() || sendingMessage}
          className="flex items-center gap-2 self-end"
        >
          {sendingMessage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          ارسال
        </Button>
      </form>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        برای ارسال پیام، Enter را فشار دهید. برای خط جدید، Shift + Enter استفاده کنید.
      </div>
    </Card>
  );
}