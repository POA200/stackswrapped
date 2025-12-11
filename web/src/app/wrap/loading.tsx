"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Check } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 text-center bg-card/80">
        <div className="flex items-center justify-center mb-4 relative">
          <div className="rounded-full bg-accent/10 p-4">
            <Wallet className="w-12 h-12 text-accent" />
          </div>
          <div className="absolute -right-3 -bottom-2 rounded-full bg-primary p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="mb-3">
          <div className="text-sm text-muted-foreground">Connected:</div>
          <Badge className="mt-2 inline-flex items-center px-3 py-1 rounded-full font-mono">
            SP.WXYZ
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Querying 365 days of on-chain history...
        </p>

        <Progress value={40} className="h-2 rounded-full" />
      </Card>
    </div>
  );
}
