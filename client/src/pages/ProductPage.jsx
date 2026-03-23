import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductPage.css';

export default function ProductPage() {
  const { id }               = useParams();
  const { addItem, loading } = useCart();
  const { user }             = useAuth();
  const [qty, setQty]        = useState(1);
  const [packType, setPackType] = useState('CASE');

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.single(id).then(r => r.data),
  });

  if (isLoading) return <div className="page-loader"><div className="spinner" /></div>;
  if (isError || !product) return (
    <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
      <p>Product not found.</p>
      <Link to="/products" className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Back to Products</Link>
    </div>
  );

  const handleAdd = async () => {
    if (!user) { toast.error('Please sign in to add items'); return; }
    await addItem(product._id, qty);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="product-page container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> /
        <Link to="/products">Products</Link> /
        {product.category && <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>}
        / <span>{product.name}</span>
      </nav>

      <div className="product-page__grid">
        {/* Image */}
        <div className="product-page__img-wrap">
          {product.isNew && <span className="badge badge-red" style={{ marginBottom: 16 }}>New Arrival</span>}
          <img
            src={product.image || '/images/placeholder.jpg'}
            alt={product.name}
            className="product-page__img"
          />
        </div>

        {/* Info */}
        <div className="product-page__info">
          {product.brand && <p className="product-page__brand">{product.brand}</p>}
          <h1 className="product-page__name">{product.name}</h1>
          {product.itemNumber && <p className="product-page__item-num">Item #: {product.itemNumber}</p>}

          {/* Price */}
          <div className="product-page__price">
            {product.pricePerLb > 0
              ? <><strong>${product.pricePerLb.toFixed(2)}</strong><span>/lb</span></>
              : <span style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>Call for price</span>
            }
            {product.caseSize && <span className="product-page__case">Case size: {product.caseSize}</span>}
          </div>

          {/* Pack type */}
          {product.packOptions?.length > 0 && (
            <div className="product-page__pack">
              <p className="form-label">Pack Type</p>
              <div className="product-page__pack-row">
                {product.packOptions.map(opt => (
                  <button
                    key={opt.type}
                    className={`pack-btn ${packType === opt.type ? 'pack-btn--active' : ''}`}
                    onClick={() => setPackType(opt.type)}
                  >
                    {opt.type} {opt.price ? `– $${opt.price.toFixed(2)}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="product-page__desc">{product.description}</p>
          )}

          {/* Add to cart */}
          <div className="product-page__add-row">
            <div className="product-page__qty-wrap">
              <label className="form-label">Qty</label>
              <div className="qty-stepper">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input
                  type="number" value={qty} min="1"
                  onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                />
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAdd}
              disabled={loading || !product.inStock}
              style={{ flex: 1 }}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="product-page__tags">
              {product.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
