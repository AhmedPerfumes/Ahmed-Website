"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import styles from "./HeroSection.module.css";

const DESKTOP_HERO = "/assets/images/kseries/hero-banner.jpg";
const MOBILE_HERO = "/assets/images/kseries/mobile.jpg";
const MOBILE_BREAKPOINT = 768;

export default function HeroSection({
  title = "Experience The Essence",
  subtitle = "Elevate your presence with our K-Series signature scents.",
  ctaText = "Shop The Collection",
  ctaHref = "/product-category/gift-sets",
}) {
  const heroRef = useRef(null);

  // Scroll-based parallax & fade
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(heroScrollY, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScrollY, [0, 0.6], [1, 0]);

  // Simple viewport check for mobile hero image
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const heroSrc = isMobile ? MOBILE_HERO : DESKTOP_HERO;

  // Subtle floating specs (optional)
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        size: 6 + ((i * 11) % 10),
        left: `${(i * 91) % 100}%`,
        delay: (i * 0.41) % 2,
        duration: 4 + ((i * 1.1) % 4),
        blur: (i * 0.9) % 3,
        opacity: 0.12 + ((i * 5) % 20) / 100,
      })),
    []
  );

  return (
    <div
      ref={heroRef}
      className="position-relative overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Background with parallax */}
      <motion.div
        style={{ y: heroImageY }}
        className="position-absolute top-0 start-0 w-100 h-100"
      >
        <Image
          src={heroSrc}
          alt="K Series Perfume Collection"
          fill
          priority
          className={styles.heroImage}
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
        />
        <div
          className={`position-absolute top-0 start-0 w-100 h-100 ${styles.heroOverlay}`}
        />
      </motion.div>

      {/* Centered content */}
      <motion.div
        style={{ opacity: heroOpacity, zIndex: 10 }}
        className="position-relative h-100 d-flex flex-column align-items-center mt-5 text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1
            className={`display-1 fw-bold mb-4 ${styles.serifFont} ${styles.heroTitle}`}
          >
            <span className={styles.textGold}>K</span>
            <span className={styles.heroTitleMain}> SERIES</span>
          </h1>

          <p
            className={`fs-4 mb-4 ${styles.textChampagne} ${styles.sansFont} ${styles.heroSubtitle}`}
          >
            Where Elegance Meets Artistry
          </p>

          <motion.a
            href={ctaHref}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn ${styles.btnGold} ${styles.heroCta} text-uppercase ${styles.sansFont}`}
          >
            {ctaText}
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="position-absolute bottom-0 start-50 translate-middle-x mb-4"
        style={{ zIndex: 10 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={styles.textGold}
          style={{ fontSize: "2rem", textShadow: "0 6px 18px rgba(0,0,0,0.85)" }}
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Optional subtle particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={styles.heroParticle}
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
          }}
          animate={{ y: [-10, -60], opacity: [p.opacity, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
