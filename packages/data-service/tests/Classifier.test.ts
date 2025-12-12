/**
 * FILE: packages/data-service/tests/Classifier.test.ts
 *
 * PURPOSE: A test module to validate the UserClassifier's logic using mock transaction data.
 *
 * STACK CONTEXT:
 * - Pure TypeScript/Node.js test file.
 * - Imports: classifyUser function and Badges from the UserClassifier module.
 * - Uses simple console logs/assertions instead of a formal testing framework.
 */

import { classifyUser, Badges, type BadgeTitle } from '../src/UserClassifier';
import type { Transaction } from '@stacks/blockchain-api-client';

// ============================================================================
// HELPER: Create Mock Transaction Array
// ============================================================================

/**
 * Helper function to generate mock transactions for testing
 * @param defiCount - Number of DeFi contract calls to create
 * @param nftCount - Number of NFT transfers to create
 * @param stxTransfersCount - Number of regular STX transfers to create
 */
function createMockTransactions(
  defiCount: number,
  nftCount: number,
  stxTransfersCount: number = 5
): Partial<Transaction>[] {
  const transactions: Partial<Transaction>[] = [];

  // Add DeFi contract calls (ALEX, BitFlow, Arkadiko)
  const defiProtocols = [
    'SP2C2YFP3SJQV326LG7JLLTSVV3GZ4NPJE3XGYJF.alex-dex-v1',
    'SP2C2YFP3SJQV326LG7JLLTSVV3GZ4NPJE3XGYJF.bitflow-swap',
    'SP3K8BC0PPEAAK7NFYJGQJYW7FHWG4HHV2EGFBUJ.arkadiko-collateral',
  ];

  for (let i = 0; i < defiCount; i++) {
    transactions.push({
      tx_type: 'contract_call',
      contract_call: {
        contract_id: defiProtocols[i % defiProtocols.length],
      },
    } as any);
  }

  // Add NFT transfers
  for (let i = 0; i < nftCount; i++) {
    transactions.push({
      tx_type: 'smart_contract',
    } as any);
  }

  // Add regular STX transfers
  for (let i = 0; i < stxTransfersCount; i++) {
    transactions.push({
      tx_type: 'token_transfer',
    });
  }

  return transactions;
}

// ============================================================================
// TEST CASES - User Profiles
// ============================================================================

interface TestCase {
  name: string;
  longestHoldDays: number;
  nftTransfers: number;
  defiContractCalls: number;
  expectedBadge: BadgeTitle;
}

const TEST_CASES: TestCase[] = [
  {
    name: 'HODL Hero Test',
    longestHoldDays: 300,
    nftTransfers: 3,
    defiContractCalls: 5,
    expectedBadge: Badges.HODL_HERO,
  },
  {
    name: 'Stacks Curator Test',
    longestHoldDays: 60,
    nftTransfers: 80,
    defiContractCalls: 10,
    expectedBadge: Badges.STACKS_CURATOR,
  },
  {
    name: 'Yield Master (DeFi Guru) Test',
    longestHoldDays: 120,
    nftTransfers: 5,
    defiContractCalls: 350,
    expectedBadge: Badges.YIELD_MASTER,
  },
];

/**
 * Main test runner function
 * Executes classifyUser for each test case and reports results
 */
export function runTests(): void {
  console.log('\n' + '='.repeat(70));
  console.log('UserClassifier Test Suite');
  console.log('='.repeat(70) + '\n');

  let passCount = 0;
  let failCount = 0;

  for (const testCase of TEST_CASES) {
    console.log(`Test: ${testCase.name}`);
    console.log(
      `  Hold Days: ${testCase.longestHoldDays}, NFT Transfers: ${testCase.nftTransfers}, DeFi Calls: ${testCase.defiContractCalls}`
    );

    try {
      // Create mock transactions based on the test case parameters
      const transactions = createMockTransactions(
        testCase.defiContractCalls,
        testCase.nftTransfers
      );

      const result = classifyUser(transactions as any, testCase.longestHoldDays);

      if (result === testCase.expectedBadge) {
        console.log(`  ✓ PASS: Got expected badge "${result}"\n`);
        passCount++;
      } else {
        console.log(
          `  ✗ FAIL: Expected "${testCase.expectedBadge}" but got "${result}"\n`
        );
        failCount++;
      }
    } catch (error) {
      console.log(
        `  ✗ ERROR: ${
          error instanceof Error ? error.message : String(error)
        }\n`
      );
      failCount++;
    }
  }

  // Summary
  console.log('='.repeat(70));
  console.log(
    `Test Results: ${passCount} passed, ${failCount} failed out of ${TEST_CASES.length} tests`
  );
  console.log('='.repeat(70) + '\n');

  if (failCount === 0) {
    console.log('✓ All tests passed!');
  } else {
    console.log(`✗ ${failCount} test(s) failed.`);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}
