# Project Brief: Checkout Terminal (AI Context)
**Target: Development Assistant (ChatGPT/Claude)**
**Build Version**: V.5 (Mobile Terminal)

## 1. Project Essence
Checkout Terminal is a **high-authority business discovery OS**. It is NOT a social network; it is a result-oriented match engine for hyper-local MSMEs.

## 2. Technical Stack
- **Framework**: Next.js 14 (App Router, `"use client"` as needed).
- **Styling**: Tailwind CSS (Strict adherence to custom tokens).
- **Icons**: Lucide-React.
- **Deployment**: Cloudflare Pages / Wrangler.

## 3. Design System (Cinematic Authority)
- **Base Color**: `#292828` (Charcoal).
- **Accent**: `#E53935` (Power Red).
- **Typography**: `Outfit` (Headings), `Inter` (Body text).
- **Strict Formatting**: 
    - NO italics.
    - Zero `tracking` (letter-spacing) on body text.
    - `uppercase` and `font-black` for high-authority labels.
    - `selection:bg-[#E53935]/10` for custom highlighting.

## 4. Nomenclature (Simple English)
Never use jargon. Use direct, action-oriented English:
- `Explore` -> `Find`
- `Advisors` -> `Expert Help`
- `Consultation Fee` -> `Price`
- `Messages` -> `Chats`
- `Post` -> `Broadcast` / `Post`

## 5. Hub Logic (Functional Mapping)
- **Home Hub**: Social-business feed with matched opportunities.
- **People Hub**: Proximity-based matching engine.
- **Experts Hub**: "Expert Help" profile nodes with booking logic.
- **Market Hub**: B2B asset discovery (Lease/Wholesale).
- **Community Hub**: Industry nodes (e.g., "Technopark Logistics").

## 6. Hybrid Match Scoring
When generating logic for matching:
- **40% Semantic**: OpenAI Embeddings similarity.
- **35% Hard Skill**: Exact overlap of `skills_required` vs `user_skills`.
- **25% Proximity**: Physical distance + intent context.

## 7. Native Mobile Rules
- **Viewport**: Force `100svh`/`100dvh` for app-like behavior.
- **Interactions**: Disable tap-highlights, prevent over-scroll bounce, force portrait PWA mode.

**Use this context to generate code and UI components that fit the 'Checkout Build V.5' standard.**
