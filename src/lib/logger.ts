/**
 *  LIGHTWEIGHT TELEMETRY LOGGER (V1.0)
 * 
 * Purpose: Observability without overhead.
 * Principles: Privacy-safe, development-focused, performance-neutral.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'perf' | 'debug';

interface LogEvent {
  event: string;
  level: LogLevel;
  timestamp: number;
  data?: any;
}

const MAX_LOGS = 100;
const logHistory: LogEvent[] = [];

export const metrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  errors: 0,
  realtimeEvents: 0,
  offlineEvents: 0
};

/**
 * Global Telemetry Logger
 */
export function log(event: string, level: LogLevel = 'info', data?: any) {
  const logEvent: LogEvent = {
    event,
    level,
    timestamp: Date.now(),
    data
  };

  // Update internal metrics
  if (event === 'CACHE_HIT') metrics.cacheHits++;
  if (event === 'CACHE_MISS') metrics.cacheMisses++;
  if (event === 'REQUEST_START') metrics.networkRequests++;
  if (event === 'ERROR') metrics.errors++;
  if (event === 'REALTIME_UPDATE') metrics.realtimeEvents++;
  if (event === 'OFFLINE_MODE') metrics.offlineEvents++;

  // Store in history for debug panel
  logHistory.unshift(logEvent);
  if (logHistory.length > MAX_LOGS) logHistory.pop();

  // Development Console output
  if (process.env.NODE_ENV === 'development') {
    const colors = {
      info: '#2196F3', // Blue
      warn: '#FF9800', // Orange
      error: '#F44336', // Red
      perf: '#9C27B0', // Purple
      debug: '#9E9E9E'  // Grey
    };

    console.log(
      `%c[SYSTEM] ${event}`, 
      `color: ${colors[level]}; font-weight: bold;`, 
      data || ''
    );
  }

  // In production, you would batch these and send to a lightweight endpoint
}

export function getLogs() {
  return [...logHistory];
}

export function getMetrics() {
  return { ...metrics };
}
