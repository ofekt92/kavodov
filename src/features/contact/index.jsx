import { useTranslation } from "react-i18next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import ContactSection from "../../components/contact-section";
import { openCalendly, useCalendlyWidget } from "../../lib/calendly";
import { siteNavLinks } from "../../lib/nav-links";
import { navTo } from "../../lib/navigate";

export default function Contact() {
  const { t } = useTranslation();
  useCalendlyWidget();

  return (
    <div className="home-page contact-page">
      <SiteNav
        onLogoClick={() => navTo("home")}
        links={siteNavLinks("contact", t)}
        cta={{ label: t("nav.ctaMeeting"), onClick: openCalendly }}
      />

      <div className="page-hero">
        <div className="eyebrow">{t("contactPage.heroTag")}</div>
        <h1>{t("contactPage.heroTitleLead")}<em>{t("contactPage.heroTitleEm")}</em></h1>
        <p>{t("contactPage.heroLead")}</p>
      </div>

      <ContactSection
        title={t("contactPage.sectionTitle")}
        intro={t("contactPage.sectionIntro")}
      />

      <SiteFooter />
    </div>
  );
}
