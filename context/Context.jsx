"use client";

import { allProducts } from "@/data/products";
import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { useMenu } from './MenuContext';
// import React, { useEffect, useContext, useState } from "react";
// import { useMenu } from "./MenuContext";
import { openCart } from "@/utlis/openCart";
// import { bogoProducts } from "@/components/BogoFeature";

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

  const [promotionsContext, setPromotionsContext] = useState([]);

  const { shippingServiceCharges } = useMenu();

  useEffect(() => {
  const initCart = async () => {
    let customerId = null;

    try {
      // Get user from localStorage (Base64 encoded)
      const encodedUser = localStorage.getItem("user");
      if (encodedUser) {
        const decoded = JSON.parse(atob(encodedUser)); // decode base64 → JSON
        customerId = decoded?.id;
      }
    } catch (err) {
      console.error("Error decoding user from localStorage", err);
    }

    if (customerId) {
      // Logged-in user → fetch cart from API
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/getCart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ customer_id: customerId }),
          }
        );

        const data = await res.json();
        console.log("Fetched cart data:", data); // debug

        if (Array.isArray(data)) {
          // Normalize values
          const normalized = data.map((p) => ({
            ...p,
            price: Number(p.price),
            quantity: Number(p.quantity || 1),
          }));

          // Update context state
          dispatch({ type: "SET_PRODUCTS", payload: normalized });

          // Persist to localStorage
          localStorage.setItem("cartList", JSON.stringify(normalized));
        } else {
          dispatch({ type: "SET_PRODUCTS", payload: [] });
        }
      } catch (error) {
        console.error("Error fetching cart from API:", error);
        dispatch({ type: "SET_PRODUCTS", payload: [] });
      }
    } else {
      // Guest user → fallback to localStorage
      try {
        const items = JSON.parse(localStorage.getItem("cartList"));
        if (Array.isArray(items)) {
          dispatch({ type: "SET_PRODUCTS", payload: items });
        } else {
          dispatch({ type: "SET_PRODUCTS", payload: [] });
        }
      } catch {
        dispatch({ type: "SET_PRODUCTS", payload: [] });
      }
    }
  };

  initCart();
}, []);


  useEffect(() => {
    // console.log('Saving cartProducts to localStorage:', state.products);
    localStorage.setItem("cartList", JSON.stringify(state.products));
  }, [state.products]);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (Array.isArray(items)) {
        setWishList(items);
      }
    } catch (error) {
      // console.error('Error parsing wishlist from localStorage:', error);
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
      // console.log('0000', couponDataContext, isCustomerCoupon, isCustomerCouponActive);
      // Skip free gifts entirely
      if (product?.is_gift) return accumulator;

      if (product?.discount) {
        console.log('discountC', product?.discount);
        let discounted = basePrice;
        if (
          new Date(current_date_time) >= new Date(product.discount.start_date) &&
          new Date(current_date_time) <= new Date(product.discount.end_date)
        ) {
          if (product.discount.discount_type === 'percent') {
              discounted = basePrice - (basePrice * Number(product.discount.value || 0)) / 100;
              // return accumulator + product.quantity * discount_price;
          } else if (product.discount.discount_type === 'amount') {
              discounted = Number(product.discount.final_price || 0);
              // return accumulator + product.quantity * discount_price;
          }
          return accumulator + qty * Number(discounted.toFixed(2));
        }
      }

      // if (
      //   product?.coupon &&
      //   !Array.isArray(product.coupon) &&
      //   codeLower &&
      //   product.coupon[codeLower]?.code?.toLowerCase() === codeLower
      // ) {
      //   console.log('couponC', product);
      //   const c = product.coupon[codeLower];
      //   const start = new Date(c?.start_date);
      //   const end = new Date(c?.end_date);
      //   if (c?.value != null && new Date(current_date_time) >= start && new Date(current_date_time) <= end) {
      //     const discounted = basePrice - (basePrice * Number(c.value)) / 100;
      //     return accumulator + qty * Number(discounted.toFixed(2));
      //   }
      // }

      // 3) Customer/global coupon (apply across all products)
      // if (isCustomerCouponActive && !product.sale_price && !product.discount && !promotionsContext.some((promo) => promo.buy_products.some((item) => item.product_id === product.product_id)))
      if (isCustomerCouponActive && !product.discount && !promotionsContext.some((promo) => promo.buy_products.some((item) => item.product_id === product.product_id)))
      {
        console.log('customer couponC', product, isCustomerCouponActive, couponDataContext);
        const value = Number(couponDataContext?.value || 0);
        let discounted = basePrice; // fallback if no discount

        if (couponDataContext.coupon_type === "percent") {
          discounted = basePrice - (basePrice * value) / 100;
        } else if (couponDataContext.coupon_type === "amount") {
          discounted = basePrice - value;
        }

        return accumulator + qty * Number(discounted.toFixed(2));
      }

      // 4) Sale price fallback
      // if (product?.sale_price != null) {
      //   console.log('product', 'sale price', product);
      //   return accumulator + qty * Number(Number(product.sale_price).toFixed(2));
      // }

      // 5) Default
      return accumulator + qty * basePrice;
    }, 0);

    setTotalPrice(subtotal);
    
    const freeShippingThreshold = shippingServiceCharges?.[3]?.price ?? 400;
    setFreeShippingFlag(Number(subtotal.toFixed(2)) >= freeShippingThreshold);
  }, [state.products, couponDataContext, shippingServiceCharges]);

  useEffect(() => {
  if (state.toastMeta) {
    setToastData(state.toastMeta);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  }
}, [state.toastMeta]);

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

  const triggerToast = ({ name = "", image = "/placeholder.png", message = "", type = "success" }) => {
    setToastData({ name, image, message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // const addProductToCart = (product) => {
  //   if (state.isProcessing) {
  //     // console.log('Skipping addProductToCart: processing in progress');
  //     return;
  //   }
  //   // console.log('addProductToCart:', product);
  //   const newProductCollection = product?.collection_name?.toLowerCase();
  //   const cartProducts = state.products;

  //   // Detect if cart already has a pre-book item
  //   const hasPreBook = cartProducts.some(
  //     (p) => p.collection_name?.toLowerCase() === 'pre book'
  //   );

  //   // Detect if cart already has ANY non–pre-book item
  //   const hasRegular = cartProducts.some(
  //     (p) => p.collection_name?.toLowerCase() !== 'pre book'
  //   );

  //   // --- RESTRICTION LOGIC ---
  //   if (newProductCollection === 'pre book' && hasRegular) {
  //     // Trying to add 'pre book' but cart has normal items
  //     // alert("You cannot mix Pre Book items with other products.");
  //     triggerToast({
  //       name: "Cart Restriction",
  //       message: "You cannot mix Pre Book items with other products.",
  //       image: "/assets/images/danger.png",
  //       type: "error",
  //       showButton: false
  //     });
  //     return;
  //   }

  //   if (newProductCollection !== 'pre book' && hasPreBook) {
  //     // Trying to add regular product but cart has pre-book items
  //     // alert("You cannot add other items with a Pre Book product.");
  //     triggerToast({
  //       name: "Cart Restriction",
  //       message: "You cannot add other items with a Pre Book product.",
  //       image: "/assets/images/danger.png",
  //       type: "error",
  //       showButton: false
  //     });
  //     return;
  //   }
  //   dispatch({ type: 'SET_PROCESSING', payload: true });
  //   dispatch({
  //     type: 'ADD_PRODUCT',
  //     payload: product,
  //     meta: {
  //       toast: {
  //         name: product?.product_name,
  //         image: buildToastImageUrl(product),
  //         message: "Added to your cart",
  //       },
  //     },
  //   });
  //   // document.getElementById("cartDrawerOverlay")?.classList.add("page-overlay_visible");
  //   // document.getElementById("cartDrawer")?.classList.add("aside_visible");
  // };

  const addProductToCart = (product) => {
    if (state.isProcessing) return;

    const newProductCollection = product?.collection_name?.toLowerCase();
    const cartProducts = [...state.products];

    // Detect if cart already has a pre-book item
    const hasPreBook = cartProducts.some(
      (p) => p.collection_name?.toLowerCase() === 'pre book'
    );

    // Detect if cart already has ANY non–pre-book item
    const hasRegular = cartProducts.some(
      (p) => p.collection_name?.toLowerCase() !== 'pre book'
    );

    // --- RESTRICTION LOGIC ---
    if (newProductCollection === 'pre book' && hasRegular) {
      triggerToast({
        name: "Cart Restriction",
        message: "You cannot mix Pre Book items with other products.",
        image: "/assets/images/danger.png",
        type: "error",
        showButton: false
      });
      return;
    }

    if (newProductCollection !== 'pre book' && hasPreBook) {
      triggerToast({
        name: "Cart Restriction",
        message: "You cannot add other items with a Pre Book product.",
        image: "/assets/images/danger.png",
        type: "error",
        showButton: false
      });
      return;
    }

    // --- DYNAMIC MAX QUANTITY LOGIC ---
    const MAX_LIMIT =
      product.maximum_order_quantity && product.maximum_order_quantity > 0
        ? product.maximum_order_quantity
        : product.product_qty; // fallback to stock

    const existingItemIndex = cartProducts.findIndex(
      (p) => p.product_id === product.product_id
    );


    if (existingItemIndex !== -1) {
      const currentQty = cartProducts[existingItemIndex].quantity || 1;

      if (currentQty >= MAX_LIMIT) {
        triggerToast({
          name: "Maximum Quantity Reached",
          message: `You cannot add more than ${MAX_LIMIT} of this product.`,
          image: "/assets/images/danger.png",
          type: "error",
          showButton: false
        });
        return;
      }

      // Increase quantity but do not exceed 6
      cartProducts[existingItemIndex].quantity = Math.min(currentQty + 1, MAX_LIMIT);
      dispatch({ type: 'UPDATE_CART', payload: cartProducts });
      return;
    }

    // New product, set initial quantity = 1
    product.quantity = 1;

    // Ensure first quantity does not exceed MAX_LIMIT (just in case stock = 0)
    if (product.quantity > MAX_LIMIT) {
      triggerToast({
        name: "Maximum Quantity Reached",
        message: `You cannot add more than ${MAX_LIMIT} of this product.`,
        image: "/assets/images/danger.png",
        type: "error",
        showButton: false
      });
      return;
    }

    dispatch({ type: 'SET_PROCESSING', payload: true });
    const updated = [...state.products];

    const existing = updated.find((p) => p.product_id === product.product_id);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + (product.quantity || 1);
    } else {
      updated.push({ ...product, quantity: product.quantity || 1 });
    }

    dispatch({
      type: 'SET_PRODUCTS',
      payload: updated,
      meta: {
        toast: {
          name: product?.product_name,
          image: buildToastImageUrl(product),
          message: "Added to your cart",
        },
      },
    });
  };

  const removeGiftFromCart = (productId = null, campaign = null) => {
    if (state.isProcessing) {
      // console.log('Skipping removeGiftFromCart: processing in progress', { productId, campaign });
      return;
    }
    // console.log('removeGiftFromCart:', { productId, campaign });
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'REMOVE_GIFT', payload: { productId, campaign } });
  };

 // REMOVE PRODUCT
