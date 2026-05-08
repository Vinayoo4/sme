import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ProductPayload } from '../../api/inventoryApi';

interface ProductFormProps {
  onSubmit: (payload: ProductPayload) => Promise<void>;
  busy: boolean;
}

export function ProductForm({ onSubmit, busy }: ProductFormProps) {
  const [form, setForm] = useState<ProductPayload>({ name: '', sku: '', category: '', unit: 'pcs', currentStock: 0, reorderLevel: 0 });
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!form.name.trim() || !form.sku.trim() || !form.unit.trim()) {
      setError('Name, SKU, and unit are required.');
      return;
    }
    setError('');
    await onSubmit(form);
    setForm({ name: '', sku: '', category: '', unit: 'pcs', currentStock: 0, reorderLevel: 0 });
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Add product</h2>
      <label>
        Name
        <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
      </label>
      <label>
        SKU
        <input value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
      </label>
      <label>
        Category
        <input value={form.category ?? ''} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
      </label>
      <label>
        Unit
        <input value={form.unit} onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))} />
      </label>
      <label>
        Current stock
        <input type="number" value={form.currentStock ?? 0} onChange={(event) => setForm((current) => ({ ...current, currentStock: Number(event.target.value) }))} />
      </label>
      <label>
        Reorder level
        <input type="number" value={form.reorderLevel ?? 0} onChange={(event) => setForm((current) => ({ ...current, reorderLevel: Number(event.target.value) }))} />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Create product'}</button>
    </form>
  );
}
