"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { useContextElement } from "@/context/Context";
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from "@/context/MenuContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const translations = {
    en: {
        subtitle: "✦ Shop Top Selling Products by Category This Eid ✦",
        title: "EID FRAGRANCES",
        shop_now: "Shop Now",
        view_all: "View All",
        categories: [
            { key: "All", label: "All" },
            { key: "Perfumes", label: "Perfumes" },
            { key: "Dakhoon", label: "Dakhoon" },
            { key: "Concentrated Parfum", label: "Concentrated Parfum" },
            { key: "Gift Sets", label: "Gift Sets" },
            { key: "Care Essentials", label: "Care Essentials" },
        ]
    },
    ar: {
        subtitle: "✦ تسوّق المنتجات الأكثر مبيعًا حسب الفئة في العيد ✦",
        title: "عطور العيد",
        shop_now: "تسوق الآن",
        view_all: "عرض الكل",
        categories: [
            { key: "All", label: "كل" },
            { key: "Perfumes", label: "عطور" },
            { key: "Dakhoon", label: "دخون" },
            { key: "Concentrated Parfum", label: "العطورالزيتية" },
            { key: "Gift Sets", label: "أطقم هدايا" },
            { key: "Care Essentials", label: "أساسيات العناية" },
        ]
    }
};

