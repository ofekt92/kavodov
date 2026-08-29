import { numberLocale } from "../../i18n";

export const fmt = n => "₪" + Math.round(n).toLocaleString(numberLocale());

export const MAX_RATE = 100;
export const clampRate = raw => {
  const n = Number(raw);
  if (Number.isNaN(n)) return 0;
  return Math.min(Math.max(n, 0), MAX_RATE);
};

export const pmt = (r, n, pv) => r === 0 ? pv / n : pv * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

export { navTo } from "../../lib/navigate";
