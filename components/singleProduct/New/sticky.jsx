"use client";

import { ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context"; // ✅ hook from your reference
import { useTranslations } from "next-intl";
import "./Sticky.css";

const Sticky = ({ image, name, price, product }) => {
  const [show, setShow] = useState(false);
  const { cartProducts, setCartProducts } = useContextElement();
  const t = useTranslations();

  // check if already in cart
  const isIncludeCard = () => {
    return cartProducts.find((elm) => elm.product_id === product.product_id);
  };

  // add product
  const addToCart = () => {
    if (!isIncludeCard()) {
      const item = {
        ...product,
        quantity: 1,
      };
      setCartProducts((prev) => [...prev, item]);
    }
  };

  // intersection observer for stickiness
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const target = document.getElementById("product-detail-top");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className="sticky-container d-flex align-items-center position-fixed start-50 translate-middle-x shadow rounded-pill border bg-white">
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image}`}
        alt={`Thumbnail for ${product.name}`}
        className="rounded-circle border"
      />

      <div className="flex-grow-1 text-truncate">
        <p className="mb-0 fw-medium" title={name}>
          {name}
        </p>
        <p className="mb-0 fw-bold">
          {price} AED
        </p>
      </div>

      <button
        type="button"
        className="btn btn-dark d-flex align-items-center gap-2 rounded-pill fw-semibold"
        aria-label={`Add ${product.name} to cart`}
        disabled={!!isIncludeCard()}
        onClick={() => addToCart()}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
      >
        <ShoppingCart size={18} />
        {isIncludeCard() ? t("Already Added") : t("Add to Cart")}
      </button>
    </div>
  );
};

export default Sticky;
