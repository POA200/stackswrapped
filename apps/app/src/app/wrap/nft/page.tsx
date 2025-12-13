/**
 * FILE: apps/app/src/app/wrap/nft/page.tsx
 *
 * PURPOSE: A Server Component that retrieves the user's Stacks address from the URL, fetches the full wrapped data, and renders the existing NFTCard client component.
 *
 * STACK CONTEXT:
 * - Next.js Server Component.
 * - Imports: NFTCard from the shared web components, and routing utilities from '/lib/constants.ts'.
 */

import { NFTCard } from "../../../../../../web/src/components/data-display/NFTCard";
import { getNavigationPaths, getProgress } from "../../../lib/constants";

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

export default async function NftCardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract the user's Stacks address from URL query parameters
  const userAddress = searchParams.address as string;

  // Validate that the address exists
  if (!userAddress || typeof userAddress !== "string") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Missing Address
          </h1>
          <p className="text-muted-foreground">
            No Stacks address provided. Please connect your wallet.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Get navigation paths and progress for the current page
  const currentPath = "/wrap/nft";
  const { prevPath, nextPath } = getNavigationPaths(currentPath);
  const progress = getProgress(currentPath);

  let nftData = null;
  let error = null;

  try {
    // Construct the full URL for the internal API endpoint
    const apiUrl = new URL(
      "/api/wrapped",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    );
    apiUrl.searchParams.set("address", userAddress);

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

    // Transform API response to NFT data format expected by NFTCard
    // TODO: When the API provides actual NFT details, map them here
    nftData = {
      totalNFTs: data.metrics.nftCount,
      topNFTs: [
        // Placeholder until API provides actual NFT details
        { name: "NFT #1", collection: "Collection", rarity: 98 },
        { name: "NFT #2", collection: "Collection", rarity: 95 },
        { name: "NFT #3", collection: "Collection", rarity: 92 },
        { name: "NFT #4", collection: "Collection", rarity: 88 },
        { name: "NFT #5", collection: "Collection", rarity: 85 },
      ],
    };
  } catch (err) {
    console.error("Error fetching NFT data:", err);
    error = err instanceof Error ? err.message : "Failed to fetch NFT data";
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

  // Render the NFTCard component with fetched data and navigation props
  return (
    <NFTCard
      data={nftData || undefined}
      navigationProps={{
        showPrev: prevPath !== null,
        showNext: nextPath !== null,
      }}
      progress={progress}
    />
  );
}
