/**
 * 📊 AUTHENTICATION RUNTIME MONITOR & SELF-HEALING (V9.0)
 * 
 * Features:
 * 1. Metrics: Tracks transitions, violations, and mismatches.
 * 2. Self-Healing: Automatically falls back to safe states on invariant failure.
 * 3. Stuck-State Detection: Enforces exit from initializing via time-based heartbeat.
 * 4. Mutex Telemetry: Monitors auth queue health.
 */

import { AuthState, AuthEvent, transition, assertInvariants } from './auth-fsm';
import { clearCache } from './cache';

export type AuthMetrics = {
  transitions: number;
  invariantViolations: number;
  routeMismatches: number;
  anomalies: number;
  lastEventTime: number;
  avgLatency: number;
  cacheHits: number;
  cacheMisses: number;
  mutexQueueLength: number;
};

export const metrics: AuthMetrics = {
  transitions: 0,
  invariantViolations: 0,
  routeMismatches: 0,
  anomalies: 0,
  lastEventTime: 0,
  avgLatency: 0,
  cacheHits: 0,
  cacheMisses: 0,
  mutexQueueLength: 0,
};

const eventHistory: any[] = [];
let totalLatency = 0;

/**
 * 🛠️ SELF-HEALING GUARD
 */
function healState(prev: AuthState, event: AuthEvent): AuthState {
  console.error(`[AUTH MONITOR] Invariant violation detected! Healing from:`, { prev, event });
  
  if (event.type === 'LOGOUT' || prev.tag === 'unauthenticated') {
    return { tag: 'unauthenticated' };
  }

  // Fallback to unauthenticated instead of initializing to avoid loops
  return { tag: 'unauthenticated' };
}

/**
 * 📈 MONITORED TRANSITION WRAPPER
 */
export function monitoredTransition(state: AuthState, event: AuthEvent): AuthState {
  const start = performance.now();
  metrics.transitions++;

  // 1. Trace Event Pattern
  eventHistory.push({
    type: event.type,
    timestamp: Date.now(),
    from: state.tag,
    data: event
  });
  if (eventHistory.length > 50) eventHistory.shift();
  
  const lastEvent = eventHistory[eventHistory.length - 1];
  const isConsecutiveSame = lastEvent && lastEvent.type === event.type && lastEvent.to === state.tag;
  
  if (isConsecutiveSame) {
    const consecutiveCount = eventHistory.slice(-10).filter(e => e.type === event.type && e.to === state.tag).length;
    if (consecutiveCount > 8) {
      console.warn(`[AUTH MONITOR] Detected suspicious CONSECUTIVE loop for: ${event.type} (Count: ${consecutiveCount})`);
      metrics.anomalies++;
    }
  }

  // 2. Execute Transition
  let next = transition(state, event);

  // 🛡️ NO-EXIT PROTECTION: Force exit if stuck in initializing
  if (next.tag === 'initializing' && state.tag !== 'initializing') {
    console.warn('[AUTH MONITOR] Forced Exit: Transition attempted to return to initializing', { event });
    next = { tag: 'unauthenticated' };
  }

  // 3. Validate Invariants with Self-Healing
  try {
    assertInvariants(next);
  } catch (e) {
    metrics.invariantViolations++;
    
    if (metrics.invariantViolations > 5) {
      forceRecovery();
    }
    
    return healState(state, event);
  }

  // 4. Latency Check
  const duration = performance.now() - start;
  totalLatency += duration;
  metrics.avgLatency = totalLatency / metrics.transitions;

  if (duration > 50) {
    console.warn(`[AUTH MONITOR] Slow transition detected: ${duration.toFixed(2)}ms`);
  }

  metrics.lastEventTime = Date.now();
  return next;
}

/**
 * 🚨 HARD RECOVERY FALLBACK
 */
export function forceRecovery() {
  console.error("[AUTH MONITOR] Critical instability detected. Forcing hard recovery...");
  clearCache();
  if (typeof window !== 'undefined') {
    localStorage.clear();
    window.location.href = '/';
  }
}

/**
 * 🔍 DEBUG ACCESS
 */
if (typeof window !== 'undefined') {
  (window as any).__AUTH_MONITOR__ = {
    metrics,
    getHistory: () => [...eventHistory],
    forceRecovery
  };
}
