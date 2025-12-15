# 🚀 Stacks Wrapped Monorepo 🌟

## Project Overview

Stacks Wrapped is a community project designed to deliver personalized year-end summaries for Stacks ecosystem users. It analyzes on-chain activity, including transaction volume, NFT holdings, and staking longevity, to generate a unique "Wrapped" experience and award users with a prestigious Stacks Title Badge.

This repository is organized into two main folders:

- `/web`: The Next.js app containing all UI, API routes, and business logic (React, TypeScript, serverless functions, and data services).
- `/contract`: Clarity smart contracts and related tests for the Stacks blockchain.

---

## 🏗️ Architecture

## 🏗️ Folder Structure

| Directory   | Purpose                                                         | Technology                 |
| ----------- | --------------------------------------------------------------- | -------------------------- |
| `/web`      | Next.js app: UI, API routes, business logic, and data services. | Next.js, React, TypeScript |
| `/contract` | Clarity smart contracts and tests for Stacks blockchain.        | Clarity, Clarinet          |

---

## ⚙️ Local Development Setup

To get the Stacks Wrapped platform running locally, follow these steps:

### 1. Prerequisites

You must have Node.js (v18+) and your preferred package manager (npm or yarn) installed.

git clone https://github.com/YourUsername/stackswrapped.git

### 2. Clone the Repository

```bash
git clone https://github.com/POA200/stackswrapped.git
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

Install dependencies for the web app:

```bash
cd web
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

Start the Next.js development server from the `/web` directory:

```bash
npm run dev # or yarn dev
```

The application will be accessible at http://localhost:3000.

---

## 💡 Key Technical Solutions

Key technical solutions include:

- **All-in-one Next.js App:** All frontend, backend, and data logic are consolidated in `/web` for easy deployment and maintenance.
- **CORS Policy Resolution (403/Blocked):** All external API calls (Volume data, BNS lookup, NFT assets) are handled by internal Next.js API Routes (e.g., `/api/bns-lookup`), enforcing a server-side proxy to bypass browser-based CORS restrictions.
- **Pagination Accuracy (Zero Data Fix):** The data service functions (`fetchVolumeStats`, `fetchFullNftHoldings`) use robust pagination to ensure all transactions and assets are scanned, solving the "0 Transactions" bug.
- **Title Classification Logic:** A clear priority system in `title-classifier.ts` awards the single most prestigious badge (Whale Trader > DeFi Guru > HODL Hero > Elite Collector) when a user qualifies for multiple achievements.

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
