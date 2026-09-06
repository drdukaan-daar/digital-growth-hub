import { createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WhatsAppSettings = {
  number: string;
  default_message: string;
  hero_message: string;
  quote_message: string;
};

export type ContactSettings = {
  email: string;
  phone: string;
  locations: string[];
  hours: string;
  maps_url: string;
  serving_note: string;
  social: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string };
};

export type SeoSettings = {
  home_title: string;
  home_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  keywords: string;
};

export type HomeSettings = Record<string, string>;

export type SiteSettings = {
  whatsapp: WhatsAppSettings;
  contact: ContactSettings;
  seo: SeoSettings;
  analytics: { ga4_id: string };
  home: HomeSettings;
};

export const defaultSettings: SiteSettings = {
  whatsapp: {
    number: "919985510295",
    default_message:
      "Hi Dr Dukaan, I want to grow my business online. I'd like to discuss your digital growth options.",
    hero_message:
      "Hi Dr Dukaan, I want to take my business online and would like to discuss a digital growth solution.",
    quote_message: "Hi Dr Dukaan, I would like a quote for my business.",
  },
  contact: {
    email: "drdukaan@gmail.com",
    phone: "+91 9985510295",
    locations: ["Hyderabad, Telangana", "Kurnool, Andhra Pradesh"],
    hours: "Mon - Sat, 10:00 AM - 7:00 PM IST",
    maps_url: "",
    serving_note: "Serving businesses remotely across India.",
    social: {},
  },
  seo: {
    home_title: "Dr Dukaan — Digital Growth Partner for Local Businesses",
    home_description:
      "Dr Dukaan takes local businesses online with websites, apps, e-commerce, Google and Meta ads, SEO and analytics built for more enquiries and customers.",
    og_title: "Dr Dukaan — Digital Growth Partner for Local Businesses",
    og_description:
      "We build the digital systems, marketing and growth strategy that help local businesses attract more customers.",
    og_image: "",
    keywords: "",
  },
  analytics: { ga4_id: "" },
  home: {
    hero_title: "Take Your Local Business From Offline to Online.",
    hero_subtitle:
      "We build the digital systems, marketing and growth strategy that help local businesses attract more customers.",
    hero_kicker: "Build. Launch. Market. Measure. Grow.",
    hero_cta: "Get a Free Digital Growth Consultation",
    trust_title: "Everything Your Business Needs to Grow Online.",
    trust_subtitle:
      "One digital partner instead of managing multiple agencies, freelancers and platforms.",
    final_cta_title: "Your Business Is Already Growing Offline.",
    final_cta_line2: "Let's Make It Grow Online.",
    final_cta_support:
      "Tell us where your business is today. We'll help you identify the digital opportunities that can move it forward.",
    footer_tagline: "Digital Growth Partner for Local Businesses.",
  },
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data } = await supabase.from("site_settings").select("key, value");
  const merged = { ...defaultSettings } as SiteSettings;
  for (const row of data ?? []) {
    const key = row.key as keyof SiteSettings;
    if (key in merged) {
      merged[key] = {
        ...(merged[key] as object),
        ...((row.value ?? {}) as object),
      } as never;
    }
  }
  return merged;
}

export const SiteContext = createContext<SiteSettings>(defaultSettings);

export function useSite() {
  return useContext(SiteContext);
}

export function waLink(number: string, message: string) {
  const digits = (number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function useWhatsApp(kind: "default" | "hero" | "quote" = "default") {
  const site = useSite();
  const message =
    kind === "hero"
      ? site.whatsapp.hero_message
      : kind === "quote"
        ? site.whatsapp.quote_message
        : site.whatsapp.default_message;
  return waLink(site.whatsapp.number, message || site.whatsapp.default_message);
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", name, params);
}
