export interface ContentCard {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  actionText: string;
  meta?: string[];
}

export interface Section {
  title: string;
  items: ContentCard[];
}

export interface PageContent {
  title: string;
  subtitle: string;
  sections: Section[];
}

export const DISCOVER_CONTENT: PageContent = {
  title: "Discover",
  subtitle: "What’s happening right now",
  sections: [
    {
      title: "Trending",
      items: [
        { id: "t1", title: "How we scaled to 10K users in 30 days", type: "Article", actionText: "Read" },
        { id: "t2", title: "Building a profitable niche brand in Kerala", type: "Case Study", actionText: "Read" },
        { id: "t3", title: "AI tools every founder is using", type: "Guide", actionText: "Read" },
      ],
    },
    {
      title: "Live Now",
      items: [
        { id: "l1", title: "Startup Meetup – Kochi", type: "Live", actionText: "Join now", subtitle: "Live" },
        { id: "l2", title: "UI/UX Review Session", type: "Workshop", actionText: "Join now" },
        { id: "l3", title: "Founder AMA", type: "Q&A", actionText: "Ask anything" },
      ],
    },
    {
      title: "Ideas",
      items: [
        { id: "i1", title: "Looking for co-founder (Fintech)", type: "Idea", actionText: "Collaborate" },
        { id: "i2", title: "New food brand concept", type: "Feedback", actionText: "Give feedback" },
        { id: "i3", title: "Local delivery optimization idea", type: "Idea", actionText: "Discuss" },
      ],
    },
    {
      title: "New & Rising",
      items: [
        { id: "r1", title: "Early-stage creator sharing build logs", type: "Log", actionText: "Follow" },
        { id: "r2", title: "Student founder launching first product", type: "Launch", actionText: "Support" },
      ],
    },
  ],
};

export const NETWORK_CONTENT: PageContent = {
  title: "Network",
  subtitle: "Connect with the right people",
  sections: [
    {
      title: "Advisors",
      items: [
        { id: "a1", title: "Arun K", subtitle: "Startup Growth Advisor", type: "Advisor", meta: ["Growth", "Scaling"], actionText: "Connect" },
        { id: "a2", title: "Meera S", subtitle: "Brand Strategist", type: "Advisor", meta: ["Branding", "GTM"], actionText: "Connect" },
      ],
    },
    {
      title: "Founders",
      items: [
        { id: "f1", title: "Rahul P", subtitle: "SaaS Founder", type: "Founder", meta: ["SaaS", "Product"], actionText: "Collaborate" },
        { id: "f2", title: "Neha R", subtitle: "D2C Brand Owner", type: "Founder", meta: ["E-commerce", "Ops"], actionText: "Collaborate" },
      ],
    },
    {
      title: "Creators",
      items: [
        { id: "c1", title: "Adil V", subtitle: "Business Content Creator", type: "Creator", meta: ["Content", "Marketing"], actionText: "Join" },
        { id: "c2", title: "Fathima N", subtitle: "UI/UX Designer", type: "Creator", meta: ["Design", "Research"], actionText: "Join" },
      ],
    },
    {
      title: "Professionals",
      items: [
        { id: "p1", title: "Software Engineer", subtitle: "Full-stack Developer", type: "Professional", meta: ["React", "Node"], actionText: "Connect" },
        { id: "p2", title: "Growth Marketer", subtitle: "Performance Marketing", type: "Professional", meta: ["Ads", "Funnel"], actionText: "Connect" },
      ],
    },
  ],
};

export const INSIGHTS_CONTENT: PageContent = {
  title: "Insights",
  subtitle: "Learn what actually works",
  sections: [
    {
      title: "Case Studies",
      items: [
        { id: "cs1", title: "How a local brand hit ₹1L/month", type: "Case Study", actionText: "View" },
        { id: "cs2", title: "From 0 to first 100 customers", type: "Case Study", actionText: "View" },
      ],
    },
    {
      title: "Sessions",
      items: [
        { id: "s1", title: "Live: Marketing strategies that convert", type: "Session", actionText: "Watch" },
        { id: "s2", title: "Product building for beginners", type: "Session", actionText: "Watch" },
      ],
    },
    {
      title: "Top Insights",
      items: [
        { id: "in1", title: "Why most startups fail early", type: "Insight", actionText: "Read" },
        { id: "in2", title: "3 growth hacks that still work", type: "Insight", actionText: "Read" },
      ],
    },
    {
      title: "How-To",
      items: [
        { id: "ht1", title: "Set up your first ad campaign", type: "Guide", actionText: "Learn" },
        { id: "ht2", title: "Build a landing page that converts", type: "Guide", actionText: "Learn" },
      ],
    },
  ],
};

export const OPPORTUNITIES_CONTENT: PageContent = {
  title: "Opportunities",
  subtitle: "Turn activity into opportunity",
  sections: [
    {
      title: "Jobs",
      items: [
        { id: "j1", title: "Frontend Developer", subtitle: "Startup (Remote)", type: "Job", meta: ["React", "Remote"], actionText: "Apply" },
        { id: "j2", title: "Marketing Lead", subtitle: "Early-stage brand", type: "Job", meta: ["Growth", "Kochi"], actionText: "Apply" },
      ],
    },
    {
      title: "Gigs",
      items: [
        { id: "g1", title: "UI designer needed", subtitle: "2-week project", type: "Gig", meta: ["Figma", "UI"], actionText: "Apply" },
        { id: "g2", title: "Video editor for reels", subtitle: "Ongoing project", type: "Gig", meta: ["Editing", "Social"], actionText: "Apply" },
      ],
    },
    {
      title: "Collaborations",
      items: [
        { id: "co1", title: "Looking for co-founder", subtitle: "Fintech Startup", type: "Collab", meta: ["Tech", "Fintech"], actionText: "Join" },
        { id: "co2", title: "Seeking partner for food startup", subtitle: "Regional brand", type: "Collab", meta: ["Operations", "D2C"], actionText: "Join" },
      ],
    },
    {
      title: "Hiring Now",
      items: [
        { id: "h1", title: "Startup hiring interns", subtitle: "Multiple roles", type: "Hiring", actionText: "Apply" },
        { id: "h2", title: "Agency hiring social media manager", subtitle: "Full-time", type: "Hiring", actionText: "Apply" },
      ],
    },
  ],
};

export const WHAT_IS_CHECKOUT_CONTENT: PageContent = {
  title: "What is Checkout",
  subtitle: "The Business OS for Local Commerce",
  sections: [
    {
      title: "Our Vision",
      items: [
        { title: "One System, Total Control", description: "Checkout is more than an app—it's an operating system for your professional life." },
        { title: "Community First", description: "We believe commerce should be built on trust, not just transactions." },
        { title: "Global Standards, Local Context", description: "Bringing world-class tools to every founder and creator in the local ecosystem." }
      ]
    },
    {
      title: "Core Pillars",
      items: [
        { title: "Discover", description: "Real-time feeds of what's happening in your niche and city." },
        { title: "Network", description: "Direct lines to advisors, founders, and partners." },
        { title: "Insights", description: "Learning modules and case studies that actually work." },
        { title: "Opportunities", description: "The heartbeat of the network—jobs, gigs, and collaborations." }
      ]
    },
    {
      title: "How it Works",
      items: [
        { title: "Step 1: Join the Network", description: "Define your role and start your professional profile." },
        { title: "Step 2: Connect & Collaborate", description: "Join meetups, ask for advice, or post a requirement." },
        { title: "Step 3: Grow Your Business", description: "Use the insights and network to scale your impact." }
      ]
    }
  ]
};
