export type SensorType = "temperature" | "humidity" | "smoke" | "water";

export interface SensorReading {
  value: number;
  unit: string;
  type: SensorType;
  timestamp: number;
}

export interface SensorConfig {
  type: SensorType;
  label: string;
  unit: string;
  icon: string;
  min: number;
  max: number;
  safeMin: number;
  safeMax: number;
  warningMin: number;
  warningMax: number;
  decimals: number;
}

export type AlertLevel = "safe" | "warning" | "critical";
export type ConnectionStatus = "connected" | "disconnected";

export interface SensorSnapshot {
  temperature: number;
  humidity: number;
  smoke: number;
  water: number;
  timestamp: number;
}

export interface Alert {
  id: string;
  sensor: SensorType;
  label: string;
  message: string;
  level: AlertLevel;
  timestamp: number;
}
