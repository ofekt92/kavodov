import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import ContactSection from "../../components/contact-section";
import { openCalendly, useCalendlyWidget } from "../../lib/calendly";
import { siteNavLinks } from "../../lib/nav-links";
import { navTo } from "../../lib/navigate";

export default function Contact() {
  useCalendlyWidget();

  return (
    <div dir="rtl" lang="he" className="home-page contact-page">
      <SiteNav
        onLogoClick={() => navTo("home")}
        links={siteNavLinks("contact")}
        cta={{ label: "📅 קבע פגישה", onClick: openCalendly }}
      />

      <div className="page-hero">
        <div className="page-hero-tag">ייעוץ ראשוני ללא עלות</div>
        <h1>מוכן <em>להתחיל?</em></h1>
        <p>השאר פרטים ויועץ מוסמך יחזור אליך תוך שעה בשעות העבודה — ללא עלות וללא התחייבות.</p>
      </div>

      <ContactSection
        title="נשמח לעזור."
        intro="בחר את הדרך הנוחה לך — טלפון, אימייל, או קביעת פגישה ביומן שלנו."
      />

      <SiteFooter />
    </div>
  );
}
