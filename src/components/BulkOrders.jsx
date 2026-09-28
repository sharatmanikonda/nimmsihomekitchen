import { Truck } from 'lucide-react';
import { KITCHEN } from '../data/kitchen';
import { waLink } from '../lib/helpers';

const ENQUIRY = `Hi Nimmi, I'd like to place a special / bulk order.
Items and quantities:
Date and time needed:
Pickup or delivery (delivery address, if needed):`;

// Daily orders are pickup only; this is the one place delivery is offered.
export default function BulkOrders() {
  return (
    <section className="section" id="bulk">
      <div className="wrap">
        <div className="bulk-card">
          <Truck size={30} className="bulk-icon" aria-hidden />
          <div>
            <span className="eyebrow">Special &amp; bulk orders</span>
            <h2 className="h-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', margin: '6px 0 10px' }}>
              Cooking for a function or a crowd?
            </h2>
            <p className="muted" style={{ margin: 0, maxWidth: '60ch' }}>
              Nimmi takes special and bulk orders for festivals, functions and get-togethers.{' '}
              <b>{KITCHEN.bulkNote}</b>
            </p>
          </div>
          <a className="btn btn-wa" href={waLink(ENQUIRY)} target="_blank" rel="noreferrer">
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
