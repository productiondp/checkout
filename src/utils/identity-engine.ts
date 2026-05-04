/**
 * IDENTITY ENGINE v1.2 - MEGA EXPANSION
 * Maps job roles to industries and industries to focus areas.
 * Covering 150+ professional contexts.
 */

export const ROLE_TO_INDUSTRY: Record<string, string[]> = {
  // --- TECH & SOFTWARE ---
  "developer": ["Tech"],
  "software engineer": ["Tech"],
  "fullstack": ["Tech"],
  "frontend": ["Tech"],
  "backend": ["Tech"],
  "mobile developer": ["Tech"],
  "ios developer": ["Tech"],
  "android developer": ["Tech"],
  "devops": ["Tech"],
  "cloud engineer": ["Tech"],
  "data scientist": ["Tech", "Data"],
  "data analyst": ["Tech", "Data"],
  "ai engineer": ["Tech", "AI"],
  "machine learning": ["Tech", "AI"],
  "cybersecurity": ["Tech", "Security"],
  "qa engineer": ["Tech"],
  "blockchain developer": ["Tech", "Web3"],
  "web3 developer": ["Tech", "Web3"],
  "game developer": ["Tech", "Gaming"],
  
  // --- DESIGN & CREATIVE ---
  "designer": ["Creative"],
  "ui designer": ["Creative", "Tech"],
  "ux designer": ["Creative", "Tech"],
  "product designer": ["Creative", "Tech"],
  "graphic designer": ["Creative"],
  "motion designer": ["Creative"],
  "video editor": ["Creative"],
  "animator": ["Creative"],
  "illustrator": ["Creative"],
  "photographer": ["Creative"],
  "cinematographer": ["Creative"],
  "3d artist": ["Creative"],
  "interior designer": ["Creative", "Real Estate"],
  "fashion designer": ["Creative", "Fashion"],
  "architect": ["Creative", "Construction"],
  
  // --- BUSINESS & MANAGEMENT ---
  "founder": ["Business"],
  "ceo": ["Business"],
  "cto": ["Tech", "Business"],
  "cfo": ["Finance", "Business"],
  "coo": ["Business"],
  "cmo": ["Marketing", "Business"],
  "product manager": ["Tech", "Business"],
  "project manager": ["Business"],
  "entrepreneur": ["Business"],
  "consultant": ["Business", "Advisory"],
  "business analyst": ["Business"],
  "operations manager": ["Business"],
  "hr manager": ["Human Resources"],
  "recruiter": ["Human Resources"],
  
  // --- MARKETING & SALES ---
  "marketer": ["Marketing"],
  "digital marketer": ["Marketing"],
  "seo specialist": ["Marketing", "Tech"],
  "content strategist": ["Marketing", "Creative"],
  "copywriter": ["Marketing", "Creative"],
  "social media manager": ["Marketing"],
  "brand manager": ["Marketing"],
  "growth hacker": ["Marketing", "Business"],
  "sales executive": ["Sales"],
  "account manager": ["Sales", "Business"],
  "business development": ["Sales", "Business"],
  "pr specialist": ["Marketing", "Communication"],
  
  // --- FINANCE & LEGAL ---
  "accountant": ["Finance"],
  "financial advisor": ["Finance"],
  "investment banker": ["Finance"],
  "trader": ["Finance"],
  "auditor": ["Finance"],
  "tax consultant": ["Finance", "Legal"],
  "lawyer": ["Legal"],
  "attorney": ["Legal"],
  "legal consultant": ["Legal"],
  "paralegal": ["Legal"],
  "compliance officer": ["Legal", "Business"],
  
  // --- HEALTHCARE & SCIENCE ---
  "doctor": ["Healthcare"],
  "nurse": ["Healthcare"],
  "dentist": ["Healthcare"],
  "pharmacist": ["Healthcare"],
  "therapist": ["Healthcare", "Wellness"],
  "psychologist": ["Healthcare", "Wellness"],
  "scientist": ["Science"],
  "researcher": ["Science", "Education"],
  "biotech": ["Science", "Tech"],
  "medical lab tech": ["Healthcare"],
  
  // --- EDUCATION & NON-PROFIT ---
  "teacher": ["Education"],
  "professor": ["Education"],
  "tutor": ["Education"],
  "education consultant": ["Education"],
  "non-profit director": ["Social Impact"],
  "fundraiser": ["Social Impact", "Sales"],
  "volunteer coordinator": ["Social Impact"],
  
  // --- REAL ESTATE & HOSPITALITY ---
  "real estate agent": ["Real Estate"],
  "property manager": ["Real Estate"],
  "hotel manager": ["Hospitality"],
  "chef": ["Hospitality", "Food"],
  "restaurant owner": ["Hospitality", "Food"],
  "event planner": ["Hospitality", "Events"],
  "travel agent": ["Hospitality", "Travel"],
  
  // --- AUTOMOTIVE & LOGISTICS ---
  "mechanical engineer": ["Engineering", "Automotive"],
  "civil engineer": ["Engineering", "Construction"],
  "electrical engineer": ["Engineering"],
  "logistics manager": ["Logistics", "Supply Chain"],
  "supply chain analyst": ["Logistics", "Supply Chain"],
  "driver": ["Logistics"],
  "pilot": ["Aviation"],
  
  // --- GENERAL ---
  "student": ["General"],
  "freelancer": ["General"],
  "advisor": ["Advisory"],
  "coach": ["Wellness", "Advisory"]
};

