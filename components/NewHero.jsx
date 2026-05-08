"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";

import Image from "next/image";
import Link from "next/link";

import Skeleton from "@mui/material/Skeleton";

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

            {/* Left content */}
            <div
                className="position-absolute"
                style={{
                    top: "50%",
                    left: "7%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    width: "500px",
                    maxWidth: "85%",
                }}
            >
                {/* Season */}
                <Skeleton
                    variant="text"
                    width={120}
                    height={25}
                    animation="wave"
                    sx={{
                        bgcolor: "rgba(0,0,0,0.08)",
                        mb: 2,
                        borderRadius: "4px",
                    }}
                />

                {/* Main title */}
                <Skeleton
                    variant="text"
                    width="100%"
                    height={90}
                    animation="wave"
                    sx={{
                        bgcolor: "rgba(0,0,0,0.08)",
                        borderRadius: "8px",
                    }}
                />

                {/* Subtitle */}
                <Skeleton
                    variant="text"
                    width="70%"
                    height={70}
                    animation="wave"
                    sx={{
                        bgcolor: "rgba(0,0,0,0.08)",
                        mb: 4,
                        borderRadius: "8px",
                    }}
                />

                {/* Button */}
                <Skeleton
                    variant="rounded"
                    width={180}
                    height={52}
                    animation="wave"
                    sx={{
                        bgcolor: "rgba(0,0,0,0.08)",
                        borderRadius: "999px",
                    }}
                />
            </div>

            {/* Right thumbnails */}
            <div
                className="position-absolute d-flex flex-column gap-2"
                style={{
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
                        animation="wave"
                        sx={{
                            bgcolor: "rgba(0,0,0,0.08)",
                            borderRadius: "8px",
                        }}
                    />
                ))}
            </div>

            {/* Counter */}
            <div
                className="position-absolute"
                style={{
                    left: "50px",
                    bottom: "40px",
                    zIndex: 2,
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={90}
                    height={40}
                    animation="wave"
                    sx={{
                        bgcolor: "rgba(0,0,0,0.08)",
                        borderRadius: "10px",
                    }}
                />
            </div>
        </div>
    );
};

