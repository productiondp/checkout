# Product Requirements Document (PRD): Checkout Home Feed

## 1. Vision & Objectives
The **Checkout Home Feed** is the primary "Business OS" interface for the platform. It serves as the central hub for hyperlocal discovery, strategic networking, and real-time business opportunity tracking.

### Core Objectives:
- **Hyperlocal High-Fidelity Feed**: Provide a stream of verified business leads, hiring mandates, and social updates.
- **Venue Intelligence Integration**: Maintain a constant visual connection to the physical layout (Map) of the business node.
- **Strategic Networking**: Use AI-driven metadata to facilitate high-alignment business meetings rather than generic social interactions.

---

## 2. Core Modules & Functionality

### 2.1 The Business Terminal (Main Feed)
- **Content Types**:
    - **Business Leads**: Project requirements, procurement needs, and supply chain updates.
    - **Professional Milestones**: High-impact company or individual achievements.
    - **Real-time Queries**: "Looking for [X] in [Y] zone."
- **Interaction Logic**:
    - Cards must highlight **Domain Metadata** (Industry, Valuation, Urgency).
    - Engagement should prioritize **Expertise-based replies** over generic likes.
    - Infinite scroll or semantic pagination based on "Relevance Score."

### 2.2 Venue Intelligence (Map Integration)
- **Visual Sidebar**: A real-time rendering of the current city hub node.
- **Node Visualization**:
    - **Active Meetings**: Indicated by pulsing green nodes.
    - **Lead Density**: Red nodes indicating concentrated business opportunities.
    - **High-Traffic Hubs**: Heatmapping for venue occupancy.
- **Interaction**: Clicking the map sidebar transitions the user to the full-screen `Explore` (LiveMap) view.

### 2.3 Strategic Sidebar (The Intelligence Rail)
- **Match Alerts**: Real-time notification of "High Structural Matches" (people the user should meet NOW).
- **Domain Trends**: Semantic tags currently trending within the node (e.g., #SupplyChainAudit, #SeriesA_Logistics).
- **Node Status**: Display of current city occupancy and top "Expert Nodes" live.

---

## 3. Design & Aesthetic Standards (The "Checkout" Look)
All future changes must adhere to these rigorous standards:
- **Typography**: Primary font is **Inter** (sans-serif). Display headers use **Outfit**.
- **Color Palette**: 
    - Secondary/Action: `#E53935` (Checkout Red).
    - Primary/Dark: `#292828` (Charcoal Black).
    - Surface: White with `#FDFDFF` backgrounds.
- **Grid & Spacing**: Strict 8pt grid logic. 
- **Style**: Neo-brutalist refined (clean borders, high contrast, prominent metadata badges).

---

## 4. Technical Constraints
- **Framework**: Next.js (App Router).
- **State Management**: React `useState` for local UI, global context for active sessions.
- **Rendering**: Heavy use of Glassmorphism and Backdrop Blur (`backdrop-blur-xl`) for premium feel.
- **Performance**: Zero-lag transitions between feed items and map previews.

---

## 5. Upcoming Advanced Logic (AI RoadMap)
Future iterations based on this PRD should include:
- **AI Feed Prioritization**: Reordering the feed based on the user's "Execution Goals."
- **NLP Sentiment Overlay**: Analysis of lead quality directly on the card.
- **Dynamic Capacity Tracking**: Real-time occupancy data fetched from venue IoT sensors.

---

## 6. Definition of Done
A Home Feed update is considered complete only if:
1. It maintains the "Standard Fonts" (Inter/Outfit).
2. It correctly clears the `MobileNav` footer.
3. It integrates with the `GlobalHeader` and `DesktopSidebar`.
4. Metadata tags are clearly legible and industry-categorized.
