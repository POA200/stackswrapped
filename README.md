# 🚀 Stacks Wrapped Monorepo 🌟

## Project Overview

Stacks Wrapped is a community project designed to deliver personalized year-end summaries for Stacks ecosystem users. It analyzes on-chain activity, including transaction volume, NFT holdings, and staking longevity, to generate a unique "Wrapped" experience and award users with a prestigious Stacks Title Badge.

This repository uses a modern Next.js Monorepo architecture to separate frontend presentation (`web`), backend logic (`packages`), and core application features (`apps`).

---

## 🏗️ Architecture

This project is structured as a Monorepo managed primarily by npm/yarn workspaces, separating the concerns into three main areas:

| Directory                | Purpose                                                                                                                                                                                                       | Technology                    | Deployment               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------ |
| `/web`                   | Frontend Application. The main Next.js app, containing all UI components, pages, and API routes (`/api/wrapped`, `/api/bns-lookup`). This is the single deployed application.                                 | Next.js, React, TypeScript    | Vercel (Root)            |
| `/apps/app`              | Core Components (Legacy/Shared). Contains shared components and utilities that were consolidated into `/web` for simplified Vercel deployment. (Note: These files were merged into `/web`'s `src` directory.) | React, TypeScript             | Consolidated into `/web` |
| `/packages/data-service` | Backend Logic. Contains all critical business logic for data retrieval, processing, and classification. Includes pagination fixes and the Title Classifier.                                                   | TypeScript, Stacks API (Hiro) | Consolidated into `/web` |

---

## ⚙️ Local Development Setup

To get the Stacks Wrapped application running locally, follow these steps:

### 1. Prerequisites

You must have Node.js (v18+) and your preferred package manager (npm or yarn) installed.

### 2. Clone the Repository

```bash
git clone https://github.com/YourUsername/stackswrapped.git
cd stackswrapped
```

---

## 🚧 Features and Fixes

- BNS integration
- NFTs and Tokens logo
- Accurate top 5 tokens of 2025 and top token
- Final badge details fix (volume, whale)

---

## 🕒 To Be Implemented Later

### 3. Install Dependencies

Install packages across the entire monorepo:

```bash
npm install # or yarn install
```

### 4. API Key Configuration

The application requires an API key from the Hiro Platform to access the Stacks Extended API without encountering 403 Forbidden errors.

1. Obtain a free key from the [Hiro Platform].
2. Create a file named `.env.local` inside the `/web` directory.
3. Add your API key:

```bash
# /web/.env.local
HIRO_API_KEY="YOUR_SECRET_API_KEY_HERE"
```

Note: This variable is used by the serverless functions (e.g., in `/api/wrapped`) to make server-to-server requests.

### 5. Run the Application

Start the Next.js development server from the root of the project:

```bash
npm run dev # or yarn dev
```

The application will be accessible at http://localhost:3000.

---

## 💡 Key Technical Solutions

The development of this project required overcoming several common Monorepo and Stacks API challenges:

- **Vercel Monorepo Deployment:** The core application logic from `/packages` and `/apps` was consolidated directly into the `/web` directory's `src` folder to ensure all dependencies were available during the Vercel build process.
- **CORS Policy Resolution (403/Blocked):** All external API calls (Volume data, BNS lookup, NFT assets) were moved from client components to internal Next.js API Routes (e.g., `/api/bns-lookup`), enforcing a server-side proxy to bypass browser-based CORS restrictions.
- **Pagination Accuracy (Zero Data Fix):** The data service functions (`fetchVolumeStats`, `fetchFullNftHoldings`) were refactored to implement a robust while loop pagination, ensuring all pages of transactions and assets were scanned. This solved the "0 Transactions" bug caused by recent activity being buried past the initial 200-item page limit.
- **Title Classification Logic:** A clear priority system was implemented in `title-classifier.ts` to award the single most prestigious badge (Whale Trader > DeFi Guru > HODL Hero > Elite Collector) when a user qualifies for multiple achievements.

---

## 🏆 Title Badge Criteria

The application awards the user the highest qualifying title based on the following criteria (priority is descending):

| Priority (High → Low) | Title           | Award Criteria                                                                          | Badge Asset         |
| --------------------- | --------------- | --------------------------------------------------------------------------------------- | ------------------- |
| 1 (Highest)           | Whale Trader    | Total number of transactions is a minimum of 1,200.                                     | whale_trader.svg    |
| 2                     | DeFi Guru       | Total number of interactions with DeFi contracts exceeds 300.                           | defi_guru.svg       |
| 3                     | HODL Hero       | Continuous hold period for ALL of the user's top 5 tokens is longer than 300 days each. | hodl_hero.svg       |
| 4                     | Elite Collector | Owns NFTs across 10 or more distinct collections.                                       | elite_collector.svg |

The corresponding SVG badge files are located in the `/public` folder and loaded by the frontend based on the `badgeSvg` path returned by the backend.
