export type CommunityCategory = "All" | "Hiring" | "Partnership" | "Leads" | "Meetup" | "Local";

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  tags: string[];
  activity: "Active" | "Trending" | "New";
  category: CommunityCategory;
  isFeatured?: boolean;
  visibility: "Public" | "Private";
  x?: number;
  y?: number;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  type: "Leads" | "Partnership" | "Hiring" | "Meetup";
  description: string;
  matchScore: number;
  author: string;
  timestamp: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  company: string;
  matchScore: number;
  avatar: string;
  x?: number;
  y?: number;
}
