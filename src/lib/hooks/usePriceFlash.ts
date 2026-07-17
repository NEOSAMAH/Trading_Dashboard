import { useEffect, useRef, useState } from "react";
import type { Asset } from "@/lib/types";

type Direction = "up" | "down";

// Diffs each refetch against the previous prices so rows can briefly flash
// green/red on change, the way a real ticker does — without this, a 60s
// auto-refresh would silently swap numbers and the user would never notice
// what moved.
export function usePriceFlash(assets: Asset[] | undefined) {
  const previous = useRef<Map<string, number>>(new Map());
  const [flashes, setFlashes] = useState<Map<string, Direction>>(new Map());

  useEffect(() => {
    if (!assets || assets.length === 0) return;

    const next = new Map<string, Direction>();
    for (const asset of assets) {
      const prevPrice = previous.current.get(asset.id);
      if (prevPrice !== undefined && prevPrice !== asset.price) {
        next.set(asset.id, asset.price > prevPrice ? "up" : "down");
      }
      previous.current.set(asset.id, asset.price);
    }

    if (next.size === 0) return;
    setFlashes(next);
    const timeout = setTimeout(() => setFlashes(new Map()), 900);
    return () => clearTimeout(timeout);
  }, [assets]);

  return flashes;
}
