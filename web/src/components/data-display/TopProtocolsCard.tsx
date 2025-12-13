"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { Network } from "lucide-react";
import Image from "next/image";

interface TopProtocolsCardProps {
  data?: {
    protocols: Array<{ name: string; interactions: number }>;
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

export function TopProtocolsCard({
  data,
  navigationProps,
  progress,
}: TopProtocolsCardProps) {
  const protocolData = data || {
    protocols: [
      { name: "Bitflow", interactions: 245 },
      { name: "Velar", interactions: 189 },
      { name: "StackingDAO", interactions: 156 },
      { name: "Arkadiko", interactions: 98 },
      { name: "STX.City", interactions: 67 },
    ],
  };

  return (
    <CardFrame
      title="Top 5 Protocols"
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
          src="/ProtocolsBgSticker.svg"
          alt=""
          width={200}
          height={200}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto -z-10 pointer-events-none opacity-40"
        />

        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 z-10">
          <Network className="w-20 h-20 text-primary" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-1 z-10">
          <h2 className="text-3xl font-regular text-orange-500">
            Protocol Power User
          </h2>
          <p className="text-sm text-primary font-medium">
            Your Top 5 Most Used Protocols
          </p>
        </div>

        {/* List */}
        <div className="w-full max-w-md space-y-3 z-10">
          {protocolData.protocols.slice(0, 5).map((protocol, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="w-6 text-lg font-semibold text-orange-500 text-right">
                {index + 1}
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/30 bg-primary/10">
                <Network className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-primary leading-snug">
                  {protocol.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {protocol.interactions} interactions
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}
