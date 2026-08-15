export function RangeField({ label, id, min, max, step = 1, value, onChange, display }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="range-wrap">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))} />
        <div className="range-val">{display}</div>
      </div>
    </div>
  );
}
