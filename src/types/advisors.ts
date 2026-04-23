export interface Advisor {
  id: string;
  name: string;
  role: string;
  industry: string;
  experience: string;
  expertise: string[];
  avatar: string;
  matchScore: number;
  bestFor: string;
  bio: string;
  highlights: string[];
  focus: string[];
  availability: string;
}

export type RequestStatus = "Pending" | "Accepted" | "Declined";

export interface AdviceRequest {
  id: string;
  advisorId: string;
  userId: string;
  topic: string;
  description: string;
  status: RequestStatus;
  timestamp: string;
}
