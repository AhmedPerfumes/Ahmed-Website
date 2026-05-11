
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