"use client";

import { useMemo } from "react";
import { CardFrame } from "@/components/data-display/CardFrame";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as Recharts from "recharts";
import type { VolumeStats } from "@/lib/stacks-data";

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
  // Show loading state if no data yet
  if (!data) {
    return (
      <CardFrame
        title="The Volume (Transactions)"
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
              Loading your transaction data...
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame
      title="The Volume (Transactions)"
      isDemo={data.totalTransactions === 0}
      address={address}
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
            loading="eager"
            className="w-full h-full -z-10 pointer-events-none"
          />
        </div>
        <div className="absolute top-0 right-0 w-26 h-auto -z-10 pointer-events-none">
          <Image
            src="/VolumeCardSticker2.svg"
            alt=""
            width={80}
            height={80}
            loading="eager"
            className="w-full h-full -z-10 pointer-events-none transform rotate-180 scale-x-[-1]"
          />
        </div>

        {/* Content Area */}
        <div className="text-center space-y-3 z-10">
          {/* Key Metric - Transaction Count */}
          <div className="text-5xl md:text-6xl font-regular text-orange-500">
            {data.totalTransactions.toLocaleString()}
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Transactions
          </p>

          {/* Headline */}
          <h2 className="text-2xl md:text-4xi font-medium text-primary flex items-center justify-center gap-2 mt-2">
            <TrendingUp className="w-5 h-5" />
            {address ? "You Made a Splash!" : "Wallet Snapshot"}
          </h2>

          {/* First Transaction Date */}
          <p className="text-xs text-muted-foreground">
            {address
              ? "Your first on-chain action was on:"
              : "Sample first action:"}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {data.firstTransactionDate || "--"}
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="w-full border-t border-dashed border-primary/30 my-2"></div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 w-full text-center text-xs z-10">
          <div className="p-2 rounded-lg bg-primary/5 border border-primary/20 backdrop-blur-sm">
            <p className="text-muted-foreground">Busiest Month</p>
            <p className="font-bold text-primary text-sm">
              {data.busiestMonth}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-primary/5 border border-primary/20 backdrop-blur-sm">
            <p className="text-muted-foreground">Avg/Month</p>
            <p className="font-bold text-primary text-sm">
              {data.avgTransactionsPerMonth ??
                Math.round(data.totalTransactions / 12)}
            </p>
          </div>
        </div>

        {/* Monthly Transactions Chart */}
        <div className="w-full z-10">
          <ChartContainer
            className="mt-3 h-44 w-full"
            config={{
              transactions: {
                label: "Transactions",
                color: "oklch(0.541 0.281 293.009)",
              },
            }}
          >
            <Recharts.BarChart
              data={data.monthlyData}
              margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            >
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />
              <Recharts.YAxis tickLine={false} axisLine={false} width={24} />
              <ChartTooltip
                content={<ChartTooltipContent nameKey="transactions" />}
              />
              <Recharts.Bar
                dataKey="count"
                name="transactions"
                fill="oklch(0.541 0.281 293.009)"
                radius={[4, 4, 0, 0]}
              />
            </Recharts.BarChart>
          </ChartContainer>
        </div>
      </div>
    </CardFrame>
  );
}
