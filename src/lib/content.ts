import { supabase } from "@/integrations/supabase/client";

export type ServiceRow = {
  id: string;
  name: string;
  slug: string;
  headline: string | null;
  short_description: string | null;
  long_description: string | null;
  benefits: string[];
  icon: string | null;
  cta_label: string | null;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

export type IndustryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  problems: string[];
  solutions: string[];
  recommended_services: string[];
  benefits: string[];
  is_published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

export type CaseStudyRow = {
  id: string;
  title: string;
  slug: string;
  industry: string | null;
  challenge: string | null;
  strategy: string | null;
  solution: string | null;
  marketing: string | null;
  tracking: string | null;
  results: string[];
  is_demo_project: boolean;
  is_published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

export type TestimonialRow = {
  id: string;
  name: string;
  business: string | null;
  role: string | null;
  quote: string;
  rating: number;
  is_demo: boolean;
  sort_order: number;
};

export type PricingRow = {
  id: string;
  name: string;
  description: string | null;
  price_label: string | null;
  billing_type: string | null;
  features: string[];
  badge: string | null;
  cta_label: string;
  sort_order: number;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export async function getServices() {
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []) as ServiceRow[];
}

export async function getIndustries() {
  const { data } = await supabase
    .from("industries")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []) as IndustryRow[];
}

export async function getCaseStudies() {
  const { data } = await supabase
    .from("case_studies")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []) as CaseStudyRow[];
}

export async function getTestimonials() {
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []) as TestimonialRow[];
}

export async function getPricing() {
  const { data } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []) as PricingRow[];
}

export async function getFaqs() {
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  return (data ?? []) as FaqRow[];
}

export async function getPosts() {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data ?? []) as BlogRow[];
}

export const SERVICE_OPTIONS = [
  "Website",
  "App",
  "E-Commerce",
  "Digital Marketing",
  "Google Ads",
  "Meta Ads",
  "SEO",
  "Branding",
  "Analytics",
];

export const BUSINESS_TYPES = [
  "Gym / Fitness",
  "Hospital / Clinic",
  "Retail Store",
  "Wholesale",
  "Restaurant",
  "Education",
  "Salon",
  "Real Estate",
  "Automotive",
  "Local Service",
  "Other",
];

export const BUDGET_OPTIONS = [
  "Not decided yet",
  "Under ₹10,000 / month",
  "₹10,000 - ₹25,000 / month",
  "₹25,000 - ₹50,000 / month",
  "₹50,000+ / month",
  "One-time project only",
];
