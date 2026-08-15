export function CalcCard({ icon, title, subtitle, inputs, outputs }) {
  return (
    <div className="calc-card">
      <div className="calc-card-header">
        <div className="calc-card-icon">{icon}</div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">{inputs}</div>
        <div className="calc-outputs">{outputs}</div>
      </div>
    </div>
  );
}
