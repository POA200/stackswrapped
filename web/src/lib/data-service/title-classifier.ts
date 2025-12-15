// Local title classifier used by the web app API.
// Mirrors packages/data-service/src/title-classifier.ts but avoids cross-package import issues.

export type Title = {
  title: string;
  description: string;
  badgeSvg: string; // filename under /public
};

export type TopHolding = { daysHeld?: number } | number;

export type Metrics = {
  totalTransactions?: number;
  totalContractInteractions?: number;
  totalCollectionsOwned?: number;
  top5Holdings?: TopHolding[]; // each item has daysHeld (number) or is a number
};

const Titles = {
  WHALE_TRADER: {
    title: 'Whale Trader',
    description: 'Massive on-chain activity with 1,200+ transactions in 2025.',
    badgeSvg: 'WhaleTrader.svg',
  },
  DEFI_GURU: {
    title: 'DeFi Guru',
    description: 'A power user of DeFi protocols with 300+ contract interactions.',
    badgeSvg: 'DeFiGuru.svg',
  },
  HODL_HERO: {
    title: 'HODL Hero',
    description: 'Diamond hands — held all top 5 tokens for 300+ days.',
    badgeSvg: 'HodlHeroBadge.svg',
  },
  ELITE_COLLECTOR: {
    title: 'Elite Collector',
    description: 'Owns 10+ NFT collections across the Stacks ecosystem.',
    badgeSvg: 'EliteCollector.svg',
  },
  STACKS_VOYAGER: {
    title: 'The Stacks Voyager',
    description: 'Exploring the Stacks ecosystem — keep going, the best is ahead.',
    badgeSvg: 'StacksVoyager.svg',
  },
} as const;

function getDaysHeld(h: TopHolding): number {
  if (typeof h === 'number') return h;
  const v = h?.daysHeld;
  return typeof v === 'number' ? v : 0;
}

/**
 * Classify the user title based on final metrics.
 * Priority: Whale → DeFi → HODL → Collector → Default
 */
export function classifyTitle(metrics: Metrics): Title {
  const totalTx = metrics.totalTransactions ?? 0;
  const defiCalls = metrics.totalContractInteractions ?? 0;
  const collections = metrics.totalCollectionsOwned ?? 0;
  const top5 = Array.isArray(metrics.top5Holdings) ? metrics.top5Holdings : [];

  // 1. Whale Trader: totalTransactions >= 1200
  if (totalTx >= 1200) return Titles.WHALE_TRADER;

  // 2. DeFi Guru: totalContractInteractions > 300
  if (defiCalls > 300) return Titles.DEFI_GURU;

  // 3. HODL Hero: all top 5 tokens held > 300 days
  if (top5.length >= 5 && top5.every((h) => getDaysHeld(h) > 300)) {
    return Titles.HODL_HERO;
  }

  // 4. Elite Collector: totalCollectionsOwned >= 10
  if (collections >= 10) return Titles.ELITE_COLLECTOR;

  // 5. Default
  return Titles.STACKS_VOYAGER;
}

export { Titles };
