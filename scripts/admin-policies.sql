-- ============================================================
-- Admin RLS policies
-- Run AFTER migration.sql
-- ============================================================

-- Products: admin full access
CREATE POLICY "admin: full access products"
  ON public.products FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Categories: admin full access
CREATE POLICY "admin: full access categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Product specs: admin full access
CREATE POLICY "admin: full access product_specs"
  ON public.product_specs FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Note: admin reads their own profile via the existing "profiles: select own" policy.
-- Do NOT add a policy that queries profiles to check admin role — it causes infinite recursion.
