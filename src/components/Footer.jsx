import { MessageCircle } from 'lucide-react';
import { CATEGORIES, KITCHEN } from '../data/kitchen';
import { waLink } from '../lib/helpers';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            <span className="brand-name" style={{ color: '#fff' }}>
              {KITCHEN.name}
              <small>{KITCHEN.tagline}</small>
            </span>
            <p style={{ maxWidth: '38ch', fontSize: '.9rem' }}>
              Fresh, made-to-order Andhra home cooking. A new menu is posted every day. Only accepted orders are
              cooked.
            </p>
            <a className="btn btn-wa" style={{ justifySelf: 'start' }} href={waLink('Hi Nimmi!')} target="_blank" rel="noreferrer">
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
          </div>
          <div>
            <h4>Menu</h4>
            <ul>
              <li><a href="#today">Today's menu</a></li>
              {CATEGORIES.map((c) => (
                <li key={c.id}><a href="#menu">{c.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Ordering</h4>
            <ul>
              <li><a href="#how">How it works</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li>{KITCHEN.paymentNote}</li>
              <li>{KITCHEN.deliveryNote}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {KITCHEN.name}</span>
          <a href="#/post-menu">For Nimmi: post today's menu</a>
        </div>
      </div>
    </footer>
  );
}
