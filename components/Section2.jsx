"use client";
import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PiStarLight, PiDropLight, PiHeartLight } from "react-icons/pi";
import { motion } from "framer-motion";

const Section2 = () => {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <section className="bs-section">
            <style jsx global>{`
                /* ═══════════════════════════════════════
                   BESTSELLERS SECTION
                   ═══════════════════════════════════════ */
                .bs-section {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                    background: #0d0b09;
                }

                /* ── Background Image ── */
                .bs-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }

                .bs-bg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                }
                @media (max-width: 768px) {
                    .bs-bg img {
                        object-position: left 7%;
                    }
                }

                .bs-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 60% 70% at 50% 42%, rgba(13,11,9,0.55) 0%, rgba(13,11,9,0.18) 60%, transparent 100%),
                        linear-gradient(to bottom, rgba(13,11,9,0.15) 0%, transparent 25%, transparent 70%, rgba(13,11,9,0.5) 100%);
                    z-index: 1;
                }
                @media (max-width: 768px) {
                    .bs-bg::after {
                        background: radial-gradient(circle at 50% 50%, rgba(13,11,9,0.8) 0%, rgba(13,11,9,0.45) 65%, rgba(13,11,9,0.2) 100%);
                    }
                }

                /* ── Outer Border Frame ── */
                .bs-border-frame {
                    position: relative;
                    z-index: 2;
                    margin: 44px 24px 24px;
                    border: 1px solid rgba(185,161,107,0.25);
                    border-top-color: transparent;
                    border-radius: 8px;
                    min-height: calc(100vh - 68px);
                    display: flex;
                    flex-direction: column;
                }
                .bs-border-frame::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: 8px;
                    width: calc(50% - 130px);
                    height: 1px;
                    background: rgba(185,161,107,0.25);
                }
                .bs-border-frame::after {
                    content: '';
                    position: absolute;
                    top: -1px; right: 8px;
                    width: calc(50% - 130px);
                    height: 1px;
                    background: rgba(185,161,107,0.25);
                }

                @media (max-width: 768px) {
                    .bs-border-frame {
                        margin: 32px 12px 12px;
                        min-height: 65vh;
                    }
                    .bs-border-frame::before, .bs-border-frame::after { width: calc(50% - 90px); }
                }

                /* ── Inner Border (double-frame effect) ── */
                .bs-inner-frame {
                    position: absolute;
                    inset: 8px;
                    border: 1px solid rgba(185,161,107,0.12);
                    border-top-color: transparent;
                    border-radius: 4px;
                    pointer-events: none;
                    z-index: 1;
                }
                .bs-inner-frame::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: 4px;
                    width: calc(50% - 122px);
                    height: 1px;
                    background: rgba(185,161,107,0.12);
                }
                .bs-inner-frame::after {
                    content: '';
                    position: absolute;
                    top: -1px; right: 4px;
                    width: calc(50% - 122px);
                    height: 1px;
                    background: rgba(185,161,107,0.12);
                }

                @media (max-width: 768px) {
                    .bs-inner-frame { inset: 5px; }
                    .bs-inner-frame::before, .bs-inner-frame::after { width: calc(50% - 85px); }
                }

                /* ── Logo ── */
                .bs-logo-wrap {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .bs-logo-wrap img {
                    height: 80px;
                    width: auto;
                    object-fit: contain;
                }
                @media (max-width: 768px) {
                    .bs-logo-wrap img { height: 55px; }
                }

                /* ── Corner Ornaments ── */
                .bs-corner {
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    z-index: 4;
                }

                .bs-corner--tl { top: -1px; left: -1px; }
                .bs-corner--tr { top: -1px; right: -1px; transform: scaleX(-1); }
                .bs-corner--bl { bottom: -1px; left: -1px; transform: scaleY(-1); }
                .bs-corner--br { bottom: -1px; right: -1px; transform: scale(-1); }

                @media (max-width: 576px) {
                    .bs-corner { width: 24px; height: 24px; }
                }

                /* ── Vertical Side Text ── */
                .bs-side-text {
                    position: absolute;
                    left: 28px;
                    top: 50%;
                    transform: translateY(-50%) rotate(-90deg);
                    transform-origin: center center;
                    z-index: 5;
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    white-space: nowrap;
                }

                .bs-side-text span {
                    font-size: 0.58rem;
                    letter-spacing: 5px;
                    color: rgba(185,161,107,0.45);
                    text-transform: uppercase;
                    font-weight: 500;
                }

                .bs-side-text .bs-side-dot {
                    width: 4px;
                    height: 4px;
                    background: #b9a16b;
                    border-radius: 50%;
                    opacity: 0.5;
                }

                @media (max-width: 991px) {
                    .bs-side-text { display: none; }
                }

                /* ── Main Content ── */
                .bs-content {
                    position: relative;
                    z-index: 3;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 40px 10px;
                    min-height: 48vh;
                }

                @media (max-width: 768px) {
                    .bs-content { padding: 50px 24px 10px; min-height: 40vh; }
                }

                .bs-text-block {
                    max-width: 520px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .bs-tagline {
                    font-size: 0.65rem;
                    letter-spacing: 6px;
                    color: #b9a16b;
                    text-transform: uppercase;
                    font-weight: 500;
                    margin-bottom: 22px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
                }

                .bs-heading {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2.2rem, 5vw, 3.8rem);
                    font-weight: 400;
                    color: #f5f0e8;
                    line-height: 1.1;
                    letter-spacing: 1px;
                    margin: 0 0 24px;
                    text-shadow: 0 4px 12px rgba(0,0,0,0.7);
                }

                .bs-heading em {
                    font-style: italic;
                    color: #b9a16b;
                }

                /* Diamond accent */
                .bs-accent {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .bs-accent__diamond {
                    width: 7px;
                    height: 7px;
                    background: #b9a16b;
                    transform: rotate(45deg);
                }

                .bs-accent__line {
                    width: 45px;
                    height: 1px;
                    background: linear-gradient(to right, #b9a16b, transparent);
                }

                .bs-description {
                    font-size: 0.88rem;
                    color: rgba(245,240,232,0.55);
                    line-height: 1.8;
                    margin: 0 0 32px;
                    max-width: 400px;
                    font-weight: 300;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.8);
                }

                /* ── CTA Button ── */
                .bs-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 13px 30px;
                    border: 1.5px solid #b9a16b;
                    border-radius: 50px;
                    background: transparent;
                    color: #f5f0e8;
                    font-size: 0.65rem;
                    letter-spacing: 3px;
                    font-weight: 600;
                    text-transform: uppercase;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .bs-cta:hover {
                    background: #b9a16b;
                    color: #0d0b09;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(185,161,107,0.25);
                }

                .bs-cta svg {
                    transition: transform 0.4s ease;
                }

                .bs-cta:hover svg {
                    transform: translateX(4px);
                }

                /* ═══════════════════════════════════════
                   BOTTOM AREA (Features)
                   ═══════════════════════════════════════ */
                .bs-bottom {
                    position: relative;
                    z-index: 3;
                    padding: 0 30px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                @media (max-width: 768px) {
                    .bs-bottom { padding: 0 16px 30px; gap: 8px; }
                }

                /* Features Row */
                .bs-features {
                    display: flex;
                    align-items: stretch;
                    border: 1px solid rgba(185,161,107,0.22);
                    border-radius: 10px;
                    background: rgba(13,11,9,0.4);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    overflow: hidden;
                    width: 100%;
                    max-width: 580px;
                }

                .bs-feat {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 14px 12px;
                }

                .bs-feat-divider {
                    width: 1px;
                    align-self: stretch;
                    background: linear-gradient(to bottom, transparent 12%, rgba(185,161,107,0.3) 50%, transparent 88%);
                    flex-shrink: 0;
                }

                .bs-feat__icon {
                    flex-shrink: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .bs-feat__icon svg {
                    filter: drop-shadow(0px 2px 5px rgba(0,0,0,0.8));
                }

                .bs-feat__label {
                    font-size: 0.56rem;
                    letter-spacing: 1px;
                    font-weight: 600;
                    color: rgba(245,240,232,0.85);
                    text-transform: uppercase;
                    line-height: 1.4;
                }

                @media (max-width: 768px) {
                    .bs-features {
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                        max-width: 320px;
                        margin: 0 auto;
                        border-radius: 10px;
                    }
                    .bs-features::-webkit-scrollbar {
                        display: none;
                    }
                    .bs-feat {
                        flex: 1 1 0;
                        min-width: 70px;
                        padding: 16px 8px;
                        flex-direction: column;
                        justify-content: flex-start;
                        text-align: center;
                        gap: 8px;
                        border-bottom: none !important;
                    }
                    .bs-feat-divider { display: none; }
                }

                @media (max-width: 540px) {
                    .bs-feat {
                        min-width: 60px;
                        padding: 12px 4px;
                    }
                    .bs-feat__icon {
                        width: 28px;
                        height: 28px;
                    }
                    .bs-feat__label {
                        font-size: 0.5rem;
                        line-height: 1.3;
                    }
                }

                /* ── Geometric corner pattern ── */
                .bs-geo-pattern {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    z-index: 2;
                    width: 140px;
                    height: 140px;
                    opacity: 0.05;
                    pointer-events: none;
                }

                @media (max-width: 768px) {
                    .bs-geo-pattern { display: none; }
                }

                /* RTL TYPOGRAPHY IMPROVEMENTS */
                [dir='rtl'] .bs-tagline,
                [dir='rtl'] .bs-side-text span,
                [dir='rtl'] .bs-feat__label {
                    letter-spacing: 0 !important;
                    font-size: 0.9rem !important;
                    font-weight: 500 !important;
                }
                [dir='rtl'] .bs-heading {
                    line-height: 1.3 !important;
                    letter-spacing: 0 !important;
                    font-size: clamp(2.2rem, 5vw, 3.8rem) !important;
                }
                [dir='rtl'] .bs-description {
                    line-height: 1.8 !important;
                    font-size: 1.05rem !important;
                    max-width: 480px !important;
                }
                [dir='rtl'] .bs-cta {
                    letter-spacing: 0 !important;
                    font-size: 0.9rem !important;
                }
            `}</style>

            {/* ── Background Image ── */}
            <div className="bs-bg">
                <img
                    src="/assets/images/home/demo8/avif/top-banner-full.avif"
                    alt="Signature Selections"
                    loading="lazy"
                />
            </div>

            {/* ── Outer Border Frame ── */}
            <div className="bs-border-frame">
                {/* Inner border */}
                <div className="bs-inner-frame" />

                {/* ── Logo ── */}
                <div className="bs-logo-wrap">
                    <img src="/assets/images/AhmedLogo.png" alt="Ahmed Perfumes" />
                </div>

                {/* Gold corner ornaments */}
                {['tl', 'tr', 'bl', 'br'].map((pos) => (
                    <div key={pos} className={`bs-corner bs-corner--${pos}`}>
                        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
                            <path d="M0 0h12v1H1v11H0z" fill="#b9a16b" opacity="0.6"/>
                            <rect x="4" y="4" width="3" height="3" rx="0.5" transform="rotate(45 5.5 5.5)" fill="none" stroke="#b9a16b" strokeWidth="0.8" opacity="0.4"/>
                        </svg>
                    </div>
                ))}

                {/* ── Vertical Side Text ── */}
                <div className="bs-side-text">
                    <span>{t("Timeless")}</span>
                    <div className="bs-side-dot" />
                    <span>{t("Signature")}</span>
                    <div className="bs-side-dot" />
                    <span>{t("Bestsellers")}</span>
                </div>

                {/* ── Geometric Pattern (bottom-left) ── */}
                <div className="bs-geo-pattern">
                    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 140V80l25-25h40l25 25v40l-25 25H25z" stroke="#b9a16b" strokeWidth="1.2"/>
                        <path d="M15 125V95l15-15h30l15 15v30l-15 15H30z" stroke="#b9a16b" strokeWidth="0.8"/>
                    </svg>
                </div>

                {/* ── Main Content ── */}
                <div className="bs-content">
                    <motion.div
                        className="bs-text-block"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="bs-tagline"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            {t("Signature Selections")}
                        </motion.div>

                        <motion.h2
                            className="bs-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {t("Fragrances")}<br />
                            <em>{t("Adored by All")}</em>
                        </motion.h2>

                        <motion.div
                            className="bs-accent"
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                        >
                            <div className="bs-accent__diamond" />
                            <div className="bs-accent__line" />
                        </motion.div>

                        <motion.p
                            className="bs-description"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            {t("Discover our bestsellers crafted to suit diverse tastes From classics to modern blends each fragrance offers something unique for every scent lover")}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <Link href={`/${locale}/shop/bestsellers`} className="bs-cta">
                                {t("Explore Bestsellers")}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Bottom Area ── */}
                <div className="bs-bottom">
                    {/* Features Row */}
                    <motion.div
                        className="bs-features"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <div className="bs-feat">
                            <div className="bs-feat__icon">
                                <PiStarLight size={22} color="#b9a16b" />
                            </div>
                            <div className="bs-feat__label">
                                {t("Classic")}<br />{t("Scents")}
                            </div>
                        </div>

                        <div className="bs-feat-divider" />

                        <div className="bs-feat">
                            <div className="bs-feat__icon">
                                <PiDropLight size={22} color="#b9a16b" />
                            </div>
                            <div className="bs-feat__label">
                                {t("Modern")}<br />{t("Blends")}
                            </div>
                        </div>

                        <div className="bs-feat-divider" />

                        <div className="bs-feat">
                            <div className="bs-feat__icon">
                                <PiHeartLight size={22} color="#b9a16b" />
                            </div>
                            <div className="bs-feat__label">
                                {t("Diverse")}<br />{t("Tastes")}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Section2;
