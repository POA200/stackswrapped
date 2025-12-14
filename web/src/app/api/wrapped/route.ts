import { NextRequest, NextResponse } from 'next/server';
import { StacksDataService } from '@/lib/data-service/StacksDataService';
import { classifyUser } from '@/lib/data-service/UserClassifier';
import { classifyTitle } from '@/lib/data-service/title-classifier';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
    }

    const service = new StacksDataService();

    const fetchTokenTransfers = async (addr: string, max = 2000) => {
      try {
        const limit = 200;
        let offset = 0;
        const all: any[] = [];
        while (all.length < max) {
          const url = `https://api.mainnet.hiro.so/extended/v1/address/${addr}/token_transfers?limit=${limit}&offset=${offset}`;
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(url, { 
              next: { revalidate: 300 },
              signal: controller.signal
            });
            clearTimeout(timeout);
            if (!res.ok) break;
            const data = await res.json();
            const results = (data as any)?.results || [];
            if (!results.length) break;
            all.push(...results);
            offset += results.length;
            if (results.length < limit) break;
          } catch (pageErr) {
            console.warn(`[fetchTokenTransfers] page fetch failed at offset ${offset}:`, pageErr);
            break;
          }
        }
        return all.slice(0, max);
      } catch (err) {
        console.warn('[fetchTokenTransfers] error:', err);
        return [];
      }
    };

    // Fetch raw data
    const max = 5000;
    const transactions = await service.fetchAllTransactions(address, max);
    const { allNfts: nftHoldings, total: nftTotal } = await service.fetchFullNftHoldings(address);
    const ftBalances = await service.fetchFungibleTokenBalances(address);
    
    let tokenTransfers: any[] = [];
    try {
      tokenTransfers = await fetchTokenTransfers(address);
    } catch (err) {
      console.warn('[/api/wrapped] fetchTokenTransfers failed, continuing without:', err);
      tokenTransfers = [];
    }

    const toDate = (value: any): Date | null => {
      if (!value) return null;
      if (value instanceof Date) return value;
      if (typeof value === 'number') {
        // Stacks API numeric times are seconds since epoch
        return new Date(value * 1000);
      }
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    // Find NFT transactions in 2025 (best-effort)
    const year2025Start = new Date('2025-01-01T00:00:00Z');
    const year2025End = new Date('2026-01-01T00:00:00Z');

    // Map each holding to its most recent transaction date
    const holdingAcquisitionDates = new Map<string, Date>();
    const txDateById = new Map<string, Date>();
    const blockDateByHeight = new Map<number, Date>();
    const tokenFirstSeen = new Map<string, Date>();
    const tokenSeenIn2025 = new Map<string, Date>();
    const protocolInteractions = new Map<string, number>();
    let largestStxTransferMicro = 0; // track largest single STX transfer in 2025 (microstacks)
    let earliestTxDate: Date | null = null;

    const nameFromAssetId = (assetId: string) => {
      if (!assetId) return 'Unknown';
      const parts = assetId.split('::');
      return parts[1] || parts[0] || assetId;
    };

    // Create a map of token names to contract IDs for logo fetching
    const tokenNameToContractId = new Map<string, string>();
    if (Array.isArray(ftBalances)) {
      ftBalances.forEach((ft: any) => {
        const assetId = ft.asset?.identifier || ft.asset?.asset_id || '';
        const name = ft.asset?.symbol || nameFromAssetId(assetId);
        if (name && assetId && name !== 'STX' && name !== 'stx') {
          tokenNameToContractId.set(name, assetId);
        }
      });
    }
    console.log(`[/api/wrapped] Token name to contract ID map:`, Array.from(tokenNameToContractId.entries()).slice(0, 5));

    let nftTransactionCount = 0;
    transactions.forEach((tx: any) => {
      const txDate =
        toDate(tx.burn_block_time_iso) ||
        toDate(tx.block_time_iso) ||
        toDate(tx.burn_block_time) ||
        toDate(tx.block_time);
      if (!txDate) return;

      if (tx.tx_id) {
        txDateById.set(tx.tx_id, txDate);
      }
      if (typeof tx.block_height === 'number') {
        blockDateByHeight.set(tx.block_height, txDate);
      }

      if (!earliestTxDate || txDate < earliestTxDate) {
        earliestTxDate = txDate;
      }

      if (Array.isArray(tx.events)) {
        tx.events.forEach((ev: any) => {
          if (ev.event_type === 'nft_transfer' && ev.asset_identifier) {
            nftTransactionCount++;
            const assetId = ev.asset_identifier;
            const currentDate = holdingAcquisitionDates.get(assetId);
            if (!currentDate || txDate > currentDate) {
              holdingAcquisitionDates.set(assetId, txDate);
            }
          } else if (ev.event_type === 'ft_transfer') {
            const assetId = ev.asset_identifier || ev.asset?.identifier;
            if (assetId) {
              const tokenName = nameFromAssetId(assetId);
              const current = tokenFirstSeen.get(tokenName);
              if (!current || txDate < current) {
                tokenFirstSeen.set(tokenName, txDate);
              }
              if (txDate >= year2025Start && txDate < year2025End) {
                const existing = tokenSeenIn2025.get(tokenName);
                if (!existing || txDate < existing) {
                  tokenSeenIn2025.set(tokenName, txDate);
                }
              }
            }
          }
        });
      }

      if (tx.nft_transfer_list && Array.isArray(tx.nft_transfer_list) && tx.nft_transfer_list.length > 0) {
        tx.nft_transfer_list.forEach((nftTransfer: any) => {
          const assetId = nftTransfer.asset_identifier;
          if (!assetId) return;
          nftTransactionCount++;
          const currentDate = holdingAcquisitionDates.get(assetId);
          if (!currentDate || txDate > currentDate) {
            holdingAcquisitionDates.set(assetId, txDate);
          }
        });
      }

      // Track fungible token first-seen dates for hold duration
      if (tx.tx_type === 'token_transfer') {
        const symbol =
          tx.token_transfer?.token?.symbol ||
          tx.token_transfer?.asset?.symbol ||
          tx.token_transfer?.token ||
          'STX';
        if (symbol && txDate) {
          const current = tokenFirstSeen.get(symbol);
          if (!current || txDate < current) {
            tokenFirstSeen.set(symbol, txDate);
          }
          if (txDate >= year2025Start && txDate < year2025End) {
            const existing = tokenSeenIn2025.get(symbol);
            if (!existing || txDate < existing) {
              tokenSeenIn2025.set(symbol, txDate);
            }
            // STX token_transfer represents native STX moves; capture largest amount in 2025
            const amt = Number(tx.token_transfer?.amount || 0);
            if (!Number.isNaN(amt) && amt > largestStxTransferMicro) {
              largestStxTransferMicro = amt;
            }
          }
        }
      }
      // Count protocol interactions from contract calls (2025 only)
      try {
        if (tx.tx_type === 'contract_call' && tx.contract_call?.contract_id && txDate) {
          // Only count interactions from 2025
          if (txDate >= year2025Start && txDate < year2025End) {
            const cid = tx.contract_call.contract_id as string;
            const current = protocolInteractions.get(cid) || 0;
            protocolInteractions.set(cid, current + 1);
          }
        }
      } catch {}
    });
    // Token transfers endpoint (fungible) — improve coverage
    tokenTransfers.forEach((tt: any) => {
      const assetId = tt.asset_identifier;
      const name = nameFromAssetId(assetId);
      const ttDate =
        toDate(tt.burn_block_time_iso) ||
        toDate(tt.block_time_iso) ||
        toDate(tt.burn_block_time) ||
        toDate(tt.block_time) ||
        toDate(tt.timestamp);
      if (!name || !ttDate) return;
      const current = tokenFirstSeen.get(name);
      if (!current || ttDate < current) {
        tokenFirstSeen.set(name, ttDate);
      }
      if (ttDate >= year2025Start && ttDate < year2025End) {
        const existing = tokenSeenIn2025.get(name);
        if (!existing || ttDate < existing) {
          tokenSeenIn2025.set(name, ttDate);
        }
      }
    });

    // Fallback: include current FT balances so tokens appear even without transfer events
    if (ftBalances && ftBalances.length > 0) {
      ftBalances.forEach((ft: any) => {
        // Extract name from various possible paths in the balance object
        const assetId = ft.asset?.identifier || ft.asset?.asset_id || '';
        let name = ft.asset?.symbol || nameFromAssetId(assetId);
        
        // If we got just "sbtc-token" from symbol, use full asset ID extraction
        if (!name.includes('::') && assetId.includes('::')) {
          name = nameFromAssetId(assetId);
        }
        
        if (!name || name === 'STX' || name === 'stx') {
          return;
        }
        
        try {
          let balStr = ft.balance;
          if (typeof balStr === 'object') {
            balStr = ft.balance?.balance || ft.balance?.total_sent || ft.balance?.total_received || '0';
          }
          const bal = BigInt(balStr?.toString?.() || '0');
          // Include token if it has activity (total_sent > 0 or total_received > 0)
          if (bal === BigInt(0) && ft.balance?.total_sent === '0' && ft.balance?.total_received === '0') {
            return;
          }
        } catch (e) {
          // If balance can't parse, still include as a fallback token
        }
        
        // Add all non-zero FT balances, even if already in tokenFirstSeen
        if (!tokenFirstSeen.has(name)) {
          const fallbackDate = earliestTxDate || year2025Start;
          tokenFirstSeen.set(name, fallbackDate);
          if (fallbackDate >= year2025Start && fallbackDate < year2025End) {
            tokenSeenIn2025.set(name, fallbackDate);
          }
        }
      });
    }

    console.log(`[/api/wrapped] NFT transactions found: ${nftTransactionCount}`);
    console.log(`[/api/wrapped] Unique NFT asset IDs from transactions: ${holdingAcquisitionDates.size}`);
    console.log(`[/api/wrapped] Total holdings: ${nftHoldings.length}`);
    if (holdingAcquisitionDates.size > 0) {
      const sample = Array.from(holdingAcquisitionDates.entries())[0];
      console.log(`[/api/wrapped] Sample transaction date:`, sample[1]);
    } else if (nftHoldings[0]) {
      console.log('[/api/wrapped] Sample holding keys:', Object.keys(nftHoldings[0]));
    }

    const getAcquisitionDate = (nft: any): Date | null => {
      const assetId = nft.asset_identifier || nft.asset?.asset_id || '';
      const lastTxDate = holdingAcquisitionDates.get(assetId);

      if (lastTxDate) return lastTxDate;

      if (nft.tx_id && txDateById.has(nft.tx_id)) {
        return txDateById.get(nft.tx_id)!;
      }

      if (typeof nft.block_height === 'number' && blockDateByHeight.has(nft.block_height)) {
        return blockDateByHeight.get(nft.block_height)!;
      }

      const dateToCheck =
        nft.block_time_iso ||
        nft.block_time ||
        nft.burn_block_time_iso ||
        nft.received_at ||
        nft.timestamp ||
        nft.created_at;

      return toDate(dateToCheck);
    };

    // Filter holdings to only those acquired in 2025
    let nft2025 = nftHoldings.filter((nft: any) => {
      const date = getAcquisitionDate(nft);
      return !!date && date >= year2025Start && date < year2025End;
    });

    console.log(`[/api/wrapped] Filtered NFTs from 2025: ${nft2025.length}`);

    if (nftTransactionCount > 0 && nft2025.length === 0) {
      console.log(`[/api/wrapped] Fallback: Using all holdings since transactions exist but couldn't filter`);
      nft2025 = nftHoldings;
    }

    const now = new Date();
    const toDaysHeld = (start: Date) => Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86_400_000));

    // Define FT metadata fetcher before using it
    const ftMetadataCache = new Map<string, any>();

    const fetchFTMetadata = async (contractId: string): Promise<any | null> => {
      if (ftMetadataCache.has(contractId)) return ftMetadataCache.get(contractId);
      
      // Extract contract address and name from full identifier
      const parts = contractId.split('::');
      const contractAddress = parts[0]; // e.g., "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token"
      
      const url = `https://api.mainnet.hiro.so/extended/v1/contract/${contractAddress}`;
      try {
        const res = await fetch(url, { next: { revalidate: 900 } });
        if (!res.ok) throw new Error(`contract metadata ${res.status}`);
        const data = await res.json();
        
        // Try to extract token-uri from source code or variables
        let logo: string | undefined;
        const source = data.source_code || '';
        
        // Look for token-uri in the source code
        const uriMatch = source.match(/token-uri.*?u"([^"]+)"/);
        if (uriMatch && uriMatch[1]) {
          logo = uriMatch[1];
        }
        
        const metadata = { image_uri: logo };
        ftMetadataCache.set(contractId, metadata);
        return metadata;
      } catch (err) {
        ftMetadataCache.set(contractId, null);
        return null;
      }
    };

    // Prefer tokens with 2025 activity; if none, fall back to all-time first-seen
    // Always include all-time SIP-010 tokens from FT balances
    const combined = new Map([...tokenSeenIn2025.entries(), ...tokenFirstSeen.entries()]);
    const tokenEntries = combined.entries();

    const topTokensBase = Array.from(tokenEntries)
      .map(([name, firstDate]) => ({
        name,
        sinceDate: firstDate.toISOString(),
        daysHeld: toDaysHeld(firstDate),
      }))
      .sort((a, b) => b.daysHeld - a.daysHeld)
      .slice(0, 5);

    // Fetch logos for top tokens
    const topTokensHeldLongest = await Promise.all(
      topTokensBase.map(async (token) => {
        let logo: string | undefined;
        try {
          const contractId = tokenNameToContractId.get(token.name);
          if (contractId) {
            const metadata = await fetchFTMetadata(contractId);
            logo = metadata?.image_uri || metadata?.logo || metadata?.image;
            
            // If no logo found, try using ALEX tokens API or common token logos
            if (!logo) {
              // Use a common pattern for well-known tokens
              const tokenLogoMap: Record<string, string> = {
                'sbtc-token': 'https://ipfs.io/ipfs/bafkreibqnozdui4ntgoh3oo437lvhg7qrsccmbzhgumwwjf2smb3eegyqu',
                'alex': 'https://assets.alexlab.co/alex-logo-circle.png',
                'aeusdc': 'https://assets.alexlab.co/aeusdc-logo.svg',
                'NYC': 'https://cdn.citycoins.co/logos/newyorkcitycoin.png',
                'MIA': 'https://cdn.citycoins.co/logos/miamicoin.png',
              };
              logo = tokenLogoMap[token.name];
            }
          }
        } catch (err) {
          console.warn(`[/api/wrapped] FT logo fetch failed for ${token.name}:`, err);
        }
        return { ...token, logo };
      })
    );

    const longestTokenHold = topTokensHeldLongest[0] || null;

    // Fetch image metadata for NFTs (best-effort, cached per asset)
    const metadataCache = new Map<string, any[]>();
    const tokenCache = new Map<string, any>();

    const normalizeTokenId = (tokenId: string | number | undefined): string | null => {
      if (tokenId === undefined || tokenId === null) return null;
      if (typeof tokenId === 'number') return tokenId.toString();
      const str = `${tokenId}`;
      if (str.startsWith('u')) return str.slice(1);
      return str;
    };

    const fetchImagesForAsset = async (assetId: string): Promise<any[]> => {
      if (metadataCache.has(assetId)) return metadataCache.get(assetId)!;
      const url = `https://api.mainnet.hiro.so/extended/v1/tokens/nft/metadata?asset_identifiers=${encodeURIComponent(
        assetId,
      )}&limit=50`;
      try {
        const res = await fetch(url, { next: { revalidate: 900 } });
        if (!res.ok) throw new Error(`metadata ${res.status}`);
        const data = await res.json();
        const results = (data as any)?.results || [];
        metadataCache.set(assetId, results);
        return results;
      } catch (err) {
        console.warn(`[/api/wrapped] metadata fetch failed for ${assetId}`, err);
        metadataCache.set(assetId, []);
        return [];
      }
    };

    const fetchTokenMetadata = async (assetId: string, tokenId: string): Promise<any | null> => {
      const cacheKey = `${assetId}::${tokenId}`;
      if (tokenCache.has(cacheKey)) return tokenCache.get(cacheKey);
      const [contractId] = assetId.split('::');
      const url = `https://api.mainnet.hiro.so/extended/v1/tokens/nft/metadata/${contractId}/${tokenId}`;
      try {
        const res = await fetch(url, { next: { revalidate: 900 } });
        if (!res.ok) throw new Error(`token metadata ${res.status}`);
        const data = await res.json();
        tokenCache.set(cacheKey, data);
        return data;
      } catch (err) {
        tokenCache.set(cacheKey, null);
        return null;
      }
    };

    const withImages = await Promise.all(
      nft2025.map(async (nft: any) => {
        const assetId = nft.asset_identifier || nft.asset?.asset_id || '';
        const tokenIdRaw = nft.value?.repr || nft.token_id || nft.name;
        const tokenId = normalizeTokenId(tokenIdRaw);
        let image: string | undefined;

        try {
          if (assetId) {
            const metaList = await fetchImagesForAsset(assetId);
            if (tokenId && Array.isArray(metaList)) {
              const match = metaList.find((m: any) => normalizeTokenId(m.token_id) === tokenId);
              image = match?.metadata?.image || match?.image || match?.metadata?.image_url;
              if (!image) {
                const tokenMeta = await fetchTokenMetadata(assetId, tokenId);
                image = tokenMeta?.metadata?.image || tokenMeta?.image || tokenMeta?.metadata?.image_url;
              }
            } else if (metaList[0]) {
              image = metaList[0]?.metadata?.image || metaList[0]?.image || metaList[0]?.metadata?.image_url;
            }
          }
        } catch (imgErr) {
          console.warn(`[/api/wrapped] NFT image fetch failed for ${assetId}::${tokenId}:`, imgErr);
        }

        return { ...nft, image };
      }),
    );

    // Calculate top 5 rarest NFTs from 2025 acquisitions
    const topNFTs = withImages
      .map((nft: any) => {
        const assetId = nft.asset_identifier || nft.asset?.asset_id || '';
        const parts = assetId.split('::');
        const collectionName = parts[1] || parts[0] || 'Unknown';
        const tokenId = nft.value?.repr || nft.token_id || nft.name || '';
        const name = `${collectionName} #${tokenId}`.replace(/\s+/g, ' ').trim();
        
        // Better rarity calculation based on supply
        const supply = nft.count || nft.total_supply || 10000;
        const rarity = Math.max(1, Math.min(99, Math.round(100 * (1 - Math.log(supply + 1) / Math.log(10000)))));
        
        return {
          name,
          collection: collectionName,
          rarity,
          image: nft.image,
        };
      })
      .sort((a: any, b: any) => b.rarity - a.rarity)
      .slice(0, 5);

    // Basic placeholder analytics
    const totalTransactions = transactions.length;
    const firstTxDate = transactions[0]?.burn_block_time_iso || null;
    const busiestMonth = null; // TODO: compute by grouping by month
    const longestHoldDays = longestTokenHold?.daysHeld || 0;

    const badgeTitle = classifyUser(transactions as any, longestHoldDays);

    // Aggregate contract interactions and NFT collections for title classifier
    const totalContractInteractions = Array.from(protocolInteractions.values()).reduce((a, b) => a + b, 0);
    const nftCollectionIds = new Set<string>();
    (nftHoldings || []).forEach((nft: any) => {
      const aid = nft?.asset_identifier || nft?.value?.asset_identifier || nft?.asset?.asset_id || '';
      if (typeof aid === 'string' && aid.length > 0) {
        // Use contract portion before '::' as a collection id
        const cid = aid.includes('::') ? aid.split('::')[0] : aid;
        nftCollectionIds.add(cid);
      }
    });
    const totalCollectionsOwned = nftCollectionIds.size;

    const top5Holdings = (topTokensHeldLongest || []).map(t => ({ daysHeld: t.daysHeld }));

    const title = classifyTitle({
      totalTransactions,
      totalContractInteractions,
      totalCollectionsOwned,
      top5Holdings,
    });

    const volumeUSD = transactions
      .filter((tx: any) => tx.tx_type === 'token_transfer')
      .reduce((sum: number, tx: any) => sum + (tx.token_transfer?.amount ? Number(tx.token_transfer.amount) : 0), 0);

    const protocolNameMap: Record<string, string> = {
      // Common protocol contract names → display names
      'token-alex': 'ALEX',
      'alex': 'ALEX',
      'arkadiko': 'ARKADIKO',
      'bitflow': 'BITFLOW',
      'charisma': 'CHARISMA',
      'gosats': 'GOSATS',
      'granite': 'GRANITE',
      'hermetica': 'HERMETICA',
      'light-finance': 'LIGHT FINANCE',
      'stxcity': 'STX.CITY',
      'stx-city': 'STX.CITY',
      'sefo-finance': 'SEFO FINANCE',
      'stackscanner': 'STACKSCANNER',
      'velar': 'VELAR',
      'zest-protocol': 'ZEST PROTOCOL',
      'zest': 'ZEST PROTOCOL',
    };

    const toProtocolName = (contractId: string) => {
      const parts = contractId.split('.');
      const contractName = parts[1] || contractId;
      const key = contractName.toLowerCase();
      
      // Direct match
      if (protocolNameMap[key]) {
        return protocolNameMap[key];
      }
      
      // Partial match - check if any protocol name is contained in the contract name
      for (const [mapKey, mapValue] of Object.entries(protocolNameMap)) {
        if (key.includes(mapKey) || mapKey.includes(key)) {
          return mapValue;
        }
      }
      
      return contractName;
    };

    // Define allowlist of approved DeFi protocols
    const allowlist = new Set([
      'ALEX',
      'ARKADIKO',
      'BITFLOW',
      'CHARISMA',
      'GOSATS',
      'GRANITE',
      'HERMETICA',
      'LIGHT FINANCE',
      'STX.CITY',
      'SEFO FINANCE',
      'STACKSCANNER',
      'VELAR',
      'ZEST PROTOCOL',
    ]);

    const normalizeName = (name: string) => name.replace(/[-_]/g, ' ').toUpperCase();

    // Group by protocol name and sum interactions from different contracts
    const protocolMap = new Map<string, number>();
    
    Array.from(protocolInteractions.entries()).forEach(([cid, count]) => {
      const name = normalizeName(toProtocolName(cid));
      if (allowlist.has(name)) {
        const current = protocolMap.get(name) || 0;
        protocolMap.set(name, current + count);
      }
    });

    const topProtocols = Array.from(protocolMap.entries())
      .map(([name, interactions]) => ({ name, interactions }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 5);

    console.log('[/api/wrapped] Protocol interactions before filter:', Array.from(protocolInteractions.entries()).slice(0, 10));
    console.log('[/api/wrapped] Top protocols after allowlist:', topProtocols);

    const response = {
      address,
      metrics: {
        totalTransactions,
        firstTxDate,
        busiestMonth,
        longestHoldDays,
        volumeUSD,
        largestStxTransfer: Math.floor(largestStxTransferMicro / 1_000_000),
        nftCount: nft2025.length,
        topNFTs,
        topToken: ftBalances?.[0]?.asset?.symbol || 'STX',
        topTokensHeldLongest,
        longestTokenHold,
        topProtocols,
      },
      badge: {
        title: title.title,
        description: title.description,
        badgeSvg: title.badgeSvg,
        legacy: badgeTitle, // keep for debugging/compat
      },
      raw: {
        transactionsCount: transactions.length,
        nftHoldingsCount: nft2025.length,
        ftBalancesCount: ftBalances.length,
        transactions: transactions.slice(0, 20).map((t: any) => ({
          tx_type: t.tx_type,
          contract_call: t.contract_call,
        })),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error('GET /api/wrapped error:', err);
    return NextResponse.json({ error: 'Internal Server Error', detail: err?.message || String(err) }, { status: 500 });
  }
}
