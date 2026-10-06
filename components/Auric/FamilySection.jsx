"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FamilySection({ data = {} }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  const sectionTag = data?.familyTag || "REIMAGINED";
  const sectionHeading = data?.familyHeading || "A Bouquet That Unfolds";

  // Render title with gold accent on the last word if it's the default or standard phrase
  const renderHeading = () => {
    if (sectionHeading === "A Bouquet That Unfolds") {
      return (
        <>
          <span>A Bouquet That </span>
          <span className="auric-gold-text">Unfolds</span>
        </>
      );
    }
    const words = sectionHeading.split(" ");
    if (words.length > 1) {
      const lastWord = words.pop();
      return (
        <>
          <span>{words.join(" ")} </span>
          <span className="auric-gold-text">{lastWord}</span>
        </>
      );
    }
    return <span className="auric-gold-text">{sectionHeading}</span>;
  };

  return (
    <section ref={containerRef} className="auric-family-section">
      {/* Luxury watermark typography */}
      <div className="auric-family-watermark" aria-hidden="true">
        EXTRAIT DE PARFUM
      </div>

      <div className="auric-family-container">
        {/* Simple elegant text overline */}
        <motion.p
          className="auric-family-tag"
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {sectionTag}
        </motion.p>

        {/* Section Heading */}
        <motion.h2
          className="auric-family-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderHeading()}
        </motion.h2>

        {/* Main Narrative Card */}
        <motion.div
          className="auric-family-narrative-card"
          style={{ marginBottom: 0 }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote className="auric-family-quote" style={{ marginBottom: 0 }}>
            “Like a bouquet opening one bloom at a time, the fragrance reveals new facets as its notes unfold. One composition offers the depth and complexity of fragrance layering, without combining multiple scents.”
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
