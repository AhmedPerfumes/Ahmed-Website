"use client";

import { allProducts } from "@/data/products";
import React, { useEffect, useContext, useState } from "react";
import { useMenu } from "./MenuContext";
import { openCart } from "@/utlis/openCart";
import { bogoProducts } from "@/components/BogoFeature";

const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [freeShippingFlag, setFreeShippingFlag] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [couponDataContext, setCouponDataContext] = useState(null);

  // Toast state
  const [toastData, setToastData] = useState(null); // {name, image}
  const [showToast, setShowToast] = useState(false);

  const { shippingServiceCharges } = useMenu();

  useEffect(() => {
  // const currentUTC = new Date();
  // const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000);
  // const now = currentGST;

  const currentUTC = new Date(); 
    const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000); 
    const current_date_time = currentGST
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

  const codeLower = couponDataContext?.code?.toLowerCase();
  const isCustomerCoupon =
    couponDataContext && couponDataContext.type === "customer";
  const isCustomerCouponActive =
    isCustomerCoupon &&
    (!couponDataContext.start_date ||
      !couponDataContext.end_date ||
      (new Date(current_date_time) >= new Date(couponDataContext.start_date) &&
        new Date(current_date_time) <= new Date(couponDataContext.end_date)));

  const subtotal = cartProducts.reduce((sum, product) => {
    // Ensure numbers
    const qty = Number(product?.quantity || 0);
    const basePrice = Number(product?.price || 0);

    // Skip free gifts entirely
    if (product?.is_gift) return sum;

    // 1) Product discount (campaign)
    if (product?.discount) {
      console.log('product', 'discount', product);
      const start = new Date(product.discount.start_date);
      const end = new Date(product.discount.end_date);
      if (new Date(current_date_time) >= start && new Date(current_date_time) <= end) {
        const discounted =
          basePrice - (basePrice * Number(product.discount.value || 0)) / 100;
        return sum + qty * Number(discounted.toFixed(2));
      }
    }

    // 2) Product-level coupon (mapped on product)
    if (
      product?.coupon &&
      !Array.isArray(product.coupon) &&
      codeLower &&
      product.coupon[codeLower]?.code?.toLowerCase() === codeLower
    ) {
      console.log('product', 'coupon', product);
      const c = product.coupon[codeLower];
      const start = new Date(c?.start_date);
      const end = new Date(c?.end_date);
      if (c?.value != null && new Date(current_date_time) >= start && new Date(current_date_time) <= end) {
        const discounted = basePrice - (basePrice * Number(c.value)) / 100;
        return sum + qty * Number(discounted.toFixed(2));
      }
    }

    // 3) Customer/global coupon (apply across all products)
    if (isCustomerCouponActive && !product.sale_price && !product.discount && !bogoProducts.some(bogo => bogo.product_id === product.product_id)) {
      console.log('product', 'customer coupon', product);
      const value = Number(couponDataContext?.value || 0);
      const discounted = basePrice - (basePrice * value) / 100;
      return sum + qty * Number(discounted.toFixed(2));
    }

    // 4) Sale price fallback
    if (product?.sale_price != null) {
      console.log('product', 'sale price', product);
      return sum + qty * Number(Number(product.sale_price).toFixed(2));
    }

    // 5) Default
    return sum + qty * basePrice;
  }, 0);

  setTotalPrice(subtotal);
  
  const freeShippingThreshold = shippingServiceCharges?.[3]?.price ?? 400;
  setFreeShippingFlag(Number(subtotal.toFixed(2)) >= freeShippingThreshold);
}, [cartProducts, couponDataContext, shippingServiceCharges]);

  const addProductToQuickView = (product) => {
    setQuickViewItem(product);
  };

  // helper to build toast image
  const buildToastImageUrl = (product) => {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/?$/, "/");

    if (product?.image) {
      if (/^https?:\/\//i.test(product.image)) return product.image;
      return `${base}storage/${product.image.replace(/^\/+/, "")}`;
    }

    if (Array.isArray(product?.images) && product.images.length) {
      const first = product.images[0];
      if (/^https?:\/\//i.test(first)) return first;
      return `${base}storage/${String(first).replace(/^\/+/, "")}`;
    }

    if (typeof product?.images === "string" && product.images.trim()) {
      try {
        const arr = JSON.parse(product.images);
        if (Array.isArray(arr) && arr.length) {
          const first = arr[0];
          if (/^https?:\/\//i.test(first)) return first;
          return `${base}storage/${String(first).replace(/^\/+/, "")}`;
        }
      } catch {}
    }

    return "/placeholder.png";
  };

  const addProductToCart = (product) => {
  setCartProducts((prevCart) => {
    const existingIndex = prevCart.findIndex(
      (item) => item.product_id === product.product_id
    );

    // If already in cart
    if (existingIndex !== -1) {
      if (product.campaign === "bogo_2025_campaign") {
        // BOGO already applied → no new add
        setToastData({
          name: product.product_name,
          image: buildToastImageUrl(product),
          message: "This BOGO deal is already in your cart!",
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        return prevCart;
      }

      // Normal product → increment qty
      const updatedCart = [...prevCart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + 1,
      };

      setToastData({
        name: product.product_name,
        image: buildToastImageUrl(product),
        message: "Quantity updated in your cart",
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);

      return updatedCart;
    }

    // New product
    const item = {
      ...product,
      quantity:
        product.campaign === "bogo_2025_campaign" ? product.quantity : 1,
    };

    let newCart = [...prevCart, item];

    // Add free gift(s) if BOGO
    if (product.campaign === "bogo_2025_campaign" && product.free_gift) {
      const giftItem = {
        ...product.free_gift,
        is_gift: true,
        campaign: product.campaign,
        quantity: 1,
      };
      newCart.push(giftItem);
    }

    setToastData({
      name: product.product_name,
      image: buildToastImageUrl(product),
      message:
        product.campaign === "bogo_2025_campaign"
          ? "BOGO deal added to your cart!"
          : "Added to your cart",
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    return newCart;
  });
};

  const isAddedToCartProducts = (id) => {
    return cartProducts.some((elm) => elm.product_id == id);
  };

  const toggleWishlist = (id) => {
    if (wishList.includes(id)) {
      setWishList((pre) => pre.filter((elm) => elm != id));
    } else {
      setWishList((pre) => [...pre, id]);
    }
  };

  const isAddedtoWishlist = (id) => {
    return wishList.includes(id);
  };

  useEffect(() => {
    const items =
      localStorage.getItem("cartList") &&
      JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const removeGiftFromCart = (productIdToRemove = null, campaignKey = null) => {
    setCartProducts((prev) => {
      if (!productIdToRemove && campaignKey) {
        return prev.filter(
          (item) => !(item.is_gift && item.campaign === campaignKey)
        );
      }
      if (productIdToRemove) {
        return prev.filter(
          (item) => !(item.is_gift && item.product_id === productIdToRemove)
        );
      }
      return prev.filter((item) => !item.is_gift);
    });
  };

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    toggleWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    addProductToQuickView,
    freeShippingFlag,
    setOrderDetails,
    orderDetails,
    couponDataContext,
    setCouponDataContext,
    removeGiftFromCart,
  };

  return (
    <dataContext.Provider value={contextElement}>
      {children}

      {/* Custom Toast */}
      {toastData && (
        <div
          className={`custom-toast shadow-lg ${showToast ? "show" : "hide"}`}
          onClick={openCart}
          style={{ cursor: "pointer" }}
        >
          <img src={toastData.image} alt={toastData.name} className="toast-img" />
          <div className="toast-content">
            <div>
              <strong>‘{toastData.name}’</strong>
              <div>Successfully added to your cart</div>
              <button
                className="btn btn-sm btn-dark text-white mt-1"
                onClick={(e) => {
                  e.stopPropagation();
                  openCart();
                }}
              >
                View Cart
              </button>
            </div>
          </div>
          <button
            className="toast-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowToast(false);
            }}
          >
            ✕
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          max-width: 350px;
          transition: all 0.3s ease;
          transform: translateY(100px);
          opacity: 0;
          z-index: 9999;
        }
        .custom-toast.show {
          transform: translateY(0);
          opacity: 1;
        }
        .toast-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        .toast-content {
          flex: 1;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .toast-close {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #666;
        }
        @media (max-width: 576px) {
          .custom-toast {
            right: 10px;
            left: 10px;
            max-width: unset;
          }
        }
      `}</style>
    </dataContext.Provider>
  );
}
