"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { CircleDot } from "lucide-react";
import Image from "next/image";

interface TopProtocolCardProps {
  data?: {
    protocolName?: string;
    contractCalls?: number;
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
  data,
  navigationProps,
  progress,
}: TopProtocolCardProps) {
  const card = data || {
    protocolName: "[dApp Name]",
    contractCalls: 999,
  };

  return (
    <CardFrame
      title="DeFi Home Base"
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
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-auto -z-10 pointer-events-none opacity-30"
        />

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center space-y-6 z-10">
          {/* Top Heading */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl md:text-5xl font-regular text-primary">
              Your DeFi Home Base!
            </h2>
            <p className="text-base text-muted-foreground">
              You interacted most with
            </p>
          </div>

          {/* Protocol Name */}
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-primary">
              {card.protocolName}
            </h3>
          </div>

          {/* Contract Calls */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              total contract calls.
            </p>
            <div className="text-5xl md:text-6xl font-bold text-orange-500">
              {card.contractCalls}
            </div>
          </div>

          {/* Protocol Logo Placeholder */}
          <div className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-primary/30 bg-primary/10 text-primary/60 z-10 mt-6">
            <div className="flex flex-col items-center justify-center">
              <CircleDot className="w-12 h-12 text-primary" />
              <p className="text-xs mt-2 text-primary/70">Protocol Logo</p>
            </div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
