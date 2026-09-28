import { useEffect, useState } from 'react';
import { CheckCircle2, Send, X } from 'lucide-react';
import { KITCHEN } from '../data/kitchen';
import { buildOrderMessage, formatCutoff, formatDay, inr, makeOrderRef, waLink } from '../lib/helpers';
import AddControl from './AddControl';

const FORM_KEY = 'nhk-customer';

function loadForm() {
  try {
    return { name: '', phone: '', address: '', pickup: false, ...JSON.parse(localStorage.getItem(FORM_KEY) || '{}'), notes: '', slot: '' };
  } catch {
    return { name: '', phone: '', address: '', pickup: false, notes: '', slot: '' };
  }
}

export default function CartDrawer({ menu, lines, total, ordersOpen, setQty, onClear, onClose }) {
  const [form, setForm] = useState(loadForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null); // order ref once sent

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const slots = menu?.deliverySlots || [];
  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(({ [k]: _, ...rest }) => rest);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit phone number';
    if (!form.pickup && !form.address.trim()) e.address = 'Where should we deliver?';
    if (slots.length && !form.slot) e.slot = 'Pick a delivery time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const send = () => {
    if (!ordersOpen || !lines.length || !validate()) return;
    const ref = makeOrderRef(menu.deliveryDate);
    const text = buildOrderMessage({ ref, menu, lines, total, form });
    try {
      const { name, phone, address, pickup } = form;
      localStorage.setItem(FORM_KEY, JSON.stringify({ name, phone, address, pickup }));
    } catch {
      /* ignore */
    }
    window.open(waLink(text), '_blank', 'noopener');
    setSent(ref);
    onClear();
  };

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your order">
        <div className="drawer-head">
          <div>
            <h3>{sent ? 'Order request sent' : 'Your order'}</h3>
            {menu && !sent && <span className="fine">For {formatDay(menu.deliveryDate)} · order by {formatCutoff(menu.cutoff)}</span>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {sent ? (
          <div className="drawer-body">
            <div className="sent">
              <CheckCircle2 size={48} color="var(--leaf)" />
              <p>Your order reference is</p>
              <span className="ref">{sent}</span>
              <p className="muted">If WhatsApp didn't open, message Nimmi and quote this reference.</p>
              <div className="panel" style={{ textAlign: 'left', width: '100%' }}>
                <span className="panel-title">What happens next</span>
                <ol>
                  <li>Nimmi reviews your request on WhatsApp.</li>
                  <li>She replies to <b>accept</b> it and shares UPI details.</li>
                  <li>Your order is cooked fresh and delivered at your chosen time.</li>
                </ol>
                <p className="fine">Your order is confirmed only when Nimmi accepts it. Only accepted orders are cooked.</p>
              </div>
              <button className="btn btn-ink" onClick={onClose}>Done</button>
            </div>
          </div>
        ) : !lines.length ? (
          <div className="drawer-body">
            <div className="sent">
              <p className="serif" style={{ fontSize: '1.3rem' }}>Nothing added yet.</p>
              <p className="muted">
                {ordersOpen ? "Add dishes from today's menu to start your order." : 'Orders are closed for this menu. The next menu will be posted soon.'}
              </p>
              <a href="#today" className="btn btn-ink" onClick={onClose}>See today's menu</a>
            </div>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              {!ordersOpen && (
                <div className="closed-banner" style={{ margin: 0 }}>
                  The cutoff has passed, so this order can't be sent. Watch for the next menu.
                </div>
              )}
              <div>
                {lines.map((l) => (
                  <div className="line" key={l.id} style={{ marginBottom: 14 }}>
                    <div>
                      <div className="nm">{l.name}</div>
                      <div className="un">
                        {inr(l.price)} / {l.unit}
                        {l.cat === 'curries' && ` · ${l.qty * 500 >= 1000 ? `${(l.qty * 500) / 1000} kg` : '500g'} total`}
                      </div>
                    </div>
                    <div className="amt">{inr(l.qty * l.price)}</div>
                    <div>
                      <AddControl item={l} qty={l.qty} setQty={setQty} disabled={!ordersOpen} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="panel">
                <span className="panel-title">Your details</span>
                <div className="field">
                  <label htmlFor="f-name">Name</label>
                  <input id="f-name" value={form.name} onChange={update('name')} autoComplete="name" />
                  {errors.name && <span className="err">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Phone (WhatsApp)</label>
                  <input id="f-phone" type="tel" inputMode="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" />
                  {errors.phone && <span className="err">{errors.phone}</span>}
                </div>
                <div className="seg" role="group" aria-label="Delivery or pickup">
                  <button type="button" aria-pressed={!form.pickup} onClick={() => setForm((f) => ({ ...f, pickup: false }))}>Delivery</button>
                  <button type="button" aria-pressed={form.pickup} onClick={() => setForm((f) => ({ ...f, pickup: true }))}>Pickup</button>
                </div>
                {!form.pickup && (
                  <div className="field">
                    <label htmlFor="f-addr">Delivery address</label>
                    <textarea id="f-addr" value={form.address} onChange={update('address')} autoComplete="street-address" />
                    {errors.address && <span className="err">{errors.address}</span>}
                  </div>
                )}
                {slots.length > 0 && (
                  <div className="field">
                    <label htmlFor="f-slot">{form.pickup ? 'Pickup time' : 'Delivery time'}</label>
                    <select id="f-slot" value={form.slot} onChange={update('slot')}>
                      <option value="">Choose…</option>
                      {slots.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    {errors.slot && <span className="err">{errors.slot}</span>}
                  </div>
                )}
                <div className="field">
                  <label htmlFor="f-notes">Notes (optional)</label>
                  <input id="f-notes" value={form.notes} onChange={update('notes')} placeholder="Spice level, sweet or hot gavvalu…" />
                </div>
              </div>
            </div>

            <div className="drawer-foot">
              <div className="total-row">
                <span>Total</span>
                <span>{inr(total)}</span>
              </div>
              <p className="fine">{KITCHEN.deliveryNote} {KITCHEN.paymentNote}</p>
              <button className="btn btn-wa btn-block" onClick={send} disabled={!ordersOpen}>
                <Send size={17} /> Send order request on WhatsApp
              </button>
              <p className="fine" style={{ textAlign: 'center' }}>
                Nothing is charged now. Your order is confirmed when Nimmi accepts it.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
