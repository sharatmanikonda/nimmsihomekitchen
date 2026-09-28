const STEPS = [
  { t: 'Menu is posted', d: "Each day Nimmi posts what she'll cook next, with a cutoff time for orders." },
  { t: 'Order before cutoff', d: 'Pick your dishes and send the order on WhatsApp. It takes under a minute.' },
  { t: 'Nimmi accepts', d: 'You get a reply confirming your order and the UPI details for payment.' },
  { t: 'Cooked fresh, delivered', d: 'Only accepted orders are cooked, so nothing is made ahead or left over.' },
];

export default function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">How ordering works</span>
            <h2 className="h-display">Pre-order. Fresh. Simple.</h2>
          </div>
        </div>
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.t}>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
