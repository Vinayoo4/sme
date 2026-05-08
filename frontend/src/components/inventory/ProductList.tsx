import type { Product } from '../../api/inventoryApi';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string;
}

export function ProductList({ products, loading, error }: ProductListProps) {
  if (loading) {
    return <section className="card"><p>Loading products...</p></section>;
  }
  if (error) {
    return <section className="card"><p className="error">{error}</p></section>;
  }
  if (!products.length) {
    return <section className="card"><p className="muted">No products yet.</p></section>;
  }

  return (
    <section className="card">
      <h2>Products</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category ?? '-'}</td>
                <td>{product.currentStock}</td>
                <td>{product.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
