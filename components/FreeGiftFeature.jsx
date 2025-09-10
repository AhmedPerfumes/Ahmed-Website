import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContextElement } from '@/context/Context';
import he from 'he';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Campaign, Discount } from '@mui/icons-material';
import { useUser } from "@/context/UserContext";

const swiperOptions = {
  autoplay: false,
  slidesPerView: 6,
  slidesPerGroup: 4,
  effect: "none",
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
    },
    768: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
    992: {
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
  },
};

const FreeGiftFeature = ({ couponData }) => {
  const { cartProducts, totalPrice, addProductToCart, setCartProducts, promotionsContext, removeGiftFromCart } = useContextElement();
  const [selectedGift, setSelectedGift] = useState(null);
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn } = useUser();

  // Filter out "Collections" products
  const nonCollectionProducts = cartProducts.filter(
    (item) =>
    // item.category_name?.toLowerCase() !== "collections" &&
    // item.category_name?.toLowerCase() !== 'online exclusive' &&
    item.discount === null &&
    !item.is_gift &&
    // && item.coupon.length == 0
    !promotionsContext.some((promo) =>
      promo.buy_products.some((buyItem) => buyItem.product_id === item.product_id)
    )
  );

  const currentUTC = new Date();
  const currentGST = new Date(currentUTC.getTime() + (4 * 60 * 60 * 1000));
  const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");

  // Total price of non-Collections products
  const nonCollectionTotalPrice = nonCollectionProducts.reduce(
    (acc, item) => {
      console.log('hasCleaned', couponData?.code, new Date(current_date_time), new Date(item.coupon[couponData?.code.toLowerCase()]?.start_date));
      if(couponData?.code && new Date(current_date_time) >= new Date(item.coupon[couponData?.code.toLowerCase()]?.start_date) && new Date(current_date_time) <= new Date(item.coupon[couponData?.code.toLowerCase()]?.end_date) && item.coupon[couponData?.code.toLowerCase().toLowerCase()].code == couponData?.code.toLowerCase()) {
        return acc + (parseFloat(item.price - (item.price / 100 * item.coupon[couponData?.code.toLowerCase().toLowerCase()]?.value)) * item.quantity);
      } else if (
      isLoggedIn &&
      couponData &&
      couponData.type === "customer" &&
      (!couponData.start_date ||
        !couponData.end_date ||
        (new Date(current_date_time) >= new Date(couponData.start_date) &&
          new Date(current_date_time) <= new Date(couponData.end_date)))
      // &&
      // !elm.sale_price &&
      // !elm.discount &&
      // !promotionsContext.some((promo) =>
      //   promo.buy_products.some((item) => item.product_id === elm.product_id)
      // )
    ) {
      let itemPrice = item.price - (item.price / 100) * couponData.value;
        return acc + (parseFloat(itemPrice) * item.quantity);
    } else {
        return acc + (parseFloat(item.price) * item.quantity);
      }
    },
    0
  );

  // Active threshold based on non-Collection product price
  const activeThreshold = thresholds.find(
    (threshold) =>
      nonCollectionTotalPrice >= threshold.min &&
      (!threshold.max || nonCollectionTotalPrice <= threshold.max)
  );

  useEffect(() => {
    console.log("Mounted with:", {
      totalPrice,
      nonCollectionTotalPrice,
      cartProducts,
      nonCollectionProducts,
    });

    const fetchThresholds = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/freeGiftProducts`);
        if (!response.ok) throw new Error("Failed to fetch thresholds");

        const data = await response.json();
        setThresholds(data.thresholds);
      } catch (error) {
        console.error("Error fetching thresholds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThresholds();
  }, []);

  // Log active threshold
  useEffect(() => {
    console.log('Active threshold:', activeThreshold);
  }, [activeThreshold]);

  // Handle gift selection with error handling
  const handleGiftSelect = (product) => {
    try {
      console.log('Gift selected:', product.product_id, product.product_name);
      // Remove all existing gifts from cart to ensure only one gift
      cartProducts.forEach((item) => {
        if (item.is_gift) {
          removeGiftFromCart(null, item.campaign);
        }
      });
      addProductToCart({ ...product, quantity: 1, is_gift: true, campaign: product.campaign });
      setSelectedGift(product.product_id);
      console.log('Cart updated, selectedGift set to:', product.product_id);
      console.log('Updated cartProducts:', cartProducts);
    } catch (error) {
      console.error('Error in handleGiftSelect:', error);
    }
  };

  // Synchronize selectedGift with cartProducts and auto-add single gift
  useEffect(() => {
    if (!activeThreshold) {
      // No active threshold, remove any gift
      if (selectedGift) {
        console.log('No active threshold, removing gift and clearing selectedGift');
        cartProducts.forEach((item) => {
          if (item.is_gift) {
            removeGiftFromCart(null, item.campaign);
          }
        });
        setSelectedGift(null);
      }
    } else {
      // Determine the campaign for the threshold
      const thresholdCampaign = activeThreshold.gifts[0]?.campaign || '';
      // Check if there’s a gift in the cart for this threshold's campaign
      const giftInCart = cartProducts.find((item) => item.is_gift && item.campaign === thresholdCampaign);
      if (activeThreshold.gifts.length === 1) {
        // Single gift: auto-add if not already in cart
        const singleGift = activeThreshold.gifts[0];
        if (!giftInCart || giftInCart.product_id !== singleGift.product_id) {
          console.log('Auto-adding single gift:', singleGift.product_id);
          handleGiftSelect(singleGift);
        } else if (giftInCart.product_id !== selectedGift) {
          // Update selectedGift to match cart
          setSelectedGift(giftInCart.product_id);
        }
      } else if (giftInCart) {
        // Multiple gifts: ensure the gift in cart is valid for the current threshold
        const isValidGift = activeThreshold.gifts.some(
          (gift) => gift.product_id === giftInCart.product_id
        );
        if (!isValidGift) {
          console.log('Invalid gift for current threshold, removing gift');
          removeGiftFromCart(null, giftInCart.campaign);
          setSelectedGift(null);
        } else if (giftInCart.product_id !== selectedGift) {
          // Update selectedGift to match cart
          setSelectedGift(giftInCart.product_id);
        }
      } else if (selectedGift) {
        // No gift in cart but selectedGift exists, clear it
        console.log('No gift in cart, clearing selectedGift');
        setSelectedGift(null);
      }
    }
  }, [activeThreshold, cartProducts, selectedGift, removeGiftFromCart]);

  // Calculate next threshold message
  const getNextThresholdMessage = () => {
    if (activeThreshold) {
      return null;
    }
    const nextThreshold = thresholds.find(
      (threshold) => nonCollectionTotalPrice < threshold.min
    );
    if (nextThreshold) {
      return <span className='t-subtitle' style={{ color:'#198754',fontSize: '18px', lineHeight: '1.5rem',textAlign: 'center' }}>Spend AED {(nextThreshold.min - nonCollectionTotalPrice).toFixed(2)} more to unlock a free gift!</span>;
    }
  };

  // Hide Free Gift if all products are from Collections
  if (nonCollectionProducts.length === 0) return null;

  if (loading) return <></>;

  return (
    <div className="my-4 px-4">
      {activeThreshold ? (
        <div>
          {activeThreshold.gifts.length === 1 ? (
            // Render single gift card
            <h4 className="font-bold mb-4">
              <span className='t-subtitle' style={{ color:'#198754',fontSize: '18px', lineHeight: '1.5rem',textAlign: 'center' }}>
                {thresholds.length > 0 && activeThreshold.name} :- You've Earned a Free Gift!
              </span>
            </h4>
          ) : (
            // Render Swiper for multiple gifts
            <>
              <h4 className="font-bold mb-4">
                <span className='t-subtitle' style={{ color:'#198754',fontSize: '18px', lineHeight: '1.5rem',textAlign: 'center' }}>
                  {thresholds.length > 0 && activeThreshold.name} :- You've Earned a Free Gift – Choose 1 Perfume From Below!
                </span>
              </h4>
              <Swiper
                {...swiperOptions}
                className="swiper-container js-swiper-slider"
                data-settings=""
              >
                {activeThreshold.gifts.map((product, i) => (
                  <SwiperSlide key={i} className="swiper-slide product-card">
                    <div className="pc__img-wrapper">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}storage/${product.image}`}
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
                ))}
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
            </>
          )}
        </div>
      ) : (
        <p className="text-lg">{getNextThresholdMessage()}</p>
      )}
    </div>
  );
};

export default FreeGiftFeature;