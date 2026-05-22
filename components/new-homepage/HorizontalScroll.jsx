"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Categories from "@/components/homes/home-15/Categories";
import DakhoonSection from "@/components/new-homepage/Section1";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_PANELS = 5;

const HorizontalScroll = () => {
  const locale = useLocale();
  const t = useTranslations();
  const containerRef = useRef(null);
  const dotsRef = useRef([]);
  const [isMuted, setIsMuted] = useState(true);

  // Send controls to YouTube player iframe
  const postCommand = (func, args = []) => {
    const iframe = document.getElementById("k-series-yt-iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: func,
          args: args,
        }),
        "*"
      );
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    postCommand(nextMuted ? "mute" : "unMute");
  };

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

    let triggers = [];

    /**
     * WHY THE DEFERRED SETUP:
     * useEffect fires right after hydration, but images / fonts above this
     * section haven't loaded yet. Their dimensions are unknown, so the
     * section's Y-offset on the page is wrong. GSAP then calculates wrong
     * start/end positions, fires onLeave immediately for panel[1], and
     * covers slide 1 before the user has even scrolled there.
     *
     * Fix: defer trigger creation to after the first paint AND after all
     * resources have loaded, so GSAP always gets the true layout.
     */
    const buildTriggers = () => {
      // Kill any previously created triggers before rebuilding
      triggers.forEach((t) => t.kill());
      triggers = [];

      // Reset all panels to their correct off-screen starting position
      gsap.set([...panels].slice(1), { x: "100%" });
      updateUI(0);

      // Hard-refresh ScrollTrigger so it recalculates all element offsets
      ScrollTrigger.refresh(true);

      // Calculate available scroll distance accurately (offsetHeight - windowHeight)
      const sectionHeight = el.offsetHeight || window.innerHeight * 6;
      const scrollableDistance = sectionHeight - window.innerHeight;
      
      const numSlidesToTransition = panels.length - 1; // 3 slides
      const BUFFER_START = scrollableDistance * 0.12; // 12% delay before first slide
      const BUFFER_END = scrollableDistance * 0.02;   // 2% stick time after last slide completes (almost no dead scroll)
      const SLIDE_DISTANCE = (scrollableDistance - BUFFER_START - BUFFER_END) / numSlidesToTransition;

      [...panels].slice(1).forEach((panel, i) => {
        const panelIndex = i + 1;

        const st = ScrollTrigger.create({
          trigger: el,
          // Start after buffer + previous slides' distances
          start: () => `top+=${BUFFER_START + i * SLIDE_DISTANCE}px top`,
          end:   () => `top+=${BUFFER_START + panelIndex * SLIDE_DISTANCE}px top`,
          scrub: 1.0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(panel, { x: `${(1 - self.progress) * 100}%` });
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
    };

    // ── Defer setup: wait one rAF + a small timeout so the browser
    //    has painted and image heights are known ───────────────────
    let rafId;
    let timeoutId;
    rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(buildTriggers, 150);
    });

    // ── Also re-refresh when ALL resources (images etc.) are loaded ─
    const handleLoad = () => ScrollTrigger.refresh(true);
    window.addEventListener("load", handleLoad);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      window.removeEventListener("load", handleLoad);
      triggers.forEach((t) => t.kill());
    };
  }, [locale]);

  // Dot click → scroll to the start of that panel's scroll segment
  const scrollToPanel = (i) => {
    const container = containerRef.current;
    if (!container) return;
    const sectionTop = container.getBoundingClientRect().top + window.scrollY;
    
    // To show slide i fully, we scroll to the point where its transition finishes
    const sectionHeight = container.offsetHeight || window.innerHeight * 6;
    const scrollableDistance = sectionHeight - window.innerHeight;
    const numSlidesToTransition = TOTAL_PANELS - 1;
    const BUFFER_START = scrollableDistance * 0.12;
    const BUFFER_END = scrollableDistance * 0.1;
    const SLIDE_DISTANCE = (scrollableDistance - BUFFER_START - BUFFER_END) / numSlidesToTransition;

    const offset = i === 0 ? 0 : BUFFER_START + i * SLIDE_DISTANCE;

    window.scrollTo({ top: sectionTop + offset, behavior: "smooth" });
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
                    id="k-series-yt-iframe"
                    src="https://www.youtube.com/embed/gf0kYWgy-58?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=gf0kYWgy-58&modestbranding=1&rel=0&enablejsapi=1"
                    title="K - Series"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
                <button
                  type="button"
                  className="hs-vid-mute-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M13.5 4.06c0-.75-.74-1.24-1.42-.89l-4.72 2.45H4.5A1.5 1.5 0 003 7.12v9.76a1.5 1.5 0 001.5 1.5h2.86l4.72 2.45c.68.35 1.42-.14 1.42-.89V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M13.5 4.06c0-.75-.74-1.24-1.42-.89l-4.72 2.45H4.5A1.5 1.5 0 003 7.12v9.76a1.5 1.5 0 001.5 1.5h2.86l4.72 2.45c.68.35 1.42-.14 1.42-.89V4.06zM18.57 17.47a.75.75 0 11-1.06-1.06 4.97 4.97 0 000-7.02.75.75 0 111.06-1.06 6.47 6.47 0 010 9.14z" />
                      <path d="M21.22 20.12a.75.75 0 11-1.06-1.06 8.71 8.71 0 000-12.32.75.75 0 011.06-1.06 10.21 10.21 0 010 14.44z" />
                    </svg>
                  )}
                </button>
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

          {/* ── Slide 4: Dakhoon Section ────────────── */}
          <div className="hs-panel hs-dakhoon-panel">
            <DakhoonSection />
          </div>

          {/* ── Slide 5: Essence of Arabia ──────────── */}
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
                <Link href={`/${locale}/product-category/dakhoon`} className="hs-essence-btn">

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
            <div className="hs-scroll-hint">
              <div className="hs-hint-line" />
              <span>{t("Scroll to explore")}</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HorizontalScroll;
