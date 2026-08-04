# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**La Casa del Minero** — E-commerce storefront for mining equipment and supplies, built in Spanish (lang="es"). The site has a landing/home page, an online store (`/tienda`) with product detail pages (`/tienda/[id]`), customer authentication (`/auth/*`), and an admin panel (`/admin`).

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Backend:** Firebase — Firestore (data), Firebase Auth (accounts + admin role), Cloud Storage (images)
- **Hosting:** Firebase App Hosting, backend `claudss-casadelminero` in `us-central1`
- **Package manager:** pnpm (`pnpm-lock.yaml` is the committed lockfile — do not use npm)
- **Styling:** Tailwind CSS 4 with OKLCH color variables, dark theme by default
- **UI Components:** shadcn/ui (New York style) with Radix UI primitives — components live in `components/ui/`
- **Fonts:** Inter (body, `--font-inter`), Oswald (headings, `--font-heading`)
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics

## Commands

```bash
pnpm dev        # Start dev server
pnpm build      # Production build (TypeScript errors are ignored via next.config.mjs)
pnpm start      # Serve production build
pnpm lint       # ESLint
npx tsc --noEmit  # Real typecheck — the build silences type errors, so run this

node scripts/seed-firestore.mjs --reset          # Reseed catalog
node scripts/set-admin.mjs correo@ejemplo.com    # Grant admin role
```

Local development needs Application Default Credentials for the Admin SDK — run `gcloud auth application-default login` once, or set `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env.local`.

## Architecture

### The one rule that shapes everything

**All data access happens server-side through the Firebase Admin SDK.** The Firebase client SDK is used *only* for authentication. That is why `firestore.rules` denies every client write and `storage.rules` denies every client upload — nothing in the browser talks to the database.

### Auth flow

Firebase Auth keeps its session in IndexedDB, which Server Components cannot see. The bridge is a **session cookie**:

1. Client signs in → `getIdToken()` → `POST /api/auth/session`
2. `adminAuth.createSessionCookie()` → httpOnly `session` cookie (14 days), plus a readable `session_active` marker so the client knows whether the server still has a session
3. Server Components call `getCurrentUser()` from `lib/firebase/session.ts`, which verifies the cookie

That route also creates the `users/{uid}` document on first sign-in — it replaces the Postgres trigger the project used before.

Admin role lives in two places: the custom claim `admin` (fast path, read straight from the verified cookie) and `users/{uid}.role` (source of truth, used as fallback when the claim is missing). Set both with `scripts/set-admin.mjs`.

There is **no `middleware.ts`**. Firebase session cookies do not need per-request refreshing, and the Admin SDK cannot run in the Edge runtime. `/admin` is guarded by `app/admin/layout.tsx`, and every mutation calls `requireAdmin()`.

### Routing (App Router)

- `app/page.tsx` — Home/landing (server)
- `app/tienda/page.tsx` — Store listing (server) → `tienda-client.tsx` (client) holds search/filter state
- `app/tienda/[id]/page.tsx` — Product detail (server) with dynamic metadata
- `app/auth/{login,registro,recuperar}/page.tsx` — client components using the Firebase client SDK
- `app/admin/**` — server components except the inline forms; guarded by `app/admin/layout.tsx`
- `app/api/auth/session/route.ts` — session cookie mint/clear
- `app/api/admin/upload/route.ts` — image upload to Cloud Storage (admin only, validates type/size/destination)

### Data layer

- **`lib/queries.ts`** — public store reads, wrapped in `unstable_cache` with `revalidate: 60`
- **`lib/admin-queries.ts`** — admin reads, deliberately **not** cached so edits show up immediately
- **`app/actions/admin.ts`** — all mutations as Server Actions, each starting with `requireAdmin()`
- **`lib/products.ts`** — shared types (`Product`, `CategoryRecord`), safe to import from client components

### Firestore model

| Collection | Notes |
|---|---|
| `products/{id}` | `specs` is an **embedded array**, not a subcollection. `categoryName` is **denormalized** — Firestore has no joins, so `updateCategory` propagates renames via batched writes. |
| `categories/{id}` | `name` is the internal key, `label` is what users see, `slug` is derived |
| `users/{uid}` | `role: "customer" \| "admin"` |

Documents use camelCase (`imageUrl`, `inStock`, `longDescription`). The query layer maps them to the shapes the components expect — notably `CategoryRecord.image_url` stays snake_case, so don't "fix" that without updating `store-navbar.tsx` and `store-categories.tsx`.

Firestore has no UNIQUE constraints, so `app/actions/admin.ts` checks `products.sku` and `categories.name` by hand before writing.

Reads sort **in memory** rather than with `orderBy('createdAt')`: Firestore silently drops documents missing the ordered field, which would make a product vanish from the store.

### Cart & checkout

The cart lives in `localStorage` only (`lib/cart/cart-context.tsx`) — there is no cart collection, no orders, and no payment provider. Checkout builds a WhatsApp message (`components/cart-drawer.tsx`, `NEXT_PUBLIC_WHATSAPP_NUMBER`).

### Component Conventions

- Home page components: `navbar.tsx`, `hero-section.tsx`, `about-section.tsx`, `location-section.tsx`, `footer.tsx`
- Store components are prefixed with `store-`: `store-navbar.tsx`, `store-hero.tsx`, `store-features.tsx`, `store-categories.tsx`, `store-footer.tsx`
- Product components: `product-grid.tsx`, `product-card.tsx`, `product-actions.tsx`, `add-to-cart-button.tsx`, `product-detail-navbar.tsx`
- shadcn/ui components in `components/ui/` — add new ones via `npx shadcn@latest add <component>`

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`). All imports use this alias (e.g., `@/components/ui/button`, `@/lib/queries`).

### Styling

Global CSS variables are defined in `app/globals.css` using OKLCH color space. The `--primary` color is golden/amber. Use the `cn()` utility from `lib/utils.ts` for conditional class merging (clsx + tailwind-merge). Prices are formatted with `price.toLocaleString('es-CL')`.

### Build Notes

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true` (the latter is why remote Storage URLs work without `images.remotePatterns`)
- shadcn/ui config is in `components.json` (style: "new-york", RSC enabled)
