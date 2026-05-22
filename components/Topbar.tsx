import { SITE } from "@/lib/constants";
import type { Settings } from "@/lib/content-types";

export default function Topbar({ hours, settings }: { hours?: string; settings?: Settings }) {
  const s = settings || SITE;
  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-socials">
          <a href={s.facebook} target="_blank" rel="noopener" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
          <a href={s.instagram} target="_blank" rel="noopener" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
          <a href={s.tiktok} target="_blank" rel="noopener" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
          <a href={s.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
        </div>
        <div className="topbar-links">
          <span><i className="fa-solid fa-phone"></i> {s.phone}</span>
          <span className="sep"></span>
          <a href={`mailto:${s.email}`}><i className="fa-regular fa-envelope"></i> {s.email}</a>
          <span className="sep"></span>
          <span><i className="fa-regular fa-clock"></i> {hours || s.hours}</span>
        </div>
      </div>
    </div>
  );
}
