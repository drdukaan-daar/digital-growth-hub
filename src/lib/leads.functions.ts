import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  business_name: z.string().trim().max(160).optional().default(""),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[+0-9 ()-]+$/, "Enter a valid phone number"),
  whatsapp: z.string().trim().max(20).optional().default(""),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  business_type: z.string().trim().max(80).optional().default(""),
  current_website: z.string().trim().max(200).optional().default(""),
  services: z.array(z.string().max(60)).max(12).default([]),
  budget: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  source: z.string().trim().max(40).optional().default("website"),
});

export type LeadInput = z.input<typeof leadSchema>;

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string) {
  const now = Date.now();
  const previous = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  previous.push(now);
  hits.set(key, previous);
  if (hits.size > 500) hits.clear();
  return previous.length > MAX_PER_WINDOW;
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const ip =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      new URL(getRequest().url).hostname;

    if (rateLimited(ip)) {
      return {
        ok: false as const,
        error: "Too many submissions from this device. Please try again in a few minutes.",
      };
    }

    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) {
      return { ok: false as const, error: "Enquiry service is not configured yet." };
    }

    const client = createClient(url, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await client.from("leads").insert({
      name: data.name,
      business_name: data.business_name || null,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      email: data.email || null,
      business_type: data.business_type || null,
      current_website: data.current_website || null,
      services: data.services,
      budget: data.budget || null,
      message: data.message || null,
      source: data.source || "website",
    });

    if (error) {
      console.error("lead insert failed", error.message);
      return { ok: false as const, error: "We could not save your enquiry. Please try WhatsApp." };
    }

    return { ok: true as const };
  });
