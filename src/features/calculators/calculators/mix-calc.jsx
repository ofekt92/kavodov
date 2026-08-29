import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MAX_RATE, clampRate, fmt, pmt } from "../utils";
import { Field } from "../ui/field";
import { TipBox } from "../ui/tip-box";
import { FullCard } from "../ui/full-card";
import { MoneyInput } from "../../../components/money-input";
import { CALC_ICONS } from "../../../lib/calc-icons";

const Icon = CALC_ICONS.mix;

const TRACK_COLORS   = ["#185FA5", "#c9a84c", "#d35400"];
const TRACK_DEFAULTS = [
  { amt: 480000, rate: 4.2, years: 25 },
  { amt: 480000, rate: 3.8, years: 25 },
  { amt: 240000, rate: 4.6, years: 25 },
];

export function MixCalc() {
  const { t } = useTranslation();
  const [total,  setTotal]  = useState(1200000);
  const [tracks, setTracks] = useState(TRACK_DEFAULTS);

  const names = t("calculators.mix.tracks", { returnObjects: true });

  const update = useCallback((i, key, val) => {
    setTracks(prev => prev.map((track, idx) => idx === i ? { ...track, [key]: val } : track));
  }, []);

  const results = useMemo(() => {
    const sumAmts = tracks.reduce((s, track) => s + track.amt, 0);
    const warning = Math.abs(sumAmts - total) > 1000;
    let sumMonthly = 0, sumTotal = 0;
    const rows = tracks.map((track, i) => {
      if (!track.amt) return null;
      const r   = track.rate / 100 / 12;
      const n   = track.years * 12;
      const m   = pmt(r, n, track.amt);
      const tot = m * n;
      const int = tot - track.amt;
      const pct = total > 0 ? Math.round(track.amt / total * 100) : 0;
      sumMonthly += m; sumTotal += tot;
      return { ...track, index: i, m, int, pct };
    }).filter(Boolean);
    return { rows, sumMonthly, sumTotal, warning, sumAmts };
  }, [tracks, total]);

  return (
    <FullCard icon={<Icon size={22} strokeWidth={2} aria-hidden="true" />} title={t("calculators.mix.title")}
      subtitle={t("calculators.mix.subtitle")}>
      <Field label={t("calculators.mix.total")}>
        <div style={{maxWidth:300}}>
          <MoneyInput value={total} onChange={setTotal} />
        </div>
      </Field>
      <div className="mitzur-grid">
        {tracks.map((track, i) => (
          <div key={i} className="mitzur-input-card">
            <h4>{names[i]}</h4>
            <Field label={t("calculators.mix.amount")}>
              <MoneyInput value={track.amt}
                onChange={v => update(i, "amt", v)} />
            </Field>
            <Field label={i === 1 ? t("calculators.mix.ratePrime") : t("calculators.mix.rate")}>
              <input type="number" value={track.rate} step={0.1} min={0} max={MAX_RATE}
                onChange={e => update(i, "rate", clampRate(e.target.value))} />
            </Field>
            <Field label={t("calculators.mix.years")}>
              <select value={track.years} onChange={e => update(i, "years", +e.target.value)}>
                {[20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
          </div>
        ))}
      </div>

      {results.warning && (
        <div style={{color:"var(--red)",fontSize:13,marginBottom:"1rem"}}>
          {t("calculators.mix.warning", { tracks: fmt(results.sumAmts), total: fmt(total) })}
        </div>
      )}

      <div className="result-hero" style={{marginBottom:"1rem"}}>
        <div className="rh-lbl">{t("calculators.mix.combinedLabel")}</div>
        <div className="rh-val">{fmt(results.sumMonthly)}</div>
        <div className="rh-sub">{t("calculators.mix.combinedSub", { amount: fmt(results.sumTotal) })}</div>
      </div>

      <div className="amort-wrap" style={{maxHeight:200}}>
        <table className="amort-table">
          <thead>
            <tr>
              <th>{t("calculators.mix.colTrack")}</th>
              <th>{t("calculators.mix.colAmount")}</th>
              <th>{t("calculators.mix.colRate")}</th>
              <th>{t("calculators.mix.colTerm")}</th>
              <th>{t("calculators.common.monthlyPayment")}</th>
              <th>{t("calculators.common.totalInterest")}</th>
            </tr>
          </thead>
          <tbody>
            {results.rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:TRACK_COLORS[r.index],marginInlineEnd:6}} />
                  {names[r.index]}
                </td>
                <td>{fmt(r.amt)} ({r.pct}%)</td>
                <td>{r.rate.toFixed(2)}%</td>
                <td>{t("calculators.common.yearsShort", { years: r.years })}</td>
                <td>{fmt(r.m)}</td>
                <td>{fmt(r.int)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TipBox>
        <strong>{t("calculators.mix.tipLabel")}</strong> {t("calculators.mix.tip")}
      </TipBox>
    </FullCard>
  );
}
