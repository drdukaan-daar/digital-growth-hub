import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { QuoteButton } from "./Buttons";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/process", label: "How We Grow" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 ${
          scrolled ? "surface-panel rounded-full py-2 md:px-4" : ""
        }`}
        style={scrolled ? { maxWidth: "1120px" } : undefined}
      >
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl btn-primary text-sm font-bold">
            Dr
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Dr Dukaan</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-full px-3 py-2 text-sm transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <QuoteButton label="Get Quote" className="px-5 py-2.5 text-sm" />
          </div>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="btn-base btn-ghost h-11 w-11 !min-h-11 !p-0 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 top-0 z-40 bg-background/95 px-4 pt-24 backdrop-blur-xl lg:hidden">
          <ul className="mx-auto flex max-w-md flex-col gap-2">
            {LINKS.map((link, i) => (
              <li
                key={link.to}
                className="reveal-shown"
                style={{ transitionDelay: `${i * 35}ms` }}
              >
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl border border-border bg-surface px-5 py-4 font-display text-lg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-3">
              <QuoteButton label="Get a Quote" className="w-full" />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
