import { Minus, Plus } from 'lucide-react';

export function VegMark({ nonVeg }) {
  return <span className={`vmark ${nonVeg ? 'nv' : ''}`} role="img" aria-label={nonVeg ? 'Non-vegetarian' : 'Vegetarian'} />;
}

// "Add" button that turns into a quantity stepper once the item is in the order.
export default function AddControl({ item, qty = 0, setQty, disabled }) {
  if (disabled) return <span className="chip warn">Closed</span>;
  if (!qty)
    return (
      <button className="btn btn-leaf btn-sm" onClick={() => setQty(item, 1)} aria-label={`Add ${item.name}`}>
        <Plus size={14} /> Add
      </button>
    );
  const atMax = item.limit ? qty >= item.limit : qty >= 20;
  return (
    <span className="stepper" aria-label={`${item.name} quantity`}>
      <button onClick={() => setQty(item, qty - 1)} aria-label="Decrease">
        <Minus size={14} />
      </button>
      <span aria-live="polite">{qty}</span>
      <button onClick={() => setQty(item, qty + 1)} aria-label="Increase" disabled={atMax} style={atMax ? { opacity: 0.3 } : undefined}>
        <Plus size={14} />
      </button>
    </span>
  );
}
