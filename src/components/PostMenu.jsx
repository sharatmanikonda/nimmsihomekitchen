import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, Download, Send } from 'lucide-react';
import { CATEGORIES, MENU, MENU_BY_ID } from '../data/kitchen';
import { buildBroadcast, inr } from '../lib/helpers';
import { Brand } from './Header';

// Owner tool: build the day's menu, then download todays-menu.json for the site
// and copy a ready-made WhatsApp broadcast for customers.

const pad = (n) => String(n).padStart(2, '0');
const istParts = (d) => {
  const ist = new Date(d.getTime() + 5.5 * 3600e3);
  return { date: ist.toISOString().slice(0, 10), time: `${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}` };
};

function initialState(current) {
  if (current) {
    const c = istParts(new Date(current.cutoff));
    return {
      deliveryDate: current.deliveryDate,
      cutoffDate: c.date,
      cutoffTime: c.time,
      slots: (current.deliverySlots || []).join('\n'),
      note: current.note || '',
      picked: Object.fromEntries(current.items.map((i) => [i.id, { on: true, limit: i.limit || '' }])),
    };
  }
  const today = istParts(new Date()).date;
  const tomorrow = istParts(new Date(Date.now() + 864e5)).date;
  return { deliveryDate: tomorrow, cutoffDate: today, cutoffTime: '20:00', slots: '', note: '', picked: {} };
}

export default function PostMenu({ current }) {
  const [s, setS] = useState(() => initialState(current));
  const [copied, setCopied] = useState('');
  useEffect(() => {
    if (current) setS(initialState(current));
  }, [current]);

  const set = (k) => (e) => setS((x) => ({ ...x, [k]: e.target.value }));
  const toggle = (id) =>
    setS((x) => ({ ...x, picked: { ...x.picked, [id]: { limit: '', ...x.picked[id], on: !x.picked[id]?.on } } }));
  const setLimit = (id, v) => setS((x) => ({ ...x, picked: { ...x.picked, [id]: { ...x.picked[id], on: true, limit: v } } }));

  const json = useMemo(() => {
    const items = MENU.filter((m) => s.picked[m.id]?.on).map((m) => {
      const lim = parseInt(s.picked[m.id].limit, 10);
      return lim > 0 ? { id: m.id, limit: lim } : { id: m.id };
    });
    return {
      postedOn: istParts(new Date()).date,
      deliveryDate: s.deliveryDate,
      cutoff: `${s.cutoffDate}T${s.cutoffTime}:00+05:30`,
      deliverySlots: s.slots.split('\n').map((x) => x.trim()).filter(Boolean),
      note: s.note.trim(),
      items,
    };
  }, [s]);

  const broadcast = useMemo(() => {
    const resolved = { ...json, items: json.items.map((i) => ({ ...MENU_BY_ID[i.id], limit: i.limit })) };
    return buildBroadcast(resolved, window.location.origin);
  }, [json]);

  const jsonText = JSON.stringify(json, null, 2);

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  };

  const download = () => {
    const blob = new Blob([jsonText + '\n'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'todays-menu.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <header className="header">
        <div className="wrap">
          <Brand />
          <a href="#top" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => (window.location.hash = '')}>
            <ArrowLeft size={15} /> Back to site
          </a>
        </div>
      </header>
      <main className="admin">
        <div className="wrap">
          <span className="eyebrow">For Nimmi</span>
          <h1 className="h-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', margin: '6px 0 8px' }}>Post today's menu</h1>
          <p className="muted" style={{ maxWidth: '70ch', marginBottom: 28 }}>
            Tick what you'll cook, set the cutoff, then <b>download todays-menu.json</b> and upload it to the website's{' '}
            <code>public</code> folder (or your host), replacing the old file. Copy the WhatsApp text to post in your
            customer group.
          </p>

          <div className="admin-grid">
            <div className="panel">
              <span className="panel-title">1 · Dates</span>
              <div className="two">
                <div className="field">
                  <label htmlFor="p-del">Delivery date</label>
                  <input id="p-del" type="date" value={s.deliveryDate} onChange={set('deliveryDate')} />
                </div>
                <div className="field">
                  <label htmlFor="p-cd">Order cutoff (IST)</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input id="p-cd" type="date" value={s.cutoffDate} onChange={set('cutoffDate')} />
                    <input type="time" aria-label="Cutoff time" value={s.cutoffTime} onChange={set('cutoffTime')} />
                  </div>
                </div>
              </div>
              <div className="field">
                <label htmlFor="p-slots">Delivery slots (one per line)</label>
                <textarea id="p-slots" value={s.slots} onChange={set('slots')} placeholder={'Lunch · 12:00 – 2:00 PM\nEvening · 5:00 – 7:30 PM'} />
              </div>
              <div className="field">
                <label htmlFor="p-note">Note to customers (optional)</label>
                <input id="p-note" value={s.note} onChange={set('note')} placeholder="e.g. Fresh gongura this week!" />
              </div>

              <span className="panel-title" style={{ marginTop: 8 }}>2 · Items ({json.items.length} picked)</span>
              {CATEGORIES.map((c) => (
                <div key={c.id}>
                  <div style={{ fontWeight: 800, fontSize: '.85rem', marginTop: 8 }}>{c.label}</div>
                  {MENU.filter((m) => m.cat === c.id).map((m) => (
                    <label className="pick" key={m.id}>
                      <input type="checkbox" checked={!!s.picked[m.id]?.on} onChange={() => toggle(m.id)} />
                      <span>
                        {m.name} <span className="fine">· {inr(m.price)} / {m.unit}</span>
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="No limit"
                        aria-label={`Quantity limit for ${m.name}`}
                        value={s.picked[m.id]?.limit ?? ''}
                        onChange={(e) => setLimit(m.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gap: 20, position: 'sticky', top: 90 }}>
              <div className="panel">
                <span className="panel-title">3 · WhatsApp message</span>
                <textarea className="out" readOnly value={broadcast} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-ink btn-sm" onClick={() => copy(broadcast, 'wa')}>
                    <Copy size={14} /> {copied === 'wa' ? 'Copied!' : 'Copy text'}
                  </button>
                  <a className="btn btn-wa btn-sm" href={`https://wa.me/?text=${encodeURIComponent(broadcast)}`} target="_blank" rel="noreferrer">
                    <Send size={14} /> Share on WhatsApp
                  </a>
                </div>
              </div>
              <div className="panel">
                <span className="panel-title">4 · Website file</span>
                <textarea className="out" readOnly value={jsonText} style={{ minHeight: 160 }} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-leaf btn-sm" onClick={download} disabled={!json.items.length}>
                    <Download size={14} /> Download todays-menu.json
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => copy(jsonText, 'json')}>
                    <Copy size={14} /> {copied === 'json' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
