"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import he from "he";
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from "@/context/MenuContext";
import { useContextElement } from "@/context/Context";
import LabelIcon from "@/components/labels/LabelIcon";
import { Skeleton } from "@mui/material";
import {
  removeSpecialCharactersAndAmp,
  sanitizeUrlParam,
  formatPrice,
} from "@/utils/shop";

/**
 * Determines subcategory slug with fallbacks for specific category mappings.
 */
export const isSubcategory = (category, subcategory) => {
  if (subcategory) {
    const subcatName =
      typeof subcategory === "object"
        ? subcategory.subcategory_name
        : subcategory;
    return sanitizeUrlParam(subcatName);
  }
  const categorySlug = removeSpecialCharactersAndAmp(category)
    .split(" ")
    .join("-")
    .toLowerCase();
  const categoryMap = {
    "gift-sets": "gift-sets",
    "hair-mist": "hair-mist",
    "extrait-de-parfum": "extrait-de-parfum",
    "xtrait-de-parfum": "extrait-de-parfum",
  };
  return categoryMap[categorySlug] || "online-exclusive";
};

/**
 * Builds standard product detail URL path.
 */
export const getProductUrl = (
  elm,
  locale = "en",
  categoryOverride,
  subcategoryOverride
) => {
  if (!elm) return "#";
  const cat = categoryOverride || elm.category_name || "";
  const subcat =
    subcategoryOverride ||
    elm.subcategory?.subcategory_name ||
    elm.subcategory_name ||
    elm.subcategory;
  const categorySlug = sanitizeUrlParam(cat);
  const subcategorySlug = isSubcategory(cat, subcat);
  const productSlug = sanitizeUrlParam(elm.permalink?.key || elm.product_name);
  return `/${locale}/shop/${categorySlug}/${subcategorySlug}/${productSlug}`;
};

/**
 * Safe helper to parse images array from JSON or array.
 */
export const parseProductImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  try {
    const parsed = typeof images === "string" ? JSON.parse(images) : images;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

/**
 * Cross-browser helper to parse GST datetime strings (e.g. 'YYYY-MM-DD HH:mm:ss').
 * Assumes Gulf Standard Time (+04:00) unless a timezone offset is already present.
 */
export const parseGSTDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;
  if (typeof dateStr !== "string") return null;
  const clean = dateStr.trim();
  if (!clean) return null;
  const iso = clean.replace(" ", "T");
  const hasTz =
    iso.includes("+") || iso.endsWith("Z") || /-\d{2}:\d{2}$/.test(iso);
  const d = new Date(hasTz ? iso : `${iso}+04:00`);
  return isNaN(d.getTime()) ? new Date(clean.replace(/-/g, "/")) : d;
};

/**
 * Checks if a product's discount is currently active based on start_date and end_date.
 */
export const isDiscountCurrentlyActive = (discount) => {
  if (!discount) return false;
  const now = Date.now();

  if (discount.start_date) {
    const start = parseGSTDate(discount.start_date);
    if (start && now < start.getTime()) return false;
  }

  if (discount.end_date) {
    const end = parseGSTDate(discount.end_date);
    if (end && now > end.getTime()) return false;
  }

  return true;
};

/**
 * Live countdown timer displayed on product cards.
 * Computes remaining time until discount end_date, omits 0 hours/minutes,
 * increases font size when only minutes/seconds remain, and creates urgency
 * when less than 3 minutes are left.
 */
