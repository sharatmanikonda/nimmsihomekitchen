import { ShoppingBag } from 'lucide-react';
import { KITCHEN } from '../data/kitchen';
import { countdown, formatCutoff, formatDay } from '../lib/helpers';

export function Brand() {
  return (
    <a href="#top" className="brand" aria-label={KITCHEN.name}>
      <span className="brand-mark" aria-hidden>N</span>
      <span className="brand-name">
        {KITCHEN.name}
        <small>{KITCHEN.tagline}</small>
      </span>
    </a>
  );
}

function StatusBar({ menu, nextDate, status, now, ordersOpen, cutoffMs }) {
  let content;
  if (status === 'loading') content = <span>Loading today's menu…</span>;
  else if (!menu)
    content = (
      <>
        <span className="dot closed" />
        <span>
          The menu for <b>{formatDay(nextDate)}</b> is coming soon. Pickles, podis and sweets can be requested on WhatsApp.
        </span>
      </>
    );
  else if (!ordersOpen)
    content = (
      <>
        <span className="dot closed" />
        <span>
          Menu for <b>{formatDay(menu.deliveryDate)}</b> · orders closed at {formatCutoff(menu.cutoff)}
        </span>
      </>
    );
  else
    content = (
      <>
        <span className="dot" />
        <span>
          Taking orders for <b>{formatDay(menu.deliveryDate)}</b> · closes in <strong>{countdown(cutoffMs - now)}</strong>
        </span>
      </>
    );
  return (
    <div className="statusbar" role="status">
      <div className="wrap">{content}</div>
    </div>
  );
}

export default function Header(props) {
  const { count, onOpenCart } = props;
  return (
    <>
      <StatusBar {...props} />
      <header className="header" id="top">
        <div className="wrap">
          <Brand />
          <nav className="nav" aria-label="Main">
            <a href="#today">Today's menu</a>
            <a href="#menu">Full menu</a>
            <a href="#how">How it works</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
          </nav>
          <button className="btn btn-ink btn-sm cart-btn" onClick={onOpenCart} aria-label={`Your order, ${count} items`}>
            <ShoppingBag size={16} /> Your order
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
        </div>
      </header>
    </>
  );
}
