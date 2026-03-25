import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { productsAPI } from '../api';
import ProductCard from '../components/products/ProductCard';
import './HomePage.css';

/* ── Data ──────────────────────────────── */
const HERO_PANELS = [
  {
    img: '/truck.png',
    eyebrow: 'Est. 1915 · Philadelphia, PA',
    title: 'Julius',
    titleStrong: 'SILVERT',
    sub: 'Full Service Wholesale & Specialty Food Distributor',
    cta: { label: 'Shop Now', link: '/products' },
    phone: true,
  },
  {
    img: '/spring.png',
    eyebrow: 'Seasonal Picks',
    title: 'Spring',
    titleStrong: 'COLLECTION',
    sub: 'Fresh seasonal ingredients handpicked for your kitchen',
    cta: { label: 'View Spring Items', link: '/products?isNew=true' },
  },
  {
    img: '/compart.jpg',
    eyebrow: 'Premium Partner',
    title: 'Compart',
    titleStrong: 'DUROC',
    sub: 'World-class Duroc pork — exclusive cuts available now',
    cta: { label: 'Shop Compart', link: '/products?category=Meat+%26+Poultry' },
  },
];

const CATEGORIES = [
  { name: 'Meat & Poultry',       emoji: '🥩', link: '/products?category=Meat+%26+Poultry' },
  { name: 'Seafood',              emoji: '🦞', link: '/products?category=Seafood' },
  { name: 'Cheese & Charcuterie', emoji: '🧀', link: '/products?category=Cheese+%26+Charcuterie' },
  { name: 'Dairy & Eggs',         emoji: '🥛', link: '/products?category=Dairy+%26+Eggs' },
  { name: 'Produce',              emoji: '🥦', link: '/products?category=Produce' },
  { name: 'Oils & Vinegars',      emoji: '🫒', link: '/products?category=Oils+%26+Vinegars' },
  { name: 'Pantry',               emoji: '🫙', link: '/products?category=Pantry' },
  { name: 'Frozen',               emoji: '❄️', link: '/products?category=Frozen' },
  { name: 'Supplies',             emoji: '🧤', link: '/products?category=Supplies' },
];

