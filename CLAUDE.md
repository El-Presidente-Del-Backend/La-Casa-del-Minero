y # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**La Casa del Minero** — E-commerce storefront for mining equipment and supplies, built in Spanish (lang="es"). The site has two main sections: a landing/home page and an online store (`/tienda`) with product detail pages (`/tienda/[id]`).

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS 4 with OKLCH color variables, dark theme by default
- **UI Components:** shadcn/ui (New York style) with Radix UI primitives — components live in `components/ui/`
- **Fonts:** Inter (body, `--font-inter`), Oswald (headings, `--font-heading`)
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics
- **Firebase:** Configured via `.env.local` (not actively integrated yet)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (TypeScript errors are ignored via next.config.mjs)
npm run start    # Serve production build
npm run lint     # ESLint
```

## Architecture

### Routing (App Router)

- `app/page.tsx` — Home/landing page (server component, composes Navbar + HeroSection + AboutSection + LocationSection + Footer)
- `app/tienda/page.tsx` — Store listing page (**client component** with useState for search and category filtering)
- `app/tienda/[id]/page.tsx` — Product detail page (server component with `generateStaticParams` and dynamic metadata)

### Data Layer

Product data is **hardcoded** in `lib/products.ts` (no database yet). All product types, categories, and helper functions (`getProductById`, `getProductsByCategory`, `getRelatedProducts`) live there.

Category type: `"Todos" | "Seguridad" | "Herramientas" | "Iluminacion" | "Deteccion"`

### Component Conventions

- Home page components: `navbar.tsx`, `hero-section.tsx`, `about-section.tsx`, `location-section.tsx`, `footer.tsx`
- Store components are prefixed with `store-`: `store-navbar.tsx`, `store-hero.tsx`, `store-features.tsx`, `store-categories.tsx`, `store-footer.tsx`
- Product components: `product-grid.tsx`, `product-card.tsx`, `quantity-selector.tsx`, `product-detail-navbar.tsx`
- shadcn/ui components in `components/ui/` — add new ones via `npx shadcn@latest add <component>`

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`). All imports use this alias (e.g., `@/components/ui/button`, `@/lib/products`).

### Styling

Global CSS variables are defined in `app/globals.css` using OKLCH color space. The `--primary` color is golden/amber. Use the `cn()` utility from `lib/utils.ts` for conditional class merging (clsx + tailwind-merge).

### Build Notes

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`
- shadcn/ui config is in `components.json` (style: "new-york", RSC enabled)
