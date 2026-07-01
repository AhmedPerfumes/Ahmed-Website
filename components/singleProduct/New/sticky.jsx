"use client";

import { ShoppingCart, Check } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useContextElement } from "@/context/Context";
import { useTranslations, useLocale } from "next-intl";
import "./Sticky.css";
import { useMenu } from "@/context/MenuContext";
import Image from "next/image";
import { renderPrice } from "@/utlis/priceRenderer";
import { toast } from "react-toastify";
import he from "he";

const Sticky = ({ image, product }) => {
    const [show, setShow] = useState(false);
    const { cartProducts, setCartProducts } = useContextElement();
    const t = useTranslations("ProductDetails");
    const locale = useLocale();
    const { currency } = useMenu();
    const [quantity, setQuantity] = useState(1);

    let category = product?.category;
    let subcategory = product?.subcategory;

    // Clean product name: decode HTML entities & respect locale
    const productName = useMemo(() => {
        const raw =
            locale === "ar"
                ? product?.product_name_ar
                : product?.product_name;
        return raw ? he.decode(raw) : "";
    }, [product?.product_name, product?.product_name_ar, locale]);

    const isOutOfStock = product?.product_qty <= 0;

    const isIncludeCard = () => {
        if (!product?.product_id) return false;
        return cartProducts.some(
            (elm) => elm.product_id == product.product_id
        );
    };

    function capitalizeEachWord(str) {
        if (!str) return "";
        return str
            .split(" ")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
    }

    const addToCart = () => {
        if (!isIncludeCard()) {
            const item = {
                ...product,
                product_name: productName,
                category_name: capitalizeEachWord(
                    category?.split("-").join(" ") || ""
                ),
                subcategory_name: capitalizeEachWord(
                    subcategory?.split("-").join(" ") || ""
                ),
            };
            item.quantity = quantity;
            setCartProducts((pre) => [...pre, item]);
            toast.success("Added to Cart", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    // Show the sticky bar once the user scrolls past the main product section
    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined")
            return;
        const target = document.getElementById("product-detail-top");
        if (!target) return;
        const observer = new IntersectionObserver(
            ([entry]) => setShow(!entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    if (!show || !product) return null;

    // Derive button state
    const alreadyAdded = isIncludeCard();
    const disabled = alreadyAdded || isOutOfStock;

    const btnClass = [
        "sticky-bar__cta",
        isOutOfStock && "sticky-bar__cta--oos",
        alreadyAdded && !isOutOfStock && "sticky-bar__cta--added",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="sticky-bar">
            {/* Thumbnail */}
            <Image
                width={100}
                height={100}
                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image}`}
                alt={productName}
                className="sticky-bar__thumb"
            />

            {/* Name + Price */}
            <div className="sticky-bar__info">
                <p className="sticky-bar__name" title={productName}>
                    {productName}
                </p>
                <p className="sticky-bar__price">
                    {renderPrice(product, currency)}
                </p>
            </div>

            {/* CTA */}
            <button
                id="product-detail-sticky-btn"
                type="button"
                className={btnClass}
                aria-label={t("addToCartLabel", { name: productName })}
                disabled={disabled}
                onClick={() => !disabled && addToCart()}
            >
                {isOutOfStock ? (
                    t("outOfStock")
                ) : alreadyAdded ? (
                    <>
                        <Check size={15} />
                        {t("alreadyAdded")}
                    </>
                ) : (
                    <>
                        <ShoppingCart size={15} />
                        {t("addToCart")}
                    </>
                )}
            </button>
        </div>
    );
};

export default Sticky;