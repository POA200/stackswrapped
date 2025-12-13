"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { Sparkles } from "lucide-react";

interface NFTCardProps {
  data?: {
    totalNFTs: number;
    topNFTs?: Array<{
      name: string;
      collection: string;
      rarity?: number;
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

export function NFTCard({ data, navigationProps, progress }: NFTCardProps) {
  // Default data for placeholder/demo
  const nftData = data || {
    totalNFTs: 42,
    topNFTs: [
      { name: "Leo Cats #1234", collection: "Leo Cats", rarity: 98 },
      { name: "Giga pepe v2 #567", collection: "Giga pepe v2", rarity: 95 },
      { name: "NOT Punk #890", collection: "NOT Punks", rarity: 92 },
      { name: "Spagetti Punk #234", collection: "Spagetti Punks", rarity: 88 },
      { name: "Crash Punk #456", collection: "Crash Punks", rarity: 85 },
    ],
  };

  return (
    <CardFrame
      title="The Curator: NFT Edition"
      isDemo={!data}
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
            {nftData.totalNFTs} Total NFTs Acquired
          </p>
          <p className="text-sm text-muted-foreground">Your Top 5 NFTs:</p>
        </div>

        {/* Top 5 NFT List */}
        <div className="w-full max-w-md space-y-3">
          {nftData.topNFTs?.slice(0, 5).map((nft, index) => (
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
                <span className="text-2xl">🎨</span>
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

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center">
          Based on rarity and collection value
        </p>
      </div>
    </CardFrame>
  );
}
