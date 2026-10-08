import { useMemo } from "react";
import type { SensorSnapshot, SensorType } from "@/lib/types";
import { SENSOR_CONFIGS } from "@/lib/config";
import type { AlertLevel } from "@/lib/types";

interface MiniChartProps {
  history: SensorSnapshot[];
  sensorType: SensorType;
  alertLevel: AlertLevel;
}

const COLORS: Record<AlertLevel, string> = {
  safe: "#10b981",
  warning: "#f59e0b",
  critical: "#ef4444",
};

export function MiniChart({ history, sensorType, alertLevel }: MiniChartProps) {
  const cfg = SENSOR_CONFIGS[sensorType];
  const color = COLORS[alertLevel];

  const { pathD, areaD, lastX, lastY, values } = useMemo(() => {
    const vals = history.map((h) => h[sensorType]);
    const w = 100;
    const h = 40;
    const min = cfg.min;
    const max = cfg.max;
    const range = max - min || 1;
    const stepX = w / (vals.length - 1 || 1);

    const points = vals.map((v, i) => {
      const x = i * stepX;
      const clamped = Math.max(min, Math.min(max, v));
      const y = h - ((clamped - min) / range) * h;
      return { x, y };
    });

    const path = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");

    const area = `${path} L ${w} ${h} L 0 ${h} Z`;

    const last = points[points.length - 1] ?? { x: w, y: h / 2 };

    return {
      pathD: path,
      areaD: area,
      lastX: last.x,
      lastY: last.y,
      values: vals,
    };
  }, [history, sensorType, cfg.min, cfg.max]);

  return (
    <div className="relative h-10 w-full">
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id={`grad-${sensorType}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${sensorType})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={lastX}
          cy={lastY}
          r="2.5"
          fill={color}
          className="animate-pulse"
        />
      </svg>
      <div className="pointer-events-none absolute bottom-0 left-0 text-[9px] text-gray-600">
        {values[0]?.toFixed(cfg.decimals)}
      </div>
    </div>
  );
}
