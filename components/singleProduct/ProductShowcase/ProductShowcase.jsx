"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import { useLocale } from "next-intl";
import he from "he";
import { useMenu } from "@/context/MenuContext";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./ProductShowcase.module.css";

// --- HELPERS ---
const clean = (str) =>
    str
        ?.replace(/&amp;/g, "")        // Remove HTML ampersands
        ?.replace(/[^\w\s-]/g, "")     // Remove non-word chars (keep letters, numbers, spaces, dashes)
        ?.trim()                       // Remove leading/trailing space
        ?.replace(/\s+/g, "-")         // <--- FIX: Replace one or more spaces with a single dash
        ?.toLowerCase();

const buildLink = (locale, p) => {
    const categorySlug = clean(p.category_name);
    const subSlug = p.subcategory?.subcategory_name
        ? clean(p.subcategory.subcategory_name)
        : "online-exclusive";
    const productSlug = clean(p.product_name);
    return `/${locale}/shop/${categorySlug}/${subSlug}/${productSlug}`;
};

// --- DATA FETCHING ---
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

        let collections = all.filter((p) => {
            const cat = clean(p.category_name);
            return cat === "collections" || cat === "collection";
        });

        collections = collections.filter((p) => p.images);

        // Fisher-Yates Shuffle
        for (let i = collections.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [collections[i], collections[j]] = [collections[j], collections[i]];
        }

        return collections.slice(0, 8);
    } catch (error) {
        console.error("❌ Failed to load collection products:", error);
        return [];
    }
}

// --- FALLBACK DATA ---
const SKELETON_COUNT = 4;
const fallbackProducts = Array(SKELETON_COUNT).fill({ isSkeleton: true });

