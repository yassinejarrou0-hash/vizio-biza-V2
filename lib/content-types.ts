export interface HeroSlide {
  tagIcon: string;
  tagLabel: string;
  h1Before: string;
  h1Prefix: string;
  h1Highlight: string;
  h1After: string;
  sub: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  mediaPoster: string;
  mediaAlt: string;
  contain: boolean;
}

export interface Product {
  badgeKind: "" | "hot" | "new" | "gold" | "pro";
  badgeLabel: string;
  front: string;
  back: string;
  cat: string;
  name: string;
  alt: string;
  price: string;
}

export interface Review {
  name: string;
  detail: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface About {
  kicker: string;
  titleBefore: string;
  titleHighlight: string;
  p1: string;
  p2: string;
  image: string;
}

export interface FeaturedCard {
  href: string;
  img: string;
  alt: string;
  cat: string;
  name: string;
}

export interface CategoryTile {
  href: string;
  img: string;
  title: string;
  sub: string;
}

export interface ProcessStep {
  icon: string;
  title: string;
  desc: string;
}

export interface PromoStripItem {
  icon: string;
  title: string;
  sub: string;
}

export interface BestsellerSlide {
  tagIcon: string;
  tagLabel: string;
  h1Before: string;
  h1Prefix: string;
  h1Highlight: string;
  h1After: string;
  sub: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface PhotoProduct {
  tab: "all" | "events" | "video" | "admin";
  badgeKind: "" | "hot" | "new" | "gold" | "pro";
  badgeLabel: string;
  front: string;
  back: string;
  cat: string;
  name: string;
  alt: string;
}

export interface LandingPanel {
  title: string;
  titleLine2: string;
  videoSrc: string;
  typewriterWords: string[];
  btnLabel: string;
  href: string;
}

export interface LandingConfig {
  print: LandingPanel;
  photo: LandingPanel;
}

export interface ContactConfig {
  hoursPrint: string;
  hoursPhoto: string;
  servicesPrint: string[];
  servicesPhoto: string[];
}

export interface Settings {
  name: string;
  location: string;
  address: string;
  email: string;
  phone: string;
  phoneRaw: string;
  whatsappPhone: string;
  whatsapp: string;
  hours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  logo: string;
  url: string;
}

export interface PrintContent {
  heroSlides: HeroSlide[];
  featured3: FeaturedCard[];
  categories: CategoryTile[];
  promoStrip: PromoStripItem[];
  products: Product[];
  bestsellers: BestsellerSlide[];
  process: ProcessStep[];
  reviews: Review[];
  about: About;
}

export interface PhotoContent {
  heroSlides: HeroSlide[];
  featured3: FeaturedCard[];
  categories: CategoryTile[];
  promoStrip: PromoStripItem[];
  products: PhotoProduct[];
  bestsellers: BestsellerSlide[];
  process: ProcessStep[];
  reviews: Review[];
  about: About;
}

export interface SiteContent {
  settings: Settings;
  landing: LandingConfig;
  print: PrintContent;
  photo: PhotoContent;
  contact: ContactConfig;
}

/* ─── Services / Blog ───────────────────────────────────────────────────── */

export type ServiceVariant = "dark" | "light";
export type ServiceCategory = "impression" | "photographie";

export interface Spec { icon: string; title: string; value: string }
export interface FAQ { q: string; a: string }
export interface Related { slug: string; title: string; description: string; image: string }
export interface SubService { icon: string; title: string; description: string }
export interface WhyItem { icon: string; title: string; description: string }

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; html: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "highlight"; html: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "specs"; items: Spec[] };

export interface ServiceData {
  slug: string;
  title: string;
  metaDescription: string;
  ogImage: string;
  heroImage: string;
  heroTitle: string;
  heroTitleItalic?: string;
  heroSubtitle: string;
  tag: string;
  tagIcon: string;
  category: ServiceCategory;
  variant: ServiceVariant;
  parentPath: string;
  parentLabel: string;
  readTime?: string;
  article?: {
    blocks: ArticleBlock[];
    faqs: FAQ[];
    ctaTitle: string;
    ctaSubtitle: string;
    related: Related[];
  };
  light?: {
    stamp?: { value: string; label: string };
    bullets: { icon: string; label: string }[];
    subsTitle: string;
    subsSubtitle?: string;
    subs: SubService[];
    whyTitle: string;
    whyItems: WhyItem[];
    relatedTitle: string;
    relatedItems: Related[];
    ctaTitle: string;
    ctaTitleItalic?: string;
    ctaSubtitle: string;
  };
}
