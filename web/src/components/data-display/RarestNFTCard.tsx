"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import Image from "next/image";

interface RarestNFTCardProps {
  address?: string;
  data?: {
    topNFTs?: Array<{
      name: string;
      collection: string;
      rarity?: number;
      image?: string;
    }>;
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
  address,
  data,
  navigationProps,
  progress,
}: RarestNFTCardProps) {
  // Loading state mirrors NFT card behavior
  if (!data) {
    return (
      <CardFrame
        title="Your Rarest NFT"
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
              Loading your rarest NFT...
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  const rarest = data?.topNFTs?.[0];

  return (
    <CardFrame
      title="Your Rarest NFT"
      address={address}
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
          <div className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-primary/40 bg-primary/5 backdrop-blur-sm overflow-hidden">
            {rarest?.image ? (
              // Show NFT image when available
              <img
                src={rarest.image}
                alt={rarest.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                🎨
              </div>
            )}
          </div>

          {/* NFT Name */}
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-bold text-primary">
              {rarest ? rarest.name : "No NFT found"}
            </h3>
            {rarest ? (
              <>
                <p className="text-sm text-foreground">{rarest.collection}</p>
                {typeof rarest.rarity === "number" && (
                  <p className="text-xs text-orange-500 font-semibold mt-2">
                    Rarity score: {rarest.rarity}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No NFTs found for this year yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
