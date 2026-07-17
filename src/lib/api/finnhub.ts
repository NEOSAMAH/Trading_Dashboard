import type { Asset } from "@/lib/types";

const FINNHUB_BASE = "https://finnhub.io/api/v1";

// Finnhub's free tier has no bulk "top stocks" endpoint — quotes are fetched
// one symbol at a time, so the watch list is a fixed curated set rather than
// a paginated universe like the crypto tab.
const STOCK_SYMBOLS: { symbol: string; name: string }[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
];

interface FinnhubQuote {
  c: number; // current price
  d: number | null; // change
  dp: number | null; // percent change
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
  t: number; // unix timestamp
}

export class MissingApiKeyError extends Error {
  constructor() {
    super("Missing NEXT_PUBLIC_FINNHUB_API_KEY");
    this.name = "MissingApiKeyError";
  }
}

export async function fetchStockAssets(signal?: AbortSignal): Promise<Asset[]> {
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError();
  }

  const results = await Promise.all(
    STOCK_SYMBOLS.map(async ({ symbol, name }) => {
      const url = new URL(`${FINNHUB_BASE}/quote`);
      url.searchParams.set("symbol", symbol);
      url.searchParams.set("token", apiKey);

      const res = await fetch(url.toString(), { signal });
      if (!res.ok) {
        throw new Error(`Finnhub request failed (${res.status}) for ${symbol}.`);
      }
      const quote: FinnhubQuote = await res.json();

      const asset: Asset = {
        id: symbol,
        market: "stocks",
        name,
        symbol,
        image: null,
        price: quote.c,
        changePercent24h: quote.dp,
        // Finnhub's free /quote endpoint doesn't expose volume — we show it
        // as unavailable instead of pulling in a second rate-limited
        // endpoint (or worse, faking a number) just to fill the column.
        volume24h: null,
        high24h: quote.h,
        low24h: quote.l,
        marketCap: null,
        lastUpdated: quote.t ? new Date(quote.t * 1000).toISOString() : null,
      };
      return asset;
    })
  );

  return results;
}
