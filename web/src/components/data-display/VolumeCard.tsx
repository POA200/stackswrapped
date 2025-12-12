"use client";

import { useEffect, useMemo, useState } from "react";
import { CardFrame } from "@/components/data-display/CardFrame";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { fetchVolumeStats, type VolumeStats } from "@/lib/stacks-data";

interface VolumeCardProps {
  address?: string;
  data?: VolumeStats;
  navigationProps?: {
    showPrev?: boolean;
    showNext?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
    onDisconnect?: () => void;
  };
  progress?: { current: number; total: number };
}

export function VolumeCard({
  address,
  data,
  navigationProps,
  progress,
}: VolumeCardProps) {
  const fallbackData: VolumeStats = useMemo(
    () => ({
      totalTransactions: 1247,
      busiestMonth: "November",
      firstTransactionDate: "January 15, 2025",
      monthlyData: [
        { month: "Jan", count: 45 },
        { month: "Feb", count: 82 },
        { month: "Mar", count: 103 },
        { month: "Apr", count: 97 },
        { month: "May", count: 125 },
        { month: "Jun", count: 88 },
        { month: "Jul", count: 142 },
        { month: "Aug", count: 156 },
        { month: "Sep", count: 134 },
        { month: "Oct", count: 178 },
        { month: "Nov", count: 201 },
        { month: "Dec", count: 96 },
      ],
    }),
    []
  );

  const [volumeData, setVolumeData] = useState<VolumeStats>(
    data || fallbackData
  );
  const [isLoading, setIsLoading] = useState<boolean>(!!address);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      setError(null);
      setVolumeData(data || fallbackData);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // First, check if volume data was pre-fetched during loading page
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("volumeData");
      if (cached) {
        try {
          const cachedData = JSON.parse(cached) as VolumeStats;
          console.log("Using cached volume data:", cachedData);
          if (!cancelled) {
            setVolumeData(cachedData);
            setIsLoading(false);
            sessionStorage.removeItem("volumeData"); // Clear after use
            return;
          }
        } catch (err) {
          console.warn("Failed to parse cached volume data", err);
        }
      }
    }

    // If no cached data, fetch live
    console.log("Fetching volume data for address:", address);
    fetchVolumeStats(address)
      .then((stats) => {
        if (cancelled) return;
        console.log("Received volume stats:", stats);
        setVolumeData(stats || fallbackData);
      })
      .catch((err) => {
        console.error("Failed to load volume stats", err);
        if (cancelled) return;
        setError("Unable to load on-chain volume.");
        setVolumeData(fallbackData);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address, data, fallbackData]);

  return (
    <CardFrame
      title="The Volume (Transactions)"
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
      onDisconnect={navigationProps?.onDisconnect}
      currentStep={progress?.current}
      totalSteps={progress?.total}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 py-6 space-y-4">
        {/* Top Stickers - Positioned Absolutely */}
        <div className="absolute top-0 left-0 w-32 h-auto -z-10 pointer-events-none">
          <Image
            src="/VolumeCardSticker1.svg"
            alt=""
            width={64}
            height={64}
            className="w-full h-full -z-10 pointer-events-none"
          />
        </div>
        <div className="absolute bottom-3 right-0 w-26 h-auto -z-10 pointer-events-none">
          <Image
            src="/VolumeCardSticker2.svg"
            alt=""
            width={80}
            height={80}
            className="w-full h-full -z-10 pointer-events-none"
          />
        </div>

        {/* Content Area */}
        <div className="text-center space-y-3 z-10">
          {/* Key Metric - Transaction Count */}
          <div className="text-5xl md:text-6xl font-regular text-orange-500">
            {isLoading ? "..." : volumeData.totalTransactions.toLocaleString()}
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Transactions
          </p>

          {/* Headline */}
          <h2 className="text-2xl font-medium text-primary flex items-center justify-center gap-2 mt-2">
            <TrendingUp className="w-5 h-5" />
            {address ? "You Made a Splash!" : "Demo Wallet Snapshot"}
          </h2>

          {/* First Transaction Date */}
          <p className="text-xs text-muted-foreground">
            {address
              ? "Your first on-chain action was on:"
              : "Sample first action:"}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {isLoading ? "..." : volumeData.firstTransactionDate || "--"}
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="w-full border-t border-dashed border-primary/30 my-2"></div>

        {/* Additional Stats */}
        {error && (
          <p className="text-xs text-destructive text-center z-10">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-4 w-full text-center text-xs z-10">
          <div className="p-2 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-muted-foreground">Busiest Month</p>
            <p className="font-bold text-primary text-sm">
              {volumeData.busiestMonth}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-muted-foreground">Avg/Month</p>
            <p className="font-bold text-primary text-sm">
              {Math.round(volumeData.totalTransactions / 12)}
            </p>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
