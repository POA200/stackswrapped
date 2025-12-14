"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { CircleDot, Gem } from "lucide-react";
import Image from "next/image";

interface TopTokensCardProps {
  address?: string;
  data?: {
    tokens: Array<{
      name: string;
      daysHeld: number;
      sinceDate?: string;
      logo?: string;
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

export function TopTokensCard({
  address,
  data,
  navigationProps,
  progress,
}: TopTokensCardProps) {
  if (!data) {
    return (
      <CardFrame
        title="Diamond Hands"
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
              Loading longest-held tokens...
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  const tokens = data.tokens || [];

  return (
    <CardFrame
      title="Diamond Hands"
      address={address}
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
      onDisconnect={navigationProps?.onDisconnect}
      currentStep={progress?.current}
      totalSteps={progress?.total}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 py-6 space-y-6 overflow-hidden">
        {/* Stickers */}
        <Image
          src="/TopTokensHeldSticker.svg"
          alt=""
          width={48}
          height={48}
          className="absolute top-0 w-62 h-auto opacity-40"
        />
        <Image
          src="/BottomTokensHeldSticker.svg"
          alt=""
          width={52}
          height={52}
          className="absolute bottom-0 w-full h-auto opacity-20"
        />

        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20">
          <Gem className="w-20 h-20 text-primary" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-regular text-orange-500">
            Diamond Hands!
          </h2>
          <p className="text-sm text-primary font-semibold">
            The Top 5 tokens you held the longest are
          </p>
        </div>

        {/* List */}
        {tokens.length > 0 ? (
          <div className="w-full max-w-md space-y-3 z-10">
            {tokens.slice(0, 5).map((token, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20"
              >
                <div className="w-6 text-lg font-semibold text-orange-500 text-right">
                  {index + 1}
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/30 bg-primary/10 overflow-hidden">
                  {token.logo ? (
                    <Image
                      src={token.logo}
                      alt={token.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <CircleDot className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-primary leading-snug">
                    {token.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-md text-center py-8 z-10">
            <p className="text-muted-foreground">No token hold data found.</p>
          </div>
        )}
      </div>
    </CardFrame>
  );
}
