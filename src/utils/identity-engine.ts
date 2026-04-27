/**
 * IDENTITY ENGINE v1.0
 * Maps job roles to industries and industries to focus areas.
 */

export const ROLE_TO_INDUSTRY: Record<string, string[]> = {
  "video editor": ["Creative"],
  "graphic designer": ["Creative"],
  "designer": ["Creative", "Marketing"],
  "developer": ["Tech"],
  "engineer": ["Tech"],
  "founder": ["Business", "Tech"],
  "ceo": ["Business"],
  "marketer": ["Marketing"],
  "growth": ["Marketing", "Business"],
  "sales": ["Sales", "Marketing"],
  "lawyer": ["Legal"],
  "accountant": ["Finance"],
  "student": ["General"]
};

export const ALL_INDUSTRIES = ["Creative", "Tech", "Business", "Marketing", "Sales", "Legal", "Finance", "General"];

export const INDUSTRY_TO_FOCUS: Record<string, string[]> = {
  "Creative": ["Content", "Branding", "Networking"],
  "Tech": ["Tech", "Hiring", "Funding"],
  "Business": ["Strategy", "Funding", "Hiring"],
  "Marketing": ["Growth", "Sales", "Branding"],
  "Legal": ["Advice", "Strategy", "Compliance"],
  "Finance": ["Funding", "Strategy", "Advice"],
  "General": ["Networking", "Advice", "Meetups"]
};

export interface DetectionResult {
  industries: string[];
  confidence: number;
}

export const detectIndustry = (roleText: string): DetectionResult => {
  const normalized = roleText.toLowerCase().trim();
  if (normalized.length < 3) return { industries: [], confidence: 0 };

  const matches: string[] = [];
  let maxMatchLength = 0;

  for (const [role, industries] of Object.entries(ROLE_TO_INDUSTRY)) {
    if (normalized.includes(role)) {
      matches.push(...industries);
      maxMatchLength = Math.max(maxMatchLength, role.length);
    }
  }

  const uniqueIndustries = Array.from(new Set(matches));
  // Confidence score based on match length vs input length
  const confidence = Math.min((maxMatchLength / normalized.length) + 0.2, 1.0);

  return { 
    industries: uniqueIndustries, 
    confidence: uniqueIndustries.length > 0 ? confidence : 0 
  };
};
