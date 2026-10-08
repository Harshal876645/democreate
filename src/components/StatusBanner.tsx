import { ShieldCheck, AlertTriangle, Siren } from "lucide-react";
import type { AlertLevel } from "@/lib/types";

const STATUS_CONFIG: Record<
  AlertLevel,
  {
    icon: typeof ShieldCheck;
    label: string;
    bg: string;
    text: string;
    border: string;
    pulse: boolean;
  }
> = {
  safe: {
    icon: ShieldCheck,
    label: "ALL SYSTEMS SAFE",
    bg: "from-emerald-500/10 to-emerald-500/5",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    pulse: false,
  },
  warning: {
    icon: AlertTriangle,
    label: "WARNING — MONITOR SENSORS",
    bg: "from-amber-500/10 to-amber-500/5",
    text: "text-amber-400",
    border: "border-amber-500/30",
    pulse: false,
  },
  critical: {
    icon: Siren,
    label: "CRITICAL — IMMEDIATE ACTION REQUIRED",
    bg: "from-red-500/15 to-red-500/5",
    text: "text-red-400",
    border: "border-red-500/40",
    pulse: true,
  },
};

interface StatusBannerProps {
  level: AlertLevel;
}

export function StatusBanner({ level }: StatusBannerProps) {
  const cfg = STATUS_CONFIG[level];
  const Icon = cfg.icon;

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border ${cfg.border} bg-gradient-to-r ${cfg.bg} px-6 py-5 transition-all duration-500`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/50 ${cfg.text}`}>
        <Icon className={`h-6 w-6 ${cfg.pulse ? "animate-pulse" : ""}`} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500">System Status</p>
        <p className={`text-lg font-bold tracking-wide ${cfg.text}`}>{cfg.label}</p>
      </div>
    </div>
  );
}
