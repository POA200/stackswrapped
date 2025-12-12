"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VolumeCard } from "@/components/data-display/VolumeCard";
import { NFTCard } from "@/components/data-display/NFTCard";
import { RarestNFTCard } from "@/components/data-display/RarestNFTCard";
import { TopTokensCard } from "@/components/data-display/TopTokensCard";
import { FinalBadgeCard } from "@/components/data-display/FinalBadgeCard";
import { TokenHeldLongestCard } from "@/components/data-display/TokenHeldLongestCard";
import { TopProtocolsCard } from "@/components/data-display/TopProtocolsCard";
import { TopProtocolCard } from "@/components/data-display/TopProtocolCard";
import { LargestTransactionCard } from "@/components/data-display/LargestTransactionCard";
import { BadgeCard } from "@/components/data-display/BadgeCard";

// Define the card sequence
const CARD_SEQUENCE = [
  "volume",
  "nft",
  "rarest-nft",
  "top-tokens",
  "token-held-longest",
  "top-protocols",
  "top-protocol",
  "largest-transaction",
  "title-badge",
  "badge",
];

export default function CardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const [cardId, setCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Unwrap the params promise
    Promise.resolve(params).then((resolvedParams) => {
      setCardId(resolvedParams.cardId);
      setIsLoading(false);
    });
  }, [params]);

  if (isLoading || !cardId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Find current card index
  const currentIndex = CARD_SEQUENCE.indexOf(cardId);

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevCard = CARD_SEQUENCE[currentIndex - 1];
      router.push(
        `/wrap/${prevCard}?address=${encodeURIComponent(address || "")}`
      );
    }
  };

  const handleNext = () => {
    if (currentIndex < CARD_SEQUENCE.length - 1) {
      const nextCard = CARD_SEQUENCE[currentIndex + 1];
      router.push(
        `/wrap/${nextCard}?address=${encodeURIComponent(address || "")}`
      );
    }
  };

  const handleDisconnect = () => {
    router.push("/");
  };

  // Navigation props
  const navigationProps = {
    showPrev: currentIndex > 0,
    showNext: currentIndex < CARD_SEQUENCE.length - 1,
    onPrev: handlePrev,
    onNext: handleNext,
    onDisconnect: handleDisconnect,
  };

  const progress = { current: currentIndex, total: CARD_SEQUENCE.length };

  // Render the appropriate card based on cardId
  switch (cardId) {
    case "volume":
      return (
        <VolumeCard
          navigationProps={navigationProps}
          address={address || undefined}
        />
      );
    case "nft":
      return <NFTCard navigationProps={navigationProps} progress={progress} />;
    case "rarest-nft":
      return (
        <RarestNFTCard navigationProps={navigationProps} progress={progress} />
      );
    case "top-tokens":
      return (
        <TopTokensCard navigationProps={navigationProps} progress={progress} />
      );
    case "token-held-longest":
      return (
        <TokenHeldLongestCard
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "top-protocols":
      return (
        <TopProtocolsCard
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "top-protocol":
      return (
        <TopProtocolCard
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "largest-transaction":
      return (
        <LargestTransactionCard
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "title-badge":
      return <BadgeCard navigationProps={navigationProps} />;
    case "badge":
      return (
        <FinalBadgeCard navigationProps={navigationProps} progress={progress} />
      );
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Card not found</p>
        </div>
      );
  }
}
