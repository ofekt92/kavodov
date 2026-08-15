import { useTranslation } from "react-i18next";
import { setLanguage } from "../i18n";

/** Label shows the language you'd get by clicking, not the current one. */
const NEXT  = { he: "en", en: "he" };
const SHORT = { he: "עב", en: "EN" };

export default function LanguageSwitch({ className = "", onChange }) {
  const { i18n, t } = useTranslation();
  const current = NEXT[i18n.language] ? i18n.language : "he";
  const next    = NEXT[current];

  return (
    <button
      type="button"
      className={`lang-switch ${className}`}
      lang={next}
      title={t("language.switchTo")}
      aria-label={t("language.switchTo")}
      onClick={() => { setLanguage(next); onChange?.(); }}
    >
      <span className="lang-globe" aria-hidden="true">🌐</span>
      {SHORT[next]}
    </button>
  );
}
