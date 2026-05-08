import { getJson, postJson } from './client';

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  category?: string;
  unit: string;
  currentStock: number;
  reorderLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  sku: string;
  category?: string;
  unit: string;
  currentStock?: number;
  reorderLevel?: number;
}

export interface MovementPayload {
  productId: string;
  type: 'sale' | 'purchase' | 'adjustment';
  quantity: number;
  date?: string;
  note?: string;
}

export interface RestockSuggestion {
  productId: string;
  name: string;
  sku: string;
  currentStock: number;
  avgDailySales: number;
  predictedDemand: number;
  suggestedOrder: number;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const response = await postJson<{ data: Product }>('/api/inventory/products', payload);
  return response.data;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await getJson<{ data: Product[] }>('/api/inventory/products');
  return response.data;
}

export async function recordMovement(payload: MovementPayload): Promise<void> {
  await postJson<{ data: unknown }>('/api/inventory/movements', payload);
}

export async function fetchRestockSuggestions(): Promise<RestockSuggestion[]> {
  const response = await getJson<{ data: RestockSuggestion[] }>('/api/inventory/restock');
  return response.data;
}
