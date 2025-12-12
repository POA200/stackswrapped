"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { DollarSign } from "lucide-react";
import Image from "next/image";

interface LargestTransactionCardProps {
  data?: {
    amount?: number;
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

export function LargestTransactionCard({
  data,
  navigationProps,
  progress,
}: LargestTransactionCardProps) {
  const card = data || {
    amount: 1000,
  };

  // Format the amount with commas
  const formattedAmount = (card.amount || 0).toLocaleString("en-US");

  return (
    <CardFrame
      title="The Whale's Splash"
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
          src="/TopRightLargestSingleTXSticker.svg"
          alt=""
          width={200}
          height={200}
          className="absolute top-0 left-0 w-64 h-auto -z-10 pointer-events-none opacity-50"
        />
        <Image
          src="/BottomLargestSingkeTXSticker.svg"
          alt=""
          width={300}
          height={200}
          className="absolute bottom-0 left-0 w-full h-auto -z-10 pointer-events-none opacity-40"
        />

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center space-y-8 z-10">
          {/* Dollar Sign Icon */}
          <div className="flex items-center justify-center w-24 h-24">
            <DollarSign className="w-24 h-24 text-primary" strokeWidth={2} />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl md:text-5xl font-regular text-primary">
              The Whale&apos;s Splash!
            </h2>
            <p className="text-base text-muted-foreground">
              Your largest single transaction was
            </p>
          </div>

          {/* Amount */}
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold text-orange-500">
              {formattedAmount} STX
            </div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
