import { useRef } from "react";
import { numberLocale } from "../i18n";

const group = (n) => n.toLocaleString(numberLocale());

export const MAX_AMOUNT = 100_000_000;

export function MoneyInput({ value, onChange, min = 0, max = MAX_AMOUNT, emptyValue = 0, ...rest }) {
  const ref = useRef(null);

  const display =
    value === "" || value === null || value === undefined || Number.isNaN(value)
      ? ""
      : group(value);

  const handleChange = (e) => {
    const el = e.target;
    const caret = el.selectionStart ?? el.value.length;

    const digitsBefore = el.value.slice(0, caret).replace(/\D/g, "").length;

    const digits = el.value.replace(/\D/g, "");
    if (digits === "") {

      onChange(emptyValue);
    } else {
      let next = Number(digits);
      if (max !== undefined) next = Math.min(next, max);
      if (min !== undefined) next = Math.max(next, min);
      onChange(next);
    }

    requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      let seen = 0;
      let pos = digitsBefore === 0 ? 0 : node.value.length;
      for (let i = 0; i < node.value.length; i++) {
        if (/\d/.test(node.value[i])) {
          seen += 1;
          if (seen === digitsBefore) {
            pos = i + 1;
            break;
          }
        }
      }
      node.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="money-input">
      <span className="money-adornment" aria-hidden="true">₪</span>
      <input
        {...rest}
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        dir="ltr"
        value={display}
        onChange={handleChange}
      />
    </div>
  );
}
