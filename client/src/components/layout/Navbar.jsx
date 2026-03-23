import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const CATEGORIES = [
  'Meat & Poultry', 'Dairy & Eggs', 'Cheese & Charcuterie',
  'Oils & Vinegars', 'Baking & Pastry', 'Produce',
  'Frozen', 'Seafood', 'Pantry', 'Supplies',
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount }    = useCart();
  const navigate         = useNavigate();
  const [search, setSearch]       = useState('');
  const [menuOpen, setMenuOpen]   = useState(false);
  const [userOpen, setUserOpen]   = useState(false);
  const userRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="site-header">
      {/* Main header */}
      <div className="main-header">
        <div className="container main-header__inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo__julius">Julius</span>
            <span className="logo__silvert">SILVERT</span>
            <span className="logo__est">Est. 1915</span>
          </Link>

          {/* Search */}
          <form className="search-bar" onSubmit={handleSearch}>
            <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="search-bar__input"
              type="text"
              placeholder="What can we help you find today?"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>

          {/* Actions */}
          <div className="header-actions">
            {/* Account */}
            <div className="header-actions__user" ref={userRef}>
              <button className="header-actions__btn" onClick={() => setUserOpen(!userOpen)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
              {userOpen && (
                <div className="dropdown">
                  {user ? (
                    <>
                      <Link to="/account" className="dropdown__item" onClick={() => setUserOpen(false)}>My Account</Link>
                      <Link to="/account?tab=orders" className="dropdown__item" onClick={() => setUserOpen(false)}>My Orders</Link>
                      <button className="dropdown__item dropdown__item--danger" onClick={() => { logout(); setUserOpen(false); }}>Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown__item" onClick={() => setUserOpen(false)}>Sign In</Link>
                      <Link to="/register" className="dropdown__item" onClick={() => setUserOpen(false)}>Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="header-actions__btn header-actions__cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            {/* Help */}
            <button className="header-actions__btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>

            {/* Mobile toggle */}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className={`cat-nav ${menuOpen ? 'cat-nav--open' : ''}`}>
        <div className="container cat-nav__inner">
          <NavLink to="/products?isNew=true" className="cat-nav__link cat-nav__link--new">What's New</NavLink>
          {CATEGORIES.map(cat => (
            <NavLink
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="cat-nav__link"
            >
              {cat}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
