import { FAQS } from '../data/kitchen';

export default function Faq() {
  return (
    <section className="section" id="faq" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <span className="eyebrow">Questions</span>
            <h2 className="h-display">Good to know</h2>
          </div>
        </div>
        <div className="faq">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
