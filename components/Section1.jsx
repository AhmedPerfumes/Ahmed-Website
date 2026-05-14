"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { PiLeafLight, PiFireLight, PiMosqueLight, PiDiamondLight } from "react-icons/pi";
import { motion } from "framer-motion";

const DakhoonSection = () => {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <section className="dk-section">

            {/* ── Background Image ── */}
            <div className="dk-bg">
                <Image
                    src="/assets/images/home/demo8/avif/dakhoon-bnr.avif"
                    alt="Arabic Dakhoon Collection"
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            {/* ── Outer Border Frame ── */}
            <div className="dk-border-frame">
                {/* Inner border */}
                <div className="dk-inner-frame" />

                {/* ── Logo ── */}
                <div className="dk-logo-wrap">
                    <Image src="/assets/images/AhmedLogo.png" alt="Ahmed Perfumes" width={120} height={40} style={{ objectFit: 'contain' }} />
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
                            {t("Experience the heritage of Arabic Dakhoon made from natural ingredients Enjoy rich longlasting aromas that bring warmth and tradition to your home")}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <Link href={`/${locale}/product-category/dakhoon`} className="dk-cta">
                                {t("Shop Now")}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Bottom Area ── */}
                {/* <div className="dk-bottom">
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
                                {t("Arabic")}<br />{t("Heritage")}
                            </div>
                        </div>
                    </motion.div>
                </div> */}
            </div>
        </section>
    );
};

export default DakhoonSection;
