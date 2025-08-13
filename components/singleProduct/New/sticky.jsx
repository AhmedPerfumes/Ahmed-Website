"use client";

import { ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import "./Sticky.css";

const Sticky = ({ image, name, price }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const target = document.getElementById("product-detail-top");
    if (!target) {
      console.warn("Target element 'product-detail-top' not found");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!show) return null;

  return (
    <div className="sticky-container d-flex align-items-center position-fixed start-50 translate-middle-x shadow rounded-pill border bg-white">
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image}`}
        alt={`Thumbnail for ${name}`}
        className="rounded-circle border"
      />
      <div className="flex-grow-1 text-truncate">
        <p className="mb-0 fw-medium" title={name}>
          {name}
        </p>
        <p className="mb-0 fw-bold">{price} AED</p>
      </div>
      <button
        type="button"
        className="btn btn-dark d-flex align-items-center rounded-pill"
        aria-label={`Add ${name} to cart`}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000")}
      >
        <ShoppingCart />
        Add to Cart
      </button>
    </div>
  );
};

export default Sticky;
