"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-surface-border text-xs">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          className={`px-2.5 py-1.5 font-medium transition-colors ${
            l === locale
              ? "bg-accent-soft text-accent"
              : "bg-surface-raised text-slate-400 hover:text-slate-200"
          }`}
          aria-current={l === locale}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
