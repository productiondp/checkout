export type EventTab = "Upcoming" | "Ongoing" | "Past";

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
  tags: string[];
  banner: string;
  matchScore: number;
  status: EventTab;
  isFeatured?: boolean;
  organizer: string;
  agenda?: string[];
}
