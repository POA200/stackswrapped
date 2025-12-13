import { NextRequest, NextResponse } from 'next/server';
import { StacksDataService } from '../../../../../../packages/data-service/src/StacksDataService';
import { classifyUser } from '../../../../../../packages/data-service/src/UserClassifier';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
    }

    const service = new StacksDataService();

    // Fetch raw data
    const max = 5000;
    const transactions = await service.fetchAllTransactions(address, max);
    const { allNfts: nftHoldings, total: nftTotal } = await service.fetchFullNftHoldings(address);
    const ftBalances = await service.fetchFungibleTokenBalances(address);

    // Calculate top 5 rarest NFTs
    const topNFTs = nftHoldings
      .map((nft: any) => {
        const assetId = nft.asset_identifier || nft.asset?.asset_id || '';
        const parts = assetId.split('::');
        const collectionName = parts[1] || parts[0] || 'Unknown';
        const tokenId = nft.value?.repr || nft.token_id || '';
        const name = `${collectionName} #${tokenId}`;
        const supply = nft.count || 10000;
        const rarity = Math.max(1, Math.min(99, 100 - Math.floor((supply / 10000) * 100)));
        
        return {
          name,
          collection: collectionName,
          rarity
        };
      })
      .sort((a: any, b: any) => b.rarity - a.rarity)
      .slice(0, 5);

    // Basic placeholder analytics
    const totalTransactions = transactions.length;
    const firstTxDate = transactions[0]?.burn_block_time_iso || null;
    const busiestMonth = null; // TODO: compute by grouping by month
    const longestHoldDays = 0; // TODO: compute from balances/tx history

    const badgeTitle = classifyUser(transactions as any, longestHoldDays);

    const volumeUSD = transactions
      .filter((tx: any) => tx.tx_type === 'token_transfer')
      .reduce((sum: number, tx: any) => sum + (tx.token_transfer?.amount ? Number(tx.token_transfer.amount) : 0), 0);

    const response = {
      address,
      metrics: {
        totalTransactions,
        firstTxDate,
        busiestMonth,
        longestHoldDays,
        volumeUSD,
        nftCount: nftTotal,
        topNFTs,
        topToken: ftBalances?.[0]?.asset?.symbol || 'STX',
      },
      badge: {
        title: badgeTitle,
      },
      raw: {
        transactionsCount: transactions.length,
        nftHoldingsCount: nftTotal,
        ftBalancesCount: ftBalances.length,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error('GET /api/wrapped error:', err);
    return NextResponse.json({ error: 'Internal Server Error', detail: err?.message || String(err) }, { status: 500 });
  }
}
