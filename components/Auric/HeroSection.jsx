import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import "./HeroSection.css";

function BottleComparisonSlider({
  beforeImg = "/assets/images/oud-roses.png",
  afterImg = "/assets/auric-bottle.png",
  beforeLabel = "Oud & Roses",
  afterLabel = "Auric",
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [slideDirection, setSlideDirection] = useState("neutral"); // "rose" | "gold" | "neutral"
  const containerRef = useRef(null);
  const lastXRef = useRef(0);
  const directionTimeoutRef = useRef(null);

  // Auto-slide 1-time onboarding hint refs
  const teaseAnimationRef = useRef(null);
  const teaseTimeoutRef = useRef(null);
  const hasTeasedRef = useRef(false);
  const userInteractedRef = useRef(false);

  const startTeaseAnimation = useCallback(() => {
    if (hasTeasedRef.current || userInteractedRef.current) return;
    hasTeasedRef.current = true;

    // Brief pause after entering viewport before teasing
    teaseTimeoutRef.current = setTimeout(() => {
      if (userInteractedRef.current) return;

      // 3-phase smooth demonstration:
      // Phase 1: Center (50%) -> Left (30%) revealing Auric
      // Phase 2: Left (30%) -> Right (70%) revealing Oud & Roses
      // Phase 3: Right (70%) -> Center (50%) settling back
      const phases = [
        { from: 50, to: 30, duration: 650, dir: "gold" },
        { from: 30, to: 70, duration: 850, dir: "rose" },
        { from: 70, to: 50, duration: 650, dir: "gold" },
      ];

      let phaseIndex = 0;
      let phaseStartTime = performance.now();

      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const tick = (now) => {
        if (userInteractedRef.current) {
          setSlideDirection("neutral");
          return;
        }

        const currentPhase = phases[phaseIndex];
        const elapsed = now - phaseStartTime;
        const progress = Math.min(1, elapsed / currentPhase.duration);
        const eased = easeInOutCubic(progress);

        const currentPos =
          currentPhase.from + (currentPhase.to - currentPhase.from) * eased;
        setSliderPos(currentPos);
        setSlideDirection(currentPhase.dir);

        if (progress < 1) {
          teaseAnimationRef.current = requestAnimationFrame(tick);
        } else {
          phaseIndex++;
          if (phaseIndex < phases.length) {
            phaseStartTime = performance.now();
            teaseAnimationRef.current = requestAnimationFrame(tick);
          } else {
            setSliderPos(50);
            setSlideDirection("neutral");
            teaseAnimationRef.current = null;
          }
        }
      };

      teaseAnimationRef.current = requestAnimationFrame(tick);
    }, 600);
  }, []);

  // Trigger 1-time auto-slide when section enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !hasTeasedRef.current &&
            !userInteractedRef.current
          ) {
            startTeaseAnimation();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (teaseTimeoutRef.current) clearTimeout(teaseTimeoutRef.current);
      if (teaseAnimationRef.current) cancelAnimationFrame(teaseAnimationRef.current);
    };
  }, [startTeaseAnimation]);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

    // Detect slide direction:
    // Sliding right (expanding Oud & Roses) -> rose
    // Sliding left (expanding Auric) -> gold
    if (clientX > lastXRef.current + 1) {
      setSlideDirection("rose");
    } else if (clientX < lastXRef.current - 1) {
      setSlideDirection("gold");
    }
    lastXRef.current = clientX;

    if (directionTimeoutRef.current) clearTimeout(directionTimeoutRef.current);
    directionTimeoutRef.current = setTimeout(() => {
      setSlideDirection("neutral");
    }, 450);

    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e) => {
    // Instantly cancel auto-slide animation if user interacts
    userInteractedRef.current = true;
    if (teaseTimeoutRef.current) clearTimeout(teaseTimeoutRef.current);
    if (teaseAnimationRef.current) {
      cancelAnimationFrame(teaseAnimationRef.current);
      teaseAnimationRef.current = null;
    }
    setIsDragging(true);
    lastXRef.current = e.clientX;
    if (e.currentTarget && e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
    handleMove(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    if (e.currentTarget && e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  return (
    <div
      className="perfume-comparison-wrapper"
      style={{ width: "100%", maxWidth: "440px", margin: "0 auto", position: "relative" }}
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          aspectRatio: "432 / 578",
          margin: "0 auto",
          overflow: "hidden",
          borderRadius: "20px",
          cursor: isDragging ? "grabbing" : "ew-resize",
          userSelect: "none",
          touchAction: "none",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          zIndex: 1,
        }}
      >
        {/* Layer 1 (Left / Base): Oud & Roses */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          }}
        >
          <Image
            src={beforeImg}
            alt={beforeLabel}
            width={432}
            height={578}
            priority
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0px 15px 35px rgba(0, 0, 0, 0.5))",
            }}
          />
        </div>

        {/* Layer 2 (Right / Revealed): Auric */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            clipPath: `inset(0 0 0 ${sliderPos}%)`,
            WebkitClipPath: `inset(0 0 0 ${sliderPos}%)`,
          }}
        >
          <Image
            src={afterImg}
            alt={afterLabel}
            width={432}
            height={578}
            priority
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0px 15px 35px rgba(0, 0, 0, 0.5))",
            }}
          />
        </div>

        {/* Label 1: Oud & Roses (Left) */}
        <span
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "5px 14px",
            borderRadius: "20px",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            color: "#ffffff",
            pointerEvents: "none",
            zIndex: 3,
            opacity: sliderPos < 12 ? 0 : 0.9,
            transition: "opacity 0.25s ease",
          }}
        >
          {beforeLabel}
        </span>

        {/* Label 2: Auric (Right) */}
        <span
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "5px 14px",
            borderRadius: "20px",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            color: "#f5e6c8",
            pointerEvents: "none",
            zIndex: 3,
            opacity: sliderPos > 88 ? 0 : 0.95,
            transition: "opacity 0.25s ease",
          }}
        >
          {afterLabel}
        </span>

        {/* Clean Physical Divider Line & Tactile Knob */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            width: "1.5px",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.7)",
            pointerEvents: "none",
            zIndex: 6,
          }}
        >
          {/* Tactile Circular Knob */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6)",
              border: "1.5px solid rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1114"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="8 7 3 12 8 17" />
              <polyline points="16 7 21 12 16 17" />
            </svg>
          </div>
        </div>
      </div>

      {/* Helper caption */}
      <p
        style={{
          fontSize: "0.74rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255, 255, 255, 0.45)",
          marginTop: "14px",
          marginBottom: 0,
          textAlign: "center",
          fontWeight: 400,
          position: "relative",
          zIndex: 1,
        }}
      >
        Slide to compare Oud &amp; Roses and Auric
      </p>
    </div>
  );
}

