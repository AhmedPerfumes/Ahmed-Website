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
                            <Link href={`/${locale}/shop`} className="bs-cta">
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
