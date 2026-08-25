"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { PiMapPinLight, PiClockCounterClockwiseLight, PiCertificateLight } from "react-icons/pi";
import VideoPanel from "@/components/VideoPanel";

const QualityBoutiqueSection = () => {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <section className="qb-section">
            <style jsx global>{`
                .qb-section {
                    position: relative;
                    width: 100%;
                    background: #ffffff;
                    font-family: 'Inter', sans-serif;
                    overflow: hidden;
                    padding: 100px 0;
                }

                @media (max-width: 768px) {
                    .qb-section { padding: 40px 0; }
                }

                /* ── Outer Border Frame ── */
                .qb-container {
                    position: relative;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 24px;
                    z-index: 2;
                }

                .qb-frame {
                    position: relative;
                    padding: 40px 0;
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                    gap: 120px;
                }

                @media (max-width: 991px) {
                    .qb-frame { padding: 40px 20px; gap: 60px; }
                }

                /* ── Section Header ── */
                /* ── Logo Removed ── */

                .qb-logo-top img {
                    display: none;
                }

                /* ── Content Blocks ── */
                .qb-block {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }

                @media (max-width: 991px) {
                    .qb-block { grid-template-columns: 1fr; gap: 40px; }
                    .qb-block--reverse { direction: ltr; }
                    .qb-block--reverse .qb-text-content { order: 2; }
                    .qb-block--reverse .qb-media-content { order: 1; }
                }

                .qb-media-wrapper {
                    position: relative;
                    padding: 10px; /* Space for outside corners */
                }

                .qb-media-content {
                    position: relative;
                    border-radius: 0;
                    overflow: hidden;
                    aspect-ratio: 16 / 10;
                    background: #f8f8f8;
                    width: 100%;
                }

                /* Focus Corners - Positioned outside */
                .qb-focus-corner {
                    position: absolute;
                    width: 25px;
                    height: 25px;
                    z-index: 10;
                    pointer-events: none;
                }

                .qb-focus-corner--tl { top: 0; left: 0; border-top: 2px solid #b9a16b; border-left: 2px solid #b9a16b; }
                .qb-focus-corner--tr { top: 0; right: 0; border-top: 2px solid #b9a16b; border-right: 2px solid #b9a16b; }
                .qb-focus-corner--bl { bottom: 0; left: 0; border-bottom: 2px solid #b9a16b; border-left: 2px solid #b9a16b; }
                .qb-focus-corner--br { bottom: 0; right: 0; border-bottom: 2px solid #b9a16b; border-right: 2px solid #b9a16b; }

                .qb-text-content {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .qb-tagline {
                    font-size: 0.7rem;
                    letter-spacing: 5px;
                    color: #b9a16b;
                    text-transform: uppercase;
                    font-weight: 600;
                }

                .qb-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2.2rem, 4vw, 3.2rem);
                    color: #1a1a1a;
                    line-height: 1.1;
                    margin: 0;
                    font-weight: 400;
                }

                .qb-description {
                    font-size: 1rem;
                    color: rgba(0,0,0,0.7);
                    line-height: 1.8;
                    font-weight: 300;
                }

                .qb-cta-wrap {
                    margin-top: 10px;
                }

                .qb-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 32px;
                    border: 1px solid #1a1a1a;
                    border-radius: 0;
                    color: #1a1a1a;
                    font-size: 0.75rem;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    text-decoration: none;
                    transition: all 0.4s ease;
                    background: transparent;
                }

                .qb-cta:hover {
                    background: #1a1a1a;
                    color: #ffffff;
                    transform: translateY(-2px);
                }

                /* ── Features Row ── */
                .qb-features {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }

                .qb-feat-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #b9a16b;
                }

                .qb-feat-item span {
                    font-size: 0.75rem;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    font-weight: 500;
                }

                /* ── Decorations Removed ── */

                /* ═══════════════════════════════════════════════════════════════════
                   QUALITY BOUTIQUE - LAPTOP COMPACT STYLING (992px to 1536px)
                   ═══════════════════════════════════════════════════════════════════ */

                @media (min-width: 992px) and (max-width: 1536px) {
                    .qb-section {
                        padding: 50px 0 !important;
                    }
                    .qb-container {
                        max-width: 1240px !important;
                        padding: 0 20px !important;
                    }
                    .qb-frame {
                        padding: 15px 0 !important;
                        gap: 60px !important;
                    }
                    .qb-block {
                        gap: 40px !important;
                    }
                    .qb-text-content {
                        gap: 12px !important;
                    }
                    .qb-tagline {
                        font-size: 0.62rem !important;
                        letter-spacing: 3.5px !important;
                    }
                    .qb-title {
                        font-size: clamp(1.6rem, 2.5vw, 2.2rem) !important;
                        line-height: 1.15 !important;
                    }
                    .qb-description {
                        font-size: 0.85rem !important;
                        line-height: 1.55 !important;
                    }
                    .qb-cta-wrap {
                        margin-top: 6px !important;
                    }
                    .qb-cta {
                        padding: 10px 24px !important;
                        font-size: 0.68rem !important;
                        letter-spacing: 1.5px !important;
                        gap: 8px !important;
                    }
                    .qb-feat-item {
                        gap: 8px !important;
                    }
                    .qb-feat-item span {
                        font-size: 0.7rem !important;
                    }
                    .qb-focus-corner {
                        width: 20px !important;
                        height: 20px !important;
                    }
                }

                /* Mid-size laptops (≤1366px) */
                @media (min-width: 992px) and (max-width: 1366px) {
                    .qb-section {
                        padding: 40px 0 !important;
                    }
                    .qb-frame {
                        gap: 45px !important;
                    }
                    .qb-block {
                        gap: 35px !important;
                    }
                    .qb-title {
                        font-size: clamp(1.45rem, 2.2vw, 1.9rem) !important;
                    }
                    .qb-description {
                        font-size: 0.8rem !important;
                        line-height: 1.5 !important;
                    }
                }

                /* Smaller laptops (≤1200px) */
                @media (min-width: 992px) and (max-width: 1200px) {
                    .qb-section {
                        padding: 35px 0 !important;
                    }
                    .qb-frame {
                        gap: 35px !important;
                    }
                    .qb-block {
                        gap: 28px !important;
                    }
                    .qb-title {
                        font-size: clamp(1.35rem, 2vw, 1.75rem) !important;
                    }
                    .qb-description {
                        font-size: 0.78rem !important;
                    }
                    .qb-cta {
                        padding: 8px 20px !important;
                        font-size: 0.64rem !important;
                    }
                }

                /* RTL Specifics */
                [dir='rtl'] .qb-tagline { 
                    letter-spacing: 0 !important;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                [dir='rtl'] .qb-title {
                    line-height: 1.3 !important;
                    font-size: clamp(2rem, 5vw, 3.5rem) !important;
                }
                [dir='rtl'] .qb-description {
                    line-height: 1.8 !important;
                    font-size: 1.1rem;
                }
                [dir='rtl'] .qb-cta { 
                    letter-spacing: 0 !important;
                    font-size: 0.95rem;
                }
                [dir='rtl'] .qb-feat-item span {
                    letter-spacing: 0 !important;
                    font-size: 0.85rem;
                }
                @media (min-width: 992px) and (max-width: 1536px) {
                    [dir='rtl'] .qb-title {
                        font-size: clamp(1.5rem, 2.6vw, 2.2rem) !important;
                    }
                    [dir='rtl'] .qb-description {
                        font-size: 0.92rem !important;
                        line-height: 1.6 !important;
                    }
                }
            `}</style>

            <div className="qb-container">
                <div className="qb-frame">
                    {/* Block 1: Quality & Expertise */}
                    <motion.div 
                        className="qb-block"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="qb-media-wrapper">
                            <span className="qb-focus-corner qb-focus-corner--tl" />
                            <span className="qb-focus-corner qb-focus-corner--tr" />
                            <span className="qb-focus-corner qb-focus-corner--bl" />
                            <span className="qb-focus-corner qb-focus-corner--br" />
                            <div className="qb-media-content">
                                <VideoPanel 
                                    src="/assets/videos/production.mp4"
                                    section="hundred"
                                />
                            </div>
                        </div>
                        <div className="qb-text-content">
                            <span className="qb-tagline">{t("Quality Crafted Through Expertise 20 plus Years of Mastery")}</span>
                            <h2 className="qb-title">
                                {t("Celebrating 20 Years of Fragrant Excellence")}
                            </h2>
                            <p className="qb-description">
                                {t("For over 20 years Ahmed Al Maghribi Perfumes has been dedicated to creating luxurious timeless scents Using only the finest natural ingredients we ensure every fragrance is crafted with precision and excellence offering lasting quality")}
                            </p>
                            <div className="qb-feat-item">
                                <PiCertificateLight size={24} color="#b9a16b" />
                                <span>{t("Heritage of Excellence")}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Block 2: Boutique Experience */}
                    <motion.div 
                        className="qb-block qb-block--reverse"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="qb-text-content">
                            <span className="qb-tagline">{t("Ancient Aromas")}</span>
                            <h2 className="qb-title">
                                {t("A gracious invitation to experience our boutique")}
                            </h2>
                            <p className="qb-description">
                                {t("Steps")}
                            </p>
                            <div className="qb-cta-wrap">
                                <Link href={`/${locale}/store-locator`} className="qb-cta">
                                    <PiMapPinLight size={18} />
                                    {t("Find a store")}
                                </Link>
                            </div>
                        </div>
                        <div className="qb-media-wrapper">
                            <span className="qb-focus-corner qb-focus-corner--tl" />
                            <span className="qb-focus-corner qb-focus-corner--tr" />
                            <span className="qb-focus-corner qb-focus-corner--bl" />
                            <span className="qb-focus-corner qb-focus-corner--br" />
                            <div className="qb-media-content">
                                <Image 
                                    src="/assets/images/home/demo8/Shop2.jpg"
                                    alt={t("A gracious invitation to experience our boutique")}
                                    fill
                                    sizes="(max-width: 991px) 100vw, 50vw"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Final Features / Trust Badges */}
                 
                </div>
            </div>
        </section>
    );
};

export default QualityBoutiqueSection;
