import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../api';
import ProductCard from '../components/products/ProductCard';
import './ProductsPage.css';

const CATEGORIES = [
  'Meat & Poultry','Dairy & Eggs','Cheese & Charcuterie',
  'Oils & Vinegars','Baking & Pastry','Produce',
  'Frozen','Seafood','Pantry','Supplies',
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const category  = searchParams.get('category') || '';
  const search    = searchParams.get('search')   || '';
  const isNew     = searchParams.get('isNew')    || '';
  const isFeatured= searchParams.get('isFeatured') || '';

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [category, search, isNew, isFeatured]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, search, isNew, isFeatured, page }],
    queryFn: () => productsAPI.list({ category, search, isNew, isFeatured, page, limit: 20 })
                              .then(r => r.data),
    keepPreviousData: true,
  });

  const applyFilter = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    setSearchParams(next);
  };

  const title = search ? `Results for "${search}"` : category || (isNew ? "What's New" : 'All Products');

  return (
    <div className="products-page container">
      <div className="products-page__layout">

        {/* Sidebar */}
        <aside className="products-sidebar">
          <h3 className="sidebar__title">Categories</h3>
          <ul className="sidebar__list">
            <li>
              <button
                className={`sidebar__link ${!category ? 'sidebar__link--active' : ''}`}
                onClick={() => applyFilter('category', '')}
              >All Products</button>
            </li>
            {CATEGORIES.map(c => (
              <li key={c}>
                <button
                  className={`sidebar__link ${category === c ? 'sidebar__link--active' : ''}`}
                  onClick={() => applyFilter('category', c)}
                >{c}</button>
              </li>
            ))}
          </ul>

          <h3 className="sidebar__title" style={{ marginTop: 28 }}>Filter</h3>
          <label className="sidebar__check">
            <input
              type="checkbox"
              checked={isNew === 'true'}
              onChange={e => applyFilter('isNew', e.target.checked ? 'true' : '')}
            />
            New Arrivals
          </label>
          <label className="sidebar__check">
            <input
              type="checkbox"
              checked={isFeatured === 'true'}
              onChange={e => applyFilter('isFeatured', e.target.checked ? 'true' : '')}
            />
            Featured / On Special
          </label>
        </aside>

        {/* Main */}
        <div className="products-main">
          <div className="products-main__header">
            <h1>{title}</h1>
            {data && <span className="products-main__count">{data.total} products</span>}
          </div>

          {isLoading ? (
            <div className="product-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="product-card-skeleton" style={{ aspectRatio: '0.75' }} />
              ))}
            </div>
          ) : data?.products?.length > 0 ? (
            <>
              <div className="product-grid">
                {data.products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >← Prev</button>
                  <span>{page} / {data.pages}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                    disabled={page === data.pages}
                  >Next →</button>
                </div>
              )}
            </>
          ) : (
            <div className="products-empty">
              <p>No products found.</p>
              <Link to="/products" className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Clear filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
