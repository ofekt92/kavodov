import { useRef, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { useMediaQuery } from "../../../lib/use-media-query";

export function PaymentDonut({ centerLabel, centerValue, centerSub, segments, rows, formatValue }) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const chartRef = useRef(null);
  const [hover, setHover] = useState(null);
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const pointAt = event => {
    const box = chartRef.current?.getBoundingClientRect();
    if (!box) return { x: 0, y: 0 };
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };

  const hovered = hover === null ? null : segments[hover.index];
  const percent = value => (total > 0 ? Math.round((value / total) * 100) : 0);

  return (
    <div className="pay-donut">
      <div
        className="pay-donut-chart"
        ref={chartRef}
        aria-hidden="true"

        onMouseMove={event => setHover(prev => (prev ? { ...prev, ...pointAt(event) } : prev))}
        onMouseLeave={() => setHover(null)}
      >
        {total > 0 && (
          <PieChart
            data={segments.map(s => ({ title: s.label, value: s.value, color: s.color }))}
            lineWidth={26}
            startAngle={-90}

            paddingAngle={1}
            animate={!reduceMotion}
            animationDuration={450}
            onMouseOver={(event, index) => setHover({ index, ...pointAt(event) })}
            onMouseOut={() => setHover(null)}
            segmentsStyle={index => ({
              cursor: "default",
              opacity: hover === null || hover.index === index ? 1 : 0.55,
              transition: reduceMotion ? undefined : "opacity 0.15s ease",
            })}
          />
        )}
        <div className="pay-donut-center">
          <div className="pay-donut-center-lbl">{centerLabel}</div>
          <div className="pay-donut-center-val">{centerValue}</div>
        </div>
        {hovered && (
          <div className="pay-donut-tip" style={{ left: hover.x, top: hover.y }} role="presentation">
            <span className="pay-donut-dot" style={{ background: hovered.color }} />
            <span className="pay-donut-tip-lbl">{hovered.label}</span>
            <span className="pay-donut-tip-val">

              {hovered.tip ?? (formatValue ? formatValue(hovered.value) : hovered.value)}
              {" · "}{percent(hovered.value)}%
            </span>
          </div>
        )}
      </div>

      {centerSub && <p className="pay-donut-sub">{centerSub}</p>}

      <dl className="pay-donut-rows">
        {rows.map(row => (
          <div className="pay-donut-row" key={row.key}>
            <dt>
              {row.color && (
                <span className="pay-donut-dot" style={{ background: row.color }} />
              )}
              <span>
                {row.label}
                {row.sub && <span className="pay-donut-row-sub">{row.sub}</span>}
              </span>
            </dt>
            <dd className={row.tone || ""}>
              {row.value}
              {row.share != null && <span className="pay-donut-share"> ({row.share}%)</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
