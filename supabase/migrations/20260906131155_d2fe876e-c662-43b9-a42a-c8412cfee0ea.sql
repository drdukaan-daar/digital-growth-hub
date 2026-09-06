
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['services','industries','case_studies','testimonials','pricing_plans','faqs','blog_posts'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'published ' || replace(t,'_',' ') || ' are public', t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "published services are public" ON public.services;
DROP POLICY IF EXISTS "published industries are public" ON public.industries;
DROP POLICY IF EXISTS "published case studies are public" ON public.case_studies;
DROP POLICY IF EXISTS "published testimonials are public" ON public.testimonials;
DROP POLICY IF EXISTS "published plans are public" ON public.pricing_plans;
DROP POLICY IF EXISTS "published faqs are public" ON public.faqs;
DROP POLICY IF EXISTS "published posts are public" ON public.blog_posts;

CREATE POLICY "anon reads published services" ON public.services FOR SELECT TO anon USING (is_published);
CREATE POLICY "auth reads services" ON public.services FOR SELECT TO authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "anon reads published industries" ON public.industries FOR SELECT TO anon USING (is_published);
CREATE POLICY "auth reads industries" ON public.industries FOR SELECT TO authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "anon reads published case studies" ON public.case_studies FOR SELECT TO anon USING (is_published);
CREATE POLICY "auth reads case studies" ON public.case_studies FOR SELECT TO authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "anon reads published testimonials" ON public.testimonials FOR SELECT TO anon USING (is_published);
CREATE POLICY "auth reads testimonials" ON public.testimonials FOR SELECT TO authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "anon reads published plans" ON public.pricing_plans FOR SELECT TO anon USING (is_published);
CREATE POLICY "auth reads plans" ON public.pricing_plans FOR SELECT TO authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "anon reads published faqs" ON public.faqs FOR SELECT TO anon USING (is_published);
CREATE POLICY "auth reads faqs" ON public.faqs FOR SELECT TO authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "anon reads published posts" ON public.blog_posts FOR SELECT TO anon USING (is_published);
CREATE POLICY "auth reads posts" ON public.blog_posts FOR SELECT TO authenticated USING (is_published OR public.is_super_admin());

REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;
