export type MarketplaceCategory = 
  | "Design" 
  | "Development" 
  | "Marketing" 
  | "Finance" 
  | "Legal" 
  | "Consulting"
  | "Operations";

export interface MarketplaceListing {
  id: string;
  title: string;
  provider: {
    name: string;
    avatar: string;
    role: string;
  };
  category: MarketplaceCategory;
  description: string;
  location: string;
  matchScore: number;
  tags: string[];
  useCases: string[];
  isFeatured?: boolean;
}

export type ListingSort = "Best Match" | "Nearby" | "New Listings";
