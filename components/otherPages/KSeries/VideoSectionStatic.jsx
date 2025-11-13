import React from "react";
import { motion } from "framer-motion";

function VideoSectionStatic() {
  const accent = "#e5d4b2";
  const textColor = "#dcdcdc";
  const year = "2000";
  const subtitle = "The Chronicles of Ahmed Al Maghribi";
  const description =
    "Discover the artistry behind each era of the K-Series collection.";
  const videoEmbed = "https://drive.google.com/file/d/1y-lIVrlK0rO9T6ONYyq_AcEchpeCvot2/preview";

  return (
    <section
      style={{
        width: "100%",
        background: "#000",
        color: "#fff",
        padding: "80px 20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* TEXT FIRST */}
        <div style={{ marginBottom: "60px" }}>
          {/* <p
            style={{
              letterSpacing: "0.4em",
              fontSize: "1rem",
              fontWeight: 900,
              textTransform: "uppercase",
              color: accent,
              opacity: 0.85,
              marginBottom: "18px",
            }}
          >
            K-Series {"\u2022"} {year}
          </p> */}

          <h2
            style={{
              fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
              lineHeight: 1.2,
              color: "#fff",
              marginTop: "16px",
              marginBottom: "0px",
              fontWeight: 600,
            }}
          >
            <span style={{ color: accent, fontWeight: 500 }}>{subtitle}</span>
          </h2>

          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              lineHeight: 1.9,
              fontSize: "1.1rem",
              fontWeight: 300,
              color: textColor,
            }}
          >
            {description}
          </p>
        </div>

        {/* RESPONSIVE VIDEO IFRAME */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            height: 0,
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <iframe
            src={videoEmbed}
            title="K-Series Video"
            allow="autoplay"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          ></iframe>
        </div>
      </motion.div>
    </section>
  );
}

export default VideoSectionStatic;
