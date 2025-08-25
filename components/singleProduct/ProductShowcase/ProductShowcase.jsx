"use client";
import React, { useState, useEffect } from 'react'; // Imported useEffect
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { categoriesTop } from "@/data/categories";
import Link from 'next/link';
import { useLocale } from 'next-intl';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from './ProductShowcase.module.css';

const ProductShowcase = () => {
    const [isExplored, setIsExplored] = useState(false);
    const locale = useLocale();
    const [displayedProducts, setDisplayedProducts] = useState(categoriesTop.slice(2));
    
    // --- RESPONSIVE LOGIC START ---
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        // This code now runs only on the client, where `window` is available.
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        handleResize(); // Set initial size
        window.addEventListener('resize', handleResize);
        
        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getSlidesPerView = () => {
        if (windowWidth < 768) { // Mobile
            return 2;
        }
        if (windowWidth < 1024) { // Tablet
            return isExplored ? 3 : 2;
        }
        return isExplored ? 4 : 3; // Desktop
    };
    // --- RESPONSIVE LOGIC END ---

    const handleExploreClick = () => {
        setIsExplored(true);
        setDisplayedProducts(categoriesTop);
    };
    const handleGoBackClick = () => {
        setIsExplored(false);
        setDisplayedProducts(categoriesTop.slice(2));
    };

    const layoutTransition = { duration: 1.0, ease: [0.43, 0.13, 0.23, 0.96] };

    const textSectionVariants = {
        initial: {
            position: 'relative',
            left: '33.33vw',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            zIndex: 2,
        },
        explored: {
            position: 'absolute',
            left: '0vw',
            backgroundColor: 'rgba(29, 29, 29, 0.7)',
            zIndex: 10,
        },
    };

    const productsSectionVariants = {
        initial: { width: '44.33vw', zIndex: 15, },
        explored: { width: '66.67vw', zIndex: 15, },
    };

    return (
        <div className={`${styles['showcase-container']} ${isExplored ? styles.explored : ''}`}>
            {/* Section 1: Banner */}
            <motion.section
                className={`${styles['showcase-section']} ${styles['banner-section']}`}
                transition={layoutTransition}
            />

            {/* Section 2: Text (slides over the banner) */}
            <motion.section
                className={`${styles['showcase-section']} ${styles['text-section']}`}
                layout="position"
                variants={textSectionVariants}
                animate={isExplored ? 'explored' : 'initial'}
                transition={layoutTransition}
            >
                <div className={styles['text-content']}>
                    <h2>OUR MOST LOVED</h2>
                    <h1>Best<br />Sellers</h1>
                    {!isExplored && (
                        <div className={styles['button-container']}>
                            <button className="btn-rounded btn-link_lg bg-white text-uppercase fw-medium" onClick={handleExploreClick}>View All</button>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Section 3: Product Cards */}
            <motion.section
                className={`${styles['showcase-section']} ${styles['products-section']}`}
                variants={productsSectionVariants}
                animate={isExplored ? 'explored' : 'initial'}
                transition={layoutTransition}
            >
                <div className={styles['swiper-container']}>
                    <Swiper
                        key={isExplored ? 'explored' : 'initial'} // Key helps swiper re-render on state change
                        modules={[Pagination]}
                        spaceBetween={windowWidth < 768 ? 15 : 30}
                        slidesPerView={getSlidesPerView()} // Using the dynamic function here
                        pagination={{ clickable: true }}
                        navigation={false}
                        className={styles['product-swiper']}
                    >
                        {displayedProducts.map((product, i) => (
                            <SwiperSlide key={i}>
                                <Link href={`/${locale}${product.link}`} className={styles['product-card']}>
                                    <img src={product.imgSrc2} alt={product.altText} className={styles['product-image']} />
                                    <div className={styles['product-info']}>
                                        <h3 className={styles['product-name']}>{product.altText}</h3>
                                        <div className={styles['shop-now-container']}>
                                            <span className={styles['shop-now-link']}>
                                                Shop Now
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className={styles['button-container']}>
                    {isExplored && (
                        <button className="btn-rounded btn-link_lg bg-white text-uppercase fw-medium" onClick={handleGoBackClick}>&larr; Go Back</button>
                    )}
                </div>
            </motion.section>
        </div>
    );
};

export default ProductShowcase;