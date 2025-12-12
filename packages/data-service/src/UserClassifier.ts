/**
 * FILE: packages/data-service/src/UserClassifier.ts
 *
 * PURPOSE: A TypeScript module to analyze a user's raw transaction history and assign a "Club Badge" title based on weighted activity scores.
 *
 * STACK CONTEXT:
 * - Pure TypeScript/Node.js module. It consumes the raw data retrieved by StacksDataService.
 * - This logic is crucial for determining the final card content.
 *
 * REQUIREMENTS:
 * 1. Score System: Create a weighted scoring object (e.g., Weights) for different activities:
 *    - DeFi (Contract calls to ALEX, BitFlow, etc.): High Weight (5 points)
 *    - NFT (Transfer events for Megapont, BNS): Medium Weight (3 points)
 *    - Simple STX Transfer: Low Weight (1 point)
 *    - Longevity (HODL Score): Very High Weight (10 points)
 * 2. Classification Function: Create a function `classifyUser(transactions: Transaction[], longestHoldTime: number)` that:
 *    - Iterates through transactions and aggregates scores into categories (DEFI_SCORE, NFT_SCORE, TRANSFER_SCORE).
 *    - Assigns the final badge (e.g., 'DIAMOND_HAND_WHALE', 'YIELD_MASTER', 'STACKS_CURATOR') based on the highest score category.
 *    - Example Rule: IF DEFI_SCORE > NFT_SCORE AND longestHoldTime > 180 days THEN return 'YIELD_MASTER'.
 * 3. Badges: Define an enumeration or map for all the final badge titles we designed (e.g., 'HODL Hero', 'DeFi Guru', 'Stacks Curator', 'Explorer').
 */

import type { Transaction } from '@stacks/blockchain-api-client';

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

function isDefiContractCall(tx: Transaction): boolean {
  const contractId = (tx as any)?.contract_call?.contract_id || '';
  return /alex|bitflow|friedger|arkadiko/i.test(contractId);
}

function isNftTransfer(tx: Transaction): boolean {
  const txType = (tx as any)?.tx_type || '';
  const eventType = (tx as any)?.event?.type || '';
  const memo = (tx as any)?.memo || '';
  // Check if it's a smart_contract transaction (NFT) or has NFT-related keywords
  return txType === 'smart_contract' || /nft|megapont|bns/i.test(eventType + memo);
}

function isStxTransfer(tx: Transaction): boolean {
  return (tx as any)?.tx_type === 'token_transfer';
}

export function classifyUser(transactions: Transaction[], longestHoldDays: number): BadgeTitle {
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
