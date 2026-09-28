import { Clock, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '../data/kitchen';
import { formatCutoff, formatDay, inr, waLink } from '../lib/helpers';
import AddControl, { VegMark } from './AddControl';

const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

export default function TodaysMenu({ menu, status, ordersOpen, cart, setQty }) {
  return (
    <section className="section" id="today">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Today's menu</span>
            <h2 className="h-display">{menu ? `For ${formatDay(menu.deliveryDate)}` : "What's cooking"}</h2>
          </div>
          {menu && (
            <p className="muted">
              <Clock size={15} style={{ verticalAlign: '-2px' }} /> Order by <b>{formatCutoff(menu.cutoff)}</b>.
              {menu.deliverySlots?.length ? ` Delivery: ${menu.deliverySlots.join(', ')}.` : ''}
            </p>
          )}
        </div>

        {status === 'loading' && <p className="muted">Loading…</p>}

        {status !== 'loading' && !menu && (
          <div className="closed-banner">
            <MessageCircle size={22} />
            <div>
              Today's menu hasn't been posted yet.{' '}
              <a href={waLink("Hi Nimmi, what's on the menu next?")} target="_blank" rel="noreferrer">
                Ask on WhatsApp
              </a>
              .
            </div>
          </div>
        )}

        {menu && !ordersOpen && (
          <div className="closed-banner">
            <Clock size={22} />
            <div>
              <b>Orders for this menu are closed.</b> Nimmi is cooking the accepted orders now. The next menu will be
              posted here soon. Pickles, podis and sweets can still be requested from the full menu below.
            </div>
          </div>
        )}

        {menu?.note && (
          <div className="note-card">
            <b>A note from Nimmi</b>
            {menu.note}
          </div>
        )}

        {menu && (
          <div className="dish-grid">
            {menu.items.map((item) => (
              <article className="dish" key={item.id}>
                <div className="dish-top">
                  <span className="dish-cat">{catLabel[item.cat]}</span>
                  <VegMark nonVeg={item.nonVeg} />
                </div>
                <h3>{item.name}</h3>
                {item.sub && <p className="sub">{item.sub}</p>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {item.cat === 'curries' && <span className="chip gold">Min. 500g</span>}
                  {item.limit && <span className="chip warn">Only {item.limit} available</span>}
                </div>
                <div className="dish-bottom">
                  <span className="price">
                    {inr(item.price)} <small>/ {item.unit}</small>
                  </span>
                  <AddControl item={item} qty={cart[item.id]} setQty={setQty} disabled={!ordersOpen} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
