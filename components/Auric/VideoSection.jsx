import React, { useState } from "react";
import { motion } from "framer-motion";
import VideoPanel from "../VideoPanel";

function VideoSection({ data = {} }) {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const {
    accentColor: accent = "#c2596c",
    textColor = "#dcdcdc",
    title = "Auric",
    subtitle = "The Regal Expression",
    year = "Exclusive Edition",
    description = "Discover the artistry and opulence behind Auric, crafted with rare essences, precious amber, and sublime woods.",
    videoSrc = "/assets/videos/kseries/present.mp4",
  } = data || {};

  return (
    <section
      style={{
        width: "100%",
        height: "auto",
        background: "#000000",
        color: "#ffffff",
        padding: "70px 20px 25px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient maroon glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(circle, rgba(138, 30, 48, 0.12), transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* CONTENT WRAPPER */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* VIDEO FIRST */}
        <motion.div
          variants={itemVariants}
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            aspectRatio: "16/9",
            backgroundColor: "#000",
            boxShadow: "0 20px 60px rgba(138, 30, 48, 0.2)",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <VideoPanel
            src={videoSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              border: "none",
              outline: "none",
              transition: "opacity 0.4s ease",
              opacity: 0.95,
            }}
          />

          {/* Gradient overlays for depth and style */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.15), transparent, rgba(138,30,48,0.08))",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* CONTENT BELOW VIDEO */}
        <motion.div
          variants={itemVariants}
          style={{
            marginTop: "36px",
            textAlign: "center",
            color: textColor,
          }}
        >
          <p
            style={{
              letterSpacing: "0.28em",
              fontSize: "clamp(0.78rem, 1.2vw, 0.92rem)",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "#e6d5d8",
              opacity: 0.9,
              marginBottom: "10px",
            }}
          >
            {data?.videoTopText || "SECOND CHAPTER OF AN ICON"}
          </p>
          <div style={{ position: "relative", display: "inline-block" }}>
            {/* Soft golden aura behind AURIC */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "240px",
                height: "90px",
                background:
                  "radial-gradient(ellipse, rgba(212, 175, 55, 0.22), transparent 70%)",
                filter: "blur(32px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <h2
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: "clamp(2.6rem, 5.8vw, 4.4rem)",
                lineHeight: 1.1,
                marginTop: "4px",
                marginBottom: "16px",
                fontWeight: 400,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#d4af37",
                  display: "inline-block",
                  filter: "drop-shadow(0 2px 20px rgba(212, 175, 55, 0.35))",
                }}
              >
                {(data?.videoTitle || "AURIC").toUpperCase()}
              </span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              lineHeight: 1.8,
              fontSize: "clamp(0.95rem, 1.3vw, 1.12rem)",
              fontWeight: 300,
              color: "rgba(255, 255, 255, 0.78)",
              letterSpacing: "0.015em",
            }}
          >
            {data?.videoDescription ||
              "A founder’s signature. A house’s evolution. A gift to the people who made the journey possible."}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default VideoSection;