export const ALL_INDUSTRIES = [
  "Tech", "Creative", "Business", "Marketing", "Sales", "Finance", "Legal", "Healthcare", 
  "Education", "Real Estate", "Hospitality", "Engineering", "Logistics", "Science", 
  "Social Impact", "Fashion", "Gaming", "Aviation", "Wellness", "Data", "AI", "Web3", 
  "Construction", "Security", "General", "Advisory", "Food", "Travel", "Supply Chain", "Communication"
];

export const INDUSTRY_TO_FOCUS: Record<string, string[]> = {
  "Tech": ["Scaling", "Stack", "Funding", "Hiring", "Product", "Architecture", "Cloud"],
  "Creative": ["Portfolio", "Branding", "Content", "Studio", "Exhibition", "Networking", "Production"],
  "Business": ["Strategy", "M&A", "Operations", "Leadership", "Partnership", "Scaling", "Revenue"],
  "Marketing": ["Growth", "Ads", "Content", "SEO", "PR", "Retention", "Influence"],
  "Sales": ["Closing", "Leads", "Pipeline", "CRM", "Expansion", "Prospecting", "B2B"],
  "Finance": ["Capital", "Investment", "Audit", "Tax", "Wealth", "Crypto", "Budgeting"],
  "Legal": ["Compliance", "IP", "Contracts", "Litigation", "Corporate", "Ethics", "Policy"],
  "Healthcare": ["Patient Care", "Research", "Telehealth", "Pharma", "Wellness", "Diagnosis", "Digital Health"],
  "Education": ["Curriculum", "EdTech", "Training", "Mentorship", "Academy", "E-learning", "Research"],
  "Real Estate": ["Commercial", "Residential", "Flipping", "Leasing", "Development", "Brokerage", "Investment"],
  "Hospitality": ["Customer Exp", "F&B", "Tourism", "Events", "Hotel Ops", "Catering", "Service"],
  "Engineering": ["CAD", "Materials", "Structural", "Manufacturing", "Automation", "Energy", "R&D"],
  "Logistics": ["Supply Chain", "Shipping", "Inventory", "Fleet", "Warehousing", "Last Mile", "Ops"],
  "Science": ["Lab Research", "Data", "Grants", "Biotech", "Physics", "Chemistry", "Innovation"],
  "Social Impact": ["Sustainability", "Philanthropy", "Advocacy", "ESG", "Non-profit", "Grants", "Community"],
  "Fashion": ["Design", "Retail", "E-commerce", "Apparel", "Runway", "Textiles", "Sourcing"],
  "Gaming": ["Unreal Engine", "Unity", "Publishing", "Esports", "Mobile", "Multiplayer", "Asset Art"],
  "Aviation": ["Commercial", "Maintenance", "Safety", "Logistics", "Charter", "Engineering", "Ops"],
  "Wellness": ["Coaching", "Mental Health", "Fitness", "Nutrition", "Yoga", "Mindfulness", "Retreats"],
  "General": ["Networking", "Advice", "Meetups", "Intro", "Opportunity", "Community", "Collaboration"]
};

export interface DetectionResult {
  industries: string[];
  confidence: number;
}

export const detectIndustry = (roleText: string): DetectionResult => {
  const normalized = roleText.toLowerCase().trim();
  if (normalized.length < 2) return { industries: [], confidence: 0 };

  const matches: string[] = [];
  let maxMatchLength = 0;

  for (const [role, industries] of Object.entries(ROLE_TO_INDUSTRY)) {
    if (normalized.includes(role)) {
      matches.push(...industries);
      maxMatchLength = Math.max(maxMatchLength, role.length);
    }
  }

  const uniqueIndustries = Array.from(new Set(matches));
  const confidence = Math.min((maxMatchLength / normalized.length) + 0.2, 1.0);

  return { 
    industries: uniqueIndustries, 
    confidence: uniqueIndustries.length > 0 ? confidence : 0 
  };
};
