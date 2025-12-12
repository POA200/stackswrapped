/**
 * FILE: apps/app/src/app/wrap/badge/page.tsx
 *
 * PURPOSE: A Server Component that fetches the entire set of wrapped metrics (including the final classification/badge) and renders the FinalBadgeCard client component.
 *
 * STACK CONTEXT:
 * - Next.js Server Component.
 * - Imports: FinalBadgeCard from the shared web components, and the GET function from the '/api/wrapped' route.
 * - Logic: This page assumes the fetched data contains the final badge title, classification text, and summary stats.
 */

import { FinalBadgeCard } from "@/components/data-display/FinalBadgeCard";

// Type definition for the API response
interface WrappedApiResponse {
  address: string;
  metrics: {
    totalTransactions: number;
    firstTxDate: string | null;
    busiestMonth: string | null;
    longestHoldDays: number;
    volumeUSD: number;
    nftCount: number;
    topToken: string;
  };
  badge: {
    title: string;
    summary?: string; // Classification summary text
  };
  raw: {
    transactionsCount: number;
    nftHoldingsCount: number;
    ftBalancesCount: number;
  };
}

export default async function FinalBadgeCardPage() {
  // Hardcoded test address for development/testing (same as Volume Card)
  const testAddress = "SP000000000000000000002Q6V5D";

  let badgeData = null;
  let error = null;

  try {
    // Construct the full URL for the internal API endpoint
    const apiUrl = new URL(
      "/api/wrapped",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    );
    apiUrl.searchParams.set("address", testAddress);

    // Fetch data from the internal API endpoint using Node.js fetch
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: WrappedApiResponse = await response.json();

    // Transform API response to match FinalBadgeCard data structure
    badgeData = {
      badgeTitle: data.badge.title || "The Stacker",
      badgeIconSrc: "/StacherBadge.svg", // TODO: Map badge title to dynamic icon URL
      classificationSummary:
        data.badge.summary ||
        "You earned this badge by consistently building and stacking on the Stacks blockchain. Your dedication to the ecosystem makes you a true believer.",
      volume: data.metrics.volumeUSD,
      nftCount: data.metrics.nftCount,
      topToken: data.metrics.topToken,
      tokenHeldDays: data.metrics.longestHoldDays,
    };
  } catch (err) {
    console.error("Error fetching badge data:", err);
    error = err instanceof Error ? err.message : "Failed to fetch badge data";
  }

  // Error UI fallback
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Error Loading Data
          </h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Render the FinalBadgeCard component with fetched data and navigation props
  return (
    <FinalBadgeCard
      data={badgeData}
      navigationProps={{
        showPrev: true,
        showNext: false,
      }}
      progress={{
        current: 8,
        total: 8,
      }}
    />
  );
}
