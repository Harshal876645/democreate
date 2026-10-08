import type { SensorSnapshot, AlertLevel } from "./types";

/**
 * Demo data generator. Produces realistic, slowly-drifting sensor values
 * that occasionally spike into warning/critical ranges so the dashboard
 * looks alive during a hackathon demo.
 *
 * When real hardware is connected, replace calls to this module with data
 * received from the Python FastAPI backend (Arduino → USB Serial → PySerial → API).
 */

const BASE_VALUES: SensorSnapshot = {
  temperature: 26,
  humidity: 55,
  smoke: 120,
  water: 35,
  timestamp: Date.now(),
};

let state = { ...BASE_VALUES };

function drift(current: number, min: number, max: number, intensity: number): number {
  const range = max - min;
  const delta = (Math.random() - 0.5) * range * intensity;
  let next = current + delta;
  if (next < min) next = min + Math.random() * range * 0.05;
  if (next > max) next = max - Math.random() * range * 0.05;
  return next;
}

function maybeSpike(): boolean {
  return Math.random() < 0.08;
}

export function generateNextReading(): SensorSnapshot {
  const timestamp = Date.now();

  // Normal drift
  state.temperature = drift(state.temperature, 15, 55, 0.04);
  state.humidity = drift(state.humidity, 20, 95, 0.05);
  state.smoke = drift(state.smoke, 0, 1000, 0.03);
  state.water = drift(state.water, 0, 100, 0.04);

  // Occasional spikes for demo realism
  if (maybeSpike()) {
    const which = Math.floor(Math.random() * 4);
    if (which === 0) state.temperature = 38 + Math.random() * 8;
    if (which === 1) state.humidity = 80 + Math.random() * 15;
    if (which === 2) state.smoke = 500 + Math.random() * 400;
    if (which === 3) state.water = 75 + Math.random() * 20;
  }

  return { ...state, timestamp };
}

export function getInitialSnapshot(): SensorSnapshot {
  return { ...BASE_VALUES, timestamp: Date.now() };
}

/**
 * Evaluate a sensor value against its safe/warning/critical thresholds.
 * Returns the alert level and whether the value is in a dangerous range.
 */
export function evaluateValue(
  value: number,
  safeMax: number,
  warningMax: number,
  safeMin: number,
  warningMin: number,
  isUpperBound: boolean
): AlertLevel {
  if (isUpperBound) {
    if (value > warningMax) return "critical";
    if (value > safeMax) return "warning";
    return "safe";
  }
  // For sensors where low values are dangerous (none currently, but kept for extensibility)
  if (value < warningMin) return "critical";
  if (value < safeMin) return "warning";
  return "safe";
}
