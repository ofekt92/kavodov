import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MAX_RATE, clampRate, fmt, pmt } from "../utils";
import { Field } from "../ui/field";
import { Segmented } from "../ui/segmented";
import { Metric } from "../ui/metric";
import { FullCard } from "../ui/full-card";
import { MoneyInput } from "../../../components/money-input";
import { CALC_ICONS } from "../../../lib/calc-icons";

const Icon = CALC_ICONS.amort;

export function AmortCalc() {
  const { t } = useTranslation();
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
    <FullCard icon={<Icon size={22} strokeWidth={2} aria-hidden="true" />} title={t("calculators.amort.title")}
      subtitle={t("calculators.amort.subtitle")}>
      <div className="amort-controls">
        <Field label={t("calculators.common.loanAmount")}>
          <MoneyInput value={loan} onChange={setLoan} />
        </Field>
        <Field label={t("calculators.common.annualRate")}>
          <input type="number" value={rate} step={0.1} min={0} max={MAX_RATE}
            onChange={e => setRate(clampRate(e.target.value))} />
        </Field>
        <Field label={t("calculators.common.term")}>
          <select value={years} onChange={e => setYears(+e.target.value)}>
            {[10,15,20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
        <Segmented label={t("calculators.amort.frequency")} value={freq} onChange={setFreq}
          options={[
            { value: 1,  label: t("calculators.amort.monthly") },
            { value: 12, label: t("calculators.amort.yearly")  },
          ]} />
      </div>
      <div className="output-grid" style={{marginBottom:"1.5rem"}}>
        <Metric label={t("calculators.common.monthlyPayment")} value={fmt(summary.m)}        color="gold" />
        <Metric label={t("calculators.common.totalPaid")}      value={fmt(summary.totalPay)} />
        <Metric label={t("calculators.common.totalInterest")}  value={fmt(summary.totalInt)} color="red" />
        <Metric label={t("calculators.amort.interestShare")}
          value={`${Math.round(summary.totalInt / summary.totalPay * 100)}%`} />
      </div>
      <div className="amort-wrap">
        <table className="amort-table">
          <thead>
            <tr>
              <th>{freq === 1 ? t("calculators.amort.colMonth") : t("calculators.amort.colYear")}</th>
              <th>{t("calculators.amort.colPayment")}</th>
              <th>{t("calculators.amort.colPrincipal")}</th>
              <th>{t("calculators.amort.colInterest")}</th>
              <th>{t("calculators.amort.colBalance")}</th>
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
