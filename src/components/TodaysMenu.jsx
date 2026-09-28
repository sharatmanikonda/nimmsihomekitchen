import { Clock, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '../data/kitchen';
import { formatCutoff, formatDay, inr, waLink } from '../lib/helpers';
import AddControl, { VegMark } from './AddControl';

const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

export default function TodaysMenu({ menu, nextDate, status, ordersOpen, cart, setQty }) {
  return (
    <section className="section" id="today">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Today's menu</span>
            <h2 className="h-display">{status === 'loading' ? "What's cooking" : `For ${formatDay(menu ? menu.deliveryDate : nextDate)}`}</h2>
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
              <b>Menu coming soon.</b> Nimmi hasn't posted what she's cooking for {formatDay(nextDate)} yet. Check back
              soon, or{' '}
              <a href={waLink("Hi Nimmi, what's on the menu next?")} target="_blank" rel="noreferrer">
                ask on WhatsApp
              </a>
              . Pickles, podis and sweets can be requested from the full menu below.
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
                  <span className="dish-cat">{item.catLabel || catLabel[item.cat]}</span>
                  <VegMark nonVeg={item.nonVeg} />
                </div>
                <h3>{item.name}</h3>
                {item.sub && <p className="sub">{item.sub}</p>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {item.cat === 'curries' && item.unit === '500g' && <span className="chip gold">Min. 500g</span>}
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
