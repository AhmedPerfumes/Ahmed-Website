"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useContextElement } from "@/context/Context";
import { useMenu } from "@/context/MenuContext";
import { useLocale, useTranslations } from "next-intl";
import { renderPrice } from "@/utlis/priceRenderer";
import LabelIcon from "@/components/labels/LabelIcon";
import he from "he";
import { motion, AnimatePresence } from "framer-motion";

export default function CompleteOrderSlider({ products: propProducts }) {
  const uniqueProducts = (items) => {
    if (!Array.isArray(items)) return [];
    const seen = new Set();
    return items.filter((p) => {
      const id = p.product_id || p.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  const [products, setProducts] = useState(uniqueProducts(propProducts));
  const [isLoading, setIsLoading] = useState(!propProducts || propProducts.length === 0);
  const { cartProducts, setCartProducts, addProductToCart, removeProduct, isAddedToCartProducts } = useContextElement();
  const { currency } = useMenu();
  const locale = useLocale();
  const t = useTranslations();

  // Always live-fetch fresh complete-order products on client to bypass any SSR / page cache
  useEffect(() => {
    let isMounted = true;

    const fetchLiveCompleteOrderProducts = async () => {
      try {
        const timestamp = Date.now();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/complete-order-products?_t=${timestamp}`
        );

        if (!res.ok) throw new Error("Failed to fetch complete order products");
        const json = await res.json();
        if (isMounted && json?.status && Array.isArray(json.data)) {
          setProducts(uniqueProducts(json.data));
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching live complete order products:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLiveCompleteOrderProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute number of selected products in this slider
  const selectedCount = useMemo(() => {
    if (!products || !products.length) return 0;
    return products.filter((p) => isAddedToCartProducts(p.product_id)).length;
  }, [products, cartProducts]);

  // Get current cart quantity for a specific product
  const getProductCartQty = (productId) => {
    const item = cartProducts.find((p) => p.product_id === productId);
    return item ? (item.quantity || 1) : 0;
  };

  // Toggle item in cart
  const handleToggleProduct = (elm, e) => {
    if (e) e.stopPropagation();

    const isAdded = isAddedToCartProducts(elm.product_id);
    if (isAdded) {
      removeProduct(elm.product_id);
    } else {
      if (elm.product_qty <= 0) return;

      const formattedItem = {
        ...elm,
        product_id: elm.product_id,
        quantity: 1,
        category_name: elm.category_name || "Perfumes",
        subcategory_name: elm.subcategory?.subcategory_name || "Oriental Fragrance",
      };
      addProductToCart(formattedItem);
    }
  };

  // Update quantity directly for cart items
  const handleUpdateQuantity = (elm, newQty, e) => {
    if (e) e.stopPropagation();

    const stock = Number(elm.product_qty || 999);
    const maxOrder = Number(elm.maximum_order_quantity || stock);
    const limit = maxOrder > 0 ? Math.min(maxOrder, stock) : stock;

    if (newQty <= 0) {
      removeProduct(elm.product_id);
      return;
    }

    if (newQty > limit) {
      return;
    }

    const items = [...cartProducts];
    const index = items.findIndex((p) => p.product_id === elm.product_id);

    if (index !== -1) {
      items[index] = { ...items[index], quantity: newQty };
      setCartProducts(items);
    } else {
      const formattedItem = {
        ...elm,
        product_id: elm.product_id,
        quantity: newQty,
        category_name: elm.category_name || "Perfumes",
        subcategory_name: elm.subcategory?.subcategory_name || "Oriental Fragrance",
      };
      addProductToCart(formattedItem);
    }
  };

  const renderCardPrice = (elm) => {
    const isDiscountActive = elm.discount && (elm.discount.discount_type || elm.discount.value);
    if (isDiscountActive) {
      const discountVal = Number(elm.discount.value || 0);
      let discountedPrice = elm.discount.final_price;
      if (elm.discount.discount_type === "percent") {
        discountedPrice = (Number(elm.price) - (Number(elm.price) * discountVal) / 100).toFixed(2);
      } else if (elm.discount.discount_type === "amount") {
        discountedPrice = elm.discount.final_price || (Number(elm.price) - discountVal).toFixed(2);
      }

      return (
        <div className="d-flex align-items-baseline justify-content-center gap-1">
          <span
            className="text-muted text-decoration-line-through"
            style={{
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "#8E8880",
            }}
          >
            {Number(elm.price).toFixed(2)} {currency?.symbol || "AED"}
          </span>
          <span
            className="fw-bold text-dark"
            style={{
              fontSize: "0.85rem",
              color: "#111111",
              letterSpacing: "-0.01em",
            }}
          >
            {discountedPrice} {currency?.symbol || "AED"}
          </span>
        </div>
      );
    }

    if (elm.sale_price && Number(elm.sale_price) > 0 && Number(elm.sale_price) < Number(elm.price)) {
      return (
        <div className="d-flex align-items-baseline justify-content-center gap-1">
          <span
            className="text-muted text-decoration-line-through"
            style={{
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "#8E8880",
            }}
          >
            {Number(elm.price).toFixed(2)} {currency?.symbol || "AED"}
          </span>
          <span
            className="fw-bold text-dark"
            style={{
              fontSize: "0.85rem",
              color: "#111111",
              letterSpacing: "-0.01em",
            }}
          >
            {Number(elm.sale_price).toFixed(2)} {currency?.symbol || "AED"}
          </span>
        </div>
      );
    }

    return (
      <span
        className="fw-bold text-dark"
        style={{
          fontSize: "0.85rem",
          color: "#111111",
          letterSpacing: "-0.01em",
        }}
      >
        {Number(elm.price).toFixed(2)} {currency?.symbol || "AED"}
      </span>
    );
  };

  const getProductImage = (elm) => {
    if (elm.image) {
      return elm.image.startsWith("http")
        ? elm.image
        : `${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image.replace(/^\/+/, "")}`;
    }

    if (elm.images) {
      try {
        const arr = typeof elm.images === "string" ? JSON.parse(elm.images) : elm.images;
        if (Array.isArray(arr) && arr.length > 0) {
          return arr[0].startsWith("http")
            ? arr[0]
            : `${process.env.NEXT_PUBLIC_API_URL}storage/${arr[0].replace(/^\/+/, "")}`;
        }
      } catch (e) { }
    }

    return "/assets/images/placeholder.png";
  };

  if (isLoading || !products || products.length === 0) {
    return null;
  }

  const isRtl = locale === "ar";

  return (
    <div className="complete-order-wrapper mt-4 pt-4 border-top">
      {/* Header Container with Luxury Accent */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(18, 18, 18, 0.06)",
              color: "#111",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          <h5
            className="fw-bold mb-0 text-dark"
            style={{
              fontSize: "1.05rem",
              letterSpacing: "-0.01em",
              fontFamily: "inherit",
            }}
          >
            {locale === "ar" ? "اكتشف المزيد، اعثر على ما تفضله" : "Explore More, Find Your Favorite"}
          </h5>
        </div>

        <span
          className="badge rounded-pill"
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: selectedCount > 0 ? "#111" : "#f1f0ee",
            color: selectedCount > 0 ? "#fff" : "#666",
            padding: "4px 10px",
            transition: "all 0.2s ease",
          }}
        >
          {locale === "ar"
            ? `${selectedCount} تم إضافته`
            : `${selectedCount} added`}
        </span>
      </div>

      {/* Slider Carousel Container */}
      <div className="position-relative complete-order-slider-container">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".cos-next-btn",
            prevEl: ".cos-prev-btn",
          }}
          spaceBetween={12}
          slidesPerView={2.2}
          breakpoints={{
            320: { slidesPerView: 2.1, spaceBetween: 8 },
            480: { slidesPerView: 2.3, spaceBetween: 10 },
            768: { slidesPerView: 3.2, spaceBetween: 12 },
            992: { slidesPerView: 2.4, spaceBetween: 12 },
            1200: { slidesPerView: 3.2, spaceBetween: 12 },
          }}
          className="complete-order-swiper pb-1"
        >
          {products.map((elm) => {
            const isAdded = isAddedToCartProducts(elm.product_id);
            const currentQty = getProductCartQty(elm.product_id);
            const isOutOfStock = elm.product_qty <= 0;
            const displayName =
              locale === "ar" && elm.product_name_ar
                ? elm.product_name_ar
                : elm.product_name
                  ? he.decode(elm.product_name)
                  : "Product";
            const imageUrl = getProductImage(elm);

            return (
              <SwiperSlide key={elm.product_id || elm.id}>
                <div
                  className={`complete-order-card position-relative p-2 rounded-3 d-flex flex-column justify-content-between text-center ${isAdded ? "is-selected shadow-sm" : ""
                    } ${isOutOfStock ? "is-out-of-stock" : ""}`}
                  style={{
                    backgroundColor: isAdded ? "#FAFAF8" : "#FFFFFF",
                    border: isAdded ? "1.5px solid #111111" : "1px solid #EAE7E2",
                    borderRadius: "8px",
                    cursor: "default",
                    minHeight: "205px",
                    transition: "all 0.2s ease-in-out",
                    userSelect: "none",
                  }}
                >
                  {/* Top Left: Sale / Out of Stock Badge */}
                  <div className="position-absolute top-0 start-0 m-1.5 d-flex flex-column gap-1" style={{ zIndex: 4 }}>
                    {isOutOfStock ? (
                      <span
                        className="badge text-white px-2 py-1"
                        style={{
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          backgroundColor: "#dc3545",
                          borderRadius: "4px",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {locale === "ar" ? "نفد" : "Out of Stock"}
                      </span>
                    ) : (elm.discount || (elm.sale_price && Number(elm.sale_price) > 0 && Number(elm.sale_price) < Number(elm.price))) ? (
                      <span
                        className="badge text-white px-2 py-1"
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          backgroundColor: "#198754",
                          borderRadius: "4px",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          boxShadow: "0 1px 4px rgba(25, 135, 84, 0.25)",
                        }}
                      >
                        {locale === "ar" ? "تخفيض" : "Sale"}
                      </span>
                    ) : null}
                  </div>

                  {/* Top Right: Label Icons (e.g. Best Seller, Exclusive) */}
                  {Array.isArray(elm.labels) && elm.labels.length > 0 && (
                    <div className="position-absolute top-0 end-0 m-1 d-flex flex-column gap-1" style={{ zIndex: 4 }}>
                      {elm.labels.map((lbl, idx) => (
                        <LabelIcon
                          key={idx}
                          name={lbl.label_name}
                          title={lbl.label_name}
                          icon={lbl.label_color}
                          size={24}
                        />
                      ))}
                    </div>
                  )}

                  {/* Compact Product Image Container */}
                  <div
                    className="cos-img-wrapper d-flex align-items-center justify-content-center mt-1 mb-1"
                    style={{ height: "80px", width: "100%", overflow: "hidden" }}
                  >
                    <Image
                      src={imageUrl}
                      alt={displayName}
                      width={80}
                      height={80}
                      className="img-fluid"
                      style={{
                        maxHeight: "80px",
                        objectFit: "contain",
                        transition: "transform 0.25s ease",
                      }}
                    />
                  </div>

                  {/* Product Title & Price */}
                  <div className="cos-info mb-1">
                    <div
                      className="cos-title fw-semibold text-dark mb-1 text-truncate-2"
                      style={{
                        fontSize: "0.78rem",
                        lineHeight: "1.2",
                        minHeight: "2.4em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      title={displayName}
                    >
                      {displayName}
                    </div>

                    <div className="cos-price mb-1">
                      {renderCardPrice(elm)}
                    </div>
                  </div>

                  {/* Quantity Option / Add Button Controls */}
                  <div className="cos-actions mt-auto pt-1 w-100" onClick={(e) => e.stopPropagation()}>
                    {isAdded ? (
                      /* Compact Quantity Selector Pill when item is Added */
                      <div
                        className="d-flex align-items-center justify-content-between rounded-pill px-2 mx-auto"
                        style={{
                          backgroundColor: "#111111",
                          color: "#FFFFFF",
                          width: "100%",
                          maxWidth: "105px",
                          height: "30px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.12)",
                        }}
                      >
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={(e) => handleUpdateQuantity(elm, currentQty - 1, e)}
                          className="btn btn-sm text-white p-0 d-flex align-items-center justify-content-center border-0 bg-transparent"
                          style={{ width: "22px", height: "22px", fontSize: "1rem", lineHeight: 1, cursor: "pointer" }}
                        >
                          −
                        </button>

                        <span
                          className="text-white fw-bold px-1"
                          style={{ fontSize: "0.8rem", minWidth: "18px", textAlign: "center", userSelect: "none" }}
                        >
                          {currentQty}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={(e) => handleUpdateQuantity(elm, currentQty + 1, e)}
                          className="btn btn-sm text-white p-0 d-flex align-items-center justify-content-center border-0 bg-transparent"
                          style={{ width: "22px", height: "22px", fontSize: "1rem", lineHeight: 1, cursor: "pointer" }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      /* Clean Single-line Quick Add Button */
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={(e) => handleToggleProduct(elm, e)}
                        className="cos-add-btn btn btn-sm rounded-pill w-100 fw-semibold d-inline-flex align-items-center justify-content-center"
                        style={{
                          fontSize: "0.75rem",
                          height: "30px",
                          lineHeight: "30px",
                          padding: "0 8px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          border: "1px solid #D8D4CE",
                          color: isOutOfStock ? "#999" : "#111",
                          backgroundColor: "#FBFBFA",
                          gap: "4px",
                          cursor: isOutOfStock ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, lineHeight: 1 }}>+</span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          {locale === "ar" ? "أضف" : "Add"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons (Next / Prev) */}
        <button
          type="button"
          aria-label="Previous products"
          className="cos-prev-btn position-absolute top-50 start-0 translate-middle-y shadow border-0 d-flex align-items-center justify-content-center"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            zIndex: 10,
            left: "-12px",
            color: "#111",
            cursor: "pointer",
            boxShadow: "0 3px 12px rgba(0,0,0,0.14)",
            border: "1px solid #ECE9E4",
            transition: "all 0.2s ease",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isRtl ? "rotate(180deg)" : "none" }}
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next products"
          className="cos-next-btn position-absolute top-50 end-0 translate-middle-y shadow border-0 d-flex align-items-center justify-content-center"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            zIndex: 10,
            right: "-12px",
            color: "#111",
            cursor: "pointer",
            boxShadow: "0 3px 12px rgba(0,0,0,0.14)",
            border: "1px solid #ECE9E4",
            transition: "all 0.2s ease",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isRtl ? "rotate(180deg)" : "none" }}
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .complete-order-card:hover {
          border-color: #111 !important;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08) !important;
        }
        .complete-order-card:hover .cos-img-wrapper img {
          transform: scale(1.08);
        }
        .complete-order-card.is-selected {
          border-color: #111 !important;
          background-color: #faf9f6 !important;
        }
        .complete-order-card.is-out-of-stock {
          opacity: 0.55;
        }
        .cos-add-btn:hover {
          background-color: #111111 !important;
          color: #ffffff !important;
          border-color: #111111 !important;
        }
        .cos-prev-btn:hover,
        .cos-next-btn:hover {
          background-color: #111 !important;
          color: #fff !important;
          transform: translateY(-50%) scale(1.08);
        }
        .cos-prev-btn:disabled,
        .cos-next-btn:disabled,
        .swiper-button-disabled {
          opacity: 0 !important;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
