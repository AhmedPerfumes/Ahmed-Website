import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useContextElement } from '@/context/Context';
import he from 'he';

// Sample BOGO products (replace with CMS or allProducts data)
const bogoProducts = [
  {
    product_id: 46,
    product_name: 'Leather',
    price: "0",
    image: 'epdnew/leather.jpg',
    is_gift: true,
    discount: null,
    coupon: []
  },
  {
    product_id: 55,
    product_name: 'Oud Classic',
    price: "0",
    image: 'epdnew/oud-classic.jpg',
    is_gift: true,
    discount: null,
    coupon: []
  },
  {
    product_id: 50,
    product_name: 'Musk Ahmed',
    price: "0",
    image: 'epdnew/musk-ahmed.jpg',
    is_gift: true,
    discount: null,
    coupon: []
  },
  {
    product_id: 63,
    product_name: 'Saif',
    price: "0",
    image: 'epdnew/saif.jpg',
    is_gift: true,
    discount: null,
    coupon: []
  },
  {
    product_id: 35,
    product_name: 'Zuraique',
    price: "0",
    image: 'epdnew/zuraique.jpg',
    is_gift: true,
    discount: null,
    coupon: []
  },
  {
    product_id: 192,
    product_name: 'Sage',
    price: "0",
    image: 'epdnew/sage-1.jpg',
    is_gift: true,
    discount: null,
    coupon: []
  },
  {
    product_id: 248,
    product_name: 'Tanuf',
    price: "0",
    image: 'epdnew/tanuf-1.jpg',
    is_gift: true,
    discount: null,
    coupon: []
  },
  {
    product_id: 66,
    product_name: 'Sheukh',
    price: "0",
    image: 'epdnew/sheukh.jpg',
    is_gift: true,
    discount: null,
    coupon: []
  },
];

const BOGOFeature = ({ couponData }) => {
  const { cartProducts, addProductToCart, removeGiftFromCart } = useContextElement();
  const [addedGifts, setAddedGifts] = useState([]);
  const isUpdatingRef = useRef(false);

  // Filter eligible products (non-collection, non-gift, in bogoProducts list)
  const eligibleProducts = cartProducts.filter(
    (item) =>
      item.category_name?.toLowerCase() !== "collections" &&
      item.discount === null &&
      !item.is_gift &&
      bogoProducts.some((bogo) => bogo.product_id === item.product_id)
  );

  // Create a stable dependency for useEffect
  const cartState = JSON.stringify(
    eligibleProducts.map((p) => ({ id: p.product_id, qty: p.quantity }))
  );

  // Manage BOGO gifts
  useEffect(() => {
    if (isUpdatingRef.current) {
      console.log('Skipping useEffect due to ongoing update');
      return;
    }

    isUpdatingRef.current = true;

    console.log('BOGOFeature useEffect triggered', {
      eligibleProducts: eligibleProducts.map((p) => ({
        id: p.product_id,
        name: p.product_name,
        qty: p.quantity,
      })),
      cartProducts: cartProducts.map((p) => ({
        id: p.product_id,
        name: p.product_name,
        qty: p.quantity,
        is_gift: p.is_gift,
      })),
    });

    // Get current gifts in cart
    const currentGiftsInCart = cartProducts
      .filter((item) => item.is_gift)
      .map((item) => ({ product_id: item.product_id, quantity: item.quantity }));

    // Determine desired gifts (same quantity as purchased product)
    const desiredGifts = eligibleProducts.map((product) => ({
      product_id: product.product_id,
      quantity: product.quantity,
    }));

    // Remove outdated gifts
    const giftsToRemove = currentGiftsInCart.filter(
      (gift) =>
        !desiredGifts.some(
          (desired) => desired.product_id === gift.product_id && desired.quantity === gift.quantity
        )
    );

    if (giftsToRemove.length > 0) {
      console.log('Removing outdated gifts:', giftsToRemove);
      removeGiftFromCart();
    }

    // Add or update BOGO gifts
    const newAddedGifts = [];
    eligibleProducts.forEach((product) => {
      const matchingBogo = bogoProducts.find((bogo) => bogo.product_id === product.product_id);
      if (matchingBogo) {
        const existingGift = currentGiftsInCart.find(
          (gift) => gift.product_id === matchingBogo.product_id && gift.quantity === product.quantity
        );
        if (!existingGift) {
          console.log(
            `Adding BOGO gift: ${matchingBogo.product_name} (ID: ${matchingBogo.product_id}, Quantity: ${product.quantity})`
          );
          addProductToCart({ ...matchingBogo, quantity: product.quantity });
        }
        newAddedGifts.push({ product_id: matchingBogo.product_id, quantity: product.quantity });
      }
    });

    // Update addedGifts state only if different
    if (JSON.stringify(newAddedGifts) !== JSON.stringify(addedGifts)) {
      console.log('Updating addedGifts:', newAddedGifts);
      setAddedGifts(newAddedGifts);
    }

    isUpdatingRef.current = false;
  }, [cartState, addProductToCart, removeGiftFromCart]);

  // Hide BOGO if no eligible products
  if (eligibleProducts.length === 0) {
    console.log('No eligible products, hiding BOGO');
    return null;
  }

  // Get gifts to display
  const giftsToDisplay = addedGifts
    .map((gift) => ({
      ...bogoProducts.find((bogo) => bogo.product_id === gift.product_id),
      quantity: gift.quantity,
    }))
    .filter((gift) => gift !== undefined);

  console.log('Gifts to display:', giftsToDisplay);

  return (
    <div className="my-4 px-4">
      <h4 className="font-bold mb-4">
        <span className="t-subtitle" style={{ color: '#c00000', fontSize: '18px', lineHeight: '1.5rem', textAlign: 'center' }}>
          BOGO Offer – Free Perfumes Added to Your Cart!
        </span>
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* {giftsToDisplay.map((product, i) => (
          <div key={i} className="product-card">
            <div className="pc__img-wrapper">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${product.image}`}
                alt={he.decode(product.product_name)}
                width={330}
                height={400}
                className="pc__img"
                loading="lazy"
              />
              <div
                className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium bg-green-500 text-white"
                aria-label={`${he.decode(product.product_name)} added as BOGO gift`}
              >
                Added to Cart (x{product.quantity})
              </div>
            </div>
            <div className="pc__info position-relative">
              <h3 className="pc__title">{he.decode(product.product_name)}</h3>
              <p className="pc__category">Free!</p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default BOGOFeature;