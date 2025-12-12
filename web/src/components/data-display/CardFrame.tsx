"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Download, LogOut, Share2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { HtmlToImageShare } from "@/components/logic/HtmlToImageShare";

interface CardFrameProps {
  title?: string;
  children: React.ReactNode;
  showPrev?: boolean;
  showNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onDisconnect?: () => void;
  currentStep?: number; // 0-based index
  totalSteps?: number; // total number of cards
}

export function CardFrame({
  title,
  children,
  showPrev = false,
  showNext = false,
  onPrev,
  onNext,
  onDisconnect,
  currentStep,
  totalSteps,
}: CardFrameProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // header share/download removed; Share/Save moved to footer via HtmlToImageShare

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
        {/* Background Stickers for Data Card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src="/DataPageSticker1.svg"
            alt=""
            width={64}
            height={64}
            className="absolute top-10 left-5 w-16 h-16 animate-float"
          />
          <Image
            src="/DataPageSticker2.svg"
            alt=""
            width={96}
            height={96}
            className="absolute top-20 right-10 w-24 h-24 animate-pulse"
          />
          <Image
            src="/DataPageSticker3.svg"
            alt=""
            width={96}
            height={96}
            className="absolute bottom-32 left-8 w-24 h-24 animate-float"
          />
          <Image
            src="/DataPageSticker4.svg"
            alt=""
            width={96}
            height={96}
            className="absolute bottom-20 right-5 w-24 h-24 animate-float"
          />
          <Image
            src="/DataPageSticker5.svg"
            alt=""
            width={128}
            height={128}
            className="absolute top-1/2 right-1/4 w-32 h-32 animate-float"
          />
          <Image
            src="/DataPageSticker6.svg"
            alt=""
            width={96}
            height={96}
            className="absolute bottom-1/4 left-1/4 w-24 h-24 animate-pulse"
          />
          <Image
            src="/DataPageSticker7.svg"
            alt=""
            width={32}
            height={32}
            className="absolute top-1/4 left-1/4 w-8 h-8 animate-float"
          />
        </div>

        {/* Card with 4:5 aspect ratio (portrait). Attach ref here for full capture */}
        <Card
          ref={cardRef}
          className="relative z-10 w-full max-w-md lg:max-w-2xl aspect-[4/5] flex flex-col border-2 border-primary/30 shadow-2xl shadow-primary/20 bg-background"
        >
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
              <HtmlToImageShare
                targetRef={cardRef as unknown as React.RefObject<HTMLElement>}
                fileName={`StacksWrapped_${(title || "Card").replace(
                  /\s+/g,
                  "_"
                )}.png`}
              />
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
            <div className="flex items-center justify-between">
              {/* Story-like progress segments */}
              {typeof currentStep === "number" &&
              typeof totalSteps === "number" &&
              totalSteps > 0 ? (
                <div className="flex items-center gap-1 flex-1 mr-3">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i < (currentStep ?? 0)
                          ? "bg-primary"
                          : i === (currentStep ?? 0)
                          ? "bg-primary/70"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
