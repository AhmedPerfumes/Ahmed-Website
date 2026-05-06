"use client";
import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PiLeafLight, PiFireLight, PiMosqueLight, PiDiamondLight } from "react-icons/pi";
import { motion } from "framer-motion";

const DakhoonSection = () => {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <section className="dk-section">
            <style jsx global>{`
                /* ═══════════════════════════════════════
                   DAKHOON HERO SECTION
                   ═══════════════════════════════════════ */
                .dk-section {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                    background: #0d0b09;
                }

                /* ── Background Image ── */
                .dk-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }

                .dk-bg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                }
                @media (max-width: 768px) {
                    .dk-bg img {
                        object-position: center 30%;
                    }
                }

                .dk-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 60% 70% at 50% 42%, rgba(13,11,9,0.55) 0%, rgba(13,11,9,0.18) 60%, transparent 100%),
                        linear-gradient(to bottom, rgba(13,11,9,0.15) 0%, transparent 25%, transparent 70%, rgba(13,11,9,0.5) 100%);
                    z-index: 1;
                }
                @media (max-width: 768px) {
                    .dk-bg::after {
                        background: radial-gradient(circle at 50% 50%, rgba(13,11,9,0.8) 0%, rgba(13,11,9,0.45) 65%, rgba(13,11,9,0.2) 100%);
                    }
                }

                /* ── Outer Border Frame ── */
                .dk-border-frame {
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
                .dk-border-frame::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: 8px;
                    width: calc(50% - 130px);
                    height: 1px;
                    background: rgba(185,161,107,0.25);
                }
                .dk-border-frame::after {
                    content: '';
                    position: absolute;
                    top: -1px; right: 8px;
                    width: calc(50% - 130px);
                    height: 1px;
                    background: rgba(185,161,107,0.25);
                }

                @media (max-width: 768px) {
                    .dk-border-frame {
                        margin: 32px 12px 12px;
                        min-height: 65vh;
                    }
                    .dk-border-frame::before, .dk-border-frame::after { width: calc(50% - 90px); }
                }

                /* ── Inner Border (double-frame effect) ── */
                .dk-inner-frame {
                    position: absolute;
                    inset: 8px;
                    border: 1px solid rgba(185,161,107,0.12);
                    border-top-color: transparent;
                    border-radius: 4px;
                    pointer-events: none;
                    z-index: 1;
                }
                .dk-inner-frame::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: 4px;
                    width: calc(50% - 122px);
                    height: 1px;
                    background: rgba(185,161,107,0.12);
                }
                .dk-inner-frame::after {
                    content: '';
                    position: absolute;
                    top: -1px; right: 4px;
                    width: calc(50% - 122px);
                    height: 1px;
                    background: rgba(185,161,107,0.12);
                }

                @media (max-width: 768px) {
                    .dk-inner-frame { inset: 5px; }
                    .dk-inner-frame::before, .dk-inner-frame::after { width: calc(50% - 85px); }
                }

                /* ── Logo ── */
                .dk-logo-wrap {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dk-logo-wrap img {
                    height: 80px;
                    width: auto;
                    object-fit: contain;
                }
                @media (max-width: 768px) {
                    .dk-logo-wrap img { height: 55px; }
                }

                /* ── Corner Ornaments ── */
                .dk-corner {
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    z-index: 4;
                }

                .dk-corner--tl { top: -1px; left: -1px; }
                .dk-corner--tr { top: -1px; right: -1px; transform: scaleX(-1); }
                .dk-corner--bl { bottom: -1px; left: -1px; transform: scaleY(-1); }
                .dk-corner--br { bottom: -1px; right: -1px; transform: scale(-1); }

                @media (max-width: 576px) {
                    .dk-corner { width: 24px; height: 24px; }
                }

                /* ── Vertical Side Text ── */
                .dk-side-text {
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

                .dk-side-text span {
                    font-size: 0.58rem;
                    letter-spacing: 5px;
                    color: rgba(185,161,107,0.45);
                    text-transform: uppercase;
                    font-weight: 500;
                }

                .dk-side-text .dk-side-dot {
                    width: 4px;
                    height: 4px;
                    background: #b9a16b;
                    border-radius: 50%;
                    opacity: 0.5;
                }

                @media (max-width: 991px) {
                    .dk-side-text { display: none; }
                }

                /* ── Main Content ── */
                .dk-content {
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
                    .dk-content { padding: 50px 24px 10px; min-height: 40vh; }
                }

                .dk-text-block {
                    max-width: 520px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .dk-tagline {
                    font-size: 0.65rem;
                    letter-spacing: 6px;
                    color: #b9a16b;
                    text-transform: uppercase;
                    font-weight: 500;
                    margin-bottom: 22px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
                }

                .dk-heading {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 3.4rem);
                    font-weight: 400;
                    color: #f5f0e8;
                    line-height: 1.1;
                    letter-spacing: 1px;
                    margin: 0 0 24px;
                    text-shadow: 0 4px 12px rgba(0,0,0,0.7);
                }

                .dk-heading em {
                    font-style: italic;
                    color: #b9a16b;
                }

                /* Diamond accent */
                .dk-accent {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .dk-accent__diamond {
                    width: 7px;
                    height: 7px;
                    background: #b9a16b;
                    transform: rotate(45deg);
                }

                .dk-accent__line {
                    width: 45px;
                    height: 1px;
                    background: linear-gradient(to right, #b9a16b, transparent);
                }

                .dk-description {
                    font-size: 0.88rem;
                    color: rgba(245,240,232,0.55);
                    line-height: 1.8;
                    margin: 0 0 32px;
                    max-width: 400px;
                    font-weight: 300;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.8);
                }

                /* ── CTA Button ── */
                .dk-cta {
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

                .dk-cta:hover {
                    background: #b9a16b;
                    color: #0d0b09;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(185,161,107,0.25);
                }

                .dk-cta svg {
                    transition: transform 0.4s ease;
                }

                .dk-cta:hover svg {
                    transform: translateX(4px);
                }

                /* ═══════════════════════════════════════
                   BOTTOM AREA (Features + Tagline)
                   ═══════════════════════════════════════ */
                .dk-bottom {
                    position: relative;
                    z-index: 3;
                    padding: 0 30px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                @media (max-width: 768px) {
                    .dk-bottom { padding: 0 16px 30px; gap: 8px; }
                }

                /* Features Row */
                .dk-features {
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

                .dk-feat {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 14px 12px;
                }

                .dk-feat-divider {
                    width: 1px;
                    align-self: stretch;
                    background: linear-gradient(to bottom, transparent 12%, rgba(185,161,107,0.3) 50%, transparent 88%);
                    flex-shrink: 0;
                }

                .dk-feat__icon {
                    flex-shrink: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dk-feat__icon svg {
                    filter: drop-shadow(0px 2px 5px rgba(0,0,0,0.8));
                }

                .dk-feat__label {
                    font-size: 0.56rem;
                    letter-spacing: 1px;
                    font-weight: 600;
                    color: rgba(245,240,232,0.85);
                    text-transform: uppercase;
                    line-height: 1.4;
                }

                @media (max-width: 768px) {
                    .dk-features {
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                        max-width: 320px;
                        margin: 0 auto;
                        border-radius: 10px;
                    }
                    .dk-features::-webkit-scrollbar {
                        display: none;
                    }
                    .dk-feat {
                        flex: 1 1 0;
                        min-width: 70px;
                        padding: 16px 8px;
                        flex-direction: column;
                        justify-content: flex-start;
                        text-align: center;
                        gap: 8px;
                        border-bottom: none !important;
                    }
                    .dk-feat-divider { display: none; }
                }

                @media (max-width: 540px) {
                    .dk-feat {
                        min-width: 60px;
                        padding: 12px 4px;
                    }
                    .dk-feat__icon {
                        width: 28px;
                        height: 28px;
                    }
                    .dk-feat__label {
                        font-size: 0.5rem;
                        line-height: 1.3;
                    }
                }

                /* Bottom Tagline Row */
               

                /* ── Geometric corner pattern ── */
                .dk-geo-pattern {
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
                    .dk-geo-pattern { display: none; }
                }
            `}</style>

            {/* ── Background Image ── */}
            <div className="dk-bg">
                <img
                    src="/assets/images/home/demo8/avif/dakhoon-bnr.avif"
                    alt="Arabic Dakhoon Collection"
                    loading="lazy"
                />
            </div>

            {/* ── Outer Border Frame ── */}
            <div className="dk-border-frame">
                {/* Inner border */}
                <div className="dk-inner-frame" />

                {/* ── Logo ── */}
                <div className="dk-logo-wrap">
                    <img src="/assets/images/AhmedLogo.png" alt="Ahmed Perfumes" />
                </div>

                {/* Gold corner ornaments */}
                {['tl', 'tr', 'bl', 'br'].map((pos) => (
                    <div key={pos} className={`dk-corner dk-corner--${pos}`}>
                        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
                            <path d="M0 0h12v1H1v11H0z" fill="#b9a16b" opacity="0.6"/>
                            <rect x="4" y="4" width="3" height="3" rx="0.5" transform="rotate(45 5.5 5.5)" fill="none" stroke="#b9a16b" strokeWidth="0.8" opacity="0.4"/>
                        </svg>
                    </div>
                ))}

                {/* ── Vertical Side Text ── */}
                <div className="dk-side-text">
                    <span>{t("Heritage")}</span>
                    <div className="dk-side-dot" />
                    <span>{t("Quality")}</span>
                    <div className="dk-side-dot" />
                    <span>{t("Luxury")}</span>
                </div>

                {/* ── Geometric Pattern (bottom-left) ── */}
                <div className="dk-geo-pattern">
                    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 140V80l25-25h40l25 25v40l-25 25H25z" stroke="#b9a16b" strokeWidth="1.2"/>
                        <path d="M15 125V95l15-15h30l15 15v30l-15 15H30z" stroke="#b9a16b" strokeWidth="0.8"/>
                    </svg>
                </div>

                {/* ── Main Content ── */}
                <div className="dk-content">
                    <motion.div
                        className="dk-text-block"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="dk-tagline"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            {t("Ancient Aromas")}
                        </motion.div>

                        <motion.h2
                            className="dk-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {t("The Essence of")}<br />
                            {t("Arabic")} <em>{t("Dakhoon")}</em>
                        </motion.h2>

                        <motion.div
                            className="dk-accent"
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                        >
                            <div className="dk-accent__diamond" />
                            <div className="dk-accent__line" />
                        </motion.div>

                        <motion.p
                            className="dk-description"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            {t("Experience the heritage of Arabic Dakhoon, made from natural ingredients. Enjoy rich, long-lasting aromas that bring warmth and tradition to your home.")}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <Link href={`/${locale}/shop/dakhoon`} className="dk-cta">
                                {t("Shop Now")}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Bottom Area ── */}
                <div className="dk-bottom">
                    {/* Features Row */}
                    <motion.div
                        className="dk-features"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <div className="dk-feat">
                            <div className="dk-feat__icon">
                                <PiLeafLight size={22} color="#b9a16b" />
                            </div>
                            <div className="dk-feat__label">
                                {t("Natural")}<br />{t("Ingredients")}
                            </div>
                        </div>

                        <div className="dk-feat-divider" />

                        <div className="dk-feat">
                            <div className="dk-feat__icon">
                                <PiFireLight size={22} color="#b9a16b" />
                            </div>
                            <div className="dk-feat__label">
                                {t("Long Lasting")}<br />{t("Aromas")}
                            </div>
                        </div>

                        <div className="dk-feat-divider" />

                        <div className="dk-feat">
                            <div className="dk-feat__icon">
                                <PiMosqueLight size={22} color="#b9a16b" />
                            </div>
                            <div className="dk-feat__label">
                                Arabic<br />Heritage
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DakhoonSection;
