/**
 * FILE: web/src/components/data-display/NFTCard.tsx
 *
 * PURPOSE: Implements the "Your NFT Collections" data card content.
 *
 * STACK CONTEXT:
 * - Client Component.
 * - Imports: CardFrame from '@/components/data-display/CardFrame'.
 * - Data: Assumes props receive data containing NFT counts and rarity information.
 * - Aesthetic: Highlights NFT holdings and their rarity distribution.
 *
 * PROPS:
 * - data: { totalNFTs: number, rareNFTs: number, collections: array }
 * - navigationProps: { showPrev: boolean, showNext: boolean, onPrev: () => void, onNext: () => void }
 */

"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface NFTCardProps {
  data?: {
    totalNFTs: number;
    rareNFTs: number;
    collections?: Array<{
      name: string;
      count: number;
      rarity: "common" | "rare" | "legendary";
    }>;
  };
  navigationProps?: {
    showPrev?: boolean;
    showNext?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
    onDisconnect?: () => void;
  };
}

export function NFTCard({ data, navigationProps }: NFTCardProps) {
  // Default data for placeholder/demo
  const nftData = data || {
    totalNFTs: 42,
    rareNFTs: 7,
    collections: [
      { name: "Alex Collections", count: 15, rarity: "common" },
      { name: "Stacked NFTs", count: 18, rarity: "rare" },
      { name: "Bitcoin Badges", count: 9, rarity: "legendary" },
    ],
  };

  const rarityColors = {
    common: "bg-blue-500/50",
    rare: "bg-purple-500/50",
    legendary: "bg-orange-500/50",
  };

  return (
    <CardFrame
      title="Your NFT Collections"
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
      onDisconnect={navigationProps?.onDisconnect}
    >
      <div className="w-full flex flex-col items-center justify-center space-y-6">
        {/* Headline */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Zap className="w-6 h-6" />
            Digital Artifacts Collected
          </h2>
          <p className="text-sm text-muted-foreground">
            Your NFT holdings across Stacks
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <Card className="p-4 text-center bg-card/50 border border-primary/20">
            <div className="text-4xl font-bold text-primary">
              {nftData.totalNFTs}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total NFTs</p>
          </Card>
          <Card className="p-4 text-center bg-card/50 border border-primary/20">
            <div className="text-4xl font-bold text-orange-500">
              {nftData.rareNFTs}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Rare/Legendary</p>
          </Card>
        </div>

        {/* Collections List */}
        <Card className="w-full p-4 bg-card/50 border border-primary/20 space-y-3">
          {nftData.collections?.map((collection, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-3 h-3 rounded-full ${
                    rarityColors[collection.rarity]
                  }`}
                />
                <span className="text-sm font-medium text-foreground">
                  {collection.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {collection.count}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </CardFrame>
  );
}
