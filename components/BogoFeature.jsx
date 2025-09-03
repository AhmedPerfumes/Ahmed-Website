import React, { useState, useEffect, useRef } from "react";
import { useContextElement } from "@/context/Context";


export const bogoProducts = [
  { product_id: 208, product_name: 'Is It Me 90ML', price: "0", image: 'epdnew/is-it-me.jpg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign'},
  { product_id: 240, product_name: 'Red Jewel', price: "0", image: 'epdnew/red-jewel-1.jpg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign' },
  { product_id: 199, product_name: 'Royal Cherry', price: "0", image: 'epdnew/royal-cherry.jpg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign' },
  { product_id: 197, product_name: 'Royal Wood 100ML', price: "0", image: 'epdnew/royal-wood.jpg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign' },
  { product_id: 239, product_name: 'Coco Blend', price: "0", image: 'epdnew/coco-blend-1.jpg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign' },
  { product_id: 302, product_name: 'Tiff Tiff', price: "0", image: 'epdnew/tiff-tiff-1500x1500.jpg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign' },
  { product_id: 223, product_name: 'Mystique Pink', price: "0", image: 'epdnew/mystique-pink.jpg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign' },
  { product_id: 329, product_name: 'Ainaak', price: "0", image: 'epdnew/ainaak-bottle.jpg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign' },
  { product_id: 328, product_name: 'Jree', price: "0", image: 'epdnew/jree.jpeg', is_gift: true, discount: null, coupon: [], campaign: 'bogo_2025_campaign' },
];

const BOGOFeature = () => {
  const { cartProducts, setCartProducts, removeGiftFromCart } = useContextElement();
  const [addedGifts, setAddedGifts] = useState([]);
  const prevCartRef = useRef([]);

  const eligibleProducts = cartProducts.filter(
    (item) =>
      !item.is_gift &&
      bogoProducts.some((bogo) => bogo.product_id === item.product_id)
  );

  useEffect(() => {
    const prevCart = prevCartRef.current;

    const hasChanged = () => {
      if (prevCart.length !== eligibleProducts.length) return true;
      for (let i = 0; i < eligibleProducts.length; i++) {
        if (
          eligibleProducts[i].product_id !== prevCart[i]?.product_id ||
          eligibleProducts[i].quantity !== prevCart[i]?.quantity
        ) {
          return true;
        }
      }
      return false;
    };

    if (!hasChanged()) return;

    prevCartRef.current = eligibleProducts.map((p) => ({
      product_id: p.product_id,
      quantity: p.quantity,
    }));

    // Sync gifts with eligible products
    setCartProducts((prevCart) => {
      // Remove outdated BOGO gifts first
      let updated = prevCart.filter((item) => !(item.is_gift && item.campaign === "bogo_2025_campaign"));

      // Add/replace gifts based on eligibleProducts
      eligibleProducts.forEach((product) => {
        const bogoGift = bogoProducts.find((b) => b.product_id === product.product_id);
        if (bogoGift) {
          updated.push({
            ...bogoGift,
            quantity: product.quantity,
            is_gift: true,
          });
        }
      });

      return updated;
    });

    setAddedGifts(
      eligibleProducts.map((p) => ({
        product_id: p.product_id,
        quantity: p.quantity,
      }))
    );
  }, [cartProducts, setCartProducts, eligibleProducts]);

  if (addedGifts.length === 0) return null;

  return (
    <div className="my-4 px-4">
      <h4 className="font-bold mb-4">
        <span
          className="t-subtitle"
          style={{
            color: "#000000",
            fontSize: "18px",
            lineHeight: "1.5rem",
            textAlign: "center",
          }}
        >
          Your buy 1 get 1 free offer has been applied to the cart!
        </span>
      </h4>
    </div>
  );
};

export default BOGOFeature;
