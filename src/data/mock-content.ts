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
  subtitle: "Whats happening right now",
  sections: [],
};

export const NETWORK_CONTENT: PageContent = {
  title: "Network",
  subtitle: "Connect with the right people",
  sections: [],
};

export const INSIGHTS_CONTENT: PageContent = {
  title: "Insights",
  subtitle: "Learn what actually works",
  sections: [],
};

export const OPPORTUNITIES_CONTENT: PageContent = {
  title: "Opportunities",
  subtitle: "Turn activity into opportunity",
  sections: [],
};

export const WHAT_IS_CHECKOUT_CONTENT: PageContent = {
  title: "What is Checkout",
  subtitle: "The Business OS for Local Commerce",
  sections: [
    {
      title: "Our Vision",
      items: [
        { id: "v1", title: "One System, Total Control", type: "Vision", actionText: "Learn more", subtitle: "Checkout is more than an appit's an operating system for your professional life." },
        { id: "v2", title: "Community First", type: "Vision", actionText: "Learn more", subtitle: "We believe commerce should be built on trust, not just transactions." }
      ]
    }
  ]
};
