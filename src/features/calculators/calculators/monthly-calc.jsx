import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { fmt, pmt, navTo } from "../utils";
import { Field } from "../ui/field";
import { RangeField } from "../ui/range-field";
import { Metric } from "../ui/metric";
import { ResultHero } from "../ui/result-hero";
import { TipBox } from "../ui/tip-box";
import { CalcCard } from "../ui/calc-card";
import { MoneyInput } from "../../../components/money-input";

export function MonthlyCalc() {
  const { t } = useTranslation();
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

  return (
    <CalcCard
      icon="🏠" title={t("calculators.monthly.title")}
      subtitle={t("calculators.monthly.subtitle")}
      inputs={<>
        <Field label={t("calculators.monthly.amount")}>
          <MoneyInput value={loan} onChange={setLoan} />
        </Field>
        <RangeField label={t("calculators.monthly.term")} min={5} max={30} value={years}
          onChange={setYears} display={t("calculators.common.yearsShort", { years })} />
        <RangeField label={t("calculators.monthly.rate")} min={10} max={120} value={rate}
          onChange={setRate} display={`${(rate/10).toFixed(1)}%`} />
        <Field label={t("calculators.monthly.equity")}>
          <MoneyInput value={equity} onChange={setEquity} />
        </Field>
        <Field label={t("calculators.monthly.rateType")}>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="fix">{t("calculators.monthly.typeFix")}</option>
            <option value="prime">{t("calculators.monthly.typePrime")}</option>
            <option value="var">{t("calculators.monthly.typeVar")}</option>
          </select>
        </Field>
        <button className="calc-btn gold-btn"
          onClick={() => navTo("contact")}>
          {t("calculators.common.personalOffer")}
        </button>
      </>}
      outputs={<>
        <ResultHero label={t("calculators.common.monthlyPayment")} value={fmt(res.m)}
          sub={t("calculators.monthly.resultSub", { pct: res.pct, income: fmt(20000) })} />
        <div className="output-grid">
          <Metric label={t("calculators.common.totalPaid")}     value={fmt(res.tot)} />
          <Metric label={t("calculators.common.totalInterest")} value={fmt(res.interest)} color="red" />
          <Metric label={t("calculators.monthly.propertyCost")} value={fmt(res.price)} />
          <Metric label={t("calculators.common.ltv")}           value={`${res.ltv}%`} color="gold" />
        </div>
        <TipBox>
          <strong>{t("calculators.monthly.tipLabel")}</strong> {t(`calculators.monthly.tips.${type}`)}
        </TipBox>
      </>}
    />
  );
}
