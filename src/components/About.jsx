import { ChefHat, Leaf, Timer } from 'lucide-react';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <img src={`${import.meta.env.BASE_URL}images/nimmi_poster.png`} alt="Nimmi's Home Kitchen flyer: a South Indian meal on a banana leaf" loading="lazy" />
        <div>
          <span className="eyebrow">About the kitchen</span>
          <h2 className="h-display" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)', margin: '6px 0 18px' }}>
            A home kitchen, not a factory
          </h2>
          <p className="serif-lg">
            Nimmi cooks the veg and non-veg Andhra dishes she grew up with, along with traditional podis, homemade
            sweets and fresh batters. She uses good ingredients and the old methods, and cooks in small batches.
          </p>
          <ul className="promises">
            <li>
              <span className="ico"><Timer size={18} /></span>
              <span>
                <b>Cooked after you order</b>
                <span className="muted">Nothing is made in advance or reheated. Nimmi cooks only the orders she accepts.</span>
              </span>
            </li>
            <li>
              <span className="ico"><ChefHat size={18} /></span>
              <span>
                <b>Small batches</b>
                <span className="muted">Each batch is limited, so quantities on the daily menu can sell out.</span>
              </span>
            </li>
            <li>
              <span className="ico"><Leaf size={18} /></span>
              <span>
                <b>Hygienic home cooking</b>
                <span className="muted">The same care Nimmi takes with meals for her own family.</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
