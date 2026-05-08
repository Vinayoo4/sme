import { getJson, patchJson } from './client';

export interface Notification {
  id: string;
  businessId: string;
  type: string;
  message: string;
  payload?: Record<string, unknown>;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchNotifications(): Promise<Notification[]> {
  const response = await getJson<{ data: Notification[] }>('/api/notifications');
  return response.data;
}

export async function markNotificationSeen(id: string): Promise<Notification> {
  const response = await patchJson<{ data: Notification }>(`/api/notifications/${id}/seen`, {});
  return response.data;
}
