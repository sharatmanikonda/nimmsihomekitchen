import { useState } from 'react';
import { CATEGORIES, MENU, MENU_BY_ID } from '../data/kitchen';
import { buildEnquiryMessage, inr, waLink } from '../lib/helpers';
import AddControl, { VegMark } from './AddControl';

const DIETS = [
  { id: 'all', label: 'All' },
  { id: 'veg', label: 'Veg' },
  { id: 'nonveg', label: 'Non-veg' },
];

export default function FullMenu({ menu, ordersOpen, todayIds, cart, setQty }) {
  const [cat, setCat] = useState('all');
  const [diet, setDiet] = useState('all');

  const cats = CATEGORIES.filter((c) => cat === 'all' || c.id === cat);
  const matchesDiet = (m) => diet === 'all' || (diet === 'nonveg' ? m.nonVeg : !m.nonVeg);

  return (
    <section className="section fullmenu" id="menu">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">The full menu</span>
            <h2 className="h-display">Nimmi's regulars</h2>
          </div>
          <p className="muted">
            These are the dishes Nimmi makes often. Items on today's menu can be added to your order. For anything else,
            tap <b>Ask</b> to check when the next batch is ready.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
          <div className="tabs" role="group" aria-label="Category" style={{ marginBottom: 0 }}>
            <button className="tab" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
              Everything
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className="tab" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="filters seg" role="group" aria-label="Diet" style={{ width: 240 }}>
            {DIETS.slice(1).map((d) => (
              <button key={d.id} aria-pressed={diet === d.id} onClick={() => setDiet(diet === d.id ? 'all' : d.id)}>
                {d.label} only
              </button>
            ))}
          </div>
        </div>

        <div className="menu-cats" style={{ marginTop: 28 }}>
          {cats.map((c) => {
            const items = MENU.filter((m) => m.cat === c.id && matchesDiet(m));
            if (!items.length) return null;
            return (
              <div className="menu-cat" key={c.id}>
                <div className="menu-cat-head">
                  <img src={c.image} alt="" loading="lazy" />
                  <div>
                    <h3>{c.label}</h3>
                    <div className="native">{c.native}</div>
                    <p>{c.blurb}</p>
                  </div>
                </div>
                <ul className="menu-list">
                  {items.map((m) => {
                    const onToday = todayIds.has(m.id);
                    const item = onToday ? menu.items.find((i) => i.id === m.id) : MENU_BY_ID[m.id];
                    return (
                      <li className="menu-row" key={m.id}>
                        <VegMark nonVeg={m.nonVeg} />
                        <span className="name">{m.name}</span>
                        <span className="meta">
                          {m.sub && <span>{m.sub}</span>}
                          {m.sub && <span aria-hidden>·</span>}
                          <span>
                            <b style={{ color: 'var(--ink)' }}>{inr(m.price)}</b> / {m.unit}
                          </span>
                          {onToday && <span className="chip">On today's menu</span>}
                        </span>
                        <span className="right">
                          {onToday && ordersOpen ? (
                            <AddControl item={item} qty={cart[m.id]} setQty={setQty} />
                          ) : (
                            <a
                              className="btn btn-ghost btn-sm"
                              href={waLink(buildEnquiryMessage(m))}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Ask
                            </a>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