const ProductShowcase = () => {
    const [isExplored, setIsExplored] = useState(false);
    // const [showLoader, setShowLoader] = useState(false); // Removed per instruction (using Skeletons instead)
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [products, setProducts] = useState(fallbackProducts); // Start with skeletons
    const [swiperRef, setSwiperRef] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(1);
    
    // --- RESPONSIVE LOGIC ---
    const [windowWidth, setWindowWidth] = useState(0);

    const locale = useLocale();
    const { saleSection } = useMenu();

    // 1. Prepare Banner Data
    const formattedSaleSection = saleSection?.length ? (() => {
        const item = saleSection[0];
        const stripHtml = (html) => (html ? html.replace(/<[^>]+>/g, '').trim() : '');
        return {
            heading: item.name || '',
            heading_ar: item.description || '',
            small_text: item.link || '',
            small_text_ar: stripHtml(item.content),
            banner: item.image || '',
        };
    })() : null;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = windowWidth > 0 && windowWidth < 768;

    // 2. Data Loading Logic
    useEffect(() => {
        // Guard: If no banner, don't fetch
        if (!formattedSaleSection?.banner) return;

        let isMounted = true;
        async function load() {
            const fetched = await fetchCollectionsProducts();
            if (isMounted) {
                if (fetched.length > 0) {
                    setProducts(fetched);
                }
                setIsLoadingProducts(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, [formattedSaleSection?.banner]);

    // 3. Early Exit if no Banner
    if (!formattedSaleSection?.banner) return null;


    // --- ORIGINAL VIEW & NAVIGATION LOGIC ---
    const getSlidesPerView = () => {
        if (isMobile) return 1.5;
        // DESKTOP LOGIC
        if (!isExplored) return 2; 
        return 5; 
    };

    // Reverted to original logic
    const handleExploreClick = () => {
        if (windowWidth >= 768) {
            // Desktop → open slider
            setIsExplored(true);
        } else {
            // Mobile → act as normal link
            window.location.href = `/${locale}/sale`;
        }
    };

    const layoutTransition = { duration: 1.0, ease: [0.43, 0.13, 0.23, 0.96] };
    const textSectionVariants = {
        initial: { position: "relative", left: "35vw", zIndex: 2 },
        explored: { position: "absolute", left: "0vw", backgroundColor: "rgba(29, 29, 29, 0.7)", zIndex: 10 },
    };
    const productsSectionVariants = {
        initial: { width: "44.33vw", zIndex: 15 },
        explored: { width: "100vw", zIndex: 15 },
    };
    const swiperVariants = {
        initial: { opacity: 0, y: 20 },
        explored: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } },
    };

    return (
        <div className={`${styles["showcase-container"]} ${isExplored ? styles.explored : ""}`}>
            {/* Section 1: Banner */}
            <motion.section
                className={`${styles["showcase-section"]} ${styles["banner-section"]} pt-5 pb-5`}
                transition={layoutTransition}
                style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}storage/${formattedSaleSection.banner})`
                }}
            />

            {/* Section 2: Text */}
            <motion.section
                className={`${styles["showcase-section"]} ${styles["text-section"]}`}
                layout={!isMobile}
                variants={!isMobile ? textSectionVariants : undefined}
                animate={!isMobile ? (isExplored ? "explored" : "initial") : undefined}
                transition={!isMobile ? layoutTransition : undefined}
            >
                <div>
                    <p className="fs-15 px-0 text-secondary section-paragraph">
                        {locale === "ar" ? formattedSaleSection?.small_text_ar : formattedSaleSection?.small_text}
                    </p>
                    <h2 className="section-head section-title fs-25 fw-medium mb-4">
                        {locale === "ar" ? formattedSaleSection?.heading_ar : formattedSaleSection?.heading}
                    </h2>
                    {!isExplored && (
                        <div className={styles["button-container"]}>
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
                animate={!isMobile ? (isExplored ? "explored" : "initial") : undefined}
                transition={!isMobile ? layoutTransition : undefined}
            >
                <div className={styles["swiper-container"]} variants={swiperVariants}>
                    <Swiper
                        onSwiper={setSwiperRef}
                        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
                        key={isExplored ? "explored" : "initial"}
                        modules={[Pagination, Navigation, Autoplay]}
                        spaceBetween={10}
                        slidesPerView={getSlidesPerView()}
                        centeredSlides={isMobile}
                        autoplay={!isLoadingProducts}
                        className={styles["product-swiper"]}
                        // Reverted to original logic
                        onSliderMove={(swiper) => {
                            const diff = swiper.touches.diff;
                            if (isMobile) return;

                            if (!isExplored && diff < -15) setIsExplored(true);
                            if (isExplored && diff > 15) setIsExplored(false);
                        }}
                    >
                        {/* Custom Navigation */}
                        <div className={styles.customNav}>
                            {isExplored && (
                                <div className={styles["button-container"]}>
                                    <Link className="btn-rounded btn-link_lg text-uppercase fw-medium" href={`/${locale}/sale`}>
                                        View More
                                    </Link>
                                </div>
                            )}
                            
                            {/* Reverted to original Prev Button Logic */}
                            <button className={styles.prevBtn} onClick={() => {
                                if (!swiperRef) return;
                                if (!isMobile && swiperRef.realIndex === 0) {
                                    setIsExplored(false);
                                }
                                swiperRef.slidePrev();
                            }}>
                                &lt;
                            </button>
                            
                            <span className={styles.pageIndicator}>
                                {isLoadingProducts ? "-" : currentIndex} / {isLoadingProducts ? "-" : products.length}
                            </span>

                            {/* Reverted to original Next Button Logic */}
                            <button className={styles.nextBtn} onClick={() => {
                                if (!swiperRef) return;
                                if (!isMobile) setIsExplored(true);
                                swiperRef.slideNext();
                            }}>
                                &gt;
                            </button>
                        </div>

                        {/* RENDER PRODUCTS OR SKELETONS */}
                        {products.map((p, i) => {
                            // Skeleton Card
                            if (p.isSkeleton) {
                                return (
                                    <SwiperSlide key={`skel-${i}`}>
                                        <div className={`${styles["product-card"]} ${styles["skeleton-card"]}`}>
                                            <div className={styles["skeleton-image"]} />
                                            <div className={styles["product-info"]}>
                                                <div className={styles["skeleton-text"]} style={{ width: "80%" }} />
                                                <div className={styles["skeleton-text"]} style={{ width: "50%", marginTop: "10px" }} />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            }

                            // Real Card
                            const images = JSON.parse(p.images || "[]");
                            const firstImg = images[0] ? `${process.env.NEXT_PUBLIC_API_URL}storage/${images[0]}` : "/no-img.jpg";
                            const link = buildLink(locale, p);

                            return (
                                <SwiperSlide key={i}>
                                    <Link href={link} className={styles["product-card"]}>
                                        <img src={firstImg} alt={p.product_name} className={styles["product-image"]} />
                                        <div className={styles["product-info"]}>
                                            <h3 className={styles["product-name"]}>{he.decode(p.product_name)}</h3>
                                            <div className={styles["shop-now-container"]}>
                                                <span className={styles["shop-now-link"]}>Shop Now</span>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Mobile Navigation */}
                    {isMobile && !isLoadingProducts && (
                        <div className={styles.mobileNav}>
                            <button onClick={() => swiperRef && swiperRef.slidePrev()} className={styles.mobileArrow}>&lt;</button>
                            <span className={styles.mobileIndicator}>{currentIndex} / {products.length}</span>
                            <button onClick={() => swiperRef && swiperRef.slideNext()} className={styles.mobileArrow}>&gt;</button>
                        </div>
                    )}
                </div>
            </motion.section>
        </div>
    );
};

export default ProductShowcase;