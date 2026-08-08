import { useState, useCallback, useMemo } from "react";
import { fmt, pmt } from "../utils";
import { Field } from "../ui/field";
import { TipBox } from "../ui/tip-box";
import { FullCard } from "../ui/full-card";

const TRACK_DEFAULTS = [
  { name: "🔵 קבועה צמודה",        amt: 480000, rate: 4.2, years: 25, color: "#185FA5" },
  { name: "🟡 פריים",               amt: 480000, rate: 3.8, years: 25, color: "#c9a84c" },
  { name: "🟠 משתנה כל 5 שנים",    amt: 240000, rate: 4.6, years: 25, color: "#d35400" },
];

export function MixCalc() {
  const [total,  setTotal]  = useState(1200000);
  const [tracks, setTracks] = useState(TRACK_DEFAULTS);

  const update = useCallback((i, key, val) => {
    setTracks(prev => prev.map((t, idx) => idx === i ? { ...t, [key]: val } : t));
  }, []);

  const results = useMemo(() => {
    const sumAmts = tracks.reduce((s, t) => s + t.amt, 0);
    const warning = Math.abs(sumAmts - total) > 1000;
    let sumMonthly = 0, sumTotal = 0;
    const rows = tracks.map((t, i) => {
      if (!t.amt) return null;
      const r   = t.rate / 100 / 12;
      const n   = t.years * 12;
      const m   = pmt(r, n, t.amt);
      const tot = m * n;
      const int = tot - t.amt;
      const pct = total > 0 ? Math.round(t.amt / total * 100) : 0;
      sumMonthly += m; sumTotal += tot;
      return { ...t, m, int, pct };
    }).filter(Boolean);
    return { rows, sumMonthly, sumTotal, warning, sumAmts };
  }, [tracks, total]);

  return (
    <FullCard icon="🧮" title="בניית תמהיל מסלולים"
      subtitle="חשב שילוב של עד 3 מסלולים ובדוק את ההחזר הכולל">
      <Field label="סך המשכנתא ₪">
        <div style={{maxWidth:300}}>
          <input type="number" value={total} onChange={e => setTotal(+e.target.value)} />
        </div>
      </Field>
      <div className="mitzur-grid">
        {tracks.map((t, i) => (
          <div key={i} className="mitzur-input-card">
            <h4>{t.name}</h4>
            <Field label="סכום ₪">
              <input type="number" value={t.amt}
                onChange={e => update(i, "amt", +e.target.value)} />
            </Field>
            <Field label={i===1 ? "ריבית % (פריים ±)" : "ריבית %"}>
              <input type="number" value={t.rate} step={0.1}
                onChange={e => update(i, "rate", +e.target.value)} />
            </Field>
            <Field label="שנים">
              <select value={t.years} onChange={e => update(i, "years", +e.target.value)}>
                {[20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
          </div>
        ))}
      </div>

      {results.warning && (
        <div style={{color:"var(--red)",fontSize:13,marginBottom:"1rem"}}>
          ⚠️ סך המסלולים ({fmt(results.sumAmts)}) שונה מסך המשכנתא ({fmt(total)})
        </div>
      )}

      <div className="result-hero" style={{marginBottom:"1rem"}}>
        <div className="rh-lbl">סה״כ תשלום חודשי משולב</div>
        <div className="rh-val">{fmt(results.sumMonthly)}</div>
        <div className="rh-sub">סה״כ החזר על כל המסלולים: {fmt(results.sumTotal)}</div>
      </div>

      <div className="amort-wrap" style={{maxHeight:200}}>
        <table className="amort-table">
          <thead>
            <tr><th>מסלול</th><th>סכום</th><th>ריבית</th><th>תקופה</th><th>תשלום חודשי</th><th>סה״כ ריבית</th></tr>
          </thead>
          <tbody>
            {results.rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:r.color,marginLeft:6}} />
                  {r.name}
                </td>
                <td>{fmt(r.amt)} ({r.pct}%)</td>
                <td>{r.rate.toFixed(2)}%</td>
                <td>{r.years} שנ׳</td>
                <td>{fmt(r.m)}</td>
                <td>{fmt(r.int)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TipBox>
        <strong>המלצת מומחה:</strong> תמהיל מאוזן בין מסלולים מקטין סיכון — שילוב של קבועה צמודה עם פריים הוא הפופולרי ביותר בישראל.
      </TipBox>
    </FullCard>
  );
}
