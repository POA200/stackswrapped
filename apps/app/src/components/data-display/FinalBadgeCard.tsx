"use client";

import { CardFrame } from "../../../../../web/src/components/data-display/CardFrame";
import { Crown } from "lucide-react";
import Image from "next/image";

interface FinalBadgeCardData {
  badgeTitle: string;
  badgeIconSrc?: string;
  classificationSummary?: string;
  volume?: number;
  nftCount?: number;
  topToken?: string;
  tokenHeldDays?: number;
}

interface FinalBadgeCardProps {
  data?: FinalBadgeCardData;
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
  data,
  navigationProps,
  progress,
}: FinalBadgeCardProps) {
  const defaultData: FinalBadgeCardData = {
    badgeTitle: "The Stacker",
    badgeIconSrc: "/StacherBadge.svg",
    classificationSummary:
      "You earned this badge by consistently building and stacking on the Stacks blockchain. Your dedication to the ecosystem makes you a true believer.",
    volume: 0,
    nftCount: 0,
    topToken: "STX",
    tokenHeldDays: 0,
  };

  const finalData = data || defaultData;

  return (
    <CardFrame
      title="The Finale: Your Club Badge"
      badgeTitle={finalData.badgeTitle}
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
      onDisconnect={navigationProps?.onDisconnect}
      currentStep={progress?.current}
      totalSteps={progress?.total}
    >
      <div className="w-full h-full flex flex-col items-center justify-center px-4 py-8 space-y-6">
        {/* Prominent Title Section */}
        <div className="text-center space-y-3 z-10">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Your Stacks Explorer Title Is...
          </p>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            {finalData.badgeTitle}
          </h1>
        </div>

        {/* Decorative Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-orange-500 rounded-full"></div>

        {/* Large Centered Badge Logo with Stylized Border */}
        <div className="relative w-56 h-56 flex items-center justify-center z-10">
          {/* Outer gradient border frame */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/30 via-pink-500/30 to-orange-500/30 border-2 border-gradient-to-br border-purple-400/50 blur-sm"></div>

          {/* Inner container with distinct styling */}
          <div className="relative w-full h-full flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm border border-purple-400/20 shadow-2xl">
            <Image
              src={finalData.badgeIconSrc || "/StacherBadge.svg"}
              alt={`${finalData.badgeTitle} Badge`}
              width={200}
              height={200}
              className="w-40 h-40 object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Classification Summary */}
        <div className="max-w-md text-center space-y-3 z-10">
          <p className="text-base text-foreground leading-relaxed">
            {finalData.classificationSummary}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Crown className="w-4 h-4 text-orange-500" />
            <p className="text-sm font-semibold text-orange-500">
              You're officially a Stacks Club member!
            </p>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="w-full max-w-md border-t border-dashed border-primary/30 pt-4 z-10">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-muted-foreground">Volume</p>
              <p className="font-semibold text-foreground">
                ${((finalData.volume || 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">NFTs</p>
              <p className="font-semibold text-foreground">
                {finalData.nftCount}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">HODL Days</p>
              <p className="font-semibold text-foreground">
                {finalData.tokenHeldDays}
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <p className="text-xs text-center text-muted-foreground italic z-10 max-w-md">
          "The future of finance is built by stackers like you. Keep building on
          Stacks!"
        </p>
      </div>
    </CardFrame>
  );
}
