import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../api';
import ProductCard from '../components/products/ProductCard';
import './HomePage.css';

const HERO_BANNERS = [
  { label: 'Silvert Exclusives', sub: 'Shop Items Only Available Here!', bg: '#1a2744', link: '/products' },
  { label: 'My Order Guide',     sub: 'Quickly reorder your favorites',  bg: '#2d4a7a', link: '/account' },
  { label: 'Family Meal Specials', sub: 'Weekly deals for your kitchen', bg: '#c0392b', link: '/products?isFeatured=true' },
];

const CATEGORIES = [
  { name: 'Meat & Poultry', emoji: '🥩' },
  { name: 'Seafood',        emoji: '🦞' },
  { name: 'Dairy & Eggs',   emoji: '🧀' },
  { name: 'Produce',        emoji: '🥦' },
  { name: 'Pantry',         emoji: '🫙' },
  { name: 'Frozen',         emoji: '❄️' },
];

export default function HomePage() {
  const { data: newArrivals } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => productsAPI.list({ isNew: true, limit: 8 }).then(r => r.data.products),
  });
  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsAPI.list({ isFeatured: true, limit: 8 }).then(r => r.data.products),
  });

  return (
    <div className="home">

      {/* Hero banner grid */}
      <section className="hero-grid container">
        {/* Truck feature */}
        <div className="hero-truck">
          <div className="hero-truck__overlay">
            <div className="hero-truck__logo">
              <span>Julius</span><strong>SILVERT</strong>
              <small>Est. 1915</small>
            </div>
            <p className="hero-truck__sub">Full Service Wholesale &amp; Specialty Food Distributor</p>
            <p className="hero-truck__phone">215-455-1600</p>
          </div>
        </div>

        {/* Banners */}
        {HERO_BANNERS.map(b => (
          <Link key={b.label} to={b.link} className="hero-banner" style={{ background: b.bg }}>
            <h2 className="hero-banner__title">{b.label}</h2>
            <p  className="hero-banner__sub">{b.sub}</p>
          </Link>
        ))}
      </section>

      {/* Category quick links */}
      <section className="category-strip">
        <div className="container category-strip__inner">
          {CATEGORIES.map(c => (
            <Link key={c.name} to={`/products?category=${encodeURIComponent(c.name)}`} className="cat-chip">
              <span className="cat-chip__emoji">{c.emoji}</span>
              <span className="cat-chip__name">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="product-section container">
        <div className="product-section__head">
          <div>
            <h2>New Arrivals</h2>
            <p>The latest products added to our catalog</p>
          </div>
          <Link to="/products?isNew=true" className="btn btn-outline btn-sm">View All</Link>
        </div>

        {newArrivals?.length > 0 ? (
          <div className="product-grid">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="product-grid product-grid--placeholder">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="product-card-skeleton" />)}
          </div>
        )}
      </section>

      {/* Featured */}
      {featured?.length > 0 && (
        <section className="product-section container">
          <div className="product-section__head">
            <div>
              <h2>Family Meal Specials</h2>
              <p>Handpicked weekly deals for home &amp; restaurant</p>
            </div>
            <Link to="/products?isFeatured=true" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2>Ready to order wholesale?</h2>
            <p>Register for an account and get access to exclusive pricing.</p>
          </div>
          <Link to="/register" className="btn btn-red btn-lg">Create Account</Link>
        </div>
      </section>

    </div>
  );
}
