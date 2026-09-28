import { countdown, formatCutoff, formatDay } from '../lib/helpers';

export default function Hero({ menu, nextDate, status, now, cutoffMs }) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow" style={{ color: 'var(--leaf-deep)' }}>Andhra home cooking · made to order</span>
          <h1 className="h-display">
            Cooked fresh.
            <br />
            Only for you.
          </h1>
          <p className="lede">
            A new menu every day. Order before the cutoff, and Nimmi cooks only the orders she accepts, then delivers
            them fresh.
          </p>
          <div className="hero-cta">
            <a href="#today" className="btn btn-ink">See today's menu</a>
            <a href="#menu" className="btn btn-ghost">Pickles, podis &amp; sweets</a>
          </div>
        </div>

        <div className="hero-photo">
          <img src={`${import.meta.env.BASE_URL}images/hero_culinary.jpg`} alt="Homemade curries, podis, pickles and laddus on a wooden table" />
          {status !== 'loading' && (
            <div className="today-ticket">
              {menu ? (
                <>
                  <span className="eyebrow">Menu for</span>
                  <div className="row">
                    <span className="big">{formatDay(menu.deliveryDate)}</span>
                    <span className="muted">{menu.items.length} items</span>
                  </div>
                  <div className="row">
                    <span className="muted">Order by {formatCutoff(menu.cutoff)}</span>
                    <span className="timer">{countdown(cutoffMs - now)}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="eyebrow">Menu for</span>
                  <div className="row">
                    <span className="big">{formatDay(nextDate)}</span>
                    <span className="timer closed">Coming soon</span>
                  </div>
                  <span className="muted">Nimmi is planning what to cook. Check back soon.</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
