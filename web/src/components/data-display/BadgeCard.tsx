"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import Image from "next/image";

interface BadgeCardProps {
  address?: string;
  data?: {
    badgeTitle?: string;
    badgeDescription?: string;
    badgeIconSrc?: string; // dynamic icon per user
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

export function BadgeCard({
  address,
  data,
  navigationProps,
  progress,
}: BadgeCardProps) {
  // Show loading state until data is provided
  if (!data) {
    return (
      <CardFrame
        title="Your 2025 Badge"
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
              Computing your Stacks title...
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  const card = data!;

  return (
    <CardFrame
      title="Your 2025 Badge"
      badgeTitle={card.badgeTitle}
      address={address}
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
      onDisconnect={navigationProps?.onDisconnect}
      currentStep={progress?.current}
      totalSteps={progress?.total}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 py-6 space-y-8 overflow-hidden">
        {/* Background Sticker */}
        <Image
          src="/BadgeBGSticker.svg"
          alt=""
          width={400}
          height={400}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover -z-10 pointer-events-none opacity-30"
        />

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center space-y-8 z-10">
          {/* Top Heading */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-regular text-primary">
              Your 2025 Stacks Title Is...
            </h2>
          </div>

          {/* Badge Icon */}
          <div className="flex items-center justify-center">
            <Image
              src={card.badgeIconSrc || "/HodlHeroBadge.svg"}
              alt="Badge"
              width={200}
              height={200}
              className="w-48 h-48 md:w-56 md:h-56 drop-shadow-lg"
            />
          </div>

          {/* Badge Title */}
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-orange-500">
              {card.badgeTitle || "Your Stacks Title"}
            </h3>
          </div>

          {/* Badge Description */}
          <div className="text-center max-w-md px-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.badgeDescription ||
                "Your personalized title celebrates your on-chain year on Stacks."}
            </p>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
