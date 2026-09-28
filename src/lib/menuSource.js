import { KITCHEN } from '../data/kitchen';

// Where the day's menu comes from: Nimmi's Google Sheet when KITCHEN.menuSheetId is set,
// otherwise public/todays-menu.json. Both return the same shape:
//   { deliveryDate: 'YYYY-MM-DD', cutoff: ISO string, deliverySlots: [], note: '', items: [{ id, limit? }] }
// or null when no menu has been posted.

const DAY_MS = 864e5;
const pad = (n) => String(n).padStart(2, '0');

export const addDays = (isoDate, n) => new Date(Date.parse(`${isoDate}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);

export const istDate = (ms) => new Date(ms + 5.5 * 3600e3).toISOString().slice(0, 10);

export function loadMenu() {
  return KITCHEN.menuSheetId ? loadSheetMenu(KITCHEN.menuSheetId) : loadJsonMenu();
}

async function loadJsonMenu() {
  const r = await fetch(`${KITCHEN.todaysMenuUrl}?t=${Date.now()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`menu file: HTTP ${r.status}`);
  return r.json();
}

// ---- Google Sheet ----------------------------------------------------------
// The sheet must be shared as "Anyone with the link: Viewer". Two tabs:
//   Menu     — header row with "id", "Today" (Yes/No or tick box) and "Limit"; one row per dish.
//   Settings — header row "Delivery date", "Cutoff time", "Cutoff date", "Delivery slots", "Note",
//              values in row 2. Each setting has its own column because the Sheets query API
//              drops cells whose type doesn't match the rest of their column.

async function fetchTab(sheetId, tab) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(tab)}`;
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`sheet tab "${tab}": HTTP ${r.status}`);
  const text = await r.text();
  // The body is JSON wrapped in a JS callback: google.visualization.Query.setResponse({...});
  const res = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  if (res.status === 'error') throw new Error(`sheet tab "${tab}": ${res.errors?.[0]?.detailed_message || 'error'}`);
  const labels = res.table.cols.map((c) => (c.label || '').trim().toLowerCase());
  const rows = res.table.rows.map((row) => row.c || []);
  return { labels, rows };
}

const text = (cell) => String(cell?.f ?? cell?.v ?? '').trim();

function toIsoDate(cell) {
  if (!cell || cell.v == null) return null;
  let m = typeof cell.v === 'string' && cell.v.match(/^Date\((\d+),(\d+),(\d+)/); // month is 0-based
  if (m) return `${m[1]}-${pad(+m[2] + 1)}-${pad(m[3])}`;
  const s = text(cell);
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if ((m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/))) return `${m[3]}-${pad(m[2])}-${pad(m[1])}`; // dd/mm/yyyy
  return null;
}

function toTime(cell) {
  if (!cell || cell.v == null) return null;
  const v = cell.v;
  if (Array.isArray(v)) return `${pad(v[0])}:${pad(v[1])}`; // time-of-day cell: [h, m, s, ms]
  let m = typeof v === 'string' && v.match(/^Date\(\d+,\d+,\d+,(\d+),(\d+)/);
  if (m) return `${pad(m[1])}:${pad(m[2])}`;
  m = text(cell).toLowerCase().match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?/);
  if (!m) return null;
  const h = (+m[1] % (m[3] ? 12 : 24)) + (m[3] === 'pm' ? 12 : 0);
  return `${pad(h)}:${pad(m[2] || 0)}`;
}

const isTicked = (cell) => cell?.v === true || /^(true|yes|y|x|✓|✔|1)$/i.test(text(cell));

async function loadSheetMenu(sheetId) {
  const [menuTab, settingsTab] = await Promise.all([fetchTab(sheetId, 'Menu'), fetchTab(sheetId, 'Settings')]);

  const [iId, iToday, iLimit] = ['id', 'today', 'limit'].map((l) => menuTab.labels.indexOf(l));
  if (iId < 0 || iToday < 0) throw new Error('Menu tab needs "id" and "Today" columns');
  const items = menuTab.rows
    .filter((r) => isTicked(r[iToday]) && text(r[iId]))
    .map((r) => {
      const limit = parseInt(text(r[iLimit]), 10);
      return limit > 0 ? { id: text(r[iId]), limit } : { id: text(r[iId]) };
    });

  const row = settingsTab.rows[0] || [];
  const setting = (label) => row[settingsTab.labels.indexOf(label)];
  const deliveryDate = toIsoDate(setting('delivery date'));
  if (!deliveryDate || !items.length) return null;

  const cutoffDate = toIsoDate(setting('cutoff date')) || addDays(deliveryDate, -1);
  const cutoffTime = toTime(setting('cutoff time')) || '20:00';
  return {
    deliveryDate,
    cutoff: `${cutoffDate}T${cutoffTime}:00+05:30`,
    deliverySlots: text(setting('delivery slots')).split(/\n|\|/).map((s) => s.trim()).filter(Boolean),
    note: text(setting('note')),
    items,
  };
}
