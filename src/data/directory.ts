import { BusinessListing } from "@/types/directory";

export const MOCK_BUSINESSES: BusinessListing[] = [
  {
    id: "b1",
    name: "Zenith Creative Agency",
    logo: "https://i.pravatar.cc/150?u=zenith",
    category: "Agencies",
    description: "A full-stack branding and digital strategy agency focused on scaling regional D2C brands.",
    services: ["Branding", "UI/UX", "Social Media"],
    location: "Koramangala, Bangalore",
    matchScore: 98,
    isVerified: true,
    expertise: ["D2C Scaling", "Performance Marketing", "Visual Identity"],
    isFeatured: true
  },
  {
    id: "b2",
    name: "Apex Manufacturing",
    logo: "https://i.pravatar.cc/150?u=apex",
    category: "Manufacturing",
    description: "Precision engineering and large-scale manufacturing solutions for industrial hardware.",
    services: ["CNC Machining", "Injection Molding", "Tooling"],
    location: "Peenya, Bangalore",
    matchScore: 94,
    isVerified: true,
    expertise: ["Industrial Hardware", "Rapid Prototyping", "Supply Chain"],
    isFeatured: true
  },
  {
    id: "b3",
    name: "Fortress Legal",
    logo: "https://i.pravatar.cc/150?u=fortress",
    category: "Legal",
    description: "Corporate legal counsel specializing in intellectual property and venture capital deals.",
    services: ["IP Protection", "M&A", "Contract Law"],
    location: "CBD, Bangalore",
    matchScore: 92,
    isVerified: true,
    expertise: ["Venture Capital", "Corporate Law", "Exit Strategy"]
  },
  {
    id: "b4",
    name: "CloudScale IT",
    logo: "https://i.pravatar.cc/150?u=cloudscale",
    category: "IT Services",
    description: "Enterprise cloud migration and managed infrastructure services for high-growth tech firms.",
    services: ["AWS Management", "DevOps", "Cybersecurity"],
    location: "Whitefield, Bangalore",
    matchScore: 89,
    isVerified: true,
    expertise: ["Cloud Migration", "Managed Services", "Infrastructure"]
  }
];
