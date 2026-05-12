"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import gsap from "gsap";
import { useContextElement } from "@/context/Context";

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
        theme: { bg: "#F9F6F0", accent: "rgba(197, 160, 89, 1)", glow: "rgba(197, 160, 89, 0.15)", roman: "I" }
    },
    {
        id: 1,
        name: "Bin Shaikh",
        tagline: "ROYAL HERITAGE",
        subtitle: "Concocted in the traditions of royalty, a lavish blend that speaks of legacy.",
        noteImg: "/assets/images/best-sellers/notes/binshaikh@2x.jpg",
        productImg: "/assets/images/best-sellers/bin-shaikh@2x.jpg",
        link: "/shop/perfumes/oriental-fragrance/bin-shaikh",
        theme: { bg: "#F4EFEA", accent: "#8a59c5", glow: "rgba(138, 89, 197, 0.1)", roman: "II" }
    },
    {
        id: 2,
        name: "Ignite Oud",
        tagline: "FIERY INSTINCT",
        subtitle: "A bold, fiery fragrance designed to set your senses ablaze with deep oud trails.",
        noteImg: "/assets/images/best-sellers/notes/ignite-oud@2x.jpg",
        productImg: "/assets/images/best-sellers/ignite-oud@2x.jpg",
        link: "/shop/perfumes/occidental-fragrance/ignite-oud",
        theme: { bg: "rgba(253, 251, 247, 1)", accent: "rgba(230, 57, 70, 1)", glow: "rgba(230, 57, 70, 0.1)", roman: "III" }
    },
    {
        id: 3,
        name: "Marj",
        tagline: "PURE AFFECTION",
        subtitle: "The very essence of sheer elegance and romantic affection, captured in a bottle.",
        noteImg: "/assets/images/best-sellers/notes/marj@2x.jpg",
        productImg: "/assets/images/best-sellers/marj@2x.jpg",
        link: "/shop/perfumes/oriental-fragrance/marj",
        theme: { bg: "#F8F1F2", accent: "#ffb7c5", glow: "rgba(255, 183, 197, 0.15)", roman: "IV" }
    },
    {
        id: 4,
        name: "Oud & Roses",
        tagline: "FLORAL OUD",
        subtitle: "Like a lush spring garden at dawn, where fresh roses meet prehistoric oud.",
        noteImg: "/assets/images/best-sellers/notes/oud-and-rose@2x.jpg",
        productImg: "/assets/images/best-sellers/oud-and-roses@2x.jpg",
        link: "/shop/perfumes/occidental-fragrance/oud-roses",
        theme: { bg: "#FCF9F2", accent: "#d4af37", glow: "rgba(212, 175, 55, 0.15)", roman: "V" }
    },
    {
        id: 5,
        name: "Kaaf",
        tagline: "SECRET CHARM",
        subtitle: "A secret charm, enticing and mysterious, crafted to leave a lasting impression.",
        noteImg: "/assets/images/best-sellers/notes/kaaf@2x.jpg",
        productImg: "/assets/images/best-sellers/kaaf@2x.jpg",
        link: "/shop/perfumes/oriental-fragrance/kaaf",
        theme: { bg: "rgba(242, 245, 248, 1)", accent: "#598ac5", glow: "rgba(89, 138, 197, 0.15)", roman: "VI" }
    }
];

