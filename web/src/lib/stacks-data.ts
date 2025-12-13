const DEFAULT_API = "https://api.mainnet.hiro.so";
const API_BASE = process.env.NEXT_PUBLIC_HIRO_API || DEFAULT_API;
const HIRO_API_KEY = process.env.HIRO_API_KEY;

export type VolumeStats = {
  totalTransactions: number;
  busiestMonth: string;
  monthlyData: Array<{ month: string; count: number }>;
  firstTransactionDate?: string;
  avgTransactionsPerMonth?: number;
};

type TxResult = {
  burn_block_time_iso?: string;
  block_time_iso?: string;
};

type TxListResponse = {
  total?: number;
  results?: TxResult[];
};

function formatMonthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getTxDate(tx: TxResult) {
  return tx.burn_block_time_iso || tx.block_time_iso || null;
}

async function fetchTxPage(address: string, limit: number, offset: number) {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (HIRO_API_KEY) {
      headers["x-api-key"] = HIRO_API_KEY;
    } else {
      console.warn("[Hiro API] HIRO_API_KEY not set - requests may be rate-limited");
    }

    const url = `${API_BASE}/extended/v1/address/${address}/transactions?limit=${limit}&offset=${offset}`;
    
    const res = await fetch(url, {
      headers,
      cache: 'no-store',
      // Tag cache entries per-address so we can target revalidation
      next: { revalidate: 900, tags: [`volume:${address}`] },
    } as any);

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "<no body>");
      console.error("[Hiro API] Non-OK response", {
        status: res.status,
        statusText: res.statusText,
        url,
        bodyPreview: bodyText.slice(0, 300),
      });
      // Some addresses return 400 when the API can't parse or find results; treat as empty.
      if (res.status === 400) {
        return { total: 0, results: [] } satisfies TxListResponse;
      }
      throw new Error(`Failed to fetch transactions: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as TxListResponse;
    return data;
  } catch (err) {
    console.error("fetchTxPage error:", err);
    throw err;
  }
}

export async function fetchVolumeStats(
  address: string,
  year = 2025,
  pageSize = 50
): Promise<VolumeStats | null> {
  if (!address) return null;

  const now = new Date();
  const yearStart = new Date(year, 0, 1); // Jan 1 of the year
  const yearEnd = year === now.getFullYear() 
    ? now 
    : new Date(year, 11, 31, 23, 59, 59); // Dec 31 or now if current year

  // Create month buckets for the year
  const monthOrder: Date[] = [];
  for (let month = 0; month < 12; month++) {
    monthOrder.push(new Date(year, month, 1));
  }

  const monthMap = new Map<string, { month: string; count: number }>();
  monthOrder.forEach((date) => {
    monthMap.set(monthKey(date), { month: formatMonthLabel(date), count: 0 });
  });

  // Robust pagination with in-loop aggregation
  let offset = 0;
  let total = Infinity; // unknown until first page
  const MAX_SAFE_TRANSACTIONS = 10000;
  let processedCount = 0;
  let firstTxInYear: Date | null = null;
  let txCountInYear = 0;

  // Pagination: fetch up to MAX_SAFE_TRANSACTIONS or until outside lookback window
  while (offset < total && processedCount < MAX_SAFE_TRANSACTIONS) {
    try {
      const page = await fetchTxPage(address, pageSize, offset);
      total = page.total ?? total;
      const results = page.results || [];

      if (!results.length) {
        console.log("[fetchVolumeStats] No results at offset", offset, "stopping");
        break;
      }

      let allOutsideYear = true;
      for (const tx of results) {
        const iso = getTxDate(tx);
        if (!iso) continue;
        const txDate = new Date(iso);

        // Check if transaction is within the target year
        if (txDate >= yearStart && txDate <= yearEnd) {
          const key = monthKey(txDate);
          const entry = monthMap.get(key);
          if (entry) entry.count += 1;
          txCountInYear++;
          
          // Track the earliest transaction within the year
          if (!firstTxInYear || txDate < firstTxInYear) {
            firstTxInYear = txDate;
          }
          
          allOutsideYear = false;
        }
      }

      processedCount += results.length;

      if (allOutsideYear) {
        // Check if oldest tx on this page is before year start - if so, stop
        const oldestTx = results[results.length - 1];
        const oldestIso = getTxDate(oldestTx);
        if (oldestIso && new Date(oldestIso) < yearStart) {
          break;
        }
      }

      offset += pageSize;
    } catch (err) {
      console.error("[fetchVolumeStats] Error fetching page at offset", offset, err);
      break;
    }
  }

  // If total remains Infinity, set to processedCount
  if (total === Infinity) total = processedCount;

  const firstTxDate = firstTxInYear ? firstTxInYear.toLocaleDateString() : undefined;

  const monthlyData = Array.from(monthMap.values());
  const busiest = monthlyData.reduce(
    (prev, curr) => (curr.count > prev.count ? curr : prev),
    monthlyData[0] || { month: "N/A", count: 0 }
  );

  // Calculate average transactions per month (divide by months elapsed in the year)
  const monthsInYear = year === now.getFullYear() ? now.getMonth() + 1 : 12;
  const avgTransactionsPerMonth = Math.round(txCountInYear / monthsInYear);

  const result = {
    totalTransactions: txCountInYear,
    busiestMonth: busiest?.month || "N/A",
    monthlyData,
    firstTransactionDate: firstTxDate,
    avgTransactionsPerMonth,
  } satisfies VolumeStats;

  return result;
}
