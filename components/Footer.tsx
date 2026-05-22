import Link from "next/link";
import { SITE } from "@/lib/constants";
import type { Settings } from "@/lib/content-types";

const printLinks = [
  { label: "Impression Photo", href: "/services/impression-offset" },
  { label: "Sublimation & Objets", href: "/services/sublimation" },
  { label: "Marketing & Publicitaire", href: "/services/impression-numerique" },
  { label: "Stickers & Vinyle", href: "/services/stickers-vinyle" },
  { label: "Grand Format", href: "/services/grand-format" },
  { label: "Technique & Finition", href: "/services/finition-personnalisee" },
  { label: "Design & Création", href: "/services/design-creation" },
];

const photoLinks = [
  { label: "Portrait Professionnel", href: "/services/photo-portrait" },
  { label: "Mariage & Événements", href: "/services/photo-evenements" },
  { label: "Production Vidéo", href: "/services/production-video" },
  { label: "Photo Produit", href: "/services/photo-produit" },
  { label: "Photo Administrative", href: "/services/photo-administrative" },
  { label: "Retouche Photo", href: "/services/retouche-photo" },
  { label: "Services Studio", href: "/services/services-studio" },
];

const usefulLinks = [
  { label: "Accueil", href: "/" },
  { label: "Impression", href: "/impression" },
  { label: "Photographie & Vidéo", href: "/photographie" },
  { label: "Notre processus", href: "#processus" },
  { label: "Avis clients", href: "#avis" },
  { label: "Contact", href: "#contact" },
];

const recentPosts = [
  { href: "/services/impression-offset", img: "https://res.cloudinary.com/dn51k6ysz/image/upload/v1775742095/af55122df7f0a7d9ebb2c2b4bbc0e35e_d6bvbc.jpg", cat: "Impression", title: "L'impression photo professionnelle" },
  { href: "/services/photo-commerciale", img: "https://res.cloudinary.com/dn51k6ysz/image/upload/v1775732907/0af33070949a2c81b328349c457cf0b3_ar3ed2.webp", cat: "Photo", title: "Photographie commerciale & impact" },
  { href: "/services/finition-personnalisee", img: "https://res.cloudinary.com/dn51k6ysz/image/upload/v1775742476/441ec6acd0ca332a83a1d9ba5540bf05_zas10i.jpg", cat: "Finitions", title: "DTF & finitions premium" },
];

export default function Footer({ settings }: { settings?: Settings }) {
  const s = settings || SITE;
  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr-grid">
          <div className="ftr-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.logo} alt={s.name} />
            <p>Studio professionnel spécialisé dans la photographie, la production vidéo et l'impression professionnelle. Solutions complètes pour particuliers et entreprises.</p>
            <div className="ftr-contact">
              <div><i className="fa-solid fa-location-dot"></i><span>{s.address}</span></div>
              <div><i className="fa-solid fa-phone"></i><a href={`tel:${s.phoneRaw}`}>{s.phone}</a></div>
              <div><i className="fa-regular fa-envelope"></i><a href={`mailto:${s.email}`}>{s.email}</a></div>
            </div>
            <div className="ftr-socials">
              <a href={s.instagram} target="_blank" rel="noopener" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href={s.facebook} target="_blank" rel="noopener" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href={s.tiktok} target="_blank" rel="noopener" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
              <a href={s.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>

          <div className="ftr-col">
            <h5>Impression</h5>
            <ul>{printLinks.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>

          <div className="ftr-col">
            <h5>Articles récents</h5>
            <div className="ftr-posts">
              {recentPosts.map((p) => (
                <div key={p.href} className="ftr-post">
                  <Link href={p.href} className="ftr-post-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt="" />
                  </Link>
                  <div className="ftr-post-info">
                    <small>{p.cat}</small>
                    <Link href={p.href}>{p.title}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ftr-col">
            <h5>Photographie</h5>
            <ul>{photoLinks.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>

          <div className="ftr-col">
            <h5>Liens utiles</h5>
            <ul>{usefulLinks.map((l) => <li key={l.href + l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>
        </div>

        <div className="ftr-bottom">
          <span>© {new Date().getFullYear()} {s.name} — Tous droits réservés.</span>
          <div className="ftr-pay">
            <span>Paiement :</span>
            <i className="fa-brands fa-cc-visa"></i>
            <i className="fa-brands fa-cc-mastercard"></i>
            <i className="fa-brands fa-cc-paypal"></i>
            <i className="fa-solid fa-money-bill-wave"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}
