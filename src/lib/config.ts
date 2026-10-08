import type { SensorConfig, SensorType } from "./types";

export const SENSOR_CONFIGS: Record<SensorType, SensorConfig> = {
  temperature: {
    type: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: "Thermometer",
    min: 15,
    max: 55,
    safeMin: 18,
    safeMax: 35,
    warningMin: 35,
    warningMax: 42,
    decimals: 1,
  },
  humidity: {
    type: "humidity",
    label: "Humidity",
    unit: "%",
    icon: "Droplet",
    min: 0,
    max: 100,
    safeMin: 30,
    safeMax: 70,
    warningMin: 70,
    warningMax: 85,
    decimals: 0,
  },
  smoke: {
    type: "smoke",
    label: "Smoke / Gas",
    unit: "ppm",
    icon: "Flame",
    min: 0,
    max: 1000,
    safeMin: 0,
    safeMax: 300,
    warningMin: 300,
    warningMax: 600,
    decimals: 0,
  },
  water: {
    type: "water",
    label: "Water Level",
    unit: "%",
    icon: "Waves",
    min: 0,
    max: 100,
    safeMin: 0,
    safeMax: 60,
    warningMin: 60,
    warningMax: 80,
    decimals: 0,
  },
};

export const SENSOR_ORDER: SensorType[] = ["temperature", "humidity", "smoke", "water"];

export const MAX_HISTORY_POINTS = 30;
