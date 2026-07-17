import type { Asset } from "@/lib/types";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

interface CoinGeckoMarketRow {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_percentage_24h: number | null;
  last_updated: string | null;
}

// A fixed top-N by market cap keeps the table fast and predictable for a
// demo — no pagination UI was in scope, so we ask CoinGecko for a curated
// slice instead of the full ~15k asset universe.
const PER_PAGE = 30;

export async function fetchCryptoAssets(signal?: AbortSignal): Promise<Asset[]> {
  const url = new URL(`${COINGECKO_BASE}/coins/markets`);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("page", "1");
  url.searchParams.set("price_change_percentage", "24h");

  const res = await fetch(url.toString(), { signal });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("CoinGecko rate limit reached — wait a moment and retry.");
    }
    throw new Error(`CoinGecko request failed (${res.status}).`);
  }

  const rows: CoinGeckoMarketRow[] = await res.json();

  return rows.map((row) => ({
    id: row.id,
    market: "crypto",
    name: row.name,
    symbol: row.symbol.toUpperCase(),
    image: row.image ?? null,
    price: row.current_price,
    changePercent24h: row.price_change_percentage_24h,
    volume24h: row.total_volume,
    high24h: row.high_24h,
    low24h: row.low_24h,
    marketCap: row.market_cap,
    lastUpdated: row.last_updated,
  }));
}
