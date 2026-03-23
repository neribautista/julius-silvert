import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, authAPI } from '../api';
import toast from 'react-hot-toast';
import './AccountPage.css';

const STATUS_COLOR = {
  pending: 'badge-gray', confirmed: 'badge-navy', processing: 'badge-navy',
  shipped: 'badge-gold', delivered: 'badge-navy', cancelled: 'badge-red',
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'profile';

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: () => ordersAPI.mine().then(r => r.data),
    enabled: tab === 'orders',
  });

  const [profile, setProfile] = useState({
    name:         user?.name         || '',
    businessName: user?.businessName || '',
    phone:        user?.phone        || '',
  });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.profile(profile);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally { setSaving(false); }
  };

  return (
    <div className="account-page container">
      <div className="account-page__layout">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="account-sidebar__user">
            <div className="account-sidebar__avatar">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="account-sidebar__name">{user?.name}</p>
              <p className="account-sidebar__email">{user?.email}</p>
            </div>
          </div>
          <nav className="account-sidebar__nav">
            {[['profile','My Profile'],['orders','Order History']].map(([t, label]) => (
              <button
                key={t}
                className={`account-sidebar__link ${tab === t ? 'account-sidebar__link--active' : ''}`}
                onClick={() => setSearchParams({ tab: t })}
              >{label}</button>
            ))}
            <button
              className="account-sidebar__link account-sidebar__link--danger"
              onClick={() => { logout(); navigate('/'); }}
            >Sign Out</button>
          </nav>
        </aside>

        {/* Content */}
        <div className="account-content">
          {tab === 'profile' && (
            <div>
              <h1>My Profile</h1>
              <form onSubmit={handleProfileSave} className="account-form">
                <div className="account-form__row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <input className="form-input" value={profile.businessName} onChange={e => setProfile(p => ({...p, businessName: e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h1>Order History</h1>
              {ordersLoading ? (
                <div className="page-loader"><div className="spinner" /></div>
              ) : orders?.length > 0 ? (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-card__head">
                        <div>
                          <p className="order-card__id">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="order-card__date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="order-card__meta">
                          <span className={`badge ${STATUS_COLOR[order.status] || 'badge-gray'}`}>{order.status}</span>
                          <strong className="order-card__total">${order.total.toFixed(2)}</strong>
                        </div>
                      </div>
                      <div className="order-card__items">
                        {order.orderItems.slice(0, 3).map(item => (
                          <div key={item._id} className="order-card__item">
                            <span>{item.name}</span>
                            <span>×{item.quantity}</span>
                            <span>${item.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <p className="order-card__more">+{order.orderItems.length - 3} more items</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="orders-empty">
                  <p>You haven't placed any orders yet.</p>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('/products')} style={{ marginTop: 16 }}>
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
