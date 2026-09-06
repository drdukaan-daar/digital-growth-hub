import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { trackEvent, useWhatsApp } from "@/lib/site";

export function QuoteButton({
  label = "Get a Quote",
  to = "/contact",
  variant = "primary",
  className = "",
}: {
  label?: string;
  to?: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  return (
    <Link
      to={to}
      onClick={() => trackEvent("cta_click", { cta: label, target: to })}
      className={`btn-base ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`}
    >
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export function WhatsAppButton({
  label = "Chat on WhatsApp",
  kind = "default",
  className = "",
}: {
  label?: string;
  kind?: "default" | "hero" | "quote";
  className?: string;
}) {
  const href = useWhatsApp(kind);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { label })}
      className={`btn-base btn-wa ${className}`}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  );
}
