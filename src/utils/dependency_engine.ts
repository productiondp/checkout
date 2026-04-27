import { UserProfile } from "@/types/core";

/**
 * 🧠 DEPENDENCY ENGINE (SHADOW BRAIN)
 * 
 * Maps a user's primary selection (Business Type or Role) into a set
 * of inferred contextual needs. This prevents UI overload while ensuring
 * high-fidelity matching and discovery in the background.
 * 
 * Rules:
 * 1. Cap inferred dependencies at 4 per category to prevent dilution.
 * 2. Return weighted values so explicit needs (1.0) can override inferred needs (0.4).
 */

type InferredNeed = {
  tag: string;
  weight: number;
};

// ── MASTER DEPENDENCY MAP ──
const BUSINESS_TYPE_DEPENDENCIES: Record<string, InferredNeed[]> = {
  // Retail & FMCG
  "FMCG": [
    { tag: "Branding", weight: 0.8 },
    { tag: "Logistics", weight: 0.7 },
    { tag: "Marketing", weight: 0.6 },
    { tag: "Finance", weight: 0.4 },
  ],
  "Restaurant/Cafe": [
    { tag: "Marketing", weight: 0.8 },
    { tag: "Photography", weight: 0.7 },
    { tag: "Interior Design", weight: 0.6 },
    { tag: "Supply Chain", weight: 0.5 },
  ],
  "Tech Startup": [
    { tag: "Software Development", weight: 0.9 },
    { tag: "UI/UX Design", weight: 0.8 },
    { tag: "Investment", weight: 0.7 },
    { tag: "Legal", weight: 0.5 },
  ],
  "Real Estate": [
    { tag: "Photography", weight: 0.8 },
    { tag: "Legal", weight: 0.7 },
    { tag: "Sales", weight: 0.6 },
    { tag: "Marketing", weight: 0.5 },
  ],
  "Manufacturing": [
    { tag: "Logistics", weight: 0.9 },
    { tag: "Supply Chain", weight: 0.8 },
    { tag: "Finance", weight: 0.6 },
    { tag: "Engineering", weight: 0.5 },
  ],
  // Fallback / Defaults
  "Default": [
    { tag: "Marketing", weight: 0.5 },
    { tag: "Finance", weight: 0.5 },
    { tag: "Legal", weight: 0.4 },
    { tag: "Operations", weight: 0.4 },
  ]
};

const PROFESSIONAL_ROLE_DEPENDENCIES: Record<string, InferredNeed[]> = {
  "Developer": [
    { tag: "UI/UX Design", weight: 0.7 },
    { tag: "Product Management", weight: 0.6 },
    { tag: "Marketing", weight: 0.5 },
  ],
  "Designer": [
    { tag: "Software Development", weight: 0.7 },
    { tag: "Copywriting", weight: 0.6 },
    { tag: "Marketing", weight: 0.5 },
  ],
  "Marketer": [
    { tag: "Design", weight: 0.8 },
    { tag: "Copywriting", weight: 0.7 },
    { tag: "Data Analytics", weight: 0.6 },
  ]
};

const ALIASES: Record<string, string> = {
  "Social Media Marketing": "Marketing",
  "Ads": "Performance Ads",
  "Photos": "Photography / Video",
  "Video": "Photography / Video",
  "Photography": "Photography / Video",
  "Website": "Website / App Development",
  "Software": "Software Development",
  "Design": "UI/UX Design"
};

export const ALL_NEEDS = [
  "Branding", "Logistics", "Marketing", "Finance", 
  "Photography / Video", "Interior Design", "Supply Chain", 
  "Software Development", "Website / App Development", "UI/UX Design", 
  "Investment", "Legal", "Sales", "Engineering", "Operations", 
  "Product Management", "Copywriting", "Data Analytics", 
  "Content Creation", "Hiring (HR)", "Collaboration", "Sales Support"
];

