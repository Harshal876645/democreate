import { Thermometer, Droplet, Flame, Waves, type LucideIcon } from "lucide-react";
import type { SensorType, AlertLevel } from "@/lib/types";

export const ICONS: Record<string, LucideIcon> = {
  Thermometer,
  Droplet,
  Flame,
  Waves,
};

const LEVEL_STYLES: Record<AlertLevel, { ring: string; glow: string; badge: string; label: string }> = {
  safe: {
    ring: "border-emerald-500/20",
    glow: "shadow-[0_0_20px_-8px_rgba(16,185,129,0.3)]",
    badge: "bg-emerald-500/10 text-emerald-400",
    label: "SAFE",
  },
  warning: {
    ring: "border-amber-500/30",
    glow: "shadow-[0_0_20px_-8px_rgba(245,158,11,0.4)]",
    badge: "bg-amber-500/10 text-amber-400",
    label: "WARNING",
  },
  critical: {
    ring: "border-red-500/40",
    glow: "shadow-[0_0_25px_-5px_rgba(239,68,68,0.5)]",
    badge: "bg-red-500/10 text-red-400",
    label: "CRITICAL",
  },
};

interface SensorCardProps {
  label: string;
  unit: string;
  iconName: string;
  value: number;
  decimals: number;
  safeMax: number;
  warningMax: number;
  alertLevel: AlertLevel;
  children?: React.ReactNode;
}

export function SensorCard({
  label,
  unit,
  iconName,
  value,
  decimals,
  alertLevel,
  children,
}: SensorCardProps) {
  const Icon = ICONS[iconName] ?? Thermometer;
  const style = LEVEL_STYLES[alertLevel];

  return (
    <div
      className={`rounded-2xl border ${style.ring} ${style.glow} bg-slate-900/60 backdrop-blur p-5 transition-all duration-300 hover:border-slate-600/40`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.badge}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">{label}</p>
            <span
              className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${style.badge}`}
            >
              {style.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-white tabular-nums">
          {value.toFixed(decimals)}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      {children}
    </div>
  );
}
