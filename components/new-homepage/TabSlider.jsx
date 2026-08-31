"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { renderPrice } from "@/utlis/priceRenderer";
import "swiper/css";
import styles from "./TabSlider.module.css";

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
      // console.error("API error:", err);
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

  // Fix: center small lists and ensure the middle item starts as active
  const canLoop = filtered.length > 5;
  const shouldCenter = true;
  const initialSlideIndex = canLoop ? 0 : Math.floor(filtered.length / 2);

  useEffect(() => {
    setActiveIndex(initialSlideIndex);
  }, [currentCategory, initialSlideIndex]);

  return (
    <section className={styles.section}>
      {loading ? (
        <TabSliderSkeleton />
      ) : (
        <>
          {/* Subtle texture overlay */}
          <div className={styles.noiseOverlay} />

          {/* ===== PREMIUM HEADER & TABS ===== */}
          <div className={styles.headerWrapper}>
            <div className={styles.headerGlow} />

            {/* Sub-tagline with animation */}
            <motion.div
              className={styles.subTagline}
              style={{ fontFamily: locale === 'ar' ? 'inherit' : "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className={styles.subTaglineLine} />
              {t("subTitle")}
              <span className={styles.subTaglineLine} />
            </motion.div>

            {/* Main title with rich gradient & glow */}
            <motion.h2
              className={styles.mainTitle}
              style={{
                fontFamily: locale === 'ar' ? 'inherit' : "'Playfair Display', serif",
                letterSpacing: locale === 'ar' ? '0' : '2px',
              }}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {t("title")}
            </motion.h2>

            {/* Modern Animated Divider */}
            <motion.div
              className={styles.modernDivider}
              initial={{ opacity: 0, width: "0%" }}
              whileInView={{ opacity: 1, width: "100%" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
            >
              <div className={styles.dividerLineLeft} />
              <motion.div
                className={styles.dividerDiamond}
                initial={{ rotate: 0, scale: 0 }}
                whileInView={{ rotate: 45, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              />
              <div className={styles.dividerLineRight} />
            </motion.div>

            {/* Micro-animated Underline Tabs */}
            <motion.div
              className={styles.scrollTabs}
              role="tablist"
              aria-label="Product Categories"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              {filterCategories.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={currentCategory === cat.id}
                  onClick={() => {
                    setCurrentCategory(cat.id);
                  }}
                  className={styles.tabButton}
                  style={{
                    color: currentCategory === cat.id ? "#1a1714" : "#8a8078",
                    fontWeight: currentCategory === cat.id ? 700 : 500,
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
            </motion.div>
          </div>

          <motion.div
            className={styles.minimalSeparator}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          />

          {/* ===== SLIDER ===== */}
          {/* ===== SLIDER ===== */}
          <div className={`popularProductsGutter ${styles.sliderContainer}`}>
            <Swiper
              key={currentCategory}
              modules={[Keyboard]}
              keyboard={{ enabled: true }}
              slideToClickedSlide={true}
              centeredSlides={shouldCenter}
              loop={canLoop}
              initialSlide={initialSlideIndex}
              speed={1200}
              grabCursor
              watchOverflow={false}
              breakpoints={{
                0: { slidesPerView: 1.65, spaceBetween: 14 },
                768: { slidesPerView: 3, spaceBetween: 24 },
                992: { slidesPerView: 3.8, spaceBetween: 30 },
                1200: { slidesPerView: 4.8, spaceBetween: 36 },
                1537: { slidesPerView: 5, spaceBetween: 56 },
              }}
              onSlideChange={(s) => setActiveIndex(s.realIndex)}
              style={{ overflow: "visible" }}
            >
              {filtered.map((item) => {
                let imgs = [];
                try {
                  imgs = item.images ? JSON.parse(item.images) : [];
                } catch {
                  // console.warn("Failed to parse product images for", item.product_id);
                }

                const isActive = activeProduct?.product_id === item.product_id;

                return (
                  <SwiperSlide key={item.product_id}>
                    <div className="product-card-wrapper">
                      <div className="product-card" style={{ background: "#f5f1eb" }}>
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
                              />
                            )}
                            {imgs[1] && (
                              <Image
                                src={`${BASE_URL}storage/${imgs[1]}`}
                                width={330}
                                height={400}
                                alt={decodeHtml(item.product_name)}
                                className="pc__img pc__img-second"
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
          <div className={styles.infoBlock}>
            <AnimatePresence mode="popLayout">
              {activeProduct && (
                <motion.div
                  key={`${currentCategory}-${activeProduct.product_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className={styles.infoBlockInner}
                >
                  <div className={styles.categoryLabelWrapper}>
                    <div className={styles.categoryLabelLine} />
                    <span
                      className={styles.categoryLabel}
                      style={{ fontFamily: locale === 'ar' ? 'inherit' : "'Inter', sans-serif" }}
                    >
                      {locale === 'ar' ? activeProduct.category_name_ar : activeProduct.category_name}
                    </span>
                    <div className={styles.categoryLabelLine} />
                  </div>

                  <h3
                    className={styles.productName}
                    style={{
                      fontFamily: locale === 'ar' ? 'inherit' : "'Playfair Display', serif",
                      fontStyle: locale === 'ar' ? 'normal' : 'italic'
                    }}
                  >
                    {locale === 'ar' ? decodeHtml(activeProduct.product_name_ar) : decodeHtml(activeProduct.product_name)}
                  </h3>

                  <div
                    className={styles.productPrice}
                    style={{ fontFamily: locale === 'ar' ? 'inherit' : "'Inter', sans-serif" }}
                  >
                    {renderPrice(activeProduct, currency)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Link
                href={currentCategory === "All" ? `/${locale}/shop` : `/${locale}/product-category/${clean(currentCategory)}`}
                className={styles.collectionButton}
              >
                <span>{t("viewFullCollection")}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
