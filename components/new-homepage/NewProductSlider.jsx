"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import gsap from "gsap";
import { useContextElement } from "@/context/Context";
import { useMenu } from "@/context/MenuContext";
import { formatPrice } from "@/utils/shop";
import Skeleton from "@mui/material/Skeleton";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

const clean = (s = "") =>
  String(s || "")
    .replace(/&amp;/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .join("-")
    .toLowerCase();

const decodeHtml = (s = "") => String(s || "").replace(/&amp;/g, "&");

const isSubcat = (cat, sub) =>
  sub
    ? clean(sub.subcategory_name || sub)
    : ["gift-sets", "hair-mist", "extrait-de-parfum"].includes(clean(cat))
      ? clean(cat)
      : "online-exclusive";

const THEME_PALETTES = [
    { bg: "#F9F6F0", accent: "rgba(197, 160, 89, 1)", glow: "rgba(197, 160, 89, 0.15)", roman: "I" },
    { bg: "#F4EFEA", accent: "#8a59c5", glow: "rgba(138, 89, 197, 0.1)", roman: "II" },
    { bg: "rgba(253, 251, 247, 1)", accent: "rgba(230, 57, 70, 1)", glow: "rgba(230, 57, 70, 0.1)", roman: "III" },
    { bg: "#F8F1F2", accent: "#ffb7c5", glow: "rgba(255, 183, 197, 0.15)", roman: "IV" },
    { bg: "#FCF9F2", accent: "#d4af37", glow: "rgba(212, 175, 55, 0.15)", roman: "V" },
    { bg: "rgba(242, 245, 248, 1)", accent: "#598ac5", glow: "rgba(89, 138, 197, 0.15)", roman: "VI" }
];

const ProductPrice = ({ elm, currency }) => {
  const currentUTC = new Date();
  const currentGST = new Date(currentUTC.getTime() + (4 * 60 * 60 * 1000));
  const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");
  
  const isDiscountActive = elm?.discount && 
    new Date(current_date_time) >= new Date(elm.discount.start_date) && 
    new Date(current_date_time) <= new Date(elm.discount.end_date);

  if (isDiscountActive) {
    let discountedPrice = elm.price;
    if (elm.discount.discount_type === "percent") {
      discountedPrice = elm.price - (elm.price / 100 * elm.discount.value);
    } else if (elm.discount.discount_type === "amount") {
      discountedPrice = elm.price - elm.discount.value;
    }
    return (
      <div className="product-price-wrap d-flex align-items-center gap-2">
        <span className="money price price-old">{formatPrice(elm.price, currency)}</span> 
        <span className="money price price-sale"> {formatPrice(discountedPrice, currency)}</span>
      </div>
    );
  } else if (elm?.sale_price) {
    const salePrice = elm.price - (elm.price / 100 * elm.sale_price);
    return (
      <div className="product-price-wrap d-flex align-items-center gap-2">
        <span className="money price price-old">{formatPrice(elm.price, currency)}</span> 
        <span className="money price price-sale"> {formatPrice(salePrice, currency)}</span>
      </div>
    );
  }
  return (
    <div className="product-price-wrap d-flex align-items-center gap-2">
      <span className="money price">{formatPrice(elm.price, currency)}</span>
    </div>
  );
};

const MasterPerfumerGallery = () => {
    const locale = useLocale();
    const t = useTranslations();
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const { addProductToCart, cartProducts, setCartProducts } = useContextElement();
    const { currency } = useMenu();
    const [activeIndex, setActiveIndex] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchSlides = async () => {
            setLoading(true);
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
                
                // 1. Try dedicated slider endpoint first
                let mapped = [];
                try {
                    const res = await fetch(`${apiBase}api/new-product-sliders?lang=${locale}`);
                    if (res.ok) {
                        const json = await res.json();
                        if (json && !json.error && Array.isArray(json.data) && json.data.length > 0) {
                            mapped = json.data.map((item, idx) => ({
                                id: item.id || item.product_id || idx,
                                name: (locale === "ar" && item.name_ar) ? item.name_ar : (item.name || item.product_name || ""),
                                tagline: item.category || item.category_name || t("Signature Creation"),
                                subtitle: (locale === "ar" && item.desc_ar) ? item.desc_ar : (item.desc || item.description || ""),
                                noteImg: item.noteImg || (item.image ? (item.image.startsWith("http") ? item.image : `${apiBase}storage/${item.image}`) : "/assets/images/AhmedLogo.png"),
                                productImg: item.productImg || (item.image ? (item.image.startsWith("http") ? item.image : `${apiBase}storage/${item.image}`) : "/assets/images/AhmedLogo.png"),
                                link: item.link || "/shop",
                                theme: {
                                    bg: item.theme?.bg || THEME_PALETTES[idx % THEME_PALETTES.length].bg,
                                    accent: item.theme?.accent || THEME_PALETTES[idx % THEME_PALETTES.length].accent,
                                    glow: item.theme?.glow || THEME_PALETTES[idx % THEME_PALETTES.length].glow,
                                    roman: item.theme?.roman || THEME_PALETTES[idx % THEME_PALETTES.length].roman
                                },
                                product: item.product || item
                            }));
                        }
                    }
                } catch {
                    mapped = [];
                }

                // 2. If no dedicated slider data, fetch from getBestSelling
                if (mapped.length === 0) {
                    const res = await fetch(`${apiBase}api/getBestSelling`);
                    if (res.ok) {
                        const json = await res.json();
                        if (json && typeof json === "object") {
                            let rawProducts = [];
                            if (Array.isArray(json.all) && json.all.length > 0) {
                                rawProducts = json.all;
                            } else {
                                Object.values(json).forEach((categoryItems) => {
                                    if (Array.isArray(categoryItems)) {
                                        rawProducts.push(...categoryItems);
                                    }
                                });
                            }

                            // Deduplicate and filter in-stock products
                            const seen = new Set();
                            const uniqueProducts = [];
                            for (const p of rawProducts) {
                                if (p && p.product_id && !seen.has(p.product_id) && Number(p.product_qty) > 0) {
                                    seen.add(p.product_id);
                                    uniqueProducts.push(p);
                                }
                            }

                            // Take top 6 best-selling products
                            const topProducts = uniqueProducts.slice(0, 6);

                            mapped = topProducts.map((p, idx) => {
                                let imgs = [];
                                try {
                                    if (Array.isArray(p.images)) {
                                        imgs = p.images;
                                    } else if (typeof p.images === "string") {
                                        imgs = JSON.parse(p.images);
                                    }
                                } catch {
                                    imgs = [];
                                }

                                const resolveImg = (img) => {
                                    if (!img) return "/assets/images/AhmedLogo.png";
                                    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) return img;
                                    return `${apiBase}storage/${img}`;
                                };

                                const primaryImg = resolveImg(imgs[0] || p.image);
                                const secondaryImg = resolveImg(imgs[1] || imgs[0] || p.image);
                                const theme = THEME_PALETTES[idx % THEME_PALETTES.length];
                                const categoryClean = clean(p.category_name || "perfumes");
                                const subcategoryClean = isSubcat(p.category_name, p.subcategory);
                                const productClean = clean(p.product_name);
                                const link = `/shop/${categoryClean}/${subcategoryClean}/${productClean}`;

                                const displayName = (locale === "ar" && p.product_name_ar) ? p.product_name_ar : decodeHtml(p.product_name);
                                const displayDesc = (locale === "ar" && p.description_ar) ? p.description_ar : (p.description || "");

                                return {
                                    id: p.product_id,
                                    name: displayName,
                                    tagline: p.collection_name || p.category_name || t("Signature Creation"),
                                    subtitle: displayDesc,
                                    productImg: primaryImg,
                                    noteImg: secondaryImg,
                                    link,
                                    theme,
                                    product: p
                                };
                            });
                        }
                    }
                }

                if (isMounted) {
                    setSlides(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch product slider data:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchSlides();
        return () => { isMounted = false; };
    }, [locale, t]);

    const getProductQuantity = (id) => {
        if (!id) return 0;
        const item = cartProducts?.find(p => p.product_id === id);
        return item ? item.quantity : 0;
    };

    const handleIncrement = (product) => {
        if (!product) return;
        const MAX_LIMIT =
            product.maximum_order_quantity && product.maximum_order_quantity > 0
                ? product.maximum_order_quantity
                : product.product_qty;

        const currentQty = getProductQuantity(product.product_id);
        if (currentQty >= MAX_LIMIT) {
            return;
        }
        addProductToCart(product);
    };

    const handleDecrement = (productId) => {
        if (!productId) return;
        setCartProducts(prev => {
            return prev.map(p => {
                if (p.product_id === productId) {
                    const newQty = (p.quantity || 1) - 1;
                    return newQty > 0 ? { ...p, quantity: newQty } : null;
                }
                return p;
            }).filter(Boolean);
        });
    };

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

        // Accessibility check
        const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Animate out the old text aggressively so it clears the space
        if (prevSlide && swiper.activeIndex !== swiper.previousIndex) {
            const oldTitleElements = prevSlide.querySelectorAll(".stagger-row span");
            const oldSubtitle = prevSlide.querySelector(".master-desc");
            const oldTagline = prevSlide.querySelector(".master-tagline");
            const oldPrice = prevSlide.querySelector(".product-price-wrap");

            const targetsToAnimateOut = [];
            if (oldTitleElements && oldTitleElements.length > 0) targetsToAnimateOut.push(oldTitleElements);
            if (oldPrice) targetsToAnimateOut.push(oldPrice);
            if (oldSubtitle) targetsToAnimateOut.push(oldSubtitle);
            if (oldTagline) targetsToAnimateOut.push(oldTagline);

            if (targetsToAnimateOut.length > 0) {
                gsap.to(targetsToAnimateOut, {
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : -30,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        }

        if (!currentSlide) return;

        const titleElements = currentSlide.querySelectorAll(".stagger-row span");
        const price = currentSlide.querySelector(".product-price-wrap");
        const subtitle = currentSlide.querySelector(".master-desc");
        const tagline = currentSlide.querySelector(".master-tagline");
        const primary = currentSlide.querySelector(".primary-photo img");
        const secondary = currentSlide.querySelector(".secondary-photo");

        if (containerRef.current && slides[index]) {
            gsap.to(containerRef.current, {
                backgroundColor: slides[index]?.theme?.bg || "#FDFBF7",
                duration: 1.0,
                ease: "sine.inOut"
            });
        }

        if (tagline) {
            gsap.fromTo(tagline, 
                { opacity: 0, x: prefersReducedMotion ? 0 : -15 }, 
                { opacity: 1, x: 0, duration: 1.0, delay: 0.4, ease: "power2.out" }
            );
        }

        if (titleElements && titleElements.length > 0) {
            gsap.fromTo(titleElements,
                { y: prefersReducedMotion ? 0 : "100%", opacity: 0 },
                { y: 0, opacity: 1, duration: 1.0, stagger: prefersReducedMotion ? 0 : 0.06, ease: "power3.out", delay: 0.5 }
            );
        }

        if (price) {
            gsap.fromTo(price,
                { y: prefersReducedMotion ? 0 : "100%", opacity: 0 },
                { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.6 }
            );
        }

        if (subtitle) {
            gsap.fromTo(subtitle, 
                { opacity: 0, y: prefersReducedMotion ? 0 : 20 }, 
                { opacity: 1, y: 0, duration: 1.0, delay: 0.7, ease: "power3.out" }
            );
        }

        if (primary) {
            gsap.fromTo(primary,
                { scale: 1.05 },
                { scale: 1, duration: 5, ease: "sine.out", delay: 0 }
            );
        }

        if (secondary) {
            gsap.fromTo(secondary,
                { y: prefersReducedMotion ? 0 : 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: "power2.out" }
            );
        }
    };

    if (loading) {
        return (
            <div className="master-gallery-wrapper" style={{ minHeight: "70vh", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Skeleton variant="text" width={180} height={28} sx={{ bgcolor: "rgba(0,0,0,0.06)", mb: 2 }} />
                <Skeleton variant="text" width={320} height={50} sx={{ bgcolor: "rgba(0,0,0,0.06)", mb: 4 }} />
                <Skeleton variant="rectangular" width="85%" height={400} sx={{ bgcolor: "rgba(0,0,0,0.04)", borderRadius: "16px" }} />
            </div>
        );
    }

    if (!slides || slides.length === 0) {
        return null;
    }

    const currentThemeBg = slides[activeIndex]?.theme?.bg || "#FDFBF7";

    return (
        <div
            ref={containerRef}
            className="master-gallery-wrapper"
            onMouseMove={handleMouseMove}
            style={{ backgroundColor: currentThemeBg, transition: "background-color 1s ease" }}
        >
            <div className="best-sellers-header-section">
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
            </div>

            <section className="master-gallery-section">

            <style jsx global>{`
                .master-gallery-wrapper {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    background-color: #FDFBF7;
                    margin: 0;
                    padding: 0;
                }

                .best-sellers-header-section {
                    width: 100%;
                    padding: 40px 0 10px;
                    background: transparent;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                }

                .master-gallery-section {
                    position: relative;
                    width: 100%;
                    min-height: 70vh;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                    position: relative;
                    z-index: 99;
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
                    .best-sellers-header-section {
                        padding: 20px 0 5px;
                    }
                    .best-sellers-header-wrap {
                        position: relative;
                        left: auto;
                        transform: none;
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

                .master-swiper { width: 100%; height: 100%; }
                .master-slide { display: flex; align-items: center; justify-content: center; position: relative; width: 100%; height: auto; min-height: 75vh; }
                
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
                    font-size: clamp(2.8rem, 5.5vw, 5.5rem);
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

                @media (max-width: 991px) { 
                    .master-desc { 
                        margin: 0 auto; 
                        font-size: 0.88rem; 
                        line-height: 1.5; 
                        max-width: 85%; 
                        padding: 0; 
                    } 
                }
                @media (max-width: 480px) { .master-desc { font-size: 0.82rem; } }

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
                        padding: 110px 20px 60px;
                        position: relative;
                        display: flex;
                        justify-content: center;
                    } 
                }
                @media (max-width: 480px) {
                    .master-visual-col { padding: 15px 16px 44px; }
                }

                .primary-photo {
                    position: absolute;
                    right: 0%;
                    width: 70%;
                    height: auto;
                    max-height: 80vh;
                    aspect-ratio: 4/5;
                    border-radius: 20px;
                    overflow: hidden;
                    z-index: 1;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.08);
                    top: 50%;
                    transform: translateY(-50%);
                }

                @media (max-width: 1400px) {
                    .primary-photo {
                        width: 65%;
                    }
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
                    left: 15%;
                    bottom: 10%;
                    width: 40%;
                    aspect-ratio: 1/1;
                    border-radius: 4px;
                    overflow: hidden;
                    z-index: 10;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                    transform: translateY(20px);
                }

                @media (max-width: 1400px) {
                    .secondary-photo {
                        left: 20%;
                        width: 35%;
                    }
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

                .modern-pagination {
                    position: absolute;
                    left: 80px;
                    bottom: 60px;
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    z-index: 99;
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
                    transition: transform 160ms ease-out, color 0.4s ease-out, letter-spacing 0.4s ease-out;
                    z-index: 1;
                    overflow: hidden;
                    will-change: transform;
                    display: inline-block;
                    text-decoration: none;
                }

                .master-btn:active {
                    transform: scale(0.97);
                }

                @media (hover: hover) and (pointer: fine) {
                    .master-btn:hover { 
                        color: #fff; 
                        letter-spacing: 8px; 
                    }
                    .master-btn:hover::before { 
                        width: 100%; 
                    }
                }

                @media (max-width: 991px) { 
                    .master-btn { 
                        padding: 14px 32px; 
                        letter-spacing: 3px; 
                        font-size: 0.7rem; 
                    } 
                }
                @media (max-width: 480px) { 
                    .master-btn { 
                        padding: 12px 28px; 
                        font-size: 0.68rem; 
                    } 
                }
                .master-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 0; height: 100%;
                    background: #1D1B19;
                    z-index: -1;
                    transition: width 0.5s cubic-bezier(0.86, 0, 0.07, 1);
                }

                .global-cta-wrap {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    z-index: 99;
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
                        gap: 12px;
                        text-align: center;
                        align-items: center;
                        padding: 30px 20px 0;
                        justify-content: flex-start;
                    }
                }
                @media (max-width: 480px) {
                    .global-cta-text-col { padding: 24px 16px 0; gap: 10px; }
                }
                
                @media (max-width: 991px) {
                    .global-cta-dummy-visual { display: none; }
                }

                .global-cta-btn-container {
                    pointer-events: auto;
                    visibility: visible;
                    opacity: 1;
                    padding-top: 10px;
                }
                
                @media (max-width: 991px) { .global-cta-btn-container { padding-top: 12px; padding-bottom: 25px; } }
                @media (max-width: 480px) { .global-cta-btn-container { padding-top: 10px; padding-bottom: 20px; } }

                .price-anim-wrap {
                    display: block;
                    overflow: hidden;
                    margin-top: 5px;
                }

                .product-price-wrap {
                    font-family: 'Inter', sans-serif;
                    font-size: 1.25rem;
                    font-weight: 500;
                    margin-top: 5px;
                }
                .product-price-wrap .price-old {
                    text-decoration: line-through;
                    color: rgba(0,0,0,0.35);
                    font-size: 0.95rem;
                    font-weight: 400;
                }
                .product-price-wrap .price-sale {
                    color: #c5a059;
                    font-weight: 700;
                }
                @media (max-width: 991px) {
                    .product-price-wrap {
                        font-size: 1.15rem;
                        margin-top: 3px;
                    }
                    .product-price-wrap .price-old {
                        font-size: 0.88rem;
                    }
                }

                .slider-qty-selector {
                    display: inline-flex;
                    align-items: stretch;
                    border: 1px solid #1D1B19;
                    background: transparent;
                    border-radius: 0;
                    pointer-events: auto;
                    visibility: visible;
                    opacity: 1;
                    min-width: 220px;
                    height: 60px;
                    box-sizing: border-box;
                    padding: 0;
                }

                @media (max-width: 991px) {
                    .slider-qty-selector {
                        min-width: 170px;
                        height: 48px;
                    }
                }

                @media (max-width: 480px) {
                    .slider-qty-selector {
                        min-width: 150px;
                        height: 42px;
                    }
                }

                .slider-qty-selector .qty-btn {
                    background: transparent;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    width: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0;
                    color: #1D1B19;
                    transition: background-color 0.3s ease;
                    padding: 0;
                    height: 100%;
                }

                @media (max-width: 991px) {
                    .slider-qty-selector .qty-btn {
                        width: 40px;
                    }
                }

                .slider-qty-selector .qty-btn:hover {
                    background: rgba(29, 27, 25, 0.08);
                }

                .slider-qty-selector .qty-value {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: #1D1B19;
                    border-left: 1px solid rgba(29, 27, 25, 0.15);
                    border-right: 1px solid rgba(29, 27, 25, 0.15);
                    text-transform: uppercase;
                    height: 100%;
                    min-width: 50px;
                    text-align: center;
                }

                @media (max-width: 991px) {
                    .slider-qty-selector .qty-value {
                        font-size: 0.75rem;
                        letter-spacing: 1px;
                    }
                }
            `}</style>

            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1400}
                loop={slides.length > 1}
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
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="master-slide">
                        <div className="kinetic-bg-text d-none d-lg-block">{slide.name}</div>
                        <div className="master-grid">
                            <div className="master-text-col">
                                <span className="master-tagline" style={{ "--accent-color": slide.theme.accent }}>
                                    {slide.tagline}
                                </span>
                                <div className="master-title-wrap">
                                    <div className="stagger-row">
                                        <span>{slide.name}</span>
                                    </div>
                                </div>
                                {slide.product && (
                                    <div className="price-anim-wrap">
                                        <ProductPrice elm={slide.product} currency={currency} />
                                    </div>
                                )}
                                {slide.subtitle && (
                                    <p className="master-desc">
                                        {slide.subtitle}
                                    </p>
                                )}
                            </div>

                            <div className="master-visual-col">
                                <div className="primary-photo">
                                    <Link href={`/${locale}${slide.link}`}>
                                        <Image
                                            src={slide.productImg}
                                            alt={slide.name}
                                            fill
                                            sizes="(max-width: 991px) 70vw, 40vw"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </Link>
                                </div>
                                <div className="secondary-photo">
                                    <Link href={`/${locale}${slide.link}`}>
                                        <Image
                                            src={slide.noteImg}
                                            alt={slide.name}
                                            fill
                                            sizes="(max-width: 991px) 50vw, 25vw"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </Link>
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
                            {slides[activeIndex]?.tagline}
                        </span>
                        <div className="master-title-wrap">
                            <div className="stagger-row">
                                <span>{slides[activeIndex]?.name}</span>
                            </div>
                        </div>
                        {slides[activeIndex]?.product && (
                            <ProductPrice elm={slides[activeIndex].product} currency={currency} />
                        )}
                        {slides[activeIndex]?.subtitle && (
                            <p className="master-desc">
                                {slides[activeIndex].subtitle}
                            </p>
                        )}
                        <div className="global-cta-btn-container">
                            {slides[activeIndex]?.product && getProductQuantity(slides[activeIndex].product.product_id) > 0 ? (
                                <div className="slider-qty-selector">
                                    <button 
                                        className="qty-btn dec-btn" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDecrement(slides[activeIndex].product.product_id);
                                        }}
                                        aria-label="Decrease quantity"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                    <span className="qty-value font-weight-bold">
                                        {getProductQuantity(slides[activeIndex].product.product_id)}
                                    </span>
                                    <button 
                                        className="qty-btn inc-btn" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleIncrement(slides[activeIndex].product);
                                        }}
                                        aria-label="Increase quantity"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="master-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const activeSlide = slides[activeIndex];
                                        if (activeSlide?.product) {
                                            addProductToCart(activeSlide.product);
                                        } else if (activeSlide?.link) {
                                            window.location.href = `/${locale}${activeSlide.link}`;
                                        }
                                    }}
                                >
                                    {slides[activeIndex]?.product ? t("Add To Cart") : t("Discover the Note")}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="global-cta-dummy-visual">
                        <div className="global-cta-dummy-ratio d-block d-lg-none"></div>
                    </div>
                </div>
            </div>

            <div className="modern-pagination">
                <button className="nav-btn prev-btn" onClick={() => swiperRef.current?.slidePrev()} aria-label={t("Previous Slide")}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="fraction" aria-live="polite">
                    <span className="current">
                        {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="line"></span>
                    <span className="total">
                        {String(slides.length).padStart(2, '0')}
                    </span>
                </div>

                <button className="nav-btn next-btn" onClick={() => swiperRef.current?.slideNext()} aria-label={t("Next Slide")}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            </section>
        </div>
    );
};

export default MasterPerfumerGallery;