export function ProductCardCountdown({
  endDate,
  startDate,
  locale = "en",
  onExpire,
}) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      if (!endDate) {
        setTimeLeft(null);
        return false;
      }

      const end = parseGSTDate(endDate);
      if (!end) {
        setTimeLeft(null);
        return false;
      }

      const now = Date.now();

      if (startDate) {
        const start = parseGSTDate(startDate);
        if (start && now < start.getTime()) {
          setTimeLeft(null);
          return false;
        }
      }

      const diff = end.getTime() - now;
      if (diff <= 0) {
        setTimeLeft(null);
        if (onExpireRef.current) {
          onExpireRef.current();
        }
        return false;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setTimeLeft({ days, hours, mins, secs, totalMs: diff });
      return true;
    };

    const hasTime = calculate();
    if (!hasTime) return;

    const timer = setInterval(() => {
      const running = calculate();
      if (!running) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, startDate]);

  if (!mounted || !timeLeft) return null;

  const { days, hours, mins, secs, totalMs } = timeLeft;

  const dayUnit = locale === "ar" ? "ي" : "d";
  const hourUnit = locale === "ar" ? "س" : "h";
  const minUnit = locale === "ar" ? "د" : "m";
  const secUnit = locale === "ar" ? "ث" : "s";

  // Build time parts omitting 0 hours or 0 minutes
  const parts = [];
  if (days > 0) parts.push(`${days}${dayUnit}`);
  if (hours > 0) parts.push(`${hours}${hourUnit}`);
  if (mins > 0) parts.push(`${mins}${minUnit}`);
  const formattedSecs =
    days === 0 && hours === 0 && mins === 0
      ? `${secs}${secUnit}`
      : `${String(secs).padStart(2, "0")}${secUnit}`;
  parts.push(formattedSecs);

  const timeString = parts.join(" ");
  const isOnlyMinSec = days === 0 && hours === 0;
  const isUrgent = totalMs <= 3 * 60 * 1000; // Less than 3 minutes
  const labelText = locale === "ar" ? "ينتهي العرض خلال" : "Sale ends in";

  return (
    <div
      className={`product-countdown-box ${isOnlyMinSec ? "product-countdown-box--min-sec" : ""
        } ${isUrgent ? "product-countdown-box--urgent" : ""}`}
      aria-label={`${labelText}: ${timeString}`}
    >
      <span className="product-countdown-box__label">{labelText}</span>
      <span className="product-countdown-box__timer" dir="ltr">
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{timeString}</span>
      </span>
    </div>
  );
}

/**
 * Component to display regular, discounted, or sale price for a product.
 */
export const ProductPrice = ({ elm, currency: propCurrency }) => {
  const menuContext = useMenu();
  const currency = propCurrency || menuContext?.currency;

  const isDiscountActive = isDiscountCurrentlyActive(elm?.discount);

  if (isDiscountActive) {
    let discountedPrice = elm.price;
    if (elm.discount.discount_type === "percent") {
      discountedPrice = elm.price - (elm.price / 100) * elm.discount.value;
    } else if (elm.discount.discount_type === "amount") {
      discountedPrice = elm.price - elm.discount.value;
    }
    return (
      <>
        <span className="money price price-old">
          {formatPrice(elm.price, currency)}
        </span>
        <span className="money price price-sale">
          {" "}
          {formatPrice(discountedPrice, currency)}
        </span>
      </>
    );
  } else if (elm?.sale_price) {
    const salePrice = elm.price - (elm.price / 100) * elm.sale_price;
    return (
      <>
        <span className="money price price-old">
          {formatPrice(elm.price, currency)}
        </span>
        <span className="money price price-sale">
          {" "}
          {formatPrice(salePrice, currency)}
        </span>
      </>
    );
  }
  return (
    <span className="money price">{formatPrice(elm?.price, currency)}</span>
  );
};

/**
 * Skeleton loader placeholder for product card.
 */
