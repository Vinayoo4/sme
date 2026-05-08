import type { RestockSuggestion } from '../../api/inventoryApi';

interface RestockTableProps {
  suggestions: RestockSuggestion[];
  loading: boolean;
  error: string;
}

export function RestockTable({ suggestions, loading, error }: RestockTableProps) {
  if (loading) {
    return <section className="card"><p>Loading restock suggestions...</p></section>;
  }
  if (error) {
    return <section className="card"><p className="error">{error}</p></section>;
  }
  if (!suggestions.length) {
    return <section className="card"><p className="muted">No restock suggestions right now.</p></section>;
  }

  return (
    <section className="card">
      <h2>Restock suggestions</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Current stock</th>
              <th>Avg/day</th>
              <th>Predicted demand</th>
              <th>Suggested order</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{item.currentStock}</td>
                <td>{item.avgDailySales}</td>
                <td>{item.predictedDemand}</td>
                <td>{item.suggestedOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
