"use client";
import React, { useState, useEffect } from "react"; // Imported useEffect
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { categoriesTop } from "@/data/categories";
import Link from "next/link";
import { useLocale } from "next-intl";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./ProductShowcase.module.css";

const ProductShowcase = () => {
    const [isExplored, setIsExplored] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const locale = useLocale();
    const [displayedProducts, setDisplayedProducts] = useState(categoriesTop);

    // --- RESPONSIVE LOGIC START ---
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const isMobile = windowWidth > 0 && windowWidth < 768;

    const getSlidesPerView = () => {
        if (isMobile) return 1.5; // Use 1.5 for a "peek" effect on mobile
        if (windowWidth < 1024) return isExplored ? 3 : 2;
        return isExplored ? 4 : 3;
    };
    // --- RESPONSIVE LOGIC END ---

    const handleExploreClick = () => {
        setIsExplored(true);
        setDisplayedProducts(categoriesTop);
    };
    const handleGoBackClick = () => {
        setIsExplored(false);
        setDisplayedProducts(categoriesTop);
    };

    const layoutTransition = { duration: 1.0, ease: [0.43, 0.13, 0.23, 0.96] };
    const textSectionVariants = {
        initial: {
            position: "relative",
            left: "33.33vw",
            backgroundColor: "rgba(255, 255, 255, 1)",
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
        explored: { width: "66.67vw", zIndex: 15 },
    };

    // --- NEW: MOBILE ANIMATION VARIANTS ---
    const mobileTextSectionVariants = {
        initial: { x: '0%' },
        explored: { x: '-100%' },
    };
    const mobileProductsSectionVariants = {
        initial: { x: '100%' },
        explored: { x: '0%' },
    };
    const swiperVariants = {
        initial: { opacity: 0, y: 20 },
        // Animate swiper in after the panel transition is complete
        explored: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } },
    }

    return (
        <div className={`${styles["showcase-container"]} ${ isExplored ? styles.explored : "" }`}>
            {/* Section 1: Banner */}
            <motion.section className={`${styles["showcase-section"]} ${styles["banner-section"]}`} transition={layoutTransition} />

            {/* Section 2: Text (slides over the banner) */}
            <motion.section
                className={`${styles['showcase-section']} ${styles['text-section']}`}
                layout={!isMobile}
                variants={isMobile ? mobileTextSectionVariants : textSectionVariants}
                animate={isExplored ? 'explored' : 'initial'}
                transition={layoutTransition}
            >
                <div className={styles["text-content"]}>
                    <h2>OUR MOST LOVED</h2>
                    <h1>
                        Best
                        <br />
                        Sellers
                    </h1>
                    {!isExplored && (
                        <div className={styles["button-container"]}>
                            <button
                                className="btn-rounded btn-link_lg text-uppercase fw-medium text-black"
                                onClick={handleExploreClick}
                            >
                                View All
                            </button>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Section 3: Product Cards */}
            <motion.section
                className={`${styles['showcase-section']} ${styles['products-section']}`}
                variants={isMobile ? mobileProductsSectionVariants : productsSectionVariants}
                animate={isExplored ? 'explored' : 'initial'}
                transition={layoutTransition}
            >
                <div className={styles["swiper-container"]} variants={swiperVariants}>
                    <Swiper
                        key={isExplored ? "explored" : "initial"} // Key helps swiper re-render on state change
                        modules={[Pagination, Navigation, Autoplay]}
                        spaceBetween={10}
                        slidesPerView={getSlidesPerView()}
                        centeredSlides={isMobile}
                        pagination={{ clickable: true }}
                        navigation={!isMobile}
                        autoplay
                        className={styles["product-swiper"]}
                    >
                        {displayedProducts.map((product, i) => (
                            <SwiperSlide key={i}>
                                <Link
                                    href={`/${locale}${product.link}`}
                                    className={styles["product-card"]}
                                    onClick={() => setShowLoader(true)}
                                >
                                    <img
                                        src={product.imgSrc2}
                                        alt={product.altText}
                                        className={styles["product-image"]}
                                    />
                                    <div className={styles["product-info"]}>
                                        <h3 className={styles["product-name"]}>
                                            {product.altText}
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
                        ))}
                    </Swiper>
                </div>
                <div className={styles["button-container"]}>
                    {isExplored && (
                        <button className="btn-rounded btn-link_lg text-uppercase fw-medium text-black" 
                            onClick={handleGoBackClick}
                        >
                            &larr; Go Back
                        </button>
                    )}
                </div>
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