const BRAND_PARTNERS = [
  { name: 'Barry Callebaut',   logo: '/images/brands/barry-callebaut.png' },
  { name: 'Beyond Meat',       logo: '/images/brands/beyond-meat.png' },
  { name: 'Boiron',            logo: '/images/brands/boiron.png' },
  { name: 'Boylan Bottling',   logo: '/images/brands/boylan-bottling.png' },
  { name: 'Bridor',            logo: '/images/brands/bridor.png' },
  { name: 'Cabot',             logo: '/images/brands/cabot.png' },
  { name: 'Calabro',           logo: '/images/brands/calabro.png' },
  { name: 'Castle Valley',     logo: '/images/brands/castle-valley.png' },
  { name: 'Charbonneaux',      logo: '/images/brands/charbonneaux.png' },
  { name: "David's",           logo: '/images/brands/davids.png' },
  { name: 'Fee Brothers',      logo: '/images/brands/fee-brothers.png' },
  { name: 'Fermin',            logo: '/images/brands/fermin.png' },
  { name: 'Jasper Hill Farm',  logo: '/images/brands/jasper-hill-farm.png' },
  { name: 'Kikkoman',          logo: '/images/brands/kikkoman.png' },
  { name: 'Lebus',             logo: '/images/brands/lebus.png' },
  { name: "Leidy's",           logo: '/images/brands/leidys.png' },
  { name: 'Marukan',           logo: '/images/brands/marukan.png' },
  { name: 'Micfood',           logo: '/images/brands/micfood.png' },
  { name: 'Monin',             logo: '/images/brands/monin.png' },
  { name: 'North Country',     logo: '/images/brands/north-country.png' },
  { name: 'Principe',          logo: '/images/brands/principe.png' },
  { name: 'Prop-Peller',       logo: '/images/brands/prop-peller.png' },
  { name: 'Red Mill',          logo: '/images/brands/red-mill.png' },
  { name: 'Saratoga',          logo: '/images/brands/saratoga.png' },
  { name: 'Smoking Goose',     logo: '/images/brands/smoking-goose.png' },
];

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Component ─────────────────────────── */
export default function HomePage() {
  const brandTrackRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  /* Hero carousel auto-advance */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(i => (i + 1) % HERO_PANELS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* Brand carousel auto-scroll */
  useEffect(() => {
    const track = brandTrackRef.current;
    if (!track) return;
    let raf;
    let pos = 0;
    const speed = 0.4;
    const scroll = () => {
      pos += speed;
      if (pos >= track.scrollWidth / 2) pos = 0;
      track.scrollLeft = pos;
      raf = requestAnimationFrame(scroll);
    };
    raf = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { data: newArrivals } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => productsAPI.list({ isNew: true, limit: 8 }).then(r => r.data.products),
  });
  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsAPI.list({ isFeatured: true, limit: 8 }).then(r => r.data.products),
  });

  const prev = () => setActiveSlide(i => (i - 1 + HERO_PANELS.length) % HERO_PANELS.length);
  const next = () => setActiveSlide(i => (i + 1) % HERO_PANELS.length);

  return (
    <div className="home">

      {/* ═══════════════════════════════════════════
          HERO CAROUSEL
          ═══════════════════════════════════════════ */}
      <section className="hero">

        {/* Slides (background images) */}
        {HERO_PANELS.map((panel, i) => (
          <div
            key={i}
            className={`hero__slide hero__slide--${i === 0 ? 'truck' : i === 1 ? 'spring' : 'compart'} ${i === activeSlide ? 'hero__slide--active' : ''}`}
          >
            <img src={panel.img} alt="" className="hero__img" />
            <div className="hero__overlay" />
          </div>
        ))}

        {/* Text content */}
        <div className="hero__content container">
          <div className="hero__text">
            <p className="hero__eyebrow">{HERO_PANELS[activeSlide].eyebrow}</p>
            <h1 className="hero__title">
              <span>{HERO_PANELS[activeSlide].title}</span>
              <strong>{HERO_PANELS[activeSlide].titleStrong}</strong>
            </h1>
            <p className="hero__sub">{HERO_PANELS[activeSlide].sub}</p>
            <div className="hero__actions">
              <Link to={HERO_PANELS[activeSlide].cta.link} className="btn btn-gold btn-lg">
                {HERO_PANELS[activeSlide].cta.label}
              </Link>
              {HERO_PANELS[activeSlide].phone && (
                <a href="tel:2154551600" className="btn btn-outline-white btn-lg">
                Call 215-455-1600
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button className="hero__arrow hero__arrow--prev" onClick={prev}>‹</button>
        <button className="hero__arrow hero__arrow--next" onClick={next}>›</button>

        {/* Dots */}
        <div className="hero__dots">
          {HERO_PANELS.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === activeSlide ? 'hero__dot--active' : ''}`}
              onClick={() => setActiveSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEW ARRIVALS
          ═══════════════════════════════════════════ */}
      {newArrivals?.length > 0 && (
        <section className="feature-section feature-section--dark">
          <div className="container">
            <Reveal className="feature-section__head">
              <p className="feature-section__eyebrow">Just In</p>
              <h2 className="feature-section__title">New Arrivals</h2>
              <p className="feature-section__sub">
                The latest additions to our catalog — fresh this week.
              </p>
            </Reveal>
            <div className="product-grid">
              {newArrivals.map((p, i) => (
                <Reveal key={p._id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
            <Reveal className="feature-section__action">
              <Link to="/products?isNew=true" className="btn btn-outline-white btn-lg">
                View All New Arrivals
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          CHEF'S PICKS
          ═══════════════════════════════════════════ */}
      {featured?.length > 0 && (
        <section className="feature-section feature-section--light">
          <div className="container">
            <Reveal className="feature-section__head">
              <p className="feature-section__eyebrow">Curated Selection</p>
              <h2 className="feature-section__title">Chef's Picks</h2>
              <p className="feature-section__sub">
                Handpicked by our team for quality, flavor &amp; value.
              </p>
            </Reveal>
            <div className="product-grid">
              {featured.map((p, i) => (
                <Reveal key={p._id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
            <Reveal className="feature-section__action">
              <Link to="/products?isFeatured=true" className="btn btn-primary btn-lg">
                View All Chef's Picks
              </Link>
            </Reveal>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════
          BRAND PARTNERS
          ═══════════════════════════════════════════ */}
      <section className="brands-section">
        <div className="container">
          <Reveal className="feature-section__head">
            <p className="feature-section__eyebrow">Our Partners</p>
            <h2 className="feature-section__title">Brand Partners</h2>
            <p className="feature-section__sub">
              We work with the world's finest purveyors to bring you the best.
            </p>
          </Reveal>
        </div>
        <div className="brands-carousel" ref={brandTrackRef}>
          <div className="brands-track">
            {[...BRAND_PARTNERS, ...BRAND_PARTNERS].map((b, i) => (
              <div key={i} className="brand-card">
              <img
                src={b.logo}
                alt={b.name}
                className="brand-card__logo-img"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span className="brand-card__name">{b.name}</span>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="cta-section">
        <div className="container">
          <Reveal className="cta-section__inner">
            <p className="cta-section__eyebrow">Get Started</p>
            <h2 className="cta-section__title">
              Ready to order<br />wholesale?
            </h2>
            <p className="cta-section__sub">
              Create an account for exclusive pricing, order tracking &amp; your personal product guide.
            </p>
            <div className="cta-section__actions">
              <Link to="/register" className="btn btn-gold btn-lg">Create Account</Link>
              <a href="tel:2154551600" className="btn btn-outline btn-lg">Call 215-455-1600</a>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}