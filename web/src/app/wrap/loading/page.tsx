"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const loadingMessages = [
  "Querying 365 days of on-chain history...",
  "Analyzing NFT traits and rarity scores...",
  "Calculating your diamond-hand HODL score...",
];

export default function WrapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const address = searchParams.get("address");
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          // Redirect to first card (volume) after loading completes
          setTimeout(() => {
            router.push(`/wrap/volume?address=${encodeURIComponent(address)}`);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [address, router]);

  const truncateAddress = (addr: string) => {
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center bg-card/80">
          <div className="flex items-center justify-center mb-4 relative">
            <div className="rounded-full bg-accent/10 p-4">
              <Wallet className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -right-3 -bottom-2 rounded-full bg-primary p-1">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="mb-3">
            <div className="text-sm text-muted-foreground">Connected:</div>
            <Badge className="mt-2 inline-flex items-center px-3 py-1 rounded-full font-mono">
              {address ? truncateAddress(address) : "..."}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4 min-h-[40px] flex items-center justify-center">
            {loadingMessages[messageIndex]}
          </p>

          <Progress value={progress} className="h-2 rounded-full" />
        </Card>
      </div>
      <Footer />
    </div>
  );
}
