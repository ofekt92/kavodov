import ContactForm from "./contact-form";
import { Toast, useToast } from "./toast";
import { openCalendly } from "../lib/calendly";

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

/**
 * Full contact block (info column + lead form). Self-contained — owns its own
 * toast — so any page can drop it in above the footer.
 *
 * @param {string} [title] - heading override; defaults to the landing-page copy
 * @param {string} [intro] - paragraph override
 */
export default function ContactSection({
  title = "מוכן להתחיל? נשמח לעזור.",
  intro = "השאר פרטים ויועץ מוסמך יחזור אליך תוך שעה בשעות העבודה — ללא עלות וללא התחייבות.",
}) {
  const { toast, showToast } = useToast();

  const onFormSuccess = () => showToast("success", "✓ הפנייה נשלחה! נחזור אליך תוך שעה");
  const onFormError   = () => showToast("error",   "✗ שליחה נכשלה. נסה שוב או צור קשר טלפוני");

  return (
    <>
      <section className="contact-bg" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="section-tag">צור קשר</div>
              <h2 className="section-title">{title}</h2>
              <p>{intro}</p>

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

      <Toast toast={toast} />
    </>
  );
}
