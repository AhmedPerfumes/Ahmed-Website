"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";

const EWD_DATE = new Date("2026-08-28T00:00:00+04:00");

function useCountdown(target) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000)  / 60000);
      const secs  = Math.floor((diff % 60000)    / 1000);
      setTime({ days, hours, mins, secs });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

// Shimmer particles
const PARTICLES = [
  { size: 6, x: "12%", y: "20%", delay: 0 },
  { size: 10, x: "88%", y: "15%", delay: 1.2 },
  { size: 8, x: "75%", y: "70%", delay: 0.6 },
  { size: 5, x: "20%", y: "75%", delay: 2.0 },
  { size: 12, x: "50%", y: "12%", delay: 1.8 },
  { size: 7, x: "38%", y: "82%", delay: 0.4 },
  { size: 9, x: "92%", y: "55%", delay: 1.5 },
  { size: 6, x: "5%", y: "50%", delay: 2.5 },
];

const translations = {
  en: {
    eyebrow: "✦ Emirati Women's Day 2026 ✦",
    title: "She Is The",
    titleEm: "Scent",
    arabic: "المرأة الإماراتية — إلهام لا ينتهي",
    desc: "Celebrating the remarkable Emirati woman — her strength, her heritage, her fragrance story. Join us in an immersive experience crafted with love.",
    days: "Days", hours: "Hours", mins: "Mins", secs: "Secs",
    cta1: "Participate Now",
    cta2: "Shop Women's Collection",
    scroll: "Scroll",
  },
  ar: {
    eyebrow: "✦ يوم المرأة الإماراتية ٢٠٢٦ ✦",
    title: "هي",
    titleEm: "العطر",
    arabic: "المرأة الإماراتية — إلهام لا ينتهي",
    desc: "احتفاءً بالمرأة الإماراتية الاستثنائية — قوّتها وإرثها وحكايتها العطرية. انضمي إلينا في تجربة مصنوعة بالحب.",
    days: "يوم", hours: "ساعة", mins: "دقيقة", secs: "ثانية",
    cta1: "شاركي الآن",
    cta2: "تسوّقي مجموعة المرأة",
    scroll: "تمرير",
  },
};

export default function EWDHero() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;
  const time = useCountdown(EWD_DATE);
  const bgRef = useRef(null);

  // Subtle parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const y = window.scrollY * 0.35;
      bgRef.current.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="ewd-hero" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background image with parallax */}
      <div className="ewd-hero__bg" ref={bgRef} />

      {/* Overlay */}
      <div className="ewd-hero__overlay" />

      {/* Shimmer particles */}
      <div className="ewd-hero__shimmer">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="ewd-hero__shimmer-particle"
            style={{
              width: p.size,
              height: p.size,
              left: p.x,
              top: p.y,
              animationDelay: `${p.delay}s`,
              animationDuration: `${6 + i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Arabic calligraphy watermark */}
      <div className="ewd-hero__calligraphy" aria-hidden="true">
        المرأة
      </div>

      {/* Top / Bottom gold borders */}
      <div className="ewd-hero__border-top" />
      <div className="ewd-hero__border-bottom" />

      {/* Main content */}
      <div className="ewd-hero__content">
        {/* Eyebrow */}
        <motion.span
          className="ewd-hero__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {t.eyebrow}
        </motion.span>

        {/* Title */}
        <motion.h1
          className="ewd-hero__title"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.title}
          <em>{t.titleEm}</em>
        </motion.h1>

        {/* Arabic subtitle */}
        <motion.p
          className="ewd-hero__arabic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62 }}
        >
          {t.arabic}
        </motion.p>

        {/* Description */}
        <motion.p
          className="ewd-hero__desc"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.74 }}
        >
          {t.desc}
        </motion.p>

        {/* Countdown */}
        <motion.div
          className="ewd-countdown"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.86, duration: 0.6 }}
        >
          {[
            { val: time.days,  label: t.days },
            { val: time.hours, label: t.hours },
            { val: time.mins,  label: t.mins },
            { val: time.secs,  label: t.secs },
          ].reduce((acc, item, i, arr) => {
            acc.push(
              <div key={item.label} className="ewd-countdown__block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.val}
                    className="ewd-countdown__num"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {pad(item.val)}
                  </motion.span>
                </AnimatePresence>
                <span className="ewd-countdown__label">{item.label}</span>
              </div>
            );
            if (i < arr.length - 1) {
              acc.push(<span key={`sep-${i}`} className="ewd-countdown__sep">:</span>);
            }
            return acc;
          }, [])}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="ewd-hero__ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <motion.a
            href="#ewd-quiz"
            className="ewd-btn-primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            id="ewd-hero-participate"
          >
            <span>🌹</span> {t.cta1}
          </motion.a>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={`/${locale}/product-category/perfumes`}
              className="ewd-btn-outline"
              id="ewd-hero-shop"
            >
              {t.cta2} →
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="ewd-hero__scroll" aria-hidden="true">
        <div className="ewd-hero__scroll-line" />
        <span>{t.scroll}</span>
      </div>
    </section>
  );
}
