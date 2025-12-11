"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface VolumeCardProps {
  data?: {
    totalTransactions: number;
    busiestMonth: string;
    monthlyData?: Array<{ month: string; count: number }>;
  };
  navigationProps?: {
    showPrev?: boolean;
    showNext?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
  };
}

export function VolumeCard({ data, navigationProps }: VolumeCardProps) {
  // Default data for placeholder/demo
  const volumeData = data || {
    totalTransactions: 1247,
    busiestMonth: "November",
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
  };

  const maxCount = Math.max(
    ...(volumeData.monthlyData?.map((d) => d.count) || [0])
  );

  return (
    <CardFrame
      title="The Volume (Transactions)"
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
    >
      <div className="w-full flex flex-col items-center justify-center space-y-6">
        {/* Headline */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6" />
            You Made a Splash!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your year in transactions on Stacks
          </p>
        </div>

        {/* Key Metric - Total Transactions */}
        <div className="text-center">
          <div className="text-7xl md:text-8xl font-black text-foreground bg-gradient-to-br from-primary to-orange-500 bg-clip-text text-transparent">
            {volumeData.totalTransactions.toLocaleString()}
          </div>
          <p className="text-lg font-semibold text-muted-foreground mt-2">
            Total Transactions
          </p>
        </div>

        {/* Simple Bar Chart Visualization */}
        <Card className="w-full p-4 bg-card/50 border border-primary/20">
          <div className="flex items-end justify-between h-32 gap-1">
            {volumeData.monthlyData?.map((item, index) => {
              const height = (item.count / maxCount) * 100;
              const isMax = item.count === maxCount;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-full rounded-t transition-all ${
                      isMax
                        ? "bg-primary"
                        : "bg-gradient-to-t from-primary/60 to-primary/30"
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${item.month}: ${item.count}`}
                  />
                  <span className="text-[8px] text-muted-foreground">
                    {item.month.slice(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Busiest Month:{" "}
            <span className="font-semibold text-primary">
              {volumeData.busiestMonth}
            </span>
          </p>
        </Card>
      </div>
    </CardFrame>
  );
}
