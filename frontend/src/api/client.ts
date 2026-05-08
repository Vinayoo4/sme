import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000';
let demoUserId = localStorage.getItem('demoUserId') || import.meta.env.VITE_DEMO_USER_ID || '';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  if (demoUserId) {
    config.headers['x-demo-user-id'] = demoUserId;
  }
  return config;
});

export function setDemoUserId(value: string): void {
  demoUserId = value;
  localStorage.setItem('demoUserId', value);
}

export function getDemoUserId(): string {
  return demoUserId;
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
