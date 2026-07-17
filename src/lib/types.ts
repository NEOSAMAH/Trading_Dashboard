export type MarketId = "crypto" | "stocks";

export interface Asset {
  id: string;
  market: MarketId;
  name: string;
  symbol: string;
  image: string | null;
  price: number;
  changePercent24h: number | null;
  volume24h: number | null;
  high24h: number | null;
  low24h: number | null;
  marketCap: number | null;
  lastUpdated: string | null;
}
