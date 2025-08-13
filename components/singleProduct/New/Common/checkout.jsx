import { useContextElement } from "@/context/Context";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const Checkout = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState("100ml");
    const sizes = ["50ml", "100ml", "150ml"];
    const [quantity, setQuantity] = useState(1);
    const { cartProducts, setCartProducts } = useContextElement();
    const t = useTranslations();

    const addToCart = () => {
        if (!isIncludeCard()) {
            const item = {
                ...product,
                category_name: capitalizeEachWord(
                    product?.category.split("-").join(" ")
                ),
                subcategory_name: capitalizeEachWord(
                    product?.subcategory.split("-").join(" ")
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
    const isIncludeCard = () => {
        const item = cartProducts.filter(
            (elm) => elm.product_id == product.product_id
        )[0];
        return item;
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

    // console.log(product, "price")

    return (
        <div>
            {/* Price */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <p
                    className="fw-bolder text-dark mb-0"
                    style={{ fontSize: "1.5rem" }}
                >
                    {product?.price || "0.00"} د.إ
                </p>
            </div>

            {/* Size Selector */}
            <div className="w-100 mt-3">
                <div
                    className="d-flex justify-content-between border-bottom pb-1"
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    <label
                        htmlFor="size-select"
                        className="text-muted me-2 mb-0 h6"
                    >
                        Size:
                    </label>

                    <div
                        className="position-relative w-100"
                        style={{ maxWidth: "100px" }}
                    >
                        <div className="dropdown w-100">
                            <button
                                className="btn btn-sm dropdown-toggle w-100 text-start"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{
                                    backgroundColor: "rgba(250, 249, 247)", // glassy effect
                                    backdropFilter: "blur(6px)",
                                    // border: "1px solid #ccc",
                                    color: "#000",
                                    fontSize: "0.875rem",
                                    padding: "4px 8px",
                                }}
                            >
                                {selectedSize}
                            </button>

                            <ul
                                className="dropdown-menu w-100"
                                style={{
                                    fontSize: "0.875rem",
                                    minWidth: "100px",
                                }}
                            >
                                {sizes.map((size) => (
                                    <li key={size}>
                                        <button
                                            className="dropdown-item"
                                            type="button"
                                            onClick={() =>
                                                setSelectedSize(size)
                                            }
                                        >
                                            {size}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Add to Cart Button */}
            <button
                type="submit"
                onClick={() => addToCart()}
                id="product-detail-top"
                className={`btn w-100 mt-4 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2 
        ${product.product_qty > 0 ? "btn-dark" : "btn-dark text-white"}`}
                disabled={product.product_qty <= 0}
            >
                {product.product_qty > 0
                    ? isIncludeCard()
                        ? t("Already Added")
                        : t("Add to Cart")
                    : t("Out of Stock")}
            </button>
        </div>
    );
};

export default Checkout;
