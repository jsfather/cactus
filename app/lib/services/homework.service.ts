import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetHomeworkListResponse,
  GetConversationResponse,
  SendMessageRequest,
  ReplyMessageRequest,
  SubmitAnswerRequest,
  MessageResponse,
} from '@/app/lib/types/homework';

export class HomeworkService {
  /**
   * Get all homeworks for a specific term
   */
  async getByTerm(termId: string): Promise<GetHomeworkListResponse> {
    return apiClient.get<GetHomeworkListResponse>(
      API_ENDPOINTS.PANEL.STUDENT.HOMEWORKS.GET_BY_TERM(termId)
    );
  }

  /**
   * Submit homework answer
   */
  async submitAnswer(payload: SubmitAnswerRequest): Promise<any> {
    const formData = new FormData();
    formData.append('homework_id', payload.homework_id.toString());
    formData.append('description', payload.description);
    if (payload.file) {
      formData.append('file', payload.file);
    }

    return apiClient.post<any>(
      API_ENDPOINTS.PANEL.STUDENT.HOMEWORKS.SUBMIT_ANSWER,
      formData
    );
  }

  /**
   * Send a new message for a homework (start conversation)
   */
  async sendMessage(payload: SendMessageRequest): Promise<MessageResponse> {
    const formData = new FormData();
    formData.append('homework_id', payload.homework_id.toString());
    formData.append('message', payload.message);

    return apiClient.post<MessageResponse>(
      API_ENDPOINTS.PANEL.STUDENT.HOMEWORKS.SEND_MESSAGE,
      formData
    );
  }

  /**
   * Reply to an existing conversation
   */
  async replyMessage(payload: ReplyMessageRequest): Promise<MessageResponse> {
    const formData = new FormData();
    formData.append('conversation_id', payload.conversation_id.toString());
    formData.append('message', payload.message);

    return apiClient.post<MessageResponse>(
      API_ENDPOINTS.PANEL.STUDENT.HOMEWORKS.REPLY_MESSAGE,
      formData
    );
  }

  /**
   * Get conversation details with all messages
   */
  async getConversation(
    conversationId: string
  ): Promise<GetConversationResponse> {
    return apiClient.get<GetConversationResponse>(
      API_ENDPOINTS.PANEL.STUDENT.HOMEWORKS.GET_CONVERSATION(conversationId)
    );
  }
}

export const homeworkService = new HomeworkService();
