import { useState, useMemo } from "react";
import { fmt } from "../utils";
import { Field } from "../ui/field";
import { RangeField } from "../ui/range-field";
import { Metric } from "../ui/metric";
import { ResultHero } from "../ui/result-hero";
import { TipBox } from "../ui/tip-box";
import { CalcCard } from "../ui/calc-card";

export function AffordCalc() {
  const [inc1,   setInc1]   = useState(12000);
  const [inc2,   setInc2]   = useState(9000);
  const [oblig,  setOblig]  = useState(2000);
  const [equity, setEquity] = useState(300000);
  const [years,  setYears]  = useState(25);
  const [rate,   setRate]   = useState(45);

  const res = useMemo(() => {
    const r          = (rate / 10) / 100 / 12;
    const n          = years * 12;
    const totalInc   = inc1 + inc2;
    const freeInc    = totalInc - oblig;
    const maxPay     = freeInc * 0.30;
    const maxLoan    = r === 0 ? maxPay * n : maxPay * (Math.pow(1+r,n)-1) / (r * Math.pow(1+r,n));
    const maxPrice   = maxLoan + equity;
    const ltv        = maxPrice > 0 ? Math.round(maxLoan / maxPrice * 100) : 0;
    return { freeInc, maxPay, maxLoan, maxPrice, ltv };
  }, [inc1, inc2, oblig, equity, years, rate]);

  return (
    <CalcCard
      icon="💰" title="מחשבון כושר השתכרות"
      subtitle="כמה משכנתא אתה יכול לקחת לפי ההכנסה שלך?"
      inputs={<>
        <Field label="הכנסה חודשית נטו — מבקש 1 ₪">
          <input type="number" value={inc1} onChange={e => setInc1(+e.target.value)} />
        </Field>
        <Field label="הכנסה חודשית נטו — מבקש 2 ₪ (אם קיים)">
          <input type="number" value={inc2} onChange={e => setInc2(+e.target.value)} />
        </Field>
        <Field label="התחייבויות קיימות (הלוואות, ליסינג וכו') ₪/חודש">
          <input type="number" value={oblig} onChange={e => setOblig(+e.target.value)} />
        </Field>
        <Field label="הון עצמי זמין ₪">
          <input type="number" value={equity} onChange={e => setEquity(+e.target.value)} />
        </Field>
        <RangeField label="תקופת משכנתא רצויה (שנים)" min={10} max={30} value={years}
          onChange={setYears} display={`${years} שנ׳`} />
        <RangeField label="ריבית ממוצעת צפויה (%)" min={10} max={100} value={rate}
          onChange={setRate} display={`${(rate/10).toFixed(1)}%`} />
      </>}
      outputs={<>
        <ResultHero label="משכנתא מקסימלית מומלצת" value={fmt(res.maxLoan)}
          sub={`לפי כלל 30% מההכנסה הפנויה של ${fmt(res.freeInc)}/חודש`} />
        <div className="output-grid">
          <Metric label="הכנסה פנויה"            value={fmt(res.freeInc)} />
          <Metric label="תשלום חודשי מקסימלי"    value={fmt(res.maxPay)} color="gold" />
          <Metric label="מחיר נכס מקסימלי"       value={fmt(res.maxPrice)} />
          <Metric label="אחוז מימון"              value={`${res.ltv}%`} color="green" />
        </div>
        <TipBox>
          <strong>כלל אצבע:</strong> הבנקים בישראל מאפשרים החזר חודשי של עד 40% מההכנסה נטו, אך מומלץ לשמור על 30% לביטחון פיננסי.
        </TipBox>
      </>}
    />
  );
}
