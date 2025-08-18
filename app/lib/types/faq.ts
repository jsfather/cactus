export interface FAQ {
  id: number | string;
  question: string;
  answer: string;
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
  question?: string;
  answer?: string;
}