const NewHero = () => {
    const locale = useLocale();
    const t = useTranslations();

    const swiperRef = useRef(null);

    const {
        homeSliders,
        homeMobileSliders,
        isLoading,
        error,
    } = useMenu();

    const [activeIndex, setActiveIndex] = useState(0);
    const [progressKey, setProgressKey] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isLoading) return <HeroSkeleton />;

    if (error) {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center">
                {error}
            </div>
        );
    }

    const slidersToDisplay =
        isMobile && homeMobileSliders?.length > 0
            ? homeMobileSliders
            : homeSliders;

    const total = slidersToDisplay?.length || 0;

    const handleSlideChange = (swiper) => {
        if (!swiper || !swiper.slides) return;

        const realIndex = swiper.realIndex;

        setActiveIndex(realIndex);

        setProgressKey((prev) => prev + 1);

        const activeSlide = swiper.slides[swiper.activeIndex];

        if (!activeSlide) return;

        const texts = activeSlide.querySelectorAll(".gsap-text");

        const bg = activeSlide.querySelector(".gsap-bg");

        gsap.fromTo(
            texts,
            {
                y: 80,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 1.1,
                stagger: 0.12,
                ease: "power4.out",
                delay: 0.4,
            }
        );

        gsap.fromTo(
            bg,
            {
                scale: isMobile ? 1.02 : 1.12,
                transformOrigin: "center center",
            },
            {
                scale: 1,
                duration: 6,
                ease: "power1.out",
            }
        );
    };

    const goToSlide = (index) => {
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.slideToLoop(index);
        }
    };

    return (
        <div
            className="new-hero-wrapper position-relative w-100 vh-100 overflow-hidden bg-black text-white"
            style={{
                opacity: isLoading ? 0 : 1,
                transition: "opacity 0.8s ease",
            }}
        >
            <Swiper
                ref={swiperRef}
                modules={[Autoplay, EffectCreative]}
                effect="creative"
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: ["-20%", 0, -1],
                        opacity: 0,
                    },
                    next: {
                        translate: ["100%", 0, 0],
                    },
                }}
                speed={1200}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                loop={true}
                onSlideChangeTransitionStart={handleSlideChange}
                onInit={(swiper) => {
                    setTimeout(() => handleSlideChange(swiper), 300);
                }}
                className="h-100 w-100"
            >
                {slidersToDisplay?.map((elm, i) => (
                    <SwiperSlide
                        key={i}
                        className="h-100 w-100 position-relative overflow-hidden"
                    >
                        {/* Background Image */}
                        <div className="position-absolute top-0 start-0 w-100 h-100">
                            <Image
                                priority={i === 0}
                                quality={85}
                                sizes="100vw"
                                loading={i === 0 ? "eager" : "lazy"}
                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                                alt={elm.title || "Hero Image"}
                                fill
                                className="gsap-bg"
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center center",
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="container h-100 position-relative">
                            <div className="row h-100 align-items-center">
                                <div className="col-lg-6 col-md-8 px-4 px-md-5">

                                    {/* Season */}
                                    {elm.season && (
                                        <div className="overflow-hidden mb-4">
                                            <div className="gsap-text d-inline-flex align-items-center gap-2">
                                                <span
                                                    style={{
                                                        display: "block",
                                                        width: "28px",
                                                        height: "1px",
                                                        background:
                                                            elm.color || "#fff",
                                                        opacity: 0.7,
                                                    }}
                                                />

                                                <span
                                                    style={{
                                                        color:
                                                            elm.color || "#fff",
                                                        letterSpacing: "5px",
                                                        fontSize: "0.78rem",
                                                        fontFamily:
                                                            "sans-serif",
                                                        textTransform:
                                                            "uppercase",
                                                        opacity: 0.85,
                                                    }}
                                                >
                                                    {t(elm.season)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Title */}
                                    {elm.title && (
                                        <div className="overflow-hidden">
                                            <h1
                                                className="gsap-text fw-normal text-uppercase mb-n2"
                                                style={{
                                                    color:
                                                        elm.color || "#fff",
                                                    fontSize:
                                                        "clamp(3rem, 7vw, 5.5rem)",
                                                    lineHeight: 1.05,
                                                    letterSpacing: "1px",
                                                    textShadow:
                                                        "0 4px 20px rgba(0,0,0,0.5)",
                                                    fontFamily:
                                                        '"Playfair Display", serif',
                                                }}
                                            >
                                                {t(elm.title)}
                                            </h1>
                                        </div>
                                    )}

                                    {/* Subtitle */}
                                    {elm.sub_title && (
                                        <div className="overflow-hidden mb-5">
                                            <h2
                                                className="gsap-text fw-light text-uppercase"
                                                style={{
                                                    color:
                                                        elm.color || "#e8e8e8",
                                                    fontSize:
                                                        "clamp(1.6rem, 4vw, 3rem)",
                                                    lineHeight: 1.15,
                                                    fontFamily:
                                                        '"Playfair Display", serif',
                                                    letterSpacing: "2px",
                                                    marginLeft: "2%",
                                                }}
                                            >
                                                {t(elm.sub_title)}
                                            </h2>
                                        </div>
                                    )}

                                    {/* Button */}
                                    {elm.title && (
                                        <div className="mt-4">
                                            <Link
                                                href={`/${locale}/${elm.link || "#"}`}
                                                className="gsap-text unique-btn-modern text-uppercase d-inline-flex align-items-center text-decoration-none"
                                            >
                                                <span
                                                    className="btn-text-content fw-medium d-flex align-items-center"
                                                    style={{
                                                        color:
                                                            elm.color || "#fff",
                                                        letterSpacing: "3px",
                                                        fontSize: "0.82rem",
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail Strip */}
            <div className="hero-thumb-strip">
                {homeSliders?.map((elm, i) => (
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
                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
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
                    padding: 0.9rem 2.8rem;
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
                    font-size: clamp(2.5rem, 8vw, 5rem) !important;
                    line-height: 1.2 !important;
                }
                [dir='rtl'] h2.gsap-text {
                    font-size: clamp(1.4rem, 5vw, 2.5rem) !important;
                    line-height: 1.3 !important;
                    margin-left: 0 !important;
                    margin-right: 2% !important;
                }
                [dir='rtl'] .btn-text-content {
                    letter-spacing: 0 !important;
                    font-size: 0.95rem !important;
                }
                [dir='rtl'] .gsap-text span {
                    letter-spacing: 0 !important;
                    font-size: 0.9rem !important;
                }
            `}</style>
        </div>
    );
};

export default NewHero;