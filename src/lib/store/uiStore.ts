import { create } from "zustand";
import type { MarketId } from "@/lib/types";

interface UiState {
  market: MarketId;
  selectedAssetId: string | null;
  search: string;
  watchlistOnly: boolean;
  setMarket: (market: MarketId) => void;
  selectAsset: (id: string | null) => void;
  setSearch: (value: string) => void;
  setWatchlistOnly: (value: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  market: "crypto",
  selectedAssetId: null,
  search: "",
  watchlistOnly: false,
  setMarket: (market) => set({ market, selectedAssetId: null, search: "" }),
  selectAsset: (id) => set({ selectedAssetId: id }),
  setSearch: (value) => set({ search: value }),
  setWatchlistOnly: (value) => set({ watchlistOnly: value }),
}));
