
import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { PiGiftLight, PiFlowerLotusLight, PiStarLight, PiHeartLight } from "react-icons/pi";


// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";



const GIFT_SETS = [
    {
        id: 1,
        title: "Antee Gift Set",
        desc: "A perfect introduction to timeless elegance",
        thumbnail: "/assets/videos/giftsets/thumbnails/antee.jpg",
        video: "/assets/videos/giftsets/antee.mp4",
        link: "/shop/gift-sets/antee-05-gift-set",
        bg: "#e8e4df",
    },
    {
        id: 2,
        title: "The Dukhoon Collection",
        desc: "A rich tribute to heritage and sophistication",
        thumbnail: "/assets/videos/giftsets/thumbnails/dukhoon-collection.jpg",
        video: "/assets/videos/giftsets/dakhoon-collection.mp4",
        link: "/shop/gift-sets/the-dakhoon-collection",
        bg: "#ddd5ca",
    },
    {
        id: 3,
        title: "Ihdaa Khaas Gift Set",
        desc: "Where opulence meets modern refinement",
        thumbnail: "/assets/videos/giftsets/thumbnails/ihda-khas.jpg",
        video: "/assets/videos/giftsets/ihdakhas.mp4",
        link: "/shop/gift-sets/ihdaa-khaas-gift-set",
        bg: "#d5cfe6",
    },
    {
        id: 4,
        title: "Oud & Roses Gift Set",
        desc: "The essence of romance in every detail",
        thumbnail: "/assets/videos/giftsets/thumbnails/oud-roses-giftset.jpg",
        video: "/assets/videos/giftsets/oud-and-roses-giftset.mp4",
        link: "/shop/gift-sets/oud-roses-gift-set",
        bg: "#f0e8e0",
    },
    {
        id: 5,
        title: "Shauque Al Shuyookh",
        desc: "Unveiling the art of fine perfumery",
        thumbnail: "/assets/videos/giftsets/thumbnails/shauque-al-shuyookh.jpg",
        video: "/assets/videos/giftsets/shaquealsheukh-giftset.mp4",
        link: "/shop/gift-sets/shauque-al-shuyookh",
        bg: "#e0d2c0",
    },
];


function GiftCard({ item, index, locale }) {
    const t = useTranslations();
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className="gs-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="gs-card__media" style={{ backgroundColor: item.bg }}>
                <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1100px) 100vw, 260px"
                    className={`gs-card__thumb ${isHovered ? "gs-card__thumb--hidden" : ""}`}
                    style={{ objectFit: "cover" }}
                />
                <video
                    ref={videoRef}
                    src={item.video}
                    muted
                    playsInline
                    loop
                    preload="none"
                    className={`gs-card__video ${isHovered ? "gs-card__video--visible" : ""}`}
                />
            </div>
            <div className="gs-card__info">
                <h3 className="gs-card__title">{t(item.title)}</h3>
                <p className="gs-card__desc">{t(item.desc)}</p>
                <Link href={`/${locale}${item.link}`} className="gs-card__link">
                    {t("Shop Now")} <span className="gs-card__arrow">→</span>
                </Link>
            </div>
        </div>
    );
}

