"use client";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import type { Settings } from "@/lib/content-types";

export interface DrawerLink { label: string; href: string; indent?: boolean }

interface Props {
  open: boolean;
  onClose: () => void;
  links: DrawerLink[];
  ctaLabel: string;
  settings?: Settings;
}

export default function Drawer({ open, onClose, links, ctaLabel, settings }: Props) {
  const s = settings || SITE;
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    const products = document.getElementById("products");
    if (products) products.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`drawer${open ? " open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.logo} alt={s.name} />
          <button className="drawer-close" onClick={onClose} aria-label="Fermer"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="drawer-search">
          <form className="search" onSubmit={handleSearch}>
            <div className="search-input"><input type="search" placeholder="Rechercher…" /></div>
            <button type="submit" className="search-btn"><i className="fa-solid fa-magnifying-glass"></i></button>
          </form>
        </div>
        <nav>
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} onClick={onClose}>
              {l.label} <i className="fa-solid fa-chevron-right"></i>
            </Link>
          ))}
        </nav>
        <div className="drawer-foot">
          <a href="#contact" className="btn btn-accent" onClick={onClose}>
            {ctaLabel} <i className="fa-solid fa-arrow-right btn-arrow"></i>
          </a>
          <a href={s.whatsapp} target="_blank" rel="noopener" className="btn btn-outline">
            <i className="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
