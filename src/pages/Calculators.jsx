import { useState, useCallback, useMemo } from "react";

/* ─── Utils ─────────────────────────────────────────────── */
const fmt  = n => "₪" + Math.round(n).toLocaleString("he-IL");
const pmt  = (r, n, pv) => r === 0 ? pv / n : pv * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
const navTo = (page, anchor) => window.dispatchEvent(
  new CustomEvent("app:navigate", { detail: { page, anchor } })
);

/* ─── Shared sub-components ─────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

function RangeField({ label, id, min, max, step = 1, value, onChange, display }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="range-wrap">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))} />
        <div className="range-val">{display}</div>
      </div>
    </div>
  );
}

function Metric({ label, value, color, sub, full }) {
  return (
    <div className={`metric ${full ? "metric-full" : ""}`}>
      <div className="metric-lbl">{label}</div>
      <div className={`metric-val ${color || ""}`}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

function ResultHero({ label, value, sub, id, style }) {
  return (
    <div className="result-hero" id={id} style={style}>
      <div className="rh-lbl">{label}</div>
      <div className="rh-val">{value}</div>
      {sub && <div className="rh-sub">{sub}</div>}
    </div>
  );
}

function TipBox({ children }) {
  return <div className="tip-box">{children}</div>;
}

function CalcCard({ icon, title, subtitle, inputs, outputs }) {
  return (
    <div className="calc-card">
      <div className="calc-card-header">
        <div className="calc-card-icon">{icon}</div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">{inputs}</div>
        <div className="calc-outputs">{outputs}</div>
      </div>
    </div>
  );
}

function FullCard({ icon, title, subtitle, children }) {
  return (
    <div className="full-card">
      <div className="full-card-header">
        <div className="calc-card-icon">{icon}</div>
        <div>
          <h2 style={{fontSize:20,fontWeight:700,color:"#fff",marginBottom:3}}>{title}</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)"}}>{subtitle}</p>
        </div>
      </div>
      <div className="full-card-body">{children}</div>
    </div>
  );
}

/* ─── 1. Monthly Payment ─────────────────────────────────── */
function MonthlyCalc() {
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
          onClick={() => navTo("home","contact")}>
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

/* ─── 2. Refinance ──────────────────────────────────────── */
function RefiCalc() {
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
          onClick={() => navTo("home","contact")}>
          רוצה שנמחזר עבורך? ›
        </button>
      </>}
    />
  );
}

