import { Bell, X, Trash2 } from "lucide-react";
import type { Alert } from "@/lib/types";

const LEVEL_STYLES: Record<string, { dot: string; text: string; border: string }> = {
  warning: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    border: "border-amber-500/20",
  },
  critical: {
    dot: "bg-red-400",
    text: "text-red-300",
    border: "border-red-500/20",
  },
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface AlertListProps {
  alerts: Alert[];
  onClear: () => void;
  onDismiss: (id: string) => void;
}

export function AlertList({ alerts, onClear, onDismiss }: AlertListProps) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-300">
            Active Alerts
            {alerts.length > 0 && (
              <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                {alerts.length}
              </span>
            )}
          </h3>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
            <Bell className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-sm text-gray-500">No active alerts</p>
        </div>
      ) : (
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {alerts.map((alert) => {
            const style = LEVEL_STYLES[alert.level];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-lg border ${style.border} bg-slate-800/40 p-3`}
              >
                <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${style.dot} ${alert.level === "critical" ? "animate-pulse" : ""}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold ${style.text}`}>
                      {alert.label}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{alert.message}</p>
                </div>
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