function HeroSection({ data = {}, onBookNow }) {

  return (
    <section className="hero-section text-white">
      <div className="overlay"></div>

      <div className="container position-relative z-1">
        <div className="row align-items-center">
          {/* Left Column: Perfume Bottle Comparison Slider */}
          <div className="col-lg-6 text-center mb-5 mb-lg-0 order-2 order-lg-1">
            <motion.div
              className="hero-image position-relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <BottleComparisonSlider
                beforeImg={data?.comparisonBeforeImg || "/assets/images/oud-rose-no-bg.png"}
                afterImg={data?.bottleImg || "/assets/auric-bottle.png"}
                beforeLabel={data?.comparisonBeforeLabel || "Oud & Roses"}
                afterLabel={data?.title || "Auric"}
              />
            </motion.div>
          </div>

          {/* Right Column: Story & Heritage */}
          <div className="col-lg-6 order-1 order-lg-2">
            <motion.div
              className="hero-message ps-0 ps-lg-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div
                style={{
                  fontSize: "clamp(0.72rem, 0.85vw, 0.8rem)",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  marginBottom: "14px",
                  color: "#d4af37",
                }}
              >
                THE EVOLUTION OF AN ICON
              </div>

              <h2
                style={{
                  fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                  lineHeight: "1.18",
                  letterSpacing: "0.015em",
                  fontWeight: 400,
                  color: "#ffffff",
                  marginBottom: "24px",
                }}
              >
                <span style={{ display: "block" }}>A Story That Changed</span>
                <span
                  className="auric-gold-text"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(2.5rem, 4.4vw, 3.8rem)",
                    lineHeight: "1.15",
                    marginTop: "6px",
                  }}
                >
                  the House
                </span>
              </h2>

              <p
                className="lead mb-4"
                style={{
                  fontSize: "clamp(1.02rem, 1.15vw, 1.12rem)",
                  lineHeight: "1.9",
                  color: "rgba(255, 255, 255, 0.82)",
                  fontWeight: 300,
                  letterSpacing: "0.012em",
                  maxWidth: "560px",
                }}
              >
                {data?.storyText ||
                  data?.heroQuote ||
                  "Some fragrances become successful. Others change the direction of a house forever. Oud & Roses became a signature fragrance whose story reached far beyond its origins. Auric honours that legacy and the people who carried the story forward."}
              </p>

              <p
                style={{
                  fontSize: "0.92rem",
                  color: "rgba(240, 226, 196, 0.85)",
                  letterSpacing: "0.02em",
                  fontStyle: "italic",
                  marginBottom: "36px",
                  lineHeight: "1.65",
                  maxWidth: "560px",
                }}
              >
                {data?.founderCredit || "Inspired by the vision of our founder, Mr. Kafeel Ahmed"}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(128, 0, 32, 0.5), 0 0 20px rgba(212, 175, 55, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "#800020",
                    color: "#ffffff",
                    borderRadius: "40px",
                    border: "1px solid rgba(212, 175, 55, 0.55)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                    padding: "14px 38px",
                    fontSize: "0.82rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={onBookNow}
                >
                  Explore Auric
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
