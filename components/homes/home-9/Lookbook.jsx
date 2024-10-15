"use client";
import { products17, products17mob } from "@/data/products/fashion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import Image from "next/image";

export default function Lookbook() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const isMobileDevice = () => {
      return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    };

    setIsMobile(isMobileDevice());
  }, []);

  return (
    <div className="lookbook-products container position-relative">
      <img
        className="h-auto"
        loading="lazy"
        src={
          !isMobile
            ? "https://www.ahmedalmaghribi.com/wp-content/uploads/2024/05/web-banner.jpg"
            : "https://www.ahmedalmaghribi.com/wp-content/uploads/2024/05/giftset-mobile-banner.jpg"
        }
        alt="image"
      />
      {!isMobile
        ? products17.map(({ id, style, imgSrc, price, title }) => (
            <React.Fragment key={id}>
              <button
                className="popover-point type2 position-absolute"
                style={style}
                data-tooltip-id={id.toString()}
              >
                <span>+</span>
              </button>
              <Tooltip
                place="right-start"
                className="example"
                render={({ content, activeAnchor }) => (
                  <div className="popover-product">
                    <Link href={`/product1_simple/${id}`}>
                      <img
                        width={330}
                        height={400}
                        loading="lazy"
                        className="mb-3"
                        src={imgSrc}
                        alt="image"
                      />
                    </Link>
                    <p className="fw-medium mb-0">
                      <Link href={`/product1_simple/${id}`}>{title}</Link>
                    </p>
                    <p className="mb-0">${price}</p>
                  </div>
                )}
                openOnClick
                id={id.toString()}
              />
            </React.Fragment>
          ))
        : products17mob.map(({ id, style, imgSrc, price, title }) => (
            <React.Fragment key={id}>
              <button
                className="popover-point type2 position-absolute"
                style={style}
                data-tooltip-id={id.toString()}
              >
                <span>+</span>
              </button>
              <Tooltip
                place="right-start"
                className="example"
                render={({ content, activeAnchor }) => (
                  <div className="popover-product">
                    <Link href={`/product1_simple/${id}`}>
                      <img
                        width={330}
                        height={400}
                        loading="lazy"
                        className="mb-3"
                        src={imgSrc}
                        alt="image"
                      />
                    </Link>
                    <p className="fw-medium mb-0">
                      <Link href={`/product1_simple/${id}`}>{title}</Link>
                    </p>
                    <p className="mb-0">${price}</p>
                  </div>
                )}
                openOnClick
                id={id.toString()}
              />
            </React.Fragment>
          ))}
    </div>
  );
}
