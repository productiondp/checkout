import { Community, CommunityPost, Member } from "@/types/communities";

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: "1",
    name: "SaaS Founders India",
    description: "High-growth SaaS founders building for the world from India. Focused on GTM and Product-Led Growth.",
    memberCount: 1240,
    tags: ["SaaS", "GTM", "Tech"],
    activity: "Active",
    category: "Partnership",
    isFeatured: true,
    visibility: "Public",
    x: 45,
    y: 30
  },
  {
    id: "2",
    name: "Bangalore Tech Recruiters",
    description: "A hub for tech recruiters in Bangalore to share mandates and find talent for high-growth startups.",
    memberCount: 850,
    tags: ["Recruiting", "Talent", "Bangalore"],
    activity: "Trending",
    category: "Hiring",
    isFeatured: true,
    visibility: "Public",
    x: 65,
    y: 45
  },
  {
    id: "3",
    name: "D2C Brands Syndicate",
    description: "Exclusive community for D2C brand owners focusing on logistics, supply chain, and performance marketing.",
    memberCount: 520,
    tags: ["D2C", "Logistics", "Marketing"],
    activity: "New",
    category: "Leads",
    isFeatured: true,
    visibility: "Private",
    x: 35,
    y: 60
  },
  {
    id: "4",
    name: "Real Estate Networking",
    description: "Real estate professionals sharing leads and high-value properties in Tier-1 cities.",
    memberCount: 3100,
    tags: ["Real Estate", "Leads", "Investment"],
    activity: "Active",
    category: "Leads",
    isFeatured: false,
    visibility: "Public"
  },
  {
    id: "5",
    name: "Angel Investors Club",
    description: "A space for active angel investors to discuss deals and co-invest in early-stage startups.",
    memberCount: 150,
    tags: ["Investing", "Startups", "Equity"],
    activity: "Trending",
    category: "Partnership",
    isFeatured: false,
    visibility: "Private"
  },
  {
    id: "6",
    name: "Marketing Leaders Hub",
    description: "CMOs and marketing heads sharing strategies and agency recommendations.",
    memberCount: 980,
    tags: ["Marketing", "Strategy", "Growth"],
    activity: "Active",
    category: "Partnership",
    isFeatured: false,
    visibility: "Public"
  }
];

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: "p1",
    communityId: "1",
    type: "Hiring",
    description: "Looking for a Founding Engineer with expertise in Next.js and Rust. Equity-heavy role.",
    matchScore: 94,
    author: "Aditi Sharma",
    timestamp: "2h ago"
  },
  {
    id: "p2",
    communityId: "1",
    type: "Partnership",
    description: "Seeking a cloud infrastructure partner for a multi-year scaling project. High budget.",
    matchScore: 88,
    author: "Rahul Varma",
    timestamp: "5h ago"
  },
  {
    id: "p3",
    communityId: "2",
    type: "Leads",
    description: "5 Open mandates for Senior Backend Devs (Node/Go) for a Fintech unicorn. Referral bonus included.",
    matchScore: 82,
    author: "Preeti Singh",
    timestamp: "1h ago"
  },
  {
    id: "p4",
    communityId: "3",
    type: "Meetup",
    description: "Closed-door dinner for D2C founders in Indiranagar this Friday. DM to RSVP.",
    matchScore: 91,
    author: "Karan Johar",
    timestamp: "10h ago"
  }
];

export const MOCK_MAP_PEOPLE: Member[] = [
  {
    id: "m1",
    name: "Sandeep Nailwal",
    role: "Founder",
    company: "Polygon",
    matchScore: 98,
    avatar: "https://i.pravatar.cc/150?u=sandeep",
    x: 52,
    y: 38
  },
  {
    id: "m2",
    name: "Nithin Kamath",
    role: "CEO",
    company: "Zerodha",
    matchScore: 95,
    avatar: "https://i.pravatar.cc/150?u=nithin",
    x: 58,
    y: 52
  },
  {
    id: "m3",
    name: "Kunal Shah",
    role: "Founder",
    company: "CRED",
    matchScore: 92,
    avatar: "https://i.pravatar.cc/150?u=kunal",
    x: 42,
    y: 48
  }
];

export const MOCK_MEMBERS = MOCK_MAP_PEOPLE;
