import { SITE } from "@/lib/constants";
import type { Settings } from "@/lib/content-types";

export default function WhatsAppFloat({ settings }: { settings?: Settings }) {
  const s = settings || SITE;
  return (
    <a href={s.whatsapp} target="_blank" rel="noopener" className="wa" aria-label="WhatsApp">
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  );
}
