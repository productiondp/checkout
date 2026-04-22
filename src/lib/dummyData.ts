// ── PROFILES / EXPERTS ──────────────────────────────────────────
export const DUMMY_PROFILES: any[] = [
  { 
    id: 1, 
    name: "Anand M", 
    role: "Strategy", 
    avatar: "https://i.pravatar.cc/150?u=anand", 
    location: "Trivandrum", 
    rating: 4.9, 
    badge: "Elite",
    checkoutScore: 94,
    rank: { pos: 1, city: "Trivandrum", domain: "Strategy" },
    bio: "Expert in scaling brands. Helped 3 companies grow significantly." 
  },
  { 
    id: 2, 
    name: "Meera Nair", 
    role: "Marketing", 
    avatar: "https://i.pravatar.cc/150?u=meera", 
    location: "Kochi", 
    rating: 4.8, 
    badge: "Gold",
    checkoutScore: 88,
    rank: { pos: 5, city: "Kochi", domain: "Marketing" },
    bio: "Digital marketing specialist for consumer goods." 
  },
  { 
    id: 3, 
    name: "Adnan S", 
    role: "Finance", 
    avatar: "https://i.pravatar.cc/150?u=adnan", 
    location: "Bangalore", 
    rating: 4.9, 
    badge: "Silver",
    checkoutScore: 72,
    rank: { pos: 12, city: "Bangalore", domain: "Finance" },
    bio: "Expert in fundraising and financial planning." 
  },
  { 
    id: 4, 
    name: "Sarah Chen", 
    role: "Operations", 
    avatar: "https://i.pravatar.cc/150?u=sarah", 
    location: "Singapore", 
    rating: 5.0, 
    badge: "Elite",
    checkoutScore: 99,
    rank: { pos: 2, city: "Trivandrum", domain: "Operations" },
    bio: "Specialist in logistics and supply chain." 
  }
];

// ── POSTS (UNIVERSAL FEED SPEC) ──────────────────────────────────
export const DUMMY_POSTS: any[] = [
  {
    id: 101,
    type: "Lead",
    title: "Need packaging vendor for snack brand",
    author: "Arun Dev",
    avatar: "https://i.pravatar.cc/150?u=arun",
    time: "1h ago",
    content: "Looking for a reliable vendor to supply eco-friendly snack pouches in bulk.",
    budget: "₹20K–₹40K",
    dueDate: "5 days",
    location: "Trivandrum",
    matchScore: 94,
    badge: "Gold",
    rank: "#5 in FMCG",
    domain: "FMCG"
  },
  {
    id: 102,
    type: "Hiring",
    title: "Looking for UI/UX Intern",
    author: "Zigma Corp",
    avatar: "https://i.pravatar.cc/150?u=zigma",
    time: "3h ago",
    skills: "Figma",
    duration: "2 months",
    workType: "Remote",
    location: "Trivandrum",
    matchScore: 88,
    badge: "Gold",
    rank: "#11 in Design",
    domain: "Design"
  },
  {
    id: 103,
    type: "Partner",
    title: "Looking for distribution partner",
    author: "FastTrack",
    avatar: "https://i.pravatar.cc/150?u=fast",
    time: "2h ago",
    offer: "FMCG brand + 10K customers",
    need: "Kerala distributor",
    timeline: "Long-term",
    location: "Trivandrum",
    matchScore: 91,
    badge: "Elite",
    rank: "#3 in FMCG",
    domain: "FMCG"
  },
  {
    id: 104,
    type: "Meetup",
    title: "Low customer retention problem",
    author: "GrowthHub",
    avatar: "https://i.pravatar.cc/150?u=growth",
    time: "Soon",
    advisor: "Marketing Expert",
    advisorScore: 92,
    joined: 4,
    maxSlots: 8,
    location: "Trivandrum",
    matchScore: 97,
    badge: "Elite",
    rank: "#2 in Marketing",
    domain: "Marketing",
    isMeeting: true
  },
  {
    id: 105,
    type: "Update",
    title: "Launching cloud kitchen next week",
    author: "Rahul Sethi",
    avatar: "https://i.pravatar.cc/150?u=rahul",
    time: "2h ago",
    content: "Finally hitting the market with our first ghost kitchen model.",
    need: "Looking for delivery partners",
    location: "Trivandrum",
    matchScore: 65,
    badge: "Silver",
    rank: "#34 in Food",
    domain: "Food"
  }
];
