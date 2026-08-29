import { useRef } from "react";

export function Segmented({ label, value, onChange, options }) {
  const ref = useRef(null);

  const move = (delta) => {
    const i = options.findIndex((o) => o.value === value);
    const next = options[(i + delta + options.length) % options.length];
    onChange(next.value);

    requestAnimationFrame(() => {
      const nodes = ref.current?.querySelectorAll("button");
      nodes?.[options.indexOf(next)]?.focus();
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    }
  };

  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="segmented" role="radiogroup" aria-label={label} ref={ref} onKeyDown={onKeyDown}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              className={"segmented-option" + (active ? " is-active" : "")}
              onClick={() => onChange(o.value)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
