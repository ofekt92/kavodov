import { useState, useMemo } from "react";
import { fmt, pmt, navTo } from "../utils";
import { Field } from "../ui/field";
import { RangeField } from "../ui/range-field";
import { Metric } from "../ui/metric";
import { ResultHero } from "../ui/result-hero";
import { CalcCard } from "../ui/calc-card";

export function RefiCalc() {
  const [bal,       setBal]       = useState(900000);
  const [oldRate,   setOldRate]   = useState(55);
  const [yearsLeft, setYearsLeft] = useState(20);
  const [newRate,   setNewRate]   = useState(42);
  const [penalty,   setPenalty]   = useState(15000);
  const [costs,     setCosts]     = useState(8000);

  const res = useMemo(() => {
    const oR = (oldRate / 10) / 100 / 12;
    const nR = (newRate / 10) / 100 / 12;
    const n  = yearsLeft * 12;
    const oldPay = pmt(oR, n, bal);
    const newPay = pmt(nR, n, bal);
    const monthlySave = oldPay - newPay;
    const totalCost   = penalty + costs;
    const totalSave   = monthlySave * n - totalCost;
    const breakeven   = monthlySave > 0 ? Math.ceil(totalCost / monthlySave) : 999;
    const worthy      = totalSave > 0 && monthlySave > 0;
    return { oldPay, newPay, monthlySave, totalSave, breakeven, worthy };
  }, [bal, oldRate, yearsLeft, newRate, penalty, costs]);

  return (
    <CalcCard
      icon="🔄" title="כדאיות מיחזור משכנתא"
      subtitle="האם שווה למחזר? חשב חיסכון מצפוי ונקודת איזון"
      inputs={<>
        <h3 className="section-sub">משכנתא קיימת</h3>
        <Field label="יתרת קרן ₪">
          <input type="number" value={bal} onChange={e => setBal(+e.target.value)} />
        </Field>
        <RangeField label="ריבית נוכחית (%)" min={10} max={120} value={oldRate}
          onChange={setOldRate} display={`${(oldRate/10).toFixed(1)}%`} />
        <RangeField label="שנים שנותרו" min={1} max={30} value={yearsLeft}
          onChange={setYearsLeft} display={`${yearsLeft} שנ׳`} />
        <hr className="divider-line" />
        <h3 className="section-sub">משכנתא חדשה לאחר מיחזור</h3>
        <RangeField label="ריבית חדשה (%)" min={10} max={120} value={newRate}
          onChange={setNewRate} display={`${(newRate/10).toFixed(1)}%`} />
        <Field label="עמלת פירעון מוקדם ₪">
          <input type="number" value={penalty} onChange={e => setPenalty(+e.target.value)} />
        </Field>
        <Field label="עלויות מיחזור (שמאות, עו״ד וכו') ₪">
          <input type="number" value={costs} onChange={e => setCosts(+e.target.value)} />
        </Field>
      </>}
      outputs={<>
        <ResultHero
          label="המלצה"
          value={res.worthy ? "כדאי למחזר!" : "לא כדאי כרגע"}
          sub={res.worthy ? `חיסכון כולל: ${fmt(res.totalSave)}` : "עלויות המיחזור גבוהות מהחיסכון"}
          style={{ background: res.worthy ? "var(--green)" : "var(--red)" }}
        />
        <div className="output-grid">
          <Metric label="תשלום נוכחי"    value={fmt(res.oldPay)} />
          <Metric label="תשלום חדש"      value={fmt(res.newPay)} color="green" />
          <Metric label="חיסכון חודשי"   value={fmt(Math.abs(res.monthlySave))} color="gold" />
          <Metric label="חיסכון כולל"    value={fmt(Math.abs(res.totalSave))} color="green" />
          <Metric label="נקודת איזון (break-even)"
            value={res.breakeven < 999 ? `${res.breakeven} חודשים` : "לא כדאי"}
            sub="לאחר תקופה זו — אתה ברווח" full />
        </div>
        <button className="calc-btn gold-btn"
          onClick={() => navTo("contact")}>
          רוצה שנמחזר עבורך? ›
        </button>
      </>}
    />
  );
}
