import { useQuery } from "@tanstack/react-query";
import { fetchCryptoAssets } from "@/lib/api/coingecko";
import { fetchStockAssets, MissingApiKeyError } from "@/lib/api/finnhub";
import type { MarketId } from "@/lib/types";

const FETCHERS: Record<MarketId, (signal?: AbortSignal) => Promise<import("@/lib/types").Asset[]>> = {
  crypto: fetchCryptoAssets,
  stocks: fetchStockAssets,
};

export function useMarketAssets(market: MarketId) {
  const query = useQuery({
    queryKey: ["assets", market],
    queryFn: ({ signal }) => FETCHERS[market](signal),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: (failureCount, error) => {
      if (error instanceof MissingApiKeyError) return false;
      return failureCount < 2;
    },
  });

  const isMissingApiKey = query.error instanceof MissingApiKeyError;

  return { ...query, isMissingApiKey };
}
