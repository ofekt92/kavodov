import { useState, useEffect, useMemo } from "react";

const fmt = v => "₪" + Math.round(v).toLocaleString("he-IL");
const navTo = (page, anchor) => window.dispatchEvent(
  new CustomEvent("app:navigate", { detail: { page, anchor } })
);

/* ─── Calendly Config ────────────────────────────────────── */
const CALENDLY_URL = "https://calendly.com/shlomo-mashpro/new-meeting";

/**
 * Opens Calendly in a popup widget. Falls back to a new tab
 * if the Calendly script hasn't loaded yet.
 */
function openCalendly() {
  if (window.Calendly?.initPopupWidget) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    return false;
  }
  window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  return false;
}

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

function ContactItem({ icon, label, value }) {
  return (
    <div className="contact-item">
      <div className="contact-item-icon">{icon}</div>
      <div className="contact-item-txt">
        <strong>{label}</strong>
        <span>{value}</span>
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
      <button className="calc-btn" onClick={() => navTo("home", "contact")}>
        קבל הצעה אישית ›
      </button>
    </div>
  );
}

/* ─── Contact Form ───────────────────────────────────────── */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const initialForm = {
  firstName: "", lastName: "", phone: "", email: "",
  service: "משכנתא לדירה ראשונה", amount: "", notes: "",
};

