import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useContextElement } from '@/context/Context';

const bogoProducts = [
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
  const { cartProducts, addProductToCart, removeGiftFromCart } = useContextElement();
  const [addedGifts, setAddedGifts] = useState([]);
  const prevCartRef = useRef([]);

  const eligibleProducts = cartProducts.filter(
    (item) =>
      item.discount === null &&
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

    const currentGifts = cartProducts.filter((p) => p.is_gift && p.campaign === 'bogo_2025_campaign');

    // Remove only outdated gifts
    currentGifts.forEach((gift) => {
      const matchingProduct = eligibleProducts.find(
        (p) => p.product_id === gift.product_id
      );

      if (!matchingProduct || matchingProduct.quantity !== gift.quantity) {
        console.log('Removing gift BOGO:', gift.product_id);
        removeGiftFromCart(gift.product_id, 'bogo_2025_campaign'); // Remove only that mismatched gift
      }
    });

    const giftsToAdd = [];

    eligibleProducts.forEach((product) => {
      const giftExists = currentGifts.find(
        (g) => g.product_id === product.product_id && g.quantity === product.quantity
      );

      if (!giftExists) {
        const bogoGift = bogoProducts.find((b) => b.product_id === product.product_id);
        if (bogoGift) {
          addProductToCart({ ...bogoGift, is_gift: true, price: "0", quantity: product.quantity });
          giftsToAdd.push({ product_id: bogoGift.product_id, quantity: product.quantity });
        }
      } else {
        giftsToAdd.push({ product_id: product.product_id, quantity: product.quantity });
      }
    });

    setAddedGifts(giftsToAdd);
  }, [cartProducts]);

  if (addedGifts.length === 0) return null;

  const giftsToDisplay = addedGifts
    .map((gift) => {
      const match = bogoProducts.find((b) => b.product_id === gift.product_id);
      return match ? { ...match, quantity: gift.quantity } : null;
    })
    .filter(Boolean);

  return (
    <div className="my-4 px-4">
      <h4 className="font-bold mb-4">
        <span
          className="t-subtitle"
          style={{
            color: '#000000',
            fontSize: '18px',
            lineHeight: '1.5rem',
            textAlign: 'center',
          }}
        >
          Your buy 1 get 1 free offer has been applied to the cart!
        </span>
      </h4>
    </div>
  );
};

export default BOGOFeature;
