"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useContextElement } from "@/context/Context";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function getImg(product) {
  if (product.image) return `${BASE_URL}storage/${product.image}`;
  try {
    const imgs = JSON.parse(product.images || "[]");
    return imgs[0] ? `${BASE_URL}storage/${imgs[0]}` : null;
  } catch { return null; }
}

function getSecondImg(product) {
  try {
    const imgs = JSON.parse(product.images || "[]");
    if (imgs.length > 1) return `${BASE_URL}storage/${imgs[1]}`;
    if (imgs.length > 0) return `${BASE_URL}storage/${imgs[0]}`;
  } catch {}
  return getImg(product);
}

const clean = (s = "") =>
  s.replace(/&amp;/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, " ")
    .trim().split(" ").join("-").toLowerCase();

function parseNotes(str = "") {
  if (!str) return [];
  return str.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    .split(/[,;·•]+/).map(n => n.trim()).filter(Boolean).slice(0, 6);
}

function extractDesc(desc = "") {
  const text = desc.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
  return text.length > 200 ? text.slice(0, 200) + "…" : text;
}

// ─── PERSONALITY PROFILES (gender-aware, richer) ──────────────────────────────
const PROFILES = {
  adventure:        { title: "THE FREE SPIRIT",    tags: ["Adventurous","Spontaneous","Pioneering","Imaginative"] },
  safe:             { title: "THE CLASSIC SOUL",   tags: ["Timeless","Refined","Elegant","Grounded"] },
  fresh_elegant:    { title: "THE SOPHISTICATE",   tags: ["Fresh","Elegant","Poised","Luminous"] },
  seductive_bold:   { title: "THE SEDUCTRESS",     tags: ["Bold","Magnetic","Daring","Sensual"] },
  comfortable_warm: { title: "THE HOMEBODY",       tags: ["Warm","Cozy","Authentic","Nurturing"] },
  mysterious:       { title: "THE ENIGMA",         tags: ["Mysterious","Deep","Exotic","Alluring"] },
  arabic:           { title: "THE ORIENTALIST",    tags: ["Rich","Opulent","Timeless","Regal"] },
  french:           { title: "THE MODERNIST",      tags: ["Clean","Fresh","Minimalist","Chic"] },
  fusion:           { title: "THE COSMOPOLITAN",   tags: ["Versatile","Eclectic","Global","Refined"] },
};

function getProfile(answers) {
  if (!answers) return { title: "THE CONNOISSEUR", tags: ["Refined","Discerning","Luxurious","Unique"] };
  for (const k of ["matters", "feel", "world"]) {
    if (answers[k] && PROFILES[answers[k]]) return PROFILES[answers[k]];
  }
  return { title: "THE CONNOISSEUR", tags: ["Refined","Discerning","Luxurious","Unique"] };
}

// ─── NOTE CATEGORIES ──────────────────────────────────────────────────────────
const NOTE_LABELS = { top_note: "Top Notes", heart_note: "Heart Notes", base_note: "Base Notes" };

// ─── SLIDE-IN ANIMATION VARIANTS ──────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.6 },
});

// ═══════════════════════════════════════════════════════════════════════════════
//  REVEAL SCREEN — cinematic preparing experience
// ═══════════════════════════════════════════════════════════════════════════════
const PREPARE_STEPS = [
  "Analysing your olfactive portrait",
  "Cross-referencing 200+ fragrance dimensions",
  "Selecting your three perfect matches",
];

