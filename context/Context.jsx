"use client";

import { allProducts } from "@/data/products";
import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { useMenu } from './MenuContext';
// import React, { useEffect, useContext, useState } from "react";
// import { useMenu } from "./MenuContext";
import { openCart } from "@/utlis/openCart";
import { bogoProducts } from "@/components/BogoFeature";

const dataContext = createContext();
export const useContextElement = () => useContext(dataContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const existingProduct = state.products.find(
        (p) =>
          p.product_id === action.payload.product_id &&
          p.campaign === action.payload.campaign
      );

      let updatedProducts;

      if (existingProduct) {
        updatedProducts = state.products.map((p) =>
          p.product_id === action.payload.product_id &&
          p.campaign === action.payload.campaign
            ? { ...p, quantity: (p.quantity || 0) + (action.payload.quantity || 1) }
            : p
        );

        return {
          ...state,
          products: updatedProducts,
          isProcessing: false,
          toastMeta: action.meta?.toast || null,
        };
      }

      updatedProducts = [
        ...state.products,
        { ...action.payload, quantity: action.payload.quantity || 1 },
      ];

      return {
        ...state,
        products: updatedProducts,
        isProcessing: false,
        toastMeta: action.meta?.toast || null,
      };
    }
    case 'REMOVE_GIFT':
      return {
        ...state,
        products: state.products.filter(
          (p) =>
            !p.is_gift ||
            (action.payload.productId && p.product_id !== action.payload.productId) ||
            (action.payload.campaign && p.campaign !== action.payload.campaign)
        ),
        isProcessing: false,
      };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((p) => p.product_id !== action.payload.productId),
        isProcessing: false,
      };
    case 'SET_PRODUCTS':
      // Ensure payload is an array
      const newProducts = Array.isArray(action.payload) ? action.payload : [];
      return { ...state, products: newProducts, isProcessing: false };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    default:
      return state;
  }
};

export default function Context({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    products: [], // Ensure initial state is an array
    isProcessing: false,
  });
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
    try {
      const items = JSON.parse(localStorage.getItem("cartList"));
      if (Array.isArray(items)) {
        console.log('Loading cart from localStorage:', items);
        dispatch({ type: 'SET_PRODUCTS', payload: items });
      } else {
        console.log('No valid cart in localStorage, setting empty array');
        dispatch({ type: 'SET_PRODUCTS', payload: [] });
      }
    } catch (error) {
      console.error('Error parsing cartList from localStorage:', error);
      dispatch({ type: 'SET_PRODUCTS', payload: [] });
    }
  }, []);

  useEffect(() => {
    console.log('Saving cartProducts to localStorage:', state.products);
    localStorage.setItem("cartList", JSON.stringify(state.products));
  }, [state.products]);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (Array.isArray(items)) {
        setWishList(items);
      }
    } catch (error) {
      console.error('Error parsing wishlist from localStorage:', error);
      setWishList([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  useEffect(() => {
    const currentUTC = new Date();
    const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000);
    const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");
    const codeLower = couponDataContext?.code?.toLowerCase();
    const isCustomerCoupon = couponDataContext && couponDataContext.type === "customer";
    const isCustomerCouponActive = isCustomerCoupon && (!couponDataContext.start_date || !couponDataContext.end_date || (new Date(current_date_time) >= new Date(couponDataContext.start_date) && new Date(current_date_time) <= new Date(couponDataContext.end_date)));
    const subtotal = state.products.reduce((accumulator, product) => {
      // Ensure numbers
      const qty = Number(product?.quantity || 0);
      const basePrice = Number(product?.price || 0);

      // Skip free gifts entirely
      if (product?.is_gift) return accumulator;

      if (product?.discount) {
        if (
          new Date(current_date_time) >= new Date(product.discount.start_date) &&
          new Date(current_date_time) <= new Date(product.discount.end_date)
        ) {
          if (product.discount.discount_type === 'percent') {
              const discounted = basePrice - (basePrice * Number(product.discount.value || 0)) / 100;
              // return accumulator + product.quantity * discount_price;
          } else if (product.discount.discount_type === 'amount') {
              const discounted = (basePrice - Number(product.discount.value || 0));
              // return accumulator + product.quantity * discount_price;
          }
          return accumulator + qty * Number(discounted.toFixed(2));
        }
      }

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
  }, [state.products, couponDataContext, shippingServiceCharges]);

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
    if (state.isProcessing) {
      console.log('Skipping addProductToCart: processing in progress');
      return;
    }
    console.log('addProductToCart:', product);
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({
      type: 'ADD_PRODUCT',
      payload: product,
      meta: {
        toast: {
          name: product?.product_name,
          image: buildToastImageUrl(product),
          message: "Added to your cart",
        },
      },
    });
    // document.getElementById("cartDrawerOverlay")?.classList.add("page-overlay_visible");
    // document.getElementById("cartDrawer")?.classList.add("aside_visible");
  };

  const removeGiftFromCart = (productId = null, campaign = null) => {
    if (state.isProcessing) {
      console.log('Skipping removeGiftFromCart: processing in progress', { productId, campaign });
      return;
    }
    console.log('removeGiftFromCart:', { productId, campaign });
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'REMOVE_GIFT', payload: { productId, campaign } });
  };

  const removeProduct = (productId) => {
    if (state.isProcessing) {
      console.log('Skipping removeProduct: processing in progress', { productId });
      return;
    }
    console.log('removeProduct:', { productId });
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'REMOVE_PRODUCT', payload: { productId } });
  };

  const setCartProducts = (productsOrFn) => {
    console.log('setCartProducts called:', productsOrFn);
    if (typeof productsOrFn === 'function') {
      // Handle functional update
      const newProducts = productsOrFn(state.products);
      if (!Array.isArray(newProducts)) {
        console.error('setCartProducts: Functional update returned non-array', newProducts);
        return;
      }
      dispatch({ type: 'SET_PRODUCTS', payload: newProducts });
    } else {
      // Direct array update
      if (!Array.isArray(productsOrFn)) {
        console.error('setCartProducts: Invalid payload, must be an array', productsOrFn);
        return;
      }
      dispatch({ type: 'SET_PRODUCTS', payload: productsOrFn });
    }
  };

  const addProductToQuickView = (product) => {
    setQuickViewItem(product);
  };

  const isAddedToCartProducts = (id) => {
    return state.products.some((elm) => elm.product_id === id);
  };

  const toggleWishlist = (id) => {
    setWishList((prev) => prev.includes(id) ? prev.filter((elm) => elm !== id) : [...prev, id]);
  };

  const isAddedtoWishlist = (id) => {
    return wishList.includes(id);
  };

  const contextElement = {
    cartProducts: state.products,
    setCartProducts,
    totalPrice,
    addProductToCart,
    removeProduct, // New function for removing non-gift products
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

      {toastData && (
        <div
          className={`custom-toast shadow-lg ${showToast ? "show" : "hide"}`}
          onClick={openCart}
          style={{ cursor: "pointer" }}
        >
          <img src={toastData.image} alt={toastData.name} className="toast-img" />
          <div className="toast-content">
            <div>
              <strong>{toastData.name}</strong>
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
