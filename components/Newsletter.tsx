"use client";
import { useState } from "react";

export default function Newsletter() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector<HTMLInputElement>("input");
    if (input && input.value) {
      input.value = "";
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="nl-text">
          <small>Restez informés</small>
          <h3>Inscrivez-vous à notre newsletter</h3>
          <p>Recevez nos dernières actualités, offres spéciales et conseils d'experts impression et photographie.</p>
        </div>
        <form className="nl-form" onSubmit={handleSubmit}>
          <input type="email" placeholder={sent ? "Merci pour votre inscription !" : "Votre adresse email"} required />
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </section>
  );
}
