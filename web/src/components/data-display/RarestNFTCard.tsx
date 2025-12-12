"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import Image from "next/image";

interface RarestNFTCardProps {
  data?: {
    nftName: string;
    collection: string;
    rarity?: number;
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

export function RarestNFTCard({
  data,
  navigationProps,
  progress,
}: RarestNFTCardProps) {
  // Default data for placeholder/demo
  const nftData = data || {
    nftName: "Stacks Punk #1234",
    collection: "Stacks Punks",
    rarity: 99,
  };

  return (
    <CardFrame
      title="Your Rarest NFT"
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
      onDisconnect={navigationProps?.onDisconnect}
      currentStep={progress?.current}
      totalSteps={progress?.total}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 py-6">
        {/* Decorative stickers */}
        <div className="absolute top-0 w-auto">
          <Image
            src="/TopNFTCardSticker.svg"
            alt=""
            width={32}
            height={20}
            className="w-full h-full opacity-40"
          />
        </div>
        <div className="absolute bottom-0 w-auto">
          <Image
            src="/BottomNFTCardSticker.svg"
            alt=""
            width={40}
            height={20}
            className="w-full h-full opacity-40"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-regular text-primary">
            Your rarest asset is
          </h2>

          {/* NFT Logo Circle */}
          <div className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-primary/40 bg-primary/5 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs text-primary/70 font-medium">NFT</span>
              <span className="text-xs text-primary/70 font-medium">Logo</span>
            </div>
          </div>

          {/* NFT Name */}
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-bold text-primary">
              [{nftData.nftName}]
            </h3>
            <p className="text-sm text-foreground">{nftData.collection}</p>
            {nftData.rarity && (
              <p className="text-xs text-orange-500 font-semibold mt-2">
                Rarity: Top {100 - nftData.rarity}%
              </p>
            )}
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
