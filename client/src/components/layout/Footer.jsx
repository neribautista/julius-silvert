import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-julius">Julius</span>
            <span className="footer__logo-silvert">SILVERT</span>
          </div>
          <p className="footer__tagline">Full Service Wholesale &amp; Specialty Food Distributor since 1915.</p>
          <p className="footer__phone">215-455-1600</p>
        </div>

        <div className="footer__col">
          <h4>Shop</h4>
          <ul>
            {['Meat & Poultry','Seafood','Dairy & Eggs','Produce','Pantry','Frozen'].map(c => (
              <li key={c}><Link to={`/products?category=${encodeURIComponent(c)}`}>{c}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/account?tab=orders">Order History</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Info</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#delivery">Delivery Info</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&copy; {new Date().getFullYear()} Julius Silvert, Inc. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
