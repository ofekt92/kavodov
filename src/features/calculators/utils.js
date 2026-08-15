import { numberLocale } from "../../i18n";

/** Shekel amounts keep the ₪ sign in both languages — only grouping is localized. */
export const fmt = n => "₪" + Math.round(n).toLocaleString(numberLocale());

export const pmt = (r, n, pv) => r === 0 ? pv / n : pv * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

export { navTo } from "../../lib/navigate";
