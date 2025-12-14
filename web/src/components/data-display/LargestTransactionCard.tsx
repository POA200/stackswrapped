"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import Image from "next/image";

interface LargestTransactionCardProps {
  address?: string;
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
  address,
  data,
  navigationProps,
  progress,
}: LargestTransactionCardProps) {
  const card = data || {
    amount: 1000,
  };

  // Format the amount with commas (ensure non-negative integer)
  const amount = Math.max(0, Math.floor(card.amount || 0));
  const formattedAmount = amount.toLocaleString("en-US");

  return (
    <CardFrame
      title="The Whale's Splash"
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
        {/* Background Sticker */}
        <Image
          src="/LargestTxSticker.svg"
          alt=""
          width={200}
          height={200}
          className="absolute w-auto h-auto -z-10 pointer-events-none opacity-50"
        />

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center space-y-8 z-10">
          {/* STX Logo Icon */}
          <div className="flex items-center justify-center w-24 h-24">
            <Image
              src="/Stacks-logo.svg"
              alt="STX"
              width={96}
              height={96}
              className="w-24 h-24"
              priority={false}
            />
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
