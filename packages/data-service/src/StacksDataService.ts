import { TransactionsApi, AccountsApi, FungibleTokensApi, NonFungibleTokensApi, Configuration } from '@stacks/blockchain-api-client';
import type { Transaction } from '@stacks/blockchain-api-client';

export class StacksDataService {
  private cfg: Configuration;
  private txApi: TransactionsApi;
  private accountsApi: AccountsApi;
  private ftApi: FungibleTokensApi;
  private nftApi: NonFungibleTokensApi;

  constructor(basePath: string = 'https://api.mainnet.hiro.so') {
    this.cfg = new Configuration({ basePath });
    this.txApi = new TransactionsApi(this.cfg);
    this.accountsApi = new AccountsApi(this.cfg);
    this.ftApi = new FungibleTokensApi(this.cfg);
    this.nftApi = new NonFungibleTokensApi(this.cfg);
  }

  async getUserTransactions(address: string, limit: number = 50, offset: number = 0): Promise<Transaction[]> {
    try {
      const resp = await this.txApi.getTransactionsByAddress({ address, limit, offset });
      const txs = resp?.results || [];
      return txs as Transaction[];
    } catch (err) {
      console.error('getUserTransactions error', err);
      return [];
    }
  }

  async fetchAllTransactions(address: string, maxTransactions: number = 1000): Promise<Transaction[]> {
    const all: Transaction[] = [];
    let offset = 0;
    const limit = 50;

    while (all.length < maxTransactions) {
      const batch = await this.getUserTransactions(address, limit, offset);
      if (!batch.length) break;
      all.push(...batch);
      offset += limit;
      if (batch.length < limit) break; // no more pages
    }

    return all.slice(0, maxTransactions);
  }

  async fetchFungibleTokenBalances(address: string) {
    try {
      const balances = await this.ftApi.getFungibleTokenBalances({ address });
      return balances?.results || [];
    } catch (err) {
      console.error('fetchFungibleTokenBalances error', err);
      return [];
    }
  }

  async fetchNftHoldings(address: string) {
    try {
      const holdings = await this.nftApi.getNonFungibleTokenHoldings({ principal: address });
      return holdings?.results || [];
    } catch (err) {
      console.error('fetchNftHoldings error', err);
      return [];
    }
  }

  /**
   * Calculate the largest native STX transfer from a list of transactions.
   * Returns amount in STX (not micro-STX) and the transaction id.
   */
  public calculateLargestStxTransfer(transactions: Transaction[]): { amountStx: number; txId: string } | null {
    let maxAmountUSTX = 0n;
    let maxTxId: string | null = null;

    for (const tx of transactions || []) {
      const txAny = tx as any;
      if (txAny?.tx_type !== 'token_transfer') continue;

      // Heuristics: native STX transfers typically have no token symbol, or symbol 'STX'
      const symbol = txAny?.token_transfer?.token?.symbol || txAny?.token_transfer?.asset?.symbol || 'STX';
      if (symbol && symbol.toUpperCase() !== 'STX') continue;

      const amountStr: string | undefined = txAny?.token_transfer?.amount;
      if (!amountStr) continue;

      let amountUSTX: bigint;
      try {
        amountUSTX = BigInt(amountStr);
      } catch {
        continue;
      }

      if (amountUSTX > maxAmountUSTX) {
        maxAmountUSTX = amountUSTX;
        maxTxId = txAny?.tx_id || txAny?.txid || null;
      }
    }

    if (maxTxId === null) return null;

    const amountStx = Number(maxAmountUSTX) / 1_000_000; // convert uSTX to STX
    return { amountStx, txId: maxTxId };
  }
}
