"use client";
import { allProducts } from "@/data/products";
import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { useMenu } from './MenuContext';

const dataContext = createContext();
export const useContextElement = () => useContext(dataContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      const existingProduct = state.products.find(
        (p) => p.product_id === action.payload.product_id && p.campaign === action.payload.campaign
      );
      if (existingProduct) {
        return {
          ...state,
          products: state.products.map((p) =>
            p.product_id === action.payload.product_id && p.campaign === action.payload.campaign
              ? { ...p, quantity: (p.quantity || 0) + (action.payload.quantity || 1) }
              : p
          ),
          isProcessing: false,
        };
      }
      return {
        ...state,
        products: [...state.products, { ...action.payload, quantity: action.payload.quantity || 1 }],
        isProcessing: false,
      };
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
    const subtotal = state.products.reduce((accumulator, product) => {
      if (product?.discount) {
        if (
          new Date(current_date_time) >= new Date(product.discount.start_date) &&
          new Date(current_date_time) <= new Date(product.discount.end_date)
        ) {
          if (product.discount.discount_type === 'percent') {
            const discount_price = (product.price - (product.price / 100 * product.discount.value)).toFixed(2);
            return accumulator + product.quantity * discount_price;
          } else if (product.discount.discount_type === 'amount') {
            const discount_price = (product.price - product.discount.value).toFixed(2);
            return accumulator + product.quantity * discount_price;
          }
        }
      } else if (product?.coupon && !Array.isArray(product.coupon) && couponDataContext) {
        if (
          new Date(current_date_time) >= new Date(product.coupon[couponDataContext?.code.toLowerCase()]?.start_date) &&
          new Date(current_date_time) <= new Date(product.coupon[couponDataContext?.code.toLowerCase()]?.end_date) &&
          product.coupon[couponDataContext?.code.toLowerCase()]?.code === couponDataContext?.code.toLowerCase()
        ) {
          const coupon_price = (product.price - (product.price / 100 * product.coupon[couponDataContext?.code.toLowerCase()]?.value)).toFixed(2);
          return accumulator + product.quantity * coupon_price;
        }
      }
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
    const freeShippingThreshold = shippingServiceCharges?.[3]?.price ?? 100;
    setFreeShippingFlag(parseFloat(subtotal.toFixed(2)) >= freeShippingThreshold);
  }, [state.products, couponDataContext, shippingServiceCharges]);

  const addProductToCart = (product) => {
    if (state.isProcessing) {
      console.log('Skipping addProductToCart: processing in progress');
      return;
    }
    console.log('addProductToCart:', product);
    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'ADD_PRODUCT', payload: product });
    document.getElementById("cartDrawerOverlay")?.classList.add("page-overlay_visible");
    document.getElementById("cartDrawer")?.classList.add("aside_visible");
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

  return <dataContext.Provider value={contextElement}>{children}</dataContext.Provider>;
}