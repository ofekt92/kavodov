import { useState, useMemo } from "react";
import { fmt, pmt } from "../utils";
import { Field } from "../ui/field";
import { Metric } from "../ui/metric";
import { FullCard } from "../ui/full-card";

export function AmortCalc() {
  const [loan,  setLoan]  = useState(1000000);
  const [rate,  setRate]  = useState(4.5);
  const [years, setYears] = useState(25);
  const [freq,  setFreq]  = useState(12);

  const { summary, rows } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const m = pmt(r, n, loan);
    const totalPay = m * n;
    const totalInt = totalPay - loan;

    const summary = { m, totalPay, totalInt };
    const rows = [];
    let balance = loan, periodPay = 0, periodPrin = 0, periodInt = 0;

    for (let i = 1; i <= n; i++) {
      const intPart  = balance * r;
      const prinPart = m - intPart;
      balance        = Math.max(0, balance - prinPart);
      periodPay  += m; periodPrin += prinPart; periodInt += intPart;
      if (i % freq === 0 || i === n) {
        const label = freq === 1 ? i : Math.ceil(i / 12);
        rows.push({ label, pay: periodPay, prin: periodPrin, int: periodInt, bal: balance });
        periodPay = periodPrin = periodInt = 0;
      }
    }
    return { summary, rows };
  }, [loan, rate, years, freq]);

  return (
    <FullCard icon="📊" title="לוח סילוקין"
      subtitle="פירוט תשלומי קרן וריבית לכל חודש לאורך חיי המשכנתא">
      <div className="amort-controls">
        <Field label="סכום משכנתא ₪">
          <input type="number" value={loan} onChange={e => setLoan(+e.target.value)} />
        </Field>
        <Field label="ריבית שנתית %">
          <input type="number" value={rate} step={0.1} onChange={e => setRate(+e.target.value)} />
        </Field>
        <Field label="תקופה (שנים)">
          <select value={years} onChange={e => setYears(+e.target.value)}>
            {[10,15,20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="תדירות הצגה">
          <select value={freq} onChange={e => setFreq(+e.target.value)}>
            <option value={1}>חודשי</option>
            <option value={12}>שנתי</option>
          </select>
        </Field>
      </div>
      <div className="output-grid" style={{marginBottom:"1.5rem"}}>
        <Metric label="תשלום חודשי"  value={fmt(summary.m)}        color="gold" />
        <Metric label="סה״כ החזר"    value={fmt(summary.totalPay)} />
        <Metric label="סה״כ ריבית"   value={fmt(summary.totalInt)} color="red" />
        <Metric label="אחוז ריבית"
          value={`${Math.round(summary.totalInt / summary.totalPay * 100)}%`} />
      </div>
      <div className="amort-wrap">
        <table className="amort-table">
          <thead>
            <tr>
              <th>{freq === 1 ? "חודש" : "שנה"}</th>
              <th>תשלום</th><th>קרן</th><th>ריבית</th><th>יתרה</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.label}</td>
                <td>{fmt(r.pay)}</td>
                <td>{fmt(r.prin)}</td>
                <td>{fmt(r.int)}</td>
                <td>{fmt(r.bal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FullCard>
  );
}