const NewGiftSection = () => {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <div className="gs-wrapper" style={{ position: "relative" }}>
            {/* ═══════════════════════════════════════
                SECTION 1: GIFT CARDS GRID
                ═══════════════════════════════════════ */}
            <section className="gs-section">
                <style jsx global>{`
                    /* ═══════════════════════════════
                       GIFT SECTION — MASTER STYLES
                       ═══════════════════════════════ */
                    .gs-section {
                        background: #edeae4;
                        padding: 80px 0 60px;
                        overflow: hidden;
                        font-family: 'Inter', sans-serif;
                        position: sticky;
                        top: 80px;
                        z-index: 1;
                    }

                    @media (max-width: 768px) {
                        .gs-section { padding: 50px 0 40px; }
                    }

                    /* ── HEADER ── */
                    .gs-header {
                        text-align: center;
                        max-width: 700px;
                        margin: 0 auto 30px;
                        padding: 0 20px;
                    }

                    .gs-header__tagline {
                        font-size: 0.65rem;
                        letter-spacing: 5px;
                        color: #8a7a5e;
                        font-weight: 600;
                        text-transform: uppercase;
                        margin-bottom: 18px;
                        display: block;
                    }

                    .gs-header__title {
                        font-family: 'Playfair Display', serif;
                        font-size: clamp(1.8rem, 3.5vw, 3.2rem);
                        font-weight: 400;
                        color: #1D1B19;
                        letter-spacing: 3px;
                        margin: 0 0 24px;
                        line-height: 1.1;
                        text-transform: uppercase;
                    }

                    .gs-header__subtitle {
                        font-size: 1.1rem;
                        color: #6b6258;
                        line-height: 1.75;
                        font-weight: 400;
                        max-width: 520px;
                        margin: 0 auto;
                    }

                    /* ── CARD GRID / SLIDER ── */
                    .gs-grid-container {
                        max-width: 1340px;
                        margin: 0 auto;
                        padding: 0 30px;
                        position: relative;
                    }

                    @media (max-width: 991px) {
                        .gs-grid-container { padding: 0 15px; }
                    }

                    .gs-grid {
                        display: flex;
                        gap: 20px;
                        justify-content: center;
                    }

                    @media (max-width: 1100px) {
                        .gs-grid { display: none; } /* Use swiper for smaller screens */
                    }

                    .gs-swiper {
                        display: none;
                        width: 100%;
                        padding-bottom: 30px !important;
                    }

                    @media (max-width: 1100px) {
                        .gs-swiper { display: block; }
                    }

                    /* Slider Nav */
                    .gs-nav-btn {
                        position: absolute;
                        top: 40%;
                        transform: translateY(-50%);
                        width: 44px;
                        height: 44px;
                        background: #fff;
                        border: 1px solid #d0c5b0;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #8a7a5e;
                        z-index: 10;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    }

                    .gs-nav-btn:hover {
                        background: #b9a16b;
                        color: #fff;
                        border-color: #b9a16b;
                    }

                    .gs-nav-btn--prev { left: 0px; }
                    .gs-nav-btn--next { right: 0px; }

                    .gs-nav-btn.swiper-button-disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                    }

                    @media (max-width: 991px) {
                        .gs-nav-btn { display: none; } /* Hide arrows on small mobile, use touch */
                    }

                    /* ── CARD ── */
                    .gs-card {
                        flex: 1;
                        min-width: 200px;
                        max-width: 260px;
                        background: transparent;
                        cursor: pointer;
                        transition: transform 0.4s ease;
                        height: 100%;
                    }

                    @media (max-width: 1100px) {
                        .gs-card {
                            max-width: 100%;
                            min-width: unset;
                        }
                    }

                    .gs-card:hover { transform: translateY(-5px); }

                    .gs-card__media {
                        position: relative;
                        width: 100%;
                        aspect-ratio: 4/5;
                        border-radius: 12px;
                        overflow: hidden;
                        margin-bottom: 16px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                    }

                    .gs-card__thumb,
                    .gs-card__video {
                        position: absolute;
                        top: 0; left: 0;
                        width: 100%; height: 100%;
                        object-fit: cover;
                        transition: opacity 0.6s ease;
                    }

                    .gs-card__thumb { opacity: 1; z-index: 2; }
                    .gs-card__thumb--hidden { opacity: 0; }
                    .gs-card__video { opacity: 0; z-index: 1; }
                    .gs-card__video--visible { opacity: 1; }

                    .gs-card__info { padding: 0 2px; }

                    .gs-card__title {
                        font-size: 0.95rem;
                        font-weight: 700;
                        letter-spacing: 1.5px;
                        color: #1D1B19;
                        margin: 0 0 8px;
                        text-transform: uppercase;
                    }

                    .gs-card__desc {
                        font-size: 0.92rem;
                        color: #6b6258;
                        line-height: 1.6;
                        margin: 0 0 14px;
                        font-weight: 400;
                    }

                    .gs-card__link {
                        font-size: 0.82rem;
                        letter-spacing: 2px;
                        font-weight: 700;
                        color: #8a7a5e;
                        text-decoration: none;
                        text-transform: uppercase;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        transition: color 0.3s, gap 0.3s;
                    }

                    .gs-card__link:hover { color: #1D1B19; gap: 10px; }

                    .gs-card__arrow {
                        font-size: 0.9rem;
                        transition: transform 0.3s;
                    }

                    .gs-card__link:hover .gs-card__arrow { transform: translateX(3px); }

                    /* ═══════════════════════════════
                       SECTION 2: BANNERS + FEATURES BOX
                       ═══════════════════════════════ */
                    .gs-bottom-section {
                        background: #edeae4;
                        padding: 0 0 70px;
                        font-family: 'Inter', sans-serif;
                        position: relative;
                        z-index: 2;
                    }

                    @media (max-width: 768px) {
                        .gs-bottom-section { padding: 0 0 45px; }
                    }

                    /* ── DIVIDER ── */
                    .gs-divider {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                        margin: 0 auto;
                        padding: 50px 30px 45px;
                        max-width: 750px;
                    }

                    .gs-divider__line {
                        flex: 1;
                        height: 1px;
                        background: #c5b89a;
                    }

                    .gs-divider__center {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 12px;
                    }

                    .gs-divider__icon-wrap {
                        color: #a49070;
                    }

                    .gs-divider__text {
                        font-size: 0.65rem;
                        letter-spacing: 5px;
                        color: #8a7a5e;
                        font-weight: 600;
                        text-transform: uppercase;
                        white-space: nowrap;
                    }

                    @media (max-width: 576px) {
                        .gs-divider__text { font-size: 0.5rem; letter-spacing: 3px; }
                        .gs-divider { padding: 35px 20px 30px; gap: 12px; }
                    }

                    /* ── ELEVATED WRAPPER ── */
                    .gs-elevated-box {
                        max-width: 1300px;
                        margin: 0 auto;
                        padding: 0 30px;
                    }

                    @media (max-width: 768px) {
                        .gs-elevated-box { padding: 0 16px; }
                    }

                    .gs-elevated-box__inner {
                        background: #e8e4dd;
                        border-radius: 18px;
                        box-shadow: 0 6px 40px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04);
                        overflow: hidden;
                    }

                    /* ── BANNERS ── */
                    .gs-banners {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 22px;
                        padding: 22px 22px 0;
                    }

                    @media (max-width: 768px) {
                        .gs-banners {
                            grid-template-columns: 1fr;
                            gap: 14px;
                            padding: 14px 14px 0;
                        }
                    }

                    .gs-banner {
                        position: relative;
                        border-radius: 12px;
                        overflow: hidden;
                        aspect-ratio: 16/10;
                        cursor: pointer;
                        display: block;
                        text-decoration: none;
                    }

                    .gs-banner::after {
                        content: '';
                        position: absolute;
                        inset: 0;
                        z-index: 1;
                    }

                    .gs-banner--left::after {
                        background: linear-gradient(110deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 55%, transparent 100%);
                    }

                    .gs-banner--right::after {
                        background: linear-gradient(250deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 55%, transparent 100%);
                    }

                    .gs-banner img {
                        width: 100%; height: 100%;
                        object-fit: cover;
                        transition: transform 0.8s ease;
                    }

                    .gs-banner:hover img { transform: scale(1.05); }

                    .gs-banner__content {
                        position: absolute;
                        z-index: 2;
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        max-width: 220px;
                    }

                    .gs-banner--left .gs-banner__content {
                        bottom: 28px;
                        left: 28px;
                    }

                    .gs-banner--right .gs-banner__content {
                        bottom: 28px;
                        right: 28px;
                        align-items: flex-end;
                        text-align: right;
                    }

                    @media (max-width: 576px) {
                        .gs-banner--left .gs-banner__content { bottom: 18px; left: 18px; }
                        .gs-banner--right .gs-banner__content { bottom: 18px; right: 18px; }
                    }

                    .gs-banner__small {
                        font-size: 0.65rem;
                        letter-spacing: 3px;
                        color: rgba(255,255,255,0.85);
                        font-weight: 600;
                        text-transform: uppercase;
                    }

                    .gs-banner__big {
                        font-family: 'Playfair Display', serif;
                        font-size: clamp(1.4rem, 2.8vw, 1.8rem);
                        font-weight: 700;
                        color: #fff;
                        line-height: 1.15;
                        letter-spacing: 1.5px;
                        text-transform: uppercase;
                    }

                    .gs-banner__desc {
                        font-size: 0.78rem;
                        color: rgba(255,255,255,0.8);
                        line-height: 1.45;
                        font-style: italic;
                        margin: 4px 0 10px;
                    }

                    .gs-banner__btn {
                        display: inline-block;
                        padding: 10px 24px;
                        color: #fff;
                        font-size: 0.65rem;
                        letter-spacing: 2px;
                        font-weight: 700;
                        text-transform: uppercase;
                        text-decoration: none;
                        border: 1.5px solid #b9a16b;
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(4px);
                        cursor: pointer;
                        transition: all 0.4s ease;
                        border-radius: 50px;
                        width: fit-content;
                    }

                    .gs-banner__btn:hover {
                        background: #b9a16b;
                        color: #fff;
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(185, 161, 107, 0.3);
                        letter-spacing: 2.5px;
                    }

                    /* ── FEATURES INSIDE BOX ── */
                    .gs-features {
                        display: flex;
                        align-items: stretch;
                        padding: 0;
                        border-top: 1px solid rgba(0,0,0,0.06);
                        margin-top: 22px;
                    }

                    .gs-feature-item {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 14px;
                        padding: 32px 20px;
                    }

                    .gs-feature-divider {
                        width: 1px;
                        align-self: stretch;
                        background: linear-gradient(to bottom, transparent 15%, #b9a16b 50%, transparent 85%);
                        flex-shrink: 0;
                    }

                    .gs-feature__icon {
                        flex-shrink: 0;
                        width: 46px;
                        height: 46px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        background: transparent;
                    }

                    .gs-feature__text h4 {
                        font-size: 0.72rem;
                        font-weight: 700;
                        letter-spacing: 1px;
                        color: #1D1B19;
                        margin: 0 0 4px;
                        text-transform: uppercase;
                    }

                    .gs-feature__text p {
                        font-size: 0.78rem;
                        color: #6b6258;
                        margin: 0;
                        line-height: 1.45;
                    }

                    @media (max-width: 768px) {
                        .gs-features {
                            flex-wrap: nowrap;
                            overflow-x: auto;
                            -webkit-overflow-scrolling: touch;
                            scrollbar-width: none;
                        }
                        .gs-features::-webkit-scrollbar {
                            display: none;
                        }
                        .gs-feature-item {
                            flex: 1 1 0;
                            min-width: 140px;
                            padding: 24px 10px;
                            flex-direction: column;
                            justify-content: flex-start;
                            text-align: center;
                            gap: 12px;
                        }
                        .gs-feature-divider {
                            display: none;
                        }
                        .gs-feature__text h4 {
                            font-size: 0.65rem;
                            margin: 0 0 6px;
                        }
                    }

                    @media (max-width: 576px) {
                        .gs-feature-item {
                            min-width: 80px;
                            padding: 20px 4px;
                            gap: 8px;
                        }
                        .gs-feature__icon {
                            width: 36px;
                            height: 36px;
                        }
                        .gs-feature__text h4 {
                            font-size: 0.55rem;
                            letter-spacing: 0.5px;
                            margin: 0;
                            line-height: 1.3;
                        }
                        .gs-feature__text p {
                            display: none;
                        }
                    }
                `}</style>

                {/* ── HEADER ── */}
                <div className="gs-header">
                    <span className="gs-header__tagline">{t("Curated Luxury Timeless Gestures")}</span>
                    <h2 className="gs-header__title">{t("Gifts for Every")}</h2>
                    <p className="gs-header__subtitle">
                        {t("Delight your loved ones with our luxurious gift sets thoughtfully curated to include our most exquisite fragrances")}
                    </p>
                </div>

                {/* ── GIFT CARDS SLIDER ── */}
                <div className="gs-grid-container">
                    {/* Desktop View: Static Flex */}
                    <div className="gs-grid">
                        {GIFT_SETS.map((item, i) => (
                            <GiftCard key={item.id} item={item} index={i} locale={locale} />
                        ))}
                    </div>

                    {/* Tablet/Mobile View: Swiper */}
                    <div className="gs-swiper">
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={15}
                            slidesPerView={2}
                            navigation={{
                                prevEl: ".gs-nav-btn--prev",
                                nextEl: ".gs-nav-btn--next",
                            }}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 15 },
                                640: { slidesPerView: 2.5, spaceBetween: 20 },
                                991: { slidesPerView: 3, spaceBetween: 20 }
                            }}
                        >
                            {GIFT_SETS.map((item, i) => (
                                <SwiperSlide key={item.id}>
                                    <GiftCard item={item} index={i} locale={locale} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Arrows */}
                    <div className="gs-nav-btn gs-nav-btn--prev">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="gs-nav-btn gs-nav-btn--next">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                SECTION 2: DIVIDER + BANNERS + FEATURES (unified box)
                ═══════════════════════════════════════ */}
            <section className="gs-bottom-section">
                {/* ── DIVIDER ── */}
                <div className="gs-divider">
                    <div className="gs-divider__line" />
                    <div className="gs-divider__center">
                        <div className="gs-divider__icon-wrap">
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 4C11 1 6 1.5 6 5c0 2 2 3.5 4 4.5L13 11l3-1.5c2-1 4-2.5 4-4.5 0-3.5-5-4-7-1z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                                <rect x="4" y="11" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                <path d="M4 15h18" stroke="currentColor" strokeWidth="1.2"/>
                                <path d="M13 11v12" stroke="currentColor" strokeWidth="1.2"/>
                            </svg>
                        </div>
                        <span className="gs-divider__text">{t("The perfect gift for every occasion")}</span>
                    </div>
                    <div className="gs-divider__line" />
                </div>

                {/* ── ELEVATED BOX: Banners + Features ── */}
                <div className="gs-elevated-box">
                    <div className="gs-elevated-box__inner">
                        {/* Banners */}
                        <div className="gs-banners">
                            <Link href={`/${locale}/shop/gift-sets`} className="gs-banner gs-banner--left">
                                <Image src="/assets/images/campaigns/Azzo-Azzeez.jpg" alt="A Signature of Distinction" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                                <div className="gs-banner__content">
                                    <span className="gs-banner__small">{t("A Signature of")}</span>
                                    <span className="gs-banner__big">{t("Distinction")}</span>
                                    <span className="gs-banner__desc">{t("Celebrate lifes most memorable moments")}</span>
                                    <span className="gs-banner__btn">{t("Explore Gift Sets")}</span>
                                </div>
                            </Link>
                            <Link href={`/${locale}/shop/gift-sets`} className="gs-banner gs-banner--right">
                                <Image src="/assets/images/Antee-05-Giftset.jpg" alt="Beautifully Presented" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                                <div className="gs-banner__content">
                                    <span className="gs-banner__small">{t("Beautifully")}</span>
                                    <span className="gs-banner__big">{t("Presented")}</span>
                                    <span className="gs-banner__desc">{t("Thoughtfully packaged for a lasting impression")}</span>
                                    <span className="gs-banner__btn">{t("Explore Gift Sets")}</span>
                                </div>
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="gs-features">
                            {/* Premium Packaging */}
                            <div className="gs-feature-item">
                                <div className="gs-feature__icon">
                                    <PiGiftLight size={28} color="#b9a16b" />
                                </div>
                                <div className="gs-feature__text">
                                    <h4>{t("Premium Packaging")}</h4>
                                    <p>{t("Exquisite presentation for every gift")}</p>
                                </div>
                            </div>

                            <div className="gs-feature-divider" />

                            {/* Luxurious Fragrances */}
                            <div className="gs-feature-item">
                                <div className="gs-feature__icon">
                                    <PiFlowerLotusLight size={28} color="#b9a16b" />
                                </div>
                                <div className="gs-feature__text">
                                    <h4>{t("Luxurious Fragrances")}</h4>
                                    <p>{t("Crafted with the finest ingredients")}</p>
                                </div>
                            </div>

                            <div className="gs-feature-divider" />

                            {/* Perfect for Every Occasion */}
                            <div className="gs-feature-item">
                                <div className="gs-feature__icon">
                                    <PiStarLight size={28} color="#b9a16b" />
                                </div>
                                <div className="gs-feature__text">
                                    <h4>{t("Perfect for Every Occasion")}</h4>
                                    <p>{t("Thoughtful gifts for every special moment")}</p>
                                </div>
                            </div>

                            <div className="gs-feature-divider" />

                            {/* Made to be Remembered */}
                            <div className="gs-feature-item">
                                <div className="gs-feature__icon">
                                    <PiHeartLight size={28} color="#b9a16b" />
                                </div>
                                <div className="gs-feature__text">
                                    <h4>{t("Made to be Remembered")}</h4>
                                    <p>{t("Timeless scents that leave a lasting impression")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewGiftSection;