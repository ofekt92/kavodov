import { useTranslation } from "react-i18next";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  ShieldCheck,
  Timer,
  BadgeCheck,
} from "lucide-react";
import ContactForm from "./contact-form";
import { Toast, useToast } from "./toast";
import { openCalendly } from "../lib/calendly";

function ContactItem({ icon: Icon, label, href, children, wide }) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      className={`contact-item${wide ? " contact-item-wide" : ""}`}
      {...(href ? { href } : {})}
    >
      <div className="contact-item-icon">
        <Icon size={18} strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="contact-item-txt">
        <strong>{label}</strong>
        <span>{children}</span>
      </div>
    </Tag>
  );
}

function TrustBadge({ icon: Icon, children }) {
  return (
    <div className="contact-trust-item">
      <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export default function ContactSection({ title, intro }) {
  const { t } = useTranslation();
  const { toast, showToast } = useToast();

  const onFormSuccess = () => showToast("success", t("contact.toastSuccess"));
  const onFormError   = () => showToast("error",   t("contact.toastError"));

  const phone = t("contact.phoneValue");
  const email = t("contact.emailValue");

  return (
    <>
      <section className="contact-bg" id="contact">
        <div className="container">

          <div className="contact-header">
            <div className="eyebrow">{t("contact.tag")}</div>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="section-title">{title ?? t("contact.defaultTitle")}</h2>
              <p>{intro ?? t("contact.defaultIntro")}</p>

              <div className="calendly-cta">
                <div className="calendly-cta-body">
                  <h4>{t("contact.calendlyTitle")}</h4>
                  <p>{t("contact.calendlyDesc")}</p>
                </div>
                <button className="calendly-btn" onClick={openCalendly}>
                  {t("contact.calendlyBtn")}
                </button>
              </div>

              <div className="contact-items">
                <ContactItem
                  icon={Phone}
                  label={t("contact.phoneLabel")}
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                >
                  {phone}
                </ContactItem>
                <ContactItem
                  icon={Mail}
                  label={t("contact.emailLabel")}
                  href={`mailto:${email}`}
                >
                  {email}
                </ContactItem>
                <ContactItem icon={MapPin} label={t("contact.addressLabel")}>
                  {t("contact.addressValue")}
                </ContactItem>

                <ContactItem icon={Clock} label={t("contact.hoursLabel")}>
                  {t("contact.hoursWeekday")}
                  <br />
                  {t("contact.hoursFriday")}
                </ContactItem>
              </div>

              <div className="contact-trust">
                <TrustBadge icon={ShieldCheck}>{t("contact.trustLicensed")}</TrustBadge>
                <TrustBadge icon={Timer}>{t("contact.trustResponse")}</TrustBadge>
                <TrustBadge icon={BadgeCheck}>{t("contact.trustFree")}</TrustBadge>
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
