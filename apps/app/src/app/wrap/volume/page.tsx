import { VolumeCard } from "../../../../../../web/src/components/data-display/VolumeCard";
import { getNavigationPaths, getProgress } from "../../../lib/constants";
// Switch to web API route to avoid cross-app imports
// import { fetchVolumeStats } from "../../../../../../web/src/lib/stacks-data";

// Type definition for the API response
interface WrappedApiResponse {
  address: string;
  metrics: {
    totalTransactions: number;
    firstTxDate: string | null;
    busiestMonth: string | null;
    longestHoldDays: number;
    volumeUSD: number;
    nftCount: number;
    topToken: string;
  };
  badge: {
    title: string;
  };
  raw: {
    transactionsCount: number;
    nftHoldingsCount: number;
    ftBalancesCount: number;
  };
}

export default async function VolumeCardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract the user's Stacks address from URL query parameters
  const userAddress = searchParams.address as string;
  const monthsParam = searchParams.months as string | undefined;
  const lookbackMonths = monthsParam
    ? Math.max(1, Math.min(24, Number(monthsParam)))
    : 12;

  // Validate that the address exists
  if (!userAddress || typeof userAddress !== "string") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Missing Address
          </h1>
          <p className="text-muted-foreground">
            No Stacks address provided. Please connect your wallet.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  let volumeData = null;
  let error = null;

  const baseUrl = process.env.NEXT_PUBLIC_APP_ORIGIN || "http://localhost:3000";
  try {
    const res = await fetch(
      `${baseUrl}/api/volume?address=${encodeURIComponent(userAddress)}${
        lookbackMonths ? `&months=${lookbackMonths}` : ""
      }`,
      {
        next: { revalidate: 300, tags: ["volume:" + userAddress] },
      }
    );
    if (!res.ok) {
      console.error("Failed to fetch /api/volume", res.status);
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-sm text-red-500">Failed to load volume data.</p>
        </div>
      );
    }
    const { data: stats } = await res.json();
    if (!stats) {
      throw new Error("No stats returned for address");
    }

    const totalTx = stats.totalTransactions || 0;
    const monthsCount =
      lookbackMonths ??
      (Array.isArray(stats.monthlyData) ? stats.monthlyData.length : 12);
    const avgTx = monthsCount > 0 ? Math.round(totalTx / monthsCount) : 0;

    volumeData = {
      totalTransactions: totalTx,
      busiestMonth: stats.busiestMonth || "N/A",
      firstTransactionDate: stats.firstTransactionDate || "Unknown",
      avgTransactionsPerMonth: avgTx,
      monthlyData: stats.monthlyData || [],
    };
  } catch (err) {
    console.error("Error fetching volume data:", err);
    error = err instanceof Error ? err.message : "Failed to fetch volume data";
  }

  // Error UI fallback
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Error Loading Data
          </h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Get navigation paths and progress for the current page
  const currentPath = "/wrap/volume";
  const { prevPath, nextPath } = getNavigationPaths(currentPath);
  const progressData = getProgress(currentPath);

  // Render the VolumeCard component with fetched data and navigation props
  return (
    <VolumeCard
      address={userAddress}
      data={volumeData}
      navigationProps={{
        showPrev: prevPath !== null,
        showNext: nextPath !== null,
      }}
      progress={progressData}
    />
  );
}
