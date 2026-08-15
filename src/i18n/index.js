import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import he from "./locales/he.json";
import en from "./locales/en.json";

export const LANGUAGES = {
  he: { dir: "rtl", numberLocale: "he-IL" },
  en: { dir: "ltr", numberLocale: "en-US" },
};

export const DEFAULT_LANGUAGE = "he";

const STORAGE_KEY = "mashpro:lang";

/** Saved choice → browser preference → Hebrew. */
function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES[saved]) return saved;
  } catch {
    /* private mode / storage disabled — fall through */
  }
  const browser = navigator.language?.slice(0, 2);
  return LANGUAGES[browser] ? browser : DEFAULT_LANGUAGE;
}

i18n.use(initReactI18next).init({
  resources: {
    he: { translation: he },
    en: { translation: en },
  },
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false }, // React already escapes
  returnObjects: true,                   // SERVICES / PROCESS / … come back as arrays
});

/**
 * Mirrors the active language onto <html> so CSS logical properties flip
 * direction and the browser picks the right font/hyphenation rules.
 */
function applyToDocument(lng) {
  const { dir } = LANGUAGES[lng] || LANGUAGES[DEFAULT_LANGUAGE];
  document.documentElement.lang = lng;
  document.documentElement.dir  = dir;
  document.title = i18n.t("meta.title");
}

applyToDocument(i18n.language);
i18n.on("languageChanged", applyToDocument);

export function setLanguage(lng) {
  if (!LANGUAGES[lng]) return;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* choice just won't persist */
  }
  i18n.changeLanguage(lng);
}

/** Number-formatting locale for the active language. */
export const numberLocale = () =>
  (LANGUAGES[i18n.language] || LANGUAGES[DEFAULT_LANGUAGE]).numberLocale;

export default i18n;
