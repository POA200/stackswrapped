const DEFAULT_API = "https://api.hiro.so";
const API_BASE = process.env.NEXT_PUBLIC_HIRO_API || DEFAULT_API;

export type VolumeStats = {
  totalTransactions: number;
  busiestMonth: string;
  monthlyData: Array<{ month: string; count: number }>;
  firstTransactionDate?: string;
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
  const res = await fetch(
    `${API_BASE}/extended/v1/address/${address}/transactions?limit=${limit}&offset=${offset}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    // Some addresses return 400 when the API can't parse or find results; treat as empty.
    if (res.status === 400) {
      return { total: 0, results: [] } satisfies TxListResponse;
    }
    throw new Error(`Failed to fetch transactions: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as TxListResponse;
  return data;
}

export async function fetchVolumeStats(
  address: string,
  lookbackMonths = 12,
  pageSize = 200
): Promise<VolumeStats | null> {
  if (!address) return null;

  const now = new Date();
  const monthOrder: Date[] = [];
  for (let i = lookbackMonths - 1; i >= 0; i -= 1) {
    monthOrder.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }

  const monthMap = new Map<string, { month: string; count: number }>();
  monthOrder.forEach((date) => {
    monthMap.set(monthKey(date), { month: formatMonthLabel(date), count: 0 });
  });

  const firstPage = await fetchTxPage(address, pageSize, 0);
  const transactions = firstPage.results || [];
  const total = firstPage.total ?? transactions.length;

  transactions.forEach((tx) => {
    const iso = getTxDate(tx);
    if (!iso) return;
    const txDate = new Date(iso);
    const diffMonths =
      (now.getFullYear() - txDate.getFullYear()) * 12 +
      (now.getMonth() - txDate.getMonth());
    if (diffMonths < 0 || diffMonths >= lookbackMonths) return;
    const key = monthKey(txDate);
    const entry = monthMap.get(key);
    if (entry) entry.count += 1;
  });

  let firstTxDate: string | undefined;
  try {
    if (total > 0) {
      const lastOffset = Math.max(0, total - 1);
      const lastPage = await fetchTxPage(address, 1, lastOffset);
      const candidate = lastPage.results?.[0];
      const iso = candidate && getTxDate(candidate);
      if (iso) firstTxDate = new Date(iso).toLocaleDateString();
    }
  } catch (err) {
    console.warn("Failed to fetch earliest transaction", err);
  }

  if (!firstTxDate && transactions.length) {
    const iso = getTxDate(transactions[transactions.length - 1]);
    if (iso) firstTxDate = new Date(iso).toLocaleDateString();
  }

  const monthlyData = Array.from(monthMap.values());
  const busiest = monthlyData.reduce(
    (prev, curr) => (curr.count > prev.count ? curr : prev),
    monthlyData[0] || { month: "N/A", count: 0 }
  );

  return {
    totalTransactions: total,
    busiestMonth: busiest?.month || "N/A",
    monthlyData,
    firstTransactionDate: firstTxDate,
  };
}
