"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import gsap from "gsap";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

const SLIDES_DATA = [
    {
        id: 0,
        name: "Zumar",
        tagline: "SILLAGE OF POWER",
        subtitle: "A symphony of rare oriental notes, crafted for those who embrace silent power.",
        noteImg: "/assets/images/best-sellers/notes/zumar@2x.jpg",
        productImg: "/assets/images/best-sellers/zumar@2x.jpg",
        link: "/shop/perfumes/oriental-fragrance/zumar",
        theme: { bg: "#0f0c08", accent: "#c5a059", glow: "rgba(197, 160, 89, 0.2)", roman: "I" }
    },
    {
        id: 1,
        name: "Bin Shaikh",
        tagline: "ROYAL HERITAGE",
        subtitle: "Concocted in the traditions of royalty, a lavish blend that speaks of legacy.",
        noteImg: "/assets/images/best-sellers/notes/binshaikh@2x.jpg",
        productImg: "/assets/images/best-sellers/bin-shaikh@2x.jpg",
        link: "/shop/perfumes/oriental-fragrance/bin-shaikh",
        theme: { bg: "#0d0a0f", accent: "#8a59c5", glow: "rgba(138, 89, 197, 0.15)", roman: "II" }
    },
    {
        id: 2,
        name: "Ignite Oud",
        tagline: "FIERY INSTINCT",
        subtitle: "A bold, fiery fragrance designed to set your senses ablaze with deep oud trails.",
        noteImg: "/assets/images/best-sellers/notes/ignite-oud@2x.jpg",
        productImg: "/assets/images/best-sellers/ignite-oud@2x.jpg",
        link: "/shop/perfumes/occidental-fragrance/ignite-oud",
        theme: { bg: "#0f0505", accent: "#e63946", glow: "rgba(230, 57, 70, 0.2)", roman: "III" }
    },
    {
        id: 3,
        name: "Marj",
        tagline: "PURE AFFECTION",
        subtitle: "The very essence of sheer elegance and romantic affection, captured in a bottle.",
        noteImg: "/assets/images/best-sellers/notes/marj@2x.jpg",
        productImg: "/assets/images/best-sellers/marj@2x.jpg",
        link: "/shop/perfumes/oriental-fragrance/marj",
        theme: { bg: "#0f0a0d", accent: "#ffb7c5", glow: "rgba(255, 183, 197, 0.2)", roman: "IV" }
    },
    {
        id: 4,
        name: "Oud & Roses",
        tagline: "FLORAL OUD",
        subtitle: "Like a lush spring garden at dawn, where fresh roses meet prehistoric oud.",
        noteImg: "/assets/images/best-sellers/notes/oud-and-rose@2x.jpg",
        productImg: "/assets/images/best-sellers/oud-and-roses@2x.jpg",
        link: "/shop/perfumes/occidental-fragrance/oud-roses",
        theme: { bg: "#0a0f0c", accent: "#d4af37", glow: "rgba(212, 175, 55, 0.2)", roman: "V" }
    },
    {
        id: 5,
        name: "Kaaf",
        tagline: "SECRET CHARM",
        subtitle: "A secret charm, enticing and mysterious, crafted to leave a lasting impression.",
        noteImg: "/assets/images/best-sellers/notes/kaaf@2x.jpg",
        productImg: "/assets/images/best-sellers/kaaf@2x.jpg",
        link: "/shop/perfumes/oriental-fragrance/kaaf",
        theme: { bg: "#050a0f", accent: "#598ac5", glow: "rgba(89, 138, 197, 0.2)", roman: "VI" }
    }
];

