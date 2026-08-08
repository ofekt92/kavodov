import { useState } from "react";
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
  { id: "monthly", icon: "🏠", label: "תשלום חודשי",    Component: MonthlyCalc },
  { id: "refi",    icon: "🔄", label: "כדאיות מיחזור",  Component: RefiCalc    },
  { id: "afford",  icon: "💰", label: "כושר השתכרות",   Component: AffordCalc  },
  { id: "amort",   icon: "📊", label: "לוח סילוקין",    Component: AmortCalc   },
  { id: "mitzur",  icon: "🧮", label: "תמהיל מסלולים",  Component: MixCalc     },
  { id: "compare", icon: "⚖️", label: "השוואת בנקים",   Component: CompareCalc },
];

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("monthly");
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component;
  useCalendlyWidget();

  return (
    <div dir="rtl" lang="he">
      {/* NAV */}
      <SiteNav
        onLogoClick={() => navTo("home")}
        links={siteNavLinks("calculators")}
        cta={{ label: "ייעוץ חינם", onClick: () => navTo("contact") }}
      />

      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-tag">כלים מקצועיים חינמיים</div>
        <h1>מחשבונים <em>חכמים</em> למשכנתא</h1>
        <p>כלים מדויקים שיעזרו לך לקבל החלטות פיננסיות נכונות — לפני שפונים לבנק.</p>
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
              <span className="tab-icon">{tab.icon}</span> {tab.label}
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
        <div className="footer-logo">משכנתא<span>PRO</span></div>
        <p>המחשבונים מיועדים לאומדן ראשוני בלבד ואינם מהווים ייעוץ פיננסי מחייב<br />
           © 2025 משכנתאPRO.co.il | כל הזכויות שמורות</p>
      </footer>
    </div>
  );
}