/* ─── 3. Affordability ───────────────────────────────────── */
function AffordCalc() {
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

/* ─── 4. Amortization Table ──────────────────────────────── */
function AmortCalc() {
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
    <FullCard icon="📊" title="לוח סילוקין"
      subtitle="פירוט תשלומי קרן וריבית לכל חודש לאורך חיי המשכנתא">
      <div className="amort-controls">
        <Field label="סכום משכנתא ₪">
          <input type="number" value={loan} onChange={e => setLoan(+e.target.value)} />
        </Field>
        <Field label="ריבית שנתית %">
          <input type="number" value={rate} step={0.1} onChange={e => setRate(+e.target.value)} />
        </Field>
        <Field label="תקופה (שנים)">
          <select value={years} onChange={e => setYears(+e.target.value)}>
            {[10,15,20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="תדירות הצגה">
          <select value={freq} onChange={e => setFreq(+e.target.value)}>
            <option value={1}>חודשי</option>
            <option value={12}>שנתי</option>
          </select>
        </Field>
      </div>
      <div className="output-grid" style={{marginBottom:"1.5rem"}}>
        <Metric label="תשלום חודשי"  value={fmt(summary.m)}        color="gold" />
        <Metric label="סה״כ החזר"    value={fmt(summary.totalPay)} />
        <Metric label="סה״כ ריבית"   value={fmt(summary.totalInt)} color="red" />
        <Metric label="אחוז ריבית"
          value={`${Math.round(summary.totalInt / summary.totalPay * 100)}%`} />
      </div>
      <div className="amort-wrap">
        <table className="amort-table">
          <thead>
            <tr>
              <th>{freq === 1 ? "חודש" : "שנה"}</th>
              <th>תשלום</th><th>קרן</th><th>ריבית</th><th>יתרה</th>
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

/* ─── 5. Track Mix ───────────────────────────────────────── */
const TRACK_DEFAULTS = [
  { name: "🔵 קבועה צמודה",        amt: 480000, rate: 4.2, years: 25, color: "#185FA5" },
  { name: "🟡 פריים",               amt: 480000, rate: 3.8, years: 25, color: "#c9a84c" },
  { name: "🟠 משתנה כל 5 שנים",    amt: 240000, rate: 4.6, years: 25, color: "#d35400" },
];

function MixCalc() {
  const [total,  setTotal]  = useState(1200000);
  const [tracks, setTracks] = useState(TRACK_DEFAULTS);

  const update = useCallback((i, key, val) => {
    setTracks(prev => prev.map((t, idx) => idx === i ? { ...t, [key]: val } : t));
  }, []);

  const results = useMemo(() => {
    const sumAmts = tracks.reduce((s, t) => s + t.amt, 0);
    const warning = Math.abs(sumAmts - total) > 1000;
    let sumMonthly = 0, sumTotal = 0;
    const rows = tracks.map((t, i) => {
      if (!t.amt) return null;
      const r   = t.rate / 100 / 12;
      const n   = t.years * 12;
      const m   = pmt(r, n, t.amt);
      const tot = m * n;
      const int = tot - t.amt;
      const pct = total > 0 ? Math.round(t.amt / total * 100) : 0;
      sumMonthly += m; sumTotal += tot;
      return { ...t, m, int, pct };
    }).filter(Boolean);
    return { rows, sumMonthly, sumTotal, warning, sumAmts };
  }, [tracks, total]);

  return (
    <FullCard icon="🧮" title="בניית תמהיל מסלולים"
      subtitle="חשב שילוב של עד 3 מסלולים ובדוק את ההחזר הכולל">
      <Field label="סך המשכנתא ₪">
        <div style={{maxWidth:300}}>
          <input type="number" value={total} onChange={e => setTotal(+e.target.value)} />
        </div>
      </Field>
      <div className="mitzur-grid">
        {tracks.map((t, i) => (
          <div key={i} className="mitzur-input-card">
            <h4>{t.name}</h4>
            <Field label="סכום ₪">
              <input type="number" value={t.amt}
                onChange={e => update(i, "amt", +e.target.value)} />
            </Field>
            <Field label={i===1 ? "ריבית % (פריים ±)" : "ריבית %"}>
              <input type="number" value={t.rate} step={0.1}
                onChange={e => update(i, "rate", +e.target.value)} />
            </Field>
            <Field label="שנים">
              <select value={t.years} onChange={e => update(i, "years", +e.target.value)}>
                {[20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
          </div>
        ))}
      </div>

      {results.warning && (
        <div style={{color:"var(--red)",fontSize:13,marginBottom:"1rem"}}>
          ⚠️ סך המסלולים ({fmt(results.sumAmts)}) שונה מסך המשכנתא ({fmt(total)})
        </div>
      )}

      <div className="result-hero" style={{marginBottom:"1rem"}}>
        <div className="rh-lbl">סה״כ תשלום חודשי משולב</div>
        <div className="rh-val">{fmt(results.sumMonthly)}</div>
        <div className="rh-sub">סה״כ החזר על כל המסלולים: {fmt(results.sumTotal)}</div>
      </div>

      <div className="amort-wrap" style={{maxHeight:200}}>
        <table className="amort-table">
          <thead>
            <tr><th>מסלול</th><th>סכום</th><th>ריבית</th><th>תקופה</th><th>תשלום חודשי</th><th>סה״כ ריבית</th></tr>
          </thead>
          <tbody>
            {results.rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:r.color,marginLeft:6}} />
                  {r.name}
                </td>
                <td>{fmt(r.amt)} ({r.pct}%)</td>
                <td>{r.rate.toFixed(2)}%</td>
                <td>{r.years} שנ׳</td>
                <td>{fmt(r.m)}</td>
                <td>{fmt(r.int)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TipBox>
        <strong>המלצת מומחה:</strong> תמהיל מאוזן בין מסלולים מקטין סיכון — שילוב של קבועה צמודה עם פריים הוא הפופולרי ביותר בישראל.
      </TipBox>
    </FullCard>
  );
}

/* ─── 6. Bank Compare ─────────────────────────────────────── */
const BANK_DEFAULTS = [
  { name: "בנק הפועלים", rate: 4.15 },
  { name: "בנק לאומי",   rate: 4.22 },
  { name: "בנק מזרחי",   rate: 4.19 },
  { name: "בנק דיסקונט", rate: 4.31 },
];

function CompareCalc() {
  const [loan,  setLoan]  = useState(1000000);
  const [years, setYears] = useState(25);
  const [banks, setBanks] = useState(BANK_DEFAULTS);

  const updateBank = useCallback((i, key, val) => {
    setBanks(prev => prev.map((b, idx) => idx === i ? { ...b, [key]: val } : b));
  }, []);

  const results = useMemo(() => {
    const n = years * 12;
    return banks
      .filter(b => b.rate > 0)
      .map(b => {
        const r   = b.rate / 100 / 12;
        const m   = pmt(r, n, loan);
        const tot = m * n;
        const int = tot - loan;
        return { ...b, m, tot, int };
      })
      .sort((a, b) => a.rate - b.rate);
  }, [banks, loan, years]);

  const best = results[0];

  return (
    <FullCard icon="⚖️" title="השוואת הצעות בנקים"
      subtitle="הזן עד 4 הצעות ובדוק מי נותן את התנאים הטובים ביותר">
      <div className="amort-controls" style={{marginBottom:"1.5rem"}}>
        <Field label="סכום משכנתא ₪">
          <input type="number" value={loan} onChange={e => setLoan(+e.target.value)} />
        </Field>
        <Field label="תקופה (שנים)">
          <select value={years} onChange={e => setYears(+e.target.value)}>
            {[20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>

      <div className="mitzur-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))"}}>
        {banks.map((b, i) => (
          <div key={i} className="mitzur-input-card">
            <h4>🏦 בנק {["א","ב","ג","ד"][i]}</h4>
            <Field label="שם הבנק">
              <input type="text" value={b.name}
                onChange={e => updateBank(i, "name", e.target.value)} />
            </Field>
            <Field label="ריבית %">
              <input type="number" value={b.rate} step={0.01}
                onChange={e => updateBank(i, "rate", +e.target.value)} />
            </Field>
          </div>
        ))}
      </div>

      <div className="amort-wrap" style={{maxHeight:"none",marginBottom:"1rem"}}>
        <table className="compare-table">
          <thead>
            <tr><th>בנק</th><th>ריבית</th><th>תשלום חודשי</th><th>סה״כ החזר</th><th>סה״כ ריבית</th></tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const isBest  = i === 0;
              const saveTot = best ? r.tot - best.tot : 0;
              return (
                <tr key={i} className={isBest ? "highlight-row" : ""}>
                  <td>
                    {r.name}{" "}
                    {isBest
                      ? <span className="badge-save">הטוב ביותר</span>
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
        <strong>טיפ מקצועי:</strong> הפרש של 0.25% בריבית על משכנתא של מיליון ₪ ל-25 שנה שווה כ-₪37,000 לאורך חיי ההלוואה. שווה להתמקח!
      </TipBox>
    </FullCard>
  );
}

/* ─── Tabs config ─────────────────────────────────────────── */
const TABS = [
  { id: "monthly", icon: "🏠", label: "תשלום חודשי",    Component: MonthlyCalc },
  { id: "refi",    icon: "🔄", label: "כדאיות מיחזור",  Component: RefiCalc    },
  { id: "afford",  icon: "💰", label: "כושר השתכרות",   Component: AffordCalc  },
  { id: "amort",   icon: "📊", label: "לוח סילוקין",    Component: AmortCalc   },
  { id: "mitzur",  icon: "🧮", label: "תמהיל מסלולים",  Component: MixCalc     },
  { id: "compare", icon: "⚖️", label: "השוואת בנקים",   Component: CompareCalc },
];

/* ─── Root Calculators Page ────────────────────────────────── */
export default function Calculators() {
  const [activeTab, setActiveTab] = useState("monthly");
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component;

  return (
    <div dir="rtl" lang="he">
      {/* NAV */}
      <nav>
        <a href="#" onClick={(e) => { e.preventDefault(); navTo("home"); }} className="logo">
          <span className="logo-dot">●</span> משכנתא<span>PRO</span>
        </a>
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navTo("home"); }}>ראשי</a>
          <a href="#" className="active">מחשבונים</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navTo("home", "services"); }}>שירותים</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navTo("home", "contact"); }}>צור קשר</a>
        </div>
        <button className="nav-cta" onClick={() => navTo("home", "contact")}>
          ייעוץ חינם
        </button>
      </nav>

      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-tag">כלים מקצועיים חינמיים</div>
        <h1>מחשבונים <em>חכמים</em> למשכנתא</h1>
        <p>כלים מדויקים שיעזרו לך לקבל החלטות פיננסיות נכונות — לפני שפונים לבנק.</p>
      </div>

      {/* TABS */}
      <div className="tool-tabs-wrap">
        <div className="tool-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tool-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main className="main">
        <div className="calc-section active">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">משכנתא<span>PRO</span></div>
        <p>המחשבונים מיועדים לאומדן ראשוני בלבד ואינם מהווים ייעוץ פיננסי מחייב<br />
           © 2025 משכנתאPRO.co.il | כל הזכויות שמורות</p>
      </footer>
    </div>
  );
}
