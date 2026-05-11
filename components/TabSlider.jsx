"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";
import { renderPrice } from "@/utlis/priceRenderer";
import "swiper/css";

import { useContextElement } from "@/context/Context";
import { useLocale, useTranslations } from "next-intl";
import { Weight } from "lucide-react";
import { ElevenMp } from "@mui/icons-material";
import { useMenu } from "@/context/MenuContext";
import Skeleton from "@mui/material/Skeleton";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const filterCategories = [
  { id: "All", key: "all" },
  { id: "Perfumes", key: "perfumes" },
  { id: "Dakhoon", key: "dakhoon" },
  { id: "Concentrated Parfum", key: "concentratedParfum" },
  { id: "Gift Sets", key: "giftSets" },
  { id: "Care Essentials", key: "careEssentials" },
];

/* ===== SAME HELPERS AS SHOP PAGE ===== */
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

const TabSliderSkeleton = () => {
  return (
    <div style={{ width: '100%', padding: "100px 0", textAlign: "center" }}>
      {/* Header Skeleton */}
      <div className="d-flex flex-column align-items-center mb-5">
        <Skeleton variant="text" width={180} height={20} sx={{ bgcolor: 'rgba(0,0,0,0.05)', mb: 2 }} />
        <Skeleton variant="text" width={280} height={45} sx={{ bgcolor: 'rgba(0,0,0,0.05)', mb: 2 }} />
        <Skeleton variant="rectangular" width={60} height={2} sx={{ bgcolor: 'rgba(185,161,107,0.2)', mb: 4 }} />
      </div>

      {/* Tabs Skeleton */}
      <div className="d-flex justify-content-center gap-4 mb-5 overflow-hidden px-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rounded" width={80} height={25} sx={{ bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '20px' }} />
        ))}
      </div>

      {/* Cards Row Skeleton */}
      <div className="d-flex justify-content-center gap-4 mb-5 overflow-hidden px-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-shrink-0" style={{ width: "240px" }}>
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '12px' }} />
          </div>
        ))}
      </div>

      {/* Bottom Info Skeleton */}
      <div className="d-flex flex-column align-items-center mt-5">
        <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: 'rgba(0,0,0,0.05)', mb: 1 }} />
        <Skeleton variant="text" width={220} height={35} sx={{ bgcolor: 'rgba(0,0,0,0.05)', mb: 2 }} />
        <Skeleton variant="rectangular" width={140} height={45} sx={{ bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '99px' }} />
      </div>
    </div>
  );
};

