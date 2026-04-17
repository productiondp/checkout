# Product Requirements Document (PRD): Checkout Terminal
**Version**: Build V.5 | **Status**: Checkpoint 5 Certified (Production Ready UI)

## 1. Executive Summary
**Checkout Terminal** is a hyper-local, result-oriented business discovery platform designed to eliminate social noise and maximize networking efficiency. Unlike traditional social networks, Checkout uses a proprietary **Hybrid Match Engine** to connect entrepreneurs, creators, and service providers based on intent, skills, and proximity.

**Core Vision**: "Stop Networking. Start Building." - Transforming the city into a functional, interlinked business terminal.

---

## 2. Target Audience
1.  **Local Entrepreneurs & Startups**: Seeking partners, clients, and supply chain deals.
2.  **Freelancers & Creators**: Looking for high-authority local projects and expert help.
3.  **B2B Service Providers**: Logistics, legal, and IT agencies connecting with MSMEs.
4.  **Community Builders**: Organizing hyper-local meetups and events.

---

## 3. Product Principles
-   **Simple English**: No corporate jargon. Every label is an action (e.g., "Find" instead of "Explore").
-   **Cinematic Authority**: A premium Charcoal (#292828) design system that feels like professional equipment, not a toy.
-   **Result Over Feed**: The UI prioritizes "Matches" and "Deals" over infinite social scrolling.
-   **Mobile-First Terminal**: Designed to load as a standalone PWA with native-feeling viewport and controls.

---

## 4. Key Functional Features

### 4.1 Hybrid Match Engine (Backend Node)
-   **Semantic Search**: Uses OpenAI `text-embedding-3-small` to understand user intent beyond keywords.
-   **Hybrid Scoring Model**:
    -   **40% Vector Similarity**: Semantic relevance and "vibes".
    -   **35% Skill Overlap**: Hard verification of capabilities (30% minimum for feature visibility).
    -   **25% Context/Location**: Proximity to the "Trivandrum Hub" and intent status.

### 4.2 The Broadcast (Broadcast Engine)
-   **The Post**: A high-impact update system centered on actionable business outcomes (Deals, Jobs, Partnerships).
-   **Intelligent Routing**: Posts are matched to relevant users based on their "Checkout Rank" and profile skills.
-   **Center Action**: Accessible via the "Plus" button on mobile, optimized for instant sharing.

### 4.3 Identity & Rank (Checkout Rank)
-   **Global Rank**: A meritocratic visibility score based on verification status and platform engagement.
-   **Verified Identity**: "Simple English" status markers (e.g., "Verified Startup Owner").

### 4.4 The Hubs (Sub-Terminals)
-   **Marketplace**: Lease, lease, and trade hub for business assets (Electronics, Logistics, IT).
-   **Events & Meetups**: Discovery and booking engine for professional gatherings.
-   **Experts (Advisors)**: High-authority network for "Expert Help" with integrated "Price/Book" logic.
-   **Community**: Group-based nodes (e.g., "Technopark Logistics Node") for industry-wide collaboration.

---

## 5. UI/UX Specifications

### 5.1 Design System: Cinematic Grey
-   **Primary Color**: `#292828` (Charcoal Base).
-   **Accent Color**: `#E53935` (Authority Red).
-   **Typography**: `Outfit` (Headings), `Inter` (Body). zero italics, zero character tracking for maximal clarity.

### 5.2 Mobile Terminal Layout
-   **Sticky Global Header**: Quick access to Search, Notifications, and Profile.
-   **Bottom Navigation**: One-handed access to Home, People, Post (Center), Chats, and Identity.
-   **Hamburger Drawer**: Expansive menu for categorized hubs and system settings.

---

## 6. Technical Stack
-   **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS.
-   **Infrastructure**: Cloudflare Pages (Git Integration), Wrangler/OpenNext.
-   **AI Layer**: OpenAI (Embeddings & Semantic Match).
-   **Payment Engine**: Razorpay (Consultation Hub).
-   **Data Consistency**: Lucide-React for standardized authoritative iconography.

---

## 7. Roadmap (Coming in V.6+)
1.  **Live Database Integration**: Transition from `dummyData.ts` to persistent Supabase/PostgreSQL.
2.  **Auth Modal Gate**: Implement full clerk/auth flow for identity protection.
3.  **Real-Time Chats**: Activate WebSocket/Edge-based messaging for matched users.
4.  **Checkout Rank API**: Dynamic calculation of user authority based on actual marketplace transactions and successful match outcomes.

**Authorized PRD for Checkout Terminal Build V.5.**
