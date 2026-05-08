import { getJson, patchJson, postJson } from './client';

export interface Feedback {
  id: string;
  businessId: string;
  customerPhone?: string;
  rating?: number;
  transcript?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  serviceType?: string;
  staffName?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackPayload {
  customerPhone?: string;
  rating?: number;
  transcript?: string;
  serviceType?: string;
  staffName?: string;
  audioUrl?: string;
}

export interface FeedbackListResponse {
  data: Feedback[];
  total: number;
  page: number;
  limit: number;
}

export async function createFeedback(payload: FeedbackPayload): Promise<Feedback> {
  const response = await postJson<{ data: Feedback }>('/api/feedback', payload);
  return response.data;
}

export async function fetchFeedback(page = 1, limit = 10, rating?: number): Promise<FeedbackListResponse> {
  return getJson<FeedbackListResponse>('/api/feedback', { page, limit, rating });
}

export async function updateFeedback(id: string, payload: Record<string, unknown>): Promise<Feedback> {
  const response = await patchJson<{ data: Feedback }>(`/api/feedback/${id}`, payload);
  return response.data;
}
