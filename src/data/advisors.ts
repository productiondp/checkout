import { Advisor } from "@/types/advisors";

export const MOCK_ADVISORS: Advisor[] = [
  {
    id: "a1",
    name: "Naval Ravikant",
    role: "Angel Investor",
    industry: "Tech & Finance",
    experience: "25+ Years",
    expertise: ["Wealth", "Leverage", "Judgment"],
    avatar: "https://i.pravatar.cc/150?u=naval",
    matchScore: 99,
    bestFor: "Long-term wealth creation and mental models for founders.",
    bio: "Co-founder of AngelList. Active angel investor in over 200 companies including Uber and Twitter.",
    highlights: ["Founded AngelList", "Early investor in Twitter", "Author of The Almanack"],
    focus: ["Venture Capital", "Crypto Strategy", "Personal Growth"],
    availability: "Flexible - Requests only"
  },
  {
    id: "a2",
    name: "Balaji Srinivasan",
    role: "Technologist",
    industry: "Web3 & Network States",
    experience: "15+ Years",
    expertise: ["BioTech", "Crypto", "Strategy"],
    avatar: "https://i.pravatar.cc/150?u=balaji",
    matchScore: 96,
    bestFor: "Future-tech roadmaps and decentralized infrastructure.",
    bio: "Former CTO of Coinbase and General Partner at Andreessen Horowitz.",
    highlights: ["Former CTO @ Coinbase", "GP @ a16z", "Author of The Network State"],
    focus: ["Network States", "Longevity", "Crypto-Economics"],
    availability: "Limited - High Priority Mandates"
  },
  {
    id: "a3",
    name: "Shradha Sharma",
    role: "Founder & CEO",
    industry: "Media & Content",
    experience: "18+ Years",
    expertise: ["Storytelling", "Scaling", "Branding"],
    avatar: "https://i.pravatar.cc/150?u=shradha",
    matchScore: 92,
    bestFor: "Building high-authority brand narratives in India.",
    bio: "Founder of YourStory. Chronicler of India's startup ecosystem.",
    highlights: ["Founded YourStory", "Fortune 40 Under 40", "Top 50 Influential Women"],
    focus: ["Content Strategy", "Founder Branding", "Community Building"],
    availability: "Weekly slots available"
  },
  {
    id: "a4",
    name: "Kunwar Rahul",
    role: "Supply Chain Expert",
    industry: "Logistics",
    experience: "20+ Years",
    expertise: ["Operations", "Cold Chain", "Last Mile"],
    avatar: "https://i.pravatar.cc/150?u=rahul",
    matchScore: 88,
    bestFor: "Operational bottlenecks in regional logistics networks.",
    bio: "Senior advisor to major logistics hubs in SE Asia. Specialist in port-to-hub optimization.",
    highlights: ["Lead @ FedEx Regional", "Advisor to Ministry of Trade", "Scaled 3 PL startups"],
    focus: ["Logistics Automation", "Cross-border Trade", "Warehouse Efficiency"],
    availability: "Immediate - On Call"
  }
];