function RevealScreen({ userName, profile, scentProfile, onReveal }) {
  const [step, setStep] = useState(0); // 0→none visible, 1–3→steps, 4→button
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 2200);
    const t3 = setTimeout(() => setStep(3), 3600);
    const t4 = setTimeout(() => setStep(4), 5000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const hasFiredReveal = useRef(false);
  const handleReveal = () => {
    if (hasFiredReveal.current) return;
    hasFiredReveal.current = true;
    setRevealing(true);

    // ---- Tracking: Results Revealed ----
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "fys_results_revealed",
        scent_profile: scentProfile?.title || profile?.title || "Unknown",
        user_name: userName || "anonymous",
      });
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "FYSResultsRevealed", {
          scent_profile: scentProfile?.title || profile?.title || "Unknown",
        });
      }
    } catch (e) {}

    setTimeout(onReveal, 800);
  };

  return (
    <motion.div className="fys-reveal" {...fadeIn()}>

      {/* ── Central animated glyph ── */}
      <div className="fys-reveal__glyph">
        <div className="fys-reveal__ring fys-reveal__ring--outer" />
        <div className="fys-reveal__ring fys-reveal__ring--mid" />
        <div className="fys-reveal__ring fys-reveal__ring--inner" />
        <span className="fys-reveal__diamond">◆</span>
      </div>

      {/* ── Content ── */}
      <motion.div className="fys-reveal__content" {...fadeUp(0.3)}>
        <span className="fys-reveal__eyebrow">Scent Intelligence</span>

        <h2 className="fys-reveal__title">
          Composing your<br /><em>Olfactive Portrait</em>
        </h2>

        {/* Sequential processing steps */}
        <div className="fys-reveal__steps">
          {PREPARE_STEPS.map((s, i) => (
            <AnimatePresence key={i}>
              {step > i && (
                <motion.div
                  className="fys-reveal__step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="fys-reveal__step-dot" />
                  <span>{s}</span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* CTA — appears only after all steps complete */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.button
              className="fys-reveal__cta"
              onClick={handleReveal}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: revealing ? 0.5 : 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={!revealing ? { scale: 1.02 } : {}}
              whileTap={!revealing ? { scale: 0.98 } : {}}
            >
              {revealing ? "Unveiling…" : "View My Portrait →"}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PERSONALITY HERO SECTION — full-width dark personality decoding
// ═══════════════════════════════════════════════════════════════════════════════
function PersonalityHero({ userName, profile, scentProfile }) {
  return (
    <motion.section className="fys-personality" {...fadeIn(0.1)}>
      <div className="fys-personality__inner">
        <motion.span className="fys-personality__eyebrow" {...fadeUp(0.2)}>
          {userName ? `${userName}, ` : ""}Your Scent Personality
        </motion.span>
        <motion.h1 className="fys-personality__title" {...fadeUp(0.35)}>
          {scentProfile?.title || profile.title}
        </motion.h1>
        <motion.p className="fys-personality__desc" {...fadeUp(0.5)}>
          {scentProfile?.desc || "A beautifully complex fragrance profile, uniquely yours."}
        </motion.p>
        <motion.div className="fys-personality__tags" {...fadeUp(0.6)}>
          {profile.tags.map(t => (
            <span key={t} className="fys-personality__tag">{t}</span>
          ))}
        </motion.div>
        {scentProfile?.notes?.length > 0 && (
          <motion.div className="fys-personality__notes" {...fadeUp(0.7)}>
            <span className="fys-personality__notes-label">Dominant Notes</span>
            <div className="fys-personality__notes-list">
              {scentProfile.notes.map(n => (
                <span key={n} className="fys-personality__note">{n}</span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PRODUCT CARD
// ═══════════════════════════════════════════════════════════════════════════════
function ProductCard({ rec, rank, locale, isReversed, scentProfileTitle }) {
  const { addProductToCart } = useContextElement();
  const { product } = rec;
  const img = getImg(product);
  const secondImg = getSecondImg(product);
  const top = parseNotes(product.top_note || "");
  const heart = parseNotes(product.heart_note || "");
  const base = parseNotes(product.base_note || "");
  const desc = extractDesc(product.description || "");
  const slug = clean(product.product_name);
  const cat = clean(product.category_name || "perfumes");
  const subcat = product.subcategory?.subcategory_name
    ? clean(product.subcategory.subcategory_name)
    : cat;
  const matchLabel = rank === 0 ? "BEST MATCH" : rank === 1 ? "GREAT MATCH" : "ALSO FOR YOU";
  const matchPct = rank === 0 ? "98%" : rank === 1 ? "94%" : rank === 2 ? "89%" : "85%";
  const [imgHover, setImgHover] = useState(false);

  return (
    <motion.article
      className={`fys-prod-row ${isReversed ? "fys-prod-row--reversed" : ""}`}
      {...fadeUp(rank * 0.12)}
    >
      {/* Image side */}
      <div
        className="fys-prod-row__visual"
        onMouseEnter={() => setImgHover(true)}
        onMouseLeave={() => setImgHover(false)}
      >
        {img && (
          <motion.img
            src={imgHover && secondImg ? secondImg : img}
            alt={product.product_name}
            className="fys-prod-row__img"
            initial={false}
            animate={{ scale: imgHover ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <div className="fys-prod-row__badge-wrap">
          <span className="fys-prod-row__badge">{matchLabel}</span>
          <span className="fys-prod-row__match-pct">{matchPct} match</span>
        </div>
      </div>

      {/* Content side */}
      <div className="fys-prod-row__content">
        <div className="fys-prod-row__meta">
          <span className="fys-prod-row__category">
            {product.subcategory?.subcategory_name || product.category_name || "Perfume"}
          </span>
          <span className="fys-prod-row__number">0{rank + 1}</span>
        </div>

        <h2 className="fys-prod-row__name">{product.product_name}</h2>

        {desc && <p className="fys-prod-row__desc">{desc}</p>}

        {/* Notes breakdown */}
        {(top.length > 0 || heart.length > 0 || base.length > 0) && (
          <div className="fys-prod-row__notes">
            <h4 className="fys-prod-row__notes-title">Fragrance Notes</h4>
            {[
              { label: "Top", notes: top },
              { label: "Heart", notes: heart },
              { label: "Base", notes: base },
            ].filter(g => g.notes.length > 0).map(g => (
              <div key={g.label} className="fys-prod-row__note-group">
                <span className="fys-prod-row__note-label">{g.label}</span>
                <div className="fys-prod-row__note-pills">
                  {g.notes.map(n => (
                    <span key={n} className="fys-prod-row__pill">{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="fys-prod-row__footer">
          <p className="fys-prod-row__price">AED {parseFloat(product.price || 0).toFixed(0)}</p>
          <div className="fys-prod-row__actions">
            <Link
              href={`/${locale}/shop/${cat}/${subcat}/${slug}`}
              className="fys-prod-row__btn fys-prod-row__btn--primary"
              onClick={() => {
                // ---- Tracking: FYS Product Clicked (Discover) ----
                try {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "fys_product_clicked",
                    product_id: product.product_id?.toString(),
                    product_name: product.product_name,
                    match_rank: rank + 1,
                    scent_profile: scentProfileTitle || "Unknown",
                  });
                  if (typeof window.fbq === "function") {
                    window.fbq("trackCustom", "FYSProductClicked", {
                      content_id: product.product_id?.toString(),
                      content_name: product.product_name,
                      match_rank: rank + 1,
                    });
                  }
                } catch (e) {}
              }}
            >
              DISCOVER →
            </Link>
            <button
              className="fys-prod-row__btn fys-prod-row__btn--secondary"
              onClick={() => {
                addProductToCart({ ...product, qty: 1 });
                // ---- Tracking: FYS Add to Cart (tags this add as FYS-sourced) ----
                try {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "fys_add_to_cart",
                    product_id: product.product_id?.toString(),
                    product_name: product.product_name,
                    match_rank: rank + 1,
                    value: parseFloat(product.price || 0),
                    currency: "AED",
                    scent_profile: scentProfileTitle || "Unknown",
                  });
                  if (typeof window.fbq === "function") {
                    window.fbq("trackCustom", "FYSAddToCart", {
                      content_id: product.product_id?.toString(),
                      content_name: product.product_name,
                      value: parseFloat(product.price || 0),
                      currency: "AED",
                    });
                  }
                } catch (e) {}
              }}
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN RESULTS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ScentResults({ recommendations = [], scentProfile, userName, onRetake, answers }) {
  const locale = useLocale();
  const profile = getProfile(answers || {});
  const topRecs = recommendations.slice(0, 5);
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="fys-results-v2">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <RevealScreen
            key="reveal"
            userName={userName}
            profile={profile}
            scentProfile={scentProfile}
            onReveal={() => setShowResults(true)}
          />
        ) : (
          <motion.div
            key="results-content"
            className="fys-results-v2__content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Personality Hero */}
            <PersonalityHero
              userName={userName}
              profile={profile}
              scentProfile={scentProfile}
            />

            {/* Section divider */}
            <div className="fys-results-v2__divider">
              <span className="fys-results-v2__divider-line" />
              <span className="fys-results-v2__divider-label">YOUR PERSONALISED RECOMMENDATIONS</span>
              <span className="fys-results-v2__divider-line" />
            </div>

            {/* Product rows — alternating image left/right */}
            <section className="fys-results-v2__products">
              {topRecs.length > 0 ? (
                topRecs.map((rec, i) => (
                  <ProductCard
                    key={rec.product.product_id || i}
                    rec={rec}
                    rank={i}
                    locale={locale}
                    isReversed={i % 2 !== 0}
                    scentProfileTitle={scentProfile?.title || profile?.title}
                  />
                ))
              ) : (
                <div className="fys-results-v2__empty">
                  <p>No products found matching your profile. Try retaking the quiz with different preferences.</p>
                </div>
              )}
            </section>

            {/* Bottom CTA */}
            <motion.div className="fys-results-v2__bottom" {...fadeUp(0.3)}>
              <button className="fys-results-v2__retake" onClick={onRetake}>
                ↺ RETAKE QUIZ
              </button>
              <Link href={`/${locale}/product-category/perfumes/`} className="fys-results-v2__explore">
                EXPLORE ALL FRAGRANCES →
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
