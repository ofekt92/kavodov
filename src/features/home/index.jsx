import { useState, useMemo } from "react";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import ContactSection from "../../components/contact-section";
import { openCalendly, useCalendlyWidget } from "../../lib/calendly";
import { siteNavLinks } from "../../lib/nav-links";
import { navTo } from "../../lib/navigate";

const fmt = v => "₪" + Math.round(v).toLocaleString("he-IL");

/* ─── Sub-components ─────────────────────────────────────── */
function ServiceCard({ icon, title, desc }) {
  return (
    <div className="service-card">
      <div className="service-icon">{icon}</div>
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

function ProcessStep({ num, title, desc }) {
  return (
    <div className="process-step">
      <div className="step-num">{num}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
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
      <h3>מחשבון תשלום חודשי</h3>
      <div className="calc-field">
        <label>סכום המשכנתא (₪)</label>
        <input type="number" value={loan} min={0}
          onChange={e => setLoan(+e.target.value)} />
      </div>
      <div className="calc-field">
        <label>תקופה (שנים)</label>
        <select value={years} onChange={e => setYears(+e.target.value)}>
          {[10,15,20,25,30].map(y => (
            <option key={y} value={y}>{y} שנים</option>
          ))}
        </select>
      </div>
      <div className="calc-field">
        <label>ריבית שנתית (%)</label>
        <input type="number" value={rate} step={0.1} min={0} max={20}
          onChange={e => setRate(+e.target.value)} />
      </div>
      <div className="calc-result">
        <div className="calc-result-lbl">תשלום חודשי משוער</div>
        <div className="calc-result-val">{fmt(monthly)}</div>
      </div>
      <button className="calc-btn" onClick={() => navTo("contact")}>
        קבל הצעה אישית ›
      </button>
    </div>
  );
}

/* ─── Static Data ────────────────────────────────────────── */
const SERVICES = [
  { icon: "🏠",  title: "משכנתא לדירה ראשונה", desc: "ייעוץ מלא לרוכשי דירה ראשונה — נסביר לך כל מסלול, נבנה תמהיל אופטימלי ונלווה אותך עד הגשת הבקשה." },
  { icon: "🔄",  title: "מיחזור משכנתא",       desc: "בדיקה חינמית אם כדאי למחזר. אם כן — ננהל עבורך את כל התהליך ונשיג לך ריביות נמוכות יותר." },
  { icon: "🏗️", title: "משכנתא לבנייה עצמית", desc: "ייעוץ מותאם לבנייה עצמית ופרויקטים כולל ניהול שלבי השחרור מול הבנק." },
  { icon: "📊",  title: "ייעוץ לשיפור תנאים",   desc: "ניתוח המשכנתא הקיימת שלך ומציאת דרכים להוזיל את ההחזר החודשי כבר מהחודש הבא." },
  { icon: "🏢",  title: "נדל\"ן להשקעה",        desc: "ייעוץ ממוקד למשקיעים — מינוף נכון, מבנה מימון חכם ואסטרטגיית יציאה." },
  { icon: "🤝",  title: "ייצוג מול הבנק",       desc: "אנחנו מנהלים עבורך את המשא ומתן — כך שתקבל את התנאים הטובים ביותר שניתן להשיג." },
];

const WHY_US = [
  { icon: "✅", title: "ייעוץ בלתי תלוי",     desc: "אנחנו לא מחויבים לאף בנק — עובדים עם כל הבנקים ומשיגים את הריבית הנמוכה ביותר." },
  { icon: "⚡", title: "חיסכון בזמן ובכסף",   desc: "אנחנו מטפלים בניירת, בתיאום ובמשא ומתן — אתה רק חותם." },
  { icon: "🔒", title: "שקיפות מלאה",         desc: "ידעת את כל העלויות, ההשוואות והחלופות לפני שתחתום על כל מסמך." },
  { icon: "📞", title: "ליווי לאורך כל הדרך", desc: "מהפגישה הראשונה ועד מסירת המפתח — אנחנו זמינים לכל שאלה." },
];

const PROCESS = [
  { num: 1, title: "פגישת ייעוץ ראשונית",  desc: "שיחה חינמית ללא התחייבות — נבין את הצרכים שלך ונבדוק כושר השתכרות." },
  { num: 2, title: "בניית תמהיל אופטימלי", desc: "נתאים את שילוב המסלולים המתאים ביותר לצרכים ולמצב הפיננסי שלך." },
  { num: 3, title: "מו\"מ מול הבנקים",     desc: "נגיש את הבקשה לכמה בנקים במקביל ונמשוך את הריבית הנמוכה ביותר." },
  { num: 4, title: "חתימה וסגירה",         desc: "נלווה אותך לחתימה, נוודא שכל הניירת תקינה — ונחגוג יחד!" },
];

const TESTIMONIALS = [
  { initials: "יד", name: "יוסי ודנה כהן",   location: "תל אביב • מיחזור משכנתא",
    text: "חסכנו מעל 120,000 ₪ לאורך תקופת המשכנתא. הצוות של משכנתאPRO היה זמין בכל שאלה וניהל הכל בצורה מקצועית ביותר. ממליצים בחום!" },
  { initials: "שמ", name: "שירה ומיכה לוי", location: "רחובות • דירה ראשונה",
    text: "כרוכשי דירה ראשונה לא הבנו כלום — הם הסבירו לנו הכל בסבלנות, בנו לנו תמהיל מעולה והגישו לשלושה בנקים. קיבלנו תנאים שלא חשבנו שנשיג." },
  { initials: "אב", name: "אבי ברקוביץ",     location: "פתח תקווה • נדל\"ן להשקעה",
    text: "רציתי להשקיע בנדל\"ן אבל לא ידעתי מאיפה להתחיל עם המימון. הייעוץ של משכנתאPRO היה מדויק, מהיר ובסוף הצלחתי לסגור עסקה מצוינת." },
];

const STATS = [
  { num: "+3,200", lbl: "לקוחות מרוצים" },
  { num: "₪480M",  lbl: "משכנתאות שניהלנו" },
  { num: "12+",    lbl: "שנות ניסיון" },
  { num: "97%",    lbl: "שביעות רצון לקוחות" },
];

const BANK_RATES = [
  { name: "בנק הפועלים", rate: "4.15%" },
  { name: "בנק לאומי",   rate: "4.22%" },
  { name: "בנק מזרחי",   rate: "4.19%" },
  { name: "בנק דיסקונט", rate: "4.31%" },
];

/* ─── Home Root ──────────────────────────────────────────── */
export default function Home() {
  useCalendlyWidget();

  return (
    <div dir="rtl" lang="he" className="home-page">
      {/* NAV */}
      <SiteNav
        links={siteNavLinks("home")}
        cta={{ label: "📅 קבע פגישה", onClick: openCalendly }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-tag">יועצי משכנתא מורשים</div>
            <h1>משכנתא <em>חכמה.</em><br />תנאים טובים יותר.</h1>
            <p>אנחנו מנהלים עבורך את המשא ומתן מול הבנקים, מוצאים את המסלול הטוב ביותר ומחסכים לך עשרות אלפי שקלים לאורך חיי המשכנתא.</p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={openCalendly}>
                📅 קבע פגישה עכשיו ›
              </button>
              <a href="#/contact" className="btn-secondary"
                 onClick={(e) => { e.preventDefault(); navTo("contact"); }}>
                השאר פרטים
              </a>
            </div>
          </div>
          <HeroCalc />
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {STATS.map((s, i) => (
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
            <div className="section-tag">השירותים שלנו</div>
            <h2 className="section-title">הכל תחת קורת גג אחת</h2>
            <p className="section-sub">ליווי מקצועי מלא — מהמשכנתא הראשונה שלך ועד מיחזור שיחסוך לך כסף רב.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => <ServiceCard key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-bg">
        <div className="container">
          <div className="why-grid">
            <div>
              <div className="section-tag">למה משכנתאPRO?</div>
              <h2 className="section-title">אנחנו עובדים<br />בשבילך, לא לבנק</h2>
              <p className="section-sub">יועץ משכנתא עצמאי פועל אך ורק לטובתך, בניגוד לפקיד הבנק שמחויב לאינטרסים של המוסד שלו.</p>
              <div className="why-list">
                {WHY_US.map((w, i) => <WhyItem key={i} {...w} />)}
              </div>
            </div>
            <div className="why-visual">
              <div className="rate-display">
                <div className="rate">4.2%</div>
                <div className="rate-lbl">ריבית ממוצעת שהשגנו ללקוחות ברבעון האחרון</div>
              </div>
              <div className="rate-banks">
                {BANK_RATES.map((b, i) => (
                  <div key={i} className="rate-bank-item">
                    <span className="bank-name">{b.name}</span>
                    <span className="bank-rate">{b.rate}</span>
                  </div>
                ))}
              </div>
              <p style={{color:"rgba(255,255,255,0.35)",fontSize:11,textAlign:"center",marginTop:12}}>
                *הנתונים למטרות המחשה בלבד
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-bg" id="process">
        <div className="container">
          <div className="process-header">
            <div className="section-tag" style={{background:"rgba(201,168,76,0.12)",color:"var(--gold)"}}>
              התהליך שלנו
            </div>
            <h2 className="section-title">ארבעה שלבים פשוטים</h2>
            <p className="section-sub" style={{color:"rgba(255,255,255,0.6)",margin:"0 auto",textAlign:"center"}}>
              מהפגישה הראשונה ועד אישור המשכנתא — אנחנו לצידך בכל שלב.
            </p>
          </div>
          <div className="process-steps">
            {PROCESS.map((p, i) => <ProcessStep key={i} {...p} />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-bg" id="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <div className="section-tag">מה אומרים עלינו</div>
            <h2 className="section-title">הלקוחות שלנו מדברים</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <ContactSection />

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
