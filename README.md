# Nightquote — Trading Dashboard

A dark, dense market-watch dashboard for crypto and stocks. Built as a take-home
exercise, scoped like a real feature rather than a demo: typed data layer,
role-aware UI, and an i18n setup that actually flips the layout to RTL instead
of just swapping strings.

**Live constraints I designed around:**
- CoinGecko's public markets endpoint needs no key, so the Crypto tab works
  the second you clone the repo.
- Finnhub's free tier is quote-by-symbol with no bulk endpoint and no volume
  field — so the Stocks tab uses a fixed watchlist of large-caps and shows
  volume as unavailable rather than faking it or burning a second rate-limited
  call per symbol.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for the dark theme
- **TanStack Query** for server state (market data, caching, refetch, retry)
- **Zustand** for client state — auth session, RBAC role, watchlist,
  UI selection — kept deliberately separate from server state instead of
  shoving everything into one store
- **next-intl** for i18n (English / Arabic / Turkish, with real `dir="rtl"` switching for Arabic)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be routed to
`/en/login` (swap the prefix for `/ar` or `/tr`). Sign in with any display
name and pick a role:

- **Admin** — can star/unstar assets to build a watchlist
- **Viewer** — read-only; the star button is disabled with a tooltip

There's no backend and no real password — this is a local session stored in
`localStorage` via a Zustand `persist` store, which is intentional per the
brief ("simple local/demo auth is acceptable... should clearly show how you
handle auth state and session persistence"). Refresh the page and you stay
signed in; sign out and the dashboard redirects you back to `/login`.

### Enabling the Stocks tab

The Crypto tab needs nothing. For Stocks:

```bash
cp .env.example .env.local
# then add a free key from https://finnhub.io/register
```

Without a key, the Stocks tab renders a dedicated empty state explaining
what's missing instead of erroring — that's one of the four data states the
brief asks for (loading / error / empty / disabled-while-fetching), and a
missing API key is realistically the most common "empty" a reviewer will hit.

## What's implemented

**Market watch table**
- Search/filter by name or symbol
- Selected row highlight, kept in sync with the details panel
- Green/red coloring on 24h change, monospaced tabular figures for all
  numbers
- Rows briefly flash green/red when a price actually moves between refetches
  (auto-refetch every 60s, plus manual refresh) — small touch, but it's the
  difference between a table and a *ticker*
- "Watchlist only" filter, gated behind the admin role

**Asset details panel**
- Name, symbol, price, 24h high/low, 24h volume, market cap, last updated —
  synced to the selected row

**Data refresh**
- Manual refresh button, disabled mid-fetch with a spinner, plus a flat 5s
  cooldown after each click so spam-clicking can't trip CoinGecko's rate limit
- A live "Updated HH:MM:SS" timestamp next to the button, driven by the
  query's own fetch time — separate from whatever cadence the upstream API
  updates on (see trade-offs below)
- Loading (skeleton rows), error (retry), and empty states are all distinct
  components, not one generic "something went wrong" box

**Auth & RBAC**
- Demo session persisted client-side, hydration-safe guard on `/dashboard`
- Two roles (admin/viewer) gating watchlist edits — a small but real example
  of the role/permission-based systems the listing calls out

**i18n**
- English, Arabic and Turkish — `/en`, `/ar`, `/tr` routes via `next-intl` middleware
- Arabic flips the whole layout to `dir="rtl"`, not just the strings

**CI**
- `.github/workflows/ci.yml` runs lint, typecheck, and build on every push/PR

## Project layout

```
src/
  app/[locale]/        routes (login, dashboard), layout, metadata
  components/
    auth/               login form, session guard
    market/             toolbar, table
    asset/              details panel
    layout/             header, language switcher
    ui/                 empty/error/skeleton primitives
  lib/
    api/                coingecko.ts, finnhub.ts — normalize to one Asset type
    hooks/              useMarketAssets (TanStack Query), usePriceFlash
    store/              authStore, watchlistStore, uiStore (Zustand)
    utils/format.ts     locale-aware price/percent/compact-number formatting
messages/               en.json, ar.json, tr.json
```

## Notes on trade-offs

- No pagination on either tab — 30 assets by market cap for crypto, 8
  large-caps for stocks. A paginated/virtualized table wasn't in scope and
  would have added complexity without demonstrating anything new.
- The watchlist and UI selection are per-browser (Zustand `persist` /
  in-memory), same as auth — there's no backend to own that state.
- CoinGecko's free tier recomputes prices roughly every 45–90s server-side,
  not on every request. Refresh always fires a real new fetch (see the
  "Updated" timestamp), but the numbers themselves can legitimately be
  identical to the previous poll if you click twice in quick succession —
  that's the data source's cadence, not a stale refresh.
