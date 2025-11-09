"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slidesData = [
  {
    id: "past",
    image: "/assets/images/kseries/past.jpg",
    title: "K-Series 2000",
    subtitle: "The Roots",
    text: "Where the Ahmed Al Maghribi journey began — raw, authentic, timeless craftsmanship.",
  },
  {
    id: "present",
    image: "/assets/images/kseries/present.jpg",
    title: "K-Series 2025",
    subtitle: "The Alchemy Lab",
    text: "Precision, innovation, and modern artistry — celebrating today’s golden era of perfumery.",
  },
  {
    id: "future",
    image: "/assets/images/kseries/future.jpg",
    title: "K-Series 2050",
    subtitle: "The Beyond",
    text: "A visionary future — futuristic composition, radiant light, and the spirit of tomorrow.",
  },
];

const KSeriesScrollSection = () => {
  const containerRef = useRef(null);
  const slidesRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const slides = slidesRef.current;
    if (!container || !slides.length) return;

    const ctx = gsap.context(() => {
      gsap.set(container, { position: "relative", overflow: "hidden" });

      gsap.set(slides, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      });

      slides.forEach((s, i) => {
        gsap.set(s, {
          zIndex: i + 1,
          yPercent: i === 0 ? 0 : 100,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=" + (slides.length - 1) * 220 + "vh",
          scrub: 1.1,
          pin: true,
        },
      });

      slides.slice(1).forEach((s) => {
        tl.to(s, { yPercent: 0, ease: "none" });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="kseries-scroll-wrapper">
      {slidesData.map((slide, i) => {
        const left = i % 2 === 0;
        return (
          <div
            key={slide.id}
            ref={(el) => (slidesRef.current[i] = el)}
            className={`kseries-slide ${left ? "left" : "right"}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="kseries-overlay" />
            <div
              className={
                `kseries-content ${left ? "align-left" : "align-right"} theme-${slide.id}`
              }
            >
              <div className="kseries-tag">K-Series • Pre-Registration</div>
              <h2 className="kseries-title">
                {slide.title}
                <span>{slide.subtitle}</span>
              </h2>
              <p className="kseries-text">{slide.text}</p>
              <button className="kseries-btn">Secure Your Slot</button>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .kseries-scroll-wrapper {
          width: 100%;
          height: 100vh;
        }

        .kseries-slide {
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          padding: 0 6vw;
          position: relative;
          will-change: transform;
        }

        .kseries-slide.left {
          justify-content: flex-start;
        }

        .kseries-slide.right {
          justify-content: flex-end;
        }

        /* Subtle overlay to unify without killing artwork */
        .kseries-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 0% 0%, rgba(0, 0, 0, 0.12), transparent 55%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.22));
          z-index: 1;
          pointer-events: none;
        }

        .kseries-content {
          position: relative;
          z-index: 2;
          width: 40%;
          max-width: 620px;
          min-height: 50vh;
          padding: 32px 34px;
          border-radius: 26px;
          background: rgba(10, 7, 5, 0.32);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-family: "Sofia Pro", "Inter", system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #f7eee1;
        }

        .kseries-content.align-left {
          text-align: left;
          align-items: flex-start;
        }

        .kseries-content.align-right {
          text-align: right;
          align-items: flex-end;
        }

        .kseries-tag {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
          opacity: 0.9;
        }

        .kseries-title {
          margin: 0;
          font-family: "Wulkan Display", "Playfair Display", "Georgia", serif;
          font-size: 2.8rem;
          line-height: 1.2;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .kseries-title span {
          display: block;
          margin-top: 4px;
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .kseries-text {
          margin-top: 6px;
          font-size: 0.95rem;
          line-height: 1.9;
          max-width: 460px;
        }

        .kseries-btn {
          margin-top: 18px;
          padding: 12px 34px;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .kseries-content.align-left .kseries-btn {
          align-self: flex-start;
        }

        .kseries-content.align-right .kseries-btn {
          align-self: flex-end;
        }

        /* THEME: PAST (desert, warm wood) */
        .theme-past {
          background:
            radial-gradient(circle at top left, rgba(212, 175, 55, 0.08), transparent 70%),
            rgba(18, 10, 5, 0.5);
          border-color: rgba(212, 175, 55, 0.32);
          color: #f7eee1;
        }
        .theme-past .kseries-tag {
          color: #d4af37;
        }
        .theme-past .kseries-title {
          color: #f7eee1;
        }
        .theme-past .kseries-title span {
          color: #d4af37;
        }
        .theme-past .kseries-text {
          color: #e3d5c1;
        }
        .theme-past .kseries-btn {
          border: 2px solid #d4af37;
          background: #d4af37;
          color: #151008;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
        }
        .theme-past .kseries-btn:hover {
          background: transparent;
          color: #f7eee1;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5);
        }

        /* THEME: PRESENT (futuristic blue) */
        .theme-present,
.theme-future {
  background: rgba(4, 12, 26, 0.88);
  border-color: rgba(90, 180, 255, 0.3);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.65);
  color: #e2f1ff;
  font-family: "Space Grotesk", "Poppins", system-ui, sans-serif;
}

.theme-present .kseries-tag,
.theme-future .kseries-tag {
  color: #6ecbff;
}

.theme-present .kseries-title,
.theme-future .kseries-title {
  color: #eaf7ff;
  text-shadow: 0 0 18px rgba(110, 203, 255, 0.3);
}

.theme-present .kseries-title span,
.theme-future .kseries-title span {
  color: #6ecbff;
}

.theme-present .kseries-text,
.theme-future .kseries-text {
  color: #cbdfff;
}

.theme-present .kseries-btn,
.theme-future .kseries-btn {
  border: none;
  background: linear-gradient(90deg, #1b79ff, #6ecbff);
  color: #fff;
  box-shadow: 0 8px 24px rgba(110, 203, 255, 0.4);
  transition: all 0.25s ease;
}

.theme-present .kseries-btn:hover,
.theme-future .kseries-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(110, 203, 255, 0.6);
}

        @media (max-width: 991px) {
          .kseries-slide {
            justify-content: center !important;
            padding: 0 16px;
          }
          .kseries-content {
            width: 100%;
            min-height: auto;
            padding: 22px 20px;
            align-items: flex-start !important;
            text-align: left !important;
          }
          .kseries-title {
            font-size: 1.8rem;
          }
          .kseries-title span {
            font-size: 0.9rem;
          }
          .kseries-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
};

export default KSeriesScrollSection;
