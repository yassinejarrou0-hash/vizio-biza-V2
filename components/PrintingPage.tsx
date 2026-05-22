"use client";
import { useEffect, useState } from "react";
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
import ReviewModal, { type ReviewData } from "./ReviewModal";
import type { PrintContent, Settings, ContactConfig } from "@/lib/content-types";

const CATEGORIES = [
  { label: "Impression Photo", href: "/services/impression-offset", icon: "fa-solid fa-image", badge: "Best-seller" },
  { label: "Sublimation & Personnalisation", href: "/services/sublimation", icon: "fa-solid fa-shirt" },
  { label: "Marketing & Publicitaire", href: "/services/impression-numerique", icon: "fa-solid fa-bullhorn" },
  { label: "Stickers & Vinyle", href: "/services/stickers-vinyle", icon: "fa-solid fa-pen-nib" },
  { label: "Grand Format", href: "/services/grand-format", icon: "fa-solid fa-square-poll-vertical" },
  { label: "Technique & Finition", href: "/services/finition-personnalisee", icon: "fa-solid fa-toolbox", badge: "Nouveau" },
  { label: "Design & Création", href: "/services/design-creation", icon: "fa-solid fa-palette" },
  { label: "Photographie & Vidéo", href: "/photographie", icon: "fa-solid fa-camera" },
];

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Impression", href: "/impression", active: true },
  { label: "Photographie & Vidéo", href: "/photographie" },
  { label: "Processus", href: "#processus" },
  { label: "Avis", href: "#avis" },
  { label: "Contact", href: "#contact" },
];

const DRAWER_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Impression & Personnalisation", href: "/impression" },
  { label: "— Impression Photo", href: "/services/impression-offset", indent: true },
  { label: "— Sublimation & Objets", href: "/services/sublimation", indent: true },
  { label: "— Publicitaire & Marketing", href: "/services/impression-numerique", indent: true },
  { label: "— Stickers & Vinyle", href: "/services/stickers-vinyle", indent: true },
  { label: "— Grand Format", href: "/services/grand-format", indent: true },
  { label: "— Technique & Finition", href: "/services/finition-personnalisee", indent: true },
  { label: "— Design & Création", href: "/services/design-creation", indent: true },
  { label: "Photographie & Vidéo", href: "/photographie" },
  { label: "Processus", href: "#processus" },
  { label: "Avis", href: "#avis" },
  { label: "Contact", href: "#contact" },
];

