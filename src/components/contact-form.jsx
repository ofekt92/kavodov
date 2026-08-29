import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, ValidationError } from "@formspree/react";
import i18n from "../i18n";
import { MoneyInput } from "./money-input";

const FORMSPREE_FORM_ID = "xaewwvya";

const SERVICE_KEYS = ["first", "refi", "selfBuild", "investment", "improve"];

const initialForm = {
  firstName: "", lastName: "", phone: "", email: "",
  service: SERVICE_KEYS[0], amount: "", notes: "",
};

export default function ContactForm({ onSubmit, onError }) {
  const { t } = useTranslation();
  const [formState, submitToFormspree] = useForm(FORMSPREE_FORM_ID);
  const [form, setForm]     = useState(initialForm);
  const [errors, setErrors] = useState({});

  const he = i18n.getFixedT("he");

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = t("form.errorRequired");
    if (!form.lastName.trim())  err.lastName  = t("form.errorRequired");
    if (!form.phone.trim())     err.phone     = t("form.errorRequired");
    else if (!/^[\d\-\+\s\(\)]{9,}$/.test(form.phone)) err.phone = t("form.errorPhone");
    if (!form.email.trim())     err.email     = t("form.errorRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = t("form.errorEmail");
    return err;
  };

  const handleSubmit = (e) => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) {
      e.preventDefault();
      return;
    }
    submitToFormspree(e);
  };

  useEffect(() => {
    if (formState.succeeded) {
      onSubmit?.();
      setForm(initialForm);
    }
  }, [formState.succeeded]);

  useEffect(() => {
    if (formState.errors?.getAll?.().length) onError?.();
  }, [formState.errors]);

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>{t("form.title")}</h3>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="firstName">{t("form.firstName")}</label>
          <input id="firstName" name="firstName" type="text" placeholder={t("form.firstNamePlaceholder")} value={form.firstName}
            className={errors.firstName ? "input-error" : ""}
            onChange={e => update("firstName", e.target.value)} />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="lastName">{t("form.lastName")}</label>
          <input id="lastName" name="lastName" type="text" placeholder={t("form.lastNamePlaceholder")} value={form.lastName}
            className={errors.lastName ? "input-error" : ""}
            onChange={e => update("lastName", e.target.value)} />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="phone">{t("form.phone")}</label>
          <input id="phone" name="phone" type="tel" placeholder={t("form.phonePlaceholder")} dir="ltr" value={form.phone}
            className={errors.phone ? "input-error" : ""}
            onChange={e => update("phone", e.target.value)} />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="email">{t("form.email")}</label>
          <input id="email" name="email" type="email" placeholder={t("form.emailPlaceholder")} dir="ltr" value={form.email}
            className={errors.email ? "input-error" : ""}
            onChange={e => update("email", e.target.value)} />
          {errors.email && <span className="error-text">{errors.email}</span>}
          <ValidationError prefix="Email" field="email" errors={formState.errors} className="error-text" />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="service">{t("form.service")}</label>
        <select id="service" value={form.service} onChange={e => update("service", e.target.value)}>
          {SERVICE_KEYS.map(key => (
            <option key={key} value={key}>{t(`form.serviceOptions.${key}`)}</option>
          ))}
        </select>
        <input type="hidden" name="service" value={he(`form.serviceOptions.${form.service}`)} />
      </div>
      <div className="form-field">
        <label htmlFor="amount">{t("form.amount")}</label>
        <MoneyInput id="amount" name="amount" placeholder={t("form.amountPlaceholder")}
          value={form.amount} emptyValue="" onChange={v => update("amount", v)} />
      </div>
      <div className="form-field">
        <label htmlFor="notes">{t("form.notes")}</label>
        <textarea id="notes" name="notes" rows={3} placeholder={t("form.notesPlaceholder")}
          value={form.notes} onChange={e => update("notes", e.target.value)} />
      </div>
      <input type="hidden" name="_subject"
        value={he("form.subject", { firstName: form.firstName, lastName: form.lastName })} />
      <input type="hidden" name="_language" value={i18n.language} />
      <div className="form-proof">
        <span>{t("form.proofClients")}</span>
        <span>{t("form.proofSatisfaction")}</span>
        <span>{t("form.proofExperience")}</span>
      </div>
      <button type="submit" className="form-submit" disabled={formState.submitting}>
        {formState.submitting ? t("form.submitting") : t("form.submit")}
      </button>
    </form>
  );
}
