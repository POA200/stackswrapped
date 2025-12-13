"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { dataCache } from "@/lib/data-cache";

const loadingMessages = [
  "Querying 365 days of on-chain history...",
  "Analyzing NFT traits and rarity scores...",
  "Calculating your diamond-hand HODL score...",
];

export default function WrapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <LoadingContent />
    </Suspense>
  );
}

function LoadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const address = searchParams.get("address");
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [dataFetched, setDataFetched] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    let cancelled = false;

    // Fetch all data concurrently
    const fetchAllData = async () => {
      try {
        console.log("[Loading] Fetching data for address:", address);

        // Check if we already have cached data
        const cached = dataCache.get(address);
        if (cached) {
          console.log("[Loading] Using cached data");
          setDataFetched(true);
          return;
        }

        // Create fetch with timeout (2 minutes)
        const fetchWithTimeout = (url: string, timeout = 120000) => {
          return Promise.race([
            fetch(url),
            new Promise<Response>((_, reject) =>
              setTimeout(() => reject(new Error("Request timeout")), timeout)
            ),
          ]);
        };

        // Fetch both volume and wrapped data concurrently with timeout
        const [volumeResponse, wrappedResponse] = await Promise.allSettled([
          fetchWithTimeout(
            `/api/volume?address=${encodeURIComponent(address)}`
          ),
          fetchWithTimeout(
            `/api/wrapped?address=${encodeURIComponent(address)}`
          ),
        ]);

        // Handle responses separately to provide better error info
        let volumeResult = null;
        let wrappedResult = null;

        if (volumeResponse.status === "fulfilled" && volumeResponse.value.ok) {
          volumeResult = await volumeResponse.value.json();
          console.log("[Loading] Volume data fetched successfully");
        } else if (volumeResponse.status === "rejected") {
          console.error(
            "[Loading] Volume request failed:",
            volumeResponse.reason
          );
        } else {
          console.error(
            "[Loading] Volume API error:",
            volumeResponse.value.status
          );
        }

        if (
          wrappedResponse.status === "fulfilled" &&
          wrappedResponse.value.ok
        ) {
          wrappedResult = await wrappedResponse.value.json();
          console.log("[Loading] Wrapped data fetched successfully");
        } else if (wrappedResponse.status === "rejected") {
          console.error(
            "[Loading] Wrapped request failed:",
            wrappedResponse.reason
          );
        } else if (wrappedResponse.status === "fulfilled") {
          console.error(
            "[Loading] Wrapped API error:",
            wrappedResponse.value.status
          );
          const errorText = await wrappedResponse.value
            .text()
            .catch(() => "Unable to read error");
          console.error("[Loading] Wrapped API error details:", errorText);
        }

        if (!cancelled) {
          // Cache the data even if some failed
          if (volumeResult?.data || wrappedResult) {
            dataCache.set(
              address,
              volumeResult?.data || null,
              wrappedResult || null
            );
            console.log("[Loading] Data cached");
          }
          setDataFetched(true);
        }
      } catch (error) {
        console.error("[Loading] Error fetching data:", error);
        if (!cancelled) {
          // Still navigate even on error - cards will handle missing data
          setDataFetched(true);
        }
      }
    };

    fetchAllData();

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    // Progress animation - reaches completion once data is fetched
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 20 + 8, 95);

        // Complete once progress is high and we've flagged ready
        if (dataFetched && newProgress >= 90) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);

          // Navigate with the fetched data stored
          setTimeout(() => {
            router.push(`/wrap/volume?address=${encodeURIComponent(address)}`);
          }, 200);
          return 100;
        }

        return newProgress;
      });
    }, 300);

    return () => {
      cancelled = true;
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [address, router, dataFetched]);

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
            {fetchError || loadingMessages[messageIndex]}
          </p>

          <Progress value={progress} className="h-2 rounded-full" />
        </Card>
      </div>
      <Footer />
    </div>
  );
}
