"use client";
import { useState } from "react";

export interface ReviewData {
  name: string;
  detail: string;
  avatar: string;
  quote: string;
  rating: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewData) => void;
}

function makeAvatar(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}

export default function ReviewModal({ open, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [quote, setQuote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, detail, avatar: makeAvatar(name), quote, rating });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName(""); setDetail(""); setQuote(""); setRating(5); setHover(0);
    onClose();
  };

  return (
    <div className="rmodal-backdrop" onClick={handleClose}>
      <div className="rmodal" onClick={e => e.stopPropagation()}>
        <button className="rmodal-close" onClick={handleClose} aria-label="Fermer">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {!submitted ? (
          <>
            <div className="rmodal-head">
              <div className="rmodal-icon"><i className="fa-solid fa-star"></i></div>
              <h3>Laisser un avis</h3>
              <p>Partagez votre expérience avec notre studio</p>
            </div>

            <div className="rmodal-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`rmodal-star${(hover || rating) >= star ? " active" : ""}`}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
                >
                  <i className="fa-solid fa-star"></i>
                </button>
              ))}
            </div>

            <form className="rmodal-form" onSubmit={handleSubmit}>
              <div className="rmodal-row">
                <div className="rmodal-field">
                  <label>Nom & Prénom <span>*</span></label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Khalid Amrani" required />
                </div>
                <div className="rmodal-field">
                  <label>Entreprise / Rôle</label>
                  <input type="text" value={detail} onChange={e => setDetail(e.target.value)} placeholder="Ex: Directeur Marketing" />
                </div>
              </div>
              <div className="rmodal-field">
                <label>Votre avis <span>*</span></label>
                <textarea value={quote} onChange={e => setQuote(e.target.value)} placeholder="Partagez votre expérience avec notre studio…" rows={4} required />
              </div>
              <button type="submit" className="rmodal-submit">
                <i className="fa-solid fa-paper-plane"></i> Publier mon avis
              </button>
            </form>
          </>
        ) : (
          <div className="rmodal-success">
            <div className="rmodal-success-icon"><i className="fa-solid fa-circle-check"></i></div>
            <h3>Merci pour votre avis&nbsp;!</h3>
            <p>Votre retour nous aide à améliorer continuellement nos services. Il sera visible immédiatement dans la liste.</p>
            <button className="rmodal-submit" onClick={handleClose}>
              <i className="fa-solid fa-check"></i> Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
