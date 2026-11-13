"use client";
import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { PiGiftLight, PiSparkleLight, PiHeartLight } from "react-icons/pi";

const GiftSetBanner = () => {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <section className="gsb-section">
            <style jsx global>{`
                /* ═══════════════════════════════════════
                   GIFT SET BANNER SECTION
                   ═══════════════════════════════════════ */
                .gsb-section {
                    position: relative;
                    width: 100%;
                    background: #0a0806;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                }

                /* ── Background ── */
                .gsb-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }

                /* Desktop / mobile artwork swap */
                .gsb-img--desktop { object-fit: cover; object-position: 50% 0%; }
                .gsb-img--mobile { object-fit: cover; object-position: 50% 100%; display: none !important; }
                @media (max-width: 768px) {
                    .gsb-img--desktop { display: none !important; }
                    .gsb-img--mobile { display: block !important; }
                }

                /* Soft warm veil on the empty wall area only — keeps products untouched */
                .gsb-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 42% 48% at 14% 14%, rgba(250,236,214,0.38) 0%, rgba(250,236,214,0.12) 60%, transparent 100%),
                        linear-gradient(to bottom, rgba(60,40,20,0.10) 0%, transparent 25%);
                    z-index: 1;
                }
                @media (max-width: 768px) {
                    .gsb-bg::after {
                        background:
                            radial-gradient(ellipse 90% 34% at 50% 18%, rgba(250,236,214,0.40) 0%, rgba(250,236,214,0.10) 70%, transparent 100%),
                            linear-gradient(to top, rgba(60,40,20,0.22) 0%, transparent 22%);
                    }
                }

                /* ── Border Frame ── */
                .gsb-frame {
                    position: relative;
                    z-index: 2;
                    margin: 44px 24px 24px;
                    border: 1px solid rgba(255,248,235,0.55);
                    border-top-color: transparent;
                    border-radius: 6px;
                    min-height: calc(100vh - 68px);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                }
                .gsb-frame::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: 6px;
                    width: calc(50% - 130px);
                    height: 1px;
                    background: rgba(255,248,235,0.55);
                }
                .gsb-frame::after {
                    content: '';
                    position: absolute;
                    top: -1px; right: 6px;
                    width: calc(50% - 130px);
                    height: 1px;
                    background: rgba(255,248,235,0.55);
                }

                @media (max-width: 768px) {
                    .gsb-frame {
                        margin: 32px 12px 12px;
                        min-height: max(620px, calc(100svh - 80px));
                        align-items: center;
                    }
                    .gsb-frame::before, .gsb-frame::after { width: calc(50% - 90px); }
                }

                /* Inner frame line */
                .gsb-frame-inner {
                    position: absolute;
                    inset: 6px;
                    border: 1px solid rgba(255,248,235,0.25);
                    border-top-color: transparent;
                    border-radius: 3px;
                    pointer-events: none;
                }
                .gsb-frame-inner::before {
                    content: '';
                    position: absolute;
                    top: -1px; left: 3px;
                    width: calc(50% - 124px);
                    height: 1px;
                    background: rgba(255,248,235,0.25);
                }
                .gsb-frame-inner::after {
                    content: '';
                    position: absolute;
                    top: -1px; right: 3px;
                    width: calc(50% - 124px);
                    height: 1px;
                    background: rgba(255,248,235,0.25);
                }

                @media (max-width: 768px) {
                    .gsb-frame-inner { inset: 4px; }
                    .gsb-frame-inner::before, .gsb-frame-inner::after { width: calc(50% - 86px); }
                }

                /* ── Logo ── */
                .gsb-logo-wrap {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .gsb-logo-wrap img {
                    height: 80px;
                    width: auto;
                    object-fit: contain;
                }
                @media (max-width: 768px) {
                    .gsb-logo-wrap img { height: 55px; }
                }

                /* ── Corner Accents ── */
                .gsb-corner {
                    position: absolute;
                    width: 28px;
                    height: 28px;
                    z-index: 4;
                }

                .gsb-corner--tl { top: -1px; left: -1px; }
                .gsb-corner--tr { top: -1px; right: -1px; transform: scaleX(-1); }
                .gsb-corner--bl { bottom: -1px; left: -1px; transform: scaleY(-1); }
                .gsb-corner--br { bottom: -1px; right: -1px; transform: scale(-1); }

                @media (max-width: 576px) {
                    .gsb-corner { width: 22px; height: 22px; }
                }

                /* ── Center Content ── */
                /* Text sits on the empty wall: top-left on desktop, top-centre on mobile */
                .gsb-center {
                    position: relative;
                    z-index: 3;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                    padding: 56px 40px 0 clamp(32px, 4.5vw, 72px);
                    max-width: 440px;
                }
                [dir='rtl'] .gsb-center { text-align: right; }

                @media (max-width: 768px) {
                    .gsb-center {
                        align-items: center;
                        text-align: center;
                        padding: 56px 24px 0;
                        max-width: 480px;
                    }
                    [dir='rtl'] .gsb-center { text-align: center; }
                }

                /* Decorative horizontal lines flanking the tagline */
                .gsb-tagline-wrap {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 16px;
                }

                .gsb-tagline-line {
                    width: 36px;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #7a5a22);
                }

                .gsb-tagline-line--r {
                    background: linear-gradient(to left, transparent, #7a5a22);
                }
                @media (min-width: 769px) {
                    .gsb-tagline-line:not(.gsb-tagline-line--r) { display: none; }
                }

                .gsb-tagline {
                    font-size: 0.62rem;
                    letter-spacing: 6px;
                    color: #6b4c1a;
                    text-transform: uppercase;
                    font-weight: 600;
                }

                .gsb-heading {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 3.4vw, 3.1rem);
                    font-weight: 400;
                    color: #2b1d10;
                    line-height: 1.1;
                    letter-spacing: 1px;
                    margin: 0 0 14px;
                    text-shadow: 0 1px 14px rgba(250,236,214,0.55);
                }

                .gsb-heading em {
                    font-style: italic;
                    color: #8a5f17;
                }

                /* Diamond ornament */
                .gsb-diamond-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 18px;
                }
                @media (min-width: 769px) {
                    /* desktop wall area is short — drop the ornament and description */
                    .gsb-diamond-row, .gsb-description { display: none !important; }
                    .gsb-heading { margin-bottom: 22px; }
                }

                .gsb-diamond-row__line {
                    width: 35px;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(122,90,34,0.6));
                }

                .gsb-diamond-row__line--r {
                    background: linear-gradient(to left, transparent, rgba(122,90,34,0.6));
                }

                .gsb-diamond-row__gem {
                    width: 6px;
                    height: 6px;
                    background: #8a5f17;
                    transform: rotate(45deg);
                    opacity: 0.9;
                }

                .gsb-description {
                    font-size: 0.86rem;
                    color: rgba(43,29,16,0.82);
                    line-height: 1.65;
                    margin: 0 0 22px;
                    max-width: 380px;
                    font-weight: 400;
                }

                /* ── CTA ── */
                .gsb-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 32px;
                    min-height: 44px;
                    border: 1.5px solid #2b1d10;
                    border-radius: 50px;
                    background: #2b1d10;
                    color: #f8efe0;
                    font-size: 0.64rem;
                    letter-spacing: 3px;
                    font-weight: 600;
                    text-transform: uppercase;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .gsb-cta:hover {
                    background: transparent;
                    color: #2b1d10;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(43,29,16,0.18);
                }
                .gsb-cta:focus-visible { outline: 2px solid #8a5f17; outline-offset: 3px; }

                .gsb-cta svg {
                    transition: transform 0.4s ease;
                }

                .gsb-cta:hover svg {
                    transform: translateX(4px);
                }

                /* ═══════════════════════════════════════
                   BOTTOM FEATURES
                   ═══════════════════════════════════════ */
                .gsb-bottom {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    z-index: 3;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    padding: 0 24px 32px;
                }

                @media (max-width: 768px) {
                    .gsb-bottom { padding: 0 14px 24px; }
                }

                .gsb-features {
                    display: flex;
                    align-items: stretch;
                    border: 1px solid rgba(255,248,235,0.6);
                    border-radius: 10px;
                    background: rgba(255,248,236,0.5);
                    box-shadow: 0 8px 30px rgba(60,40,20,0.15);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    overflow: hidden;
                    max-width: 520px;
                    width: 100%;
                }

                .gsb-feat {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 14px 12px;
                }

                .gsb-feat-divider {
                    width: 1px;
                    align-self: stretch;
                    background: linear-gradient(to bottom, transparent 10%, rgba(122,90,34,0.35) 50%, transparent 90%);
                    flex-shrink: 0;
                }

                .gsb-feat__icon {
                    flex-shrink: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .gsb-feat__icon svg {
                }

                .gsb-feat__label {
                    font-size: 0.58rem;
                    letter-spacing: 1px;
                    font-weight: 600;
                    color: #2b1d10;
                    text-transform: uppercase;
                    line-height: 1.4;
                }

                @media (max-width: 640px) {
                    .gsb-features {
                        flex-direction: row;
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                        max-width: 320px;
                        margin: 0 auto;
                    }
                    .gsb-features::-webkit-scrollbar {
                        display: none;
                    }
                    .gsb-feat {
                        flex: 1 1 0;
                        min-width: 70px;
                        padding: 12px 4px;
                        flex-direction: column;
                        justify-content: flex-start;
                        text-align: center;
                        gap: 6px;
                    }
                    .gsb-feat-divider {
                        display: none;
                    }
                    .gsb-feat__icon {
                        width: 24px;
                        height: 24px;
                    }
                    .gsb-feat__label {
                        font-size: 0.48rem;
                        line-height: 1.3;
                    }
                }

                /* ── Vertical Side Text ── */
                .gsb-side-text {
                    position: absolute;
                    right: 28px;
                    top: 50%;
                    transform: translateY(-50%) rotate(90deg);
                    transform-origin: center center;
                    z-index: 5;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    white-space: nowrap;
                }

                .gsb-side-text span {
                    font-size: 0.55rem;
                    letter-spacing: 5px;
                    color: rgba(255,248,235,0.85);
                    text-shadow: 0 1px 6px rgba(60,40,20,0.45);
                    text-transform: uppercase;
                    font-weight: 500;
                }

                .gsb-side-text .gsb-side-dot {
                    width: 3px;
                    height: 3px;
                    background: #fff8eb;
                    border-radius: 50%;
                    opacity: 0.8;
                }

                @media (max-width: 991px) {
                    .gsb-side-text { display: none; }
                }

                /* RTL TYPOGRAPHY IMPROVEMENTS */
                [dir='rtl'] .gsb-tagline,
                [dir='rtl'] .gsb-side-text span,
                [dir='rtl'] .gsb-feat__label {
                    letter-spacing: 0 !important;
                    font-size: 0.9rem !important;
                    font-weight: 500 !important;
                }
                [dir='rtl'] .gsb-heading {
                    line-height: 1.3 !important;
                    letter-spacing: 0 !important;
                    font-size: clamp(2.2rem, 5vw, 3.8rem) !important;
                }
                [dir='rtl'] .gsb-description {
                    line-height: 1.8 !important;
                    font-size: 1.05rem !important;
                    max-width: 480px !important;
                }
                [dir='rtl'] .gsb-cta {
                    letter-spacing: 0 !important;
                    font-size: 0.9rem !important;
                }
            `}</style>

            {/* Background */}
            <div className="gsb-bg">
                <Image
                    className="gsb-img--desktop"
                    src="/assets/images/home/demo8/avif/gift_Set.avif"
                    alt="Premium Gift Sets Collection"
                    loading="lazy"
                    fill
                    sizes="100vw"
                />
                <Image
                    className="gsb-img--mobile"
                    src="/assets/images/home/demo8/avif/giftSetMobile.avif"
                    alt="Premium Gift Sets Collection"
                    loading="lazy"
                    fill
                    sizes="100vw"
                />
            </div>

            {/* Border Frame */}
            <div className="gsb-frame">
                <div className="gsb-frame-inner" />

                {/* ── Logo ── */}
                <div className="gsb-logo-wrap">
                    <Image src="/assets/images/AhmedLogo.png" alt="Ahmed Perfumes" width={120} height={80} style={{ objectFit: "contain" }} loading="lazy" />
                </div>

                {/* Corner ornaments */}
                {['tl', 'tr', 'bl', 'br'].map((pos) => (
                    <div key={pos} className={`gsb-corner gsb-corner--${pos}`}>
                        <svg width="100%" height="100%" viewBox="0 0 28 28" fill="none">
                            <path d="M0 0h10v1H1v9H0z" fill="#fff8eb" opacity="0.85" />
                            <rect x="3.5" y="3.5" width="3" height="3" rx="0.3" transform="rotate(45 5 5)" fill="none" stroke="#fff8eb" strokeWidth="0.7" opacity="0.6" />
                        </svg>
                    </div>
                ))}

                {/* Side text */}
                <div className="gsb-side-text">
                    <span>{t("Elegance")}</span>
                    <div className="gsb-side-dot" />
                    <span>{t("Craftsmanship")}</span>
                    <div className="gsb-side-dot" />
                    <span>{t("Luxury")}</span>
                </div>

                {/* Center Content */}
                <div className="gsb-center">
                    <motion.div
                        className="gsb-tagline-wrap"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="gsb-tagline-line" />
                        <span className="gsb-tagline">{t("Curated Collections")}</span>
                        <div className="gsb-tagline-line gsb-tagline-line--r" />
                    </motion.div>

                    <motion.h2
                        className="gsb-heading"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {t("The Art of")}<br />
                        <em>{t("Gifting")}</em>
                    </motion.h2>

                    <motion.div
                        className="gsb-diamond-row"
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                    >
                        <div className="gsb-diamond-row__line" />
                        <div className="gsb-diamond-row__gem" />
                        <div className="gsb-diamond-row__line gsb-diamond-row__line--r" />
                    </motion.div>

                    <motion.p
                        className="gsb-description"
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        {t("Discover our handpicked gift sets beautifully presented and crafted to leave a lasting impression on every occasion")}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Link href={`/${locale}/product-category/gift-sets`} className="gsb-cta">
                            {t("Explore Gift Sets")}
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>

                {/* Bottom Features */}
                <div className="gsb-bottom">
                    <motion.div
                        className="gsb-features"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                    >
                        <div className="gsb-feat">
                            <div className="gsb-feat__icon">
                                <PiGiftLight size={20} color="#8a5f17" />
                            </div>
                            <div className="gsb-feat__label">
                                {t("Premium")}<br />{t("Packaging")}
                            </div>
                        </div>

                        <div className="gsb-feat-divider" />

                        <div className="gsb-feat">
                            <div className="gsb-feat__icon">
                                <PiSparkleLight size={20} color="#8a5f17" />
                            </div>
                            <div className="gsb-feat__label">
                                {t("Luxury")}<br />{t("Selection")}
                            </div>
                        </div>

                        <div className="gsb-feat-divider" />

                        <div className="gsb-feat">
                            <div className="gsb-feat__icon">
                                <PiHeartLight size={20} color="#8a5f17" />
                            </div>
                            <div className="gsb-feat__label">
                                {t("Made with")}<br />{t("Love")}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default GiftSetBanner;
