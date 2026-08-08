import { useState, useCallback, useMemo } from "react";
import { fmt, pmt } from "../utils";
import { Field } from "../ui/field";
import { TipBox } from "../ui/tip-box";
import { FullCard } from "../ui/full-card";

const BANK_DEFAULTS = [
  { name: "בנק הפועלים", rate: 4.15 },
  { name: "בנק לאומי", rate: 4.22 },
  { name: "בנק מזרחי", rate: 4.19 },
  { name: "בנק דיסקונט", rate: 4.31 },
];

export function CompareCalc() {
  const [loan,  setLoan]  = useState(1000000);
  const [years, setYears] = useState(25);
  const [banks, setBanks] = useState(BANK_DEFAULTS);

  const updateBank = useCallback((i, key, val) => {
    setBanks(prev => prev.map((b, idx) => idx === i ? { ...b, [key]: val } : b));
  }, []);

  const results = useMemo(() => {
    const n = years * 12;
    return banks
      .filter(b => b.rate > 0)
      .map(b => {
        const r   = b.rate / 100 / 12;
        const m   = pmt(r, n, loan);
        const tot = m * n;
        const int = tot - loan;
        return { ...b, m, tot, int };
      })
      .sort((a, b) => a.rate - b.rate);
  }, [banks, loan, years]);

  const best = results[0];

  return (
    <FullCard icon="⚖️" title="השוואת הצעות בנקים"
      subtitle="הזן עד 4 הצעות ובדוק מי נותן את התנאים הטובים ביותר">
      <div className="amort-controls" style={{marginBottom:"1.5rem"}}>
        <Field label="סכום משכנתא ₪">
          <input type="number" value={loan} onChange={e => setLoan(+e.target.value)} />
        </Field>
        <Field label="תקופה (שנים)">
          <select value={years} onChange={e => setYears(+e.target.value)}>
            {[20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>

      <div className="mitzur-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))"}}>
        {banks.map((b, i) => (
          <div key={i} className="mitzur-input-card">
            <h4>🏦 בנק {["א","ב","ג","ד"][i]}</h4>
            <Field label="שם הבנק">
              <input type="text" value={b.name}
                onChange={e => updateBank(i, "name", e.target.value)} />
            </Field>
            <Field label="ריבית %">
              <input type="number" value={b.rate} step={0.01}
                onChange={e => updateBank(i, "rate", +e.target.value)} />
            </Field>
          </div>
        ))}
      </div>

      <div className="amort-wrap" style={{maxHeight:"none",marginBottom:"1rem"}}>
        <table className="compare-table">
          <thead>
            <tr><th>בנק</th><th>ריבית</th><th>תשלום חודשי</th><th>סה״כ החזר</th><th>סה״כ ריבית</th></tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const isBest  = i === 0;
              const saveTot = best ? r.tot - best.tot : 0;
              return (
                <tr key={i} className={isBest ? "highlight-row" : ""}>
                  <td>
                    {r.name}{" "}
                    {isBest
                      ? <span className="badge-save">הטוב ביותר</span>
                      : saveTot > 0
                        ? <span className="badge-cost">+{fmt(saveTot)}</span>
                        : null}
                  </td>
                  <td>{r.rate.toFixed(2)}%</td>
                  <td>{fmt(r.m)}</td>
                  <td>{fmt(r.tot)}</td>
                  <td>{fmt(r.int)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <TipBox>
        <strong>טיפ מקצועי:</strong> הפרש של 0.25% בריבית על משכנתא של מיליון ₪ ל-25 שנה שווה כ-₪37,000 לאורך חיי ההלוואה. שווה להתמקח!
      </TipBox>
    </FullCard>
  );
}
