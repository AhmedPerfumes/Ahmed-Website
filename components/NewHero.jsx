"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

import Image from "next/image";
import Link from "next/link";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import { useMenu } from "@/context/MenuContext";
import { useLocale, useTranslations } from "next-intl";

const HeroSkeleton = () => {
    return (
        <div
            className="position-relative w-100 vh-100 overflow-hidden"
            style={{
                background:
                    "linear-gradient(135deg, #f8f8f8 0%, #efefef 40%, #f5f5f5 100%)",
            }}
        >
            {/* Background shimmer */}
            <Skeleton
                variant="rectangular"
                animation="wave"
                width="100%"
                height="100%"
                sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(255,255,255,0.35)",
                    backdropFilter: "blur(10px)",
                }}
            />

            {/* Desktop Content (Left-aligned) */}
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    position: "absolute",
                    top: "50%",
                    left: "5%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    width: "100%",
                    maxWidth: "500px",
                }}
            >
                <Skeleton
                    variant="text"
                    width={120}
                    height={25}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", mb: 2, borderRadius: "4px" }}
                />
                <Skeleton
                    variant="text"
                    width="100%"
                    height={90}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", borderRadius: "8px" }}
                />
                <Skeleton
                    variant="text"
                    width="70%"
                    height={70}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", mb: 4, borderRadius: "8px" }}
                />
                <Skeleton
                    variant="rounded"
                    width={180}
                    height={52}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", borderRadius: "999px" }}
                />
            </Box>

            {/* Mobile Content (Centered Top) */}
            <Box
                sx={{
                    display: { xs: "flex", md: "none" },
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "absolute",
                    top: "18%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                    width: "90%",
                    maxWidth: "95%",
                }}
            >
                <Skeleton
                    variant="text"
                    width={90}
                    height={20}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", mb: 2, borderRadius: "4px" }}
                />
                <Skeleton
                    variant="text"
                    width="100%"
                    height={60}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", borderRadius: "8px" }}
                />
                <Skeleton
                    variant="text"
                    width="70%"
                    height={40}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", mb: 3, borderRadius: "8px" }}
                />
                <Skeleton
                    variant="rounded"
                    width={150}
                    height={45}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", borderRadius: "999px" }}
                />
            </Box>

            {/* Right thumbnails (Desktop only) */}
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    gap: "8px",
                    position: "absolute",
                    right: "30px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                }}
            >
                {[1, 2, 3].map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="rounded"
                        width={52}
                        height={70}
                        sx={{ bgcolor: "rgba(0,0,0,0.08)", borderRadius: "8px" }}
                    />
                ))}
            </Box>

            {/* Counter */}
            <Box
                sx={{
                    position: "absolute",
                    left: { xs: "20px", md: "50px" },
                    bottom: { xs: "20px", md: "40px" },
                    zIndex: 2,
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={{ xs: 70, md: 90 }}
                    height={{ xs: 30, md: 40 }}
                    sx={{ bgcolor: "rgba(0,0,0,0.08)", borderRadius: "10px" }}
                />
            </Box>
        </div>
    );
};

