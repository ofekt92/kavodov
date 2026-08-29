import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MAX_RATE, clampRate, fmt, pmt } from "../utils";
import { Field } from "../ui/field";
import { TipBox } from "../ui/tip-box";
import { FullCard } from "../ui/full-card";
import { MoneyInput } from "../../../components/money-input";
import { CALC_ICONS } from "../../../lib/calc-icons";

const Icon = CALC_ICONS.compare;

const BANK_DEFAULTS = [
  { name: null, rate: 4.15 },
  { name: null, rate: 4.22 },
  { name: null, rate: 4.19 },
  { name: null, rate: 4.31 },
];

export function CompareCalc() {
  const { t } = useTranslation();
  const [loan,  setLoan]  = useState(1000000);
  const [years, setYears] = useState(25);
  const [banks, setBanks] = useState(BANK_DEFAULTS);

  const defaultNames = t("calculators.compare.banks",       { returnObjects: true });
  const letters      = t("calculators.compare.bankLetters", { returnObjects: true });

  const nameOf = (bank, i) => bank.name ?? defaultNames[i];

  const updateBank = useCallback((i, key, val) => {
    setBanks(prev => prev.map((b, idx) => idx === i ? { ...b, [key]: val } : b));
  }, []);

  const results = useMemo(() => {
    const n = years * 12;
    return banks
      .map((b, i) => ({ ...b, label: nameOf(b, i) }))
      .filter(b => b.rate > 0)
      .map(b => {
        const r   = b.rate / 100 / 12;
        const m   = pmt(r, n, loan);
        const tot = m * n;
        const int = tot - loan;
        return { ...b, m, tot, int };
      })
      .sort((a, b) => a.rate - b.rate);
  }, [banks, loan, years, defaultNames]);

  const best = results[0];

  return (
    <FullCard icon={<Icon size={22} strokeWidth={2} aria-hidden="true" />} title={t("calculators.compare.title")}
      subtitle={t("calculators.compare.subtitle")}>
      <div className="amort-controls" style={{marginBottom:"1.5rem"}}>
        <Field label={t("calculators.common.loanAmount")}>
          <MoneyInput value={loan} onChange={setLoan} />
        </Field>
        <Field label={t("calculators.common.term")}>
          <select value={years} onChange={e => setYears(+e.target.value)}>
            {[20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>

      <div className="mitzur-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))"}}>
        {banks.map((b, i) => (
          <div key={i} className="mitzur-input-card">
            <h4>{t("calculators.compare.bankCard", { letter: letters[i] })}</h4>
            <Field label={t("calculators.compare.bankName")}>
              <input type="text" value={nameOf(b, i)}
                onChange={e => updateBank(i, "name", e.target.value)} />
            </Field>
            <Field label={t("calculators.compare.rate")}>
              <input type="number" value={b.rate} step={0.01} min={0} max={MAX_RATE}
                onChange={e => updateBank(i, "rate", clampRate(e.target.value))} />
            </Field>
          </div>
        ))}
      </div>

      <div className="amort-wrap" style={{maxHeight:"none",marginBottom:"1rem"}}>
        <table className="compare-table">
          <thead>
            <tr>
              <th>{t("calculators.compare.colBank")}</th>
              <th>{t("calculators.compare.rate")}</th>
              <th>{t("calculators.common.monthlyPayment")}</th>
              <th>{t("calculators.common.totalPaid")}</th>
              <th>{t("calculators.common.totalInterest")}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const isBest  = i === 0;
              const saveTot = best ? r.tot - best.tot : 0;
              return (
                <tr key={i} className={isBest ? "highlight-row" : ""}>
                  <td>
                    {r.label}{" "}
                    {isBest
                      ? <span className="badge-save">{t("calculators.compare.best")}</span>
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
        <strong>{t("calculators.compare.tipLabel")}</strong> {t("calculators.compare.tip")}
      </TipBox>
    </FullCard>
  );
}
