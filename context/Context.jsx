"use client";

import { allProducts } from "@/data/products";
import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { useMenu } from './MenuContext';
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { openCart } from "@/utlis/openCart";
import Image from "next/image";
import he from "he";
import { removeSpecialCharactersAndAmp } from "@/utils/shop";
// import { bogoProducts } from "@/components/BogoFeature";

const dataContext = createContext();
export const useContextElement = () => useContext(dataContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      // const existingProduct = state.products.find(
      //   (p) =>
      //     p.product_id === action.payload.product_id &&
      //     p.campaign === action.payload.campaign
      // );
      const existingProduct = state.products.find((p) => {
        // 🚨 DO NOT merge gift cards
        if (action.payload.is_gift_card) return false;

        return (
          p.product_id === action.payload.product_id &&
          p.campaign === action.payload.campaign
        );
      });

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
        products: state.products.filter((p) => {
          if (!p.is_gift) return true;
          // If no specific parameters passed, remove all gifts
          if (!action.payload?.productId && !action.payload?.campaign) return false;
          // If parameters passed, remove matching gift
          const matchId = action.payload.productId ? p.product_id === action.payload.productId : true;
          const matchCampaign = action.payload.campaign ? p.campaign === action.payload.campaign : true;
          return !(matchId && matchCampaign);
        }),
        isProcessing: false,
      };
    case 'REMOVE_PRODUCT':
  return {
    ...state,
    products: state.products.filter((p) =>
      p.unique_key
        ? p.unique_key !== action.payload.uniqueKey
        : p.product_id !== action.payload.productId
    ),
    isProcessing: false,
  };
    case 'SET_PRODUCTS':
    case 'UPDATE_CART':
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
  const t = useTranslations();
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
    try {
      const items = JSON.parse(localStorage.getItem("cartList"));
      if (Array.isArray(items)) {
        // console.log('Loading cart from localStorage:', items);
        dispatch({ type: 'SET_PRODUCTS', payload: items });
      } else {
        // console.log('No valid cart in localStorage, setting empty array');
        dispatch({ type: 'SET_PRODUCTS', payload: [] });
      }
    } catch (error) {
      // console.error('Error parsing cartList from localStorage:', error);
      dispatch({ type: 'SET_PRODUCTS', payload: [] });
    }
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
    const subtotal = state.products.reduce((accumuLator, product) => {
      // 🚨 NEVER apply discounts/coupons on gift cards
      if (product?.is_gift_card) {
        const qty = Number(product?.quantity || 0);
        const basePrice = Number(product?.price || 0);
        return accumuLator + qty * basePrice;
      }
      // Ensure numbers
      const qty = Number(product?.quantity || 0);
      const bogoFreeQty = Number(product?.bogo_free_qty || 0);
      const paidQty = Math.max(0, qty - bogoFreeQty); // BOGO free units don't get charged
      const basePrice = Number(product?.price || 0);
      // console.log('0000', couponDataContext, isCustomerCoupon, isCustomerCouponActive);
      // Skip free gifts entirely (FOC, etc.)
      if (product?.is_gift) return accumuLator;

      // If all units are free via BOGO, skip
      if (paidQty <= 0) return accumuLator;

      if (product?.discount) {
        console.log('discountC', product?.discount);
        let discounted = basePrice;
        if (
          new Date(current_date_time) >= new Date(product.discount.start_date) &&
          new Date(current_date_time) <= new Date(product.discount.end_date)
        ) {
          if (product.discount.discount_type === 'percent') {
              discounted = basePrice - (basePrice * Number(product.discount.value || 0)) / 100;
              // return accumuLator + product.quantity * discount_price;
          } else if (product.discount.discount_type === 'amount') {
              discounted = Number(product.discount.final_price || 0);
              // return accumuLator + product.quantity * discount_price;
          }
          return accumuLator + paidQty * Number(discounted.toFixed(2));
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
      //     return accumuLator + paidQty * Number(discounted.toFixed(2));
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

        return accumuLator + paidQty * Number(discounted.toFixed(2));
      }

      // 4) Sale price fallback
      // if (product?.sale_price != null) {
      //   console.log('product', 'sale price', product);
      //   return accumuLator + paidQty * Number(Number(product.sale_price).toFixed(2));
      // }

      // 5) Default
      return accumuLator + paidQty * basePrice;
    }, 0);

    setTotalPrice(subtotal);
    
    const freeShippingThreshold = shippingServiceCharges?.[3]?.price ?? 400;
    setFreeShippingFlag(Number(subtotal.toFixed(2)) >= freeShippingThreshold);
  }, [state.products, couponDataContext, shippingServiceCharges]);

  // useEffect(() => {
  // if (state.toastMeta) {
  //   setToastData(state.toastMeta);
  //   setShowToast(true);
  //   setTimeout(() => setShowToast(false), 4000);
  // }
  // }, [state.toastMeta]);

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
    toast.custom((toastObj) => (
      <div className={`custom-cart-toast ${toastObj.visible ? 'animate-enter' : 'animate-leave'} ${type}`}>
        <img src={image} alt={name} className="toast-image" />
        <div className="toast-details">
          <p className="toast-title">{name}</p>
          <p className="toast-msg">{message}</p>
        </div>
        <button className="close-toast" onClick={() => toast.dismiss(toastObj.id)}>×</button>
      </div>
    ), {
      duration: 3000,
      position: 'bottom-right',
    });
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

  const addProductToCart = (productOrId) => {
    if (state.isProcessing) return;

    let product = typeof productOrId === 'object' ? productOrId : allProducts.find(p => p.id === productOrId || p.product_id === productOrId);
    if (!product) return;

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
    const MAX_LIMIT = product.is_gift
      ? 999
      : (product.is_gift_card
          ? 10 // or any safe cap
          : (product.maximum_order_quantity && product.maximum_order_quantity > 0
              ? product.maximum_order_quantity
              : (product.product_qty ?? 999)));

    const existingItemIndex = cartProducts.findIndex((p) => {
      // 🚨 Gift cards should NEVER merge
      if (product.is_gift_card) return false;

      return p.product_id === product.product_id;
    });


    if (existingItemIndex !== -1 && !product.is_gift) {
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
    product.quantity =  product.quantity || 1;

    // Ensure first quantity does not exceed MAX_LIMIT (just in case stock = 0)
    if (!product.is_gift && product.quantity > MAX_LIMIT) {
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
    dispatch({
      type: 'ADD_PRODUCT',
      payload: product
    });

    // ---- GA4 add_to_cart (TikTok listener auto-maps to ttq AddToCart) ----
    // ---- Meta (Facebook) Pixel AddToCart (explicit — autoConfig is disabled) ----
    try {
      if (!product.is_gift) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "add_to_cart",
          ecommerce: {
            currency: "AED",
            value: parseFloat((product.price || 0) * (product.quantity || 1)),
            items: [{
              item_id: product.product_id?.toString(),
              item_name: product.product_name,
              price: parseFloat(product.price || 0),
              quantity: product.quantity || 1,
              item_category: product.category_name || "",
            }],
          },
        });

        // Explicit Meta Pixel AddToCart (needed because autoConfig is disabled)
        if (typeof window.fbq === "function") {
          window.fbq("track", "AddToCart", {
            content_ids: [product.product_id?.toString()],
            content_name: product.product_name,
            content_type: "product",
            value: parseFloat((product.price || 0) * (product.quantity || 1)),
            currency: "AED",
          });
        }
      }
    } catch (e) { /* tracking errors must never break cart */ }

    const imageUrl = buildToastImageUrl(product);

    toast.custom((toastObj) => (
      <div className={`custom-cart-toast ${toastObj.visible ? 'animate-enter' : 'animate-leave'}`}>
        <Image width={50} height={50} src={imageUrl} alt={removeSpecialCharactersAndAmp(product.product_name)} className="toast-image" />
        <div className="toast-details">
          <p className="toast-title">{removeSpecialCharactersAndAmp(product.product_name)}</p>
          <div className="toast-actions">
            <button 
              className="view-cart-btn" 
              onClick={() => {
                document.getElementById("cartDrawerOverlay")?.classList.add("page-overlay_visible");
                document.getElementById("cartDrawer")?.classList.add("aside_visible");
                toast.dismiss(toastObj.id);
              }}
            >
              {t("View Cart")}
            </button>
          </div>
        </div>
        <button className="close-toast" onClick={() => toast.dismiss(toastObj.id)}>×</button>
      </div>
    ), {
      duration: 3000,
      position: 'bottom-right',
    });
  };

  const removeGiftFromCart = (productId = null, campaign = null) => {
    // Only block specific gift removal if processing, allow full cleanup calls
    if (state.isProcessing && (productId || campaign)) {
      return;
    }
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'REMOVE_GIFT', payload: { productId, campaign } });
  };

  const removeProduct = (productId, uniqueKey = null) => {
  if (state.isProcessing) return;

  dispatch({ type: 'SET_PROCESSING', payload: true });

  dispatch({
    type: 'REMOVE_PRODUCT',
    payload: { productId, uniqueKey },
  });
};

  const setCartProducts = (productsOrFn) => {
    let newProducts = [];
    const oldProducts = [...state.products];

    if (typeof productsOrFn === 'function') {
      // Functional update
      newProducts = productsOrFn(oldProducts);
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
      triggerToast({
        name: "Cart Restriction",
        message: "You cannot mix Pre Book products with other items in the cart.",
        image: "/assets/images/danger.png",
        type: "error"
      });
      return; // Don't update cart
    }

    // --- DETECT NEW ITEM FOR TOAST ---
    if (newProducts.length === oldProducts.length + 1) {
      const addedItem = newProducts[newProducts.length - 1];
      if (addedItem && !addedItem.is_gift) {
        const imageUrl = buildToastImageUrl(addedItem);
        const productName = addedItem.product_name || addedItem.title || "Product";

        toast.custom((toastObj) => (
          <div className={`custom-cart-toast ${toastObj.visible ? 'animate-enter' : 'animate-leave'}`}>
            <img src={imageUrl} alt={productName} className="toast-image" />
            <div className="toast-details">
              <p className="toast-title">{productName}</p>
              <div className="toast-actions">
                <button 
                  className="view-cart-btn" 
                  onClick={() => {
                    document.getElementById("cartDrawerOverlay")?.classList.add("page-overlay_visible");
                    document.getElementById("cartDrawer")?.classList.add("aside_visible");
                    toast.dismiss(toastObj.id);
                  }}
                >
                  {t("View Cart")}
                </button>
              </div>
            </div>
            <button className="close-toast" onClick={() => toast.dismiss(toastObj.id)}>×</button>
          </div>
        ), {
          duration: 3000,
          position: 'bottom-right',
        });
      }
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
    hasPreBookItem,
    triggerToast,
  };

  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
