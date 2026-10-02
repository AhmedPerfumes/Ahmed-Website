"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const NOTE_TIERS = [
  {
    tier: "01",
    title: "Top Notes",
    glowColor: "rgba(212, 175, 55, 0.22)",
    borderColor: "rgba(212, 175, 55, 0.28)",
    tagBg: "rgba(212, 175, 55, 0.08)",
    tagColor: "#e6cf94",
    notes: ["Bright Orange", "Cardamom", "Black Pepper", "Saffron", "Leather"],
  },
  {
    tier: "02",
    title: "Heart Notes",
    glowColor: "rgba(212, 175, 55, 0.22)",
    borderColor: "rgba(212, 175, 55, 0.28)",
    tagBg: "rgba(212, 175, 55, 0.08)",
    tagColor: "#e6cf94",
    notes: ["Turkish Rose", "Orris Root", "Balkan Immortelle", "Heliotrope"],
  },
  {
    tier: "03",
    title: "Base Notes",
    glowColor: "rgba(212, 175, 55, 0.22)",
    borderColor: "rgba(212, 175, 55, 0.28)",
    tagBg: "rgba(212, 175, 55, 0.08)",
    tagColor: "#e6cf94",
    notes: ["Sacred Oud", "Vanilla Bean", "Patchouli", "Musk", "Incense", "Ambroxan"],
  },
];

export default function NoteSection({ data = {} }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const defaultNoteImgs = {
    top: "/assets/images/auric/top-notes.png",
    mid: "/assets/images/auric/heart-notes.png",
    base: "/assets/images/auric/base-notes.png",
  };

  const noteImgs = Object.assign({}, defaultNoteImgs, data?.notesImages || {});
  const notesDescription = Object.assign(
    {
      top: "Bright orange opens the fragrance, warmed by cardamom, pepper and saffron, with an unexpected touch of leather.",
      mid: "Immortelle Absolute from the Balkans, heliotrope and orris meet the distinctive Ahmed Al Maghribi Rose Accord.",
      base: "Vanilla, patchouli, musk and incense settle into a deep, lingering base, enriched by the Ahmed Al Maghribi Oud Accord.",
    },
    data?.notesDescription || {}
  );

  const cardsData = [
    {
      ...NOTE_TIERS[0],
      img: noteImgs.top,
      description: notesDescription.top,
    },
    {
      ...NOTE_TIERS[1],
      img: noteImgs.mid,
      description: notesDescription.mid,
    },
    {
      ...NOTE_TIERS[2],
      img: noteImgs.base,
      description: notesDescription.base,
    },
  ];

  return (
    <section
      style={{
        background: "radial-gradient(circle at 50% 30%, #0d0a0d 0%, #050405 50%, #000000 100%)",
        color: "#ffffff",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(212, 175, 55, 0.12)",
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(circle, rgba(138, 30, 48, 0.12), transparent 70%)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: "1240px", position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 52px" }}>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              fontWeight: 400,
              letterSpacing: "0.03em",
              lineHeight: 1.2,
              color: "#ffffff",
              marginBottom: 0,
            }}
          >
            {data?.notesHeading || "The Fragrance Notes"}
          </motion.h2>
        </div>

        {/* 3-Column Botanical Art Cards */}
        <div className="row g-4 g-lg-5 justify-content-center">
          {cardsData.map((item, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={item.tier}>
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    background: "rgba(18, 14, 16, 0.6)",
                    borderRadius: "28px",
                    border: `1px solid ${isHovered ? item.borderColor : "rgba(255, 255, 255, 0.08)"}`,
                    padding: "20px 20px 28px",
                    backdropFilter: "blur(14px)",
                    boxShadow: isHovered
                      ? `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px ${item.glowColor}`
                      : "0 14px 36px rgba(0, 0, 0, 0.6)",
                    transition: "border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease",
                    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  }}
                >
                  {/* Botanical Card Image Frame (True Portrait Aspect Ratio 9/14) */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "9 / 14",
                      borderRadius: "20px",
                      overflow: "hidden",
                      backgroundColor: "#0d0b0e",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
                      marginBottom: "20px",
                    }}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                      priority={index === 0}
                      style={{
                        objectFit: "contain",
                        borderRadius: "20px",
                        transition: "transform 0.5s ease",
                        transform: isHovered ? "scale(1.03)" : "scale(1)",
                      }}
                    />
                  </div>

                  {/* Main Title */}
                  <h3
                    style={{
                      fontSize: "1.35rem",
                      fontWeight: 500,
                      color: "#ffffff",
                      letterSpacing: "0.02em",
                      marginBottom: "12px",
                    }}
                  >
                    {item.title}
                  </h3>


                  {/* Description Paragraph */}
                  <p
                    style={{
                      fontSize: "0.92rem",
                      lineHeight: 1.75,
                      color: "rgba(255, 255, 255, 0.76)",
                      fontWeight: 300,
                      marginBottom: "20px",
                      flexGrow: 1,
                    }}
                  >
                    {item.description}
                  </p>

                  {/* Individual Ingredient Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "auto" }}>
                    {item.notes.map((note) => (
                      <span
                        key={note}
                        style={{
                          fontSize: "0.74rem",
                          letterSpacing: "0.04em",
                          padding: "4px 12px",
                          borderRadius: "16px",
                          background: item.tagBg,
                          border: `1px solid ${item.borderColor}`,
                          color: item.tagColor,
                          fontWeight: 400,
                        }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
