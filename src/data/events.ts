import { Event } from "@/types/events";

export const MOCK_EVENTS: Event[] = [
  {
    id: "e1",
    name: "Global Supply Chain Summit 2026",
    description: "The definitive gathering for logistics masters, freight forwarders, and supply chain innovators. This year's summit focuses on AI-driven delivery nodes and cross-border trade optimization.",
    date: "June 24-26, 2026",
    time: "10:00 AM - 06:00 PM",
    location: "Jio World Convention Centre, Mumbai",
    attendeeCount: 4500,
    tags: ["Logistics", "Trade", "AI"],
    banner: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000",
    matchScore: 98,
    status: "Upcoming",
    isFeatured: true,
    organizer: "LogiGlobal Expo",
    agenda: ["AI in Delivery Nodes", "Cross-border Trade Logic", "Maritime Routing 2026"]
  },
  {
    id: "e2",
    name: "D2C Brand Velocity Expo",
    description: "Connect with India's fastest scaling digital-first brands. Discover the latest in retail automation, performance marketing, and customer retention systems.",
    date: "July 12-14, 2026",
    time: "09:00 AM - 05:00 PM",
    location: "BIEC, Bangalore",
    attendeeCount: 2800,
    tags: ["Consumer Tech", "Retail", "Scale"],
    banner: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=2000",
    matchScore: 92,
    status: "Upcoming",
    isFeatured: true,
    organizer: "D2C Council",
    agenda: ["Scale Playbooks", "VC Networking", "Influencer Hubs"]
  },
  {
    id: "e3",
    name: "Venture Capital & Seed Summit",
    description: "Where founders meet capital. A closed-door summit for Series A+ ready startups and global venture partners.",
    date: "August 05-07, 2026",
    time: "11:00 AM - 04:00 PM",
    location: "India Expo Mart, Noida",
    attendeeCount: 1200,
    tags: ["Finance", "VC", "Pitch"],
    banner: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2000",
    matchScore: 85,
    status: "Upcoming",
    isFeatured: false,
    organizer: "Founders Fund India"
  },
  {
    id: "e4",
    name: "Real Estate Developers Meet",
    description: "Annual gathering of Tier-1 real estate developers to discuss urban planning and investment nodes.",
    date: "May 10, 2026",
    time: "10:00 AM - 02:00 PM",
    location: "Hyatt Regency, Gurgaon",
    attendeeCount: 500,
    tags: ["Real Estate", "Investment", "Urban"],
    banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
    matchScore: 78,
    status: "Upcoming",
    isFeatured: false,
    organizer: "REDAI"
  }
];
