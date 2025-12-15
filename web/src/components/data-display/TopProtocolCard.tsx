"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { CircleDot } from "lucide-react";
import Image from "next/image";

interface TopProtocolCardProps {
  address?: string;
  data?: {
    name: string;
    interactions: number;
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

export function TopProtocolCard({
  address,
  data,
  navigationProps,
  progress,
}: TopProtocolCardProps) {
  if (!data) {
    return (
      <CardFrame
        title="DeFi Home Base"
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
              Loading your top protocol...
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame
      title="DeFi Home Base"
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
        {/* Background Sticker with Concentric Circles */}
        <Image
          src="/ProtocolsBgSticker.svg"
          alt=""
          width={400}
          height={400}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-auto -z-10 pointer-events-none"
        />

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center space-y-6 z-10">
          {/* Top Heading */}
          <div className="text-center">
            <h2 className="text-xl md:text-3xl font-regular text-orange-500">
              Your DeFi Home Base!
            </h2>
            <p className="text-sm text-foreground">You interacted most with</p>
          </div>

          {/* Protocol Name */}
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-primary">
              {data.name}
            </h3>
          </div>

          {/* Contract Calls */}
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">total interactions</p>
            <div className="text-3xl md:text-5xl font-medium text-orange-500">
              {data.interactions}
            </div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
