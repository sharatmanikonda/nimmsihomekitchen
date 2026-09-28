import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, Download, ExternalLink, RefreshCw, Send } from 'lucide-react';
import { CATEGORIES, KITCHEN, MENU, MENU_BY_ID } from '../data/kitchen';
import { buildBroadcast, formatCutoff, formatDay, formatTime, inr } from '../lib/helpers';
import { Brand } from './Header';

// Owner tool at #/post-menu. With a menu sheet: check what the sheet will show on the site, then
// share a ready-made message to the WhatsApp group. Without one: build the menu here and
// download todays-menu.json for the site.

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

const sheetUrl = KITCHEN.menuSheetId && `https://docs.google.com/spreadsheets/d/${KITCHEN.menuSheetId}/edit`;
const siteUrl = () => window.location.origin + import.meta.env.BASE_URL;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function AdminHeader() {
  return (
    <header className="header">
      <div className="wrap">
        <Brand />
        <a href="#top" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => (window.location.hash = '')}>
          <ArrowLeft size={15} /> Back to site
        </a>
      </div>
    </header>
  );
}

export default function PostMenu(props) {
  return sheetUrl ? <SheetPostMenu {...props} /> : <FilePostMenu current={props.posted} />;
}

function SheetPostMenu({ posted, status, now, checkedAt, reload }) {
  const [copied, setCopied] = useState(false);
  const open = !!posted && now < new Date(posted.cutoff).getTime();
  const broadcast = useMemo(() => (posted ? buildBroadcast(posted, siteUrl()) : ''), [posted]);

  let check;
  if (status === 'loading') check = <p className="muted">Reading your menu sheet…</p>;
  else if (status === 'error')
    check = (
      <div className="closed-banner">
        <div>
          <b>The website can't read the menu sheet.</b> In the sheet, check that Share is set to "Anyone with the link"
          and that the tabs are still called Menu and Settings.
        </div>
      </div>
    );
  else if (!posted)
    check = (
      <div className="closed-banner">
        <div>
          <b>No menu in the sheet yet.</b> Fill in the Delivery date in Settings and set Today to "Yes" for at least one
          dish that has a price.
        </div>
      </div>
    );
  else
    check = (
      <>
        {!open && (
          <div className="closed-banner">
            <div>
              <b>This menu's cutoff ({formatCutoff(posted.cutoff)}) has passed.</b> Customers can still see it until the
              end of {formatDay(posted.deliveryDate)}, but can't order. For a new menu, set a new Delivery date.
            </div>
          </div>
        )}
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{formatDay(posted.deliveryDate)}</div>
          <div className="fine">
            Order by {formatCutoff(posted.cutoff)}
            {posted.deliverySlots?.length ? ` · ${posted.deliverySlots.join(', ')}` : ''}
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {posted.items.map((it) => (
            <li key={it.id} className="pick" style={{ gridTemplateColumns: '1fr auto' }}>
              <span>
                {it.name} <span className="fine">· {it.unit}{it.nonVeg ? ' · non-veg' : ''}{it.limit ? ` · only ${it.limit}` : ''}</span>
              </span>
              <b>{inr(it.price)}</b>
            </li>
          ))}
        </ul>
        {posted.note && <div className="fine">Note: {posted.note}</div>}
        {posted.skipped?.length > 0 && (
          <div className="closed-banner">
            <div>
              <b>Not shown on the website:</b> {posted.skipped.join(', ')}. These are set to "Yes" but have no price.
            </div>
          </div>
        )}
      </>
    );

  return (
    <>
      <AdminHeader />
      <main className="admin">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <span className="eyebrow">For Nimmi</span>
          <h1 className="h-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', margin: '6px 0 24px' }}>Post today's menu</h1>

          <div style={{ display: 'grid', gap: 20 }}>
            <div className="panel">
              <span className="panel-title">1 · Update your menu sheet</span>
              <p className="muted" style={{ margin: 0 }}>
                In <b>Settings</b>, pick the Delivery date and cutoff time. In <b>Menu</b>, set Today to "Yes" for each dish
                you're making, with its portion and price. Add a new row for any new dish.
              </p>
              <div>
                <a className="btn btn-leaf btn-sm" href={sheetUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={14} /> Open menu sheet
                </a>
              </div>
            </div>

            <div className="panel">
              <span className="panel-title">2 · Check the menu on the website</span>
              {check}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-sm" onClick={reload}>
                  <RefreshCw size={14} /> Check again
                </button>
                {checkedAt && <span className="fine">Last checked {formatTime(new Date(checkedAt).toISOString())}. Sheet changes can take a minute to show.</span>}
              </div>
            </div>

            <div className="panel">
              <span className="panel-title">3 · Share on WhatsApp</span>
              {open ? (
                <>
                  <textarea className="out" readOnly value={broadcast} />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <a className="btn btn-wa btn-sm" href={`https://wa.me/?text=${encodeURIComponent(broadcast)}`} target="_blank" rel="noreferrer">
                      <Send size={14} /> Share to WhatsApp group
                    </a>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={async () => {
                        if (await copyText(broadcast)) {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1800);
                        }
                      }}
                    >
                      <Copy size={14} /> {copied ? 'Copied!' : 'Copy text'}
                    </button>
                  </div>
                </>
              ) : (
                <p className="muted" style={{ margin: 0 }}>The message appears here once step 2 shows a menu that's open for orders.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function FilePostMenu({ current }) {
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
    return buildBroadcast(resolved, siteUrl());
  }, [json]);

  const jsonText = JSON.stringify(json, null, 2);

  const copy = async (text, which) => {
    if (!(await copyText(text))) return setCopied('');
    setCopied(which);
    setTimeout(() => setCopied(''), 1800);
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
      <AdminHeader />
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
