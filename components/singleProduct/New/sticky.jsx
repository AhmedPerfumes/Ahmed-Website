"use client";

import { ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context"; // ✅ hook from your reference
import { useTranslations } from "next-intl";
import "./Sticky.css";
import { useMenu } from "@/context/MenuContext";
import Image from "next/image";

const Sticky = ({ image, name, price, product }) => {
    const [show, setShow] = useState(false);
    const { cartProducts, setCartProducts } = useContextElement();
    const t = useTranslations();
    let category = product?.category;
    let subcategory = product?.subcategory;
    const [quantity, setQuantity] = useState(1);
    const {
        isLoading: isMenuLoading,
        error: isMenuError,
        currency,
    } = useMenu();

    // check if already in cart
    const isIncludeCard = () => {
        const item = cartProducts.filter(
            (elm) => elm.product_id == product.product_id
        )[0];
        return item;
    };

    // add product
    const addToCart = () => {
        if (!isIncludeCard()) {
            const item = {
                ...product,
                category_name: capitalizeEachWord(
                    category.split("-").join(" ")
                ),
                subcategory_name: capitalizeEachWord(
                    subcategory.split("-").join(" ")
                ),
            };
            item.quantity = quantity;
            setCartProducts((pre) => [...pre, item]);
            document
                .getElementById("cartDrawerOverlay")
                .classList.add("page-overlay_visible");
            document
                .getElementById("cartDrawer")
                .classList.add("aside_visible");
        }
    };
    function capitalizeEachWord(str) {
        return str
            .split(" ") // Split the sentence into words
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ) // Capitalize first letter of each word
            .join(" "); // Join the words back into a sentence
    }

    // intersection observer for stickiness
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

    if (!show) return null;

    return (
        <div className="sticky-container d-flex align-items-center position-fixed start-50 translate-middle-x shadow rounded-pill border bg-white">
            <Image
                width={100}
                height={100}
                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image}`}
                alt={`Thumbnail for ${product.name}`}
                className="rounded-circle border img"
            />

            <div className="flex-grow-1 text-truncate">
                <p className="mb-0 fw-medium" title={name}>
                    {name}
                </p>
                <p className="mb-0 fw-bold">
                    {price} {currency.symbol}
                </p>
            </div>

            <button
                id="product-detail-top"
                type="button"
                className="btn btn-dark d-flex align-items-center gap-2 rounded-pill fw-semibold"
                aria-label={`Add ${product.name} to cart`}
                disabled={!!isIncludeCard()}
                onClick={() => !isIncludeCard() && addToCart()}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#27272a")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#000")
                }
            >
                <ShoppingCart size={18} />
                {isIncludeCard() ? t("Already Added") : t("Add to Cart")}
            </button>
        </div>
    );
};

export default Sticky;
