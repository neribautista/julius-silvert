import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem, loading } = useCart();
  const { user }             = useAuth();
  const [qty, setQty]        = useState(1);
  const [packType, setPackType] = useState(product.packOptions?.[0]?.type || 'CASE');
  const [hovered, setHovered]   = useState(false);

  const handleAdd = async () => {
    if (!user) { toast.error('Please sign in to add items'); return; }
    await addItem(product._id, qty);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="product-card">
      {product.isNew && (
        <span className="product-card__tag badge badge-red">New</span>
      )}

      <Link
        to={`/products/${product._id}`}
        className="product-card__img-wrap"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Primary image */}
        <img
          src={product.image || "/images/placeholder.png"}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />

        {/* Hover image — crossfades on top */}
        {product.imageHover && (
          <img
            src={product.imageHover}
            alt={product.name}
            className={`product-card__img--hover ${
              hovered ? "product-card__img--visible" : ""
            }`}
            loading="lazy"
          />
        )}
      </Link>

      <div className="product-card__body">
        <Link to={`/products/${product._id}`} className="product-card__name">
          {product.name}
        </Link>
        {product.brand && (
          <p className="product-card__brand">{product.brand}</p>
        )}
        {product.itemNumber && (
          <p className="product-card__item">Item#: {product.itemNumber}</p>
        )}

        {/* Pack type selector */}
        {product.packOptions?.length > 0 && (
          <div className="product-card__pack-row">
            {product.packOptions.map((opt) => (
              <button
                key={opt.type}
                className={`pack-btn ${
                  packType === opt.type ? "pack-btn--active" : ""
                }`}
                onClick={() => setPackType(opt.type)}
              >
                {opt.type}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="product-card__price">
          {product.pricePerLb > 0 ? (
            <>
              <strong>${product.pricePerLb.toFixed(2)}/lb</strong>{" "}
              <span>{product.caseSize}</span>
            </>
          ) : (
            <span className="product-card__call">Call for price</span>
          )}
        </div>

        {/* Add to cart row */}
        <div className="product-card__actions">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="product-card__qty"
          />
          <button
            className="btn btn-primary btn-sm product-card__add"
            onClick={handleAdd}
            disabled={loading}
          >
            Add
          </button>
          <button className="product-card__icon-btn" title="Add to order guide">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button className="product-card__icon-btn" title="Save">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}