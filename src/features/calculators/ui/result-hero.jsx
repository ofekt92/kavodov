export function ResultHero({ label, value, sub, id, style }) {
  return (
    <div className="result-hero" id={id} style={style}>
      <div className="rh-lbl">{label}</div>
      <div className="rh-val">{value}</div>
      {sub && <div className="rh-sub">{sub}</div>}
    </div>
  );
}
