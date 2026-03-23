import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, addItem, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (!items.length) return (
    <div className="cart-empty container">
      <div className="cart-empty__icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Browse our catalog and add items to get started.</p>
      <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>Shop Now</Link>
    </div>
  );

  const tax   = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="cart-page container">
      <h1>Shopping Cart <span>({items.length} {items.length === 1 ? 'item' : 'items'})</span></h1>

      <div className="cart-page__layout">
        {/* Items */}
        <div className="cart-items">
          {items.map(({ product, quantity }) => product && (
            <div key={product._id} className="cart-item">
              <Link to={`/products/${product._id}`} className="cart-item__img-wrap">
                <img src={product.image || '/images/placeholder.jpg'} alt={product.name} />
              </Link>

              <div className="cart-item__info">
                <Link to={`/products/${product._id}`} className="cart-item__name">{product.name}</Link>
                <p className="cart-item__case">{product.caseSize}</p>
                <p className="cart-item__price">
                  {product.pricePerLb > 0 ? `$${product.pricePerLb.toFixed(2)}/lb` : 'Call for price'}
                </p>
              </div>

              <div className="cart-item__right">
                <div className="qty-stepper qty-stepper--sm">
                  <button onClick={() => quantity > 1 ? addItem(product._id, quantity - 1) : removeItem(product._id)}>−</button>
                  <input
                    type="number" value={quantity} min="1"
                    onChange={e => addItem(product._id, Math.max(1, Number(e.target.value)))}
                  />
                  <button onClick={() => addItem(product._id, quantity + 1)}>+</button>
                </div>

                <button
                  className="cart-item__remove"
                  onClick={() => { removeItem(product._id); toast.success('Item removed'); }}
                >Remove</button>
              </div>
            </div>
          ))}

          <div className="cart-actions">
            <Link to="/products" className="btn btn-ghost btn-sm">← Continue Shopping</Link>
            <button className="btn btn-ghost btn-sm" onClick={() => { clearCart(); toast.success('Cart cleared'); }}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="cart-summary__rows">
            <div className="cart-summary__row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="cart-summary__row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="cart-summary__row cart-summary__row--total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          </div>
          <button className="btn btn-red btn-lg btn-block" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
          <p className="cart-summary__note">Prices may vary. Final total confirmed at checkout.</p>
        </aside>
      </div>
    </div>
  );
}
