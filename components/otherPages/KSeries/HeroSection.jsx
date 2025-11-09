"use client";

import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./HeroSection.module.css";
import Image from "next/image";

// Placeholder image URLs based on your banner
const heroBannerUrl = "/assets/images/kseries/hero-banner.jpg";

// K-Series HeroSection: full-screen banner with refined text styling
export default function HeroSection({
  title = "Experience The Essence",
  subtitle = "Elevate your presence with our K-Series signature scents.",
  ctaText = "Shop The Collection",
  ctaHref = "/product-category/gift-sets",
  backgroundSrc = "/assets/images/AHL-banner.jpg",
}) {

    // 1. Hero Section Scroll
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollY } = useScroll({target: heroRef, offset: ["start start", "end start"], });

    const heroImageY = useTransform(heroScrollY, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroScrollY, [0, 0.5], [1, 0]);
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
    <div ref={heroRef} className="position-relative overflow-hidden" style={{ height: '100vh' }}>
        <motion.div
          style={{ y: heroImageY }}
          className="position-absolute top-0 start-0 w-100 h-100"
        >
          <Image
            src={heroBannerUrl}
            alt="K Series Perfume Collection"
            layout="fill"
            objectFit="cover"
            objectPosition="center bottom"
            priority
          />
          <div className={`position-absolute top-0 start-0 w-100 h-100 ${styles.heroOverlay}`} />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, zIndex: 10 }}
          className="position-relative h-100 d-flex flex-column align-items-center justify-content-center text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className={`display-1 fw-bold mb-4 ${styles.serifFont}`} style={{ letterSpacing: '0.1em', fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
              <span className={styles.textGold}>K</span>
              <span className="text-light"> SERIES</span>
            </h1>
            <p className={`fs-4 mb-4 ${styles.textChampagne} ${styles.sansFont}`} style={{ letterSpacing: '0.05em', maxWidth: '800px', margin: '0 auto 2rem' }}>
              Where Elegance Meets Artistry
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`btn ${styles.btnGold} text-uppercase ${styles.sansFont}`}
            >
              Discover The Collection
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="position-absolute bottom-0 start-50 translate-middle-x mb-4"
          style={{ zIndex: 10, opacity: heroOpacity }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={styles.textGold}
            style={{ fontSize: '2rem' }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
  );
}
