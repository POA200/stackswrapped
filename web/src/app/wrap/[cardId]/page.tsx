"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VolumeCard } from "@/components/data-display/VolumeCard";
import { NFTCard } from "@/components/data-display/NFTCard";
import { RarestNFTCard } from "@/components/data-display/RarestNFTCard";
import { TopTokensCard } from "@/components/data-display/TopTokensCard";
import { FinalBadgeCard } from "@/components/data-display/FinalBadgeCard";
import { TokenHeldLongestCard } from "@/components/data-display/TokenHeldLongestCard";
import { TopProtocolsCard } from "@/components/data-display/TopProtocolsCard";
import { TopProtocolCard } from "@/components/data-display/TopProtocolCard";
import { LargestTransactionCard } from "@/components/data-display/LargestTransactionCard";
import { BadgeCard } from "@/components/data-display/BadgeCard";
import type { VolumeStats } from "@/lib/stacks-data";
import { dataCache } from "@/lib/data-cache";

// Define the card sequence
const CARD_SEQUENCE = [
  "volume",
  "nft",
  "rarest-nft",
  "top-tokens",
  "token-held-longest",
  "top-protocols",
  "top-protocol",
  "largest-transaction",
  "title-badge",
  "badge",
];

export default function CardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const [cardId, setCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [volumeData, setVolumeData] = useState<VolumeStats | null>(null);
  const [nftData, setNftData] = useState<any>(null);
  const [tokensData, setTokensData] = useState<any>(null);
  const [longestTokenData, setLongestTokenData] = useState<any>(null);
  const [wrappedResult, setWrappedResult] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [badgeData, setBadgeData] = useState<any>(null);
  const [finalBadgeData, setFinalBadgeData] = useState<any>(null);
  const [protocolsData, setProtocolsData] = useState<any>(null);

  useEffect(() => {
    // Unwrap the params promise
    Promise.resolve(params).then((resolvedParams) => {
      setCardId(resolvedParams.cardId);
      setIsLoading(false);
    });
  }, [params]);

  // Load cached data on mount
  useEffect(() => {
    if (!address) return;

    const cached = dataCache.get(address);
    if (cached) {
      console.log("[CardPage] Using cached data");

      // Load volume data
      const volumeResult = cached.volumeData;
      if (volumeResult) {
        const totalTx = volumeResult.totalTransactions || 0;
        const lookbackMonths = volumeResult.monthlyData?.length || 12;
        const avgTx = Math.round(totalTx / lookbackMonths);

        const volumeStats: VolumeStats = {
          totalTransactions: totalTx,
          busiestMonth: volumeResult.busiestMonth || "N/A",
          firstTransactionDate: volumeResult.firstTransactionDate || "Unknown",
          monthlyData: volumeResult.monthlyData || [],
          avgTransactionsPerMonth:
            volumeResult.avgTransactionsPerMonth || avgTx,
        };

        setVolumeData(volumeStats);
      }

      // Load wrapped data
      const wrapped = cached.wrappedData;
      if (wrapped?.metrics) {
        setWrappedResult(wrapped);

        const nftStats = {
          totalNFTs: wrapped.metrics.nftCount || 0,
          topNFTs: wrapped.metrics.topNFTs || [],
        };
        setNftData(nftStats);

        const tokenList = (wrapped.metrics.topTokensHeldLongest || []).map(
          (t: any) => ({
            name: t.name,
            daysHeld: t.daysHeld,
            sinceDate: t.sinceDate,
          })
        );
        setTokensData({ tokens: tokenList });

        if (tokenList[0]) {
          setLongestTokenData({
            token: tokenList[0].name,
            sinceDate: tokenList[0].sinceDate,
            daysHeld: tokenList[0].daysHeld,
          });
        }

        // Extract badge data
        if (wrapped.badge) {
          setBadgeData({
            badgeTitle: wrapped.badge.title || "The Stacks Voyager",
            badgeDescription:
              wrapped.badge.description ||
              "Exploring the Stacks ecosystem — keep going, the best is ahead.",
            badgeIconSrc: wrapped.badge.badgeSvg
              ? `/${wrapped.badge.badgeSvg}`
              : "/HodlHeroBadge.svg",
          });
        }

        // Extract final badge summary data
        setFinalBadgeData({
          badgeTitle: wrapped.badge?.title || "The Stacks Voyager",
          badgeIconSrc: wrapped.badge?.badgeSvg
            ? `/${wrapped.badge.badgeSvg}`
            : "/HodlHeroBadge.svg",
          volume: wrapped.metrics?.volumeUSD || 0,
          nftCount: wrapped.metrics?.nftCount || 0,
          topToken: wrapped.metrics?.topToken || "STX",
          tokenHeldDays: wrapped.metrics?.longestHoldDays || 0,
          topProtocol: wrapped.metrics?.topProtocols?.[0]?.name || "BITFLOW",
          largestTransaction: 5000, // Placeholder since not in API
        });

        // Set protocols data
        if (wrapped.metrics?.topProtocols) {
          setProtocolsData({ protocols: wrapped.metrics.topProtocols });
        }
      }

      setDataLoaded(true);
    }
  }, [address]);

  // Fetch volume data when showing volume card (only if not cached)
  useEffect(() => {
    if (cardId === "volume" && address && !volumeData && !dataLoaded) {
      const fetchVolume = async () => {
        try {
          console.log("[CardPage] Fetching volume data for address:", address);
          const response = await fetch(
            `/api/volume?address=${encodeURIComponent(address)}`
          );
          const result = await response.json();

          if (result.ok && result.data) {
            console.log("[CardPage] Volume data received:", result.data);

            // Ensure avgTransactionsPerMonth is calculated
            const totalTx = result.data.totalTransactions || 0;
            const lookbackMonths = result.data.monthlyData?.length || 12;
            const avgTx = Math.round(totalTx / lookbackMonths);

            const volumeStats: VolumeStats = {
              totalTransactions: totalTx,
              busiestMonth: result.data.busiestMonth || "N/A",
              firstTransactionDate:
                result.data.firstTransactionDate || "Unknown",
              monthlyData: result.data.monthlyData || [],
              avgTransactionsPerMonth:
                result.data.avgTransactionsPerMonth || avgTx,
            };

            console.log("[CardPage] Transformed Props:", volumeStats);
            setVolumeData(volumeStats);
          }
        } catch (err) {
          console.error("[CardPage] Error fetching volume:", err);
        }
      };

      fetchVolume();
    }
  }, [cardId, address, volumeData, dataLoaded]);

  // Fetch NFT + token data when showing NFT/token cards (only if not cached)
  useEffect(() => {
    const needsWrapped =
      cardId === "nft" ||
      cardId === "rarest-nft" ||
      cardId === "top-tokens" ||
      cardId === "token-held-longest" ||
      cardId === "top-protocols" ||
      cardId === "top-protocol" ||
      cardId === "title-badge" ||
      cardId === "badge" ||
      cardId === "largest-transaction";

    if (
      needsWrapped &&
      address &&
      (!nftData || !tokensData || !longestTokenData) &&
      !dataLoaded
    ) {
      const fetchNFT = async () => {
        try {
          console.log("[CardPage] Fetching NFT data for address:", address);
          const response = await fetch(
            `/api/wrapped?address=${encodeURIComponent(address)}`
          );
          const result = await response.json();

          if (result.metrics) {
            console.log("[CardPage] NFT data received:", result.metrics);
            // Keep a copy of full wrapped for other cards
            setWrappedResult(result);

            const nftStats = {
              totalNFTs: result.metrics.nftCount || 0,
              topNFTs: result.metrics.topNFTs || [],
            };
            console.log("[CardPage] Transformed NFT Props:", nftStats);
            setNftData(nftStats);

            const tokenList = (result.metrics.topTokensHeldLongest || []).map(
              (t: any) => ({
                name: t.name,
                daysHeld: t.daysHeld,
                sinceDate: t.sinceDate,
              })
            );
            setTokensData({ tokens: tokenList });

            if (tokenList[0]) {
              setLongestTokenData({
                token: tokenList[0].name,
                sinceDate: tokenList[0].sinceDate,
                daysHeld: tokenList[0].daysHeld,
              });
            } else {
              setLongestTokenData(null);
            }

            // Extract badge data (title + svg) from API
            if (result.badge) {
              setBadgeData({
                badgeTitle: result.badge.title || "The Stacks Voyager",
                badgeDescription:
                  result.badge.description ||
                  "Exploring the Stacks ecosystem — keep going, the best is ahead.",
                badgeIconSrc: result.badge.badgeSvg
                  ? `/${result.badge.badgeSvg}`
                  : "/HodlHeroBadge.svg",
              });
            }

            // Extract final badge summary data
            setFinalBadgeData({
              badgeTitle: result.badge?.title || "The Stacks Voyager",
              badgeIconSrc: result.badge?.badgeSvg
                ? `/${result.badge.badgeSvg}`
                : "/HodlHeroBadge.svg",
              volume: result.metrics?.volumeUSD || 0,
              nftCount: result.metrics?.nftCount || 0,
              topToken: result.metrics?.topToken || "STX",
              tokenHeldDays: result.metrics?.longestHoldDays || 0,
              topProtocol: result.metrics?.topProtocols?.[0]?.name || "BITFLOW",
              largestTransaction:
                result.metrics?.largestStxTransfer ?? undefined,
            });

            // Set protocols data
            if (result.metrics?.topProtocols) {
              setProtocolsData({ protocols: result.metrics.topProtocols });
            }
          }
        } catch (err) {
          console.error("[CardPage] Error fetching NFT data:", err);
        }
      };

      fetchNFT();
    }
  }, [cardId, address, nftData, dataLoaded]);

  if (isLoading || !cardId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Find current card index
  const currentIndex = CARD_SEQUENCE.indexOf(cardId);

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevCard = CARD_SEQUENCE[currentIndex - 1];
      router.push(
        `/wrap/${prevCard}?address=${encodeURIComponent(address || "")}`
      );
    }
  };

  const handleNext = () => {
    if (currentIndex < CARD_SEQUENCE.length - 1) {
      const nextCard = CARD_SEQUENCE[currentIndex + 1];
      router.push(
        `/wrap/${nextCard}?address=${encodeURIComponent(address || "")}`
      );
    }
  };

  const handleDisconnect = () => {
    router.push("/");
  };

  // Navigation props
  const navigationProps = {
    showPrev: currentIndex > 0,
    showNext: currentIndex < CARD_SEQUENCE.length - 1,
    onPrev: handlePrev,
    onNext: handleNext,
    onDisconnect: handleDisconnect,
  };

  const progress = { current: currentIndex, total: CARD_SEQUENCE.length };

  // Render the appropriate card based on cardId
  switch (cardId) {
    case "volume":
      return (
        <VolumeCard
          navigationProps={navigationProps}
          address={address || undefined}
          data={volumeData || undefined}
          progress={progress}
        />
      );
    case "nft":
      return (
        <NFTCard
          address={address || undefined}
          data={nftData || undefined}
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "rarest-nft":
      return (
        <RarestNFTCard
          address={address || undefined}
          data={nftData || undefined}
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "top-tokens":
      return (
        <TopTokensCard
          address={address || undefined}
          data={tokensData || undefined}
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "token-held-longest":
      return (
        <TokenHeldLongestCard
          address={address || undefined}
          data={longestTokenData || undefined}
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "top-protocols":
      return (
        <TopProtocolsCard
          address={address || undefined}
          data={
            wrappedResult?.metrics?.topProtocols
              ? { protocols: wrappedResult.metrics.topProtocols }
              : undefined
          }
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "top-protocol":
      return (
        <TopProtocolCard
          address={address || undefined}
          data={protocolsData?.protocols?.[0]}
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "largest-transaction":
      return (
        <LargestTransactionCard
          address={address || undefined}
          data={{
            amount:
              wrappedResult?.metrics?.largestStxTransfer ??
              finalBadgeData?.largestTransaction ??
              undefined,
          }}
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    case "title-badge":
      return (
        <BadgeCard
          address={address || undefined}
          data={badgeData || undefined}
          navigationProps={navigationProps}
        />
      );
    case "badge":
      return (
        <FinalBadgeCard
          address={address || undefined}
          data={finalBadgeData || undefined}
          navigationProps={navigationProps}
          progress={progress}
        />
      );
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Card not found</p>
        </div>
      );
  }
}
