"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { Card } from "@/components/ui/card";
import {
  Crown,
  TrendingUp,
  Gem,
  Clock,
  Network,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface FinalBadgeCardProps {
  address?: string;
  data?: {
    badgeTitle?: string;
    badgeIconSrc?: string; // dynamic icon per user
    volume?: number;
    nftCount?: number;
    topToken?: string;
    tokenHeldDays?: number;
    topProtocol?: string;
    largestTransaction?: number;
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

export function FinalBadgeCard({
  address,
  data,
  navigationProps,
  progress,
}: FinalBadgeCardProps) {
  // Default data for placeholder/demo
  const summaryData = data || {
    badgeTitle: "The HODL Hero",
    badgeIconSrc: "/HodlHeroBadge.svg",
    volume: 50000,
    nftCount: 12,
    topToken: "STX",
    tokenHeldDays: 712,
    topProtocol: "BITFLOW",
    largestTransaction: 5000,
  };

  return (
    <CardFrame
      title="Your 2025 Wrapped Summary"
      badgeTitle={summaryData.badgeTitle}
      address={address}
      isDemo={!data}
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
      onDisconnect={navigationProps?.onDisconnect}
      currentStep={progress?.current}
      totalSteps={progress?.total}
    >
      <div className="w-full flex flex-col items-center justify-center space-y-6 px-4 py-4">
        {/* Headline */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Crown className="w-6 h-6" />
            Your 2025 Year in Review
          </h2>
          <p className="text-sm text-foreground">Stacks Wrapped Compilation</p>
        </div>

        {/* Badge Section */}
        <div className="flex flex-col items-center justify-center space-y-2 w-full">
          <Image
            src={summaryData.badgeIconSrc || "/HodlHeroBadge.svg"}
            alt="Badge"
            width={160}
            height={160}
            className="w-40 h-40 drop-shadow-lg"
          />
          <h3 className="text-xl font-regular text-center text-orange-500">
            {summaryData.badgeTitle}
          </h3>
        </div>

        {/* Statistics Grid */}
        <Card className="w-full p-4 bg-card/50 border border-primary/20">
          <div className="grid grid-cols-3 gap-3">
            {/* Trading Volume */}
            <div className="p-3 bg-background/50 rounded border border-primary/10 text-center space-y-2">
              <TrendingUp className="w-5 h-5 text-primary mx-auto" />
              <p className="text-[10px] font-semibold text-foreground">
                Volume
              </p>
              <p className="text-xs text-muted-foreground">
                ${((summaryData.volume || 0) / 1000).toFixed(0)}K
              </p>
            </div>

            {/* NFT Count */}
            <div className="p-3 bg-background/50 rounded border border-primary/10 text-center space-y-2">
              <ImageIcon className="w-5 h-5 text-primary mx-auto" />
              <p className="text-[10px] font-semibold text-foreground">NFTs</p>
              <p className="text-xs text-muted-foreground">
                {summaryData.nftCount}
              </p>
            </div>

            {/* Top Token */}
            <div className="p-3 bg-background/50 rounded border border-primary/10 text-center space-y-2">
              <Gem className="w-5 h-5 text-primary mx-auto" />
              <p className="text-[10px] font-semibold text-foreground">
                Top Token
              </p>
              <p className="text-xs text-muted-foreground">
                {summaryData.topToken}
              </p>
            </div>

            {/* Days Holding */}
            <div className="p-3 bg-background/50 rounded border border-primary/10 text-center space-y-2">
              <Clock className="w-5 h-5 text-primary mx-auto" />
              <p className="text-[10px] font-semibold text-foreground">
                HODL Days
              </p>
              <p className="text-xs text-muted-foreground">
                {summaryData.tokenHeldDays}
              </p>
            </div>

            {/* Top Protocol */}
            <div className="p-3 bg-background/50 rounded border border-primary/10 text-center space-y-2">
              <Network className="w-5 h-5 text-primary mx-auto" />
              <p className="text-[10px] font-semibold text-foreground">
                Protocol
              </p>
              <p className="text-xs text-muted-foreground">
                {summaryData.topProtocol}
              </p>
            </div>

            {/* Largest Transaction */}
            <div className="p-3 bg-background/50 rounded border border-primary/10 text-center space-y-2">
              <DollarSign className="w-5 h-5 text-primary mx-auto" />
              <p className="text-[10px] font-semibold text-foreground">Whale</p>
              <p className="text-xs text-muted-foreground">
                ${((summaryData.largestTransaction || 0) / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </Card>

        {/* Closing Message */}
        <p className="text-xs text-center text-muted-foreground italic">
          You're a true Stacks power user. Keep stacking and building on Stacks!
        </p>
      </div>
    </CardFrame>
  );
}
