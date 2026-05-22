"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/constants";
import type { Settings } from "@/lib/content-types";

export interface SearchCategory { label: string; href: string }

interface Props {
  searchCategories: SearchCategory[];
  searchPlaceholder?: string;
  onMenuToggle: () => void;
  settings?: Settings;
}

export default function Header({ searchCategories, searchPlaceholder = "Rechercher un service…", onMenuToggle, settings }: Props) {
  const s = settings || SITE;
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleCatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const href = e.target.value;
    setSelected(href);
    if (href) router.push(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      router.push(selected);
    } else {
      const products = document.getElementById("products");
      if (products) products.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="mainhdr">
      <div className="container">
        <Link href="/" className="brand" aria-label={s.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.logo} alt={s.name} />
        </Link>
        <form className="search" role="search" onSubmit={handleSearch}>
          <div className="search-cat">
            <select aria-label="Catégorie" value={selected} onChange={handleCatChange}>
              <option value="">Toutes catégories</option>
              {searchCategories.map((c) => (
                <option key={c.href} value={c.href}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="search-input">
            <input type="search" placeholder={searchPlaceholder} aria-label="Rechercher" />
          </div>
          <button type="submit" className="search-btn" aria-label="Lancer la recherche">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
        <div className="hdrutils">
          <button className="menu-toggle" aria-label="Menu" onClick={onMenuToggle}>
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
