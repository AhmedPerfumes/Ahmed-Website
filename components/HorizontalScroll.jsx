"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Categories from "@/components/homes/home-15/Categories";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_PANELS = 4;

const HorizontalScroll = () => {
  const locale = useLocale();
  const t = useTranslations();
  const containerRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const panels = el.querySelectorAll(".hs-panel");
    const totalPanels = panels.length;
    if (totalPanels === 0) return;

    // ── UI helpers ──────────────────────────────────────────────
    const updateUI = (activeIndex) => {
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        dot.classList.toggle("active", i === activeIndex);
      });
      const counter = el.querySelector(".hs-counter-current");
      if (counter) {
        counter.innerText = String(activeIndex + 1).padStart(2, "0");
      }
      const hint = el.querySelector(".hs-scroll-hint");
      if (hint) {
        hint.classList.toggle("hidden", activeIndex > 0);
      }
    };

    // ── Stacking z-index: later panels appear on top ────────────
    panels.forEach((panel, i) => {
      panel.style.zIndex = i + 1;
    });

    // ── All panels (except first) start off-screen to the right ─
    gsap.set([...panels].slice(1), { x: "100%" });

    // ── Initialise UI for first slide ───────────────────────────
    updateUI(0);

    // ── One ScrollTrigger per incoming panel ────────────────────
    const triggers = [];

    [...panels].slice(1).forEach((panel, i) => {
      const panelIndex = i + 1; // 1-based position in the stack

      const st = ScrollTrigger.create({
        trigger: el,
        // Each panel's entry occupies one viewport-height of scroll
        start: () => `top+=${i * window.innerHeight}px top`,
        end:   () => `top+=${panelIndex * window.innerHeight}px top`,
        scrub: 1.0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Slide panel from right (100%) to resting position (0%)
          gsap.set(panel, { x: `${(1 - self.progress) * 100}%` });

          // Dot / counter follow the leading edge of the transition
          updateUI(self.progress >= 0.5 ? panelIndex : panelIndex - 1);
        },
        onLeave: () => {
          gsap.set(panel, { x: "0%" });
          updateUI(panelIndex);
        },
        onEnterBack: () => {
          updateUI(panelIndex - 1);
        },
      });

      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [locale]);

  // Dot click → scroll to the start of that panel's scroll segment
  const scrollToPanel = (i) => {
    const container = containerRef.current;
    if (!container) return;
    const sectionTop = container.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop + i * window.innerHeight, behavior: "smooth" });
  };

  return (
    <>
      {/* hs-section is a tall scroll-space container.
          hs-sticky is the CSS-pinned viewport that holds all panels. */}
      <section ref={containerRef} className="hs-section">
        <div className="hs-sticky">

          {/* ── Slide 1: Iconic Indulgence ──────────── */}
          <div className="hs-panel hs-categories-panel">
            <div className="hs-cat-header">
              <span className="hs-cat-header__tagline">
                {t("Signature Fragrances")}
              </span>
              <h2 className="hs-cat-header__title">
                {t("Iconic Indulgence")}
              </h2>
              <p className="hs-cat-header__subtitle">
                {t("See luxury in motion through the eyes of those who know it best")}
              </p>
            </div>
            <div className="hs-categories-inner">
              <Categories section="section4" />
            </div>
          </div>

          {/* ── Slide 2: K-Series Video ─────────────── */}
          <div className="hs-panel hs-video-panel">
            <div className="hs-vid-header">
              <span className="hs-vid-eyebrow">
                <span className="hs-vid-line" />
                {t("Now Showing")}
                <span className="hs-vid-line" />
              </span>
              <h2 className="hs-vid-title">{t("K-Series")}</h2>
              <p className="hs-vid-sub">
                {t("Experience the fragrance in motion")}
              </p>
            </div>
            <div className="hs-vid-wrap">
              <div className="hs-vid-frame">
                <span className="hs-vid-corner hs-vid-corner--tl" />
                <span className="hs-vid-corner hs-vid-corner--tr" />
                <span className="hs-vid-corner hs-vid-corner--bl" />
                <span className="hs-vid-corner hs-vid-corner--br" />
                <div className="hs-vid-inner">
                  <iframe
                    src="https://www.youtube.com/embed/gf0kYWgy-58?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=gf0kYWgy-58&modestbranding=1&rel=0"
                    title="K - Series"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
            <span className="hs-vid-badge">{t("Ahmed Al Maghribi")}</span>
          </div>

          {/* ── Slide 3: Luxury Delight ─────────────── */}
          <div className="hs-panel hs-categories-panel">
            <div className="hs-cat-header">
              <span className="hs-cat-header__tagline">
                {t("Curated Collections")}
              </span>
              <h2 className="hs-cat-header__title">
                {t("Luxury Delight")}
              </h2>
              <p className="hs-cat-header__subtitle">
                {t("Modern elegance meets Middle Eastern tradition")}
              </p>
            </div>
            <div className="hs-categories-inner">
              <Categories />
            </div>
          </div>

          {/* ── Slide 4: Essence of Arabia ──────────── */}
          <div className="hs-panel hs-essence-panel">
            <div className="hs-essence-bg-text">ARABIA</div>
            <div className="hs-essence-inner">
              {/* Left — editorial text */}
              <div className="hs-essence-content">
                <span className="hs-essence-label">
                  <span className="hs-essence-line" />
                  {t("Ancient Aromas")}
                </span>
                <h2 className="hs-essence-title">{t("Essence of Arabia")}</h2>
                <div className="hs-essence-divider" />
                <p className="hs-essence-desc">
                  {t("Step into a realm of refreshing warmth with Ahmed Al Maghribis exclusive Dakhoon collection")}
                </p>
                <Link href={`/${locale}/shop/dakhoon`} className="hs-essence-btn">
                  {t("Discover Collection")}
                  <span style={{ fontSize: "1.2rem", marginLeft: "5px" }}>→</span>
                </Link>
              </div>

              {/* Right — Asymmetric product cards */}
              <div className="hs-essence-cards">
                <Link
                  href={`/${locale}/shop/dakhoon/bakhoor/bakhoor-ahmed-40-tabs`}
                  className="hs-essence-card hs-essence-card--1"
                >
                  <div className="hs-essence-card__media">
                    <Image
                      src="/assets/images/bakhoor-ahmed.jpg"
                      alt="Bakhoor Ahmed"
                      fill
                      priority
                      sizes="(max-width: 768px) 45vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="hs-essence-card__info">
                    <h3 className="hs-essence-card__name">{t("Bakhoor Ahmed")}</h3>
                    <div className="hs-essence-card__cta">
                      {t("Shop Now")} <span className="hs-essence-card__arrow"></span>
                    </div>
                  </div>
                </Link>

                <Link
                  href={`/${locale}/shop/dakhoon/oud-maattar/oud-kiflain`}
                  className="hs-essence-card hs-essence-card--2"
                >
                  <div className="hs-essence-card__media">
                    <Image
                      src="/assets/images/oud-kiflain.jpg"
                      alt="Oud Kiflain"
                      fill
                      priority
                      sizes="(max-width: 768px) 45vw, 20vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="hs-essence-card__info">
                    <h3 className="hs-essence-card__name">{t("Oud Kiflain")}</h3>
                    <div className="hs-essence-card__cta">
                      {t("Shop Now")} <span className="hs-essence-card__arrow"></span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Global Navigation (lives in sticky viewport) ──── */}
          <div className="hs-nav">
            <div className="hs-scroll-hint">
              <span>{t("Scroll to explore")}</span>
              <div className="hs-hint-line" />
            </div>
            <div className="hs-nav-inner">
              <div className="hs-counter">
                <span className="hs-counter-current">01</span> / {String(TOTAL_PANELS).padStart(2, "0")}
              </div>
              <div className="hs-dots">
                {Array.from({ length: TOTAL_PANELS }, (_, i) => (
                  <div
                    key={i}
                    className={`hs-dot ${i === 0 ? "active" : ""}`}
                    ref={(el) => (dotsRef.current[i] = el)}
                    onClick={() => scrollToPanel(i)}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HorizontalScroll;
