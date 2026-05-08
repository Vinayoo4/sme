import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { MovementPayload, Product } from '../../api/inventoryApi';

interface MovementFormProps {
  products: Product[];
  onSubmit: (payload: MovementPayload) => Promise<void>;
  busy: boolean;
}

export function MovementForm({ products, onSubmit, busy }: MovementFormProps) {
  const defaultProductId = useMemo(() => products[0]?.id ?? '', [products]);
  const [form, setForm] = useState<MovementPayload>({ productId: '', type: 'sale', quantity: 1, date: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!form.productId && defaultProductId) {
      setForm((current) => ({ ...current, productId: defaultProductId }));
    }
  }, [defaultProductId, form.productId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!form.productId) {
      setError('Select a product first.');
      return;
    }
    setError('');
    await onSubmit({ ...form, date: form.date ? new Date(form.date).toISOString() : undefined });
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Record movement</h2>
      <label>
        Product
        <select value={form.productId} onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))}>
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
      </label>
      <label>
        Type
        <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as MovementPayload['type'] }))}>
          <option value="sale">Sale</option>
          <option value="purchase">Purchase</option>
          <option value="adjustment">Adjustment</option>
        </select>
      </label>
      <label>
        Quantity
        <input type="number" value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: Number(event.target.value) }))} />
      </label>
      <label>
        Date
        <input type="date" value={form.date?.slice(0, 10)} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
      </label>
      <label className="full-width">
        Note
        <input value={form.note ?? ''} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={busy || products.length === 0}>{busy ? 'Saving...' : 'Record movement'}</button>
    </form>
  );
}
