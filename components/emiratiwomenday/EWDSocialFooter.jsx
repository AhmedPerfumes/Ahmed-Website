"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";

const translations = {
  en: {
    icon: "🌹",
    label: "Join The Celebration",
    heading: "She Carries",
    headingEm: "The Scent of Arabia",
    desc: "Emirati Women's Day is a celebration of strength, elegance, and heritage. Share your story, find your fragrance, and join a community that honours every dimension of the remarkable Emirati woman.",
    ctas: [
      { text: "Shop Women's Collection", href: "/product-category/perfumes", primary: true, id: "ewd-footer-shop" },
      { text: "Take the Scent Quiz", href: "#ewd-quiz", primary: false, id: "ewd-footer-quiz" },
    ],
    hashtag: "#AhmedAlMaghribiEWD",
    copied: "✅ Copied!",
    arabicQuote: "\"المرأة الإماراتية — قوة وأناقة وعطر لا يُنسى\"",
    tagline: "✦ Ahmed Al Maghribi — Celebrating Emirati Women's Day 2026 ✦",
  },
  ar: {
    icon: "🌹",
    label: "انضمي للاحتفال",
    heading: "هي تحمل",
    headingEm: "عطر العرب",
    desc: "يوم المرأة الإماراتية احتفاء بالقوة والأناقة والتراث. شاركي قصتكِ، اكتشفي عطرك، وانضمي إلى مجتمع يُكرّم كل أبعاد المرأة الإماراتية الاستثنائية.",
    ctas: [
      { text: "تسوّقي مجموعة المرأة", href: "/product-category/perfumes", primary: true, id: "ewd-footer-shop" },
      { text: "اختبري عطركِ", href: "#ewd-quiz", primary: false, id: "ewd-footer-quiz" },
    ],
    hashtag: "#AhmedAlMaghribiEWD",
    copied: "✅ تم النسخ!",
    arabicQuote: "\"المرأة الإماراتية — قوة وأناقة وعطر لا يُنسى\"",
    tagline: "✦ أحمد المغربي — احتفاءً بيوم المرأة الإماراتية ٢٠٢٦ ✦",
  },
};

export default function EWDSocialFooter() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;
  const [copied, setCopied] = useState(false);

  const copyHashtag = () => {
    navigator.clipboard?.writeText(t.hashtag).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="ewd-finale" className="ewd-section ewd-footer-cta" dir={isRtl ? "rtl" : "ltr"}>
      {/* Glow background */}
      <div className="ewd-footer-cta__glow" aria-hidden="true" />

      <div className="ewd-container">
        <div className="ewd-footer-cta__content">
          {/* Icon */}
          <motion.div
            className="ewd-footer-cta__icon"
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          >
            {t.icon}
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="ewd-footer-cta__heading"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t.heading} <em>{t.headingEm}</em>
          </motion.h2>

          {/* Divider */}
          <div className="ewd-divider" />

          {/* Description */}
          <motion.p
            className="ewd-footer-cta__desc"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            {t.desc}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="ewd-footer-cta__ctas"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
          >
            {t.ctas.map((cta) => (
              <motion.div key={cta.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={cta.href.startsWith("/") ? `/${locale}${cta.href}` : cta.href}
                  className={cta.primary ? "ewd-btn-primary" : "ewd-btn-outline"}
                  id={cta.id}
                >
                  {cta.text}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Hashtag copy */}
          <motion.button
            className={`ewd-footer-cta__hashtag ${copied ? "copied" : ""}`}
            onClick={copyHashtag}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            id="ewd-footer-hashtag"
          >
            📋 {copied ? t.copied : t.hashtag}
          </motion.button>

          {/* Arabic quote */}
          <motion.p
            className="ewd-footer-cta__arabic-quote"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65 }}
          >
            {t.arabicQuote}
          </motion.p>

          {/* Tagline */}
          <motion.p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "var(--ewd-ink4)",
              textTransform: "uppercase",
              marginTop: 24,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.75 }}
          >
            {t.tagline}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
