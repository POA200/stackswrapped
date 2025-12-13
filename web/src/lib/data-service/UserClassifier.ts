import type { AddressTransaction } from '@stacks/blockchain-api-client';

export const Badges = {
  HODL_HERO: 'HODL Hero',
  YIELD_MASTER: 'DeFi Guru',
  STACKS_CURATOR: 'Stacks Curator',
  EXPLORER: 'Explorer',
} as const;

export type BadgeTitle = typeof Badges[keyof typeof Badges];

const Weights = {
  DEFI: 5,
  NFT: 3,
  TRANSFER: 1,
  LONGEVITY: 10,
};

function isDefiContractCall(tx: AddressTransaction): boolean {
  const contractId = (tx as any)?.contract_call?.contract_id || '';
  return /alex|bitflow|friedger|arkadiko/i.test(contractId);
}

function isNftTransfer(tx: AddressTransaction): boolean {
  const txType = (tx as any)?.tx_type || '';
  const eventType = (tx as any)?.event?.type || '';
  const memo = (tx as any)?.memo || '';
  // Check if it's a smart_contract transaction (NFT) or has NFT-related keywords
  return txType === 'smart_contract' || /nft|megapont|bns/i.test(eventType + memo);
}

function isStxTransfer(tx: AddressTransaction): boolean {
  return (tx as any)?.tx_type === 'token_transfer';
}

export function classifyUser(transactions: AddressTransaction[], longestHoldDays: number): BadgeTitle {
  let defi = 0;
  let nft = 0;
  let transfer = 0;
  let longevity = 0;

  for (const tx of transactions) {
    if (isDefiContractCall(tx)) defi += Weights.DEFI;
    else if (isNftTransfer(tx)) nft += Weights.NFT;
    else if (isStxTransfer(tx)) transfer += Weights.TRANSFER;
  }

  if (longestHoldDays >= 365) longevity += Weights.LONGEVITY * 2;
  else if (longestHoldDays >= 180) longevity += Weights.LONGEVITY;

  // Classification rules with improved logic
  // 1. Very long hold time (300+ days) takes priority = HODL Hero
  if (longestHoldDays >= 300) return Badges.HODL_HERO;
  
  // 2. High NFT activity (collector) = Stacks Curator
  if (nft > defi && nft > transfer) return Badges.STACKS_CURATOR;
  
  // 3. High DeFi activity with moderate+ hold time = DeFi Guru
  if (defi > nft && defi > transfer && longestHoldDays >= 100) return Badges.YIELD_MASTER;
  
  // 4. Strong longevity / HODL score = HODL Hero
  if (longevity >= Weights.LONGEVITY && longestHoldDays >= 180) return Badges.HODL_HERO;
  
  // 5. Default for balanced/low activity = Explorer
  return Badges.EXPLORER;
}
