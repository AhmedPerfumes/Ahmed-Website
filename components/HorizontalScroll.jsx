"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Categories from "@/components/homes/home-15/Categories";

gsap.registerPlugin(ScrollTrigger);

const styles = `
  /* ═══════════════════════════════════════
     HORIZONTAL SCROLL — BASE
     ═══════════════════════════════════════ */
  
  .hs-section {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .hs-panel {
    width: 80vw;
    height: 100vh;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  /* Last panel fills remaining viewport — no trailing gap */
  .hs-panel:last-child {
    width: 100%;
  }

  /* ═══════════════════════════════════════
     SLIDES 1 & 3 — CATEGORY PANELS
     (Matching GiftSet section styling)
     ═══════════════════════════════════════ */
  .hs-categories-panel {
    background: #edeae4;
    padding: 0;
    justify-content: center;
    gap: 0;
  }

  /* ── Header: matches gs-header exactly ── */
  .hs-cat-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
    padding: 0 20px 50px;
    flex-shrink: 0;
  }

  .hs-cat-header__tagline {
    font-size: 0.65rem;
    letter-spacing: 5px;
    color: #8a7a5e;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 18px;
    display: block;
  }

  .hs-cat-header__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.8rem);
    font-weight: 400;
    color: #1D1B19;
    letter-spacing: 3px;
    margin: 0 0 24px;
    line-height: 1.1;
    text-transform: uppercase;
  }

  .hs-cat-header__subtitle {
    font-size: 1.1rem;
    color: #6b6258;
    line-height: 1.75;
    font-weight: 400;
    max-width: 520px;
    margin: 0 auto;
  }

  /* ── Categories inner: override its internal title/subtitle ── */
  .hs-categories-inner {
    width: 100%;
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 30px;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* Hide the Categories component's own h2 and subtitle since we render our own */
  .hs-categories-inner .section-head,
  .hs-categories-inner .section-title {
    display: none !important;
  }

  .hs-categories-inner .section-paragraph {
    display: none !important;
  }

  /* ── Override Categories card styling to match gs-card ── */
  .hs-categories-inner .category-carousel {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Card image container */
  .hs-categories-inner .category-carousel .swiper-slide a.d-block {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    margin-bottom: 16px !important;
  }

  /* Card hover lift */
  .hs-categories-inner .category-carousel .swiper-slide {
    transition: transform 0.4s ease;
  }

  .hs-categories-inner .category-carousel .swiper-slide:hover {
    transform: translateY(-5px);
  }

  /* Card title — matches gs-card__title */
  .hs-categories-inner .category-carousel .text-center {
    text-align: left !important;
    padding: 0 2px;
  }

  .hs-categories-inner .category-carousel .text-center .menu-link {
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    letter-spacing: 1.5px !important;
    color: #1D1B19 !important;
    text-transform: uppercase !important;
    text-decoration: none !important;
    margin-bottom: 8px !important;
    display: block;
  }

  /* Shop Now button — matches gs-card__link */
  .hs-categories-inner .category-carousel .d-flex.justify-content-center {
    justify-content: flex-start !important;
    padding: 0 2px;
  }

  .hs-categories-inner .category-carousel .btn-videos {
    font-size: 0.82rem !important;
    letter-spacing: 2px !important;
    font-weight: 700 !important;
    color: #8a7a5e !important;
    text-transform: uppercase !important;
    text-decoration: none !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    transition: color 0.3s, gap 0.3s !important;
    border: none !important;
    background: none !important;
    padding: 0 !important;
  }

  .hs-categories-inner .category-carousel .btn-videos:hover {
    color: #1D1B19 !important;
    gap: 10px !important;
  }

  .hs-categories-inner .category-carousel .btn-videos::after {
    content: '→';
    font-size: 0.9rem;
    transition: transform 0.3s;
  }

  .hs-categories-inner .category-carousel .btn-videos:hover::after {
    transform: translateX(3px);
  }

  /* Slider nav arrows — match gs-nav-btn */
  .hs-categories-inner .swiper-button-prev,
  .hs-categories-inner .swiper-button-next {
    width: 44px !important;
    height: 44px !important;
    background: #fff !important;
    border: 1px solid #d0c5b0 !important;
    border-radius: 50% !important;
    color: #8a7a5e !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
    transition: all 0.3s !important;
  }

  .hs-categories-inner .swiper-button-prev:hover,
  .hs-categories-inner .swiper-button-next:hover {
    background: #b9a16b !important;
    color: #fff !important;
    border-color: #b9a16b !important;
  }

  .hs-categories-inner .swiper-button-prev::after,
  .hs-categories-inner .swiper-button-next::after {
    font-size: 16px !important;
    font-weight: 600 !important;
  }

  .hs-categories-inner .swiper-button-disabled {
    opacity: 0.3 !important;
    cursor: not-allowed !important;
  }

  /* Shadow fades — hide them inside horizontal scroll */
  .hs-categories-inner .slider-shadow-left,
  .hs-categories-inner .slider-shadow-right {
    display: none !important;
  }


  /* ═══════════════════════════════════════
     SLIDE 2 — VIDEO
     ═══════════════════════════════════════ */
  .hs-video-panel {
    background: #edeae4;
    padding: 0;
    justify-content: center;
    gap: 0;
  }

  .hs-vid-header {
    text-align: center;
    flex-shrink: 0;
    padding: 0 20px 28px;
  }

  .hs-vid-eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    font-size: 0.65rem;
    letter-spacing: 5px;
    color: #8a7a5e;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .hs-vid-line {
    display: inline-block;
    width: 32px;
    height: 1px;
    background: #c5b89a;
  }

  .hs-vid-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.8rem);
    color: #1D1B19;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin: 0 0 12px;
    line-height: 1.1;
  }

  .hs-vid-sub {
    font-size: 1rem;
    color: #6b6258;
    margin: 0;
    font-weight: 400;
  }

  .hs-vid-wrap {
    flex-shrink: 0;
    width: 88vw;
    max-width: 1300px;
    padding: 0;
  }

  .hs-vid-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(185,161,107,0.3), 0 16px 50px rgba(0,0,0,0.12);
  }

  .hs-vid-frame iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  /* Corner brackets */
  .hs-vid-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: 3;
    pointer-events: none;
  }

  .hs-vid-corner--tl { top: 10px;    left: 10px;  border-top: 1.5px solid rgba(185,161,107,0.5); border-left: 1.5px solid rgba(185,161,107,0.5); }
  .hs-vid-corner--tr { top: 10px;    right: 10px; border-top: 1.5px solid rgba(185,161,107,0.5); border-right: 1.5px solid rgba(185,161,107,0.5); }
  .hs-vid-corner--bl { bottom: 10px; left: 10px;  border-bottom: 1.5px solid rgba(185,161,107,0.5); border-left: 1.5px solid rgba(185,161,107,0.5); }
  .hs-vid-corner--br { bottom: 10px; right: 10px; border-bottom: 1.5px solid rgba(185,161,107,0.5); border-right: 1.5px solid rgba(185,161,107,0.5); }

  .hs-vid-badge {
    display: block;
    text-align: center;
    font-size: 0.6rem;
    letter-spacing: 5px;
    color: #8a7a5e;
    text-transform: uppercase;
    font-weight: 600;
    padding-top: 18px;
    flex-shrink: 0;
  }


  /* ═══════════════════════════════════════
     SLIDE 4 — ESSENCE OF ARABIA (Redesigned)
     ═══════════════════════════════════════ */
  .hs-essence-panel {
    background: #edeae4;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    gap: 0;
    position: relative;
  }

  /* Large background text for texture */
  .hs-essence-bg-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Playfair Display', serif;
    font-size: 25vw;
    font-weight: 900;
    color: rgba(29, 27, 25, 0.03);
    white-space: nowrap;
    pointer-events: none;
    z-index: 0;
    letter-spacing: -0.02em;
    text-transform: uppercase;
  }

  /* Container for content to keep it aligned */
  .hs-essence-inner {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 0 8vw;
    z-index: 1;
    position: relative;
  }

  /* Left text block - Refined */
  .hs-essence-content {
    flex: 0 0 35%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
  }

  .hs-essence-label {
    font-size: 0.7rem;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: #8a7a5e;
    font-weight: 600;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .hs-essence-line {
    display: inline-block;
    width: 35px;
    height: 1px;
    background: #b9a16b;
  }

  .hs-essence-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 4.5vw, 4rem);
    font-weight: 400;
    color: #1D1B19;
    letter-spacing: 2px;
    margin-bottom: 2rem;
    line-height: 1.1;
    text-transform: uppercase;
  }

  .hs-essence-desc {
    font-size: 1rem;
    color: #6b6258;
    line-height: 1.8;
    margin-bottom: 3rem;
    max-width: 380px;
    font-weight: 400;
  }

  .hs-essence-btn {
    display: inline-flex;
    align-items: center;
    gap: 15px;
    padding: 15px 45px;
    background: #1D1B19;
    color: #fff !important;
    font-size: 0.65rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }

  .hs-essence-btn:hover {
    background: #b9a16b;
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(185, 161, 107, 0.2);
  }

  /* Right — Asymmetric Staggered Cards */
  .hs-essence-cards {
    flex: 0 0 55%;
    display: flex;
    position: relative;
    height: 70vh;
    align-items: center;
    justify-content: flex-end;
  }

  .hs-essence-card {
    text-decoration: none;
    color: inherit;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    position: relative;
  }

  /* Staggered arrangement */
  .hs-essence-card--1 {
    width: 22vw;
    z-index: 2;
    transform: translateY(-5vh);
  }

  .hs-essence-card--2 {
    width: 18vw;
    z-index: 1;
    transform: translate(-4vw, 15vh);
  }

  .hs-essence-card:hover {
    z-index: 3;
    transform: scale(1.02) translateY(var(--hover-y, -5vh));
  }
  .hs-essence-card--1:hover { --hover-y: -7vh; }
  .hs-essence-card--2:hover { --hover-y: 13vh; transform: translate(-4vw, var(--hover-y)) scale(1.02); }

  .hs-essence-card__media {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4.5;
    border-radius: 4px; /* More modern sharp-ish corners */
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    background: #d5cfc8;
  }

  .hs-essence-card__media img {
    transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  }

  .hs-essence-card:hover .hs-essence-card__media img {
    transform: scale(1.1) !important;
  }

  .hs-essence-card__info {
    padding: 0 5px;
  }

  .hs-essence-card__name {
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #1D1B19;
    text-transform: uppercase;
    margin: 0 0 8px;
  }

  .hs-essence-card__cta {
    font-size: 0.7rem;
    letter-spacing: 3px;
    font-weight: 700;
    color: #b9a16b;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
  }

  .hs-essence-card:hover .hs-essence-card__cta {
    color: #1D1B19;
    gap: 15px;
  }

  .hs-essence-card__arrow {
    width: 20px;
    height: 1px;
    background: currentColor;
    position: relative;
    transition: transform 0.3s ease;
  }

  .hs-essence-card__arrow::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 5px;
    height: 5px;
    border-top: 1px solid currentColor;
    border-right: 1px solid currentColor;
    transform: translateY(-50%) rotate(45deg);
  }


  /* ═══════════════════════════════════════
     PROGRESS DOTS
     ═══════════════════════════════════════ */
  .hs-progress {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 10;
  }

  .hs-dot {
    width: 24px;
    height: 2px;
    background: rgba(26,23,20,0.18);
    border-radius: 2px;
    transition: background 0.3s ease, width 0.3s ease;
  }

  .hs-dot.active {
    background: #b9a16b;
    width: 40px;
  }
`;

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

        // Calculate total scroll distance based on 80vw panels + last 100vw panel
        // Distance to scroll = (panels - 1) * 80vw
        const getScrollDist = () => {
            return window.innerWidth * 0.8 * (totalPanels - 1);
        };

        const updateDots = (progress) => {
            const activeIndex = Math.round(progress * (totalPanels - 1));
            dotsRef.current.forEach((dot, i) => {
                if (!dot) return;
                dot.classList.toggle("active", i === activeIndex);
            });
        };

        const dir = locale === "en" ? -1 : 1;

        const tween = gsap.to(panels, {
            x: () => dir * getScrollDist(),
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top top",
                end: () => `+=${getScrollDist()}`,
                pin: true,
                scrub: 1.2,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onUpdate: (self) => updateDots(self.progress),
            },
        });

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [locale]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <section ref={containerRef} className="hs-section">

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
                    <div className="hs-progress">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`hs-dot ${i === 0 ? "active" : ""}`}
                                ref={(el) => (dotsRef.current[i] = el)}
                            />
                        ))}
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
                        <h2 className="hs-vid-title">K-Series</h2>
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
                            <iframe
                                src="https://www.youtube.com/embed/gf0kYWgy-58?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=gf0kYWgy-58&modestbranding=1&rel=0"
                                title="K - Series"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                    <span className="hs-vid-badge">Ahmed Al Maghribi</span>
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
                    {/* Texture background text */}
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
                                {t("Step into a realm of refreshing warmth with Ahmed Al Maghribi's exclusive Dakhoon collection.")}
                            </p>
                            <Link href={`/${locale}/shop/dakhoon`} className="hs-essence-btn">
                                {t("Discover Collection")}
                                <span style={{fontSize: '1.2rem', marginLeft: '5px'}}>→</span>
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
                                        sizes="30vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className="hs-essence-card__info">
                                    <h3 className="hs-essence-card__name">Bakhoor Ahmed</h3>
                                    <div className="hs-essence-card__cta">
                                        SHOP NOW <span className="hs-essence-card__arrow"></span>
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
                                        sizes="25vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className="hs-essence-card__info">
                                    <h3 className="hs-essence-card__name">Oud Kiflain</h3>
                                    <div className="hs-essence-card__cta">
                                        SHOP NOW <span className="hs-essence-card__arrow"></span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
};

export default HorizontalScroll;
