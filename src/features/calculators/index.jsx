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
import { CALC_ICONS } from "../../lib/calc-icons";

const TABS = [
  { id: "monthly", Component: MonthlyCalc },
  { id: "refi",    Component: RefiCalc    },
  { id: "afford",  Component: AffordCalc  },
  { id: "amort",   Component: AmortCalc   },
  { id: "mix",     Component: MixCalc     },
  { id: "compare", Component: CompareCalc },
];

export default function Calculators() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("monthly");
  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.Component;
  useCalendlyWidget();

  return (
    <div className="calculators-page">
      <SiteNav
        onLogoClick={() => navTo("home")}
        links={siteNavLinks("calculators", t)}
        cta={{ label: t("nav.ctaFree"), onClick: () => navTo("contact") }}
      />

      <div className="page-hero">
        <div className="eyebrow">{t("calculators.heroTag")}</div>
        <h1>
          {t("calculators.heroTitleLead")}
          <em>{t("calculators.heroTitleEm")}</em>
          {t("calculators.heroTitleTail")}
        </h1>
        <p>{t("calculators.heroLead")}</p>
      </div>

      <div className="tool-tabs-wrap">
        <div className="tool-tabs">
          {TABS.map(tab => {
            const Icon = CALC_ICONS[tab.id];
            return (
              <button
                key={tab.id}
                className={`tool-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">
                  {Icon ? <Icon size={16} strokeWidth={2} aria-hidden="true" /> : null}
                </span>
                {t(`calculators.tabs.${tab.id}`)}
              </button>
            );
          })}
        </div>
      </div>

      <main className="main">
        <div className="calc-section active">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </main>

      <div className="home-page">
        <ContactSection />
      </div>

      <footer>
        <div className="footer-logo">{t("brand.name")}<span>{t("brand.suffix")}</span></div>
        <p>{t("footer.calcDisclaimer")}<br />
           {t("footer.copyright")}</p>
      </footer>
    </div>
  );
}