/* ===== HELPERS ===== */
const clean = (s = "") =>
    s
        .replace(/&amp;/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .join("-")
        .toLowerCase();

const decodeHtml = (s = "") => s.replace(/&amp;/g, "&");

const isSubcat = (cat, sub) =>
    sub
        ? clean(sub.subcategory_name)
        : ["gift-sets", "hair-mist", "extrait-de-parfum"].includes(clean(cat))
            ? clean(cat)
            : "online-exclusive";

export default function RamadanTabSlider() {
    const { addProductToCart } = useContextElement();
    const locale = useLocale();
    const isRtl = locale === "ar";
    const t = translations[locale] || translations.en;
    const tt = useTranslations()
    const { currency } = useMenu();

    const [apiData, setApiData] = useState({});
    const [currentCategory, setCurrentCategory] = useState("All");
    const [activeIndex, setActiveIndex] = useState(0);

    const rafRef = useRef(null);

    /* ================= FETCH ================= */
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`${BASE_URL}api/getBestSelling`);
                const data = await res.json();
                setApiData(data || {});
            } catch (err) {
                console.error("API error:", err);
                setApiData({});
            }
        }
        fetchProducts();
    }, []);

    /* ================= FILTER LOGIC ================= */
    const filtered = useMemo(() => {
        if (!apiData || Object.keys(apiData).length === 0) return [];

        const onlyInStock = (arr) =>
            (arr || []).filter((p) => Number(p.product_qty) > 0);

        // ALL → top 2 from EACH category (no duplicates)
        if (currentCategory === "All") {
            const map = new Map();

            Object.values(apiData).forEach((items) => {
                onlyInStock(items)
                    .sort((a, b) => (b?.sales || 0) - (a?.sales || 0))
                    .slice(0, 2)
                    .forEach((p) => {
                        if (!map.has(p.product_id)) {
                            map.set(p.product_id, p);
                        }
                    });
            });

            return Array.from(map.values());
        }

        // CATEGORY → best sellers (in stock only)
        return onlyInStock(apiData[currentCategory]).sort(
            (a, b) => (b?.sales || 0) - (a?.sales || 0)
        );
    }, [apiData, currentCategory]);

    const activeProduct =
        filtered.length > 0 ? filtered[activeIndex % filtered.length] : null;

    useEffect(() => {
        setActiveIndex(0);
    }, [currentCategory]);

    const applyTransforms = (swiper) => {
        if (!swiper?.slides?.length) return;

        const isMobile =
            typeof window !== "undefined" && window.innerWidth < 768;

        const MAX_SCALE = isMobile ? 1.08 : 1.12;
        const SIDE_SCALE = isMobile ? 0.94 : 0.82;
        const MAX_OPACITY = 1;
        const SIDE_OPACITY = isMobile ? 0.9 : 0.9;
        const CENTER_LIFT = isMobile ? -6 : -12;

        swiper.slides.forEach((slide) => {
            const p = slide.progress || 0;

            const clamped = Math.max(-1, Math.min(1, p));
            const abs = Math.abs(clamped);

            const ease = 1 - Math.pow(abs, 0.85);

            const scale = SIDE_SCALE + (MAX_SCALE - SIDE_SCALE) * ease;
            const opacity = SIDE_OPACITY + (MAX_OPACITY - SIDE_OPACITY) * ease;
            const translateY = abs < 0.001 ? CENTER_LIFT : 0;

            slide.style.transform = `
        translate3d(0px, ${translateY}px, 0px)
        scale(${scale})
      `;
            slide.style.opacity = opacity;
            slide.style.zIndex = `${100 - Math.round(abs * 10)}`;
            slide.style.willChange = "transform, opacity";
        });
    };

    const canLoop = filtered.length > 5;
    const shouldCenter = filtered.length > 5;

    return (
        <section
            dir={isRtl ? "rtl" : "ltr"}
            style={{
                width: "100%",
                minHeight: { xs: "auto", md: "100vh" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: { xs: "40px 0", md: "80px 0" },
                background: "linear-gradient(180deg, #F5F1E8 0%, #FFFFFF 100%)",
                overflow: "hidden",
                position: "relative"
            }}
        >
            {/* Islamic Pattern Background */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.04,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23BF953F'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Cpath d='M40 25 L42 32 L49 32 L43 37 L45 44 L40 39 L35 44 L37 37 L31 32 L38 32 Z'/%3E%3Cpath d='M15 15 L16 18 L19 18 L16.5 20 L17.5 23 L15 21 L12.5 23 L13.5 20 L11 18 L14 18 Z'/%3E%3Cpath d='M65 65 L66 68 L69 68 L66.5 70 L67.5 73 L65 71 L62.5 73 L63.5 70 L61 68 L64 68 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "80px 80px"
                }}
            />

            <style
                dangerouslySetInnerHTML={{
                    __html: `
      .ramadan-scroll-tabs {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        padding: 0 20px 10px;
        scrollbar-width: thin;
        scrollbar-color: #BF953F transparent;
      }

      .ramadan-scroll-tabs::-webkit-scrollbar {
        height: 6px;
      }

      .ramadan-scroll-tabs::-webkit-scrollbar-track {
        background: transparent;
      }

      .ramadan-scroll-tabs::-webkit-scrollbar-thumb {
        background: #BF953F;
        border-radius: 999px;
      }

      .ramadan-scroll-tabs::-webkit-scrollbar-thumb:hover {
        background: #AA8831;
      }

      @media (min-width: 1200px) {
        .ramadanProductsGutter {
            padding-left: 1px !important;
            padding-right: 1px !important;
        }
      }

      @media (min-width: 768px) {
        .ramadan-scroll-tabs {
          justify-content: center;
        }
      }
    `,
                }}
            />

            {/* ===== HEADER & TABS ===== */}
            <div style={{ textAlign: "center", marginBottom: 60, position: "relative", zIndex: 2 }}>
                {/* Decorative Top Element */}
                <div
                    style={{

                        height: "4px",
                        background: "linear-gradient(90deg, transparent, #BF953F, transparent)",
                        margin: typeof window !== 'undefined' && window.innerWidth < 768 ? "0 auto 10px" : "0 auto 40px"
                    }}
                />

                <p
                    style={{
                        fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? "0.7rem" : "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.3em",
                        color: "#BF953F",
                        fontWeight: 600,
                        marginBottom: 10
                    }}
                >
                    {t.subtitle}
                </p>

                <h2
                    style={{
                        fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? "1.75rem" : "42px",
                        fontWeight: 700,
                        color: "#2C2416",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? "20px" : "40px"
                    }}
                >
                    {t.title}
                </h2>

                <div className="ramadan-scroll-tabs" style={{ gap: typeof window !== 'undefined' && window.innerWidth < 768 ? "20px" : "35px" }}>
                    {t.categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => {
                                setCurrentCategory(cat.key);
                                setActiveIndex(0);
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                textTransform: "uppercase",
                                letterSpacing: "1.5px",
                                padding: "8px 0",
                                fontFamily: "SofiaProRegular",
                                flexShrink: 0,
                                fontWeight: 500,
                                fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? "12px" : "15px",
                                color: currentCategory === cat.key ? "#2C2416" : "#BF953F",
                                borderBottom: `2px solid ${currentCategory === cat.key ? "#2C2416" : "transparent"
                                    }`,
                                transition: "all 0.4s ease",
                                cursor: "pointer",
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== SLIDER ===== */}
            <div
                className="ramadanProductsGutter"
                style={{
                    width: "100%",
                    margin: typeof window !== 'undefined' && window.innerWidth < 768 ? "20px 0" : "40px 0",
                    perspective: 1500,
                    position: "relative",
                    zIndex: 1
                }}
            >
                <Swiper
                    key={`${currentCategory}-${locale}`}
                    dir={isRtl ? "rtl" : "ltr"}
                    centeredSlides={shouldCenter}
                    loop={canLoop}
                    speed={1200}
                    grabCursor
                    watchSlidesProgress
                    breakpoints={{
                        0: { slidesPerView: 1.4, spaceBetween: 14 },
                        768: { slidesPerView: 3, spaceBetween: 36 },
                        1200: { slidesPerView: 5, spaceBetween: 56 },
                    }}
                    onSlideChange={(s) => setActiveIndex(s.realIndex)}
                    onSetTranslate={(swiper) => {
                        if (rafRef.current) cancelAnimationFrame(rafRef.current);
                        rafRef.current = requestAnimationFrame(() => applyTransforms(swiper));
                    }}
                    onInit={(swiper) => {
                        applyTransforms(swiper);
                        swiper.slides.forEach((slide) => {
                            slide.style.transition =
                                "transform 900ms cubic-bezier(0.22,0.1,0.36,1), opacity 700ms ease";
                        });
                    }}
                    style={{ overflow: "visible" }}
                >
                    {filtered.map((item) => {
                        let imgs = [];
                        try {
                            imgs = item.images ? JSON.parse(item.images) : [];
                        } catch { }

                        const isActive = activeProduct?.product_id === item.product_id;

                        return (
                            <SwiperSlide key={item.product_id}>
                                <div className="product-card-wrapper">
                                    <div
                                        className="product-card"
                                        style={{
                                            background: "#fff",
                                            border: "3px solid #BF953F",
                                            borderRadius: "8px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div className="pc__img-wrapper" style={{ mixBlendMode: "multiply" }}>
                                            <Link
                                                href={`/${locale}/shop/${clean(
                                                    item.category_name
                                                )}/${isSubcat(
                                                    item.category_name,
                                                    item.subcategory
                                                )}/${clean(item.product_name)}`}
                                            >
                                                {imgs[0] && (
                                                    <Image
                                                        src={`${BASE_URL}storage/${imgs[0]}`}
                                                        width={330}
                                                        height={400}
                                                        alt={decodeHtml(item.product_name)}
                                                        className="pc__img"
                                                        priority
                                                    />
                                                )}
                                                {imgs[1] && (
                                                    <Image
                                                        src={`${BASE_URL}storage/${imgs[1]}`}
                                                        width={330}
                                                        height={400}
                                                        alt={decodeHtml(item.product_name)}
                                                        className="pc__img pc__img-second"
                                                        priority
                                                    />
                                                )}
                                            </Link>

                                            {/* ADD TO CART */}
                                            {isActive && (
                                                <button
                                                    className="pc__atc btn anim_appear-bottom position-absolute border-0 text-uppercase fw-medium"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addProductToCart({
                                                            ...item,
                                                            category_name: item.category_name,
                                                            subcategory_name: item.subcategory?.subcategory_name,
                                                        });
                                                    }}
                                                    style={{
                                                        background: "#0B4141",
                                                        color: "#BF953F",
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {tt("Add To Cart")}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            {/* ===== INFO BLOCK ===== */}
            {activeProduct && (
                <div
                    key={`${currentCategory}-${activeProduct.product_id}`}
                    style={{
                        textAlign: "center",
                        minHeight: 220,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 2
                    }}
                >
                    <span
                        style={{
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            marginBottom: 8,
                            color: "#BF953F",
                            fontWeight: 600
                        }}
                    >
                        {tt(activeProduct.category_name)}
                    </span>

                    <h3
                        style={{
                            fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 28,
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 400,
                            marginBottom: 8,
                            color: "#0B4141"
                        }}
                    >
                        {tt(decodeHtml(activeProduct.product_name))}
                    </h3>

                    <div
                        style={{
                            fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? 18 : 22,
                            fontWeight: 600,
                            marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 30,
                            fontFamily: "'Playfair Display', serif",
                            color: "#0B4141"
                        }}
                    >
                        {currency.symbol} {activeProduct.price}
                    </div>

                    {/* SHOP NOW BUTTON */}
                    <Link
                        href={`/${locale}/shop/${clean(
                            activeProduct.category_name
                        )}/${isSubcat(
                            activeProduct.category_name,
                            activeProduct.subcategory
                        )}/${clean(activeProduct.product_name)}`}
                    >
                        <button
                            style={{
                                background: "#0B4141",
                                color: "#BF953F",
                                border: "2px solid #BF953F",
                                padding: typeof window !== 'undefined' && window.innerWidth < 768 ? "10px 40px" : "15px 55px",
                                fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 12,
                                letterSpacing: 2,
                                textTransform: "uppercase",
                                cursor: "pointer",
                                fontWeight: 700,
                                borderRadius: "4px",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = "#BF953F";
                                e.target.style.color = "#0B4141";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "#0B4141";
                                e.target.style.color = "#BF953F";
                            }}
                        >
                            {t.shop_now}
                        </button>
                    </Link>

                    {/* VIEW ALL CTA */}
                    <div style={{ marginTop: 30 }}>
                        <Link
                            href={`/${locale}/shop`}
                            style={{
                                fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? 14 : 16,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                color: "#0B4141",
                                textDecoration: "none",
                                letterSpacing: 1.5,
                                borderBottom: "2px solid #BF953F",
                                paddingBottom: 4,
                            }}
                        >
                            {t.view_all}
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
}