const MasterPerfumerGallery = ({ prodSlide }) => {
    const locale = useLocale();
    const t = useTranslations();
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const slides = useMemo(() => {
        if (prodSlide === "bestSellers") return SLIDES_DATA;
        return [
            {
                id: -1,
                name: "Maria Oud",
                tagline: "ARABIAN NIGHTS",
                subtitle: "A heritage of exotic scents, bringing the rich history of Arabia to the modern day.",
                noteImg: "/assets/images/dakhoon/oud-mtr/maria-horizontal.jpg",
                productImg: "/assets/images/dakhoon/oud-mtr/maria-1080.jpg",
                link: "/shop/dakhoon/oud-maattar/oud-mtr-asaateen",
                theme: { bg: "#0a0a0d", accent: "#c5a059", glow: "rgba(197, 160, 89, 0.15)", roman: "O" }
            },
            ...SLIDES_DATA.slice(1)
        ];
    }, [prodSlide]);



    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        if (cursorRef.current) {
            gsap.to(cursorRef.current, { x: x, y: y, duration: 0.2, ease: "power2.out" });
        }

        const currentBottle = containerRef.current.querySelector(".swiper-slide-active .master-bottle");
        if (currentBottle) {
            const xRotation = (y / height - 0.5) * -20;
            const yRotation = (x / width - 0.5) * 20;
            gsap.to(currentBottle, {
                rotateX: xRotation,
                rotateY: yRotation,
                x: (x / width - 0.5) * 30,
                y: (y / height - 0.5) * 30,
                duration: 1,
                ease: "power2.out"
            });
        }
    };

    const onSlideChange = (swiper) => {
        const index = swiper.realIndex;
        setActiveIndex(index);
        


        const currentSlide = swiper.slides[swiper.activeIndex];
        const titleElements = currentSlide.querySelectorAll(".stagger-row span");
        const subtitle = currentSlide.querySelector(".master-desc");
        const bottle = currentSlide.querySelector(".master-bottle");
        const shards = currentSlide.querySelectorAll(".ingredient-shard");

        gsap.to(containerRef.current, {
            backgroundColor: slides[index].theme.bg,
            duration: 1.2,
            ease: "expo.out"
        });

        gsap.fromTo(titleElements,
            { y: "100%", opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.04, ease: "expo.out", delay: 0.2 }
        );

        gsap.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.6 });

        gsap.fromTo(bottle,
            { y: 40, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
        );

        shards.forEach((shard, i) => {
            gsap.fromTo(shard, 
                { opacity: 0, scale: 0.8, x: (i % 2 === 0 ? -100 : 100) },
                { opacity: 0.3, scale: 1, x: 0, duration: 2, delay: 0.6 + (i * 0.2), ease: "power2.out" }
            );
        });
    };

    return (
        <section 
            ref={containerRef}
            className="master-gallery-section"
            onMouseMove={handleMouseMove}
        >


            <div ref={cursorRef} className="master-cursor-wrap">
                <div className="master-flashlight" style={{ borderColor: slides[activeIndex].theme.glow }}></div>
            </div>

            <style jsx global>{`
                .master-gallery-section {
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    overflow: hidden;
                    background-color: #0d0a0f;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0;
                    padding: 0;
                }

                @media (max-width: 991px) {
                    .master-gallery-section { padding: 40px 0 100px; }
                }

                .master-cursor-wrap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                    z-index: 1000;
                    mix-blend-mode: screen;
                    display: block;
                }

                @media (max-width: 991px) { .master-cursor-wrap { display: none; } }

                .master-flashlight {
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
                    border: 1px solid transparent;
                    transition: border-color 1s ease;
                }

                .master-swiper { width: 100%; height: 100%; }
                .master-slide { display: flex; align-items: center; justify-content: center; position: relative; width: 100%; height: 100vh; }
                
                @media (max-width: 991px) {
                    .master-slide { height: auto; min-height: 100vh; }
                }

                .master-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    width: 100%;
                    max-width: 1400px;
                    padding: 0 80px;
                    z-index: 10;
                    align-items: center;
                }

                @media (max-width: 991px) {
                    .master-grid { 
                        grid-template-columns: 1fr; 
                        grid-template-rows: auto auto;
                        text-align: center; 
                        padding: 0 20px;
                        gap: 20px;
                    }
                }

                .master-text-col { display: flex; flex-direction: column; gap: 30px; }
                @media (max-width: 991px) { .master-text-col { order: 2; padding-bottom: 40px; } }

                .master-tagline {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.8rem;
                    letter-spacing: 8px;
                    color: var(--accent-color);
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .master-title-wrap { overflow: hidden; padding-bottom: 4px; }
                .stagger-row { display: block; overflow: hidden; margin: -6px 0; }
                .stagger-row span {
                    display: inline-block;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(3rem, 8vw, 7rem);
                    font-weight: 700;
                    color: #fff;
                    line-height: 1;
                    text-shadow: 0 0 60px rgba(255,255,255,0.15);
                }

                .master-desc {
                    font-family: 'Inter', sans-serif;
                    font-size: 1.05rem;
                    color: rgba(255,255,255,0.65);
                    max-width: 480px;
                    line-height: 1.9;
                    font-weight: 300;
                    letter-spacing: 0.3px;
                }

                @media (max-width: 991px) { .master-desc { margin: 0 auto; font-size: 1rem; line-height: 1.6; } }

                /* Large Background Kinetic Typography */
                .kinetic-bg-text {
                    position: absolute;
                    font-family: 'Playfair Display', serif;
                    font-size: 35vw;
                    font-weight: 900;
                    color: rgba(255,255,255,0.03);
                    z-index: 1;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    text-transform: uppercase;
                    white-space: nowrap;
                    letter-spacing: -2vw;
                }

                @media (max-width: 991px) { .kinetic-bg-text { font-size: 20vw; top: 30%; } }

                /* Visual Column — Full Photo Panel */
                .master-visual-col {
                    position: relative;
                    perspective: 3000px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    overflow: hidden;
                }

                @media (max-width: 991px) { .master-visual-col { order: 1; min-height: 50vh; } }

                /* Full-bleed ambient photo panel */
                .note-panel {
                    position: absolute;
                    inset: -10% -5%;
                    border-radius: 20px;
                    overflow: hidden;
                    z-index: 1;
                }

                .note-panel-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: saturate(0.9) brightness(0.75);
                    transition: transform 1.4s ease;
                }

                /* Gradient fades on left and top edges so it bleeds into dark bg */
                .note-panel::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        linear-gradient(to right, var(--panel-fade-color, #0f0c08) 0%, transparent 35%),
                        linear-gradient(to bottom, var(--panel-fade-color, #0f0c08) 0%, transparent 20%),
                        linear-gradient(to top, var(--panel-fade-color, #0f0c08) 0%, transparent 20%);
                    z-index: 2;
                }

                /* Accent glow behind bottle */
                .bottle-glow {
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    background: var(--bottle-glow, rgba(197,160,89,0.2));
                    filter: blur(80px);
                    z-index: 3;
                    pointer-events: none;
                }

                .master-bottle {
                    position: relative;
                    z-index: 10;
                    max-height: 80vh;
                    width: auto;
                    filter: drop-shadow(0 30px 80px rgba(0,0,0,0.7));
                    transform-style: preserve-3d;
                }

                @media (max-width: 991px) {
                    .master-bottle { max-height: 42vh; }
                    .note-panel { border-radius: 0; inset: 0; }
                }

                /* Roman Navigation Optimized for Mobile */
                .master-nav {
                    position: absolute;
                    left: 50%;
                    bottom: 60px;
                    transform: translateX(-50%);
                    z-index: 150;
                    display: flex;
                    align-items: center;
                    gap: 60px;
                    background: rgba(255,255,255,0.03);
                    backdrop-filter: blur(20px);
                    padding: 15px 40px;
                    border-radius: 100px;
                    border: 1px solid rgba(255,255,255,0.05);
                    width: auto;
                    transition: all 0.5s ease;
                }

                @media (max-width: 991px) {
                    .master-nav { 
                        bottom: 20px; 
                        gap: 30px; 
                        padding: 10px 25px;
                        width: 90%;
                        max-width: 350px;
                        justify-content: space-between;
                    }
                }

                .roman-counter {
                    font-family: 'Playfair Display', serif;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .roman-current { font-size: 2.5rem; font-weight: 700; color: var(--accent-color); font-style: italic; }
                @media (max-width: 991px) { .roman-current { font-size: 1.8rem; } }
                .roman-line { width: 30px; height: 1px; background: rgba(255,255,255,0.2); }
                .roman-total { font-size: 0.9rem; opacity: 0.3; letter-spacing: 2px; }

                .master-arrows { display: flex; gap: 15px; }
                @media (max-width: 991px) { .master-arrows { gap: 10px; } }

                .master-arrow {
                    width: 70px;
                    height: 70px;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #fff;
                    background: rgba(255,255,255,0.02);
                    backdrop-filter: blur(20px);
                    transition: all 0.4s ease;
                }

                @media (max-width: 991px) { .master-arrow { width: 50px; height: 50px; } .master-arrow svg { width: 20px; height: 20px; } }
                .master-arrow:hover { background: #fff; color: #000; }

                /* Master Button */
                .master-btn {
                    margin-top: 10px;
                    padding: 22px 55px;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 5px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 0;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.5s ease;
                }

                @media (max-width: 991px) { .master-btn { padding: 15px 35px; letter-spacing: 3px; font-size: 0.7rem; } }
                .master-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 0; height: 100%;
                    background: #fff;
                    z-index: -1;
                    transition: width 0.5s ease;
                }
                .master-btn:hover { color: #000; letter-spacing: 8px; border-color: #fff; }
                .master-btn:hover::before { width: 100%; }
            `}</style>

            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1200}
                onInit={(swiper) => {
                    swiperRef.current = swiper;
                    onSlideChange(swiper);
                }}
                onSlideChange={onSlideChange}
                className="master-swiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id} className="master-slide">
                        <div className="kinetic-bg-text d-none d-lg-block">{slide.name}</div>
                        <div className="master-grid">
                            <div className="master-text-col">
                                <span className="master-tagline" style={{ "--accent-color": slide.theme.accent }}>
                                    {slide.tagline}
                                </span>
                                <div className="master-title-wrap">
                                    <div className="stagger-row">
                                        <span>{t(slide.name)}</span>
                                    </div>
                                </div>
                                <p className="master-desc">
                                    {t(slide.subtitle)}
                                </p>
                                <div>
                                    <Link href={`/${locale}${slide.link}`}>
                                        <button className="master-btn">
                                            {t("Discover the Note")}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="master-visual-col">
                                {/* Full atmospheric photo panel */}
                                <div 
                                    className="note-panel"
                                    style={{ "--panel-fade-color": slide.theme.bg }}
                                >
                                    <img src={slide.noteImg} className="note-panel-img" alt={slide.name + " notes"} />
                                </div>

                                {/* Accent glow orb behind bottle */}
                                <div 
                                    className="bottle-glow"
                                    style={{ "--bottle-glow": slide.theme.glow }}
                                ></div>

                                <img 
                                    src={slide.productImg} 
                                    className="master-bottle" 
                                    alt={slide.name} 
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="master-nav">
                <div className="roman-counter" style={{ "--accent-color": slides[activeIndex].theme.accent }}>
                    <span className="roman-current">{slides[activeIndex].theme.roman}</span>
                    <div className="roman-line"></div>
                    <span className="roman-total d-none d-md-block">{slides.length} EDITIONS</span>
                </div>
                <div className="master-arrows">
                    <div className="master-arrow" onClick={() => swiperRef.current?.slidePrev()}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <div className="master-arrow" onClick={() => swiperRef.current?.slideNext()}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MasterPerfumerGallery;
