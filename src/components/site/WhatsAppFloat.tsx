import { MessageCircle } from "lucide-react";
import { trackEvent, useWhatsApp } from "@/lib/site";

export function WhatsAppFloat() {
  const href = useWhatsApp("default");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Dr Dukaan on WhatsApp"
      onClick={() => trackEvent("whatsapp_click", { label: "floating_button" })}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full btn-wa shadow-lg md:h-14 md:w-auto md:px-5"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="ml-2 hidden text-sm font-semibold md:inline">WhatsApp</span>
    </a>
  );
}
