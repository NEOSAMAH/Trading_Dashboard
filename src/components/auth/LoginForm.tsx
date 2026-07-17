"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore, type Role } from "@/lib/store/authStore";
import { useRouter } from "@/i18n/navigation";

const ROLES: Role[] = ["admin", "viewer"];

export function LoginForm() {
  const t = useTranslations("auth");
  const tRoles = useTranslations("roles");
  const router = useRouter();

  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const session = useAuthStore((s) => s.session);
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("admin");

  useEffect(() => {
    if (hasHydrated && session) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, session, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(name.trim() || "Guest", role);
    router.replace("/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-xl border border-surface-border bg-surface-raised p-6 shadow-2xl shadow-black/40"
    >
      <div className="mb-6">
        <p className="text-sm font-medium text-accent">{t("brand")}</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-100">{t("title")}</h1>
        <p className="mt-2 text-sm text-slate-400">{t("subtitle")}</p>
      </div>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
          {t("nameLabel")}
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-accent"
        />
      </label>

      <fieldset className="mb-6">
        <legend className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
          {t("roleLabel")}
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-lg border px-3 py-2.5 text-start text-sm transition-colors ${
                role === r
                  ? "border-accent bg-accent-soft text-slate-100"
                  : "border-surface-border bg-surface text-slate-400 hover:border-slate-600"
              }`}
            >
              <span className="block font-medium">{tRoles(r)}</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {t(r === "admin" ? "roleAdminDesc" : "roleViewerDesc")}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
      >
        {t("submit")}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">{t("sessionNote")}</p>
    </form>
  );
}
