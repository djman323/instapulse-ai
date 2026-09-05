# InstaPulse AI ⚡
### Production-Ready Instagram Intelligence & Viral Content Recommendation Engine

[![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Meta Graph API](https://img.shields.io/badge/Meta%20Graph%20API-v19.0-0866FF?logo=meta)](https://developers.facebook.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Cloud%20AI-4285F4?logo=google)](https://aistudio.google.com/)

**InstaPulse AI** is a commercial-grade, full-stack SaaS platform that connects directly to Instagram via the official **Meta Graph API**, analyzes creator performance history and engagement patterns, and deploys **Cloud AI (Google Gemini)** to recommend viral content concepts, 3-second opening hooks, scene-by-scene scripts, and 3-tiered hashtag clusters.

---

## 🌟 Key Features

### 1. Dual Authentication Engine (Production Meta OAuth + Instant Demo)
- **Official Meta OAuth 2.0 Flow**: Secure user login with authorization code exchange and 60-day long-lived access token generation.
- **Instant Sandbox / 1-Click Demo Profiles**: Test and pitch the platform immediately across 4 distinct niches (Tech/AI, Fitness/Longevity, Menswear Fashion, Food & Travel) without needing an approved Meta App first.

### 2. Algorithmic Gap Analysis & KPI Auditing
- **Save-to-Reach Ratio**: Computes the #1 algorithmic ranking signal used by the Instagram Explore & Reels recommendation engine.
- **Format Breakdown**: Compares average engagement across Reels, Carousels, and Static Photos to identify the creator's top distribution vehicle.
- **Best Posting Windows**: Analyzes historical engagement to generate optimal day and hour posting heatmaps.

### 3. "What You Should Create Next" (Viral Content Playbook)
- Analyzes the creator's detected category and delivers **ready-to-produce viral concepts**.
- For each concept:
  - **The 3-Second Hook**: Visual, spoken, and on-screen text directions.
  - **Storyboard & Script**: Timed phases (`HOOK`, `PROBLEM`, `VALUE_DELIVERY`, `CALL_TO_ACTION`).
  - **Why It's Trending**: Algorithmic driver and audience psychology breakdown.
  - **Viral Score (0-100)** and expected reach multiplier.
  - **1-Click Copy**: Copy caption or entire production script with confetti feedback.

### 4. Smart 3-Tiered Hashtag & Search SEO Studio
- Generates categorized hashtag clusters designed for Instagram's recommendation and SEO indexing algorithms:
  - **Tier 1 (High Reach Broad)**: 500k+ volume tags for macro explore discovery.
  - **Tier 2 (Niche Targeted)**: 50k - 500k volume tags for top 9 rank potential.
  - **Tier 3 (High-Intent Community)**: < 50k volume tags for conversion and search.

### 5. Custom Topic AI Idea Generator
- Creators can input any upcoming campaign topic (e.g., *"3 tools for designers"*, *"How I fixed my lower back pain"*) and receive instant custom hooks and outlines.

### 6. Client Presentation & Strategy Deck Export
- 1-click formatted strategy report generation with print-to-PDF support for agencies and consultants to deliver to clients.

### 7. Built-in Commercial Pricing Matrix
- Ready-to-monetize tier structure ($29/mo Creator, $79/mo Pro Growth, $199/mo Agency).

---

## 🏗️ Architecture & Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Edge/Node Route Handlers, TypeScript).
- **Styling**: [shadcn/ui](https://ui.shadcn.com/) with Tailwind CSS, Radix UI primitives, dark zinc aesthetic, and Inter typography.
- **Runtime & Package Manager**: [Bun](https://bun.sh/) (Fast native execution).
- **APIs**:
  - **Meta Graph API v19.0**: Endpoint queries for `me/accounts`, `instagram_business_account`, user profiles, and media insights.
  - **Google Gemini Cloud API**: Powered by `@google/generative-ai` (`gemini-1.5-flash` with structured JSON output schema).
- **State & Sessions**: Secure HTTP-only cookies with base64 serialization and expiry handling.

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies (with Bun)
```bash
git clone https://github.com/your-repo/ai-insta-analytics.git
cd ai-insta-analytics
bun install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=your_random_secret_here

# Cloud AI (Google Gemini) - https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Meta Graph API - https://developers.facebook.com/
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_REDIRECT_URI=http://localhost:3000/api/auth/meta/callback
```
*(Note: If you don't have a Meta App ID or Gemini API key right away, the application runs automatically in high-precision Sandbox Mode with 4 pre-loaded creator niches!)*

### 3. Run Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
bun run build
bun start
```

---

## 📖 Connecting Live Meta / Instagram Accounts
To configure your Meta Developer App and request the required permissions (`instagram_basic`, `instagram_manage_insights`, `pages_show_list`), follow the step-by-step instructions in [META_APP_SETUP.md](./META_APP_SETUP.md).

---

## 🔒 Security & Best Practices
- **No Local Heavy AI Dependencies**: Strict compliance with cloud-only LLMs ensures fast response times, zero GPU bloat, and low server costs.
- **Secure Token Storage**: Meta tokens and session payloads are held in secure, encrypted HTTP-only cookies.
- **Long-Lived Tokens**: Automatically exchanges short-lived 1-hour tokens for 60-day refreshable long-lived user tokens.
