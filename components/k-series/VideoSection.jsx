import React, { useState } from "react";
import { motion } from "framer-motion";

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

  return (
    <section
      style={{
        width: "100%",
        height: "auto",
        background: "#000",
        color: "#fff",
        padding: "80px 20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >

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
        {/* Label */}
        <motion.span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#e5d4b2",
            marginBottom: "20px",
          }}
          variants={itemVariants}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#e5d4b2",
              display: "inline-block",
            }}
          />
          Visual Experience
        </motion.span>

        {/* Heading */}
        <motion.h2
          style={{
            fontSize: "3.5rem",
            fontWeight: "700",
            marginBottom: "16px",
            color: data?.textColor || "#ffffff",
            letterSpacing: "-0.5px",
            lineHeight: "1.2",
          }}
          variants={itemVariants}
        >
          K Series <span style={{ color: data?.accentColor || "#e5d4b2" }}>in Motion</span>
        </motion.h2>

        {/* Divider */}
        <motion.div
          style={{
            width: "80px",
            height: "2px",
            background: "linear-gradient(to right, transparent, #e5d4b2, transparent)",
            margin: "20px auto 30px",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        {/* Description */}
        <motion.p
          style={{
            fontSize: "1.15rem",
            maxWidth: "700px",
            color: data?.mutedTextColor || "#d0d0d0",
            margin: "0 auto 60px",
            lineHeight: 1.9,
            fontWeight: 300,
            letterSpacing: "0.3px",
          }}
          variants={itemVariants}
        >
          {data?.description}
          {/* Discover the essence of past, present, and future with the K Series perfumes — a journey of timeless elegance, modern sophistication, and visionary allure. */}
        </motion.p>

        {/* VIDEO WRAPPER */}
        <motion.div
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
            position: "relative",
            borderRadius: "24px",
            overflow: "hidden",
            perspective: "1200px",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* Video container with glow effect */}
          <div
            style={{
                position: "relative",
                /* Remove drop shadow entirely so video blends into black background */
                boxShadow: "none",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                borderRadius: "24px",
                /* remove visible border so edges blend */
                border: "none",
                overflow: "hidden",
                marginTop:"30px"
              }}
          >
            {/* Video */}
              <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                border: "none",
                outline: "none",
                opacity: isHovered ? 0.95 : 1,
                transition: "opacity 0.4s ease",
              }}
            >
              <source src={data?.videoSrc || "/assets/images/kseries/past.mp4"} type="video/mp4" />
            </video>

            {/* Overlay gradient - enhances video appearance */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(0,0,0,0.1), transparent, rgba(229,212,178,0.05))",
                pointerEvents: "none",
              }}
            />

            {/* Top overlay - adds depth */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "80px",
                background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
                pointerEvents: "none",
              }}
            />

            {/* Bottom overlay - adds depth */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "80px",
                background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                pointerEvents: "none",
              }}
            />

            {/* Play icon - appears on hover */}
           
          </div>
        </motion.div>

        {/* Bottom features */}
        
      </motion.div>
    </section>
  );
}

export default VideoSection;
