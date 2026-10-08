import { useState, useEffect, useRef, useCallback } from "react";
import type { SensorSnapshot, SensorType, Alert, AlertLevel } from "@/lib/types";
import { SENSOR_CONFIGS, SENSOR_ORDER, MAX_HISTORY_POINTS } from "@/lib/config";
import { generateNextReading, getInitialSnapshot } from "@/lib/demoData";

const ALERT_MESSAGES: Record<SensorType, Record<AlertLevel, string>> = {
  temperature: {
    safe: "",
    warning: "Temperature above normal range — possible heat hazard",
    critical: "Critical temperature detected — fire risk!",
  },
  humidity: {
    safe: "",
    warning: "Humidity exceeding comfortable levels",
    critical: "Critical humidity — possible flood conditions",
  },
  smoke: {
    safe: "",
    warning: "Gas level elevated — monitor closely",
    critical: "Dangerous gas concentration — evacuate immediately!",
  },
  water: {
    safe: "",
    warning: "Water level rising above normal",
    critical: "Critical water level — flooding imminent!",
  },
};

export function useSensorData(demoMode: boolean, connected: boolean) {
  const [snapshot, setSnapshot] = useState<SensorSnapshot>(getInitialSnapshot());
  const [history, setHistory] = useState<SensorSnapshot[]>(() => {
    const init = getInitialSnapshot();
    return Array.from({ length: MAX_HISTORY_POINTS }, () => ({ ...init }));
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const lastAlertLevelRef = useRef<Record<SensorType, AlertLevel>>({
    temperature: "safe",
    humidity: "safe",
    smoke: "safe",
    water: "safe",
  });

  const evaluateSensor = useCallback(
    (type: SensorType, value: number): AlertLevel => {
      const cfg = SENSOR_CONFIGS[type];
      if (type === "humidity") {
        // High humidity is the danger direction
        if (value > cfg.warningMax) return "critical";
        if (value > cfg.safeMax) return "warning";
      } else {
        if (value > cfg.warningMax) return "critical";
        if (value > cfg.safeMax) return "warning";
      }
      return "safe";
    },
    []
  );

  const processReading = useCallback(
    (reading: SensorSnapshot) => {
      setSnapshot(reading);
      setHistory((prev) => [...prev.slice(-(MAX_HISTORY_POINTS - 1)), reading]);

      // Check for new alerts
      SENSOR_ORDER.forEach((type) => {
        const level = evaluateSensor(type, reading[type]);
        const prevLevel = lastAlertLevelRef.current[type];

        if (level !== prevLevel) {
          lastAlertLevelRef.current[type] = level;
          if (level !== "safe") {
            const newAlert: Alert = {
              id: `${type}-${reading.timestamp}`,
              sensor: type,
              label: SENSOR_CONFIGS[type].label,
              message: ALERT_MESSAGES[type][level],
              level,
              timestamp: reading.timestamp,
            };
            setAlerts((prevAlerts) => [newAlert, ...prevAlerts].slice(0, 20));
          }
        }
      });
    },
    [evaluateSensor]
  );

  useEffect(() => {
    if (!demoMode || !connected) return;
    const interval = setInterval(() => {
      processReading(generateNextReading());
    }, 2000);
    return () => clearInterval(interval);
  }, [demoMode, connected, processReading]);

  const overallStatus: AlertLevel = (() => {
    const levels = SENSOR_ORDER.map((t) => evaluateSensor(t, snapshot[t]));
    if (levels.includes("critical")) return "critical";
    if (levels.includes("warning")) return "warning";
    return "safe";
  })();

  const clearAlerts = useCallback(() => setAlerts([]), []);

  return {
    snapshot,
    history,
    alerts,
    overallStatus,
    clearAlerts,
  };
}
