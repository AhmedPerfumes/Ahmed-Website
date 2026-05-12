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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const filterCategories = [
  "All",
  "Perfumes",
  "Dakhoon",
  "Concentrated Parfum",
  "Gift Sets",
  "Care Essentials",
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

export default function PopularProducts() {
  const { addProductToCart } = useContextElement();
  const locale = useLocale();
  const t = useTranslations();
  const { currency, isLoading: isMenuLoading } = useMenu();

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
    <section className="tab-slider-section">
      {/* Subtle texture overlay */}
      <div className="tab-slider-bg-noise" />
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
        font-size: clamp(0.55rem, 2vw, 0.68rem) !important;
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
      <div className="tab-slider-header">
        {/* Sub-tagline */}
        <div className="tab-slider-subtagline">
          <span style={{ fontSize: 6, color: '#b9a16b', opacity: 0.6 }}>◆</span>
          {t("Explore Our Collection")}
        </div>

        {/* Main title */}
        <h2 className="tab-slider-title">
          {t("Explore by Category")}
        </h2>

        {/* Diamond divider */}
        <div className="tab-slider-diamond-divider">
          <div className="tab-slider-diamond-line-left" />
          <div className="tab-slider-diamond" />
          <div className="tab-slider-diamond-line-right" />
        </div>

        <div className="scroll-tabs">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCurrentCategory(cat);
                setActiveIndex(0);
              }}
              className={`tab-slider-tab-btn ${currentCategory === cat ? 'active' : ''}`}
            >
              {t(cat)}
              {currentCategory === cat && (
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
      <div className="popularProductsGutter tab-slider-slider-wrapper">
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
                        <div style={{ backgroundColor: item.label_color, zIndex: 10, position: 'absolute' }} className="product-label text-uppercase text-white top-0 left-auto right-0 mt-2 mx-2">
                          {item.label_name}
                        </div>
                      )}

                      {item.product_qty <= 0 ? (
                        <div style={{ backgroundColor: "#dc3545", zIndex: 10, position: 'absolute' }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2 ">
                          {t("Out Of Stock")}
                        </div>
                      ) : (
                        item.discount && item.discount.discount_type === 'percent' && (
                          <div style={{ backgroundColor: "#198754", zIndex: 10, position: 'absolute' }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2">
                            {t("Sale")} {item.discount.value}%
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
                          {t("Add To Cart")}
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
      <div className="tab-slider-info-block">
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
              <span className="tab-slider-info-category">
                {activeProduct.category_name}
              </span>

              <h3 className="tab-slider-info-title">
                {decodeHtml(activeProduct.product_name)}
              </h3>

              {/* Diamond divider */}
              <div style={{ width: 5, height: 5, background: '#b9a16b', transform: 'rotate(45deg)', opacity: 0.5, marginBottom: 12 }} />

              <div className="tab-slider-info-price">
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
                  <button className="tab-slider-explore-btn">
                    {t("Explore Product")}
                  </button>
                </Link>

                <Link
                  href={`/${locale}/shop`}
                  className="tab-slider-view-all"
                >
                  {t("View Full Collection")} &gt;
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
