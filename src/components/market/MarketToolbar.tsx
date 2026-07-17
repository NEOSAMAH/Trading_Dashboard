"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { MarketId } from "@/lib/types";
import { formatTime } from "@/lib/utils/format";

interface MarketToolbarProps {
  market: MarketId;
  onMarketChange: (market: MarketId) => void;
  search: string;
  onSearchChange: (value: string) => void;
  watchlistOnly: boolean;
  onWatchlistOnlyChange: (value: boolean) => void;
  onRefresh: () => void;
  isFetching: boolean;
  lastUpdatedAt: number | undefined;
}

// CoinGecko's free tier rate-limits anonymous requests — a user mashing the
// refresh button can trip it in seconds. This cooldown caps clicks to one
// per interval regardless of how fast the previous fetch resolved.
const REFRESH_COOLDOWN_MS = 5000;

export function MarketToolbar({
  market,
  onMarketChange,
  search,
  onSearchChange,
  watchlistOnly,
  onWatchlistOnlyChange,
  onRefresh,
  isFetching,
  lastUpdatedAt,
}: MarketToolbarProps) {
  const t = useTranslations("market");
  const locale = useLocale();
  const [cooldown, setCooldown] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(cooldownTimer.current), []);

  function handleRefreshClick() {
    if (cooldown || isFetching) return;
    onRefresh();
    setCooldown(true);
    cooldownTimer.current = setTimeout(() => setCooldown(false), REFRESH_COOLDOWN_MS);
  }

  return (
    <div className="flex flex-col gap-3 border-b border-surface-border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-lg border border-surface-border">
          {(["crypto", "stocks"] as MarketId[]).map((m) => (
            <button
              key={m}
              onClick={() => onMarketChange(m)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                market === m
                  ? "bg-accent-soft text-accent"
                  : "bg-surface-raised text-slate-400 hover:text-slate-200"
              }`}
            >
              {t(m === "crypto" ? "tabCrypto" : "tabStocks")}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={watchlistOnly}
            onChange={(e) => onWatchlistOnlyChange(e.target.checked)}
            className="h-3.5 w-3.5 accent-accent"
          />
          {t("watchlistOnly")}
        </label>
      </div>

      <div className="flex items-center gap-2">
        {lastUpdatedAt && (
          <span className="hidden whitespace-nowrap font-mono text-[11px] text-slate-500 md:inline">
            {t("updatedAt")} {formatTime(lastUpdatedAt, locale)}
          </span>
        )}
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full min-w-0 rounded-lg border border-surface-border bg-surface-raised px-3 py-1.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-accent sm:w-56"
        />
        <button
          onClick={handleRefreshClick}
          disabled={isFetching || cooldown}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            className={isFetching ? "animate-spin" : ""}
            aria-hidden="true"
          >
            <path
              d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isFetching ? t("refreshing") : t("refresh")}
        </button>
      </div>
    </div>
  );
}
