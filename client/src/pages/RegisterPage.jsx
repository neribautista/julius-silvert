import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    businessName: '', phone: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    try {
      await register(form);
      toast.success('Account created! Welcome.');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">
            <span>Julius</span><strong>SILVERT</strong>
          </Link>
          <h1>Create Account</h1>
          <p>Register for wholesale pricing &amp; ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form auth-form--grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
          </div>
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input className="form-input" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Acme Restaurant" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="215-555-0100" />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" required minLength={6} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input className="form-input" type="password" required value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat password" />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block auth-form__submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