export const dependencyEngine = {
  /**
   * STEP 1: ALIAS NORMALIZATION
   * Converts varied inputs into canonical tags.
   */
  normalizeNeed(tag: string): string {
    const trimmed = tag.trim();
    // Use case-insensitive matching for aliases if needed, but exact match is fine here
    for (const [alias, canonical] of Object.entries(ALIASES)) {
       if (trimmed.toLowerCase() === alias.toLowerCase()) return canonical;
    }
    return trimmed;
  },

  inferNeeds(role: string, primaryType: string, isColdStart = false): InferredNeed[] {
    let inferred: InferredNeed[] = [];
    // Ensure we run this dynamically so we can pull the variant
    let isVariantB = false;
    try {
      const { suggestionTelemetry } = require('./suggestion_telemetry');
      isVariantB = suggestionTelemetry.getVariant() === 'B';
    } catch(e) {}

    const baseWeight = isVariantB ? 0.5 : 0.45; // Variant B tests a higher base weight

    if (role === "BUSINESS") {
      inferred = [...(BUSINESS_TYPE_DEPENDENCIES[primaryType] || BUSINESS_TYPE_DEPENDENCIES["Default"])];
      // STEP 4: ROLE-AWARE OVERRIDE
      inferred.push({ tag: "Marketing", weight: baseWeight });
      inferred.push({ tag: "Operations", weight: baseWeight });
      inferred.push({ tag: "Logistics", weight: baseWeight });
    } else if (role === "PROFESSIONAL" || role === "FREELANCER") {
      inferred = [...(PROFESSIONAL_ROLE_DEPENDENCIES[primaryType] || [])];
      // STEP 4: ROLE-AWARE OVERRIDE
      inferred.push({ tag: "Hiring (HR)", weight: baseWeight });
      inferred.push({ tag: "Collaboration", weight: baseWeight });
      inferred.push({ tag: "Sales Support", weight: baseWeight });
    }

    // STEP 5: COLD START BOOST
    if (isColdStart) {
       inferred = inferred.map(inf => ({ ...inf, weight: inf.weight * 1.10 }));
    }

    // STEP 7: CATEGORY CONSISTENCY CHECK
    // If a Restaurant receives Software Development, downrank it
    if (primaryType === "Restaurant/Cafe") {
       inferred = inferred.map(inf => 
         inf.tag === "Software Development" ? { ...inf, weight: inf.weight * 0.1 } : inf
       );
    }

    // Normalize and Dedup
    const dedupedMap = new Map<string, number>();
    for (const inf of inferred) {
       const norm = this.normalizeNeed(inf.tag);
       const currentWeight = dedupedMap.get(norm) || 0;
       dedupedMap.set(norm, Math.max(currentWeight, inf.weight));
    }

    const uniqueInferred = Array.from(dedupedMap.entries()).map(([tag, weight]) => ({ tag, weight }));

    // Sort by weight and cap at 4 to prevent dilution
    return uniqueInferred.sort((a, b) => b.weight - a.weight).slice(0, 4);
  },

  /**
   * Generates the initial 6 default contextual suggestions for post creation.
   */
  getSuggestedPostTags(profile: UserProfile, isColdStart = false): string[] {
    // 1. Normalize explicit intents
    const explicit = (profile.intents || []).map(t => this.normalizeNeed(t));
    
    // 2. Fetch normalized inferred tags
    const inferred = this.inferNeeds(profile.role, profile.industry || "", isColdStart)
      .map(n => n.tag)
      .filter(tag => !explicit.includes(tag));

    // 3. STEP 2: DEDUP + PRIORITY MERGE
    let combined = Array.from(new Set([...explicit, ...inferred]));

    // 4. STEP 3: SUGGESTION QUALITY GUARD
    // If we rely heavily on inferred because explicit is weak/empty, inject robust fallbacks
    if (explicit.length === 0 || combined.length < 3) {
       const fallbacks = [this.normalizeNeed("Marketing"), this.normalizeNeed("Content Creation")];
       fallbacks.forEach(f => {
          if (!combined.includes(f)) combined.push(f);
       });
    }

    // 5. STEP 6: MISSED-INTENT CORRECTION
    if (typeof window !== 'undefined') {
       const missedIntents = JSON.parse(localStorage.getItem('checkout_missed_intents') || '[]');
       if (missedIntents.length > 0) {
          // Boost the most frequently selected manual intents to the front
          const boosted = missedIntents.map((i: string) => this.normalizeNeed(i));
          const uniqueBoosted = Array.from(new Set(boosted)).filter(b => typeof b === 'string');
          
          // Remove boosted from combined so they can be prepended
          combined = combined.filter(c => !uniqueBoosted.includes(c));
          combined = [...uniqueBoosted, ...combined];
       }
    }

    // Keep max 6 items
    return combined.slice(0, 6);
  }
};
