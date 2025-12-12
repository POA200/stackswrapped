/**
 * FILE: apps/app/src/app/wrap/volume/page.tsx
 *
 * PURPOSE: A Server Component that fetches the required metrics for the Volume Card and renders the client component.
 *
 * STACK CONTEXT:
 * - Next.js Server Component.
 * - Imports: VolumeCard from the shared web components, and the GET function from the '/api/wrapped' route.
 */

import { VolumeCard } from "@/components/data-display/VolumeCard";

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
  };
  raw: {
    transactionsCount: number;
    nftHoldingsCount: number;
    ftBalancesCount: number;
  };
}

export default async function VolumeCardPage() {
  // Hardcoded test address for development/testing
  const testAddress = "SP000000000000000000002Q6V5D";

  let volumeData = null;
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

    // Transform API response to VolumeStats format expected by VolumeCard
    volumeData = {
      totalTransactions: data.metrics.totalTransactions,
      busiestMonth: data.metrics.busiestMonth || "N/A",
      firstTransactionDate: data.metrics.firstTxDate || "Unknown",
      monthlyData: [], // TODO: This should be computed from transaction history in the API
    };
  } catch (err) {
    console.error("Error fetching volume data:", err);
    error = err instanceof Error ? err.message : "Failed to fetch volume data";
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

  // Render the VolumeCard component with fetched data and navigation props
  return (
    <VolumeCard
      address={testAddress}
      data={volumeData}
      navigationProps={{
        showPrev: false,
        showNext: true,
      }}
      progress={{
        current: 1,
        total: 8, // Assuming 8 total cards in the wrapped experience
      }}
    />
  );
}
