"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "@/i18n/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const session = useAuthStore((s) => s.session);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !session) {
      router.replace("/login");
    }
  }, [hasHydrated, session, router]);

  if (!hasHydrated || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-surface-border border-t-accent"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  return <>{children}</>;
}
