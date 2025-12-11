/**
 * FILE: web/src/components/data-display/FinalBadgeCard.tsx
 *
 * PURPOSE: Implements the final "Your Stacks Wrapped Badge" card with achievements and summary.
 *
 * STACK CONTEXT:
 * - Client Component.
 * - Imports: CardFrame from '@/components/data-display/CardFrame'.
 * - Data: Assumes props receive badge and achievement data.
 * - Aesthetic: Celebrates the user's year with a prominent badge and achievement list.
 *
 * PROPS:
 * - data: { badgeTitle: string, achievements: array }
 * - navigationProps: { showPrev: boolean, showNext: boolean, onPrev: () => void, onNext: () => void }
 */

"use client";

import { CardFrame } from "@/components/data-display/CardFrame";
import { Card } from "@/components/ui/card";
import { Award, Crown } from "lucide-react";

interface FinalBadgeCardProps {
  data?: {
    badgeTitle: string;
    achievements: Array<{ icon: string; title: string; description: string }>;
  };
  navigationProps?: {
    showPrev?: boolean;
    showNext?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
  };
}

export function FinalBadgeCard({ data, navigationProps }: FinalBadgeCardProps) {
  // Default data for placeholder/demo
  const badgeData = data || {
    badgeTitle: "Bitcoin L2 Pioneer",
    achievements: [
      {
        icon: "🚀",
        title: "Early Adopter",
        description: "Active on Stacks since Day 1",
      },
      { icon: "💎", title: "Diamond Hands", description: "Held through 2025" },
      { icon: "⚡", title: "Power User", description: "1000+ transactions" },
      {
        icon: "🏆",
        title: "Top Performer",
        description: "In top 10% of users",
      },
    ],
  };

  return (
    <CardFrame
      title="Your 2025 Wrapped Badge"
      showPrev={navigationProps?.showPrev}
      showNext={navigationProps?.showNext}
      onPrev={navigationProps?.onPrev}
      onNext={navigationProps?.onNext}
    >
      <div className="w-full flex flex-col items-center justify-center space-y-6">
        {/* Headline */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Crown className="w-6 h-6" />
            Your Achievement
          </h2>
          <p className="text-sm text-muted-foreground">2025 Stacks Wrapped</p>
        </div>

        {/* Badge */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/50">
            <Award className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-center text-foreground">
            {badgeData.badgeTitle}
          </h3>
        </div>

        {/* Achievements Grid */}
        <Card className="w-full p-4 bg-card/50 border border-primary/20">
          <div className="grid grid-cols-2 gap-3">
            {badgeData.achievements.map((achievement, index) => (
              <div
                key={index}
                className="p-3 bg-background/50 rounded border border-primary/10 text-center space-y-1"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <p className="text-xs font-semibold text-foreground">
                  {achievement.title}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Closing Message */}
        <p className="text-xs text-center text-muted-foreground italic">
          Celebrate your year on Bitcoin L2. Share your wrapped to inspire
          others!
        </p>
      </div>
    </CardFrame>
  );
}
