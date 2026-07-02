"use client";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import he from 'he';
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from '../../context/MenuContext';
import VideoPanel from "../VideoPanel";
import { useUser } from "@/context/UserContext";
import FreeGiftFeature from "../FreeGiftFeature";
// import RamadanOffersModal from "../ramadan/RamadanOffersModal";

export default function CartDrawer() {
  const { isLoading: isMenuLoading, error: isMenuError, currency, shippingServiceCharges } = useMenu();
  const locale = useLocale();
  const [error, setError] = useState(null);
  const [ramadanModalOpen, setRamadanModalOpen] = useState(false);
  const { cartProducts, setCartProducts, totalPrice, promotionsContext, couponDataContext } = useContextElement();
  const { isLoggedIn } = useUser();
  const pathname = usePathname();
  const t = useTranslations();

  // Helpers to build product URLs (consistent with ProductGrid)
  const removeSpecialCharacters = (str) =>
    str?.replace(/&amp;/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim();

  const getSubcategorySlug = (category, subcategory, subcategory_name) => {
    if (subcategory && subcategory.subcategory_name) {
      return removeSpecialCharacters(subcategory.subcategory_name)
        ?.split(" ")
        .join("-")
        .toLowerCase();
    }
    if (subcategory_name) {
      return removeSpecialCharacters(subcategory_name)
        ?.split(" ")
        .join("-")
        .toLowerCase();
    }
    const cleanedCategory = removeSpecialCharacters(category)?.toLowerCase();
    if (cleanedCategory === "gift-sets") return "gift-sets";
    if (cleanedCategory === "hair-mist") return "hair-mist";
    if (cleanedCategory === "extrait-de-parfum") return "extrait-de-parfum";
    return "online-exclusive";
  };
  const closeCart = () => {
    document
      .getElementById("cartDrawerOverlay")
      .classList.remove("page-overlay_visible");
    document.getElementById("cartDrawer").classList.remove("aside_visible");
  };

  const setQuantity = (id, quantity, productQty, maxOrderQty) => {
    // Determine dynamic max allowed per product
    const MAX_LIMIT =
      maxOrderQty && maxOrderQty > 0
        ? maxOrderQty
        : productQty; // fallback to available stock

    // Check stock limit
    const withinStock = quantity >= 1 && quantity <= productQty;

    // Check max purchase limit
    const withinLimit = quantity <= MAX_LIMIT;

    if (withinStock && withinLimit) {
      setError(null);

      const items = [...cartProducts];

      // Update the paid product
      const paidItemIndex = items.findIndex(
        (item) => item.product_id == id && !item.is_gift
      );

      if (paidItemIndex !== -1) {
        items[paidItemIndex].quantity = quantity;
      }

      // Update the related gift item
      const giftItemIndex = items.findIndex(
        (item) =>
          item.product_id == id &&
          item.is_gift &&
          item.selection_rule != "least_expensive"
      );

      if (giftItemIndex !== -1) {
        items[giftItemIndex].quantity = quantity;
      }

      setCartProducts(items);
    } else {
      setError(
        !withinStock
          ? t("CartDrawer.MaxQuantityAvailable")
          : t("CartDrawer.MaxQuantityAllowed", { limit: MAX_LIMIT })
      );
    }
  };


  const removeItem = (id, uniqueKey = null) => {
  setCartProducts((prev) =>
    prev.filter((elm) =>
      uniqueKey
        ? elm.unique_key !== uniqueKey
        : elm.product_id !== id
    )
  );
};
  useEffect(() => {
    closeCart();
  }, [pathname]);

  // Calculate progress towards free shipping
  const freeShippingThreshold = shippingServiceCharges[3]?.price;
  const progressPercentage = Math.min(
    (totalPrice / freeShippingThreshold) * 100,
    100
  );

  const subTotalPrice = (elm) => {
    const currentUTC = new Date(); // Current UTC time
    const currentGST = new Date(currentUTC.getTime() + (4 * 60 * 60 * 1000)); // Add 4 hours for GST
    const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");
    if (elm?.discount) {
      if (new Date(current_date_time) >= new Date(elm.discount.start_date) && new Date(current_date_time) <= new Date(elm.discount.end_date)) {
        if (elm.discount.discount_type == "percent") {
          return <><span className="money price price-old">{currency.symbol}{elm?.price}</span><span className="cart-drawer-item__price money price price-sale">{((elm.price - (elm.price / 100 * elm.discount.value)) * elm.quantity).toFixed(2)}{currency.symbol}</span></>;
        } else if (elm.discount.discount_type == "amount") {
          return <><span className="money price price-old">{currency.symbol}{elm?.price}</span><span className="cart-drawer-item__price money price price-sale">{(elm.discount.final_price * elm.quantity).toFixed(2)}{currency.symbol}</span></>;
        }
      } else {
        return <span className="cart-drawer-item__price money price">{(elm.price * elm.quantity).toFixed(2)}{currency.symbol}</span>;
      }
    }
    let itemPrice = elm.price;
    if (isLoggedIn && couponDataContext && couponDataContext.code && couponDataContext.type === "customer") {
      const validCoupon = promotionsContext.some((promo) =>
        promo.buy_products.some((item) => item.product_id === elm.product_id)
      ) && (
          !couponDataContext.start_date ||
          !couponDataContext.end_date ||
          (new Date(current_date_time) >= new Date(couponDataContext.start_date) &&
            new Date(current_date_time) <= new Date(couponDataContext.end_date))
        );

      if (
        elm.is_coupon &&
        !validCoupon &&
        !elm.discount
      ) {
        itemPrice = elm.price - (elm.price / 100) * couponDataContext.value;
        return (
          <td>
            <span className="money price price-sale">
              {currency.symbol}
              {(itemPrice * elm.quantity).toFixed(2)}
            </span>
            <span className="money price price-old">
              {currency.symbol}
              {(elm.price * elm.quantity).toFixed(2)}
            </span>
          </td>
        );
      }
    }
    return <span className="cart-drawer-item__price money price">{(elm.price * elm.quantity).toFixed(2)}{currency.symbol}</span>;
  };

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    
      <div className={`aside ${locale === 'ar' ? 'aside_left' : 'aside_right'} overflow-hidden cart-drawer`} id="cartDrawer">
        <div className="aside-header d-flex align-items-center">
          <h3 className="text-uppercase fs-6 mb-0">
            {t("SHOPPING BAG")} (
            <span className="cart-amount js-cart-items-count">
              {cartProducts.length}
            </span>{" "}
            )
          </h3>
          <button
            onClick={closeCart}
            className={`btn-close-lg js-close-aside btn-close-aside ${locale === 'ar' ? 'me-auto' : 'ms-auto'}`}
          ></button>
        </div>
        <h6 style={{ color: "red" }}>{error && error}</h6>
        {cartProducts.length ? (
          <div className="aside-content cart-drawer-items-list">
            {cartProducts.map((elm, i) => (
              <React.Fragment key={i}>
                <div className="cart-drawer-item d-flex position-relative">
                  {(() => {
                    const categorySlug = removeSpecialCharacters(elm.category_name)
                      ?.split(" ")
                      .join("-")
                      .toLowerCase();
                    const subcategorySlug = getSubcategorySlug(
                      elm.category_name,
                      elm.subcategory,
                      elm.subcategory_name
                    );
                    const productSlug = removeSpecialCharacters(elm.product_name)
                      ?.split(" ")
                      .join("-")
                      .toLowerCase();
                    const href = `/${locale}/shop/${categorySlug}/${subcategorySlug}/${productSlug}`;
                    return (
                      <Link href={href} className="position-relative">
                        <Image
                          loading="lazy"
                          className="cart-drawer-item__img"
                          width={330}
                          height={400}
                          style={{ height: "fit-content" }}
                          src={
                            elm.is_gift_card
                              ? "/assets/images/gift-card.jpg"
                              : elm.image
                                ? `${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`
                                : `${process.env.NEXT_PUBLIC_API_URL}storage/${elm?.images && JSON.parse(elm.images)[0]}`
                          }
                          alt="image"
                          onClick={closeCart}
                        />
                      </Link>
                    );
                  })()}
                  <div className="cart-drawer-item__info flex-grow-1">
                    <h6 className="cart-drawer-item__title fw-normal">
                      {(() => {
                        const categorySlug = removeSpecialCharacters(elm.category_name)
                          ?.split(" ")
                          .join("-")
                          .toLowerCase();
                        const subcategorySlug = getSubcategorySlug(
                          elm.category_name,
                          elm.subcategory,
                          elm.subcategory_name
                        );
                        const productSlug = removeSpecialCharacters(elm.product_name)
                          ?.split(" ")
                          .join("-")
                          .toLowerCase();
                        const href = `/${locale}/shop/${categorySlug}/${subcategorySlug}/${productSlug}`;

                        return (
                          <>
                            <Link href={href} onClick={closeCart}>
                              {elm?.product_name && t(he.decode(elm.product_name))}
                            </Link>

                            {elm.is_gift_card && (
                              <span
                                style={{
                                  background: "#000",
                                  color: "#fff",
                                  fontSize: "10px",
                                  padding: "2px 6px",
                                  marginLeft: "6px",
                                  borderRadius: "3px",
                                }}
                              >
                                GIFT CARD
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </h6>
                    <div className="d-flex align-items-center justify-content-between mt-1">
                      {!elm.is_gift && !elm.is_gift_card ? <div className="qty-control position-relative">
                        <input
                          type="number"
                          name="quantity"
                          onChange={(e) =>
                            setQuantity(elm.product_id, e.target.value / 1, elm.product_qty, elm?.maximum_order_quantity)
                          }
                          value={elm.quantity}
                          min="1"
                          className="qty-control__number border-0 text-center"
                          readOnly
                        />
                        <div
                          onClick={() => {
                            setQuantity(elm.product_id, elm.quantity - 1, elm.product_qty, elm?.maximum_order_quantity);
                          }}
                          className="qty-control__reduce text-start"
                        >
                          -
                        </div>
                        <div
                          onClick={() => setQuantity(elm.product_id, elm.quantity + 1, elm.product_qty, elm?.maximum_order_quantity)}
                          className="qty-control__increase text-end"
                        >
                          +
                        </div>
                      </div> : elm.quantity}

                      {subTotalPrice(elm)}

                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(elm.product_id, elm.unique_key)}
                    className="btn-close-xs position-absolute top-0 end-0 js-cart-item-remove"
                  ></button>
                </div>
                <hr className="cart-drawer-divider" />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="fs-18 mt-5 px-5 cart-drawer-items-list">
            {t("Your cart is empty Start shopping")}
          </div>
        )}

        <div className="cart-drawer-actions position-absolute start-0 bottom-0 w-100">
          <div className="free-shipping-progress mt-2">
            {totalPrice < freeShippingThreshold ? (
              <div>
                <p>
                  {t("Spend")} {(freeShippingThreshold - totalPrice).toFixed(2)}{currency.symbol} {t("CartDrawer.MoreForFreeShipping")}
                </p>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            ) : (
              <p className="success mb-0">{t("CartDrawer.FreeShippingQualified")}</p>
            )}
          </div>
            <FreeGiftFeature/>

          {
            (() => {
              // Only count non-excluded products
              const regularProducts = cartProducts.filter((item) => item.category_name && !['gift sets', 'collections'].includes(item.category_name.toLowerCase()));
              const regularQuantity = regularProducts.reduce((total, item) => total + item.quantity, 0);
              const hasRegularProducts = regularProducts.length > 0;
              const hasBogoActive = cartProducts.some((item) => item.bogo_free_qty && item.bogo_free_qty > 0);
              
              return (hasBogoActive || regularQuantity > 3) && hasRegularProducts ? (
                <div style={{ backgroundColor: "#d4edda", border: "1px solid #28a745", borderRadius: "4px", padding: "12px 16px", marginTop: "12px", marginBottom: "12px", color: "#155724", fontSize: "14px", fontWeight: "500", textAlign: "center" }}>
                  ✓ <strong>Your Buy 3 Get 1 Offer has been applied!</strong>  
                </div>
              ) : regularQuantity <= 3 && hasRegularProducts ? (
                <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "4px", padding: "12px 16px", marginTop: "12px", marginBottom: "12px", color: "#856404", fontSize: "14px", fontWeight: "500", textAlign: "center" }}>
                  🎁 <strong>Great! You're one step away!</strong> Add more product to your cart to get 1 product FREE with our Buy 3 Get 1 Free offer!
                </div>
              ) : null;
            })()
          } 

          <hr className="cart-drawer-divider" />
          
          <div className="d-flex justify-content-between">
            <h6 className="fs-base fw-medium">{t("SUBTOTAL")}:</h6>
            <span className="cart-subtotal fw-medium">{totalPrice.toFixed(2)}{currency.symbol}</span>
          </div>

          {cartProducts.length ? (
            <>
              <Link href={`/${locale}/shop-cart`} className="btn btn-light mt-3 d-block">
                {t("View Cart")}
              </Link>
              <Link
                href={`/${locale}/shop-checkout`}
                className="btn btn-primary mt-3 d-block"
              >
                {t("Checkout")}
              </Link>
            </>
          ) : (
            <Link href={`/${locale}/shop`} className="btn btn-light mt-3 d-block">
              {t("Exploreshop")}
            </Link>
          )}
        </div>
      </div>
      <div
        id="cartDrawerOverlay"
        onClick={closeCart}
        className="page-overlay"
      ></div>
    </div>
  );
}
