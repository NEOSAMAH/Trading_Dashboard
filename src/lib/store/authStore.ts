import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "viewer";

export interface Session {
  name: string;
  role: Role;
  signedInAt: string;
}

interface AuthState {
  session: Session | null;
  hasHydrated: boolean;
  login: (name: string, role: Role) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hasHydrated: false,
      login: (name, role) =>
        set({ session: { name, role, signedInAt: new Date().toISOString() } }),
      logout: () => set({ session: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "nightquote-auth",
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