export default function PopularProducts() {
  const t = useTranslations("PopularProducts");
  const { addProductToCart } = useContextElement();
  const locale = useLocale();
  const { currency, isLoading: isMenuLoading } = useMenu();

  const [apiData, setApiData] = useState({});
  const [currentCategory, setCurrentCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const rafRef = useRef(null);

  /* ================= FETCH ================= */
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}api/getBestSelling`);
      const data = await res.json();
      setApiData(data || {});
    } catch (err) {
      console.error("API error:", err);
      setApiData({});
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
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

    // exact values – tuned for symmetry
    const MAX_SCALE = isMobile ? 1.08 : 1.12;
    const SIDE_SCALE = isMobile ? 0.94 : 0.82;
    const MAX_OPACITY = 1;
    const SIDE_OPACITY = isMobile ? 0.9 : 0.9;
    const CENTER_LIFT = isMobile ? -6 : -12;

    swiper.slides.forEach((slide) => {
      const p = slide.progress || 0;

      // 🔒 CRITICAL: clamp to [-1, 1]
      const clamped = Math.max(-1, Math.min(1, p));
      const abs = Math.abs(clamped);

      // 🔑 symmetric ease (same for left & right)
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

  // ✅ FIX: if not enough items, don't center (prevents "missing left side")
  const canLoop = filtered.length > 5;
  const shouldCenter = filtered.length > 5;

  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 0 0",
        background: "radial-gradient(circle at center, #f8f5f0 0%, #f3efe8 60%, #ece8e1 100%)",
        overflow: "hidden",
        position: 'relative'
      }}
    >
      {loading ? (
        <TabSliderSkeleton />
      ) : (
        <>
          {/* Subtle texture overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        opacity: 0.03,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .scroll-tabs {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        padding: 0 20px 6px;
        scrollbar-width: none;
        gap: 32px;
      }

      .scroll-tabs::-webkit-scrollbar { display: none; }

      .scroll-tabs button {
        font-family: 'Inter', sans-serif !important;
        font-size: clamp(0.55rem, 3vw, 0.68rem) !important;
        letter-spacing: 2px !important;
        font-weight: 500 !important;
        position: relative;
      }

      .scroll-tabs button::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.5px;
        background: #1a1714;
        transform: scaleX(0);
        transition: transform 0.35s ease;
      }

      @media (min-width: 1200px) {
        .popularProductsGutter {
            padding-left: 1px !important;
            padding-right: 1px !important;
        }
      }

      @media (min-width: 768px) {
        .scroll-tabs {
          justify-content: center;
        }
      }
    `,
        }}
      />

      {/* ===== HEADER & TABS ===== */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        {/* Sub-tagline */}
        <div style={{
          fontSize: 'clamp(0.5rem, 1.5vw, 0.6rem)',
          letterSpacing: '6px',
          color: '#b9a16b',
          textTransform: 'uppercase',
          fontWeight: 500,
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontFamily: locale === 'ar' ? 'sans-serif' : 'inherit'
        }}>
          <span style={{ fontSize: 6, color: '#b9a16b', opacity: 0.6 }}>◆</span>
          {t("subTitle")}
        </div>

        {/* Main title */}
        <h2 style={{
          fontFamily: locale === 'ar' ? 'sans-serif' : "'Playfair Display', serif",
          fontSize: 'clamp(1.4rem, 5vw, 2.4rem)',
          fontWeight: 400,
          color: '#1a1714',
          letterSpacing: locale === 'ar' ? '0' : '5px',
          textTransform: 'uppercase',
          margin: '0 0 14px',
        }}>
          {t("title")}
        </h2>

        {/* Diamond divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(to right, transparent, rgba(185,161,107,0.5))' }} />
          <div style={{ width: 5, height: 5, background: '#b9a16b', transform: 'rotate(45deg)', opacity: 0.6 }} />
          <div style={{ width: 30, height: 1, background: 'linear-gradient(to left, transparent, rgba(185,161,107,0.5))' }} />
        </div>

        <div className="scroll-tabs">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCurrentCategory(cat.id);
                setActiveIndex(0);
              }}
              style={{
                background: "none",
                border: "none",
                textTransform: "uppercase",
                padding: "8px 0",
                flexShrink: 0,
                color: currentCategory === cat.id ? "#1a1714" : "#8a8078",
                fontWeight: currentCategory === cat.id ? 700 : 500,
                transition: "color 0.3s ease",
                cursor: "pointer",
                position: 'relative',
                fontFamily: locale === 'ar' ? 'sans-serif' : 'inherit',
                fontSize: locale === 'ar' ? 'clamp(0.85rem, 2.5vw, 1rem)' : 'clamp(0.65rem, 2.2vw, 0.75rem)',
                letterSpacing: locale === 'ar' ? '0' : '2px'
              }}
            >
              {t(cat.key)}
              {currentCategory === cat.id && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#1a1714'
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ===== SLIDER ===== */}
      {/* ===== SLIDER ===== */}
      <div
        className="popularProductsGutter"
        style={{
          width: "100%",
          margin: "40px 0",
          perspective: 1500,
        }}
      >
        <Swiper
          key={currentCategory}
          centeredSlides={shouldCenter}
          loop={canLoop}
          speed={1200}
          grabCursor
          watchSlidesProgress
          breakpoints={{
            0: { slidesPerView: 1.65, spaceBetween: 14 },
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
                  <div className="product-card" style={{ background: "#f9f9f9" }}>
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


                      {/* --- ADDED LABEL LOGIC --- */}
                      {item.label_name && (
                        <div style={{ backgroundColor: item.label_color, zIndex: 10, position: 'absolute' }} className={`product-label text-uppercase text-white top-0 mt-2 mx-2 ${locale === 'ar' ? 'left-0' : 'right-0'}`}>
                          {locale === 'ar' ? item.label_name_ar : item.label_name}
                        </div>
                      )}

                      {item.product_qty <= 0 ? (
                        <div style={{ backgroundColor: "#dc3545", zIndex: 10, position: 'absolute' }} className={`product-label text-uppercase text-white top-0 mt-2 mx-2 ${locale === 'ar' ? 'right-0' : 'left-0'}`}>
                          {t("outOfStock")}
                        </div>
                      ) : (
                        item.discount && item.discount.discount_type === 'percent' && (
                          <div style={{ backgroundColor: "#198754", zIndex: 10, position: 'absolute' }} className={`product-label text-uppercase text-white top-0 mt-2 mx-2 ${locale === 'ar' ? 'right-0' : 'left-0'}`}>
                            {t("sale", { value: item.discount.value })}
                          </div>
                        )
                      )}
                      {/* --- END LABEL LOGIC --- */}

                      {/* ✅ ADD TO CART — ONLY CENTER SLIDE */}
                      {isActive && (
                        <button
                          className="pc__atc btn btn-primary anim_appear-bottom position-absolute border-0 text-uppercase fw-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addProductToCart({
                              ...item,
                              category_name: item.category_name,
                              subcategory_name: item.subcategory?.subcategory_name,
                            });
                          }}
                        >
                          {t("addToCart")}
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
      <div style={{ minHeight: 220, position: 'relative', marginTop: 40 }}>
        <AnimatePresence mode="wait">
          {activeProduct && (
            <motion.div
              key={`${currentCategory}-${activeProduct.product_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: '100%'
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(0.45rem, 1.5vw, 0.55rem)',
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  marginBottom: 8,
                  color: "#b9a16b",
                  fontWeight: 500,
                  fontFamily: locale === 'ar' ? 'sans-serif' : 'inherit'
                }}
              >
                {locale === 'ar' ? activeProduct.category_name_ar : activeProduct.category_name}
              </span>

              <h3
                style={{
                  fontSize: 'clamp(1.0rem, 4.5vw, 1.5rem)',
                  fontFamily: locale === 'ar' ? 'sans-serif' : "'Playfair Display', serif",
                  fontWeight: 400,
                  marginBottom: 8,
                  color: '#1a1714',
                  letterSpacing: 0.5,
                }}
              >
                {locale === 'ar' ? decodeHtml(activeProduct.product_name_ar) : decodeHtml(activeProduct.product_name)}
              </h3>

              {/* Diamond divider */}
              <div style={{ width: 5, height: 5, background: '#b9a16b', transform: 'rotate(45deg)', opacity: 0.5, marginBottom: 12 }} />

              <div
                style={{
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                  fontWeight: 300,
                  marginBottom: 22,
                  color: '#3a342d',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {renderPrice(activeProduct, currency)}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
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
                      background: "#1a1714",
                      color: "#fff",
                      border: "none",
                      padding: "12px 48px",
                      fontSize: 'clamp(0.5rem, 1.8vw, 0.58rem)',
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                      fontFamily: locale === 'ar' ? 'sans-serif' : 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#b9a16b';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 15px 30px rgba(185,161,107,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#1a1714';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                    }}
                  >
                    {t("exploreProduct")}
                  </button>
                </Link>

                <Link
                  href={`/${locale}/shop`}
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "#1a1714",
                    textDecoration: "none",
                    letterSpacing: 2,
                    borderBottom: "1.5px solid #b9a16b",
                    paddingBottom: 3,
                    transition: 'opacity 0.3s ease',
                    fontFamily: locale === 'ar' ? 'sans-serif' : 'inherit'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = 0.7}
                  onMouseLeave={(e) => e.target.style.opacity = 1}
                >
                  {t("viewFullCollection")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )}
</section>
  );
}
