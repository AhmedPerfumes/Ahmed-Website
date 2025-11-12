import React from "react";
import { motion } from "framer-motion";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section d-flex align-items-center justify-content-center text-white">
      <div className="overlay"></div>

      <div className="container position-relative z-1">
        <div className="row align-items-center">
          {/* Left Column: Perfume Bottle */}
          <div className="col-lg-6 text-center mb-5 mb-lg-0 order-2 order-lg-1">
            <motion.div 
              className="hero-image position-relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <img
                src="/assets/images/kseries/past-center.png"
                alt="K Series Perfume Bottle"
                className="perfume-bottle"
              />
              <div className="bottle-glow"></div>
              <div className="bottle-glow-small"></div>
            </motion.div>
          </div>

          {/* Right Column: Owner Message */}
          <div className="col-lg-6 order-1 order-lg-2">
            <motion.div 
              className="hero-message ps-0 ps-lg-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="display-4 fw-bold mb-4 text-gold fade-in-top">
                K Series: <span className="text-cream">Past</span>
              </h1>

              <motion.div 
                className="mb-4"
                style={{
                  width: "60px",
                  height: "2px",
                  background: "linear-gradient(to right, #e5d4b2, transparent)",
                }}
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
              
              <p className="lead mb-4 text-light fade-in-top delay-1" style={{ fontSize: "1.1rem", lineHeight: "1.9" }}>
                <em>
                  "This perfume is a tribute to the memories that shaped us. Each
                  note captures the essence of timeless elegance and the beauty of
                  the moments we cherish most."
                </em>
              </p>

              <p className="text-white fst-italic mb-5 fade-in-top delay-2">— Dedicated by our founder — Mr. Kafeel Ahmed </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button className="btn btn-light btn-lg px-5 py-3 fade-in-top delay-3">
                  Book Now
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
