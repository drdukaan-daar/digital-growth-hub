
-- roles
CREATE TYPE public.app_role AS ENUM ('super_admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  ) OR lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@drdukaan.com';
$$;

CREATE POLICY "admin reads roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_super_admin());

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  phone text NOT NULL,
  whatsapp text,
  email text,
  business_type text,
  current_website text,
  services text[] NOT NULL DEFAULT '{}',
  budget text,
  message text,
  source text NOT NULL DEFAULT 'website',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_status_idx ON public.leads (status);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit an enquiry" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin manages leads" ON public.leads FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "admin updates leads" ON public.leads FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "admin deletes leads" ON public.leads FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE TRIGGER leads_touch BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'note',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX lead_activities_lead_idx ON public.lead_activities (lead_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_activities TO authenticated;
GRANT ALL ON public.lead_activities TO service_role;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manages lead activities" ON public.lead_activities FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- clients
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  contact_name text,
  phone text,
  email text,
  business_type text,
  website text,
  services text[] NOT NULL DEFAULT '{}',
  start_date date,
  renewal_date date,
  status text NOT NULL DEFAULT 'Onboarding',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manages clients" ON public.clients FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE TRIGGER clients_touch BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  headline text,
  short_description text,
  long_description text,
  benefits text[] NOT NULL DEFAULT '{}',
  icon text,
  cta_label text,
  featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published services are public" ON public.services FOR SELECT TO anon, authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "admin writes services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "admin updates services" ON public.services FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "admin deletes services" ON public.services FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE TRIGGER services_touch BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- industries
CREATE TABLE public.industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  problems text[] NOT NULL DEFAULT '{}',
  solutions text[] NOT NULL DEFAULT '{}',
  recommended_services text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  image_url text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.industries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.industries TO authenticated;
GRANT ALL ON public.industries TO service_role;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published industries are public" ON public.industries FOR SELECT TO anon, authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "admin writes industries" ON public.industries FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "admin updates industries" ON public.industries FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "admin deletes industries" ON public.industries FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE TRIGGER industries_touch BEFORE UPDATE ON public.industries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- case studies
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  industry text,
  challenge text,
  strategy text,
  solution text,
  marketing text,
  tracking text,
  results text[] NOT NULL DEFAULT '{}',
  image_url text,
  is_demo_project boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published case studies are public" ON public.case_studies FOR SELECT TO anon, authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "admin writes case studies" ON public.case_studies FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "admin updates case studies" ON public.case_studies FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "admin deletes case studies" ON public.case_studies FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE TRIGGER case_studies_touch BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business text,
  role text,
  photo_url text,
  quote text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  is_demo boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published testimonials are public" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "admin writes testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "admin updates testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "admin deletes testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE TRIGGER testimonials_touch BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- pricing plans
CREATE TABLE public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_label text,
  billing_type text,
  features text[] NOT NULL DEFAULT '{}',
  badge text,
  cta_label text NOT NULL DEFAULT 'Get Quote',
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_plans TO authenticated;
GRANT ALL ON public.pricing_plans TO service_role;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published plans are public" ON public.pricing_plans FOR SELECT TO anon, authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "admin writes plans" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "admin updates plans" ON public.pricing_plans FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "admin deletes plans" ON public.pricing_plans FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE TRIGGER pricing_plans_touch BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- faqs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published faqs are public" ON public.faqs FOR SELECT TO anon, authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "admin writes faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "admin updates faqs" ON public.faqs FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "admin deletes faqs" ON public.faqs FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE TRIGGER faqs_touch BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- blog
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  image_url text,
  category text,
  author text DEFAULT 'Dr Dukaan',
  published_at timestamptz,
  is_published boolean NOT NULL DEFAULT false,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published posts are public" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published OR public.is_super_admin());
CREATE POLICY "admin writes posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "admin updates posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "admin deletes posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.is_super_admin());
CREATE TRIGGER blog_posts_touch BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- settings (key/value)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings are public" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin writes settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "admin updates settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- activity log
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text,
  action text NOT NULL,
  entity text,
  entity_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX activity_logs_created_idx ON public.activity_logs (created_at DESC);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin reads logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "admin writes logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());

-- ============ SEED ============
INSERT INTO public.site_settings (key, value) VALUES
('whatsapp', '{"number":"919985510295","default_message":"Hi Dr Dukaan, I want to grow my business online. I''d like to discuss your digital growth options.","hero_message":"Hi Dr Dukaan, I want to take my business online and would like to discuss a digital growth solution.","quote_message":"Hi Dr Dukaan, I would like a quote for my business."}'),
('contact', '{"email":"drdukaan@gmail.com","phone":"+91 9985510295","locations":["Hyderabad, Telangana","Kurnool, Andhra Pradesh"],"hours":"Mon - Sat, 10:00 AM - 7:00 PM IST","maps_url":"","serving_note":"Serving businesses remotely across India.","social":{"instagram":"","facebook":"","linkedin":"","youtube":""}}'),
('seo', '{"home_title":"Dr Dukaan — Digital Growth Partner for Local Businesses","home_description":"Dr Dukaan takes local businesses online with websites, apps, e-commerce, Google and Meta ads, SEO and analytics built for more enquiries and customers.","og_title":"Dr Dukaan — Digital Growth Partner for Local Businesses","og_description":"We build the digital systems, marketing and growth strategy that help local businesses attract more customers.","og_image":"","keywords":"digital marketing Hyderabad, website development Kurnool, local business online"}'),
('analytics', '{"ga4_id":""}'),
('home', '{"hero_title":"Take Your Local Business From Offline to Online.","hero_subtitle":"We build the digital systems, marketing and growth strategy that help local businesses attract more customers.","hero_kicker":"Build. Launch. Market. Measure. Grow.","hero_cta":"Get a Free Digital Growth Consultation","trust_title":"Everything Your Business Needs to Grow Online.","trust_subtitle":"One digital partner instead of managing multiple agencies, freelancers and platforms.","final_cta_title":"Your Business Is Already Growing Offline.","final_cta_line2":"Let''s Make It Grow Online.","final_cta_support":"Tell us where your business is today. We''ll help you identify the digital opportunities that can move it forward.","footer_tagline":"Digital Growth Partner for Local Businesses."}');

INSERT INTO public.services (name, slug, headline, short_description, long_description, benefits, icon, cta_label, featured, sort_order, seo_title, seo_description) VALUES
('Website Development','website-development','Your Business Deserves More Than a Basic Website.','Fast, modern, conversion-focused websites that turn visitors into enquiries.','We build fast, modern and conversion-focused websites designed to turn visitors into enquiries and customers.','{"Professional online presence","Mobile-first experience","WhatsApp integration","Lead forms","SEO-ready architecture","Analytics","Conversion-focused design"}','globe','Build My Website',true,1,'Website Development for Local Businesses | Dr Dukaan','Conversion-focused website development with WhatsApp integration, lead forms, SEO-ready structure and analytics.'),
('Mobile App Development','mobile-app-development','Keep Your Customers Connected to Your Business.','Apps for bookings, orders, memberships and repeat business.','Custom mobile apps that help businesses improve customer engagement, bookings, orders, memberships and repeat business.','{"Android/iOS","Customer accounts","Bookings","Notifications","Orders","Memberships","Business-specific features"}','smartphone','Build My App',true,2,'Mobile App Development for Local Businesses | Dr Dukaan','Android and iOS apps with bookings, orders, memberships and notifications for local businesses.'),
('E-Commerce Development','ecommerce-development','Turn Your Products Into an Online Store.','Sell beyond your physical location.','Launch an online store that allows your customers to discover, enquire and purchase your products beyond your physical location.','{"Product catalogue","Online payments architecture","Order management","WhatsApp integration","Customer accounts","Analytics","Mobile-first shopping"}','shopping-bag','Launch My Store',true,3,'E-Commerce Development | Dr Dukaan','Online stores with product catalogue, order management, WhatsApp integration and mobile-first shopping.'),
('Digital Marketing','digital-marketing','Get Your Business in Front of the Right Customers.','Growth strategy built around your business and location.','We create digital growth strategies designed around your business, location, customers and goals.','{"Growth strategy","Lead generation","Search visibility","Campaign optimization","Conversion tracking","Performance reporting"}','trending-up','Grow My Business',true,4,'Digital Marketing for Local Businesses | Dr Dukaan','Digital growth strategy, lead generation, campaign optimization and performance reporting.'),
('Google Ads','google-ads','Show Up When Customers Are Searching.','Reach people actively searching for you.','Reach people actively searching for your products or services through targeted Google advertising campaigns.','{"Search campaigns","Local campaigns","Conversion tracking","Keyword strategy","Landing pages","Performance optimization"}','search','Run Google Ads',false,5,'Google Ads Management | Dr Dukaan','Google Search and Local campaigns with keyword strategy, landing pages and conversion tracking.'),
('Meta Ads','meta-ads','Turn Attention Into Customers.','Facebook and Instagram campaigns focused on leads.','Reach relevant audiences across Facebook and Instagram using targeted campaigns focused on leads, enquiries and sales.','{"Audience targeting","Lead campaigns","Remarketing architecture","Creative testing","Conversion tracking","Campaign optimization"}','target','Run Meta Ads',false,6,'Meta Ads Management | Dr Dukaan','Facebook and Instagram ad campaigns built for leads, enquiries and sales.'),
('SEO & Local SEO','seo','Be Found When Customers Search for You.','Improve visibility for local searches.','Improve your search visibility and help more local customers discover your business.','{"Technical SEO","On-page SEO","Local SEO","Keyword strategy","Google Business optimization","Content architecture","Performance tracking"}','map-pin','Improve My Visibility',false,7,'SEO and Local SEO Services | Dr Dukaan','Technical, on-page and local SEO with Google Business optimization and performance tracking.'),
('Branding & Creative','branding-creative','Make Your Business Look as Good Online as It Is Offline.','A consistent digital identity that builds trust.','Create a consistent digital identity that builds trust and makes your business memorable.','{"Logo","Brand identity","Creative design","Ad creatives","Website visuals","Marketing materials"}','palette','Build My Brand',false,8,'Branding and Creative Design | Dr Dukaan','Logo, brand identity, ad creatives and marketing materials for local businesses.'),
('Analytics & Reporting','analytics-reporting','Know What Is Actually Growing Your Business.','Clear data instead of guessing.','Track your digital performance with clear data instead of guessing.','{"GA4 setup","Conversion tracking","Traffic analysis","Lead tracking","Campaign performance","Monthly reporting","Growth recommendations"}','bar-chart','Track My Growth',false,9,'Analytics, GA4 Setup and Reporting | Dr Dukaan','GA4 setup, conversion tracking, lead tracking and monthly growth reporting.');

INSERT INTO public.industries (name, slug, description, problems, solutions, recommended_services, benefits, sort_order) VALUES
('Gyms & Fitness','gyms-fitness','Turn local searches into trials and memberships.','{"People search for gyms online but cannot easily understand memberships, facilities or contact the gym."}','{"Website with facilities and membership details","Membership enquiry system","WhatsApp enquiries","Google visibility","Google Ads","Analytics"}','{"Website","SEO","Google Ads","Analytics"}','{"More enquiries","More trial visits","More memberships"}',1),
('Hospitals & Clinics','hospitals-clinics','Help patients find you and book with confidence.','{"Patients cannot find doctor details, timings or an easy way to book an appointment."}','{"Website with doctor profiles","Appointment enquiry forms","WhatsApp","Google visibility","SEO","Analytics"}','{"Website","SEO","Analytics","Google Ads"}','{"More appointment enquiries","Better patient trust","Fewer missed calls"}',2),
('Retail Stores','retail-stores','Show your products to customers beyond your street.','{"Walk-ins are limited and customers cannot see products or prices online."}','{"Website with product catalogue","E-commerce store","WhatsApp ordering","Google visibility","Ads","Analytics"}','{"Website","E-Commerce","Google Ads","Meta Ads","Analytics"}','{"More footfall","Online orders","Wider reach"}',3),
('Wholesale Businesses','wholesale','Generate qualified B2B enquiries every week.','{"Buyers cannot find your catalogue and enquiries depend only on references."}','{"Product catalogue","B2B enquiry system","Lead capture","WhatsApp","SEO","Digital advertising"}','{"Website","SEO","Google Ads","Analytics"}','{"More B2B enquiries","Larger order values","Predictable lead flow"}',4),
('Restaurants','restaurants','Be the obvious choice when people search for food nearby.','{"Customers cannot see the menu, timings or reach you quickly to order or reserve."}','{"Website with menu","Table and order enquiries on WhatsApp","Google Business optimization","Local SEO","Meta Ads"}','{"Website","SEO","Meta Ads","Analytics"}','{"More orders","More reservations","More repeat customers"}',5),
('Education','education','Fill your batches with the right students.','{"Parents compare institutes online but cannot find courses, faculty or admission details."}','{"Website with courses and faculty","Admission enquiry forms","WhatsApp counselling","Google Ads","SEO","Analytics"}','{"Website","Google Ads","SEO","Analytics"}','{"More admission enquiries","Better parent trust","Lower cost per enquiry"}',6),
('Salons','salons','Turn nearby searches into booked appointments.','{"Customers cannot see services, pricing or book an appointment easily."}','{"Website with services","Booking enquiries on WhatsApp","Google Business optimization","Local SEO","Meta Ads"}','{"Website","SEO","Meta Ads","Analytics"}','{"More bookings","Fewer empty slots","More repeat visits"}',7),
('Real Estate','real-estate','Capture serious buyer enquiries, not just clicks.','{"Buyers cannot see verified project details and enquiries are scattered across platforms."}','{"Website with project listings","Lead capture forms","WhatsApp","Google Ads","Meta Ads","Conversion tracking"}','{"Website","Google Ads","Meta Ads","Analytics"}','{"More site visits","Better quality leads","Clear cost per lead"}',8),
('Automotive','automotive','Bring service and sales enquiries to your door.','{"Customers cannot compare services, offers or book a service slot online."}','{"Website with services and offers","Service booking enquiries","WhatsApp","Local SEO","Google Ads","Analytics"}','{"Website","SEO","Google Ads","Analytics"}','{"More service bookings","More test drives","Better customer retention"}',9),
('Local Services','local-services','Be found the moment someone needs your service.','{"Customers search for urgent services and choose whoever appears first online."}','{"Website with service areas","Click-to-call and WhatsApp","Google Business optimization","Local SEO","Google Ads"}','{"Website","SEO","Google Ads","Analytics"}','{"More calls","More enquiries","Steady work pipeline"}',10);

INSERT INTO public.case_studies (title, slug, industry, challenge, strategy, solution, marketing, tracking, results, sort_order) VALUES
('Local Gym Digital Growth','demo-local-gym','Gyms & Fitness','A neighbourhood gym depended on walk-ins and had no way for people to check memberships or facilities online.','Build a clear digital front door, then drive local demand and measure every enquiry.','Website with facilities, trainers and membership enquiry forms, plus WhatsApp enquiry flow.','Local SEO, Google Business optimization and Google Search campaigns targeting nearby areas.','GA4 with events for form submissions, WhatsApp clicks and calls.','{"Illustrative demo outcome: steadier weekly trial enquiries","Illustrative demo outcome: all enquiries tracked in one place"}',1),
('Retail Store E-Commerce Launch','demo-retail-ecommerce','Retail Stores','A retail store had strong offline sales but no online catalogue, so customers outside the area could not buy.','Take the catalogue online first, then layer paid and organic demand.','E-commerce store with product catalogue, order management and WhatsApp support.','Meta Ads for product discovery and Google Ads for high-intent searches.','GA4 e-commerce events plus conversion tracking on ads.','{"Illustrative demo outcome: online orders alongside walk-ins","Illustrative demo outcome: clear view of best-selling products"}',2),
('Hospital Digital Presence','demo-hospital','Hospitals & Clinics','Patients could not find doctor details or timings and relied entirely on phone calls.','Build trust online with clear doctor profiles and simple appointment enquiries.','Website with departments, doctor profiles and appointment enquiry forms.','Local SEO and Google Business optimization for department-level searches.','GA4 with appointment enquiry and call-click tracking.','{"Illustrative demo outcome: more appointment enquiries online","Illustrative demo outcome: reduced load on reception calls"}',3),
('Wholesale Lead Generation','demo-wholesale','Wholesale Businesses','A wholesaler grew only through references and had no predictable enquiry flow.','Publish the catalogue, capture B2B enquiries and qualify them consistently.','Catalogue website with B2B enquiry forms and WhatsApp lead capture.','SEO for product keywords and Google Search campaigns for bulk-buy intent.','GA4 plus lead source tagging for every enquiry.','{"Illustrative demo outcome: consistent weekly B2B enquiries","Illustrative demo outcome: visibility into which products attract buyers"}',4);

INSERT INTO public.testimonials (name, business, role, quote, rating, is_demo, sort_order) VALUES
('Demo Client','Demo Fitness Studio, Hyderabad','Owner','Our enquiries used to come only by walk-in. Now people find us online and message us on WhatsApp before visiting.',5,true,1),
('Demo Client','Demo Retail Store, Kurnool','Founder','We finally have a proper online catalogue, and we can see exactly which products people are looking at.',5,true,2),
('Demo Client','Demo Clinic, Hyderabad','Practice Manager','Patients can see doctor timings and send an appointment enquiry without calling us ten times.',5,true,3);

INSERT INTO public.pricing_plans (name, description, price_label, billing_type, features, badge, cta_label, sort_order) VALUES
('Starter','For businesses starting their digital journey.','Custom Quote','one-time','{"Professional website","WhatsApp integration","Google Business support","Basic SEO","GA4 setup","Lead form","Basic analytics"}',NULL,'Get Quote',1),
('Growth','For businesses looking for more customers.','Custom Quote','monthly','{"Advanced website","SEO","Google Ads","Meta Ads","Conversion tracking","GA4","Lead generation","Monthly reporting"}','Most Popular','Get Quote',2),
('Scale','For businesses wanting a complete digital ecosystem.','Custom Quote','monthly','{"Website","Mobile App","E-Commerce","SEO","Google Ads","Meta Ads","Analytics","Lead system","Reporting","Continuous optimization"}',NULL,'Get Quote',3);

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('Do you work with businesses outside Hyderabad and Kurnool?','Yes. We are based in Hyderabad and Kurnool and work with businesses across India remotely.',1),
('Can you build an e-commerce website?','Yes. We build online stores with product catalogues, order management, WhatsApp support and analytics.',2),
('Can you build mobile apps?','Yes. We build Android and iOS apps for bookings, orders, memberships and customer engagement.',3),
('Do you manage Google Ads?','Yes. We plan, launch and optimise Google Search and Local campaigns with conversion tracking.',4),
('Do you manage Meta Ads?','Yes. We run Facebook and Instagram campaigns focused on leads, enquiries and sales.',5),
('Do you provide SEO?','Yes. We work on technical SEO, on-page SEO and local SEO including Google Business optimisation.',6),
('Do you provide monthly reporting?','Yes. Monthly plans include clear reporting on traffic, enquiries, campaign performance and next steps.',7),
('Can you set up Google Analytics 4?','Yes. GA4 setup with conversion, WhatsApp click and form tracking is part of applicable packages.',8),
('Can I update my website later?','Yes. We build with an admin panel so you can update content yourself, and we can help when needed.',9),
('How long does a website take?','Most business websites take a few weeks depending on pages, content readiness and features. We share a timeline with your quote.',10),
('Do you provide ongoing support?','Yes. We offer monthly support and growth plans in addition to one-time projects.',11),
('Can I start with only a website?','Absolutely. Many businesses start with a website and add marketing once they are ready.',12),
('Do you work with small businesses?','Yes. Most of our work is with local and small businesses that want a stronger online presence.',13);

INSERT INTO public.blog_posts (title, slug, excerpt, content, category, published_at, is_published, seo_title, seo_description) VALUES
('Why Every Local Business Needs More Than a Facebook Page','local-business-beyond-facebook','A social page helps people find you. A website, Google presence and WhatsApp flow help them choose you.','Customers today check online before they visit, call or buy. A social page shows activity, but it rarely answers the questions that decide a purchase: what exactly do you offer, how much does it cost, where are you, and how do I reach you right now?

A simple digital system solves this: a fast website that answers those questions, a complete Google Business profile so you appear in local searches, and a WhatsApp button so enquiries reach you instantly. Add basic analytics and you finally know where your enquiries come from.

Start small. A clear website plus Google visibility usually creates more enquiries than any other first step.','Growth', now() - interval '20 days', true,'Why Local Businesses Need More Than a Facebook Page | Dr Dukaan','A social page is not enough. Here is the simple digital setup that helps local businesses get found and get enquiries.'),
('How to Track Whether Your Marketing Is Actually Working','track-marketing-results','If you cannot see where enquiries come from, you cannot decide what to spend more on.','Most business owners judge marketing by feel. A better approach is to track a few numbers consistently: website visitors, enquiries submitted, WhatsApp clicks and calls.

With GA4 and conversion tracking set up correctly, every enquiry gets a source. You can see whether Google search, ads or referrals bring the most enquiries, and which of them actually turn into customers.

Once you have one month of clean data, decisions become simple: do more of what produces enquiries, and fix or stop what does not.','Analytics', now() - interval '8 days', true,'How to Track If Your Marketing Is Working | Dr Dukaan','Track visitors, enquiries, WhatsApp clicks and calls so every marketing decision is based on data, not guesswork.');
