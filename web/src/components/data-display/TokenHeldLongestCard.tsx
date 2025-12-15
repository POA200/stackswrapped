"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import Image from "next/image";

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

        {/* Subheading */}
        <div className="text-center space-y-1 z-10">
          <h3 className="text-2xl md:text-4xl font-regular text-orange-500">
            Diamond Hands Approved!
          </h3>
          <p className="text-md text-muted-foreground font-regular">
            The token you held the longest is
          </p>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2 z-10">
          <h2 className="text-2xl md:text-6xl font-bold text-primary">
            ${card.token}
          </h2>
        </div>

        {/* Days Held */}
        <div className="flex flex-col items-center justify-center space-y-2 z-10">
          <div className="text-lg md:text-2xl font-regular text-foreground">
            {typeof card.daysHeld === "number"
              ? Math.floor(card.daysHeld / 2)
              : 0}{" "}
            Days
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
