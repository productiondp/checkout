/**
 * 🚩 FEATURE FLAGS & GRADUAL ROLLOUT SYSTEM (V2.0)
 * 
 * Purpose: Instant control over production features and safe, gradual rollouts.
 * Features:
 * 1. Percentage-based exposure.
 * 2. Sticky user assignment (via localStorage).
 * 3. Automatic blast-radius reduction.
 */

export interface FlagConfig {
  enabled: boolean;
  rollout: number; // 0.0 to 1.0 (percentage of users)
}

export interface AppFlags {
  realtime: FlagConfig;
  optimisticUpdates: FlagConfig;
  newDataLayer: FlagConfig;
  maintenanceMode: boolean;
  version: string;
}

const DEFAULT_FLAGS: AppFlags = {
  realtime: { enabled: true, rollout: 1.0 },
  optimisticUpdates: { enabled: true, rollout: 1.0 },
  newDataLayer: { enabled: true, rollout: 0.1 }, // 10% Canary rollout
  maintenanceMode: false,
  version: "2.1.0-canary"
};

let currentFlags: AppFlags = { ...DEFAULT_FLAGS };

/**
 * Simple hash for deterministic rollout groups
 */
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministically checks if a feature is enabled for a specific user
 */
export function isFeatureEnabled(name: keyof AppFlags, userId?: string): boolean {
  const flag = currentFlags[name];
  if (typeof flag === 'boolean') return flag;
  if (!flag || !flag.enabled) return false;
  if (flag.rollout >= 1.0) return true;

  // Sticky assignment via localStorage
  const storageKey = `rollout_group_${name}`;
  let group = 0;

  if (typeof window !== 'undefined') {
    const savedGroup = localStorage.getItem(storageKey);
    if (savedGroup !== null) {
      group = parseFloat(savedGroup);
    } else {
      group = userId ? (getHash(userId) % 100) / 100 : Math.random();
      localStorage.setItem(storageKey, group.toString());
    }
  }

  return group <= flag.rollout;
}

export function getFlags(): AppFlags {
  return currentFlags;
}

export function updateFlags(updates: Partial<AppFlags>) {
  currentFlags = { ...currentFlags, ...updates };
  console.log(`%c[FLAGS] Deployment v${currentFlags.version} Updated:`, "color: #4CAF50; font-weight: bold;", currentFlags);
}

/**
 * Instantly kills a rollout if issues are detected
 */
export function killRollout(name: keyof AppFlags) {
  const flag = currentFlags[name];
  if (flag && typeof flag !== 'boolean') {
    console.error(`%c[FLAGS] EMERGENCY KILL: Disabling rollout for ${name}`, "color: #F44336; font-weight: bold;");
    updateFlags({
      [name]: { ...flag, rollout: 0, enabled: false }
    } as any);
  }
}
