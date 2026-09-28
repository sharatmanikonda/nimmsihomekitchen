import { useEffect, useState } from 'react';
import { KITCHEN, MENU_BY_ID } from '../data/kitchen';
import { addDays, istDate, loadMenu } from './menuSource';

export const inr = (n) => '₹' + n.toLocaleString('en-IN');

const TZ = 'Asia/Kolkata';
const DAY_MS = 864e5;

export function formatDay(isoDate, opts = { weekday: 'long', day: 'numeric', month: 'short' }) {
  // isoDate like 2026-09-28 — anchor at noon IST so the weekday never shifts.
  return new Date(`${isoDate}T12:00:00+05:30`).toLocaleDateString('en-IN', { ...opts, timeZone: TZ });
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
}

export function formatCutoff(iso) {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ });
  return `${formatTime(iso)}, ${day}`;
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function countdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (x) => String(x).padStart(2, '0');
  return h > 0 ? `${h}h ${pad(m)}m ${pad(sec)}s` : `${pad(m)}m ${pad(sec)}s`;
}

// Loads the posted menu (see lib/menuSource.js) and re-checks every few minutes so a menu
// Nimmi posts while the page is open shows up. Returns { status, menu, checkedAt, reload };
// menu is null if none is posted. reload() checks again right away.
export function useTodaysMenu(refreshMs = 3 * 60e3) {
  const [state, setState] = useState({ status: 'loading', menu: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let last = null;
    const load = () =>
      loadMenu()
        .then((raw) => {
          const key = JSON.stringify(raw);
          if (key === last) return setState((s) => ({ ...s, checkedAt: Date.now() }));
          last = key;
          // Sheet items are complete dishes; JSON items are catalogue ids with an optional limit.
          const items = (raw?.items || [])
            .map((it) => (it.name ? it : MENU_BY_ID[it.id] && { ...MENU_BY_ID[it.id], limit: it.limit }))
            .filter(Boolean);
          setState({ status: 'ready', menu: items.length ? { ...raw, items } : null, checkedAt: Date.now() });
        })
        .catch((err) => {
          console.error('Could not load the menu:', err);
          if (last === null) setState({ status: 'error', menu: null });
        });
    load();
    const t = setInterval(load, refreshMs);
    return () => clearInterval(t);
  }, [refreshMs, attempt]);
  return { ...state, reload: () => setAttempt((n) => n + 1) };
}

// The date the next menu is expected for, shown while no menu is open for orders: the day after
// the last posted delivery date, or later if that menu's cutoff was days ago.
export function nextMenuDate(posted, now) {
  if (!posted) return addDays(istDate(now), 1);
  const days = Math.floor((now - new Date(posted.cutoff).getTime()) / DAY_MS) + 1;
  return addDays(posted.deliveryDate, Math.max(1, days));
}

export const waLink = (text) => `https://wa.me/${KITCHEN.whatsappNumber}?text=${encodeURIComponent(text)}`;

export function makeOrderRef(deliveryDate) {
  const d = (deliveryDate || '').slice(5).replace('-', '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NHK-${d}-${rand}`;
}

export function buildOrderMessage({ ref, menu, lines, total, form }) {
  const out = [];
  out.push(`*New order request — ${KITCHEN.name}*`);
  out.push(`Ref: ${ref}`);
  out.push(`For: ${formatDay(menu.deliveryDate)}${form.slot ? ` · ${form.slot}` : ''}`);
  out.push('');
  lines.forEach((l, i) => {
    out.push(`${i + 1}. ${l.name} — ${l.qty} × ${l.unit} = ${inr(l.qty * l.price)}`);
  });
  out.push('');
  out.push(`*Total: ${inr(total)}* (before delivery charges)`);
  out.push('');
  out.push(`Name: ${form.name}`);
  out.push(`Phone: ${form.phone}`);
  out.push(`${form.pickup ? 'Pickup from kitchen' : `Address: ${form.address}`}`);
  if (form.notes.trim()) out.push(`Notes: ${form.notes.trim()}`);
  out.push('');
  out.push('Please confirm if you can accept this order. Thank you!');
  return out.join('\n');
}

export function buildEnquiryMessage(item) {
  return `Hi Nimmi, is *${item.name}* (${item.unit}, ${inr(item.price)}) available? When is the next batch?`;
}

// The group message, written the way Nimmi posts: greeting, dishes with portion and price, cutoff.
export function buildBroadcast(menu, siteUrl) {
  const slots = menu.deliverySlots || [];
  const forWhen = slots.length === 1 ? ` for ${slots[0].split('·')[0].trim().toLowerCase()}` : '';
  const out = [];
  out.push(`Hi all, menu${forWhen} on *${formatDay(menu.deliveryDate)}*:`);
  out.push('');
  menu.items.forEach((it) => {
    const tags = [it.nonVeg && 'non-veg', it.limit && `only ${it.limit}`].filter(Boolean);
    out.push(`• ${it.name} (${it.unit} ${inr(it.price)}/-)${tags.length ? ` — ${tags.join(', ')}` : ''}`);
  });
  if (menu.note) out.push('', menu.note);
  out.push('');
  out.push(`If interested, order by *${formatCutoff(menu.cutoff)}*.`);
  if (slots.length > 1) out.push(`Delivery: ${slots.join(' | ')}`);
  if (siteUrl) out.push(`Order here: ${siteUrl}`);
  return out.join('\n');
}
