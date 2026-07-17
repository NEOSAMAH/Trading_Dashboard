import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  keys: string[];
  toggle: (key: string) => void;
  has: (key: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      keys: [],
      toggle: (key) =>
        set((state) => ({
          keys: state.keys.includes(key)
            ? state.keys.filter((k) => k !== key)
            : [...state.keys, key],
        })),
      has: (key) => get().keys.includes(key),
    }),
    { name: "nightquote-watchlist" }
  )
);

export const watchlistKey = (market: string, id: string) => `${market}:${id}`;
