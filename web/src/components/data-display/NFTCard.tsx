"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { Sparkles, Gem } from "lucide-react";

interface NFTCardProps {
  address?: string;
  data?: {
    totalNFTs: number;
    topNFTs?: Array<{
      name: string;
      collection: string;
      rarity?: number;
      image?: string;
    }>;
  };
  navigationProps?: {
    showPrev?: boolean;
    showNext?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
    onDisconnect?: () => void;
  };
  progress?: { current: number; total: number };
}

export function NFTCard({
  address,
  data,
  navigationProps,
  progress,
}: NFTCardProps) {
  // Show loading state if no data yet
  if (!data) {
    return (
      <CardFrame
        title="The Curator: NFT Edition"
        address={address}
        showPrev={navigationProps?.showPrev}
        showNext={navigationProps?.showNext}
        onPrev={navigationProps?.onPrev}
        onNext={navigationProps?.onNext}
        onDisconnect={navigationProps?.onDisconnect}
        currentStep={progress?.current}
        totalSteps={progress?.total}
      >
        <div className="w-full h-full flex items-center justify-center px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground text-center">
              Loading your NFT collection...
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  // Filter NFTs: only rarest per collection, and only those received in 2025
  let filteredNFTs: typeof data.topNFTs = [];
  if (data.topNFTs && data.topNFTs.length > 0) {
    // Group by collection, keep rarest (lowest rarity value)
    const collectionMap = new Map<string, (typeof data.topNFTs)[0]>();
    data.topNFTs.forEach((nft) => {
      const key = nft.collection;
      if (
        !collectionMap.has(key) ||
        (typeof nft.rarity === "number" &&
          nft.rarity < (collectionMap.get(key)?.rarity ?? Infinity))
      ) {
        collectionMap.set(key, nft);
      }
    });
    filteredNFTs = Array.from(collectionMap.values());
    // Sort by rarity ascending (rarest first)
    filteredNFTs.sort(
      (a, b) => (a.rarity ?? Infinity) - (b.rarity ?? Infinity)
    );
  }

  return (
    <CardFrame
      title="The Curator: NFT Edition"
      address={address}
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
      onDisconnect={navigationProps?.onDisconnect}
      currentStep={progress?.current}
      totalSteps={progress?.total}
    >
      <div className="w-full h-full flex flex-col items-center justify-center px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            The Curator: NFT Edition
          </h2>
          <p className="text-lg font-semibold text-orange-500">
            {data.totalNFTs} Total NFT{data.totalNFTs !== 1 ? "s" : ""} Acquired
          </p>
          {filteredNFTs && filteredNFTs.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Your Top Rarest NFTs (1 per collection):
            </p>
          )}
        </div>

        {/* Filtered NFT List */}
        {filteredNFTs && filteredNFTs.length > 0 ? (
          <div className="w-full max-w-md space-y-3">
            {filteredNFTs.slice(0, 5).map((nft, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex-shrink-0">
                  <span className="text-lg font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-primary/30 flex-shrink-0">
                  <Gem className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {nft.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {nft.collection}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-md text-center py-8">
            <p className="text-muted-foreground">
              No NFTs found in this wallet
            </p>
          </div>
        )}

        {/* Footer note */}
        {filteredNFTs && filteredNFTs.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Based on rarity and collection value (1 per collection)
          </p>
        )}
      </div>
    </CardFrame>
  );
}
