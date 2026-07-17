"use client";

import { useLocale, useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "@/i18n/navigation";
import { formatTime } from "@/lib/utils/format";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("header");
  const tRoles = useTranslations("roles");
  const locale = useLocale();
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-surface-border bg-surface-raised px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-bull shadow-[0_0_8px_theme(colors.bull.DEFAULT)]" />
        <span className="text-sm font-semibold tracking-tight text-slate-100">
          Nightquote
        </span>
      </div>

      <div className="flex items-center gap-3">
        {session && (
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span>{t("signedInAs")}</span>
            <span className="font-medium text-slate-200">{session.name}</span>
            <span className="rounded-full border border-surface-border bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
              {tRoles(session.role)}
            </span>
            <span
              className="font-mono text-slate-600"
              title={session.signedInAt}
            >
              {t("since")} {formatTime(session.signedInAt, locale)}
            </span>
          </div>
        )}
        <LanguageSwitcher />
        <button
          onClick={handleLogout}
          className="rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-bear hover:text-bear"
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
}
