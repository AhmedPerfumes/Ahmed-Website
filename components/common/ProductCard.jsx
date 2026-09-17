"use client";

import React, { useMemo } from "react";
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
 * Component to display regular, discounted, or sale price for a product.
 */
export const ProductPrice = ({ elm, currency: propCurrency }) => {
  const menuContext = useMenu();
  const currency = propCurrency || menuContext?.currency;

  const currentUTC = new Date();
  const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000);
  const current_date_time = currentGST
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const isDiscountActive =
    elm?.discount &&
    new Date(current_date_time) >= new Date(elm.discount.start_date) &&
    new Date(current_date_time) <= new Date(elm.discount.end_date);

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
    const subcatName =
      elm?.subcategory?.subcategory_name ||
      elm?.subcategory_name ||
      (typeof elm?.subcategory === "string" ? elm.subcategory : undefined);

    addProductToCart({
      ...elm,
      category_name: elm?.category_name,
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

            {showLabels && (
              <>
                {Array.isArray(elm?.labels) && elm.labels.length > 0 && (
                  <div
                    className="d-flex flex-column position-absolute top-0 end-0 mt-2 me-2"
                    style={{ gap: "4px", zIndex: 5 }}
                  >
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
                  <div
                    className="position-absolute top-0 end-0 mt-2 me-2"
                    style={{ zIndex: 5 }}
                  >
                    <LabelIcon
                      name={elm.label_name}
                      title={elm.label_name}
                      icon={elm.label_color}
                      size={labelIconSize}
                    />
                  </div>
                )}
              </>
            )}

            {elm?.product_qty <= 0 ? (
              <div className="product-label label--out-of-stock">
                {t("Out Of Stock")}
              </div>
            ) : (
              elm?.discount && (
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
              {t("Add To Cart")}
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
            aria-label={t("Add {name} to cart", { name: displayName })}
          >
            {t("Add To Cart")}
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
