import { useState } from "react";
import { useTranslation } from "react-i18next";
import { navTo } from "../../lib/navigate";
import SiteNav from "../../components/site-nav";
import { siteNavLinks } from "../../lib/nav-links";
import ContactSection from "../../components/contact-section";
import { useCalendlyWidget } from "../../lib/calendly";
import { MonthlyCalc } from "./calculators/monthly-calc";
import { RefiCalc } from "./calculators/refi-calc";
import { AffordCalc } from "./calculators/afford-calc";
import { AmortCalc } from "./calculators/amort-calc";
import { MixCalc } from "./calculators/mix-calc";
import { CompareCalc } from "./calculators/compare-calc";

const TABS = [
  { id: "monthly", icon: "🏠", Component: MonthlyCalc },
  { id: "refi",    icon: "🔄", Component: RefiCalc    },
  { id: "afford",  icon: "💰", Component: AffordCalc  },
  { id: "amort",   icon: "📊", Component: AmortCalc   },
  { id: "mix",     icon: "🧮", Component: MixCalc     },
  { id: "compare", icon: "⚖️", Component: CompareCalc },
];

export default function Calculators() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("monthly");
  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.Component;
  useCalendlyWidget();

  return (
    <div>
      {/* NAV */}
      <SiteNav
        onLogoClick={() => navTo("home")}
        links={siteNavLinks("calculators", t)}
        cta={{ label: t("nav.ctaFree"), onClick: () => navTo("contact") }}
      />

      {/* HERO */}
      <div className="page-hero">
        <div className="eyebrow">{t("calculators.heroTag")}</div>
        <h1>
          {t("calculators.heroTitleLead")}
          <em>{t("calculators.heroTitleEm")}</em>
          {t("calculators.heroTitleTail")}
        </h1>
        <p>{t("calculators.heroLead")}</p>
      </div>

      {/* TABS */}
      <div className="tool-tabs-wrap">
        <div className="tool-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tool-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span> {t(`calculators.tabs.${tab.id}`)}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main className="main">
        <div className="calc-section active">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </main>

      {/* CONTACT — wrapper supplies the .home-page-scoped section styling */}
      <div className="home-page">
        <ContactSection />
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">{t("brand.name")}<span>{t("brand.suffix")}</span></div>
        <p>{t("footer.calcDisclaimer")}<br />
           {t("footer.copyright")}</p>
      </footer>
    </div>
  );
}
