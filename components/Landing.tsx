"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LandingConfig, Settings } from "@/lib/content-types";

function useTypewriter(elRef: React.RefObject<HTMLSpanElement | null>, words: string[], startDelay: number) {
  useEffect(() => {
    let wi = 0, ci = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      const el = elRef.current;
      if (!el) return;
      const word = words[wi];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; timer = setTimeout(tick, 2200); return; }
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      timer = setTimeout(tick, deleting ? 45 : 90);
    }
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [elRef, words, startDelay]);
}

export default function Landing({ landing, settings }: { landing: LandingConfig; settings: Settings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trans, setTrans] = useState(false);
  const printRef = useRef<HTMLSpanElement>(null);
  const photoRef = useRef<HTMLSpanElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.body.classList.add("landing");
    const t = setTimeout(() => setLoading(false), 1700);
    return () => {
      clearTimeout(t);
      document.body.classList.remove("landing");
    };
  }, []);

  useTypewriter(printRef, landing.print.typewriterWords, 2000);
  useTypewriter(photoRef, landing.photo.typewriterWords, 2900);

  // Particles
  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let W = (cv.width = window.innerWidth);
    let H = (cv.height = window.innerHeight);
    const onResize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const pts = Array.from({ length: 75 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.35 + 0.05,
    }));
    let raf = 0;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(47,107,63,${p.a})`;
        ctx!.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 140) {
            ctx!.beginPath();
            ctx!.moveTo(pts[i].x, pts[i].y);
            ctx!.lineTo(pts[j].x, pts[j].y);
            ctx!.strokeStyle = `rgba(47,107,63,${0.12 * (1 - d / 140)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (url: string) => {
    setTrans(true);
    setTimeout(() => router.push(url), 650);
  };

  const onPanelClick = (url: string, e: React.MouseEvent<HTMLDivElement>) => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) { goTo(url); return; }
    const panel = e.currentTarget;
    if (panel.classList.contains("m-zoom")) return;
    panel.classList.add("m-zoom");
    panel.parentElement?.querySelectorAll(".panel").forEach((p) => {
      if (p !== panel) p.classList.add("m-fading");
    });
    setTimeout(() => router.push(url), 560);
  };

  return (
    <>
      {loading && (
        <div id="loading" className="landing-loading">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.logo} alt={settings.name} className="ld-logo" />
          <div className="ld-track"><div className="ld-fill"></div></div>
          <span className="ld-text">Chargement en cours...</span>
        </div>
      )}

      <div id="pageTrans" style={{
        position: "fixed", inset: 0, zIndex: 9998, background: "#477715",
        clipPath: trans ? "polygon(0 0,100% 0,100% 100%,0 100%)" : "polygon(0 100%,100% 100%,100% 100%,0 100%)",
        transition: "clip-path .65s cubic-bezier(.77,0,.175,1)",
      }} />

      <canvas id="bgCanvas" ref={cvRef} className="bg-canvas"></canvas>

      <header className="top-hdr">
        <div className="hdr-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.logo} alt={settings.name} className="hdr-logo" width={420} height={120} />
        </div>
      </header>

      <main className="split">
        <div className="panel p-print" onClick={(e) => onPanelClick(landing.print.href, e)}>
          <div className="p-bg">
            <video autoPlay muted loop playsInline>
              <source src={landing.print.videoSrc} type="video/mp4" />
            </video>
          </div>
          <div className="p-grad"></div>
          <div className="p-noise"></div>
          <div className="p-content">
            <h2 className="p-title">{landing.print.title}<br />{landing.print.titleLine2}</h2>
            <div className="p-typed-wrap">
              <span className="p-typed-label">—</span>
              <span className="p-typed-word" ref={printRef}></span>
              <span className="p-typed-cursor"></span>
            </div>
            <button className="p-btn" onClick={(e) => { e.stopPropagation(); goTo(landing.print.href); }}>{landing.print.btnLabel}</button>
          </div>
          <div className="p-line"></div>
          <div className="p-divider"></div>
        </div>

        <div className="panel p-photo" onClick={(e) => onPanelClick(landing.photo.href, e)}>
          <div className="p-bg">
            <video autoPlay muted loop playsInline>
              <source src={landing.photo.videoSrc} type="video/mp4" />
            </video>
          </div>
          <div className="p-grad"></div>
          <div className="p-noise"></div>
          <div className="p-content">
            <h2 className="p-title">{landing.photo.title}<br />{landing.photo.titleLine2}</h2>
            <div className="p-typed-wrap">
              <span className="p-typed-label">—</span>
              <span className="p-typed-word" ref={photoRef}></span>
              <span className="p-typed-cursor"></span>
            </div>
            <button className="p-btn" onClick={(e) => { e.stopPropagation(); goTo(landing.photo.href); }}>{landing.photo.btnLabel}</button>
          </div>
          <div className="p-line"></div>
        </div>
      </main>
    </>
  );
}
