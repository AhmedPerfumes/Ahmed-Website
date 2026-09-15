"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import he from "he";
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from "@/context/MenuContext";
import {
  removeSpecialCharactersAndAmp,
  sanitizeUrlParam,
  capitalizeEachWord,
} from "@/utils/shop";
import ProductCard, { ProductCardSkeleton } from "@/components/common/ProductCard";

export default function Style2({ category, subcategory, products: initialProducts, selectedColView = 3 }) {
  const { isLoading: isMenuLoading } = useMenu();
  const locale = useLocale();
  const t = useTranslations();
  const [products, setProducts] = useState(() => {
    const list = [...initialProducts];
    const indexToPin = 1;
    const newLaunchIndex = list.findIndex(p => p.collection_name === 'New Launch');
    if (newLaunchIndex > -1) {
      const [pinned] = list.splice(newLaunchIndex, 1);
      list.splice(indexToPin, 0, pinned);
    }
    return list;
  });

  useEffect(() => {
    const list = [...initialProducts];
    const indexToPin = 1;
    const newLaunchIndex = list.findIndex(p => p.collection_name === 'New Launch');
    if (newLaunchIndex > -1) {
      const [pinned] = list.splice(newLaunchIndex, 1);
      list.splice(indexToPin, 0, pinned);
    }
    setProducts(list);

    const fetchLiveStatus = async () => {
      try {
        const productIds = list.map((p) => p.product_id);
        if (productIds.length === 0) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/products/live-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_ids: productIds })
        });

        if (!response.ok) return;

        const liveData = await response.json();

        setProducts((prevProducts) => {
          return prevProducts.map((prevProd) => {
            const liveMatch = liveData.find((l) => l.product_id === prevProd.product_id);

            if (liveMatch) {
              return {
                ...prevProd,
                product_qty: liveMatch.product_qty,
                price: liveMatch.price,
                sale_price: liveMatch.sale_price,
                discount: liveMatch.discount,
                maximum_order_quantity: liveMatch.maximum_order_quantity
              };
            }
            return prevProd;
          });
        });
      } catch (error) {
        // console.error("Failed to hydrate live product data", error);
      }
    };

    fetchLiveStatus();
  }, [initialProducts]);

  const subcat = (() => {
    if (subcategory) return sanitizeUrlParam(subcategory);

    const categorySlug = removeSpecialCharactersAndAmp(category);
    const categoryMap = {
      "gift-sets": "gift-sets",
      "hair-mist": "hair-mist",
      "extrait-de-parfum": "extrait-de-parfum",
      "xtrait-de-parfum": "extrait-de-parfum"
    };

    return categoryMap[categorySlug] || "online-exclusive";
  })();

  if (isMenuLoading || products.length === 0) {
    return (
      <div className={`products-grid row row-cols-2 row-cols-md-${selectedColView === 2 ? 2 : 3} row-cols-lg-${selectedColView}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`products-grid row row-cols-2 row-cols-md-${selectedColView === 2 ? 2 : 3} row-cols-lg-${selectedColView}`}
      id="products-grid-2"
    >
      {products.map((elm, i) => {
        // Pinned featured card at index 1
        if (i === 1) {
          return (
            <div key={elm.product_id} className="product-card-wrapper">
              <div className="product-card mb-0 mb-md-4 mb-xxl-5 h-100 featured-card">
                <div className="pc__img-wrapper h-100">
                  <Link href={`/${locale}/shop/${removeSpecialCharactersAndAmp(category)}/${subcat}/${removeSpecialCharactersAndAmp(elm.permalink?.key)?.toLowerCase()}`}>
                    <Image
                      loading="lazy"
                      src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                      width={800}
                      height={1000}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      alt="featured product"
                    />
                  </Link>
                  <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                    <h2 className="fs-30 fw-normal text-uppercase mb-0 text-white cat-title">
                      {elm?.product_name && he.decode(elm?.product_name)}
                    </h2>
                    <p className="mb-4 text-white">{t("Exclusive Launch")}</p>
                    <Link
                      className="featured-explore-link"
                      href={`/${locale}/shop/${removeSpecialCharactersAndAmp(category)}/${subcat}/${removeSpecialCharactersAndAmp(elm.permalink?.key)?.toLowerCase()}`}
                    >
                      <span>{t("Explore")}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <ProductCard
            key={elm.product_id}
            product={elm}
            index={i}
            category={capitalizeEachWord(category.split('-').join(' '))}
            subcategory={capitalizeEachWord(subcat.split('-').join(' '))}
            cardClassName="product-card mb-0 mb-md-4 mb-xxl-5"
            showCategory={false}
          />
        );
      })}
    </div>
  );
}
