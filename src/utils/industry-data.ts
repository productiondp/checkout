/**
 * INDUSTRY & FOCUS AREA SYSTEM (V1.70)
 * Structured taxonomy for Professional matching.
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
    focusAreas: ["Web Development", "Mobile Apps", "AI / ML", "Data Science", "Cloud / DevOps", "Cybersecurity", "Blockchain"],
    specializations: {
      "Web Development": ["React/Next.js", "Backend/Node.js", "Fullstack", "SaaS Ops"],
      "Mobile Apps": ["iOS/Swift", "Android/Kotlin", "React Native", "Flutter"],
      "AI / ML": ["LLMs", "Computer Vision", "NLP", "Predictive Analytics"]
    }
  },
  {
    id: "design_creative",
    label: "Design & Creative",
    focusAreas: ["UI/UX Design", "Graphic Design", "Branding", "Video Editing", "Animation", "Illustration", "Product Design"],
    specializations: {
      "UI/UX Design": ["Mobile UX", "SaaS Design", "Fintech UX", "Design Systems"],
      "Branding": ["Visual Identity", "Typography", "Strategy"],
      "Video Editing": ["Motion Graphics", "Color Grading", "Post-Production"]
    }
  },
  {
    id: "marketing_growth",
    label: "Marketing & Growth",
    focusAreas: ["SEO", "Social Media", "Performance Ads", "Content Marketing", "Email Marketing", "Influencer Marketing", "Growth Hacking"],
    specializations: {
      "SEO": ["Technical SEO", "Content Strategy", "Backlink Building"],
      "Performance Ads": ["Google Ads", "Meta Ads", "LinkedIn Ads"],
      "Growth Hacking": ["Product-Led Growth", "Viral Loops", "Retention Strategy"]
    }
  },
  {
    id: "business_startups",
    label: "Business & Startups",
    focusAreas: ["Strategy", "Product Management", "Operations", "Fundraising", "Business Development", "Human Resources"]
  },
  {
    id: "sales_success",
    label: "Sales & Customer Success",
    focusAreas: ["B2B Sales", "Lead Generation", "Customer Support", "Account Management", "Inside Sales"]
  },
  {
    id: "finance_legal",
    label: "Finance & Legal",
    focusAreas: ["Fintech", "Accounting", "Corporate Law", "Investment Banking", "GST/Compliance", "Taxation"]
  },
  {
    id: "education_training",
    label: "Education & Training",
    focusAreas: ["EdTech", "Skill Development", "Academic Research", "Training", "Placement Services"]
  },
  {
    id: "health_wellness",
    label: "Health & Wellness",
    focusAreas: ["Medical Services", "Ayurveda", "Fitness", "Mental Health", "Diagnostics"]
  },
  {
    id: "media_entertainment",
    label: "Media & Entertainment",
    focusAreas: ["Journalism", "Photography", "Music Production", "Event Management", "Podcasting"]
  },
  {
    id: "tourism_hospitality",
    label: "Tourism & Hospitality",
    focusAreas: ["Eco-Tourism", "Hotel Management", "Travel Tech", "Wellness Tourism", "Event Planning"]
  },
  {
    id: "retail_ecommerce",
    label: "Retail & E-commerce",
    focusAreas: ["Direct-to-Consumer", "Inventory Management", "Retail Ops", "B2B Supply", "Dropshipping"]
  },
  {
    id: "realestate_construction",
    label: "Real Estate & Construction",
    focusAreas: ["Interior Design", "Architecture", "Real Estate Tech", "Civil Engineering", "Project Management"]
  },
  {
    id: "agriculture_local",
    label: "Agriculture & Local Industry",
    focusAreas: ["Agri-Tech", "Food Processing", "Organic Farming", "Plantation Management", "Handicrafts"]
  },
  {
    id: "manufacturing_production",
    label: "Manufacturing & Production",
    focusAreas: ["Supply Chain", "Automotive", "Export/Import", "Automation", "Quality Control"]
  },
  {
    id: "freelance_remote",
    label: "Freelance & Remote Services",
    focusAreas: ["Virtual Assistance", "Transcription", "Data Entry", "Translation", "Ghostwriting"]
  }
];

export const getIndustryById = (id: string) => INDUSTRY_DATA.find(i => i.id === id);

export const getAllFocusAreas = () => INDUSTRY_DATA.flatMap(i => i.focusAreas);

/**
 * AUTO-DETECTION (Step 8)
 * Suggest industry/focus based on keywords.
 */
export const detectTaxonomy = (text: string) => {
  const lower = text.toLowerCase();
  
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
