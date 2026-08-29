import { useState, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fmt, pmt, navTo } from "../utils";
import { Field } from "../ui/field";
import { RangeField } from "../ui/range-field";
import { PaymentDonut } from "../ui/payment-donut";
import { TipBox } from "../ui/tip-box";
import { CalcCard } from "../ui/calc-card";
import { MoneyInput } from "../../../components/money-input";
import { CALC_ICONS } from "../../../lib/calc-icons";

const Icon = CALC_ICONS.monthly;

const PRINCIPAL_COLOR = "#0d1f3c";
const INTEREST_COLOR  = "#c9a84c";

const MAX_LTV = 75;

export function MonthlyCalc() {
  const { t } = useTranslation();
  const [loan,    setLoan]   = useState(1200000);
  const [years,   setYears]  = useState(25);
  const [rate,    setRate]   = useState(45);
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

    const principalShare = tot > 0 ? Math.round(loan / tot * 100) : 0;

    const principalPerMonth = n > 0 ? loan / n : 0;

    const outlay = tot + equity;
    return { m, tot, interest, price, ltv, pct, n, outlay,
             overLtv: ltv > MAX_LTV, principalShare,
             interestShare: tot > 0 ? 100 - principalShare : 0,
             principalPerMonth,
             interestPerMonth: n > 0 ? interest / n : 0 };
  }, [loan, years, rate, equity]);

  return (
    <CalcCard
      icon={<Icon size={22} strokeWidth={2} aria-hidden="true" />} title={t("calculators.monthly.title")}
      subtitle={t("calculators.monthly.subtitle")}
      inputs={<>
        <Field label={t("calculators.monthly.amount")}>
          <MoneyInput value={loan} onChange={setLoan} />
        </Field>
        <RangeField label={t("calculators.monthly.term")} min={5} max={30} step={5} value={years}
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
        <PaymentDonut
          centerLabel={t("calculators.common.monthlyPayment")}
          centerValue={fmt(res.m)}
          centerSub={t("calculators.monthly.resultSub", { pct: res.pct, income: fmt(20000) })}
          formatValue={fmt}
          segments={[
            { key: "principal", label: t("calculators.common.principal"),     value: loan,
              tip: t("calculators.common.perMonthAvg", { amount: fmt(res.principalPerMonth) }), color: PRINCIPAL_COLOR },

            { key: "interest",  label: t("calculators.common.interest"), value: res.interest,
              tip: t("calculators.common.perMonthAvg", { amount: fmt(res.interestPerMonth) }),  color: INTEREST_COLOR  },
          ]}
          rows={[
            { key: "principal", label: t("calculators.common.principal"),     value: fmt(loan),         color: PRINCIPAL_COLOR, share: res.principalShare,
              sub: t("calculators.common.perMonthAvg", { amount: fmt(res.principalPerMonth) }) },
            { key: "interest",  label: t("calculators.common.totalInterest"), value: fmt(res.interest), color: INTEREST_COLOR, tone: "gold", share: res.interestShare,
              sub: t("calculators.common.perMonthAvg", { amount: fmt(res.interestPerMonth) }) },
            { key: "total",     label: t("calculators.common.totalPaid"),     value: fmt(res.tot) },
            { key: "price",     label: t("calculators.monthly.propertyCost"), value: fmt(res.price) },
            { key: "outlay",    label: t("calculators.monthly.totalOutlay"),  value: fmt(res.outlay),
              sub: t("calculators.monthly.totalOutlaySub") },
            { key: "ltv",       label: t("calculators.common.ltv"),           value: `${res.ltv}%`,
              tone: res.overLtv ? "red" : undefined },
          ]}
        />
        {res.overLtv && (
          <p className="calc-warning" role="status">
            <AlertTriangle size={15} strokeWidth={2.25} aria-hidden="true" />
            <span>{t("calculators.monthly.ltvWarning", { max: MAX_LTV, ltv: res.ltv })}</span>
          </p>
        )}
        <TipBox>
          <strong>{t("calculators.monthly.tipLabel")}</strong> {t(`calculators.monthly.tips.${type}`)}
        </TipBox>
      </>}
    />
  );
}
