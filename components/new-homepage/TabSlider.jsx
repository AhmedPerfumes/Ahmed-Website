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
import { useMenu } from "@/context/MenuContext";
import Skeleton from "@mui/material/Skeleton";
import LabelIcon from "@/components/labels/LabelIcon";

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
        <Skeleton variant="text" width={220} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.05)', mb: 2 }} />
        <Skeleton variant="text" width={340} height={56} sx={{ bgcolor: 'rgba(0,0,0,0.05)', mb: 2 }} />
        <Skeleton variant="rectangular" width={80} height={2} sx={{ bgcolor: 'rgba(185,161,107,0.2)', mb: 4 }} />
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
        <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.05)', mb: 1 }} />
        <Skeleton variant="text" width={280} height={42} sx={{ bgcolor: 'rgba(0,0,0,0.05)', mb: 2 }} />
        <Skeleton variant="rectangular" width={160} height={50} sx={{ bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '99px' }} />
      </div>
    </div>
  );
};

export default function PopularProducts() {
  const t = useTranslations("PopularProducts");
  const { addProductToCart, cartProducts, setCartProducts } = useContextElement();
  const locale = useLocale();
  
  const { currency, isLoading: isMenuLoading } = useMenu();

  const [apiData, setApiData] = useState({});
  const [currentCategory, setCurrentCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const rafRef = useRef(null);

  const getProductQuantity = (id) => {
    const item = (cartProducts || []).find(p => p.product_id === id);
    return item ? item.quantity : 0;
  };

  const updateQuantity = (id, delta) => {
    if (!setCartProducts) return;
    setCartProducts(prev => {
      return prev.map(p => {
        if (p.product_id === id) {
          const newQty = (p.quantity || 1) + delta;
          return newQty > 0 ? { ...p, quantity: newQty } : null;
        }
        return p;
      }).filter(Boolean);
    });
  };

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
      slide.style.willChange = abs < 0.5 ? "transform, opacity" : "auto";
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

      .product-card-wrapper .product-card__actions {
        z-index: 10;
        background: rgba(26, 26, 26, 0.95);
      }

      .product-card-wrapper .pc__qty-selector--desktop {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        height: 44px;
      }

      .product-card-wrapper .pc__qty-selector--desktop .qty-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0 15px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .product-card-wrapper .pc__qty-selector--desktop .qty-value {
        color: #fff;
        font-weight: 600;
        font-size: 0.9rem;
      }

      @media (max-width: 767px) {
        .product-card-wrapper .product-card__actions {
          display: flex !important;
          transform: translateY(0) !important;
          background: rgba(26, 26, 26, 0.9) !important;
          bottom: 0 !important;
        }
      }
    `,
        }}
      />

      {/* ===== HEADER & TABS ===== */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        {/* Sub-tagline */}
        <div style={{
          fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
          letterSpacing: '4px',
          color: '#b9a16b',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontFamily: locale === 'ar' ? 'inherit' : "'Inter', sans-serif"
        }}>
          <span style={{ fontSize: 6, color: '#b9a16b', opacity: 0.6 }}>◆</span>
          {t("subTitle")}
        </div>

        {/* Main title */}
        <h2 style={{
          fontFamily: locale === 'ar' ? 'inherit' : "'Playfair Display', serif",
          fontSize: 'clamp(1.75rem, 6vw, 3.2rem)',
          fontWeight: 400,
          color: '#1a1714',
          letterSpacing: locale === 'ar' ? '0' : '2px',
          textTransform: 'uppercase',
          margin: '0 0 16px',
          lineHeight: 1.2
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
                fontFamily: locale === 'ar' ? 'inherit' : "'Inter', sans-serif",
                fontSize: locale === 'ar' ? 'clamp(0.95rem, 2.5vw, 1.1rem)' : 'clamp(0.75rem, 2vw, 0.85rem)',
                letterSpacing: locale === 'ar' ? '0' : '1.5px'
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
                      {Array.isArray(item.labels) && item.labels.length > 0 && (
                        <div className="d-flex flex-column position-absolute top-0 end-0 mt-2 me-2" style={{ gap: "4px", zIndex: 10 }}>
                          {item.labels.map((lbl, idx) => (
                            <LabelIcon
                              key={idx}
                              name={lbl.label_name}
                              title={lbl.label_name}
                              icon={lbl.label_color}
                              size={40}
                            />
                          ))}
                        </div>
                      )}
                      {!Array.isArray(item.labels) && item.label_name && (
                        <div className="position-absolute top-0 end-0 mt-2 me-2" style={{ zIndex: 10 }}>
                          <LabelIcon
                            name={item.label_name}
                            title={item.label_name}
                            icon={item.label_color}
                            size={40}
                          />
                        </div>
                      )}

                      {item.product_qty <= 0 ? (
                        <div style={{ backgroundColor: "#dc3545", zIndex: 10, position: 'absolute', fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', letterSpacing: '1px' }} className={`product-label text-uppercase text-white top-0 mt-2 mx-2 ${locale === 'ar' ? 'right-0' : 'left-0'}`}>
                          {t("outOfStock")}
                        </div>
                      ) : (
                        item.discount && item.discount.discount_type === 'percent' && (
                          <div style={{ backgroundColor: "#198754", zIndex: 10, position: 'absolute', fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', letterSpacing: '1px' }} className={`product-label text-uppercase text-white top-0 mt-2 mx-2 ${locale === 'ar' ? 'right-0' : 'left-0'}`}>
                            {t("sale", { value: item.discount.value })}
                          </div>
                        )
                      )}
                      {/* --- END LABEL LOGIC --- */}

                      {/* ✅ ADD TO CART & QUANTITY ACTIONS — ONLY CENTER SLIDE */}
                      {isActive && (
                        <div className="product-card__actions">
                          {getProductQuantity(item.product_id) > 0 ? (
                            <div className="pc__qty-selector--desktop">
                              <button 
                                className="qty-btn" 
                                onClick={(e) => { 
                                  e.preventDefault(); 
                                  e.stopPropagation(); 
                                  updateQuantity(item.product_id, -1); 
                                }} 
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="qty-value">{getProductQuantity(item.product_id)}</span>
                              <button 
                                className="qty-btn" 
                                onClick={(e) => { 
                                  e.preventDefault(); 
                                  e.stopPropagation(); 
                                  updateQuantity(item.product_id, 1); 
                                }} 
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          ) : item.product_qty > 0 ? (
                            <button
                              className="btn btn-primary js-add-cart w-100 h-100 border-0"
                              style={{ height: '44px', background: 'none' }}
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
                          ) : (
                            <button 
                              className="btn btn-out-of-stock w-100 h-100 border-0 text-white" 
                              disabled 
                              style={{ height: '44px', background: 'none' }}
                            >
                              {t("outOfStock")}
                            </button>
                          )}
                        </div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 24, height: 1, background: 'rgba(185, 161, 107, 0.5)' }} />
                <span
                  style={{
                    fontSize: '0.65rem',
                    textTransform: "uppercase",
                    letterSpacing: 4,
                    color: "#b9a16b",
                    fontWeight: 700,
                    fontFamily: locale === 'ar' ? 'inherit' : "'Inter', sans-serif"
                  }}
                >
                  {locale === 'ar' ? activeProduct.category_name_ar : activeProduct.category_name}
                </span>
                <div style={{ width: 24, height: 1, background: 'rgba(185, 161, 107, 0.5)' }} />
              </div>

              <h3
                style={{
                  fontSize: 'clamp(2rem, 6vw, 3.2rem)',
                  fontFamily: locale === 'ar' ? 'inherit' : "'Playfair Display', serif",
                  fontWeight: 400,
                  marginBottom: 16,
                  color: '#1a1714',
                  letterSpacing: '0.01em',
                  lineHeight: 1.1,
                  fontStyle: locale === 'ar' ? 'normal' : 'italic'
                }}
              >
                {locale === 'ar' ? decodeHtml(activeProduct.product_name_ar) : decodeHtml(activeProduct.product_name)}
              </h3>

              <div
                style={{
                  fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                  fontWeight: 500,
                  marginBottom: 32,
                  color: '#1a1714',
                  fontFamily: locale === 'ar' ? 'inherit' : "'Inter', sans-serif",
                  letterSpacing: 1
                }}
              >
                {renderPrice(activeProduct, currency)}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link href={`/${locale}/shop`} className="ts-modern-btn">
                  <span>{t("viewFullCollection")}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