const NewHero = () => {
    const locale = useLocale();
    const t = useTranslations();

    const swiperRef = useRef(null);

    const {
        homeSliders,
        isLoading,
        error,
    } = useMenu();

    const [activeIndex, setActiveIndex] = useState(0);
    const [progressKey, setProgressKey] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [direction, setDirection] = useState(0);

    const slidersToDisplay = homeSliders || [];
    const total = slidersToDisplay.length;

    const nextSlide = useCallback(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % slidersToDisplay.length);
        setProgressKey((prev) => prev + 1);
    }, [slidersToDisplay.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + slidersToDisplay.length) % slidersToDisplay.length);
        setProgressKey((prev) => prev + 1);
    }, [slidersToDisplay.length]);

    const goToSlide = (index) => {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
        setProgressKey((prev) => prev + 1);
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Autoplay - 8s for premium storytelling feel
    useEffect(() => {
        if (isLoading || error || slidersToDisplay.length === 0) return;

        const timer = setInterval(() => {
            nextSlide();
        }, 8000);
        return () => clearInterval(timer);
    }, [nextSlide, isLoading, error, slidersToDisplay.length]);

    if (isLoading) return <HeroSkeleton />;

    if (error) {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center">
                {error}
            </div>
        );
    }

    // Custom ease-out curve from Emil Kowalski's philosophy
    const emilEaseOut = [0.23, 1, 0.32, 1];

    const slideVariants = {
        enter: (direction) => ({
            transform: direction > 0 ? "translateX(100%)" : "translateX(-100%)",
            opacity: 1,
            zIndex: 1,
        }),
        center: {
            transform: "translateX(0%)",
            opacity: 1,
            zIndex: 2,
            transition: {
                transform: { type: "spring", stiffness: 100, damping: 20, mass: 1, duration: 1.2 },
                opacity: { duration: 0.6, ease: emilEaseOut },
            },
        },
        exit: (direction) => ({
            transform: direction < 0 ? "translateX(100%)" : "translateX(-100%)",
            opacity: 0,
            scale: 0.96,
            zIndex: 0,
            transition: {
                transform: { type: "spring", stiffness: 100, damping: 20, mass: 1, duration: 1.2 },
                opacity: { duration: 0.6, ease: emilEaseOut },
            },
        }),
    };

    const contentVariants = {
        initial: { y: 40, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.9,
                ease: emilEaseOut,
                delay: 0.5,
            },
        },
    };

    const imageVariants = {
        animate: {
            scale: 1,
            transition: { duration: 6, ease: "linear" },
        },
        initial: {
            scale: 1.15,
        },
    };

    return (
        <div
            className="new-hero-wrapper position-relative w-100 vh-100 overflow-hidden bg-black text-white"
            style={{
                opacity: isLoading ? 0 : 1,
                transition: "opacity 0.8s ease",
            }}
        >
            <div className="h-100 w-100 position-relative">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={activeIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) * velocity.x;

                            if (swipe < -10000) {
                                nextSlide();
                            } else if (swipe > 10000) {
                                prevSlide();
                            }
                        }}
                        className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
                        style={{ cursor: "grab" }}
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {/* Background Image */}
                        <motion.div 
                            variants={imageVariants}
                            initial="initial"
                            animate="animate"
                            className="position-absolute top-0 start-0 w-100 h-100"
                        >
                            <Image
                                priority
                                quality={85}
                                sizes="100vw"
                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${isMobile ? slidersToDisplay[activeIndex].mobile_image : slidersToDisplay[activeIndex].image}`}
                                alt={(locale === "ar" ? slidersToDisplay[activeIndex].title_ar : slidersToDisplay[activeIndex].title) || "Hero Image"}
                                fill
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center center",
                                }}
                            />
                        </motion.div>

                        {/* Overlay */}
                        <div 
                            className="position-absolute inset-0" 
                            style={{ 
                                background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0.5))",
                                zIndex: 1
                            }} 
                        />

                        {/* Content */}
                        <div className="container h-100 position-relative" style={{ zIndex: 2 }}>
                            <div className="row h-100 align-items-end align-items-md-center pb-5 pb-md-0">
                                <div className={`col-lg-7 col-md-9 px-4 px-md-5 text-center ${locale === 'ar' ? 'text-md-end' : 'text-md-start'}`}>

                                    {/* Season */}
                                    {(locale === "ar" ? slidersToDisplay[activeIndex].season_ar : slidersToDisplay[activeIndex].season) && (
                                        <motion.div 
                                            variants={contentVariants}
                                            className="overflow-hidden mb-3 mb-md-4"
                                        >
                                            <div className="d-inline-flex align-items-center gap-2">
                                                <span
                                                    className="d-none d-md-block"
                                                    style={{
                                                        width: "28px",
                                                        height: "1px",
                                                        background:
                                                            slidersToDisplay[activeIndex].color || "#fff",
                                                        opacity: 0.7,
                                                    }}
                                                />

                                                <span
                                                    style={{
                                                        color:
                                                            slidersToDisplay[activeIndex].color || "#fff",
                                                        letterSpacing: "5px",
                                                        fontSize: "0.7rem",
                                                        fontFamily:
                                                            "sans-serif",
                                                        textTransform:
                                                            "uppercase",
                                                        opacity: 0.85,
                                                        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                                                    }}
                                                >
                                                    {locale === "ar" ? slidersToDisplay[activeIndex].season_ar : slidersToDisplay[activeIndex].season}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Title */}
                                    {(locale === "ar" ? slidersToDisplay[activeIndex].title_ar : slidersToDisplay[activeIndex].title) && (
                                        <div className="overflow-hidden">
                                            <motion.h1
                                                variants={contentVariants}
                                                className="fw-normal text-uppercase mb-n2"
                                                style={{
                                                    color:
                                                        slidersToDisplay[activeIndex].color || "#fff",
                                                    fontSize:
                                                        "clamp(2rem, 8vw, 4.2rem)",
                                                    lineHeight: 1.1,
                                                    letterSpacing: "0.02em",
                                                    textShadow:
                                                        "0 2px 12px rgba(0,0,0,0.8)",
                                                    fontFamily:
                                                        locale === 'ar' ? 'sans-serif' : '"Playfair Display", serif',
                                                }}
                                            >
                                                {locale === "ar" ? slidersToDisplay[activeIndex].title_ar : slidersToDisplay[activeIndex].title}
                                            </motion.h1>
                                        </div>
                                    )}

                                    {/* Subtitle */}
                                    {(locale === "ar" ? slidersToDisplay[activeIndex].sub_title_ar : slidersToDisplay[activeIndex].sub_title) && (
                                        <div className="overflow-hidden mb-5">
                                            <motion.h2
                                                variants={contentVariants}
                                                className="fw-light text-uppercase"
                                                style={{
                                                    color:
                                                        slidersToDisplay[activeIndex].color || "#e8e8e8",
                                                    fontSize:
                                                        "clamp(0.95rem, 4vw, 2.4rem)",
                                                    lineHeight: 1.2,
                                                    fontFamily:
                                                        locale === 'ar' ? 'sans-serif' : '"Playfair Display", serif',
                                                    letterSpacing: "0.05em",
                                                    marginLeft: "0",
                                                    marginRight: "0",
                                                    textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                                                }}
                                            >
                                                {locale === "ar" ? slidersToDisplay[activeIndex].sub_title_ar : slidersToDisplay[activeIndex].sub_title}
                                            </motion.h2>
                                        </div>
                                    )}

                                    {/* Button */}
                                    {(locale === "ar" ? slidersToDisplay[activeIndex].title_ar : slidersToDisplay[activeIndex].title) && (
                                        <motion.div 
                                            variants={contentVariants}
                                            className="mt-4"
                                        >
                                            <Link
                                                href={`/${locale}/${slidersToDisplay[activeIndex].link || "#"}`}
                                                className="unique-btn-modern text-uppercase d-inline-flex align-items-center text-decoration-none"
                                            >
                                                <span
                                                    className="btn-text-content fw-medium d-flex align-items-center"
                                                    style={{
                                                        color: slidersToDisplay[activeIndex].color || "#fff",
                                                        letterSpacing: "3px",
                                                        fontSize: "0.75rem",
                                                        textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                                                    }}
                                                >
                                                    {t("Discover More")}

                                                    <svg
                                                        className="ms-3 btn-icon-content"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnail Strip */}
            <div className="hero-thumb-strip">
                {slidersToDisplay?.map((elm, i) => (
                    <button
                        key={i}
                        className={`hero-thumb-item ${
                            i === activeIndex ? "active" : ""
                        }`}
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                    >
                        <div className="thumb-img-wrap">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${isMobile ? elm.mobile_image : elm.image}`}
                                alt={elm.title || `Slide ${i + 1}`}
                                fill
                                style={{
                                    objectFit: "cover",
                                }}
                            />

                            <div className="thumb-overlay" />

                            {i === activeIndex && (
                                <div className="thumb-progress-bar">
                                    <div
                                        key={progressKey}
                                        className="thumb-progress-fill"
                                    />
                                </div>
                            )}
                        </div>

                        <span className="thumb-number">
                            0{i + 1}
                        </span>
                    </button>
                ))}
            </div>

            {/* Slide Counter */}
            <div className="hero-slide-counter">
                <span className="counter-current">
                    0{activeIndex + 1}
                </span>

                <span className="counter-sep"> / </span>

                <span className="counter-total">
                    0{total}
                </span>
            </div>

            <style jsx global>{`
                .hero-thumb-strip {
                    position: absolute;
                    right: 30px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .hero-thumb-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    opacity: 0.4;
                    transition: opacity 0.4s ease,
                        transform 0.4s ease;
                }

                .hero-thumb-item:hover,
                .hero-thumb-item.active {
                    opacity: 1;
                    transform: scale(1.05);
                }

                .thumb-img-wrap {
                    position: relative;
                    width: 52px;
                    height: 70px;
                    border-radius: 6px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.15);
                }

                .hero-thumb-item.active .thumb-img-wrap {
                    border-color: rgba(255,255,255,0.8);
                    box-shadow: 0 0 15px rgba(255,255,255,0.15);
                }

                .thumb-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.45);
                    transition: background 0.4s ease;
                }

                .hero-thumb-item.active .thumb-overlay {
                    background: rgba(0,0,0,0.1);
                }

                .thumb-progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: rgba(255,255,255,0.2);
                    z-index: 2;
                }

                .thumb-progress-fill {
                    height: 100%;
                    width: 0%;
                    background: #fff;
                    animation: thumbFill 6s linear forwards;
                }

                @keyframes thumbFill {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }

                .thumb-number {
                    font-size: 0.6rem;
                    color: rgba(255,255,255,0.6);
                    letter-spacing: 1px;
                }

                .hero-thumb-item.active .thumb-number {
                    color: #fff;
                }

                .hero-slide-counter {
                    position: absolute;
                    bottom: 40px;
                    left: 50px;
                    z-index: 100;
                    font-family: "Playfair Display", serif;
                    color: rgba(255,255,255,0.8);
                }

                .counter-current {
                    font-size: 2.5rem;
                    font-weight: 300;
                    color: #fff;
                }

                .counter-sep,
                .counter-total {
                    font-size: 1rem;
                    color: rgba(255,255,255,0.4);
                }

                .unique-btn-modern {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    padding: 0.75rem 2.4rem;
                    border-radius: 50px;
                    background: rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255,255,255,0.2);
                    overflow: hidden;
                    transition: all 0.5s ease;
                }

                .unique-btn-modern:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255,255,255,0.5);
                }

                .btn-icon-content {
                    transition: transform 0.4s ease;
                }

                .unique-btn-modern:hover .btn-icon-content {
                    transform: translateX(6px);
                }

                [dir='rtl'] .unique-btn-modern:hover .btn-icon-content {
                    transform: translateX(-6px) scaleX(-1);
                }

                .mb-n2 {
                    margin-bottom: -0.5rem !important;
                }

                @media (max-width: 768px) {
                    .hero-thumb-strip {
                        display: none;
                    }

                    .hero-slide-counter {
                        left: 20px;
                        bottom: 20px;
                    }

                    .counter-current {
                        font-size: 1.8rem;
                    }
                }

                /* RTL TYPOGRAPHY IMPROVEMENTS */
                [dir='rtl'] .gsap-text.text-uppercase {
                    letter-spacing: 0 !important;
                }
                [dir='rtl'] h1.gsap-text {
                    font-size: clamp(2rem, 8vw, 4.2rem) !important;
                    line-height: 1.1 !important;
                }
                [dir='rtl'] h2.gsap-text {
                    font-size: clamp(0.95rem, 4vw, 2rem) !important;
                    line-height: 1.3 !important;
                    margin-left: 0 !important;
                    margin-right: 2% !important;
                }
                [dir='rtl'] .btn-text-content {
                    letter-spacing: 0 !important;
                    font-size: 0.85rem !important;
                }
                [dir='rtl'] .gsap-text span {
                    letter-spacing: 0 !important;
                    font-size: 0.8rem !important;
                }
                [dir='rtl'] .thumb-progress-fill {
                    left: auto;
                    right: 0;
                }
                [dir='rtl'] .thumb-progress-bar {
                    left: auto;
                    right: 0;
                }
                [dir='rtl'] .btn-icon-content {
                    transform: scaleX(-1);
                }
            `}</style>
        </div>
    );
};

export default NewHero;