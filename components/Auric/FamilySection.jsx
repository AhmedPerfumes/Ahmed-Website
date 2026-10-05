"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./auric.css";

export default function FamilySection({ data = {}, onBookNow }) {
  const router = useRouter();
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Parallax scroll on the image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleCtaClick = () => {
    if (onBookNow) {
      onBookNow();
    } else {
      router.push("/en/shop");
    }
  };

  const sectionHeading = data?.familyHeading || "A Bouquet That Unfolds";
  const sectionDescription =
    data?.familyDescription ||
    "Like a bouquet opening one bloom at a time, the fragrance reveals new facets as its notes unfold. One composition offers the depth and complexity of fragrance layering, without combining multiple scents.";

  const artworkSrc =
    "/assets/images/auric/auric bottle transformation.jpg.jpeg";

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        background: "#080507",
        color: "#ffffff",
        padding: "100px 24px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
        }}
      >
        {/* Two-column editorial layout */}
        <div
          className="row align-items-center g-0"
          style={{ minHeight: "520px" }}
        >
          {/* Left: Typography */}
          <div className="col-lg-5 col-md-12">
            <div
              style={{
                paddingRight: "clamp(20px, 4vw, 60px)",
                paddingBottom: "40px",
              }}
            >

              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                style={{
                  fontFamily: "'Wonderful Melanesia', Georgia, serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(212, 175, 55, 0.85)",
                  fontWeight: 500,
                  marginBottom: "16px",
                }}
              >
                Extrait de Parfum
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Wonderful Melanesia', Georgia, serif",
                  fontSize: "clamp(2rem, 3.8vw, 3rem)",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  lineHeight: 1.15,
                  color: "#ffffff",
                  marginBottom: "22px",
                }}
              >
                {sectionHeading}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Wonderful Melanesia', Georgia, serif",
                  fontSize: "0.96rem",
                  color: "rgba(255, 255, 255, 0.62)",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  marginBottom: "34px",
                  maxWidth: "420px",
                }}
              >
                {sectionDescription}
              </motion.p>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCtaClick}
                style={{
                  fontFamily: "'Wonderful Melanesia', Georgia, serif",
                  background: "transparent",
                  color: "#d4af37",
                  border: "1px solid rgba(212, 175, 55, 0.45)",
                  borderRadius: "0",
                  padding: "13px 38px",
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d4af37";
                  e.currentTarget.style.color = "#080507";
                  e.currentTarget.style.borderColor = "#d4af37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#d4af37";
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.45)";
                }}
              >
                Discover Auric
              </motion.button>
            </div>
          </div>

          {/* Right: Artwork with contained sizing & interactive hover */}
          <div className="col-lg-7 col-md-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "6px",
              }}
            >
              {/* Image container with overflow hidden for zoom effect */}
              <div
                ref={imageRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setMousePos({ x: 0.5, y: 0.5 });
                }}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "6px",
                  cursor: "crosshair",
                }}
              >
                <motion.div
                  style={{ y: imageY }}
                >
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.05 : 1,
                      transformOrigin: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
                    }}
                    transition={{
                      scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    }}
                  >
                    <Image
                      src={artworkSrc}
                      alt="Auric — The Evolution of Oud & Roses"
                      width={7476}
                      height={5842}
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: "6px",
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Subtle vignette overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    borderRadius: "6px",
                    boxShadow: "inset 0 0 80px rgba(8, 5, 7, 0.3)",
                  }}
                />
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
