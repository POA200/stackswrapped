"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { RefObject, useState } from "react";
import { toPng } from "html-to-image";

interface HtmlToImageShareProps {
  targetRef: RefObject<HTMLElement>;
  cardTitle: string;
  badgeTitle?: string;
}

export function HtmlToImageShare({
  targetRef,
  cardTitle,
  badgeTitle,
}: HtmlToImageShareProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShare = async () => {
    if (!targetRef.current) return;
    setIsProcessing(true);
    try {
      const titleForShare = badgeTitle || cardTitle || "Stacks Wrapped";
      const siteUrl = "https://stackswrapped.vercel.app";
      const text = `MY STACKS WRAPPED RESULTS IS HERE! I earned ${titleForShare} badge. Check out your journey here: ${siteUrl}`;
      const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}`;
      window.open(twitterShareUrl, "_blank");
    } catch (err) {
      console.error("Share failed", err);
      alert("Failed to share. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      disabled={isProcessing}
      className="gap-2"
    >
      <Share2 className="w-4 h-4" />
    </Button>
  );
}
