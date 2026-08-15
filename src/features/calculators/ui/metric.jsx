export function Metric({ label, value, color, sub, full }) {
  return (
    <div className={`metric ${full ? "metric-full" : ""}`}>
      <div className="metric-lbl">{label}</div>
      <div className={`metric-val ${color || ""}`}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}
