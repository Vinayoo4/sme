import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000';
let userId = localStorage.getItem('userId') || import.meta.env.VITE_USER_ID || '';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

interface OfflineRequest {
  url: string;
  method: string;
  payload?: unknown;
  timestamp: number;
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is network related
    if (!error.response) {
      const config = error.config;
      if (config.method.toLowerCase() === 'post') {
        const offlineQueue: OfflineRequest[] = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
        offlineQueue.push({
          url: config.url,
          method: config.method,
          payload: config.data ? JSON.parse(config.data) : undefined,
          timestamp: Date.now(),
        });
        localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));

        // Return a mock object mimicking the created entity so the UI doesn't crash
        // and forms can reset correctly.
        const mockEntity = {
          id: `temp-${Date.now()}`,
          offline: true,
          ...config.data ? JSON.parse(config.data) : {}
        };
        return Promise.resolve({ data: mockEntity });
      }
    }
    return Promise.reject(error);
  }
);

export async function syncOfflineQueue(): Promise<void> {
  const offlineQueue: OfflineRequest[] = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
  if (offlineQueue.length === 0) return;

  const newQueue: OfflineRequest[] = [];
  for (const req of offlineQueue) {
    try {
      if (req.method.toLowerCase() === 'post') {
        await client.post(req.url, req.payload);
      }
    } catch (error) {
      console.error('Failed to sync offline request', error);
      // Keep in queue if it's a network error again
      if (axios.isAxiosError(error) && !error.response) {
        newQueue.push(req);
      }
    }
  }

  localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
}

window.addEventListener('online', syncOfflineQueue);

// Run once on app startup to catch pending requests
syncOfflineQueue().catch(console.error);

export function setUserId(value: string): void {
  userId = value;
  localStorage.setItem('userId', value);
}

export function getUserId(): string {
  return userId;
}

export async function getJson<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await client.get<T>(url, { params });
  return response.data;
}

export async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await client.post<T>(url, payload);
  return response.data;
}

export async function patchJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await client.patch<T>(url, payload);
  return response.data;
}
