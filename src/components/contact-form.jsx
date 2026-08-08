import { useState, useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";

const FORMSPREE_FORM_ID = "xaewwvya";

const initialForm = {
  firstName: "", lastName: "", phone: "", email: "",
  service: "משכנתא לדירה ראשונה", amount: "", notes: "",
};

export default function ContactForm({ onSubmit, onError }) {
  const [formState, submitToFormspree] = useForm(FORMSPREE_FORM_ID);
  const [form, setForm]     = useState(initialForm);
  const [errors, setErrors] = useState({});

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
      <h3>השאר פרטים לייעוץ חינם</h3>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="firstName">שם פרטי *</label>
          <input id="firstName" name="firstName" type="text" placeholder="ישראל" value={form.firstName}
            className={errors.firstName ? "input-error" : ""}
            onChange={e => update("firstName", e.target.value)} />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="lastName">שם משפחה *</label>
          <input id="lastName" name="lastName" type="text" placeholder="ישראלי" value={form.lastName}
            className={errors.lastName ? "input-error" : ""}
            onChange={e => update("lastName", e.target.value)} />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="phone">טלפון *</label>
          <input id="phone" name="phone" type="tel" placeholder="050-0000000" dir="ltr" value={form.phone}
            className={errors.phone ? "input-error" : ""}
            onChange={e => update("phone", e.target.value)} />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="email">אימייל *</label>
          <input id="email" name="email" type="email" placeholder="your@email.com" dir="ltr" value={form.email}
            className={errors.email ? "input-error" : ""}
            onChange={e => update("email", e.target.value)} />
          {errors.email && <span className="error-text">{errors.email}</span>}
          <ValidationError prefix="Email" field="email" errors={formState.errors} className="error-text" />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="service">סוג השירות</label>
        <select id="service" name="service" value={form.service} onChange={e => update("service", e.target.value)}>
          <option>משכנתא לדירה ראשונה</option>
          <option>מיחזור משכנתא</option>
          <option>משכנתא לבנייה עצמית</option>
          <option>נדל"ן להשקעה</option>
          <option>ייעוץ לשיפור תנאים</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="amount">סכום המשכנתא המבוקש (₪)</label>
        <input id="amount" name="amount" type="number" placeholder="1,000,000" dir="ltr" value={form.amount}
          onChange={e => update("amount", e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="notes">הערות נוספות (אופציונלי)</label>
        <textarea id="notes" name="notes" rows={3} placeholder="ספר/י לנו עוד על הצורך שלך..."
          value={form.notes} onChange={e => update("notes", e.target.value)} />
      </div>
      <input type="hidden" name="_subject" value={`פנייה חדשה מהאתר — ${form.firstName} ${form.lastName}`} />
      {/* proof at the friction point — same numbers as the home stats bar */}
      <div className="form-proof">
        <span>+3,200 לקוחות</span>
        <span>97% שביעות רצון</span>
        <span>12+ שנות ניסיון</span>
      </div>
      <button type="submit" className="form-submit" disabled={formState.submitting}>
        {formState.submitting ? "שולח..." : "שלח פנייה — ייעוץ חינם ›"}
      </button>
    </form>
  );
}
