import React from "react";
import { motion } from "framer-motion";

function NoteSection() {
  const notes = [
    {
      title: "Top Notes",
      description:
        "Citrus brightness and fresh accords ignite the opening — energetic, clean, and instantly captivating.",
      img: "/assets/images/kseries/top.jpg",
    },
    {
      title: "Heart Notes",
      description:
        "Spices and florals fuse into a rich heart, revealing the character and craftsmanship of the blend.",
      img: "/assets/images/kseries/mid.jpg",
    },
    {
      title: "Base Notes",
      description:
        "Woods, musk, and depth linger on the skin, leaving a confident, long-lasting K-Series signature.",
      img: "/assets/images/kseries/base.jpg",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: i * 0.18,
      },
    }),
  };

  return (
    <section
      className="py-5"
      style={{
        background:
          "radial-gradient(circle at top, rgba(229,212,178,0.16) 0%, transparent 55%) #000000",
        color: "#f2f2f2",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1180px",
          textAlign: "center",
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "999px",
            border: "1px solid rgba(229,212,178,0.35)",
            background: "rgba(10,10,10,0.9)",
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#e5d4b2",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#e5d4b2",
            }}
          />
          K-Series • Olfactory Journey
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="fw-bold mt-3"
          style={{
            fontSize: "2.6rem",
            letterSpacing: "-0.5px",
            color: "#ffffff",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          Fragrance Notes
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mt-3"
          style={{
            fontSize: "1rem",
            color: "#c6c6c6",
            maxWidth: "640px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          A structured evolution from first impression to final memory — crafted for
          those who appreciate depth, detail, and enduring elegance.
        </motion.p>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            margin: "18px auto 0",
            width: "72px",
            height: "2px",
            background:
              "linear-gradient(to right, transparent, #e5d4b2, transparent)",
            transformOrigin: "center",
          }}
        />

        {/* Cards */}
        <div className="row gy-4 gy-md-5 mt-5">
          {notes.map((note, index) => (
            <div className="col-12 col-md-4" key={note.title}>
              <motion.div
                className="h-100"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{
                  y: -6,
                  rotateX: 2,
                  rotateY: -2,
                  transition: { duration: 0.25 },
                }}
                style={{
                  padding: "24px",
                  borderRadius: "26px",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.02), rgba(229,212,178,0.02))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 24px 65px rgba(0,0,0,0.7)",
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(6px)",
                  minHeight: "540px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                {/* Subtle corner glow */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "90px",
                    height: "90px",
                    background:
                      "radial-gradient(circle, rgba(229,212,178,0.16), transparent)",
                    opacity: 0.9,
                    pointerEvents: "none",
                  }}
                />

                {/* Image */}
                <motion.div
                  style={{
                    marginBottom: "24px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid rgba(229,212,178,0.1)",
                    flexShrink: 0,
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 * (index + 1) }}
                >
                  <img
                    src={note.img}
                    alt={note.title}
                    className="img-fluid"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                    }}
                  />
                  {/* Top overlay strip */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "32px",
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)",
                    }}
                  />
                </motion.div>

                {/* Label above title */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(229,212,178,0.78)",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "999px",
                      backgroundColor: "#e5d4b2",
                    }}
                  />
                  {index + 1 < 10 ? `0${index + 1}` : index + 1} • Layer
                </span>

                {/* Title */}
                <h4
                  className="fw-bold"
                  style={{
                    fontSize: "1.4rem",
                    color: "#e5d4b2",
                    letterSpacing: "0.4px",
                    marginBottom: "8px",
                  }}
                >
                  {note.title}
                </h4>

                {/* Short accent line */}
                <div
                  style={{
                    width: "34px",
                    height: "1.5px",
                    backgroundColor: "rgba(229,212,178,0.6)",
                    marginBottom: "12px",
                  }}
                />

                {/* Description */}
                <p
                  style={{
                    color: "#ffff",
                    lineHeight: 1.8,
                    fontSize: "0.95rem",
                    marginBottom: 0,
                    flexGrow: 1,
                  }}
                >
                  {note.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NoteSection;