function ContactForm({ onSubmit, onError }) {
  const [form, setForm]       = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = "שדה חובה";
    if (!form.lastName.trim())  err.lastName  = "שדה חובה";
    if (!form.phone.trim())     err.phone     = "שדה חובה";
    else if (!/^[\d\-\+\s\(\)]{9,}$/.test(form.phone)) err.phone = "מספר טלפון לא תקין";
    if (!form.email.trim())     err.email     = "שדה חובה";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "אימייל לא תקין";
    return err;
  };

  const handle = async () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Accept":       "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "שם פרטי":    form.firstName,
          "שם משפחה":   form.lastName,
          "טלפון":      form.phone,
          email:        form.email,       // Formspree uses this as Reply-To
          "סוג השירות": form.service,
          "סכום מבוקש": form.amount,
          "הערות":      form.notes,
          _subject:     `פנייה חדשה מהאתר — ${form.firstName} ${form.lastName}`,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");

      onSubmit?.();
      setForm(initialForm);
    } catch (e) {
      onError?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <h3>השאר פרטים לייעוץ חינם</h3>
      <div className="form-row">
        <div className="form-field">
          <label>שם פרטי *</label>
          <input type="text" placeholder="ישראל" value={form.firstName}
            className={errors.firstName ? "input-error" : ""}
            onChange={e => update("firstName", e.target.value)} />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
        <div className="form-field">
          <label>שם משפחה *</label>
          <input type="text" placeholder="ישראלי" value={form.lastName}
            className={errors.lastName ? "input-error" : ""}
            onChange={e => update("lastName", e.target.value)} />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label>טלפון *</label>
          <input type="tel" placeholder="050-0000000" dir="ltr" value={form.phone}
            className={errors.phone ? "input-error" : ""}
            onChange={e => update("phone", e.target.value)} />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        <div className="form-field">
          <label>אימייל *</label>
          <input type="email" placeholder="your@email.com" dir="ltr" value={form.email}
            className={errors.email ? "input-error" : ""}
            onChange={e => update("email", e.target.value)} />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
      </div>
      <div className="form-field">
        <label>סוג השירות</label>
        <select value={form.service} onChange={e => update("service", e.target.value)}>
          <option>משכנתא לדירה ראשונה</option>
          <option>מיחזור משכנתא</option>
          <option>משכנתא לבנייה עצמית</option>
          <option>נדל"ן להשקעה</option>
          <option>ייעוץ לשיפור תנאים</option>
        </select>
      </div>
      <div className="form-field">
        <label>סכום המשכנתא המבוקש (₪)</label>
        <input type="number" placeholder="1,000,000" dir="ltr" value={form.amount}
          onChange={e => update("amount", e.target.value)} />
      </div>
      <div className="form-field">
        <label>הערות נוספות (אופציונלי)</label>
        <textarea rows={3} placeholder="ספר/י לנו עוד על הצורך שלך..."
          value={form.notes} onChange={e => update("notes", e.target.value)} />
      </div>
      <button className="form-submit" onClick={handle} disabled={loading}>
        {loading ? "שולח..." : "שלח פנייה — ייעוץ חינם ›"}
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
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  };

  const onFormSuccess = () => showToast("success", "✓ הפנייה נשלחה! נחזור אליך תוך שעה");
  const onFormError   = () => showToast("error",   "✗ שליחה נכשלה. נסה שוב או צור קשר טלפוני");

  // Lazy-load Calendly widget assets once when Home mounts.
  useEffect(() => {
    if (document.getElementById("calendly-script")) return;

    const css = document.createElement("link");
    css.rel  = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.id    = "calendly-script";
    script.src   = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Smooth scroll handler factory
  const link = (id) => (e) => { e.preventDefault(); scrollTo(id); };

  return (
    <div dir="rtl" lang="he" className="home-page">
      {/* NAV */}
      <nav>
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="logo">
          <span className="logo-dot">●</span> משכנתא<span>PRO</span>
        </a>
        <div className="nav-links">
          <a href="#services"     onClick={link("services")}>שירותים</a>
          <a href="#process"      onClick={link("process")}>תהליך</a>
          <a href="#testimonials" onClick={link("testimonials")}>לקוחות</a>
          <a href="#contact"      onClick={link("contact")}>צור קשר</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navTo("calculators"); }}>
            מחשבונים
          </a>
        </div>
        <button className="nav-cta" onClick={openCalendly}>
          📅 קבע פגישה
        </button>
      </nav>

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
              <a href="#contact" onClick={link("contact")} className="btn-secondary">
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
      <section className="contact-bg" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="section-tag">צור קשר</div>
              <h2 className="section-title">מוכן להתחיל?<br />נשמח לעזור.</h2>
              <p>השאר פרטים ויועץ מוסמך יחזור אליך תוך שעה בשעות העבודה — ללא עלות וללא התחייבות.</p>

              {/* Calendly CTA */}
              <div className="calendly-cta">
                <div className="calendly-cta-icon">📅</div>
                <div className="calendly-cta-body">
                  <h4>קבע פגישה כבר עכשיו</h4>
                  <p>בחר תאריך ושעה שמתאימים לך — וקבל אישור מיידי</p>
                </div>
                <button className="calendly-btn" onClick={openCalendly}>
                  קבע פגישה ›
                </button>
              </div>

              <div className="contact-items">
                <ContactItem icon="📞" label="טלפון"        value="03-000-0000" />
                <ContactItem icon="📧" label="אימייל"       value="info@mashpro.co.il" />
                <ContactItem icon="🕐" label="שעות פעילות" value="א'–ה' 08:00–19:00 | ו' 08:00–13:00" />
                <ContactItem icon="📍" label="כתובת"        value="רחוב רוטשילד 1, תל אביב" />
              </div>
            </div>
            <ContactForm onSubmit={onFormSuccess} onError={onFormError} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">משכנתא<span>PRO</span></div>
        <div className="footer-links">
          <a href="#" onClick={(e) => e.preventDefault()}>אודות</a>
          <a href="#services"     onClick={link("services")}>שירותים</a>
          <a href="#process"      onClick={link("process")}>תהליך</a>
          <a href="#testimonials" onClick={link("testimonials")}>המלצות</a>
          <a href="#contact"      onClick={link("contact")}>צור קשר</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navTo("calculators"); }}>
            מחשבונים
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>מדיניות פרטיות</a>
        </div>
        <hr className="footer-divider" />
        <p>
          משכנתאPRO — יועצי משכנתא מורשים | רישיון ייעוץ פיננסי מס' 000000<br />
          © 2025 משכנתאPRO.co.il | כל הזכויות שמורות<br />
          <small>האתר מספק מידע כללי בלבד ואינו מהווה ייעוץ פיננסי מחייב</small>
        </p>
      </footer>

      {/* TOAST */}
      <div className={`toast toast-${toast.type} ${toast.show ? "show" : ""}`}>
        {toast.msg}
      </div>
    </div>
  );
}
