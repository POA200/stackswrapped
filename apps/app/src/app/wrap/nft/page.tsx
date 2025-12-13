/**
 * FILE: apps/app/src/app/wrap/nft/page.tsx
 *
 * PURPOSE: A Server Component that retrieves the user's Stacks address from the URL, fetches the full wrapped data, and renders the existing NftCard client component.
 *
 * STACK CONTEXT:
 * - Must be a Next.js Server Component.
 * - Imports: NftCard from '@/data-display/NftCard', and routing utilities from '@/lib/constants'.
 * - Assumes the overall API response contains an NFT metric structure under `metrics`.
 */

import { NFTCard as NftCard } from "@/data-display/NFTCard";
import { getNavigationPaths, getProgress } from "@/lib/constants";

type NftMetric = {
  totalNFTs: number;
  topNFTs?: Array<{ name: string; collection: string; rarity?: number }>;
};

type WrappedApiResponse = {
  metrics?: {
    nft?: NftMetric;
    nftCount?: number;
    topNFTs?: Array<{ name: string; collection: string; rarity?: number }>;
  };
};

export default async function NftCardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const rawAddress = searchParams.address;
  const userAddress = Array.isArray(rawAddress) ? rawAddress[0] : rawAddress;

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

  const currentPath = "/wrap/nft";
  const { prevPath, nextPath } = getNavigationPaths(currentPath);
  const progress = getProgress(currentPath);

  let nftData: NftMetric | null = null;
  let error: string | null = null;

  try {
    const apiBase = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const apiUrl = new URL("/api/wrapped", apiBase);
    apiUrl.searchParams.set("address", userAddress);

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
    const metrics = data.metrics || {};
    const nftMetric = metrics.nft || {
      totalNFTs: metrics.nftCount || 0,
      topNFTs: metrics.topNFTs,
    };

    nftData = {
      totalNFTs: nftMetric.totalNFTs ?? 0,
      topNFTs: Array.isArray(nftMetric.topNFTs)
        ? nftMetric.topNFTs.slice(0, 5)
        : undefined,
    };
  } catch (err) {
    console.error("Error fetching NFT data:", err);
    error = err instanceof Error ? err.message : "Failed to fetch NFT data";
  }

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

  return (
    <NftCard
      address={userAddress}
      data={nftData || undefined}
      navigationProps={{
        showPrev: prevPath !== null,
        showNext: nextPath !== null,
      }}
      progress={progress}
    />
  );
}
