import { Configuration, AccountsApi, NonFungibleTokensApi } from '@stacks/blockchain-api-client';

// Extend RequestInit to include Next.js fetch cache options
interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

export class StacksDataService {
  private config: Configuration;
  private accounts: AccountsApi;
  private nfts: NonFungibleTokensApi;

  constructor(basePath: string = 'https://api.mainnet.hiro.so') {
    // Create a custom fetch function with Next.js caching (15 minutes = 900 seconds)
    const cachedFetch = (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      return fetch(url, {
        ...init,
        next: { revalidate: 900 }
      } as RequestInit & { next?: NextFetchRequestConfig });
    };

    this.config = new Configuration({ basePath, fetchApi: cachedFetch as any });
    this.accounts = new AccountsApi(this.config);
    this.nfts = new NonFungibleTokensApi(this.config);
  }

  async getUserTransactions(address: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      const data = await this.accounts.getAccountTransactions({ principal: address, limit, offset });
      const results = (data as any)?.results || [];
      return results;
    } catch (err) {
      console.error('getUserTransactions error', err);
      return [];
    }
  }

  async fetchAllTransactions(address: string, maxTransactions: number = 1000): Promise<any[]> {
    const all: any[] = [];
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
      const data = await this.accounts.getAccountBalance({ principal: address });
      const ft = (data as any)?.fungible_tokens;
      return ft ? Object.entries(ft).map(([asset, balance]) => ({
        asset: { 
          symbol: asset.split('::')[1] || asset,
          identifier: asset 
        },
        balance
      })) : [];
    } catch (err) {
      console.error('fetchFungibleTokenBalances error', err);
      return [];
    }
  }

  async fetchNftHoldings(address: string) {
    try {
      const holdings = await this.nfts.getNftHoldings({ principal: address, limit: 50, offset: 0 });
      return (holdings as any)?.results || [];
    } catch (err) {
      console.error('fetchNftHoldings error', err);
      return [];
    }
  }

  /**
   * Fetch all NFT holdings with pagination.
   */
  async fetchFullNftHoldings(address: string): Promise<{ allNfts: any[]; total: number }> {
    const allNfts: any[] = [];
    let offset = 0;
    const limit = 50;
    let total = Infinity;

    while (offset < total) {
      try {
        const page = await this.nfts.getNftHoldings({ principal: address, limit, offset });
        const results = (page as any)?.results || [];
        const pageTotal = (page as any)?.total;

        if (Number.isFinite(pageTotal)) {
          total = Number(pageTotal);
        }

        if (!results.length) {
          break;
        }

        allNfts.push(...results);
        offset += results.length;

        if (results.length < limit) {
          break;
        }
      } catch (err) {
        console.error('fetchFullNftHoldings error', err);
        break;
      }
    }

    return { allNfts, total: Number.isFinite(total) ? Number(total) : allNfts.length };
  }

  /**
   * Calculate the largest native STX transfer from a list of transactions.
   * Returns amount in STX (not micro-STX) and the transaction id.
   */
  public calculateLargestStxTransfer(transactions: any[]): { amountStx: number; txId: string } | null {
    let maxAmountUSTX = BigInt(0);
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
