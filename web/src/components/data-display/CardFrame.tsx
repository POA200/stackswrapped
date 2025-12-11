"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, LogOut, Share2 } from "lucide-react";
import Image from "next/image";

interface CardFrameProps {
  title?: string;
  children: React.ReactNode;
  showPrev?: boolean;
  showNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onDisconnect?: () => void;
}

export function CardFrame({
  title,
  children,
  showPrev = false,
  showNext = false,
  onPrev,
  onNext,
  onDisconnect,
}: CardFrameProps) {
  const handleShare = async () => {
    // TODO: Implement image generation and sharing
    console.log("Share functionality coming soon...");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
        {/* Background Stickers for Data Card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/DataPageSticker1.svg"
            alt=""
            className="absolute top-10 left-5 w-16 h-16 animate-float"
          />
          <img
            src="/DataPageSticker2.svg"
            alt=""
            className="absolute top-20 right-10 w-24 h-24 animate-pulse"
          />
          <img
            src="/DataPageSticker3.svg"
            alt=""
            className="absolute bottom-32 left-8 w-24 h-24 animate-float"
          />
          <img
            src="/DataPageSticker4.svg"
            alt=""
            className="absolute bottom-20 right-5 w-24 h-24 animate-float"
          />
          <img
            src="/DataPageSticker5.svg"
            alt=""
            className="absolute top-1/2 right-1/4 w-32 h-32 animate-float"
          />
          <img
            src="/DataPageSticker6.svg"
            alt=""
            className="absolute bottom-1/4 left-1/4 w-24 h-24 animate-pulse"
          />
          <img
            src="/DataPageSticker7.svg"
            alt=""
            className="absolute top-1/4 left-1/4 w-8 h-8 animate-float"
          />
        </div>

        {/* Card with 4:5 aspect ratio (portrait) */}
        <Card className="relative z-10 w-full max-w-md lg:max-w-2xl aspect-[4/5] flex flex-col border-2 border-primary/30 shadow-2xl shadow-primary/20 bg-card">
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
              <h2 className="text-lg font-medium text-primary">
                Stacks <span className="text-primary/50">Wrapped</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="hover:bg-primary/10"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              {onDisconnect && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDisconnect}
                  className="text-xs"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Disconnect Wallet
                </Button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex items-center justify-center px-6 py-4">
            {children}
          </div>

          {/*Navigation */}
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
          </div>
        </Card>
      </div>
    </>
  );
}
