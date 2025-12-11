"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VolumeCard } from "@/components/data-display/VolumeCard";
import { NFTCard } from "@/components/data-display/NFTCard";
import { FinalBadgeCard } from "@/components/data-display/FinalBadgeCard";

// Define the card sequence
const CARD_SEQUENCE = ["volume", "nft", "badge"];

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

  // Navigation props
  const navigationProps = {
    showPrev: currentIndex > 0,
    showNext: currentIndex < CARD_SEQUENCE.length - 1,
    onPrev: handlePrev,
    onNext: handleNext,
  };

  // Render the appropriate card based on cardId
  switch (cardId) {
    case "volume":
      return <VolumeCard navigationProps={navigationProps} />;
    case "nft":
      return <NFTCard navigationProps={navigationProps} />;
    case "badge":
      return <FinalBadgeCard navigationProps={navigationProps} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Card not found</p>
        </div>
      );
  }
}
