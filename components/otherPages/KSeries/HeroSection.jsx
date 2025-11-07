"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

// K-Series HeroSection: full-screen banner with refined text styling
export default function HeroSection({
  title = "Experience The Essence",
  subtitle = "Elevate your presence with our K-Series signature scents.",
  ctaText = "Shop The Collection",
  ctaHref = "/product-category/gift-sets",
  backgroundSrc = "/assets/images/AHL-banner.jpg",
}) {
  // Gentle particle specs to simulate diffusing fragrance in air
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        size: 8 + ((i * 13) % 14),
        left: `${(i * 83) % 100}%`,
        delay: (i * 0.37) % 2,
        duration: 4 + ((i * 1.3) % 5),
        blur: (i * 1.2) % 3,
        opacity: 0.15 + ((i * 7) % 25) / 100,
      })),
    []
  );

  const titleWords = useMemo(() => title.split(" "), [title]);

  return (
    <section className="position-relative overflow-hidden" style={{ height: "100vh" }}>
      {/* Background image with slow parallax scale */}
      <motion.div
        aria-hidden
        className="position-absolute top-0 start-0 w-100 h-100"
        initial={{ scale: 1.06, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundImage: `url(${backgroundSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.02)",
        }}
      />

      {/* Soft vignette + gradient overlay for text readability */}
      <div
        aria-hidden
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background:
            "radial-gradient(1200px 600px at 70% 30%, rgba(0,0,0,0.08), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.32) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Floating scent particles */}
      <div className="position-absolute top-0 start-0 w-100 h-100" aria-hidden>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="position-absolute rounded-circle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [20, -10, 20], opacity: [0, p.opacity, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: p.left,
              top: `${(p.id * 71) % 100}%`,
              width: p.size,
              height: p.size,
              background: "rgba(255,255,255,0.55)",
              boxShadow: "0 0 16px 4px rgba(255,255,255,0.14)",
              filter: `blur(${p.blur}px)`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container h-100 position-relative">
        <div className="row h-100 align-items-center">
          <div className="col-12 col-md-8 col-lg-6">
            {/* Luxe micro-badge */}
            <motion.div
              className="d-inline-flex align-items-center px-3 py-1 mb-3"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                borderRadius: 9999,
                backdropFilter: "blur(3px)",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.22)",
                color: "#e9edf6",
                letterSpacing: 1.2,
                fontSize: 12,
                textTransform: "uppercase",
              }}
            >
              Eau de Parfum · K Series
            </motion.div>

            {/* Title with animated word reveal and luxury gradient */}
            <motion.h1
              className="display-4 fw-semibold"
              initial="hidden"
              animate="show"
              style={{
                lineHeight: 1.05,
                letterSpacing: 0.4,
                fontFamily:
                  "'Cormorant Garamond', 'Playfair Display', 'Cinzel', Georgia, 'Times New Roman', serif",
                fontWeight: 600,
                fontSize: "clamp(42px, 7.2vw, 104px)",
                backgroundImage:
                  "linear-gradient(92deg, #ffffff 0%, #f3e8c6 40%, #d6b25a 60%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 2px 18px rgba(0,0,0,0.25)",
              }}
              variants={{
                hidden: { opacity: 1 },
                show: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                },
              }}
            >
              {titleWords.map((w, i) => (
                <motion.span
                  key={`${w}-${i}`}
                  className="me-2 d-inline-block"
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    show: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.h1>

            {/* Accent divider */}
            <div className="my-3" aria-hidden>
              <div
                style={{
                  width: 84,
                  height: 2,
                  borderRadius: 2,
                  background:
                    "linear-gradient(90deg, rgba(214,178,90,0) 0%, rgba(214,178,90,0.9) 50%, rgba(214,178,90,0) 100%)",
                  boxShadow: "0 0 18px rgba(214,178,90,0.45)",
                }}
              />
            </div>

            <motion.p
              className="lead text-white-50 mt-2 mb-4"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: 680,
                fontSize: "clamp(16px, 1.8vw, 22px)",
                lineHeight: 1.55,
                fontFamily:
                  "'Inter', 'SF Pro Text', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              }}
            >
              {subtitle}
            </motion.p>

            <motion.a
              href={ctaHref}
              className="px-4 py-2 d-inline-flex align-items-center gap-2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                borderRadius: 9999,
                color: "#0a0b0e",
                background:
                  "linear-gradient(96deg, #f7e8b8 0%, #e4c875 45%, #d6b25a 60%, #f7e8b8 100%)",
                boxShadow: "0 8px 24px rgba(214,178,90,0.28)",
                border: "none",
                textDecoration: "none",
              }}
            >
              <span>{ctaText}</span>
              <motion.span
                aria-hidden
                initial={{ x: 0 }}
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="d-inline-block"
              >
                &gt;
              </motion.span>
            </motion.a>

            {/* Secondary link */}
            <motion.a
              href="#notes"
              className="d-inline-block ms-3 text-decoration-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ color: "#e9edf6" }}
            >
              <span className="me-1" style={{ opacity: 0.7 }}>
                Discover notes
              </span>
              <span aria-hidden style={{ opacity: 0.7 }}>&gt;</span>
            </motion.a>

            {/* Scroll hint */}
            <motion.div
              className="mt-4 d-flex align-items-center gap-2 text-white-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{ userSelect: "none" }}
            >
              <motion.span
                aria-hidden
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                v
              </motion.span>
              <small>Scroll to explore the K-Series</small>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