const removeProduct = (productId) => {
  setCartProducts((prev) => prev.filter((p) => p.product_id !== productId));
};

  const setCartProducts = (productsOrFn) => {
    let newProducts = [];

    if (typeof productsOrFn === 'function') {
      // Functional update
      newProducts = productsOrFn(state.products);
    } else {
      // Direct array update
      newProducts = productsOrFn;
    }

    // Validate
    if (!Array.isArray(newProducts)) return;

    // --- RESTRICTION LOGIC ---
    const hasPreBook = newProducts.some(
      (p) => p?.collection_name?.toLowerCase() === 'pre book'
    );

    const hasRegular = newProducts.some(
      (p) => p?.collection_name?.toLowerCase() !== 'pre book'
    );

    // ❌ If mixing pre book + regular → reject update
    if (hasPreBook && hasRegular) {
      // alert(
      //   "You cannot mix Pre Book products with other items in the cart."
      // );
      triggerToast({
        name: "Cart Restriction",
        message: "You cannot mix Pre Book products with other items in the cart.",
        image: "/assets/images/danger.png",
        type: "error",
        showButton: false
      });
      return; // Don't update cart
    }

    // --- IF VALID, UPDATE ---
    dispatch({ type: 'SET_PRODUCTS', payload: newProducts });
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

  const hasPreBookItem = state.products.some(
    (p) => p.collection_name?.toLowerCase() === "pre book"
  );

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
    promotionsContext,
    setPromotionsContext,
    hasPreBookItem
  };

  return (
    <dataContext.Provider value={contextElement}>
      {children}

      {toastData && (
        <div
          className={`custom-toast shadow-lg ${toastData.type} ${showToast ? "show" : "hide"}`}
          onClick={openCart}
          style={{ cursor: "pointer" }}
        >
          <img src={toastData.image} alt={toastData.name} className="toast-img" />
          <div className="toast-content">
            <div>
              <strong>{toastData.name}</strong>
              <div>{toastData.message}</div>
              {!toastData.type && <button
                className="btn btn-sm btn-dark text-white mt-1"
                onClick={(e) => {
                  e.stopPropagation();
                  openCart();
                }}
              >
                View Cart
              </button>}
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
        .custom-toast.success {
          border-left: 6px solid #28a745;
        }
        .custom-toast.warning {
          border-left: 6px solid #ffc107;
          background: #fff8e5;
        }
        .custom-toast.error {
          border-left: 6px solid #dc3545;
          background: #ffe8e8;
        }
        .custom-toast.warning strong,
        .custom-toast.warning div {
          color: #b68400;
        }
        .custom-toast.error strong,
        .custom-toast.error div {
          color: #b30000;
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
