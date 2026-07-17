"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useUiStore } from "@/lib/store/uiStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useWatchlistStore, watchlistKey } from "@/lib/store/watchlistStore";
import { useMarketAssets } from "@/lib/hooks/useMarketAssets";
import { MarketToolbar } from "@/components/market/MarketToolbar";
import { MarketTable } from "@/components/market/MarketTable";
import { AssetDetailsPanel } from "@/components/asset/AssetDetailsPanel";

export function DashboardContent() {
  const t = useTranslations("market");

  const market = useUiStore((s) => s.market);
  const setMarket = useUiStore((s) => s.setMarket);
  const search = useUiStore((s) => s.search);
  const setSearch = useUiStore((s) => s.setSearch);
  const watchlistOnly = useUiStore((s) => s.watchlistOnly);
  const setWatchlistOnly = useUiStore((s) => s.setWatchlistOnly);
  const selectedAssetId = useUiStore((s) => s.selectedAssetId);
  const selectAsset = useUiStore((s) => s.selectAsset);

  const role = useAuthStore((s) => s.session?.role);
  const watchlistKeys = useWatchlistStore((s) => s.keys);
  const toggleWatchlist = useWatchlistStore((s) => s.toggle);

  const { data, isLoading, isError, error, isFetching, refetch, isMissingApiKey, dataUpdatedAt } =
    useMarketAssets(market);

  const filteredAssets = useMemo(() => {
    if (!data) return data;
    const query = search.trim().toLowerCase();
    return data.filter((asset) => {
      const matchesSearch =
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.symbol.toLowerCase().includes(query);
      const matchesWatchlist =
        !watchlistOnly || watchlistKeys.includes(watchlistKey(market, asset.id));
      return matchesSearch && matchesWatchlist;
    });
  }, [data, search, watchlistOnly, watchlistKeys, market]);

  const selectedAsset = useMemo(
    () => data?.find((asset) => asset.id === selectedAssetId) ?? null,
    [data, selectedAssetId]
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">{t("title")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col overflow-hidden rounded-xl border border-surface-border bg-surface-raised">
          <MarketToolbar
            market={market}
            onMarketChange={setMarket}
            search={search}
            onSearchChange={setSearch}
            watchlistOnly={watchlistOnly}
            onWatchlistOnlyChange={setWatchlistOnly}
            onRefresh={() => refetch()}
            isFetching={isFetching}
            lastUpdatedAt={dataUpdatedAt || undefined}
          />
          <MarketTable
            assets={filteredAssets}
            allAssetsEmpty={!data || data.length === 0}
            isLoading={isLoading}
            isError={isError}
            isMissingApiKey={isMissingApiKey}
            errorMessage={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
            selectedId={selectedAssetId}
            onSelect={selectAsset}
            role={role}
            isWatchlisted={(id) => watchlistKeys.includes(watchlistKey(market, id))}
            onToggleWatchlist={(id) => toggleWatchlist(watchlistKey(market, id))}
            watchlistOnly={watchlistOnly}
          />
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <AssetDetailsPanel asset={selectedAsset} />
        </div>
      </div>
    </main>
  );
}