const MasterPerfumerGallery = ({ prodSlide }) => {
    const locale = useLocale();
    const t = useTranslations();
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const { addProductToCart } = useContextElement();
    const [activeIndex, setActiveIndex] = useState(0);
    const [fetchedSlides, setFetchedSlides] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchDynamicSlides = async () => {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
                const apiUrl = `${apiBase}api/new-product-sliders?lang=${locale}`;
                console.log("Calling New Product Slider API:", apiUrl);
                const res = await fetch(apiUrl);
                const json = await res.json();
                if (isMounted && json && !json.error && json.data?.length > 0) {
                    const mapped = json.data.map((item) => ({
                        id: item.id,
                        name: item.name,
                        tagline: item.category || "LUXURY CREATION",
                        subtitle: item.desc || "",
                        noteImg: item.noteImg || "/assets/images/best-sellers/notes/zumar@2x.jpg",
                        productImg: item.productImg || "/assets/images/best-sellers/zumar@2x.jpg",
                        link: item.link || "/shop",
                        theme: {
                            bg: item.theme?.bg || "#FDFBF7",
                            accent: item.theme?.accent || "#c5a059",
                            glow: item.theme?.glow || "rgba(197, 160, 89, 0.15)",
                            roman: item.theme?.roman || "I"
                        },
                        product: item.product // Store the full product object for Add to Cart
                    }));
                    setFetchedSlides(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch dynamic new product sliders:", err);
            }
        };
        fetchDynamicSlides();
        return () => { isMounted = false; };
    }, [locale]);

    const slides = useMemo(() => {
        if (fetchedSlides.length > 0) return fetchedSlides;
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
                theme: { bg: "#FAF3EB", accent: "#c5a059", glow: "rgba(197, 160, 89, 0.15)", roman: "O" }
            },
            ...SLIDES_DATA.slice(1)
        ];
    }, [prodSlide, fetchedSlides]);



    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        if (cursorRef.current) {
            gsap.to(cursorRef.current, { x: x, y: y, duration: 0.2, ease: "power2.out" });
        }

        const currentSecondary = containerRef.current.querySelector(".swiper-slide-active .secondary-photo");
        if (currentSecondary) {
            const xRotation = (y / height - 0.5) * -15;
            const yRotation = (x / width - 0.5) * 15;
            gsap.to(currentSecondary, {
                rotateX: xRotation,
                rotateY: yRotation,
                x: (x / width - 0.5) * 20,
                y: (y / height - 0.5) * 20,
                duration: 1,
                ease: "power2.out"
            });
        }
    };

    const onSlideChange = (swiper) => {
        const index = swiper.realIndex;
        setActiveIndex(index);



        const currentSlide = swiper.slides[swiper.activeIndex];
        const prevSlide = swiper.slides[swiper.previousIndex];

        // Animate out the old text aggressively so it clears the space
        if (prevSlide && swiper.activeIndex !== swiper.previousIndex) {
            const oldTitleElements = prevSlide.querySelectorAll(".stagger-row span");
            const oldSubtitle = prevSlide.querySelector(".master-desc");
            const oldTagline = prevSlide.querySelector(".master-tagline");

            gsap.to([oldTitleElements, oldSubtitle, oldTagline], {
                opacity: 0,
                y: -30,
                duration: 0.5,
                ease: "power2.in"
            });
        }

        const titleElements = currentSlide.querySelectorAll(".stagger-row span");
        const subtitle = currentSlide.querySelector(".master-desc");
        const tagline = currentSlide.querySelector(".master-tagline");
        const primary = currentSlide.querySelector(".primary-photo img");
        const secondary = currentSlide.querySelector(".secondary-photo");

        gsap.to(containerRef.current, {
            backgroundColor: slides[index].theme.bg,
            duration: 1.4,
            ease: "sine.inOut"
        });

        // Delay entry to 0.8s so old text is gone and cross-fade is 60% complete
        gsap.fromTo(tagline, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 1.2, delay: 0.7, ease: "power2.out" });

        gsap.fromTo(titleElements,
            { y: "100%", opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "power3.out", delay: 0.8 }
        );

        gsap.fromTo(subtitle, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.2, delay: 1.0, ease: "power3.out" });

        if (primary) {
            gsap.fromTo(primary,
                { scale: 1.05 },
                { scale: 1, duration: 5, ease: "sine.out", delay: 0 }
            );
        }

        if (secondary) {
            gsap.fromTo(secondary,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.5, delay: 0.5, ease: "power2.out" }
            );
        }
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

            <div className="best-sellers-header-wrap">
                <span className="best-sellers-tagline">{t("Premium Collection")}</span>
                <h2 className="best-sellers-heading">
                    {t("Best Sellers")}
                </h2>
                <p className="best-sellers-desc">
                    {t("Discover our most loved and highly sought-after signature creations.")}
                </p>
                <div className="best-sellers-line"></div>
            </div>

            <style jsx global>{`
                .master-gallery-section {
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    overflow: hidden;
                    background-color: #FDFBF7;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0;
                    padding: 0;
                }

                @media (max-width: 991px) {
                    .master-gallery-section {
                        padding: 0 0 40px;
                        min-height: auto;
                        height: auto;
                        overflow: visible;
                        display: block;
                    }
                }

                .best-sellers-header-wrap {
                    position: absolute;
                    top: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 200;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .best-sellers-tagline {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 4px;
                    color: #A69F92;
                    text-transform: uppercase;
                }

                .best-sellers-heading {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.8rem;
                    font-weight: 500;
                    color: #1D1B19;
                    font-style: italic;
                    margin: 0;
                    line-height: 1.2;
                }

                .best-sellers-desc {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem;
                    color: #5A554A;
                    margin-top: 5px;
                    max-width: 450px;
                    line-height: 1.5;
                }

                .best-sellers-line {
                    width: 40px;
                    height: 2px;
                    background: #1D1B19;
                    margin-top: 10px;
                    opacity: 0.8;
                }

                @media (max-width: 991px) {
                    .best-sellers-header-wrap {
                        position: absolute;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        gap: 3px;
                        width: 100%;
                        padding: 0 20px;
                    }
                    .best-sellers-tagline { font-size: 0.58rem; letter-spacing: 3px; }
                    .best-sellers-heading { font-size: 1.45rem; }
                    .best-sellers-desc { font-size: 0.8rem; max-width: 90%; margin-top: 3px; line-height: 1.35; }
                    .best-sellers-line { width: 28px; height: 1px; margin-top: 5px; }
                }
                @media (max-width: 480px) {
                    .best-sellers-heading { font-size: 1.25rem; }
                    .best-sellers-desc { font-size: 0.74rem; }
                }

                .master-cursor-wrap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                    z-index: 1000;
                    mix-blend-mode: multiply;
                    display: block;
                }

                @media (max-width: 991px) { .master-cursor-wrap { display: none; } }

                .master-flashlight {
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%);
                    border: 1px solid transparent;
                    transition: border-color 1s ease;
                }

                .master-swiper { width: 100%; height: 100%; }
                .master-slide { display: flex; align-items: center; justify-content: center; position: relative; width: 100%; height: auto; min-height: 100vh; }
                
                @media (max-width: 991px) {
                    .master-slide {
                        height: auto;
                        min-height: auto;
                        padding: 0;
                        display: block;
                        background: transparent;
                    }
                }
                @media (max-width: 991px) { .master-swiper { background: transparent; } }

                .master-grid, .global-cta-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    width: 100%;
                    max-width: 1400px;
                    padding: 0 40px;
                    z-index: 10;
                    align-items: center;
                }

                @media (max-width: 991px) {
                    .master-grid, .global-cta-grid {
                        display: block;
                        padding: 0;
                        width: 100%;
                    }
                }

                .master-text-col, .global-cta-text-col { display: flex; flex-direction: column; gap: 10px; z-index: 5; }
                @media (max-width: 991px) { 
                    .master-text-col { display: none; }
                }

                .master-tagline {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.8rem;
                    letter-spacing: 8px;
                    color: var(--accent-color);
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .master-title-wrap { overflow: hidden; padding-bottom: 15px; }
                .stagger-row { display: block; overflow: hidden; margin: 0; }
                .stagger-row span {
                    display: inline-block;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(3.5rem, 7vw, 6rem);
                    font-weight: 700;
                    color: #1D1B19;
                    line-height: 1.1;
                    letter-spacing: -1px;
                }
                
                @media (max-width: 991px) { .stagger-row span { font-size: clamp(2.2rem, 9vw, 3.5rem); } }
                @media (max-width: 480px) { .stagger-row span { font-size: clamp(1.8rem, 8vw, 2.8rem); } }

                .master-desc {
                    font-family: 'Inter', sans-serif;
                    font-size: 1.1rem;
                    color: #5A554A;
                    max-width: 450px;
                    line-height: 1.7;
                    font-weight: 400;
                    letter-spacing: 0.2px;
                    margin-top: 15px;
                }

                @media (max-width: 991px) { .master-desc { margin: 8px auto 0; font-size: 0.88rem; line-height: 1.5; max-width: 90%; padding: 0 16px; } }
                @media (max-width: 480px) { .master-desc { font-size: 0.82rem; } }

                /* Large Background Kinetic Typography */
                .kinetic-bg-text {
                    position: absolute;
                    font-family: 'Playfair Display', serif;
                    font-size: 35vw;
                    font-weight: 900;
                    color: rgba(0,0,0,0.025);
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

                /* Visual Column — Dual Photo Layout */
                .master-visual-col {
                    position: relative;
                    perspective: 3000px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    overflow: visible;
                    padding-bottom: 40px;
                }

                @media (max-width: 991px) { 
                    .master-visual-col { 
                        order: 1;
                        width: 100%;
                        height: auto;
                        padding: 110px 20px 50px;
                        position: relative;
                        display: flex;
                        justify-content: center;
                    } 
                }
                @media (max-width: 480px) {
                    .master-visual-col { padding: 100px 16px 44px; }
                }

                .primary-photo {
                    position: absolute;
                    right: 0%;
                    width: 75%;
                    height: auto;
                    max-height: 85vh;
                    aspect-ratio: 4/5;
                    border-radius: 20px;
                    overflow: hidden;
                    z-index: 1;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.08);
                    top: 50%;
                    transform: translateY(-50%);
                }

                @media (max-width: 991px) {
                    .primary-photo { 
                        position: relative;
                        width: 60%;
                        max-height: none;
                        aspect-ratio: 4/5;
                        border-radius: 12px;
                        top: auto;
                        right: auto;
                        transform: none;
                        margin: 0 auto;
                    }
                }
                @media (max-width: 480px) {
                    .primary-photo { width: 55%; border-radius: 10px; }
                }

                .primary-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 1.4s ease;
                }

                .secondary-photo {
                    position: absolute;
                    left: 5%;
                    bottom: 10%;
                    width: 45%;
                    aspect-ratio: 1/1;
                    border-radius: 4px;
                    overflow: hidden;
                    z-index: 10;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                    transform: translateY(20px);
                }

                @media (max-width: 991px) {
                    .secondary-photo { 
                        position: absolute;
                        width: 36%;
                        left: 12px;
                        bottom: 8px;
                        transform: none;
                        box-shadow: 0 8px 20px rgba(0,0,0,0.18);
                        border-radius: 6px;
                        z-index: 10;
                    }
                }
                @media (max-width: 480px) {
                    .secondary-photo { width: 32%; left: 8px; bottom: 4px; }
                }

                .secondary-photo img {
                    width: 100%; height: 100%; object-fit: cover;
                }

                /* Modern Fractional Pagination */
                .modern-pagination {
                    position: absolute;
                    left: 80px;
                    bottom: 60px;
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    z-index: 150;
                }

                @media (max-width: 991px) {
                    .modern-pagination {
                        position: relative;
                        left: auto;
                        bottom: auto;
                        transform: none;
                        width: fit-content;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        padding: 10px 20px;
                        border-radius: 50px;
                        gap: 16px;
                        margin: 20px auto 0;
                        border: 1px solid rgba(0, 0, 0, 0.04);
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    }
                }

                .modern-pagination .nav-btn {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #1D1B19;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                @media (max-width: 991px) {
                    .modern-pagination .nav-btn svg { width: 18px; height: 18px; }
                }

                .modern-pagination .nav-btn:hover { opacity: 0.6; transform: scale(1.1); }

                .fraction {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-family: 'Inter', sans-serif;
                    color: #1D1B19;
                    font-weight: 600;
                    letter-spacing: 1px;
                    font-size: 0.9rem;
                }

                @media (max-width: 991px) {
                    .fraction { gap: 8px; font-size: 0.8rem; }
                }

                .fraction .line {
                    width: 30px;
                    height: 1px;
                    background: #1D1B19;
                    opacity: 0.2;
                }
                
                @media (max-width: 991px) { .fraction .line { width: 20px; } }

                /* Master Button */
                .master-btn {
                    padding: 22px 55px;
                    background: transparent;
                    border: 1px solid #1D1B19;
                    color: #1D1B19;
                    font-family: 'Inter', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 5px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 0;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.5s ease;
                    z-index: 1;
                    overflow: hidden;
                }

                @media (max-width: 991px) { .master-btn { padding: 15px 35px; letter-spacing: 3px; font-size: 0.7rem; } }
                .master-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 0; height: 100%;
                    background: #1D1B19;
                    z-index: -1;
                    transition: width 0.5s cubic-bezier(0.86, 0, 0.07, 1);
                }
                .master-btn:hover { color: #fff; letter-spacing: 8px; }
                .master-btn:hover::before { width: 100%; }

                .global-cta-wrap {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    z-index: 150;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @media (max-width: 991px) {
                    .global-cta-wrap {
                        position: relative;
                        top: auto;
                        left: auto;
                        width: 100%;
                        height: auto;
                        min-height: auto;
                        padding: 0;
                        pointer-events: auto;
                        display: block;
                        background: transparent;
                    }
                }

                .global-cta-text-col {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    height: 100%;
                    gap: 20px;
                    pointer-events: none;
                    visibility: hidden;
                }
                @media (max-width: 991px) {
                    .global-cta-text-col {
                        visibility: visible;
                        pointer-events: auto;
                        height: auto;
                        gap: 6px;
                        text-align: center;
                        align-items: center;
                        padding: 16px 20px 0;
                        justify-content: flex-start;
                    }
                }
                @media (max-width: 480px) {
                    .global-cta-text-col { padding: 12px 16px 0; gap: 4px; }
                }
                
                @media (max-width: 991px) {
                    .global-cta-dummy-visual { display: none; }
                }

                .global-cta-btn-container {
                    pointer-events: auto;
                    visibility: visible;
                    opacity: 1;
                    padding-top: 30px; /* Space between description and button */
                }
                
                @media (max-width: 991px) { .global-cta-btn-container { padding-top: 16px; padding-bottom: 20px; } }
                @media (max-width: 480px) { .global-cta-btn-container { padding-top: 12px; padding-bottom: 16px; } }
                @media (max-width: 991px) { .master-btn { padding: 14px 32px; letter-spacing: 3px; font-size: 0.7rem; } }
                @media (max-width: 480px) { .master-btn { padding: 12px 28px; font-size: 0.68rem; } }
                @media (max-width: 991px) { .global-cta-wrap { padding-bottom: 0px; } }
            `}</style>

            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1400}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false
                }}
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
                            </div>

                            <div className="master-visual-col">
                                <div className="primary-photo">
                                    <Image
                                        src={slide.productImg}
                                        alt={slide.name}
                                        fill
                                        sizes="(max-width: 991px) 70vw, 40vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className="secondary-photo">
                                    <Image
                                        src={slide.noteImg}
                                        alt={slide.name + " notes"}
                                        fill
                                        sizes="(max-width: 991px) 50vw, 25vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="global-cta-wrap">
                <div className="global-cta-grid">
                    <div className="global-cta-text-col">
                        <span className="master-tagline" style={{ display: 'block' }}>
                            {slides[activeIndex]?.tagline || "TAGLINE"}
                        </span>
                        <div className="master-title-wrap">
                            <div className="stagger-row">
                                <span>{t(slides[activeIndex]?.name || "TITLE")}</span>
                            </div>
                        </div>
                        <p className="master-desc">
                            {t(slides[activeIndex]?.subtitle || "DESC")}
                        </p>
                        <div className="global-cta-btn-container">
                            <button
                                className="master-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const activeSlide = slides[activeIndex];
                                    if (activeSlide?.product) {
                                        addProductToCart(activeSlide.product);
                                    } else {
                                        // Fallback if no product is linked
                                        window.location.href = `/${locale}${activeSlide?.link || "/shop"}`;
                                    }
                                }}
                            >
                                {slides[activeIndex]?.product ? t("Add To Cart") : t("Discover the Note")}
                            </button>
                        </div>
                    </div>
                    {/* Dynamic layout matching block to mimic primary photo constraints exactly on mobile */}
                    <div className="global-cta-dummy-visual">
                        <div className="global-cta-dummy-ratio d-block d-lg-none"></div>
                    </div>
                </div>
            </div>

            <div className="modern-pagination">
                <button className="nav-btn prev-btn" onClick={() => swiperRef.current?.slidePrev()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="fraction">
                    <span className="current">
                        {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="line"></span>
                    <span className="total">
                        {String(slides.length).padStart(2, '0')}
                    </span>
                </div>

                <button className="nav-btn next-btn" onClick={() => swiperRef.current?.slideNext()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default MasterPerfumerGallery;