export const ProductCardSkeleton = ({ className = "" }) => (
  <div className={`product-card-wrapper ${className}`}>
    <div className="product-card mb-3 mb-md-4 mb-xxl-5">
      <div className="pc__img-wrapper">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={"100%"}
          sx={{ aspectRatio: "480/600" }}
        />
      </div>
      <div
        className="pc__info"
        style={{
          padding: "15px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} />
      </div>
    </div>
  </div>
);

/**
 * Standard reusable Product Card helper component.
 * References the canonical design and logic from Shop1.jsx.
 */
export default function ProductCard({
  product,
  elm: elmProp,
  index = 0,
  category: categoryProp,
  subcategory: subcategoryProp,
  locale: localeProp,
  currency: currencyProp,
  wrapperClassName = "product-card-wrapper",
  cardClassName = "product-card mb-3 mb-md-4 mb-xxl-5",
  noWrapper = false,
  showCategory = true,
  showLabels = true,
  showNavigation = true,
  labelIconSize = 40,
  imageWidth = 480,
  imageHeight = 600,
  sizes = "(max-width: 768px) 50vw, 33vw",
  priority = false,
  quantity: quantityProp,
  onAddToCart,
  onUpdateQuantity,
  onGetQuantity,
}) {
  const elm = product || elmProp;
  const currentLocale = useLocale();
  const locale = localeProp || currentLocale;
  const t = useTranslations();
  const { currency: menuCurrency } = useMenu();
  const currency = currencyProp || menuCurrency;

  const {
    addProductToCart,
    cartProducts = [],
    setCartProducts,
    triggerToast,
  } = useContextElement();

  const [isDiscountExpired, setIsDiscountExpired] = useState(false);

  useEffect(() => {
    setIsDiscountExpired(false);
  }, [elm?.discount?.end_date, elm?.discount?.start_date, elm?.product_id]);

  const handleDiscountExpired = useCallback(() => {
    setIsDiscountExpired(true);
  }, []);

  const isDiscountActive = useMemo(() => {
    if (isDiscountExpired) return false;
    return isDiscountCurrentlyActive(elm?.discount);
  }, [elm?.discount, isDiscountExpired]);

  const category = categoryProp || elm?.category_name;
  const subcategory =
    subcategoryProp ||
    elm?.subcategory?.subcategory_name ||
    elm?.subcategory_name ||
    elm?.subcategory;

  const productLink = useMemo(() => {
    return getProductUrl(elm, locale, category, subcategory);
  }, [elm, locale, category, subcategory]);

  const images = useMemo(() => {
    return parseProductImages(elm?.images);
  }, [elm?.images]);

  const firstImage = images[0] || elm?.image;
  const secondImage = images[1];

  const displayName = useMemo(() => {
    if (locale === "ar" && elm?.product_name_ar) {
      return he.decode(elm.product_name_ar);
    }
    return elm?.product_name ? t(he.decode(elm.product_name)) : "";
  }, [elm, locale, t]);

  const quantity = useMemo(() => {
    if (typeof quantityProp === "number") return quantityProp;
    if (onGetQuantity && elm?.product_id) return onGetQuantity(elm.product_id);
    const item = (cartProducts || []).find((p) => p.product_id === elm?.product_id);
    return item ? item.quantity : 0;
  }, [quantityProp, onGetQuantity, cartProducts, elm?.product_id]);

  const handleAddToCart = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(elm);
      return;
    }
    const catName =
      (typeof category === "object" ? category?.category_name || category?.name : category) ||
      elm?.category_name;

    const subcatName =
      (typeof subcategory === "object" ? subcategory?.subcategory_name : subcategory) ||
      elm?.subcategory?.subcategory_name ||
      elm?.subcategory_name ||
      (typeof elm?.subcategory === "string" ? elm.subcategory : undefined);

    addProductToCart({
      ...elm,
      category: catName,
      subcategory: subcatName,
      category_name: catName,
      subcategory_name: subcatName,
    });
  };

  const handleUpdateQuantity = (delta, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (onUpdateQuantity) {
      onUpdateQuantity(elm?.product_id, delta);
      return;
    }

    const stock = Number(elm?.product_qty) || 0;
    const maxOrder = Number(elm?.maximum_order_quantity) || 0;
    const limit = maxOrder > 0 ? Math.min(maxOrder, stock) : stock;

    setCartProducts((prev = []) => {
      return prev
        .map((p) => {
          if (p.product_id === elm?.product_id) {
            const newQty = (p.quantity || 1) + delta;
            const rawName =
              locale === "ar"
                ? elm?.product_name_ar || elm?.product_name
                : elm?.product_name;
            const toastName = rawName
              ? removeSpecialCharactersAndAmp(rawName)
              : "";

            if (newQty <= 0) {
              if (triggerToast) {
                triggerToast({
                  product: elm,
                  name: toastName,
                  message: t("Removed from cart"),
                  type: "delete",
                  duration: 2500,
                });
              }
              return null;
            }

            if (newQty > limit) {
              const msg =
                maxOrder > 0 && newQty > maxOrder
                  ? `${t("Maximum allowed quantity is")} ${maxOrder}`
                  : `${t("Only")} ${stock} ${t("left in stock")}`;
              if (triggerToast) {
                triggerToast({
                  product: elm,
                  name: toastName,
                  message: msg,
                  type: "error",
                  duration: 3000,
                });
              }
              return p;
            }

            return { ...p, quantity: newQty };
          }
          return p;
        })
        .filter(Boolean);
    });
  };

  const uniqueId = elm?.product_id ?? index;
  const prevClass = `pc-prev-${uniqueId}`;
  const nextClass = `pc-next-${uniqueId}`;

  const cardContent = (
    <div className={cardClassName}>
      <div className="pc__img-wrapper">
        <Swiper
          className="swiper swiper-container background-img js-swiper-slider"
          slidesPerView={1}
          modules={[Navigation]}
          allowTouchMove={false}
          preventClicks={false}
          preventClicksPropagation={false}
          navigation={
            showNavigation
              ? {
                prevEl: `.${prevClass}`,
                nextEl: `.${nextClass}`,
              }
              : false
          }
        >
          <SwiperSlide className="swiper-slide">
            <Link href={productLink}>
              {firstImage && (
                <Image
                  loading={priority ? "eager" : "lazy"}
                  priority={priority}
                  src={`${process.env.NEXT_PUBLIC_API_URL}storage/${firstImage}`}
                  width={imageWidth}
                  height={imageHeight}
                  alt={elm?.product_name || "img"}
                  className="pc__img"
                  sizes={sizes}
                />
              )}
              {secondImage && (
                <Image
                  loading="lazy"
                  src={`${process.env.NEXT_PUBLIC_API_URL}storage/${secondImage}`}
                  width={imageWidth}
                  height={imageHeight}
                  alt={elm?.product_name || "img"}
                  className="pc__img pc__img-second"
                  sizes={sizes}
                />
              )}
            </Link>

            {/* Top-Right: Countdown Box + Optional Labels */}
            <div
              className="position-absolute top-0 end-0 mt-2 me-2 d-flex flex-column align-items-end"
              style={{ gap: "4px", zIndex: 6, pointerEvents: "none" }}
            >
              {isDiscountActive &&
                elm.discount?.end_date &&
                Boolean(
                  elm.discount?.show_timer &&
                  elm.discount?.show_timer !== "1" &&
                  elm.discount?.show_timer !== 1
                ) && (
                  <ProductCardCountdown
                    endDate={elm.discount.end_date}
                    startDate={elm.discount.start_date}
                    locale={locale}
                    onExpire={handleDiscountExpired}
                  />
                )}

              {showLabels && (
                <>
                  {Array.isArray(elm?.labels) && elm.labels.length > 0 && (
                    <div className="d-flex flex-column" style={{ gap: "4px" }}>
                      {elm.labels.map((lbl, idx) => (
                        <LabelIcon
                          key={idx}
                          name={lbl.label_name}
                          title={lbl.label_name}
                          icon={lbl.label_color}
                          size={labelIconSize}
                        />
                      ))}
                    </div>
                  )}
                  {!Array.isArray(elm?.labels) && elm?.label_name && (
                    <LabelIcon
                      name={elm.label_name}
                      title={elm.label_name}
                      icon={elm.label_color}
                      size={labelIconSize}
                    />
                  )}
                </>
              )}
            </div>

            {/* Top-Left: Sale or Out-of-Stock Badge */}
            {elm?.product_qty <= 0 ? (
              <div className="product-label label--out-of-stock">
                {t("Out Of Stock")}
              </div>
            ) : (
              isDiscountActive && (
                <div className="product-label label--sale">
                  {elm.discount.discount_type === "percent"
                    ? `Sale ${elm.discount.value}%`
                    : "Sale"}
                </div>
              )
            )}
          </SwiperSlide>

          {showNavigation && (
            <>
              <span
                className={`cursor-pointer pc__img-prev ${prevClass}`}
                aria-label={t("Previous Image")}
                role="button"
              >
                <svg
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_prev_sm" />
                </svg>
              </span>
              <span
                className={`cursor-pointer pc__img-next ${nextClass}`}
                aria-label={t("Next Image")}
                role="button"
              >
                <svg
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_next_sm" />
                </svg>
              </span>
            </>
          )}
        </Swiper>

        <div className="product-card__actions">
          {quantity > 0 ? (
            <div className="pc__qty-selector--desktop">
              <button
                className="qty-btn"
                onClick={(e) => handleUpdateQuantity(-1, e)}
                aria-label={t("Decrease quantity")}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={(e) => handleUpdateQuantity(1, e)}
                aria-label={t("Increase quantity")}
              >
                +
              </button>
            </div>
          ) : elm?.product_qty > 0 ? (
            <button
              className="btn btn-primary js-add-cart"
              onClick={handleAddToCart}
            >
              {(elm?.collection_name?.trim()?.toLowerCase() === "pre book" || elm?.collection_name?.trim()?.toLowerCase() === "pre-book")
                ? (t.has("Pre Book") ? t("Pre Book") : "Pre Book")
                : t("Add To Cart")}
            </button>
          ) : (
            <button className="btn btn-out-of-stock" disabled>
              {t("Out Of Stock")}
            </button>
          )}
        </div>
      </div>

      <div className="pc__info position-relative">
        {showCategory && elm?.category_name && (
          <p className="pc__category">{t(elm.category_name)}</p>
        )}
        <h6 className="pc__title">
          <Link href={productLink}>{displayName}</Link>
        </h6>
        <div className="product-card__price d-flex">
          <ProductPrice elm={elm} currency={currency} />
        </div>

        {quantity > 0 ? (
          <div className="pc__qty-selector">
            <button
              className="qty-btn"
              onClick={(e) => handleUpdateQuantity(-1, e)}
              aria-label={t("Decrease quantity")}
            >
              −
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={(e) => handleUpdateQuantity(1, e)}
              aria-label={t("Increase quantity")}
            >
              +
            </button>
          </div>
        ) : elm?.product_qty > 0 ? (
          <button
            className="pc__atc-mobile"
            onClick={handleAddToCart}
            aria-label={
              (elm?.collection_name?.trim()?.toLowerCase() === "pre book" || elm?.collection_name?.trim()?.toLowerCase() === "pre-book")
                ? `Pre-book ${displayName}`
                : t("Add {name} to cart", { name: displayName })
            }
          >
            {(elm?.collection_name?.trim()?.toLowerCase() === "pre book" || elm?.collection_name?.trim()?.toLowerCase() === "pre-book")
              ? (t.has("Pre Book") ? t("Pre Book") : "Pre Book")
              : t("Add To Cart")}
          </button>
        ) : (
          <button className="pc__atc-mobile pc__atc-mobile--oos" disabled>
            {t("Out Of Stock")}
          </button>
        )}
      </div>
    </div>
  );

  if (noWrapper) {
    return cardContent;
  }

  return <div className={wrapperClassName}>{cardContent}</div>;
}
