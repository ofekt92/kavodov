import { Fragment, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import ContactSection from "../../components/contact-section";
import Carousel from "../../components/carousel";
import { openCalendly, useCalendlyWidget } from "../../lib/calendly";
import { siteNavLinks } from "../../lib/nav-links";
import { navTo } from "../../lib/navigate";
import { numberLocale } from "../../i18n";
import { SERVICE_ICONS } from "../../lib/service-icons";
import { useMediaQuery } from "../../lib/use-media-query";
import { MoneyInput } from "../../components/money-input";

const fmt = v => "₪" + Math.round(v).toLocaleString(numberLocale());

/* ─── Sub-components ─────────────────────────────────────── */
function ServiceCard({ id, title, desc }) {
  const Icon = SERVICE_ICONS[id];
  return (
    <div className="service-card">
      <div className="service-icon">
        {/* 2 rather than the 1.75 used on light surfaces — thin strokes lose
            weight in gold-on-navy at this size */}
        {Icon ? <Icon size={24} strokeWidth={2} aria-hidden="true" /> : null}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function WhyItem({ icon, title, desc }) {
  return (
    <div className="why-item">
      <div className="why-check">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function SweepText({ text }) {
  const words = String(text).split(" ");
  // --p is 0..1 across the string, so the sweep takes the same time whatever the length
  const total = Math.max(1, words.reduce((n, w) => n + [...w].length, 0) - 1);
  let idx = 0;
  return (
    <span className="sweep-text">
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="sweep-word">
            {[...word].map((ch, ci) => (
              <span className="sweep-char" key={ci} style={{ "--p": idx++ / total }}>{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

function ProcessStep({ num, title, desc }) {
  return (
    <div className="process-step">
      <div className="step-num">{num}</div>
      <h4><SweepText text={title} /></h4>
      <p><SweepText text={desc} /></p>
    </div>
  );
}

function TestimonialCard({ text, initials, name, location }) {
  return (
    <div className="testimonial-card">
      <div className="stars">★★★★★</div>
      <p className="testimonial-text">"{text}"</p>
      <div className="testimonial-author">
        <div className="author-avatar">{initials}</div>
        <div>
          <div className="author-name">{name}</div>
          <div className="author-city">{location}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Mini Calculator ───────────────────────────────── */
function HeroCalc() {
  const { t } = useTranslation();
  const [loan,  setLoan]  = useState(1000000);
  const [years, setYears] = useState(25);
  const [rate,  setRate]  = useState(4.5);

  const monthly = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    return r === 0 ? loan / n : loan * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
  }, [loan, years, rate]);

  return (
    <div className="hero-card">
      <h3>{t("home.heroCalc.title")}</h3>
      <div className="calc-field">
        <label>{t("home.heroCalc.amount")}</label>
        <MoneyInput value={loan} onChange={setLoan} />
      </div>
      <div className="calc-field">
        <label>{t("home.heroCalc.term")}</label>
        <select value={years} onChange={e => setYears(+e.target.value)}>
          {[10,15,20,25,30].map(y => (
            <option key={y} value={y}>{t("home.heroCalc.termOption", { years: y })}</option>
          ))}
        </select>
      </div>
      <div className="calc-field">
        <label>{t("home.heroCalc.rate")}</label>
        <input type="number" value={rate} step={0.1} min={0} max={20}
          onChange={e => setRate(+e.target.value)} />
      </div>
      <div className="calc-result">
        <div className="calc-result-lbl">{t("home.heroCalc.resultLabel")}</div>
        <div className="calc-result-val">{fmt(monthly)}</div>
      </div>
      <button className="calc-btn" onClick={() => navTo("contact")}>
        {t("home.heroCalc.cta")}
      </button>
    </div>
  );
}

/* ─── Home Root ──────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation();
  useCalendlyWidget();
  const narrow = useMediaQuery("(max-width: 899px)");

  const stats        = t("home.stats",             { returnObjects: true });
  const services     = t("home.services.items",    { returnObjects: true });
  const whyUs        = t("home.why.items",         { returnObjects: true });
  const bankRates    = t("home.why.banks",         { returnObjects: true });
  const process      = t("home.process.steps",     { returnObjects: true });
  const testimonials = t("home.testimonials.items", { returnObjects: true });

  return (
    <div className="home-page">
      {/* NAV */}
      <SiteNav
        links={siteNavLinks("home", t)}
        cta={{ label: t("nav.ctaMeeting"), onClick: openCalendly }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="eyebrow">{t("home.hero.tag")}</div>
            <h1>
              {t("home.hero.titleLead")}<em>{t("home.hero.titleEm")}</em><br />
              {t("home.hero.titleTail")}
            </h1>
            <p>{t("home.hero.lead")}</p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={openCalendly}>
                {t("home.hero.ctaMeeting")}
              </button>
              <a href="#/contact" className="btn-secondary"
                 onClick={(e) => { e.preventDefault(); navTo("contact"); }}>
                {t("home.hero.ctaLead")}
              </a>
            </div>
          </div>
          <HeroCalc />
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-num">{s.num}</span>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <section className="services-bg" id="services">
        <div className="container">
          <div className="services-header">
            <div className="eyebrow">{t("home.services.tag")}</div>
            <h2 className="section-title">{t("home.services.title")}</h2>
            <p className="section-sub">{t("home.services.sub")}</p>
          </div>
          {/* Carousel only where vertical space is tight. On desktop all six
              cards fit, and autoplay would scroll copy away mid-sentence. */}
          {narrow ? (
            <Carousel ariaLabel={t("home.services.title")} delay={7000}>
              {services.map((s, i) => <ServiceCard key={i} {...s} />)}
            </Carousel>
          ) : (
            <div className="services-grid">
              {services.map((s, i) => <ServiceCard key={i} {...s} />)}
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="why-bg">
        <div className="container">
          <div className="why-grid">
            <div>
              <div className="eyebrow">{t("home.why.tag")}</div>
              <h2 className="section-title">
                {t("home.why.titleLine1")}<br />{t("home.why.titleLine2")}
              </h2>
              <p className="section-sub">{t("home.why.sub")}</p>
              <div className="why-list">
                {whyUs.map((w, i) => <WhyItem key={i} {...w} />)}
              </div>
            </div>
            <div className="why-visual">
              <div className="rate-display">
                <div className="rate">4.2%</div>
                <div className="rate-lbl">{t("home.why.rateLabel")}</div>
              </div>
              <div className="rate-banks">
                {bankRates.map((b, i) => (
                  <div key={i} className="rate-bank-item">
                    <span className="bank-name">{b.name}</span>
                    <span className="bank-rate">{b.rate}</span>
                  </div>
                ))}
              </div>
              <p style={{color:"rgba(255,255,255,0.35)",fontSize:11,textAlign:"center",marginTop:12}}>
                {t("home.why.disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-bg" id="process">
        <div className="container">
          <div className="process-header">
            <div className="eyebrow">{t("home.process.tag")}</div>
            <h2 className="section-title">{t("home.process.title")}</h2>
            <p className="section-sub" style={{color:"rgba(255,255,255,0.6)",margin:"0 auto",textAlign:"center"}}>
              {t("home.process.sub")}
            </p>
          </div>
          <div className="process-steps">
            {process.map((p, i) => <ProcessStep key={i} num={i + 1} {...p} />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-bg" id="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <div className="eyebrow">{t("home.testimonials.tag")}</div>
            <h2 className="section-title">{t("home.testimonials.title")}</h2>
          </div>
          {/* Only 3 of these, so a desktop carousel would have nothing to
              scroll to — it's worth it on mobile purely to cut the stack height.
              Revisit the desktop case if the count grows past a full row. */}
          {narrow ? (
            <Carousel ariaLabel={t("home.testimonials.title")} delay={8000}>
              {testimonials.map((tm, i) => <TestimonialCard key={i} {...tm} />)}
            </Carousel>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map((tm, i) => <TestimonialCard key={i} {...tm} />)}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <ContactSection />

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
