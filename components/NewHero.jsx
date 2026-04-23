"use client";
import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import Image from "next/image";
import Link from "next/link";
import { useMenu } from "@/context/MenuContext";
import { useLocale, useTranslations } from "next-intl";
import Pagination1 from "@/components/common/Pagination1";

const NewHero = () => {
    const locale = useLocale();
    const t = useTranslations();
    const swiperRef = useRef(null);
    const { homeSliders, isLoading, error } = useMenu();
    const [activeIndex, setActiveIndex] = useState(0);
    const [progressKey, setProgressKey] = useState(0); // Forces SVG animation restart

    if (isLoading) return <div><Pagination1 /></div>;
    if (error) return <div>{error}</div>;

    const total = homeSliders?.length || 0;

    const handleSlideChange = (swiper) => {
        if (!swiper || !swiper.slides) return;
        const realIndex = swiper.realIndex;
        setActiveIndex(realIndex);
        setProgressKey(prev => prev + 1); // Restart ring animation

        const activeSlide = swiper.slides[swiper.activeIndex];
        if (!activeSlide) return;

        const texts = activeSlide.querySelectorAll('.gsap-text');
        const bg = activeSlide.querySelector('.gsap-bg');

        gsap.fromTo(texts,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: "power4.out", delay: 0.4 }
        );

        gsap.fromTo(bg,
            { scale: 1.12, transformOrigin: 'center center' },
            { scale: 1, duration: 6, ease: "power1.out" }
        );
    };

    const goToSlide = (index) => {
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.slideToLoop(index);
        }
    };

    return (
        <div className="new-hero-wrapper position-relative w-100 vh-100 overflow-hidden bg-black text-white">
            <Swiper
                ref={swiperRef}
                modules={[Autoplay, EffectCreative]}
                effect="creative"
                creativeEffect={{
                    prev: { shadow: true, translate: ['-20%', 0, -1], opacity: 0 },
                    next: { translate: ['100%', 0, 0] },
                }}
                speed={1200}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                onSlideChangeTransitionStart={handleSlideChange}
                onInit={(swiper) => { setTimeout(() => handleSlideChange(swiper), 300); }}
                className="h-100 w-100"
            >
                {homeSliders?.map((elm, i) => (
                    <SwiperSlide key={i} className="h-100 w-100 position-relative overflow-hidden">

                        {/* Background Image */}
                        <div className="position-absolute top-0 start-0 w-100 h-100">
                            <Image
                                loading={i === 0 ? "eager" : "lazy"}
                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                                alt={elm.title || "Hero Image"}
                                fill
                                className="gsap-bg"
                                style={{ objectFit: 'cover' }}
                            />
                            {/* Left Gradient for text contrast */}
                            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                                background: 'linear-gradient(105deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0) 100%)'
                            }} />
                        </div>

                        {/* Text Content */}
                        <div className="container h-100 position-relative">
                            <div className="row h-100 align-items-center">
                                <div className="col-lg-6 col-md-8 px-4 px-md-5">

                                    {elm.season && (
                                        <div className="overflow-hidden mb-4">
                                            <div className="gsap-text d-inline-flex align-items-center gap-2">
                                                <span style={{
                                                    display: 'block', width: '28px', height: '1px',
                                                    background: elm.color || '#fff', opacity: 0.7
                                                }}></span>
                                                <span style={{
                                                    color: elm.color || '#fff', letterSpacing: '5px',
                                                    fontSize: '0.78rem', fontFamily: 'sans-serif',
                                                    textTransform: 'uppercase', opacity: 0.85
                                                }}>{t(elm.season)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {elm.title && (
                                        <div className="overflow-hidden">
                                            <h1 className="gsap-text fw-normal text-uppercase mb-n2" style={{
                                                color: elm.color || '#fff',
                                                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                                                lineHeight: 1.05,
                                                letterSpacing: '1px',
                                                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                                fontFamily: '"Playfair Display", "Times New Roman", Times, serif'
                                            }}>{t(elm.title)}</h1>
                                        </div>
                                    )}

                                    {elm.sub_title && (
                                        <div className="overflow-hidden mb-5">
                                            <h2 className="gsap-text fw-light text-uppercase" style={{
                                                color: elm.color || '#e8e8e8',
                                                fontSize: 'clamp(1.6rem, 4vw, 3rem)',
                                                lineHeight: 1.15,
                                                fontFamily: '"Playfair Display", "Times New Roman", Times, serif',
                                                letterSpacing: '2px',
                                                marginLeft: '2%'
                                            }}>{t(elm.sub_title)}</h2>
                                        </div>
                                    )}

                                    {elm.title && (
                                        <div className="mt-4">
                                            <Link
                                                href={`/${locale}/${elm.link || '#'}`}
                                                className="gsap-text unique-btn-modern text-uppercase d-inline-flex align-items-center text-decoration-none"
                                            >
                                                <span className="btn-text-content fw-medium d-flex align-items-center"
                                                    style={{ color: elm.color || '#fff', letterSpacing: '3px', fontSize: '0.82rem' }}>
                                                    {t("Discover More")}
                                                    <svg className="ms-3 btn-icon-content" width="16" height="16"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

            {/* ── Unique Vertical Thumbnail Strip Pagination ── */}
            <div className="hero-thumb-strip">
                {homeSliders?.map((elm, i) => (
                    <button
                        key={i}
                        className={`hero-thumb-item ${i === activeIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                    >
                        {/* Thumbnail image */}
                        <div className="thumb-img-wrap">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                                alt={elm.title || `Slide ${i + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            {/* Dark overlay on inactive */}
                            <div className="thumb-overlay" />
                            {/* Active progress bar */}
                            {i === activeIndex && (
                                <div className="thumb-progress-bar">
                                    <div key={progressKey} className="thumb-progress-fill" />
                                </div>
                            )}
                        </div>
                        {/* Slide number */}
                        <span className="thumb-number">0{i + 1}</span>
                    </button>
                ))}
            </div>

            {/* ── Slide Counter (bottom-left) ── */}
            <div className="hero-slide-counter">
                <span className="counter-current">0{activeIndex + 1}</span>
                <span className="counter-sep"> / </span>
                <span className="counter-total">0{total}</span>
            </div>

            <style jsx global>{`
                /* ─── Vertical Thumbnail Strip ─── */
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
                    transition: opacity 0.4s ease, transform 0.4s ease;
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
                    transition: border-color 0.4s ease;
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

                /* Bottom progress bar inside active thumb */
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
                    from { width: 0%; }
                    to   { width: 100%; }
                }

                .thumb-number {
                    font-size: 0.6rem;
                    color: rgba(255,255,255,0.6);
                    font-family: sans-serif;
                    letter-spacing: 1px;
                }

                .hero-thumb-item.active .thumb-number {
                    color: #fff;
                }

                /* ─── Bottom-Left Slide Counter ─── */
                .hero-slide-counter {
                    position: absolute;
                    bottom: 40px;
                    left: 50px;
                    z-index: 100;
                    font-family: "Playfair Display", serif;
                    color: rgba(255,255,255,0.8);
                    user-select: none;
                }

                .counter-current {
                    font-size: 2.5rem;
                    font-weight: 300;
                    color: #fff;
                    line-height: 1;
                }

                .counter-sep {
                    font-size: 1rem;
                    color: rgba(255,255,255,0.3);
                    margin: 0 5px;
                    vertical-align: middle;
                }

                .counter-total {
                    font-size: 1rem;
                    color: rgba(255,255,255,0.4);
                    vertical-align: middle;
                }

                @media (max-width: 768px) {
                    .hero-thumb-strip { display: none; }
                    .hero-slide-counter {
                        bottom: 20px;
                        left: 20px;
                    }
                    .counter-current { font-size: 1.8rem; }
                }

                /* ─── Ultra-Modern Luxury Button ─── */
                .unique-btn-modern {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    padding: 0.9rem 2.8rem;
                    border-radius: 50px;
                    background: rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    overflow: hidden;
                    transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
                }

                .unique-btn-modern::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        120deg,
                        transparent,
                        rgba(201, 151, 64, 0.35),
                        rgba(201, 151, 64, 0.75),
                        rgba(201, 151, 64, 0.35),
                        transparent
                    );
                    transition: left 0.8s cubic-bezier(0.19, 1, 0.22, 1);
                    z-index: 0;
                }

                .unique-btn-modern:hover {
                    box-shadow: 0 0 30px rgba(201, 151, 64, 0.25);
                    transform: translateY(-2px) scale(1.01);
                    border-color: rgba(201, 151, 64, 0.5);
                }

                .unique-btn-modern:hover::before { left: 100%; transition: left 1.2s cubic-bezier(0.19, 1, 0.22, 1); }

                .unique-btn-modern .btn-text-content {
                    position: relative;
                    z-index: 1;
                    transition: all 0.5s ease;
                }

                .unique-btn-modern .btn-icon-content {
                    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                }

                .unique-btn-modern:hover .btn-text-content {
                    letter-spacing: 4px;
                    color: #fff !important;
                }

                .unique-btn-modern:hover .btn-icon-content {
                    transform: translateX(6px);
                }

                .mb-n2 {
                    margin-bottom: -0.5rem !important;
                }
            `}</style>
        </div>
    );
};

export default NewHero;
