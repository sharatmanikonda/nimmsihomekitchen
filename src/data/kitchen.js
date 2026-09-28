// Business settings. Edit these once; they rarely change.
const BASE = import.meta.env.BASE_URL;

export const KITCHEN = {
  name: "Nimmi's Home Kitchen",
  tagline: 'Homemade meals with authentic flavours',
  // Nimmi's WhatsApp number with country code, digits only.
  whatsappNumber: '919652318485',
  // Nimmi's Google Sheet for the daily menu: the long id between /d/ and /edit in its URL.
  // The sheet must be shared as "Anyone with the link: Viewer". See sheet-template/README.md.
  // Leave empty to load public/todays-menu.json instead.
  menuSheetId: '1xII0bb0NRHMJnSCfZUBXA3cUg_WJ_iFrUVP9zXKETpA',
  // Used only when menuSheetId is empty.
  todaysMenuUrl: `${BASE}todays-menu.json`,
  deliveryNote: 'Delivery charges, if any, are confirmed on WhatsApp along with your order.',
  paymentNote: 'Pay by UPI after Nimmi accepts your order.',
};

export const CATEGORIES = [
  { id: 'pickles', label: 'Pickles', native: 'Pachadi', blurb: 'Small-batch Andhra pickles, packed in 250g jars.', image: `${BASE}images/pickles_showcase.jpg` },
  { id: 'podis', label: 'Podis', native: 'Spice powders', blurb: 'Traditional roasted powders for rice, idli and dosa.', image: `${BASE}images/podis_showcase.jpg` },
  { id: 'sweets', label: 'Sweets', native: 'Homemade', blurb: 'Laddus and festive sweets made in the home kitchen.', image: `${BASE}images/sweets_showcase.jpg` },
  { id: 'curries', label: 'Pre-order curries', native: 'Min. 500g', blurb: 'Cooked to order. Sold in 500g portions, minimum one portion.', image: `${BASE}images/curries_showcase.jpg` },
  { id: 'snacks', label: 'Savories', native: 'Snacks', blurb: 'Crispy tea-time snacks, fried fresh.', image: `${BASE}images/savories_showcase.jpg` },
  { id: 'batters', label: 'Fresh batters', native: 'Idli / Dosa', blurb: 'Ground and fermented fresh for your order.', image: `${BASE}images/batters_showcase.jpg` },
];

// The full "frequent items" catalogue. Today's menu picks from these ids.
// unit = what one quantity step buys; price is per unit.
export const MENU = [
  { id: 'avakaya', cat: 'pickles', name: 'Andhra Avakaya (Mango) Pachadi', price: 220, unit: '250g jar' },
  { id: 'gongura-pachadi', cat: 'pickles', name: 'Gongura Pachadi', sub: 'Traditional sorrel pickle', price: 190, unit: '250g jar' },
  { id: 'tomato-thokku', cat: 'pickles', name: 'Andhra Tomato Thokku Pachadi', sub: 'Spiced tangy pickle', price: 180, unit: '250g jar' },
  { id: 'usirikaya', cat: 'pickles', name: 'Usirikaya Pachadi', sub: 'Amla / gooseberry', price: 200, unit: '250g jar' },
  { id: 'allam', cat: 'pickles', name: 'Homestyle Allam Pachadi', sub: 'Ginger', price: 190, unit: '250g jar' },
  { id: 'chicken-pickle', cat: 'pickles', name: 'Boneless Spiced Chicken Pickle', sub: 'Andhra style', price: 390, unit: '250g jar', nonVeg: true },
  { id: 'prawns-pachadi', cat: 'pickles', name: 'Coastal Spiced Prawns Pachadi', price: 420, unit: '250g jar', nonVeg: true },

  { id: 'idli-podi', cat: 'podis', name: 'Traditional Idli Milagai Podi', sub: 'Gunpowder', price: 140, unit: '250g' },
  { id: 'nallakaram', cat: 'podis', name: 'Nallakaram', sub: 'Andhra roasted black garlic podi', price: 160, unit: '250g' },
  { id: 'karivepaku', cat: 'podis', name: 'Karivepaku Podi', sub: 'Curry leaf', price: 150, unit: '250g' },
  { id: 'kandi', cat: 'podis', name: 'Kandi Podi', sub: 'Traditional roasted lentil powder', price: 145, unit: '250g' },

  { id: 'sunnundalu', cat: 'sweets', name: 'Neyyi Sunnundalu', sub: 'Urad dal ladoo', price: 240, unit: '6 pieces (~250g)' },
  { id: 'ariselu', cat: 'sweets', name: 'Neyyi Ariselu', sub: 'Traditional jaggery sweet', price: 250, unit: '250g' },
  { id: 'kobbari', cat: 'sweets', name: 'Kobbari Laddu', sub: 'Coconut laddu', price: 200, unit: '250g (6–8 pieces)' },
  { id: 'nuvvula', cat: 'sweets', name: 'Nuvvula Chimmili Undalu', sub: 'Sesame seed laddu', price: 210, unit: '250g (6–8 pieces)' },

  { id: 'gongura-chicken', cat: 'curries', name: 'Gongura Chicken Curry', price: 380, unit: '500g', nonVeg: true },
  { id: 'natu-kodi', cat: 'curries', name: 'Telangana Natu Kodi Curry', sub: 'Country chicken', price: 450, unit: '500g', nonVeg: true },
  { id: 'mutton', cat: 'curries', name: 'Homestyle Andhra Mutton Curry', price: 550, unit: '500g', nonVeg: true },
  { id: 'royyala', cat: 'curries', name: 'Andhra Royyala Iguru', sub: 'Prawns', price: 480, unit: '500g', nonVeg: true },

  { id: 'chekkalu', cat: 'snacks', name: 'Traditional Andhra Rice Chekkalu', price: 130, unit: '250g packet' },
  { id: 'gavvalu', cat: 'snacks', name: 'Crispy Gavvalu', sub: 'Sweet or hot — mention in notes', price: 140, unit: '250g' },

  { id: 'multigrain-batter', cat: 'batters', name: 'Special Multigrain Booster Batter', sub: 'Makes 20–22 dosas', price: 110, unit: '1 kg' },
  { id: 'idli-batter', cat: 'batters', name: 'Traditional Cultured Idli/Dosa Batter', price: 80, unit: '1 kg' },
];

export const MENU_BY_ID = Object.fromEntries(MENU.map((m) => [m.id, m]));

export const FAQS = [
  {
    q: 'How does ordering work?',
    a: "Nimmi posts the day's menu with a cutoff time. Add what you want and send the order on WhatsApp before the cutoff. Nimmi replies to accept it. Only accepted orders are cooked, so everything reaches you fresh.",
  },
  {
    q: 'What happens after the cutoff?',
    a: 'Ordering closes for that menu. Watch for the next menu. You can still message on WhatsApp to ask about pickles, podis or sweets for a later batch.',
  },
  {
    q: 'Why is there a 500g minimum on curries?',
    a: 'Curries are cooked from scratch for each order. 500g is the smallest batch that cooks well. You can order more in 500g steps.',
  },
  {
    q: 'When do I pay?',
    a: "After Nimmi accepts your order on WhatsApp, she'll share UPI details. You don't pay anything when you send the request.",
  },
  {
    q: 'Can I ask for an item that is not on today’s menu?',
    a: 'Yes. Tap "Ask" next to any item in the full menu to send a WhatsApp enquiry. Pickles, podis and sweets are made in batches, so Nimmi will tell you when the next batch is ready.',
  },
];
