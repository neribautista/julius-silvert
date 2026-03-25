import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../api';
import ProductCard from '../components/products/ProductCard';
import './ProductsPage.css';

const BRANDS = ['All Brands', 'SILVERT', 'COMPART'];

const SORTS = [
  { label: 'Featured',    value: '' },
  { label: 'Newest',      value: 'new' },
  { label: 'Price: Low',  value: 'price_asc' },
  { label: 'Price: High', value: 'price_desc' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage]       = useState(1);
  const [brand, setBrand]     = useState('');
  const [inStock, setInStock] = useState(false);
  const [sort, setSort]       = useState('');

  const category   = searchParams.get('category')   || '';
  const search     = searchParams.get('search')     || '';
  const isNew      = searchParams.get('isNew')      || '';
  const isFeatured = searchParams.get('isFeatured') || '';

  useEffect(() => { setPage(1); }, [category, search, isNew, isFeatured, brand, inStock, sort]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, search, isNew, isFeatured, page, brand, inStock, sort }],
    queryFn: () =>
      productsAPI.list({ category, search, isNew, isFeatured, page, limit: 20 })
                 .then(r => r.data),
    keepPreviousData: true,
  });

  const allProducts = data?.products || [];
  const filtered = allProducts
    .filter(p => brand   ? p.brand === brand : true)
    .filter(p => inStock ? p.inStock         : true)
    .sort((a, b) => {
      if (sort === 'price_asc')  return (a.pricePerLb || 0) - (b.pricePerLb || 0);
      if (sort === 'price_desc') return (b.pricePerLb || 0) - (a.pricePerLb || 0);
      if (sort === 'new')        return b.isNew - a.isNew;
      return 0;
    });

  const pageTitle = category || (isNew ? 'New Arrivals' : isFeatured ? 'Featured' : 'All Products');

  return (
    <div className="products-page container">

      {/* ── Filter bar ── */}
      <div className="filter-bar">

        {/* Brand */}
        <div className="filter-control">
          <span className="filter-control__label">Brand</span>
          <div className="filter-control__pills">
            {BRANDS.map(b => (
              <button
                key={b}
                className={`filter-pill${brand === (b === 'All Brands' ? '' : b) ? ' filter-pill--active' : ''}`}
                onClick={() => setBrand(b === 'All Brands' ? '' : b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="filter-control">
          <span className="filter-control__label">Sort</span>
          <div className="filter-control__pills">
            {SORTS.map(s => (
              <button
                key={s.value}
                className={`filter-pill${sort === s.value ? ' filter-pill--active' : ''}`}
                onClick={() => setSort(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div className="filter-control">
          <span className="filter-control__label">Availability</span>
          <button
            className={`filter-toggle${inStock ? ' filter-toggle--active' : ''}`}
            onClick={() => setInStock(v => !v)}
          >
            <span className="filter-toggle__dot" />
            In Stock Only
          </button>
        </div>

      </div>

      {/* ── Results header ── */}
      <div className="products-main__header">
        <h1>{pageTitle}</h1>
        <span className="products-main__count">
          {isLoading ? '…' : `${filtered.length} items`}
        </span>
      </div>

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="product-grid">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="product-card-skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="products-empty">No products found.</div>
      ) : (
        <div className="product-grid">
          {filtered.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* ── Pagination ── */}
      {data?.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline btn-sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >← Prev</button>
          <span>Page {page} of {data.totalPages}</span>
          <button
            className="btn btn-outline btn-sm"
            disabled={page === data.totalPages}
            onClick={() => setPage(p => p + 1)}
          >Next →</button>
        </div>
      )}

    </div>
  );
}
