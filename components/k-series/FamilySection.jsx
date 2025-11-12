import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const animationStyles = `
  .family-section-item {
    transition: all 1s ease-out;
    opacity: 0;
  }
  .family-section-item.is-visible {
    opacity: 1;
  }

  /* Default animations */
  .family-section-item.left {
    transform: translateX(-120px) scale(0.85) rotateY(15deg);
  }
  .family-section-item.right {
    transform: translateX(120px) scale(0.85) rotateY(-15deg);
  }
  .family-section-item.center {
    transform: scale(0.6) translateY(40px);
    transition-delay: 0.2s;
  }

  /* Visible state */
  .family-section-item.left.is-visible,
  .family-section-item.right.is-visible {
    transform: translateX(0) scale(0.9) rotateY(0deg);
  }
  .family-section-item.center.is-visible {
    transform: scale(1.1) translateY(-20px);
  }

  .family-section-item img {
    border-radius: 16px;
    filter: drop-shadow(0 20px 60px rgba(229, 212, 178, 0.2));
    transition: transform 0.3s ease;
  }

  .family-section-item:hover img {
    transform: scale(1.05);
    filter: drop-shadow(0 25px 80px rgba(229, 212, 178, 0.3));
  }
`;

export default function FamilySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  const imgLeft = "/assets/images/kseries/future_left.png";
  const imgCenter = "/assets/images/kseries/past-center.png";
  const imgRight = "/assets/images/kseries/present3.png";

  return (
    <>
      <style>{animationStyles}</style>

      <div 
        className="bg-dark text-light py-5"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "-20%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(229,212,178,0.1), transparent)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-10%",
          right: "-15%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(218,165,32,0.08), transparent)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none"
        }} />

        <section ref={sectionRef} style={{ position: "relative", zIndex: 1 }}>
          <div className="container text-center">
            {/* Upper label */}
            <motion.span 
              className="d-inline-block mb-3"
              style={{ 
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#e5d4b2"
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ✦ Collection Showcase ✦
            </motion.span>

            {/* Heading */}
            <motion.h2
              className="display-4 display-md-3 fw-bold mb-3"
              style={{ color: "#e5d4b2", letterSpacing: "1px" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              THREE ERAS.
              <br />
              <span style={{ color: "#ffffff" }}>One Fragrance Family</span>
            </motion.h2>

            {/* Divider */}
            <motion.div 
              style={{
                width: "80px",
                height: "2px",
                background: "linear-gradient(to right, transparent, #e5d4b2, transparent)",
                margin: "20px auto"
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />

            {/* Subheading */}
            <motion.p
              className="lead text-light mb-5 px-3"
              style={{
                maxWidth: "720px",
                margin: "0 auto",
                lineHeight: "1.8",
                fontSize: "1.1rem",
                fontWeight: 300
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              A collection born from precision, innovation, and artistry. The
              K-Series brings bold identity with striking visuals, premium
              craftsmanship, and a fragrance experience unlike anything before.
            </motion.p>

            {/* Image Row — tighter spacing */}
            <motion.div
              className="d-flex flex-row justify-content-center align-items-end mt-5 pt-5"
              style={{
                gap: "0",
                marginLeft: "-20px",
                marginRight: "-20px",
                perspective: "1000px"
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              {/* Left Image */}
              <div
                className={`family-section-item left ${
                  isVisible ? "is-visible" : ""
                }`}
                style={{ marginRight: "-50px" }}
              >
                <img
                  src={imgLeft}
                  alt="K2000 — The Roots"
                  className="img-fluid"
                  style={{
                    transformOrigin: "bottom center",
                    maxWidth: "240px",
                    width: "100%"
                  }}
                />
                <motion.p 
                  className="mt-3"
                  style={{ fontSize: "0.95rem", color: "#e5d4b2", fontWeight: 600 }}
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  K 2000 — The Roots
                </motion.p>
              </div>

              {/* Center Image */}
              <div
                className={`family-section-item center ${
                  isVisible ? "is-visible" : ""
                }`}
                style={{ zIndex: 2, marginX: "0 -30px" }}
              >
                <img
                  src={imgCenter}
                  alt="K2025 — The Alchemy Lab"
                  className="img-fluid"
                  style={{
                    transformOrigin: "bottom center",
                    maxWidth: "280px",
                    width: "100%"
                  }}
                />
                <motion.p 
                  className="mt-3"
                  style={{ fontSize: "1rem", color: "#e5d4b2", fontWeight: 700 }}
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  K 2025 — The Alchemy Lab
                </motion.p>
              </div>

              {/* Right Image */}
              <div
                className={`family-section-item right ${
                  isVisible ? "is-visible" : ""
                }`}
                style={{ marginLeft: "-50px" }}
              >
                <img
                  src={imgRight}
                  alt="K2050 — The Beyond"
                  className="img-fluid"
                  style={{
                    transformOrigin: "bottom center",
                    maxWidth: "240px",
                    width: "100%"
                  }}
                />
                <motion.p 
                  className="mt-3"
                  style={{ fontSize: "0.95rem", color: "#e5d4b2", fontWeight: 600 }}
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: 0.7 }}
                >
                  K 2050 — The Beyond
                </motion.p>
              </div>
            </motion.div>

            {/* Call to action */}
            <motion.div 
              className="mt-5 pt-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <button 
                className="btn btn-lg px-5 py-3"
                style={{
                  background: "linear-gradient(135deg, #e5d4b2 0%, #f9d571 100%)",
                  border: "none",
                  color: "#1a1a1a",
                  fontWeight: 600,
                  borderRadius: "50px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "0.95rem"
                }}
              >
                Explore All Fragrances
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
