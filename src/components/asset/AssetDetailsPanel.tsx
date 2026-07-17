"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Asset } from "@/lib/types";
import {
  formatCompactNumber,
  formatPercent,
  formatPrice,
  formatTime,
} from "@/lib/utils/format";
import { EmptyState } from "@/components/ui/EmptyState";

interface AssetDetailsPanelProps {
  asset: Asset | null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-sm tabular-nums text-slate-100">{value}</p>
    </div>
  );
}

export function AssetDetailsPanel({ asset }: AssetDetailsPanelProps) {
  const t = useTranslations("details");
  const tMarket = useTranslations("market");
  const locale = useLocale();

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-200">{t("title")}</h2>

      {!asset && <EmptyState title={t("selectPrompt")} />}

      {asset && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {asset.image ? (
              <Image
                src={asset.image}
                alt=""
                width={36}
                height={36}
                className="rounded-full"
                unoptimized
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-overlay text-xs font-semibold text-slate-400">
                {asset.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <p className="font-medium text-slate-100">{asset.name}</p>
              <p className="font-mono text-xs text-slate-500">{asset.symbol}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-2xl tabular-nums text-slate-100">
              {formatPrice(asset.price, locale)}
            </p>
            {asset.changePercent24h != null && (
              <p
                className={`font-mono text-sm tabular-nums ${
                  asset.changePercent24h >= 0 ? "text-bull" : "text-bear"
                }`}
              >
                {formatPercent(asset.changePercent24h, locale)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Stat
              label={t("high24h")}
              value={asset.high24h != null ? formatPrice(asset.high24h, locale) : tMarket("na")}
            />
            <Stat
              label={t("low24h")}
              value={asset.low24h != null ? formatPrice(asset.low24h, locale) : tMarket("na")}
            />
            <Stat
              label={t("volume24h")}
              value={
                asset.volume24h != null
                  ? formatCompactNumber(asset.volume24h, locale)
                  : tMarket("na")
              }
            />
            <Stat
              label={t("marketCap")}
              value={
                asset.marketCap != null
                  ? formatCompactNumber(asset.marketCap, locale)
                  : tMarket("na")
              }
            />
          </div>

          <p className="text-xs text-slate-500">
            {t("lastUpdated")}:{" "}
            <span className="font-mono text-slate-400">
              {asset.lastUpdated ? formatTime(asset.lastUpdated, locale) : tMarket("na")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
