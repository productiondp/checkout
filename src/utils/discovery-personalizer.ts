/**
 * DISCOVERY PERSONALIZER (V1.26)
 * Lightweight preference tracking and adaptation logic.
 */

interface DiscoveryPreferences {
  preferredView: 'MAP' | 'LIST';
  dismissedCount: number;
  sessionsJoinedCount: number; // 🧠 V1.32 Progress Tracking
  filterWeights: Record<string, number>;
  focusAffinities: Record<string, number>;
  lastUpdate: string;
}

const STORAGE_KEY = 'checkout_discovery_prefs';
const DECAY_DAYS = 7;

export const DiscoveryPersonalizer = {
  getPrefs(): DiscoveryPreferences {
    if (typeof window === 'undefined') return this.getDefaults();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return this.getDefaults();

    try {
      const prefs: DiscoveryPreferences = JSON.parse(stored);
      // Migrate old prefs if needed
      if (!prefs.focusAffinities) prefs.focusAffinities = this.getDefaults().focusAffinities;
      return this.applyDecay(prefs);
    } catch (e) {
      return this.getDefaults();
    }
  },

  getDefaults(): DiscoveryPreferences {
    return {
      preferredView: 'MAP',
      dismissedCount: 0,
      sessionsJoinedCount: 0,
      filterWeights: { 'Nearby': 1, 'Online': 0, 'Today': 0, 'High Trust': 0 },
      focusAffinities: { 'ALL': 1, 'MEETUP': 0, 'REQUIREMENT': 0, 'COLLAB': 0, 'ADVISOR': 0 },
      lastUpdate: new Date().toISOString(),
    };
  },

  applyDecay(prefs: DiscoveryPreferences): DiscoveryPreferences {
    const lastUpdate = new Date(prefs.lastUpdate);
    const now = new Date();
    const daysSince = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSince > DECAY_DAYS) {
      Object.keys(prefs.filterWeights).forEach(k => prefs.filterWeights[k] *= 0.5);
      Object.keys(prefs.focusAffinities).forEach(k => prefs.focusAffinities[k] *= 0.5);
      prefs.dismissedCount = Math.max(0, prefs.dismissedCount - 1);
      prefs.lastUpdate = now.toISOString();
    }
    return prefs;
  },

  trackJoin() {
    const prefs = this.getPrefs();
    prefs.sessionsJoinedCount += 1;
    prefs.lastUpdate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  },

  trackFocusUsage(type: string, weight = 1) {
    const prefs = this.getPrefs();
    prefs.focusAffinities[type] = (prefs.focusAffinities[type] || 0) + weight;
    prefs.lastUpdate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  },

  getSuggestedFocus(): string | null {
    const prefs = this.getPrefs();
    // Only suggest if one type has a clear lead (> 3 points)
    const candidates = Object.entries(prefs.focusAffinities)
      .filter(([type]) => type !== 'ALL')
      .sort((a, b) => b[1] - a[1]);

    if (candidates.length > 0 && candidates[0][1] > 3) {
      return candidates[0][0];
    }
    return null;
  },

  trackViewSwitch(view: 'MAP' | 'LIST') {
    const prefs = this.getPrefs();
    prefs.preferredView = view;
    prefs.lastUpdate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  },

  trackFilterClick(filter: string) {
    const prefs = this.getPrefs();
    prefs.filterWeights[filter] = (prefs.filterWeights[filter] || 0) + 1;
    prefs.lastUpdate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  },

  trackDismissal() {
    const prefs = this.getPrefs();
    prefs.dismissedCount += 1;
    prefs.lastUpdate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  },

  getRecommendedFilter(currentItems: string[]): string {
    const prefs = this.getPrefs();
    
    // 20-30% Discovery Randomness
    if (Math.random() < 0.3) return currentItems[Math.floor(Math.random() * currentItems.length)];

    // Weighted selection
    return currentItems.sort((a, b) => 
      (prefs.filterWeights[b] || 0) - (prefs.filterWeights[a] || 0)
    )[0];
  }
};
