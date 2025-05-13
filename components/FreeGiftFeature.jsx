import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContextElement } from '@/context/Context';
import he from 'he';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Discount } from '@mui/icons-material';

const swiperOptions = {
  autoplay: true,
  slidesPerView: 4,
  slidesPerGroup: 4,
  effect: "none",
  loop: true,
  modules: [Pagination, Navigation],
  pagination: {
    el: ".products-pagination",
    type: "bullets",
    clickable: true,
  },
  navigation: {
    nextEl: ".ssn11",
    prevEl: ".ssp11",
  },
  breakpoints: {
    320: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 14,
    },
    768: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 30,
    },
  },
};

// Sample gift products (replace with CMS or allProducts data)
const thresholds = [
  {
    min: 250,
    max: 500,
    gifts: [
      {
        product_id: 29,
        product_name: 'Free Mug',
        price: "0",
        image: '/images/mug.jpg',
        is_gift: true,
        discount: null
      },
      {
        product_id: 30,
        product_name: 'Free Bag',
        price: "0",
        image: '/images/tote.jpg',
        is_gift: true,
        discount: null
      },
    ],
  },
  {
    min: 500,
    gifts: [
      {
        product_id: 31,
        product_name: 'Free Headphones',
        price: "0",
        image: '/images/headphones.jpg',
        is_gift: true,
        discount: null
      },
      {
        product_id: 32,
        product_name: 'Free Card',
        price: "0",
        image: '/images/giftcard.jpg',
        is_gift: true,
        discount: null
      },
    ],
  },
];

const FreeGiftFeature = () => {
  const { cartProducts, totalPrice, addProductToCart, setCartProducts, removeGiftFromCart } = useContextElement();
  const [selectedGift, setSelectedGift] = useState(null);

  // Debug context and rendering
  useEffect(() => {
    console.log('FreeGiftFeature mounted', { totalPrice, cartProductsLength: cartProducts.length });
    console.log('Context methods:', { addProductToCart, removeGiftFromCart });
  }, []);

  // Find active threshold
  const activeThreshold = thresholds.find(
    (threshold) =>
      totalPrice >= threshold.min && (!threshold.max || totalPrice <= threshold.max)
  );

  // Log active threshold
  useEffect(() => {
    console.log('Active threshold:', activeThreshold);
  }, [activeThreshold]);

  // Handle gift selection with error handling
  const handleGiftSelect = (product) => {
    try {
      console.log('Gift selected:', product.product_id, product.product_name);
      removeGiftFromCart();
      addProductToCart({ ...product, quantity: 1 });
      setSelectedGift(product.product_id);
      console.log('Cart updated, selectedGift set to:', product.product_id);
      console.log('Updated cartProducts:', cartProducts);
    } catch (error) {
      console.error('Error in handleGiftSelect:', error);
    }
  };

  // Synchronize selectedGift with cartProducts
  useEffect(() => {
    console.log('Checking selectedGift:', selectedGift, 'Cart products:', cartProducts);
    if (!activeThreshold && selectedGift) {
      console.log('No active threshold, removing gift and clearing selectedGift');
      removeGiftFromCart();
      setSelectedGift(null);
    } else if (selectedGift) {
      // Check if the selected gift is still in the cart
      const giftInCart = cartProducts.find(
        (item) => item.is_gift && item.product_id === selectedGift
      );
      if (!giftInCart) {
        console.log('Selected gift not in cart, clearing selectedGift');
        setSelectedGift(null);
      } else if (activeThreshold) {
        // Verify the gift is valid for the current threshold
        const isValidGift = activeThreshold.gifts.some(
          (gift) => gift.product_id === selectedGift
        );
        if (!isValidGift) {
          console.log('Invalid gift for threshold, removing gift and clearing selectedGift');
          removeGiftFromCart();
          setSelectedGift(null);
        }
      }
    }
  }, [activeThreshold, cartProducts, selectedGift, removeGiftFromCart, totalPrice]);

  // Calculate next threshold message
  const getNextThresholdMessage = () => {
    if (activeThreshold) {
      return null;
    }
    const nextThreshold = thresholds.find((threshold) => totalPrice < threshold.min);
    if (nextThreshold) {
      return `Spend AED ${(nextThreshold.min - totalPrice).toFixed(2)} more to unlock a free gift!`;
    }
    return 'Add more items to unlock a free gift!';
  };

  return (
    <div className="my-8 px-4">
      {activeThreshold ? (
        <div>
          <h4 className="font-bold mb-4">
            Congratulations! Choose Your Free Gift
          </h4>
          <Swiper
            {...swiperOptions}
            className="swiper-container js-swiper-slider"
            data-settings=""
          >
            {activeThreshold.gifts.map((product, i) => {
              console.log('Rendering gift:', product.product_id, 'selectedGift:', selectedGift);
              return (
                <SwiperSlide key={i} className="swiper-slide product-card">
                  <div className="pc__img-wrapper">
                    <Image
                      src={product.image}
                      alt={he.decode(product.product_name)}
                      width="330"
                      height="400"
                      className="pc__img"
                      loading="lazy"
                    />
                    <button
                      onClick={() => {
                        console.log('Button clicked for:', product.product_id);
                        handleGiftSelect(product);
                      }}
                      className={`pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside ${
                        selectedGift === product.product_id
                          ? 'bg-blue-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      disabled={selectedGift === product.product_id}
                      aria-label={`Select ${he.decode(product.product_name)} as free gift`}
                      key={product.product_id}
                    >
                      {selectedGift === product.product_id ? 'Already Selected' : 'Select Gift'}
                    </button>
                  </div>
                  <div className="pc__info position-relative">
                    <h3 className="pc__title">{he.decode(product.product_name)}</h3>
                    <p className="pc__category">Free!</p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="products-carousel__prev ssp11 position-absolute">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 12H2M2 12L8 6M2 12L8 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="products-carousel__next ssn11 position-absolute">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 12H22M22 12L16 6M22 12L16 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="products-pagination mt-4 text-center js-products-pagination"></div>
        </div>
      ) : (
        <p className="text-lg">{getNextThresholdMessage()}</p>
      )}
    </div>
  );
};

export default FreeGiftFeature;