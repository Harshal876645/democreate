import { useState, useCallback } from "react";
import { Radio, Cpu } from "lucide-react";
import { ConnectionBar } from "@/components/ConnectionBar";
import { StatusBanner } from "@/components/StatusBanner";
import { SensorCard } from "@/components/SensorCard";
import { AlertList } from "@/components/AlertList";
import { MiniChart } from "@/components/MiniChart";
import { useSensorData } from "@/hooks/useSensorData";
import { SENSOR_CONFIGS, SENSOR_ORDER } from "@/lib/config";
import type { ConnectionStatus, AlertLevel } from "@/lib/types";

function App() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected");
  const [demoMode, setDemoMode] = useState(true);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());

  const isConnected = connectionStatus === "connected";
  const { snapshot, history, alerts, overallStatus, clearAlerts } = useSensorData(
    demoMode,
    isConnected
  );

  const toggleConnection = useCallback(() => {
    setConnectionStatus((prev) => (prev === "connected" ? "disconnected" : "connected"));
  }, []);

  const toggleDemo = useCallback(() => {
    setDemoMode((prev) => !prev);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setDismissedAlertIds((prev) => new Set([...prev, id]));
  }, []);

  const handleClearAlerts = useCallback(() => {
    clearAlerts();
    setDismissedAlertIds(new Set());
  }, [clearAlerts]);

  const visibleAlerts = alerts.filter((a) => !dismissedAlertIds.has(a.id));

  const evaluateSensor = (type: (typeof SENSOR_ORDER)[number]): AlertLevel => {
    const cfg = SENSOR_CONFIGS[type];
    const value = snapshot[type];
    if (value > cfg.warningMax) return "critical";
    if (value > cfg.safeMax) return "warning";
    return "safe";
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/20">
              <Radio className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                DisasterSense
              </h1>
              <p className="text-xs text-gray-500">Arduino-Based Disaster Monitoring System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Cpu className="h-3.5 w-3.5" />
            <span>Arduino Uno R3</span>
            <span className="text-gray-700">|</span>
            <span>USB Serial</span>
          </div>
        </header>

        {/* Connection + Demo mode bar */}
        <div className="mb-6">
          <ConnectionBar
            status={connectionStatus}
            demoMode={demoMode}
            onToggleConnection={toggleConnection}
            onToggleDemo={toggleDemo}
          />
        </div>

        {/* Status banner */}
        <div className="mb-6">
          <StatusBanner level={overallStatus} />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sensor cards - 2x2 grid */}
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {SENSOR_ORDER.map((type) => {
                const cfg = SENSOR_CONFIGS[type];
                const level = evaluateSensor(type);
                return (
                  <SensorCard
                    key={type}
                    label={cfg.label}
                    unit={cfg.unit}
                    iconName={cfg.icon}
                    value={isConnected ? snapshot[type] : 0}
                    decimals={cfg.decimals}
                    safeMax={cfg.safeMax}
                    warningMax={cfg.warningMax}
                    alertLevel={isConnected ? level : "safe"}
                  >
                    <MiniChart history={history} sensorType={type} alertLevel={isConnected ? level : "safe"} />
                  </SensorCard>
                );
              })}
            </div>

            {/* Sensor thresholds reference */}
            <div className="mt-4 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Threshold Reference
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SENSOR_ORDER.map((type) => {
                  const cfg = SENSOR_CONFIGS[type];
                  return (
                    <div key={type} className="text-xs">
                      <p className="text-gray-400 font-medium mb-1">{cfg.label}</p>
                      <p className="text-emerald-400/70">Safe: ≤{cfg.safeMax}{cfg.unit}</p>
                      <p className="text-amber-400/70">Warn: {cfg.safeMax}–{cfg.warningMax}{cfg.unit}</p>
                      <p className="text-red-400/70">Crit: &gt;{cfg.warningMax}{cfg.unit}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Alerts sidebar */}
          <div className="lg:col-span-1">
            <AlertList
              alerts={visibleAlerts}
              onClear={handleClearAlerts}
              onDismiss={dismissAlert}
            />

            {/* Quick stats */}
            <div className="mt-4 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                System Info
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Board</span>
                  <span className="text-gray-300">Arduino Uno R3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interface</span>
                  <span className="text-gray-300">USB Serial (PySerial)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Backend</span>
                  <span className="text-gray-300">Python FastAPI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sensors</span>
                  <span className="text-gray-300">4 Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Poll Rate</span>
                  <span className="text-gray-300">2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-800/50 pt-4 text-center text-xs text-gray-600">
          <p>
            DisasterSense — Hackathon Demo &copy; {currentYear} &middot; Arduino Uno &middot;
            USB Serial &middot; PySerial + FastAPI
          </p>
          <p className="mt-1 text-gray-700">
            Data shown is simulated for demonstration purposes
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
