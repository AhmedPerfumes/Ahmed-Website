import { Star } from 'lucide-react'
import React from 'react'
import he from 'he';

const Top = ({product}) => {

  const cleanName = he.decode(product?.product_name || "Default");
  console.log(cleanName); // "Oud & Roses"
  return (
    <div className="mt-lg-4">
        {/* Rating */}
        <div
          className="d-flex align-items-center mb-1"
          style={{ fontSize: "0.875rem", gap: "4px" }}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              // className="text-warning"
              style={{ width: "1rem", height: "1rem", fill: "#facc15", textOpacity: 1, color: "rgba(255, 193, 7, 1)" }}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            />
          ))}
          <span
            className="text-muted"
            style={{ fontSize: "0.75rem", fontFamily: "Cinzel, serif" }}
          >
            (85 reviews)
          </span>
        </div>

        {/* Product Name */}
        <h1
          className="text-dark mb-1"
          style={{ fontFamily: "Lobster, cursive", fontSize: "calc(1.375rem + 1.5vw)" }}
        >
          {cleanName}
        </h1>

        {/* Categories */}
        <p
          className="text-muted mb-0"
          style={{
            fontSize: "0.8rem",
            fontFamily: "monospace",
            color: "6a7282",
          }}
        >
          CATEGORIES: {(product?.category)?.toString().toUpperCase()}, {(product?.subcategory)?.toString().toUpperCase()}
        </p>
      </div>
  )
}

export default Top