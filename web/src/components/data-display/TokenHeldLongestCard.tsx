"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import Image from "next/image";
import { CircleDot, Clock } from "lucide-react";

interface TokenHeldLongestCardProps {
  address?: string;
  data?: {
    token?: string;
    sinceDate?: string;
    daysHeld?: number;
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

export function TokenHeldLongestCard({
  address,
  data,
  navigationProps,
  progress,
}: TokenHeldLongestCardProps) {
  if (!data) {
    return (
      <CardFrame
        title="Token Held Longest"
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
              Loading your longest-held token...
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  if (!data.token) {
    return (
      <CardFrame
        title="Token Held Longest"
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
          <p className="text-sm text-muted-foreground text-center">
            No token hold data found.
          </p>
        </div>
      </CardFrame>
    );
  }

  const card = data;

  return (
    <CardFrame
      title="Token Held Longest"
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
        {/* Background Stickers */}
        <Image
          src="/TopTokensHeldSticker.svg"
          alt=""
          width={48}
          height={48}
          className="absolute top-0 w-48 h-auto -z-10 pointer-events-none opacity-40"
        />
        <Image
          src="/BottomTokensHeldSticker.svg"
          alt=""
          width={52}
          height={52}
          className="absolute bottom-0 w-full h-auto -z-10 pointer-events-none opacity-20"
        />

        {/* Heading */}
        <div className="text-center space-y-2 z-10">
          <p className="text-sm text-primary font-regular">
            The token you held the longest is
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {card.token}
          </h2>
        </div>

        {/* Subheading */}
        <div className="text-center space-y-1 z-10">
          <h3 className="text-2xl font-regular text-orange-500">
            Diamond Hands Approved!
          </h3>
          <p className="text-sm text-foreground">
            You've held it since {card.sinceDate}
          </p>
        </div>

        {/* Days Held */}
        <div className="flex flex-col items-center justify-center space-y-2 z-10">
          <div className="text-5xl md:text-4xl font-regular text-primary">
            {card.daysHeld} Days
          </div>
        </div>

        {/* Token Logo Placeholder */}
        <div className="flex items-center justify-center w-24 h-24 rounded-full border-2 border-primary/30 bg-primary/10 text-[11px] text-primary z-10 bottom-4">
          <CircleDot className="w-10 h-10 text-primary" />
        </div>
      </div>
    </CardFrame>
  );
}
