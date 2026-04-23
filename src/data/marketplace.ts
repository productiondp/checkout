import { MarketplaceListing } from "@/types/marketplace";

export const MOCK_LISTINGS: MarketplaceListing[] = [
  {
    id: "m1",
    title: "Scalable E-commerce Architecture",
    provider: {
      name: "TechNode Solutions",
      avatar: "https://i.pravatar.cc/150?u=technode",
      role: "System Integrators"
    },
    category: "Development",
    description: "High-authority system architecture for regional scaling. Specializing in high-concurrency order processing and inventory sync.",
    location: "Indiranagar, Bangalore",
    matchScore: 98,
    tags: ["Node.js", "Redis", "Architecture"],
    useCases: [
      "Scaling regional logistics",
      "Unified inventory management",
      "Real-time order tracking"
    ],
    isFeatured: true
  },
  {
    id: "m2",
    title: "Strategic Brand Identity for Founders",
    provider: {
      name: "Studio Raven",
      avatar: "https://i.pravatar.cc/150?u=raven",
      role: "Design Lead"
    },
    category: "Design",
    description: "Minimalist, high-authority brand systems for business operators. Focused on surgical precision and professional credibility.",
    location: "Koramangala, Bangalore",
    matchScore: 94,
    tags: ["Branding", "Identity", "UX"],
    useCases: [
      "Series A pitch decks",
      "Institutional branding",
      "Executive identity design"
    ],
    isFeatured: true
  },
  {
    id: "m3",
    title: "Cross-border Compliance & Tax Legal",
    provider: {
      name: "LegalOps Hub",
      avatar: "https://i.pravatar.cc/150?u=legalops",
      role: "Compliance Expert"
    },
    category: "Legal",
    description: "Navigating SE Asia compliance frameworks for D2C brands. Zero-friction tax structures for regional expansion.",
    location: "CBD, Bangalore",
    matchScore: 92,
    tags: ["Compliance", "Tax", "Regional"],
    useCases: [
      "Expanding to Singapore",
      "FDI compliance",
      "Regional tax optimization"
    ]
  },
  {
    id: "m4",
    title: "Supply Chain Optimization Audit",
    provider: {
      name: "LogiConsult",
      avatar: "https://i.pravatar.cc/150?u=logiconsult",
      role: "Ops Consultant"
    },
    category: "Operations",
    description: "End-to-end audit of last-mile delivery nodes. Reducing operational friction by 22% on average.",
    location: "Whitefield, Bangalore",
    matchScore: 89,
    tags: ["Logistics", "Audit", "Operations"],
    useCases: [
      "Last-mile cost reduction",
      "Warehouse automation",
      "Vendor node evaluation"
    ]
  }
];