export default function PrintingPage({ content, settings, contact }: { content: PrintContent; settings: Settings; contact: ContactConfig }) {
  const PRINT_HERO_SLIDES = content.heroSlides;
  const PRINT_SLIDE_COUNT = PRINT_HERO_SLIDES.length || 1;
  const BEST_HERO_SLIDES = content.bestsellers;
  const BEST_SLIDE_COUNT = BEST_HERO_SLIDES.length || 1;
  const [drawer, setDrawer] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>(content.reviews);
  const handleNewReview = (r: ReviewData) => setReviews(prev => [r, ...prev]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const prevSlide = () => { setActiveSlide(s => (s - 1 + PRINT_SLIDE_COUNT) % PRINT_SLIDE_COUNT); setAnimKey(k => k + 1); };
  const nextSlide = () => { setActiveSlide(s => (s + 1) % PRINT_SLIDE_COUNT); setAnimKey(k => k + 1); };
  const goToSlide = (i: number) => { setActiveSlide(i); setAnimKey(k => k + 1); };
  const slide = PRINT_HERO_SLIDES[activeSlide] ?? PRINT_HERO_SLIDES[0];
  const [bestSlide, setBestSlide] = useState(0);
  const [bestAnimKey, setBestAnimKey] = useState(0);
  const prevBest = () => { setBestSlide(s => (s - 1 + BEST_SLIDE_COUNT) % BEST_SLIDE_COUNT); setBestAnimKey(k => k + 1); };
  const nextBest = () => { setBestSlide(s => (s + 1) % BEST_SLIDE_COUNT); setBestAnimKey(k => k + 1); };
  const goToBest = (i: number) => { setBestSlide(i); setBestAnimKey(k => k + 1); };
  const bs = BEST_HERO_SLIDES[bestSlide];

  // Autoplay: advance hero every 7s (talborjtbureau.ma uses 25s; 7s feels more lively here)
  useEffect(() => {
    if (PRINT_SLIDE_COUNT <= 1) return;
    const id = setInterval(() => {
      setActiveSlide(s => (s + 1) % PRINT_SLIDE_COUNT);
      setAnimKey(k => k + 1);
    }, 7000);
    return () => clearInterval(id);
  }, [PRINT_SLIDE_COUNT, activeSlide]);
  useEffect(() => {
    if (BEST_SLIDE_COUNT <= 1) return;
    const id = setInterval(() => {
      setBestSlide(s => (s + 1) % BEST_SLIDE_COUNT);
      setBestAnimKey(k => k + 1);
    }, 8000);
    return () => clearInterval(id);
  }, [bestSlide]);

  return (
    <>
      <RevealObserver />
      <Topbar settings={settings} />
      <Header searchCategories={CATEGORIES} onMenuToggle={() => setDrawer(true)} settings={settings} />
      <MobileSearch />
      <CategoryNav navLinks={NAV_LINKS} categories={CATEGORIES} settings={settings} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} links={DRAWER_LINKS} ctaLabel="Demander un devis" settings={settings} />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-anim" key={animKey}>
              <span className="hero-tag"><i className={slide.tagIcon}></i> {slide.tagLabel}</span>
              <h1 className="hero-h1">{slide.h1Before}<br />{slide.h1Prefix}<span>{slide.h1Highlight}</span>{slide.h1After}</h1>
              <p className="hero-sub">{slide.sub}</p>
              <div className="hero-cta">
                <a href="#contact" className="btn btn-accent">Demander un devis <i className="fa-solid fa-arrow-right btn-arrow"></i></a>
                <a href="#products" className="btn btn-outline">Voir le catalogue</a>
              </div>
              <div className="hero-bullets">
                <span className="hero-bullet"><i className="fa-solid fa-medal"></i> Qualité professionnelle</span>
                <span className="hero-bullet"><i className="fa-solid fa-bolt"></i> Livraison rapide</span>
                <span className="hero-bullet"><i className="fa-solid fa-wand-magic-sparkles"></i> Solutions sur mesure</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            {PRINT_HERO_SLIDES.map((s, i) => (
              <div key={i} className={`hero-slide${i === activeSlide ? " is-active" : ""}${s.contain ? " hero-slide-contain" : ""}`}>
                {s.mediaType === "video" ? (
                  <video autoPlay muted loop playsInline poster={s.mediaPoster}>
                    <source src={s.mediaSrc} type="video/mp4" />
                  </video>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={s.mediaSrc} alt={s.mediaAlt} />
                )}
              </div>
            ))}
            <div className="hero-dots">
              {PRINT_HERO_SLIDES.map((_, i) => (
                <button key={i} className={`hero-dot${i === activeSlide ? " is-active" : ""}`} onClick={() => goToSlide(i)} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
        <button className="hero-nav hero-nav-prev" onClick={prevSlide} aria-label="Précédent">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className="hero-nav hero-nav-next" onClick={nextSlide} aria-label="Suivant">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </section>

      {/* FEATURED 3 */}
      <section className="featured3">
        <div className="container">
          <div className="featured3-grid">
            {content.featured3.map((c, i) => (
              <article key={i} className="f3-card">
                <Link href={c.href} className="f3-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.alt} loading="lazy" />
                </Link>
                <div className="f3-info">
                  <span className="f3-cat">{c.cat}</span>
                  <h3 className="f3-name">{c.name}</h3>
                  <Link href={c.href} className="f3-link">Découvrir <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES TILES */}
      <section className="cats">
        <div className="container">
          <div className="section-head reveal">
            <h2>Catégories en <span>vedette</span></h2>
            <a href="#products" className="head-link">Tout voir <i className="fa-solid fa-arrow-right"></i></a>
          </div>
          <div className="cats-grid">
            {content.categories.map((t) => (
              <Link key={t.href} href={t.href} className="cat-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.title} loading="lazy" />
                <div className="cat-tile-info"><h3>{t.title}</h3><span>{t.sub}</span></div>
                <span className="cat-tile-arrow"><i className="fa-solid fa-arrow-right"></i></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO STRIP */}
      <section className="promo-strip">
        <div className="container">
          <div className="promo-strip-grid">
            {content.promoStrip.map((p, i) => (
              <div key={i} className="ps-item">
                <div className="ps-icon"><i className={p.icon}></i></div>
                <div className="ps-text"><strong>{p.title}</strong><small>{p.sub}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE CATALOGUE */}
      <section className="products" id="products">
        <div className="container">
          <div className="section-head center reveal">
            <small>Notre catalogue</small>
            <h2>Nos Meilleures <span>Ventes</span></h2>
            <p>Du concept à la livraison, nous transformons vos idées en supports imprimés d&apos;exception.</p>
          </div>
          <div className="products-grid">
            {content.products.map((p, i) => (
              <PCard
                key={i}
                badge={p.badgeKind && p.badgeLabel ? { kind: p.badgeKind as "hot" | "new" | "gold" | "pro", label: p.badgeLabel } : undefined}
                front={p.front}
                back={p.back}
                cat={p.cat}
                name={p.name}
                alt={p.alt}
                price={p.price || undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECONDARY HERO — BESTSELLERS */}
      <section className="hero hero-secondary">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-anim" key={bestAnimKey}>
              <span className="hero-tag"><i className={bs.tagIcon}></i> {bs.tagLabel}</span>
              <h1 className="hero-h1">{bs.h1Before}<br />{bs.h1Prefix}<span>{bs.h1Highlight}</span>{bs.h1After}</h1>
              <p className="hero-sub">{bs.sub}</p>
              <div className="hero-cta">
                <a href={bs.ctaHref} className="btn btn-accent">{bs.ctaLabel} <i className="fa-solid fa-arrow-right btn-arrow"></i></a>
                <a href="#contact" className="btn btn-outline">Demander un devis</a>
              </div>
            </div>
          </div>
          <div className="hero-right">
            {BEST_HERO_SLIDES.map((s, i) => (
              <div key={i} className={`hero-slide hero-slide-contain${i === bestSlide ? " is-active" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt="Meilleures ventes" loading="lazy" />
              </div>
            ))}
            <div className="hero-dots">
              {BEST_HERO_SLIDES.map((_, i) => (
                <button key={i} className={`hero-dot${i === bestSlide ? " is-active" : ""}`} onClick={() => goToBest(i)} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
        <button className="hero-nav hero-nav-prev" onClick={prevBest} aria-label="Précédent">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className="hero-nav hero-nav-next" onClick={nextBest} aria-label="Suivant">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </section>

      {/* PROCESS */}
      <section className="process" id="processus">
        <div className="container">
          <div className="section-head center reveal">
            <small>Notre méthode</small>
            <h2>Processus de <span>travail</span></h2>
            <p>Quatre étapes claires, du premier échange à la livraison finale de votre projet.</p>
          </div>
          <div className="process-grid">
            {content.process.map((p, i) => (
              <div key={i} className="proc">
                <span className="proc-num">{i + 1}</span>
                <div className="proc-icon"><i className={p.icon}></i></div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-grid">
            <div className="about-text reveal">
              <small>{content.about.kicker}</small>
              <h2>{content.about.titleBefore} <span>{content.about.titleHighlight}</span></h2>
              <p>{content.about.p1}</p>
              <p>{content.about.p2}</p>
              <div className="about-features">
                <div className="about-feat"><i className="fa-solid fa-medal"></i><div><strong>Qualité professionnelle</strong>Standards premium</div></div>
                <div className="about-feat"><i className="fa-solid fa-wand-magic-sparkles"></i><div><strong>Créativité moderne</strong>Direction artistique</div></div>
                <div className="about-feat"><i className="fa-solid fa-sliders"></i><div><strong>Solutions personnalisées</strong>Sur mesure</div></div>
                <div className="about-feat"><i className="fa-solid fa-bolt"></i><div><strong>Livraison rapide</strong>Et efficace</div></div>
              </div>
              <a href="#contact" className="btn btn-accent">Discuter de votre projet <i className="fa-solid fa-arrow-right btn-arrow"></i></a>
            </div>
            <div className="about-visual reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={content.about.image} alt="Studio Vizio Biza" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews" id="avis">
        <div className="container">
          <div className="section-head reveal">
            <h2>Avis <span>clients</span></h2>
            <button className="btn-review" onClick={() => setReviewModal(true)}>
                <span className="btn-review-stars"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></span>
                Laisser un avis
              </button>
          </div>
          <div className="reviews-track">
            {reviews.map((r, i) => <Review key={i} {...r} />)}
          </div>
        </div>
      </section>

      <ContactSection variant="printing" contact={contact} settings={settings} />
      <Newsletter />
      <Footer settings={settings} />
      <WhatsAppFloat settings={settings} />
      <ReviewModal open={reviewModal} kind="print" onClose={() => setReviewModal(false)} onSubmit={handleNewReview} />
    </>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function PCard({
  badge, front, back, cat, name, alt, eye = "#contact", stars = 5, price,
}: {
  badge?: { kind: "hot" | "new" | "gold" | "pro"; label: string };
  front: string; back: string; cat: string; name: string; alt: string; eye?: string; stars?: number; price?: string;
}) {
  return (
    <article className="pcard">
      <div className="pcard-media">
        {badge && <div className="pcard-badges"><span className={`pbadge ${badge.kind}`}>{badge.label}</span></div>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="img-front" src={front} alt={alt} loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="img-back" src={back} alt="" loading="lazy" />
        <div className="pcard-actions">
          <button className="pcard-action" aria-label="Favoris"><i className="fa-regular fa-heart"></i></button>
          <button className="pcard-action" aria-label="Comparer"><i className="fa-solid fa-arrows-left-right"></i></button>
          <a href={eye} className="pcard-action" aria-label="Aperçu"><i className="fa-regular fa-eye"></i></a>
        </div>
        <a href="#contact" className="pcard-quick"><i className="fa-solid fa-clipboard-list"></i> Demander un devis</a>
      </div>
      <div className="pcard-body">
        <a href="#" className="pcard-cat">{cat}</a>
        <a href="#contact" className="pcard-name">{name}</a>
        {price && <p className="pcard-tag-price"><i className="fa-solid fa-tag"></i> À partir de <strong>{price}</strong></p>}
        <div className="pcard-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <i key={i} className={i < stars ? "fa-solid fa-star" : "fa-regular fa-star empty"}></i>
          ))}
        </div>
      </div>
    </article>
  );
}

function Review({ avatar, name, detail, quote, rating = 5 }: { avatar: string; name: string; detail: string; quote: string; rating?: number }) {
  return (
    <article className="review">
      <div className="review-stars">
        {Array.from({ length: 5 }).map((_, i) => <i key={i} className="fa-solid fa-star" style={i >= rating ? { opacity: 0.2 } : undefined}></i>)}
      </div>
      <p className="review-quote">{quote}</p>
      <div className="review-author">
        <div className="author-avatar">{avatar}</div>
        <div className="author-info"><strong>{name}</strong><span>{detail}</span></div>
      </div>
    </article>
  );
}
