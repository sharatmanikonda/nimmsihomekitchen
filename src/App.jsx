import { useEffect, useMemo, useState } from 'react';
import { menuShownUntil, nextMenuDate, useNow, useTodaysMenu } from './lib/helpers';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import TodaysMenu from './components/TodaysMenu';
import FullMenu from './components/FullMenu';
import About from './components/About';
import Faq from './components/Faq';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import PostMenu from './components/PostMenu';
import { inr } from './lib/helpers';

const CART_KEY = 'nhk-cart';

function loadCart(deliveryDate) {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || 'null');
    return saved && saved.deliveryDate === deliveryDate ? saved.items : {};
  } catch {
    return {};
  }
}

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

export default function App() {
  const route = useHashRoute();
  const { status, menu: posted, checkedAt, reload } = useTodaysMenu();
  const now = useNow();
  // A menu stays up until the end of its delivery day; orders close at its cutoff.
  // After that the site shows "coming soon" until Nimmi posts the next one.
  const menu = posted && now < menuShownUntil(posted) ? posted : null;
  const nextDate = menu ? null : nextMenuDate(posted, now);
  const [cart, setCart] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Restore the cart once the menu is known; a cart from an older menu is dropped.
  useEffect(() => {
    if (menu) setCart(loadCart(menu.deliveryDate));
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ deliveryDate: menu.deliveryDate, items: cart }));
    } catch {
      /* storage unavailable — cart just won't persist */
    }
  }, [cart, menu]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const cutoffMs = menu ? new Date(menu.cutoff).getTime() : 0;
  const ordersOpen = !!menu && now < cutoffMs;
  const todayIds = useMemo(() => new Set(menu?.items.map((i) => i.id) || []), [menu]);

  const lines = useMemo(
    () => (menu ? menu.items.filter((i) => cart[i.id] > 0).map((i) => ({ ...i, qty: cart[i.id] })) : []),
    [menu, cart]
  );
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0);

  const setQty = (item, qty) => {
    const max = item.limit || 20;
    const q = Math.max(0, Math.min(max, qty));
    setCart((c) => {
      const next = { ...c };
      if (q === 0) delete next[item.id];
      else next[item.id] = q;
      return next;
    });
    if (!cart[item.id] && q > 0) setToast(`Added ${item.name}`);
  };

  if (route === '#/post-menu') return <PostMenu posted={posted} status={status} now={now} checkedAt={checkedAt} reload={reload} />;

  const shared = { menu, nextDate, status, now, ordersOpen, cutoffMs };

  return (
    <>
      <Header {...shared} count={count} onOpenCart={() => setDrawerOpen(true)} />
      <main>
        <Hero {...shared} />
        <HowItWorks />
        <TodaysMenu {...shared} cart={cart} setQty={setQty} />
        <FullMenu {...shared} todayIds={todayIds} cart={cart} setQty={setQty} />
        <About />
        <Faq />
      </main>
      <Footer />

      <button className={`cartbar ${count > 0 && !drawerOpen ? 'show' : ''}`} onClick={() => setDrawerOpen(true)}>
        <span>
          <b>{count} item{count === 1 ? '' : 's'}</b> · {inr(total)}
        </span>
        <span className="btn btn-sm">Review order</span>
      </button>

      {drawerOpen && (
        <CartDrawer
          menu={menu}
          lines={lines}
          total={total}
          ordersOpen={ordersOpen}
          setQty={setQty}
          onClear={() => setCart({})}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
