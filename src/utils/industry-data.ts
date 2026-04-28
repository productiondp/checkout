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
 * AUTO-DETECTION (V2.0)
 * Suggest industry/focus based on localized keywords and user intent.
 */
export const detectTaxonomy = (text: string) => {
  const lower = text.toLowerCase();
  
  // Custom Hard-coded Rules for high-precision
  if (lower.includes("wedding") || lower.includes("photographer") || lower.includes("photography")) {
    return { industry: "media_entertainment", focus: "Photography" };
  }
  if (lower.includes("ayurveda") || lower.includes("doctor")) {
    return { industry: "health_wellness", focus: "Ayurveda" };
  }
  if (lower.includes("gst") || lower.includes("tax") || lower.includes("accounting")) {
    return { industry: "finance_legal", focus: "Taxation (GST/India)" };
  }
  if (lower.includes("rubber") || lower.includes("coconut") || lower.includes("spice")) {
    return { industry: "agriculture_farming", focus: "Agri Business" };
  }

  for (const industry of INDUSTRY_DATA) {
    // Check industry label
    if (lower.includes(industry.label.toLowerCase().split(' ')[0])) {
      return { industry: industry.id, focus: industry.focusAreas[0] };
    }
    
    // Check focus areas
    for (const focus of industry.focusAreas) {
      if (lower.includes(focus.toLowerCase())) {
        return { industry: industry.id, focus: focus };
      }
    }
  }
  
  return null;
};
