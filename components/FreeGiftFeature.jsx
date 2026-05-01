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
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn } = useUser();

  // Filter products that count towards the threshold
  const nonCollectionProducts = cartProducts.filter(
    (item) =>
    !item.is_gift &&
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
      const actualPrice = item.sale_price || item.price;
      if(couponData?.code && new Date(current_date_time) >= new Date(item.coupon[couponData?.code.toLowerCase()]?.start_date) && new Date(current_date_time) <= new Date(item.coupon[couponData?.code.toLowerCase()]?.end_date) && item.coupon[couponData?.code.toLowerCase().toLowerCase()].code == couponData?.code.toLowerCase()) {
        return acc + (parseFloat(actualPrice - (actualPrice / 100 * item.coupon[couponData?.code.toLowerCase().toLowerCase()]?.value)) * item.quantity);
      } else if (
      isLoggedIn &&
      couponData &&
      couponData.type === "customer" &&
      (!couponData.start_date ||
        !couponData.end_date ||
        (new Date(current_date_time) >= new Date(couponData.start_date) &&
          new Date(current_date_time) <= new Date(couponData.end_date)))
    ) {
      let itemPrice = actualPrice - (actualPrice / 100) * couponData.value;
        return acc + (parseFloat(itemPrice) * item.quantity);
    } else {
        return acc + (parseFloat(actualPrice) * item.quantity);
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
    // console.log("Mounted with:", {
    //   totalPrice,
    //   nonCollectionTotalPrice,
    //   cartProducts,
    //   nonCollectionProducts,
    // });

    const fetchThresholds = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/freeGiftProducts`);
        if (!response.ok) throw new Error("Failed to fetch thresholds");

        const data = await response.json();
        setThresholds(data.thresholds);
      } catch (error) {
        // console.error("Error fetching thresholds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThresholds();
  }, []);

  // Log active threshold
  useEffect(() => {
    // console.log('Active threshold:', activeThreshold);
  }, [activeThreshold]);

  // Handle gift selection with toggle and swap behavior
  const handleGiftSelect = (product) => {
    try {
      const giftLimit = activeThreshold?.gift_limit || 1;
      const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');
      const isAlreadySelected = giftsInCart.some((item) => item.product_id === product.product_id);

      if (isAlreadySelected) {
        // If already selected, remove only this specific product
        removeGiftFromCart(product.product_id, product.campaign);
      } else {
        // If limit reached, remove the first (oldest) gift to make room for the new one (Swap)
        if (giftsInCart.length >= giftLimit) {
          const firstGift = giftsInCart[0];
          removeGiftFromCart(firstGift.product_id, firstGift.campaign);
        }
        
        // Add the new gift
        addProductToCart({ ...product, quantity: 1, is_gift: true, campaign: product.campaign, type: 'foc' });
      }
    } catch (error) {
      // console.error('Error in handleGiftSelect:', error);
    }
  };

  // Synchronize with cartProducts
  useEffect(() => {
    if (!activeThreshold) {
      // No active threshold, remove all gifts
      cartProducts.forEach((item) => {
        if (item.is_gift && item.type === 'foc') {
          removeGiftFromCart(item.product_id, item.campaign);
        }
      });
    } else {
      const giftLimit = activeThreshold.gift_limit || 1;
      const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');

      // Auto-add if there's only one product available and limit is 1
      if (activeThreshold.gifts.length === 1 && giftLimit === 1) {
        const singleGift = activeThreshold.gifts[0];
        const isAlreadyInCart = giftsInCart.some(item => item.product_id === singleGift.product_id);
        if (!isAlreadyInCart) {
          handleGiftSelect(singleGift);
        }
      }

      // Ensure all gifts in cart are valid for current threshold
      giftsInCart.forEach((gift) => {
        const isValid = activeThreshold.gifts.some(g => g.product_id === gift.product_id);
        if (!isValid) {
          removeGiftFromCart(gift.product_id, gift.campaign);
        }
      });
    }
  }, [activeThreshold, cartProducts, removeGiftFromCart]);

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

  const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');
  const giftLimit = activeThreshold?.gift_limit || 1;

  return (
    <div className="my-4 px-4">
      {activeThreshold ? (
        <div>
          {activeThreshold.gifts.length === 1 && giftLimit === 1 ? (
            // Render single gift card header
            <h4 className="font-bold mb-4">
              <span className='t-subtitle' style={{ color:'#198754',fontSize: '18px', lineHeight: '1.5rem',textAlign: 'center' }}>
                {activeThreshold.name} :- You've Earned a Free Gift!
              </span>
            </h4>
          ) : (
            // Render Swiper for multiple gifts
            <>
              <h4 className="font-bold mb-4">
                <span className='t-subtitle' style={{ color:'#198754',fontSize: '18px', lineHeight: '1.5rem',textAlign: 'center' }}>
                  {activeThreshold.name} :- You've Earned Free Gifts – 
                  Choose {giftLimit} {giftLimit > 1 ? 'Perfumes' : 'Perfume'} From Below! 
                  ({giftsInCart.length}/{giftLimit} Selected)
                </span>
              </h4>
              <Swiper
                {...swiperOptions}
                className="swiper-container js-swiper-slider"
                data-settings=""
              >
                {activeThreshold.gifts.map((product, i) => {
                  const isSelected = giftsInCart.some(item => item.product_id === product.product_id);

                  return (
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
                          onClick={() => handleGiftSelect(product)}
                          className={`pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside ${
                            isSelected
                              ? 'bg-success text-white'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                          aria-label={`Select ${he.decode(product.product_name)} as free gift`}
                        >
                          {isSelected ? 'Remove Gift' : 'Select Gift'}
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