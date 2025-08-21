"use client";
import { allProducts } from "@/data/products";
import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { useMenu } from './MenuContext';

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

  const { shippingServiceCharges } = useMenu();

  // console.log('shippingServiceCharges', shippingServiceCharges[3]?.price);

  useEffect(() => {
    const currentUTC = new Date(); // Current UTC time
    const currentGST = new Date(currentUTC.getTime() + (4 * 60 * 60 * 1000)); // Add 4 hours for GST
    const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");
    const subtotal = cartProducts.reduce((accumulator, product) => {
      if(product?.discount) {
        if(new Date(current_date_time) >= new Date(product.discount.start_date) && new Date(current_date_time) <= new Date(product.discount.end_date)) {
          if(product.discount.discount_type == 'percent') {
            const discount_price = (product.price - (product.price / 100 * product.discount.value)).toFixed(2);
            return accumulator + product.quantity * discount_price;
          } else if(product.discount.discount_type == 'amount') {
            const discount_price = (product.price - product.discount.value).toFixed(2);
            return accumulator + product.quantity * discount_price;
          }
          // const discount_price = (product.price - (product.price / 100 * product.discount.value)).toFixed(2);
          // return accumulator + product.quantity * discount_price;
        }
      } else if(product?.coupon && !Array.isArray(product.coupon) && couponDataContext != null) {
        if(new Date(current_date_time) >= new Date(product.coupon[couponDataContext?.code.toLowerCase()]?.start_date) && new Date(current_date_time) <= new Date(product.coupon[couponDataContext?.code.toLowerCase()]?.end_date) && product.coupon[couponDataContext?.code.toLowerCase()]?.code == couponDataContext?.code.toLowerCase()) {
          const coupon_price = (product.price - (product.price / 100 * product.coupon[couponDataContext?.code.toLowerCase()]?.value)).toFixed(2);
          return accumulator + product.quantity * coupon_price;
        }
      }
      // else if(product?.sale_price) {
      //   const sale_price = (product.sale_price).toFixed(2);
      //   return accumulator + product.quantity * sale_price;
      // }
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
    console.log('shippingServiceCharges', shippingServiceCharges[3]?.price, (subtotal).toFixed(2));
    const freeShippingThreshold = shippingServiceCharges?.[3]?.price ?? 100;
    setFreeShippingFlag(parseFloat(subtotal.toFixed(2)) >= freeShippingThreshold);
  }, [cartProducts, couponDataContext, shippingServiceCharges]);

  const addProductToQuickView = (product) => {
    setQuickViewItem(product);
  };

  const addProductToCart = (product) => {
    const item = {
      ...product,
      quantity: product.campaign == 'bogo_2025_campaign' ? product.quantity : 1,
    };
    setCartProducts((prevCart) => [...prevCart, item]);

    document
      .getElementById("cartDrawerOverlay")
      .classList.add("page-overlay_visible");
    document.getElementById("cartDrawer").classList.add("aside_visible");
  };
  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.product_id == id)[0]) {
      return true;
    }
    return false;
  };

  const toggleWishlist = (id) => {
    if (wishList.includes(id)) {
      setWishList((pre) => [...pre.filter((elm) => elm != id)]);
    } else {
      setWishList((pre) => [...pre, id]);
    }
  };
  const isAddedtoWishlist = (id) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const items = localStorage.getItem("cartList") && JSON.parse(localStorage.getItem("cartList"));
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

      // Remove a specific gift by ID (optional: still respect campaignKey)
      if (productIdToRemove) {
        return prev.filter(
          (item) => !(item.is_gift && item.product_id === productIdToRemove)
        );
      }

      // Default: remove all gifts
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
    </dataContext.Provider>
  );
}
