"use client";
import { useState } from "react";
import Link from "next/link";
import Topbar from "./Topbar";
import Header from "./Header";
import CategoryNav from "./CategoryNav";
import MobileSearch from "./MobileSearch";
import Drawer from "./Drawer";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import Newsletter from "./Newsletter";
import ContactSection from "./ContactSection";
import RevealObserver from "./Reveal";
import type { ServiceData } from "@/lib/services";
import type { Settings, ContactConfig } from "@/lib/content-types";

interface Props { service: ServiceData; settings: Settings; contact: ContactConfig }

export default function LightService({ service, settings, contact }: Props) {
  const [drawer, setDrawer] = useState(false);
  if (!service.light) return null;
  const { light } = service;
  const isPrint = service.category === "impression";

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "Impression", href: "/impression", active: isPrint },
    { label: "Photographie & Vidéo", href: "/photographie", active: !isPrint },
    { label: "Processus", href: "#processus" },
    { label: "Avis", href: "#avis" },
    { label: "Contact", href: "#contact" },
  ];

  const categories = isPrint ? [
    { label: "Impression Photo", href: "/services/impression-offset", icon: "fa-solid fa-image" },
    { label: "Sublimation & Personnalisation", href: "/services/sublimation", icon: "fa-solid fa-shirt" },
    { label: "Marketing & Publicitaire", href: "/services/impression-numerique", icon: "fa-solid fa-bullhorn" },
    { label: "Stickers & Vinyle", href: "/services/stickers-vinyle", icon: "fa-solid fa-pen-nib" },
    { label: "Grand Format", href: "/services/grand-format", icon: "fa-solid fa-square-poll-vertical" },
    { label: "Technique & Finition", href: "/services/finition-personnalisee", icon: "fa-solid fa-toolbox" },
    { label: "Design & Création", href: "/services/design-creation", icon: "fa-solid fa-palette" },
    { label: "Photographie & Vidéo", href: "/photographie", icon: "fa-solid fa-camera" },
  ] : [
    { label: "Photographie Professionnelle", href: "/services/photo-portrait", icon: "fa-solid fa-user" },
    { label: "Mariage & Événements", href: "/services/photo-evenements", icon: "fa-solid fa-ring" },
    { label: "Production Vidéo", href: "/services/production-video", icon: "fa-solid fa-video" },
    { label: "Photographie Produit", href: "/services/photo-produit", icon: "fa-solid fa-box" },
    { label: "Photographie Administrative", href: "/services/photo-administrative", icon: "fa-solid fa-id-card" },
    { label: "Retouche Photo", href: "/services/retouche-photo", icon: "fa-solid fa-wand-magic-sparkles" },
    { label: "Services Studio", href: "/services/services-studio", icon: "fa-solid fa-camera-retro" },
    { label: "Impression & Personnalisation", href: "/impression", icon: "fa-solid fa-print" },
  ];

  const drawerLinks = [
    { label: "Accueil", href: "/" },
    { label: service.parentLabel, href: service.parentPath },
    ...categories.filter((c) => c.href !== service.parentPath).map((c) => ({ label: "— " + c.label, href: c.href, indent: true })),
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <RevealObserver />
      <Topbar hours={isPrint ? undefined : "Sur rendez-vous, 7j/7"} settings={settings} />
      <Header searchCategories={categories} onMenuToggle={() => setDrawer(true)} searchPlaceholder={isPrint ? "Rechercher un service…" : "Rechercher une séance…"} settings={settings} />
      <MobileSearch placeholder={isPrint ? "Rechercher un service…" : "Rechercher une séance…"} />
      <CategoryNav navLinks={navLinks} categories={categories} settings={settings} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} links={drawerLinks} ctaLabel={isPrint ? "Demander un devis" : "Réserver une séance"} settings={settings} />

      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Fil d'Ariane">
        <div className="container">
          <Link href="/">Accueil</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <Link href={service.parentPath}>{service.parentLabel}</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span className="current">{service.tag}</span>
        </div>
      </nav>

      {/* Page hero */}
      <section className="phero">
        <div className="container">
          <div>
            <span className="phero-tag"><i className={service.tagIcon}></i> {service.tag}</span>
            <h1>
              {service.heroTitle}<br />
              {service.heroTitleItalic && <span>{service.heroTitleItalic}</span>}
            </h1>
            <p className="phero-sub">{service.heroSubtitle}</p>
            <div className="phero-cta">
              <a href="#contact" className="btn btn-accent">{isPrint ? "Demander un devis" : "Réserver une séance"} <i className="fa-solid fa-arrow-right btn-arrow"></i></a>
              <Link href={service.parentPath} className="btn btn-outline">Tous les services</Link>
            </div>
            <div className="phero-bullets">
              {light.bullets.map((b) => (
                <span key={b.label} className="phero-bullet"><i className={b.icon}></i> {b.label}</span>
              ))}
            </div>
          </div>
          <div className="phero-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={service.heroImage} alt={service.tag} loading="eager" />
            {light.stamp && (
              <div className="phero-stamp">
                <strong>{light.stamp.value}</strong>
                <span>{light.stamp.label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sub services */}
      <section className="subs">
        <div className="container">
          <div className="shead reveal">
            <small>Notre offre</small>
            <h2>{light.subsTitle.split(" ").slice(0, -1).join(" ")} <span>{light.subsTitle.split(" ").slice(-1)[0]}</span></h2>
            {light.subsSubtitle && <p>{light.subsSubtitle}</p>}
          </div>
          <div className="subs-grid">
            {light.subs.map((s) => (
              <div key={s.title} className="sub">
                <div className="sub-icon"><i className={s.icon}></i></div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="why" id="processus">
        <div className="container">
          <div className="shead reveal">
            <small>Nos atouts</small>
            <h2>Pourquoi choisir <span>Vizio Biza ?</span></h2>
          </div>
          <div className="why-grid">
            {light.whyItems.map((w) => (
              <div key={w.title} className="why-item">
                <div className="why-icon"><i className={w.icon}></i></div>
                <h4>{w.title}</h4>
                <p>{w.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="related">
        <div className="container">
          <div className="shead reveal">
            <small>Découvrir</small>
            <h2>{light.relatedTitle.split(" ").slice(0, -1).join(" ")} <span>{light.relatedTitle.split(" ").slice(-1)[0]}</span></h2>
          </div>
          <div className="related-grid">
            {light.relatedItems.map((r) => (
              <Link key={r.slug} href={`/services/${r.slug}`} className="rel-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt={r.title} loading="lazy" />
                <div className="rel-info">
                  <small>{service.category === "impression" ? "Impression" : "Photographie"}</small>
                  <h3>{r.title}</h3>
                  <span>Découvrir <i className="fa-solid fa-arrow-right"></i></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="ctab">
        <div className="container">
          <div>
            <small>Passez à l&apos;action</small>
            <h2>
              {light.ctaTitle}{light.ctaTitleItalic ? <> <span>{light.ctaTitleItalic}</span></> : null}
            </h2>
            <p>{light.ctaSubtitle}</p>
          </div>
          <div className="ctab-actions">
            <a href="#contact" className="btn btn-gold">{isPrint ? "Demander un devis" : "Réserver une séance"} <i className="fa-solid fa-arrow-right btn-arrow"></i></a>
            <Link href={service.parentPath} className="btn btn-glight">Tous les services</Link>
          </div>
        </div>
      </section>

      <ContactSection variant={isPrint ? "printing" : "photography"} contact={contact} settings={settings} />
      <Newsletter />
      <Footer settings={settings} />
      <WhatsAppFloat settings={settings} />
    </>
  );
}
