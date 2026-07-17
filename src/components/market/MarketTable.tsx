"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Asset } from "@/lib/types";
import type { Role } from "@/lib/store/authStore";
import { formatCompactNumber, formatPercent, formatPrice } from "@/lib/utils/format";
import { usePriceFlash } from "@/lib/hooks/usePriceFlash";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { TableSkeletonRows } from "@/components/ui/Skeleton";

interface MarketTableProps {
  assets: Asset[] | undefined;
  allAssetsEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
  isMissingApiKey: boolean;
  errorMessage?: string;
  onRetry: () => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  role: Role | undefined;
  isWatchlisted: (id: string) => boolean;
  onToggleWatchlist: (id: string) => void;
  watchlistOnly: boolean;
}

export function MarketTable({
  assets,
  allAssetsEmpty,
  isLoading,
  isError,
  isMissingApiKey,
  errorMessage,
  onRetry,
  selectedId,
  onSelect,
  role,
  isWatchlisted,
  onToggleWatchlist,
  watchlistOnly,
}: MarketTableProps) {
  const t = useTranslations("market");
  const locale = useLocale();
  const flashes = usePriceFlash(assets);
  const canEditWatchlist = role === "admin";

  return (
    <>
      <div className="scrollbar-thin max-h-[560px] overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-surface-raised text-xs text-slate-500">
            <tr className="border-b border-surface-border">
              <th className="w-9 px-4 py-2.5" />
              <th className="px-4 py-2.5 text-start font-medium">{t("colName")}</th>
              <th className="px-4 py-2.5 text-start font-medium">{t("colSymbol")}</th>
              <th className="px-4 py-2.5 text-end font-medium">{t("colPrice")}</th>
              <th className="px-4 py-2.5 text-end font-medium">{t("colChange")}</th>
              <th className="hidden px-4 py-2.5 text-end font-medium sm:table-cell">
                {t("colVolume")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <TableSkeletonRows />}

            {!isLoading && !isError && assets && assets.length > 0 && (
              <>
                {assets.map((asset) => {
                  const isPositive = (asset.changePercent24h ?? 0) >= 0;
                  const flash = flashes.get(asset.id);
                  const starred = isWatchlisted(asset.id);
                  return (
                    <tr
                      key={asset.id}
                      onClick={() => onSelect(asset.id)}
                      className={`cursor-pointer border-b border-surface-border/60 transition-colors hover:bg-surface-overlay ${
                        selectedId === asset.id ? "bg-accent-soft/70" : ""
                      } ${flash === "up" ? "animate-flash-bull" : ""} ${
                        flash === "down" ? "animate-flash-bear" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (canEditWatchlist) onToggleWatchlist(asset.id);
                          }}
                          disabled={!canEditWatchlist}
                          title={
                            canEditWatchlist
                              ? t(starred ? "removeFromWatchlist" : "addToWatchlist")
                              : t("adminOnly")
                          }
                          className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                            canEditWatchlist
                              ? "text-slate-500 hover:text-yellow-400"
                              : "cursor-not-allowed text-slate-700"
                          } ${starred ? "text-yellow-400" : ""}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={starred ? "currentColor" : "none"}
                            aria-hidden="true"
                          >
                            <path
                              d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          {asset.image ? (
                            <Image
                              src={asset.image}
                              alt=""
                              width={20}
                              height={20}
                              className="rounded-full"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-overlay text-[9px] font-semibold text-slate-400">
                              {asset.symbol.slice(0, 2)}
                            </div>
                          )}
                          <span className="truncate text-slate-200">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-400">
                        {asset.symbol}
                      </td>
                      <td className="px-4 py-2.5 text-end font-mono tabular-nums text-slate-100">
                        {formatPrice(asset.price, locale)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-end font-mono tabular-nums ${
                          asset.changePercent24h == null
                            ? "text-slate-500"
                            : isPositive
                              ? "text-bull"
                              : "text-bear"
                        }`}
                      >
                        {asset.changePercent24h == null
                          ? t("na")
                          : formatPercent(asset.changePercent24h, locale)}
                      </td>
                      <td className="hidden px-4 py-2.5 text-end font-mono tabular-nums text-slate-400 sm:table-cell">
                        {asset.volume24h == null
                          ? t("na")
                          : formatCompactNumber(asset.volume24h, locale)}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && isMissingApiKey && (
        <EmptyState
          title={t("stocksKeyMissingTitle")}
          subtitle={t("stocksKeyMissingBody")}
        />
      )}

      {!isLoading && isError && !isMissingApiKey && (
        <ErrorState
          title={t("errorTitle")}
          message={errorMessage}
          retryLabel={t("retry")}
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && assets && assets.length === 0 && (
        <EmptyState
          title={watchlistOnly && !allAssetsEmpty ? t("emptyWatchlistTitle") : t("emptyTitle")}
          subtitle={
            watchlistOnly && !allAssetsEmpty
              ? t("emptyWatchlistSubtitle")
              : t("emptySubtitle")
          }
        />
      )}
    </>
  );
}
