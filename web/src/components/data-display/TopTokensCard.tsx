"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { Gem } from "lucide-react";
import Image from "next/image";

interface TopTokensCardProps {
  data?: {
    tokens: Array<{ name: string; duration: string }>;
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
  data,
  navigationProps,
  progress,
}: TopTokensCardProps) {
  const tokenData = data || {
    tokens: [
      { name: "STX", duration: "712 days" },
      { name: "ALEX", duration: "645 days" },
      { name: "CityCoins", duration: "603 days" },
      { name: "sBTC", duration: "489 days" },
      { name: "Wrapped BTC", duration: "455 days" },
    ],
  };

  return (
    <CardFrame
      title="Diamond Hands"
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
        <div className="w-full max-w-md space-y-3 z-10">
          {tokenData.tokens.slice(0, 5).map((token, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="w-6 text-lg font-semibold text-orange-500 text-right">
                {index + 1}
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/30 bg-primary/10">
                <Gem className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-primary leading-snug">
                  {token.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Held for {token.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}
