"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/constants";
import type { Settings } from "@/lib/content-types";

export interface NavLink { label: string; href: string; active?: boolean }
export interface CatItem { label: string; href: string; icon: string; badge?: string }

interface Props {
  navLinks: NavLink[];
  categories: CatItem[];
  settings?: Settings;
}

export default function CategoryNav({ navLinks, categories, settings }: Props) {
  const s = settings || SITE;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <nav className="catnav">
      <div className="container">
        <div ref={ref} className={`allcat-wrap${open ? " open" : ""}`}>
          <button
            className="allcat-trigger"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="true"
          >
            <i className="fa-solid fa-bars"></i>
            Toutes les catégories
            <i className="fa-solid fa-chevron-down arr"></i>
          </button>
          <div className="allcat-menu">
            {categories.map((c) => (
              <Link key={c.href + c.label} href={c.href} onClick={() => setOpen(false)}>
                <i className={c.icon}></i>
                {c.label}
                {c.badge && <small>{c.badge}</small>}
              </Link>
            ))}
          </div>
        </div>

        <div className="mainnav">
          {navLinks.map((l) => (
            <Link key={l.href + l.label} href={l.href} className={l.active ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="catnav-right">
          <a href={s.whatsapp} target="_blank" rel="noopener">
            <i className="fa-brands fa-whatsapp"></i> WhatsApp Express
          </a>
        </div>
      </div>
    </nav>
  );
}
