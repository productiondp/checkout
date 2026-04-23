export type BusinessCategory = 
  | "Restaurants" 
  | "Agencies" 
  | "Manufacturing" 
  | "IT Services" 
  | "Finance" 
  | "Legal" 
  | "Retail"
  | "Other";

export interface BusinessListing {
  id: string;
  name: string;
  logo: string;
  category: BusinessCategory;
  description: string;
  services: string[];
  location: string;
  matchScore: number;
  isVerified: boolean;
  expertise: string[];
  isFeatured?: boolean;
}

export type DirectorySort = "Best Match" | "Nearby" | "Top Rated" | "Recently Added";
