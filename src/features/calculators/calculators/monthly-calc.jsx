import { useState, useMemo } from "react";
import { fmt, pmt, navTo } from "../utils";
import { Field } from "../ui/field";
import { RangeField } from "../ui/range-field";
import { Metric } from "../ui/metric";
import { ResultHero } from "../ui/result-hero";
import { TipBox } from "../ui/tip-box";
import { CalcCard } from "../ui/calc-card";

export function MonthlyCalc() {
  const [loan,    setLoan]   = useState(1200000);
  const [years,   setYears]  = useState(25);
  const [rate,    setRate]   = useState(45);   // ×0.1 = %
  const [equity,  setEquity] = useState(400000);
  const [type,    setType]   = useState("fix");

  const res = useMemo(() => {
    const r  = (rate / 10) / 100 / 12;
    const n  = years * 12;
    const m  = pmt(r, n, loan);
    const tot = m * n;
    const interest = tot - loan;
    const price    = loan + equity;
    const ltv      = price > 0 ? Math.round(loan / price * 100) : 0;
    const pct      = Math.round(m / 20000 * 100);
    return { m, tot, interest, price, ltv, pct };
  }, [loan, years, rate, equity]);

  const tips = {
    fix:   "ריבית קבועה צמודה מעניקה ביטחון לתכנון — אך ריבית פריים עשויה להיות זולה יותר לטווח הקצר.",
    prime: "ריבית פריים מושפעת מהחלטות בנק ישראל — מתאים למי שיכול להתמודד עם שינויים בהחזר.",
    var:   "ריבית משתנה מתאימה לטווח קצר — מומלץ לחשב תרחיש עלייה של 2% בריבית.",
  };

  return (
    <CalcCard
      icon="🏠" title="מחשבון תשלום חודשי"
      subtitle="חשב את ההחזר החודשי הצפוי על פי סכום, ריבית ותקופה"
      inputs={<>
        <Field label="סכום המשכנתא ₪">
          <input type="number" value={loan} min={0} step={10000}
            onChange={e => setLoan(+e.target.value)} />
        </Field>
        <RangeField label="תקופת המשכנתא (שנים)" min={5} max={30} value={years}
          onChange={setYears} display={`${years} שנ׳`} />
        <RangeField label="ריבית שנתית (%)" min={10} max={120} value={rate}
          onChange={setRate} display={`${(rate/10).toFixed(1)}%`} />
        <Field label="הון עצמי ₪">
          <input type="number" value={equity} min={0} step={10000}
            onChange={e => setEquity(+e.target.value)} />
        </Field>
        <Field label="סוג הריבית">
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="fix">קבועה צמודה</option>
            <option value="prime">פריים</option>
            <option value="var">משתנה כל 5 שנים</option>
          </select>
        </Field>
        <button className="calc-btn gold-btn"
          onClick={() => navTo("contact")}>
          קבל הצעה אישית ›
        </button>
      </>}
      outputs={<>
        <ResultHero label="תשלום חודשי" value={fmt(res.m)}
          sub={`כ-${res.pct}% מהכנסה נטו של ${fmt(20000)}`} />
        <div className="output-grid">
          <Metric label="סה״כ החזר"   value={fmt(res.tot)} />
          <Metric label="סה״כ ריבית"  value={fmt(res.interest)} color="red" />
          <Metric label="עלות הנכס"   value={fmt(res.price)} />
          <Metric label="אחוז מימון"  value={`${res.ltv}%`} color="gold" />
        </div>
        <TipBox><strong>טיפ:</strong> {tips[type]}</TipBox>
      </>}
    />
  );
}
