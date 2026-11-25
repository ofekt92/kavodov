import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import ContactSection from "../../components/contact-section";
import Carousel from "../../components/carousel";
import { openCalendly, useCalendlyWidget } from "../../lib/calendly";
import { siteNavLinks } from "../../lib/nav-links";
import { navTo } from "../../lib/navigate";
import { SERVICE_ICONS } from "../../lib/service-icons";
import { WHY_ICONS } from "../../lib/why-icons";
import { useMediaQuery } from "../../lib/use-media-query";

function ServiceCard({ id, title, desc }) {
  const Icon = SERVICE_ICONS[id];
  return (
    <div className="service-card">
      <div className="service-icon">

        {Icon ? <Icon size={24} strokeWidth={2} aria-hidden="true" /> : null}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function WhyItem({ id, title, desc }) {
  const Icon = WHY_ICONS[id];
  return (
    <div className="why-item">
      <div className="why-check">
        {Icon ? <Icon size={28} strokeWidth={2} aria-hidden="true" /> : null}
      </div>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function SweepText({ text }) {
  const words = String(text).split(" ");

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

export default function Home() {
  const { t } = useTranslation();
  useCalendlyWidget();
  const narrow = useMediaQuery("(max-width: 899px)");

  const stats        = t("home.stats",             { returnObjects: true });
  const services     = t("home.services.items",    { returnObjects: true });
  const whyUs        = t("home.why.items",         { returnObjects: true });
  const process      = t("home.process.steps",     { returnObjects: true });
  const testimonials = t("home.testimonials.items", { returnObjects: true });

  return (
    <div className="home-page">

      <SiteNav
        links={siteNavLinks("home", t)}
        cta={{ label: t("nav.ctaMeeting"), onClick: openCalendly }}
      />

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
        </div>
      </section>

      <div className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-num">{s.num}</span>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <section className="services-bg" id="services">
        <div className="container">
          <div className="services-header">
            <div className="eyebrow">{t("home.services.tag")}</div>
            <h2 className="section-title">{t("home.services.title")}</h2>
            <p className="section-sub">{t("home.services.sub")}</p>
          </div>

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

      <section className="why-bg">
        <div className="container">

          <div className="why-header">
            <div className="eyebrow">{t("home.why.tag")}</div>
            <h2 className="section-title">
              {t("home.why.titleLine1")}<br />{t("home.why.titleLine2")}
            </h2>
            <p className="section-sub">{t("home.why.sub")}</p>
          </div>
          <div className="why-list">
            {whyUs.map((w, i) => <WhyItem key={i} {...w} />)}
          </div>
        </div>
      </section>

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

      <section className="testimonials-bg" id="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <div className="eyebrow">{t("home.testimonials.tag")}</div>
            <h2 className="section-title">{t("home.testimonials.title")}</h2>
          </div>

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

      <ContactSection />

      <SiteFooter />
    </div>
  );
}
