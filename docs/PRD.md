# CheckOut OS: Product Requirements Document (PRD)
**Status:** Active / Production Ready
**Last Updated:** 2026-05-02

## 1. Product Vision
CheckOut OS is a premium, high-fidelity Business Operating System designed for local commerce and professional networks. It moves beyond simple "social networking" by focusing on **outcome-driven interactions**, **verified matching**, and **strategic collaboration**.

## 2. Core Design Principles
*   **Editorial Excellence:** UI should feel like a premium magazine—bold typography, intentional whitespace, and high-contrast aesthetics.
*   **Zero-Data Integrity:** No hardcoded dummy data. Every user, post, and score must originate from the database.
*   **Scannability:** Information must be scannable in under 3 seconds. Use "One Word Per Concept" nomenclature.
*   **Tactile Feedback:** Every action (click, hover, post) must have a subtle, premium micro-animation or transition.

## 3. Functional Pillars

### A. Discovery Stream (Home Feed)
*   **Purpose:** A real-time, AI-ranked feed of network activity.
*   **Key Features:** Smart filters (Requirements, Partners, Meetups), success probability indicators, and instant engagement CTAs.

### B. Network Hub (Matches)
*   **Purpose:** Algorithmic connection discovery.
*   **Logic:** Matches users based on skill overlap, industry focus, and proximity.
*   **UI:** High-impact Match Cards with percentage scores.

### C. Marketplace
*   **Purpose:** High-intent transaction and partnership layer.
*   **Categories:** Requirements (Hiring/Leads) and Partnerships (Strategic).
*   **Constraint:** Must display real countdowns and participant counts derived from DB.

### D. Advisor Network
*   **Purpose:** Direct access to verified experts.
*   **Feature:** Trusted scores, helpfulness ratings, and direct session booking.

### E. Unified Chat
*   **Purpose:** The conversion layer for all interactions.
*   **Features:** Real-time messaging, group session rooms, and attachment support.

## 4. Technical Standards
*   **Stack:** Next.js (App Router), Supabase (Auth/DB/Realtime), Framer Motion (Animations), Lucide (Icons).
*   **Auth:** Centralized on root page. Zero-tolerance for redirect loops.
*   **State:** Use `useAuth` as the master state machine. No redundant local storage for auth state.
*   **Code Health:** No dead code, no redundant layouts, and no "dummy" files in `src/`.

## 5. Implementation Protocol (Rules to Follow)
1.  **Always Check DB First:** Before adding a feature, verify if the schema supports it. Never hardcode return values.
2.  **Mobile First:** Ensure every UI works perfectly on mobile safe areas.
3.  **Analytics Driven:** Every major action must be tracked via the `AnalyticsEngine`.
4.  **Premium Aesthetics:** Never use default browser colors or standard blue links. Use the HSL-tailored red (`#E53935`) and high-contrast blacks.

## 6. Current Roadmap
1.  **Phase 1 (Complete):** Data Sanitization & Code Cleanup.
2.  **Phase 2 (Current):** Stability & Onboarding hardening.
3.  **Phase 3 (Next):** AWS Chat Integration & Match-Engine v2.0 enhancements.
4.  **Phase 4:** Production Scaling & Performance Optimization.

## 7. Mandatory Development Workflow (Safe-Sync)
To ensure a non-breaking production environment, all contributors must follow the **Dev-First Protocol**:
1.  **SQL Synchronization:** Any change to the database schema must be applied to the `checkout-dev` project first.
2.  **Local Isolation:** The `.env.local` file must strictly point to the Dev Sandbox and must NEVER be committed to Git.
3.  **Production Gatekeeping:** Only run "Foundation" scripts in Production. NEVER run "Reset" or "Truncate" scripts in the live environment.

## 8. Zero-Data Experience (Founding Member Standard)
The platform must never feel "empty." In the absence of user-generated content:
*   **Founding Member UI:** Show the premium "Founding Node Detected" experience.
*   **Call to Leadership:** Use exclusive language (e.g., "Activate the Network") instead of generic actions.
*   **Zero Placeholders:** Never use dummy data. If no real data exists, use the Founding Member standard.

