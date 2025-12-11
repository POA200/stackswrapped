"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import Image from "next/image";

interface CardFrameProps {
  title: string;
  children: React.ReactNode;
  showPrev?: boolean;
  showNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export function CardFrame({
  title,
  children,
  showPrev = false,
  showNext = false,
  onPrev,
  onNext,
}: CardFrameProps) {
  const handleShare = async () => {
    // TODO: Implement image generation and sharing
    console.log("Share functionality coming soon...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Card with 4:5 aspect ratio (portrait) */}
      <Card className="relative w-full max-w-md aspect-[4/5] flex flex-col border-2 border-primary/30 shadow-2xl shadow-primary/20 bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Image
              src="/Logo.webp"
              alt="Stacks Wrapped"
              width={32}
              height={32}
              className="object-contain"
            />
            <h2 className="text-lg font-bold text-foreground">
              Stacks Wrapped
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="hover:bg-primary/10"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Title */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="text-xl font-semibold text-center text-foreground">
            {title}
          </h3>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center px-6 py-4 overflow-auto">
          {children}
        </div>

        {/* Footer with Navigation */}
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={!showPrev}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!showNext}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            © 2025 Stacks Wrapped • Powered by Bitcoin L2
          </p>
        </div>
      </Card>
    </div>
  );
}
