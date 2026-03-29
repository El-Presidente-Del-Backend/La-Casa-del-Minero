import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Lightweight client for public read-only queries (no cookies needed).
// Use this for product/category fetching to enable Next.js caching.
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
