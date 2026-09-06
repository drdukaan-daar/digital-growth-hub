import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { trackEvent, useSite, useWhatsApp } from "@/lib/site";

const SERVICE_LINKS = [
  { slug: "website-development", label: "Website Development" },
  { slug: "mobile-app-development", label: "Mobile App Development" },
  { slug: "ecommerce-development", label: "E-Commerce" },
  { slug: "digital-marketing", label: "Digital Marketing" },
  { slug: "google-ads", label: "Google Ads" },
  { slug: "meta-ads", label: "Meta Ads" },
  { slug: "seo", label: "SEO & Local SEO" },
  { slug: "analytics-reporting", label: "Analytics & Reporting" },
];

const INDUSTRY_LINKS = [
  { slug: "gyms-fitness", label: "Gyms & Fitness" },
  { slug: "hospitals-clinics", label: "Hospitals & Clinics" },
  { slug: "retail-stores", label: "Retail Stores" },
  { slug: "wholesale", label: "Wholesale" },
  { slug: "restaurants", label: "Restaurants" },
  { slug: "education", label: "Education" },
];

export function Footer() {
  const site = useSite();
  const wa = useWhatsApp("default");
  const year = new Date().getFullYear();
  const social = Object.entries(site.contact.social ?? {}).filter(([, url]) => Boolean(url));

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl btn-primary text-sm font-bold">
              Dr
            </span>
            <span className="font-display text-lg font-semibold">Dr Dukaan</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {site.home["footer_tagline"] ?? "Digital Growth Partner for Local Businesses."}
          </p>
          <div className="mt-6 space-y-2 text-sm">
            {site.contact.locations.map((loc) => (
              <p key={loc} className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                {loc}
              </p>
            ))}
            <p className="text-xs text-muted-foreground">{site.contact.serving_note}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { label: "footer" })}
              className="chip !text-foreground"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {site.contact.phone}
            </a>
            <a href={`mailto:${site.contact.email}`} className="chip !text-foreground">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {site.contact.email}
            </a>
          </div>
          {social.length > 0 && (
            <div className="mt-4 flex gap-3 text-sm text-muted-foreground">
              {social.map(([name, url]) => (
                <a
                  key={name}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize hover:text-foreground"
                >
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>

        <FooterColumn title="Services">
          {SERVICE_LINKS.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="block hover:text-foreground"
            >
              {s.label}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title="Industries">
          {INDUSTRY_LINKS.map((s) => (
            <Link
              key={s.slug}
              to="/industries/$slug"
              params={{ slug: s.slug }}
              className="block hover:text-foreground"
            >
              {s.label}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title="Company">
          <Link to="/about" className="block hover:text-foreground">
            About
          </Link>
          <Link to="/process" className="block hover:text-foreground">
            How We Grow
          </Link>
          <Link to="/case-studies" className="block hover:text-foreground">
            Case Studies
          </Link>
          <Link to="/pricing" className="block hover:text-foreground">
            Pricing
          </Link>
          <Link to="/blog" className="block hover:text-foreground">
            Insights
          </Link>
          <Link to="/faq" className="block hover:text-foreground">
            FAQ
          </Link>
          <Link to="/contact" className="block hover:text-foreground">
            Contact
          </Link>
        </FooterColumn>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Dr Dukaan. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/cookie-policy" className="hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-4 space-y-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
