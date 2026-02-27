"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { useContextElement } from "@/context/Context";
import { useLocale } from "next-intl";
import { Weight } from "lucide-react";

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
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 0",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .scroll-tabs {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        padding: 0 20px 10px;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,0,0,0.18) transparent;
      }

      .scroll-tabs::-webkit-scrollbar {
        height: 6px;
      }

      .scroll-tabs::-webkit-scrollbar-track {
        background: transparent;
      }

      .scroll-tabs::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.18);
        border-radius: 999px;
      }

      .scroll-tabs::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.26);
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
        {/* <h2
          style={{
            fontSize: "38px",
            textTransform: "uppercase",
            letterSpacing: "inherit",
            marginBottom: 25,
          }}
        >
          Explore by Category
        </h2> */}

        <h2 className="section-head text-center p-3 text-uppercase">Explore by Category</h2>

        <div className="scroll-tabs" style={{ gap: "35px" }}>
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCurrentCategory(cat);
                setActiveIndex(0);
              }}
              style={{
                background: "none",
                border: "none",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                padding: "8px 0",
                fontFamily: "'Kanit-Regular', sans-serif",
                flexShrink: 0,
                fontWeight: 500,
                color: currentCategory === cat ? "#000" : "#a67b30",
                borderBottom: `1.5px solid ${
                  currentCategory === cat ? "#000" : "transparent"
                }`,
                transition: "all 0.4s ease",
                cursor: "pointer",
              }}
            >
              {cat}
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
            } catch {}

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
                          Add To Cart
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
          }}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 3,
              marginBottom: 12,
              color: "#a67b30",
            }}
          >
            {activeProduct.category_name}
          </span>

          <h3
            style={{
              fontSize: 26,
              fontFamily: "'Kanit-Regular', sans-serif",
              fontWeight: 300,
              marginBottom: 10,
            }}
          >
            {decodeHtml(activeProduct.product_name)}
          </h3>

          <div
            style={{
              fontSize: 19,
              fontWeight: 300,
              marginBottom: 30,
              fontFamily: "'Kanit-Regular', sans-serif",
            }}
          >
            AED {activeProduct.price}
          </div>

          {/* ✅ RESTORED BUTTON (you had it earlier) */}
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
                background: "#000",
                color: "#fff",
                border: "none",
                padding: "15px 55px",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Shop Now
            </button>
          </Link>
          {/* VIEW ALL CTA */}
       <div style={{ marginTop: 30 }}>
              <Link
                href="/shop"
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#000",
                  textDecoration: "none",
                  letterSpacing: 1.5,
                  borderBottom: "1px solid rgb(166, 123, 48)",
                  paddingBottom: 4,
                }}
              >
                View All
              </Link>
            </div>
        </div>
      )}
      
    </section>
  );
}
