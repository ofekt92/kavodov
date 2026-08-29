import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { fmt } from "../utils";
import { Field } from "../ui/field";
import { RangeField } from "../ui/range-field";
import { Metric } from "../ui/metric";
import { ResultHero } from "../ui/result-hero";
import { TipBox } from "../ui/tip-box";
import { CalcCard } from "../ui/calc-card";
import { MoneyInput } from "../../../components/money-input";
import { CALC_ICONS } from "../../../lib/calc-icons";

const Icon = CALC_ICONS.afford;

export function AffordCalc() {
  const { t } = useTranslation();
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
      icon={<Icon size={22} strokeWidth={2} aria-hidden="true" />} title={t("calculators.afford.title")}
      subtitle={t("calculators.afford.subtitle")}
      inputs={<>
        <Field label={t("calculators.afford.income1")}>
          <MoneyInput value={inc1} onChange={setInc1} />
        </Field>
        <Field label={t("calculators.afford.income2")}>
          <MoneyInput value={inc2} onChange={setInc2} />
        </Field>
        <Field label={t("calculators.afford.obligations")}>
          <MoneyInput value={oblig} onChange={setOblig} />
        </Field>
        <Field label={t("calculators.afford.equity")}>
          <MoneyInput value={equity} onChange={setEquity} />
        </Field>
        <RangeField label={t("calculators.afford.term")} min={5} max={30} step={5} value={years}
          onChange={setYears} display={t("calculators.common.yearsShort", { years })} />
        <RangeField label={t("calculators.afford.rate")} min={10} max={100} value={rate}
          onChange={setRate} display={`${(rate/10).toFixed(1)}%`} />
      </>}
      outputs={<>
        <ResultHero label={t("calculators.afford.resultLabel")} value={fmt(res.maxLoan)}
          sub={t("calculators.afford.resultSub", { amount: fmt(res.freeInc) })} />
        <div className="output-grid">
          <Metric label={t("calculators.afford.freeIncome")} value={fmt(res.freeInc)} />
          <Metric label={t("calculators.afford.maxPayment")} value={fmt(res.maxPay)} color="gold" />
          <Metric label={t("calculators.afford.maxPrice")}   value={fmt(res.maxPrice)} />
          <Metric label={t("calculators.common.ltv")}        value={`${res.ltv}%`} color="green" />
        </div>
        <TipBox>
          <strong>{t("calculators.afford.tipLabel")}</strong> {t("calculators.afford.tip")}
        </TipBox>
      </>}
    />
  );
}
