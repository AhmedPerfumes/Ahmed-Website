"use client";
import { allProducts } from "@/data/products";
import React, { useEffect, useContext, useState } from "react";
import { useMenu } from "./MenuContext";
import { openCartDrawer } from "@/utlis/aside";

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
    const currentUTC = new Date();
    const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000);
    const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");
    const subtotal = cartProducts.reduce((accumulator, product) => {
      if (product?.discount) {
        if (
          new Date(current_date_time) >= new Date(product.discount.start_date) &&
          new Date(current_date_time) <= new Date(product.discount.end_date)
        ) {
          const discount_price = (
            product.price -
            (product.price / 100) * product.discount.value
          ).toFixed(2);
          return accumulator + product.quantity * discount_price;
        }
      } else if (product?.coupon && !Array.isArray(product.coupon) && couponDataContext != null) {
        if (
          new Date(current_date_time) >=
            new Date(product.coupon[couponDataContext?.code.toLowerCase()]?.start_date) &&
          new Date(current_date_time) <=
            new Date(product.coupon[couponDataContext?.code.toLowerCase()]?.end_date) &&
          product.coupon[couponDataContext?.code.toLowerCase()]?.code ==
            couponDataContext?.code.toLowerCase()
        ) {
          const coupon_price = (
            product.price -
            (product.price / 100) *
              product.coupon[couponDataContext?.code.toLowerCase()]?.value
          ).toFixed(2);
          return accumulator + product.quantity * coupon_price;
        }
      } else if (product?.sale_price) {
        const sale_price = product.sale_price.toFixed(2);
        return accumulator + product.quantity * sale_price;
      }
      return accumulator + product.quantity * product.price;
    }, 0);

    setTotalPrice(subtotal);
    const freeShippingThreshold = shippingServiceCharges?.[3]?.price ?? 100;
    setFreeShippingFlag(parseFloat(subtotal.toFixed(2)) >= freeShippingThreshold);
  }, [cartProducts, couponDataContext, shippingServiceCharges]);

  const addProductToQuickView = (product) => {
    setQuickViewItem(product);
  };

  // --- helper: build image url for toast ---
  const buildToastImageUrl = (product) => {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/?$/, "/");

    // 1) if product.image exists and is absolute, use it
    if (product?.image) {
      if (/^https?:\/\//i.test(product.image)) return product.image;
      // relative path
      return `${base}storage/${product.image.replace(/^\/+/, "")}`;
    }

    // 2) if product.images is an array, use first
    if (Array.isArray(product?.images) && product.images.length) {
      const first = product.images[0];
      if (/^https?:\/\//i.test(first)) return first;
      return `${base}storage/${String(first).replace(/^\/+/, "")}`;
    }

    // 3) if product.images is a JSON string, parse and use first
    if (typeof product?.images === "string" && product.images.trim()) {
      try {
        const arr = JSON.parse(product.images);
        if (Array.isArray(arr) && arr.length) {
          const first = arr[0];
          if (/^https?:\/\//i.test(first)) return first;
          return `${base}storage/${String(first).replace(/^\/+/, "")}`;
        }
      } catch {
        // ignore parse errors
      }
    }

    // 4) fallback
    return "/placeholder.png";
  };

  const addProductToCart = (product) => {
    setCartProducts((prevCart) => {
      const existingProduct = prevCart.find(
        (p) => p.product_id === product.product_id
      );
      if (existingProduct) {
        return prevCart.map((p) =>
          p.product_id === product.product_id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Show toast (with correct image)
    setToastData({
      name: product.product_name,
      image: buildToastImageUrl(product),
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
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

      {/* Toast Notification */}
      {toastData && (
        <div className={`custom-toast shadow-lg ${showToast ? "show" : "hide"}`}>
          <img src={toastData.image} alt={toastData.name} className="toast-img" />
          <div className="toast-content">
            <div className="toast-icon">✔</div>
            <div>
              <strong>‘{toastData.name}’</strong>
              <div>Successfully added to your basket</div>
            </div>
          </div>
          <button className="toast-close" onClick={() => setShowToast(false)}>✕</button>
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
        .toast-icon {
          background: #4caf50;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
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
