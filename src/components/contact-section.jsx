import { useTranslation } from "react-i18next";
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
export default function ContactSection({ title, intro }) {
  const { t } = useTranslation();
  const { toast, showToast } = useToast();

  const onFormSuccess = () => showToast("success", t("contact.toastSuccess"));
  const onFormError   = () => showToast("error",   t("contact.toastError"));

  return (
    <>
      <section className="contact-bg" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="eyebrow">{t("contact.tag")}</div>
              <h2 className="section-title">{title ?? t("contact.defaultTitle")}</h2>
              <p>{intro ?? t("contact.defaultIntro")}</p>

              {/* Calendly CTA */}
              <div className="calendly-cta">
                <div className="calendly-cta-icon">📅</div>
                <div className="calendly-cta-body">
                  <h4>{t("contact.calendlyTitle")}</h4>
                  <p>{t("contact.calendlyDesc")}</p>
                </div>
                <button className="calendly-btn" onClick={openCalendly}>
                  {t("contact.calendlyBtn")}
                </button>
              </div>

              <div className="contact-items">
                <ContactItem icon="📞" label={t("contact.phoneLabel")}   value={t("contact.phoneValue")} />
                <ContactItem icon="📧" label={t("contact.emailLabel")}   value={t("contact.emailValue")} />
                <ContactItem icon="🕐" label={t("contact.hoursLabel")}   value={t("contact.hoursValue")} />
                <ContactItem icon="📍" label={t("contact.addressLabel")} value={t("contact.addressValue")} />
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
