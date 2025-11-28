"use client";
import React, { useState, useEffect } from "react"; // Imported useEffect
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import { useLocale } from "next-intl";
import he from "he";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./ProductShowcase.module.css";

// Fetch products ONLY from "Collections" category
async function fetchCollectionsProducts() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/allProducts`,
            {
                method: "POST",
                cache: "no-store",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page: 1, limit: 1000 }),
            }
        );

        const result = await response.json();
        const all = result.data || [];

        // Clean function
        const clean = (str) =>
            str
                ?.replace(/&amp;/g, "")
                ?.replace(/[^\w\s-]/g, "")
                ?.trim()
                ?.toLowerCase();

        // Filter ONLY Collections category
        let collections = all.filter((p) => {
            const cat = clean(p.category_name);
            return cat === "collections" || cat === "collection";
        });

        // Must have images
        collections = collections.filter((p) => p.images);

        // Fisher-Yates Random Shuffle
        for (let i = collections.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [collections[i], collections[j]] = [collections[j], collections[i]];
        }

        return collections.slice(0, 8);
    } catch (error) {
        console.log("❌ Failed to load collection products:", error);
        return [];
    }
}

const ProductShowcase = () => {
    const [isExplored, setIsExplored] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const locale = useLocale();
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [swiperRef, setSwiperRef] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(1);

    // --- RESPONSIVE LOGIC START ---
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        async function load() {
            const products = await fetchCollectionsProducts();
            setDisplayedProducts(products);
        }
        load();
    }, []);

    const isMobile = windowWidth > 0 && windowWidth < 768;

    const getSlidesPerView = () => {
        if (isMobile) return 1.5;

        // DESKTOP LOGIC
        if (!isExplored) return 2; // Before trigger → always 2 large cards
        return 5; // After trigger → 3 big gallery cards (Dior style)
    };

    // --- RESPONSIVE LOGIC END ---

    const handleExploreClick = () => {
        if (windowWidth >= 768) {
            // Desktop → open slider
            setIsExplored(true);
        } else {
            // Mobile → act as normal link
            window.location.href = `/${locale}/sale`;
        }
    };

    const handleGoBackClick = () => {
        setIsExplored(false);
        setDisplayedProducts(saleSection);
    };

    const layoutTransition = { duration: 1.0, ease: [0.43, 0.13, 0.23, 0.96] };
    const textSectionVariants = {
        initial: {
            position: "relative",
            left: "35vw",
            zIndex: 2,
        },
        explored: {
            position: "absolute",
            left: "0vw",
            backgroundColor: "rgba(29, 29, 29, 0.7)",
            zIndex: 10,
        },
    };
    const productsSectionVariants = {
        initial: { width: "44.33vw", zIndex: 15 },
        explored: { width: "100vw", zIndex: 15 },
    };

    // --- NEW: MOBILE ANIMATION VARIANTS ---
    const mobileTextSectionVariants = {
        initial: { x: "0%" },
        explored: { x: "-100%" },
    };
    const mobileProductsSectionVariants = {
        initial: { x: "100%" },
        explored: { x: "0%" },
    };
    const swiperVariants = {
        initial: { opacity: 0, y: 20 },
        // Animate swiper in after the panel transition is complete
        explored: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.6, duration: 0.5 },
        },
    };

    return (
        <div
            className={`${styles["showcase-container"]} ${
                isExplored ? styles.explored : ""
            }`}
        >
            {/* Section 1: Banner */}
            <motion.section
                className={`${styles["showcase-section"]} ${styles["banner-section"]} pt-5 pb-5`}
                transition={layoutTransition}
            />

            {/* Section 2: Text (slides over the banner) */}
            <motion.section
                className={`${styles["showcase-section"]} ${styles["text-section"]}`}
                layout={!isMobile} // mobile => no layout shift
                variants={!isMobile ? textSectionVariants : undefined}
                animate={
                    !isMobile
                        ? isExplored
                            ? "explored"
                            : "initial"
                        : undefined
                }
                transition={!isMobile ? layoutTransition : undefined}
            >
                <div className={styles[""]}>
                    <p className="fs-15 px-0  text-secondary section-paragraph">
                        Upto 30% off
                    </p>
                    <h2 className="section-head section-title fs-25 fw-medium mb-4">
                        Winter Luxury, Elevated Offers
                    </h2>
                    {!isExplored && (
                        <div className={styles["button-container"]}>
                            {/* <Link
                                className="btn-rounded btn-link_lg text-uppercase fw-medium text-black"
                                href={`/${locale}/sale`}
                            >
                                Explore
                            </Link> */}
                            <button
                                className="btn-rounded btn-link_lg text-uppercase fw-medium text-black"
                                onClick={handleExploreClick}
                            >
                                Explore
                            </button>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Section 3: Product Cards */}
            <motion.section
                className={`${styles["showcase-section"]} ${styles["products-section"]}`}
                variants={!isMobile ? productsSectionVariants : undefined}
                animate={
                    !isMobile
                        ? isExplored
                            ? "explored"
                            : "initial"
                        : undefined
                }
                transition={!isMobile ? layoutTransition : undefined}
            >
                <div
                    className={styles["swiper-container"]}
                    variants={swiperVariants}
                >
                    <Swiper
                        onSwiper={setSwiperRef}
                        onSlideChange={(swiper) =>
                            setCurrentIndex(swiper.realIndex + 1)
                        }
                        key={isExplored ? "explored" : "initial"}
                        modules={[Pagination, Navigation, Autoplay]}
                        spaceBetween={10}
                        slidesPerView={getSlidesPerView()}
                        centeredSlides={isMobile}
                        pagination={false}
                        navigation={false}
                        autoplay
                        onSliderMove={(swiper) => {
                            const diff = swiper.touches.diff;

                            // 🚫 Disable explore transitions on mobile completely
                            if (isMobile) return;

                            if (!isExplored && diff < -15) setIsExplored(true);
                            if (isExplored && diff > 15) setIsExplored(false);
                        }}
                        className={styles["product-swiper"]}
                    >
                        <div className={styles.customNav}>
                            {isExplored && (
                                <div className={styles["button-container"]}>
                                    <Link
                                        className="btn-rounded btn-link_lg  text-uppercase fw-medium"
                                        href={`/${locale}/sale`}
                                    >
                                        View More
                                    </Link>
                                </div>
                            )}
                            <button
                                className={styles.prevBtn}
                                onClick={() => {
                                    if (!swiperRef) return;

                                    if (
                                        !isMobile &&
                                        swiperRef.realIndex === 0
                                    ) {
                                        setIsExplored(false);
                                    }

                                    swiperRef.slidePrev();
                                }}
                            >
                                &lt;
                            </button>

                            <span className={styles.pageIndicator}>
                                {currentIndex} / {displayedProducts.length}
                            </span>

                            <button
                                className={styles.nextBtn}
                                onClick={() => {
                                    if (!swiperRef) return;

                                    if (!isMobile) setIsExplored(true);

                                    swiperRef.slideNext();
                                }}
                            >
                                &gt;
                            </button>
                        </div>
                        {displayedProducts.map((p, i) => {
                            const images = JSON.parse(p.images || "[]");
                            const firstImg = images[0]
                                ? `${process.env.NEXT_PUBLIC_API_URL}storage/${images[0]}`
                                : "/no-img.jpg";

                            // Build clean URL slugs (same method DiscountGrid uses)
                            const clean = (str) =>
                                str
                                    ?.replace(/&amp;/g, "")
                                    ?.replace(/[^\w\s-]/g, "")
                                    ?.replace(/\s+/g, "-")
                                    ?.trim()
                                    ?.toLowerCase();

                            const categorySlug = clean(p.category_name);
                            const subSlug = p.subcategory?.subcategory_name
                                ? clean(p.subcategory.subcategory_name)
                                : "online-exclusive";
                            const productSlug = clean(p.product_name);

                            const link = `/${locale}/shop/${categorySlug}/${subSlug}/${productSlug}`;

                            return (
                                <SwiperSlide key={i}>
                                    <Link
                                        href={link}
                                        className={styles["product-card"]}
                                        onClick={() => setShowLoader(true)}
                                    >
                                        <img
                                            src={firstImg}
                                            alt={p.product_name}
                                            className={styles["product-image"]}
                                        />

                                        <div className={styles["product-info"]}>
                                            <h3
                                                className={
                                                    styles["product-name"]
                                                }
                                            >
                                                {he.decode(p.product_name)}
                                            </h3>

                                            <div
                                                className={
                                                    styles["shop-now-container"]
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles["shop-now-link"]
                                                    }
                                                >
                                                    Shop Now
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    {isMobile && (
                        <div className={styles.mobileNav}>
                            <button
                                onClick={() =>
                                    swiperRef && swiperRef.slidePrev()
                                }
                                className={styles.mobileArrow}
                            >
                                &lt;
                            </button>

                            <span className={styles.mobileIndicator}>
                                {currentIndex} / {displayedProducts.length}
                            </span>

                            <button
                                onClick={() =>
                                    swiperRef && swiperRef.slideNext()
                                }
                                className={styles.mobileArrow}
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
                {/* <div className={styles["button-container"]}>
                    {isExplored && (
                        <button className="btn-rounded btn-link_lg text-uppercase fw-medium text-black" 
                            onClick={handleGoBackClick}
                        >
                            &larr; Go Back
                        </button>
                    )}
                </div> */}
            </motion.section>
            {showLoader && (
                <div className="loader-overlay">
                    <div className="loader-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default ProductShowcase;
