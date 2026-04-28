/**
 * INDUSTRY & FOCUS AREA SYSTEM (V2.0 - KERALA OPTIMIZED)
 * Comprehensive taxonomy for localized professional matching.
 */

export interface IndustryFocus {
  id: string;
  label: string;
  focusAreas: string[];
  specializations?: Record<string, string[]>;
}

export const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export const INDUSTRY_DATA: IndustryFocus[] = [
  {
    id: "tech_software",
    label: "Technology & Software",
    focusAreas: ["Web Development", "Mobile App Development", "AI / Machine Learning", "Data Analytics", "Cloud / DevOps", "Cybersecurity", "SaaS Development"]
  },
  {
    id: "design_creative",
    label: "Design & Creative",
    focusAreas: ["UI/UX Design", "Graphic Design", "Branding", "Motion Graphics", "Video Editing", "Photography"]
  },
  {
    id: "marketing_media",
    label: "Marketing & Media",
    focusAreas: ["Digital Marketing", "Social Media", "SEO", "Content Creation", "Performance Ads", "Influencer Marketing"]
  },
  {
    id: "business_startups",
    label: "Business & Startups",
    focusAreas: ["Startup Building", "Product Management", "Strategy", "Operations", "Fundraising"]
  },
  {
    id: "sales_success",
    label: "Sales & Customer Success",
    focusAreas: ["B2B Sales", "B2C Sales", "Lead Generation", "CRM", "Customer Support"]
  },
  {
    id: "finance_legal",
    label: "Finance & Legal",
    focusAreas: ["Accounting", "Taxation (GST/India)", "Financial Planning", "Legal Consulting", "Compliance"]
  },
  {
    id: "education_training",
    label: "Education & Training",
    focusAreas: ["Tutoring", "Coaching", "Skill Development", "EdTech", "Workshops"]
  },
  {
    id: "health_wellness",
    label: "Health & Wellness",
    focusAreas: ["Fitness Training", "Nutrition", "Mental Health", "Ayurveda", "Yoga"]
  },
  {
    id: "media_entertainment",
    label: "Media & Entertainment",
    focusAreas: ["Film Production", "YouTube Content", "Podcasting", "Acting", "Script Writing"]
  },
  {
    id: "tourism_hospitality",
    label: "Tourism & Hospitality",
    focusAreas: ["Tour Planning", "Travel Guide", "Homestay Management", "Hotel Operations", "Event Hosting"]
  },
  {
    id: "retail_ecommerce",
    label: "Retail & E-commerce",
    focusAreas: ["Online Selling", "Shopify / Store Setup", "Product Sourcing", "Logistics", "Dropshipping"]
  },
  {
    id: "realestate_construction",
    label: "Real Estate & Construction",
    focusAreas: ["Architecture", "Interior Design", "Construction", "Property Sales", "Site Management"]
  },
  {
    id: "agriculture_farming",
    label: "Agriculture & Farming",
    focusAreas: ["Organic Farming", "Spice Cultivation", "Rubber Plantation", "Coconut Farming", "Agri Business"]
  },
  {
    id: "fisheries_marine",
    label: "Fisheries & Marine",
    focusAreas: ["Fish Farming", "Seafood Export", "Aquaculture", "Marine Logistics"]
  },
  {
    id: "manufacturing_production",
    label: "Manufacturing & Production",
    focusAreas: ["Small Scale Manufacturing", "Industrial Production", "Quality Control", "Packaging"]
  },
  {
    id: "logistics_transportation",
    label: "Logistics & Transportation",
    focusAreas: ["Delivery Services", "Supply Chain", "Fleet Management", "Warehouse Ops"]
  },
  {
    id: "government_public",
    label: "Government & Public Services",
    focusAreas: ["Civil Services", "Public Admin", "Policy Support"]
  },
  {
    id: "ngos_social",
    label: "NGOs & Social Impact",
    focusAreas: ["Community Work", "Sustainability", "Rural Development", "Social Projects"]
  },
  {
    id: "freelance_remote",
    label: "Freelance & Remote Work",
    focusAreas: ["Freelancing", "Consulting", "Virtual Assistance", "Remote Jobs"]
  },
  {
    id: "skilled_trades",
    label: "Skilled Trades & Services",
    focusAreas: ["Electrician", "Plumbing", "Carpentry", "Mechanics", "Technicians"]
  }
];

export const getIndustryById = (id: string) => INDUSTRY_DATA.find(i => i.id === id);

export const getAllFocusAreas = () => INDUSTRY_DATA.flatMap(i => i.focusAreas);

/**
 * AUTO-DETECTION (V2.1 - WEIGHTED MATCHING)
 * Suggest industry/focus based on weighted keyword confidence.
 */
export const detectTaxonomy = (text: string) => {
  const lower = text.toLowerCase();
  let bestMatch = { industry: "", focus: "", confidence: 0 };

  // 1. High-Precision Direct Rules (Confidence: 100)
  const directRules = [
    { keys: ["wedding", "photography", "photographer", "camera", "drone"], ind: "media_entertainment", foc: "Photography" },
    { keys: ["ayurveda", "doctor", "medicine", "clinic"], ind: "health_wellness", foc: "Ayurveda" },
    { keys: ["gst", "tax", "audit", "ca", "accounting"], ind: "finance_legal", foc: "Taxation (GST/India)" },
    { keys: ["startup", "build", "mvp", "product"], ind: "business_startups", foc: "Startup Building" },
    { keys: ["dev", "app", "web", "software", "code"], ind: "tech_software", foc: "Web Development" }
  ];

  for (const rule of directRules) {
    if (rule.keys.some(k => lower.includes(k))) {
      return { ...rule, industry: rule.ind, focus: rule.foc, confidence: 100 };
    }
  }

  // 2. Focus Area & Industry Weighted Scanning
  for (const industry of INDUSTRY_DATA) {
    let score = 0;
    
    // Industry label match (Score: 50)
    if (lower.includes(industry.label.toLowerCase().split(' ')[0])) score += 50;
    
    for (const focus of industry.focusAreas) {
      let focusScore = score;
      
      // Focus area direct match (Score: 80)
      if (lower.includes(focus.toLowerCase())) focusScore += 80;
      
      // Partial keyword overlap (Score: 20 per keyword)
      const focusKeywords = focus.toLowerCase().split(' ');
      focusKeywords.forEach(k => {
        if (k.length > 3 && lower.includes(k)) focusScore += 20;
      });

      if (focusScore > bestMatch.confidence) {
        bestMatch = { industry: industry.id, focus: focus, confidence: focusScore };
      }
    }
  }

  // Cap confidence at 100
  bestMatch.confidence = Math.min(bestMatch.confidence, 100);

  // Success Condition: Confidence > 70
  if (bestMatch.confidence >= 70) {
    return bestMatch;
  }
  
  // Partial Condition: Confidence > 30 (for "Closest Match")
  if (bestMatch.confidence > 30) {
    return { ...bestMatch, isPartial: true };
  }
  
  return null;
};
