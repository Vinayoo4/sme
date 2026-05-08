import { useEffect, useState } from 'react';
import type { MovementPayload, Product, ProductPayload, RestockSuggestion } from '../api/inventoryApi';
import { createProduct, fetchProducts, fetchRestockSuggestions, recordMovement } from '../api/inventoryApi';
import { MovementForm } from '../components/inventory/MovementForm';
import { ProductForm } from '../components/inventory/ProductForm';
import { ProductList } from '../components/inventory/ProductList';
import { RestockTable } from '../components/inventory/RestockTable';
import { useAppContext } from '../context/AppContext';

export function InventoryPage() {
  const { refreshNotificationCount } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [restock, setRestock] = useState<RestockSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingMovement, setSavingMovement] = useState(false);
  const [error, setError] = useState('');

  async function load(): Promise<void> {
    setLoading(true);
    setError('');
    try {
      const [productsResponse, restockResponse] = await Promise.all([fetchProducts(), fetchRestockSuggestions()]);
      setProducts(productsResponse);
      setRestock(restockResponse.filter((item) => item.suggestedOrder > 0));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  async function handleCreateProduct(payload: ProductPayload): Promise<void> {
    try {
      setSavingProduct(true);
      await createProduct(payload);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to create product');
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleMovement(payload: MovementPayload): Promise<void> {
    try {
      setSavingMovement(true);
      await recordMovement(payload);
      await load();
      await refreshNotificationCount();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to record movement');
    } finally {
      setSavingMovement(false);
    }
  }

  return (
    <section className="page stack">
      <h1>Inventory</h1>
      {error ? <div className="card"><p className="error">{error}</p></div> : null}
      <div className="content-grid">
        <ProductForm onSubmit={handleCreateProduct} busy={savingProduct} />
        <MovementForm products={products} onSubmit={handleMovement} busy={savingMovement} />
      </div>
      <ProductList products={products} loading={loading} error={error} />
      <RestockTable suggestions={restock} loading={loading} error={error} />
    </section>
  );
}
