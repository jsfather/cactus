export interface FAQ {
  id: number | string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

// Admin FAQ management types
export interface GetFAQListResponse {
  data: FAQ[];
}

export interface GetFAQResponse {
  data: FAQ;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
}

export interface UpdateFAQRequest {
  question: string;
  answer: string;
}
