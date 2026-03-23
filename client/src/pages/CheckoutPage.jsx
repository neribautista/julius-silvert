import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    street: user?.address?.street || '',
    city:   user?.address?.city   || '',
    state:  user?.address?.state  || '',
    zip:    user?.address?.zip    || '',
    notes:  '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const tax   = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setSubmitting(true);
    try {
      const orderItems = items
        .filter(i => i.product)
        .map(i => ({
          product:    i.product._id,
          name:       i.product.name,
          image:      i.product.image,
          quantity:   i.quantity,
          unitPrice:  i.product.pricePerLb || 0,
          totalPrice: (i.product.pricePerLb || 0) * i.quantity,
        }));

      const { data } = await ordersAPI.place({
        orderItems,
        shippingAddress: { street: form.street, city: form.city, state: form.state, zip: form.zip },
        notes: form.notes,
      });

      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/account?tab=orders`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>

      <form className="checkout-page__layout" onSubmit={handleSubmit}>
        {/* Left: address + notes */}
        <div className="checkout-form">
          <section className="checkout-section">
            <h2>Shipping Address</h2>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input className="form-input" value={form.street} onChange={e => set('street', e.target.value)} required />
            </div>
            <div className="checkout-form__row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" value={form.state} onChange={e => set('state', e.target.value)} required maxLength="2" />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP</label>
                <input className="form-input" value={form.zip} onChange={e => set('zip', e.target.value)} required />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2>Order Notes</h2>
            <div className="form-group">
              <label className="form-label">Special instructions (optional)</label>
              <textarea
                className="form-input"
                rows={3} value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Delivery preferences, substitution notes, etc."
              />
            </div>
          </section>
        </div>

        {/* Right: order summary */}
        <aside className="checkout-summary">
          <h2>Order Review</h2>
          <div className="checkout-summary__items">
            {items.map(({ product, quantity }) => product && (
              <div key={product._id} className="checkout-summary__item">
                <img src={product.image || '/images/placeholder.jpg'} alt={product.name} />
                <div>
                  <p className="checkout-summary__item-name">{product.name}</p>
                  <p className="checkout-summary__item-qty">Qty: {quantity}</p>
                </div>
                <span>${((product.pricePerLb || 0) * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="checkout-summary__totals">
            <div className="cart-summary__row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="cart-summary__row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="cart-summary__row cart-summary__row--total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          </div>

          <button type="submit" className="btn btn-red btn-lg btn-block" disabled={submitting}>
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </aside>
      </form>
    </div>
  );
}
