import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { fmt, pmt, navTo } from "../utils";
import { Field } from "../ui/field";
import { RangeField } from "../ui/range-field";
import { Metric } from "../ui/metric";
import { ResultHero } from "../ui/result-hero";
import { CalcCard } from "../ui/calc-card";
import { MoneyInput } from "../../../components/money-input";

export function RefiCalc() {
  const { t } = useTranslation();
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
      icon="🔄" title={t("calculators.refi.title")}
      subtitle={t("calculators.refi.subtitle")}
      inputs={<>
        <h3 className="section-sub">{t("calculators.refi.existingHeading")}</h3>
        <Field label={t("calculators.refi.balance")}>
          <MoneyInput value={bal} onChange={setBal} />
        </Field>
        <RangeField label={t("calculators.refi.currentRate")} min={10} max={120} value={oldRate}
          onChange={setOldRate} display={`${(oldRate/10).toFixed(1)}%`} />
        <RangeField label={t("calculators.refi.yearsLeft")} min={1} max={30} value={yearsLeft}
          onChange={setYearsLeft} display={t("calculators.common.yearsShort", { years: yearsLeft })} />
        <hr className="divider-line" />
        <h3 className="section-sub">{t("calculators.refi.newHeading")}</h3>
        <RangeField label={t("calculators.refi.newRate")} min={10} max={120} value={newRate}
          onChange={setNewRate} display={`${(newRate/10).toFixed(1)}%`} />
        <Field label={t("calculators.refi.penalty")}>
          <MoneyInput value={penalty} onChange={setPenalty} />
        </Field>
        <Field label={t("calculators.refi.costs")}>
          <MoneyInput value={costs} onChange={setCosts} />
        </Field>
      </>}
      outputs={<>
        <ResultHero
          label={t("calculators.refi.recommendation")}
          value={res.worthy ? t("calculators.refi.worthy") : t("calculators.refi.notWorthy")}
          sub={res.worthy
            ? t("calculators.refi.worthySub", { amount: fmt(res.totalSave) })
            : t("calculators.refi.notWorthySub")}
          style={{ background: res.worthy ? "var(--green)" : "var(--red)" }}
        />
        <div className="output-grid">
          <Metric label={t("calculators.refi.currentPayment")} value={fmt(res.oldPay)} />
          <Metric label={t("calculators.refi.newPayment")}     value={fmt(res.newPay)} color="green" />
          <Metric label={t("calculators.refi.monthlySaving")}  value={fmt(Math.abs(res.monthlySave))} color="gold" />
          <Metric label={t("calculators.refi.totalSaving")}    value={fmt(Math.abs(res.totalSave))} color="green" />
          <Metric label={t("calculators.refi.breakeven")}
            value={res.breakeven < 999
              ? t("calculators.refi.breakevenValue", { months: res.breakeven })
              : t("calculators.refi.breakevenNever")}
            sub={t("calculators.refi.breakevenSub")} full />
        </div>
        <button className="calc-btn gold-btn"
          onClick={() => navTo("contact")}>
          {t("calculators.refi.cta")}
        </button>
      </>}
    />
  );
}
