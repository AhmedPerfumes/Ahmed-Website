import React, { useState, useEffect, useCallback, useRef } from 'react';
import './FreeGiftFeature.css';
import Image from 'next/image';
import { useContextElement } from '@/context/Context';
import he from 'he';
import { useUser } from "@/context/UserContext";

const FreeGiftFeature = ({ couponData }) => {
  const { cartProducts, totalPrice, addProductToCart, setCartProducts, promotionsContext, removeGiftFromCart } = useContextElement();
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoggedIn } = useUser();

  // Filter products that count towards the threshold (exclude gifts, buy_x_get_y products, and discounted products)
  const nonCollectionProducts = cartProducts.filter(
    (item) =>
      !item.is_gift &&
      !item.discount &&
      !item.sale_price &&
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
      if (couponData?.code && new Date(current_date_time) >= new Date(item.coupon[couponData?.code.toLowerCase()]?.start_date) && new Date(current_date_time) <= new Date(item.coupon[couponData?.code.toLowerCase()]?.end_date) && item.coupon[couponData?.code.toLowerCase().toLowerCase()].code == couponData?.code.toLowerCase()) {
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
      nonCollectionTotalPrice >= parseFloat(threshold.min) &&
      (!threshold.max || nonCollectionTotalPrice <= parseFloat(threshold.max))
  );

  // fetchThresholds: isInitial=true only on mount, so re-fetches on modal open don't flash loading=true
  const fetchThresholds = useCallback(async (isInitial = false) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/freeGiftProducts`);
      if (!response.ok) throw new Error("Failed to fetch thresholds");
      const data = await response.json();
      setThresholds(data.thresholds || []);
    } catch (error) {
      // console.error("Error fetching thresholds:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchThresholds(true);
  }, [fetchThresholds]);

  // Re-fetch silently when modal opens (no loading flash) so newly added admin promotions work without page refresh
  useEffect(() => {
    if (isModalOpen) {
      fetchThresholds(false);
    }
  }, [isModalOpen, fetchThresholds]);

  // Handle gift selection with toggle and swap behavior
  const handleGiftSelect = (product) => {
    try {
      const giftLimit = activeThreshold?.gift_limit || 1;
      const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');
      const isAlreadySelected = giftsInCart.some((item) => item.product_id === product.product_id);

      if (isAlreadySelected) {
        removeGiftFromCart(product.product_id, product.campaign);
      } else {
        if (giftsInCart.length >= giftLimit) {
          const firstGift = giftsInCart[0];
          removeGiftFromCart(firstGift.product_id, firstGift.campaign);
        }
        addProductToCart({ ...product, quantity: 1, is_gift: true, campaign: product.campaign, type: 'foc' });
      }
    } catch (error) {
      // console.error('Error in handleGiftSelect:', error);
    }
  };

  const handleConfirmSelection = () => {
    setIsModalOpen(false);
  };

  // Synchronize with cartProducts
  useEffect(() => {
    if (loading || thresholds.length === 0) return; // Prevent removing gifts before thresholds are fetched or if thresholds array is empty

    if (!activeThreshold) {
      cartProducts.forEach((item) => {
        if (item.is_gift && item.type === 'foc') {
          removeGiftFromCart(item.product_id, item.campaign);
        }
      });
    } else {
      const giftLimit = activeThreshold.gift_limit || 1;
      const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');

      // Auto-add if there's only one product option available in activeThreshold AND limit is 1
      if (activeThreshold.gifts.length === 1 && giftLimit === 1) {
        const singleGift = activeThreshold.gifts[0];
        const isAlreadyInCart = giftsInCart.some(item => item.product_id === singleGift.product_id);
        if (!isAlreadyInCart) {
          addProductToCart({ ...singleGift, quantity: 1, is_gift: true, campaign: singleGift.campaign, type: 'foc' });
        }
      }

      // If gifts in cart exceed current giftLimit, trim excess gifts
      if (giftsInCart.length > giftLimit) {
        const excessGifts = giftsInCart.slice(giftLimit);
        excessGifts.forEach((gift) => {
          removeGiftFromCart(gift.product_id, gift.campaign);
        });
      }

      // Ensure all gifts in cart are valid for current threshold
      giftsInCart.forEach((gift) => {
        const isValid = activeThreshold.gifts.some(g => g.product_id === gift.product_id);
        if (!isValid) {
          removeGiftFromCart(gift.product_id, gift.campaign);
        }
      });
    }
  }, [activeThreshold, cartProducts, loading, thresholds]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Calculate next threshold info
  const getNextThreshold = () => {
    return thresholds.find((threshold) => nonCollectionTotalPrice < parseFloat(threshold.min));
  };

  // Hide Free Gift if all products are from Collections (and clean up any existing FOC gifts)
  useEffect(() => {
    if (!loading && nonCollectionProducts.length === 0) {
      cartProducts.forEach((item) => {
        if (item.is_gift && item.type === 'foc') {
          removeGiftFromCart(item.product_id, item.campaign);
        }
      });
    }
  }, [nonCollectionProducts.length, loading]);

  if (nonCollectionProducts.length === 0) return null;
  if (loading) return <></>;

  const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');
  const giftLimit = activeThreshold?.gift_limit || 1;
  const nextThreshold = getNextThreshold();

  // Progress towards next threshold
  const progressPercent = nextThreshold
    ? Math.min(100, (nonCollectionTotalPrice / nextThreshold.min) * 100)
    : 100;

  const amountNeeded = nextThreshold
    ? (nextThreshold.min - nonCollectionTotalPrice).toFixed(2)
    : 0;


  return (
    <>

      {/* ── LOCKED STATE ── */}
      {!activeThreshold && nextThreshold && (
        <div className="foc-strip foc-strip--locked">
          <div className="foc-locked-row">
            <div className="foc-gift-icon">🎁</div>
            <div className="foc-locked-text">
              <strong>Spend AED {amountNeeded} more</strong> to unlock a free gift!
            </div>
          </div>
          <div className="foc-progress-track">
            <div className="foc-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* ── UNLOCKED: SINGLE AUTO-ADDED GIFT ── */}
      {activeThreshold && activeThreshold.gifts.length === 1 && giftLimit === 1 && (
        <div className="foc-strip foc-strip--auto">
          <div className="foc-auto-icon">🎁</div>
          <div className="foc-auto-text">
            <p className="foc-auto-title">{activeThreshold.name} — Free Gift Added!</p>
            <p className="foc-auto-sub">
              {he.decode(activeThreshold.gifts[0]?.product_name || '')} has been added to your cart for free.
            </p>
          </div>
          <span className="foc-auto-badge">FREE</span>
        </div>
      )}

      {/* ── UNLOCKED: CHOOSE GIFT BUTTON ── */}
      {activeThreshold && !(activeThreshold.gifts.length === 1 && giftLimit === 1) && (
        <div className="foc-strip foc-strip--choose">
          <div className="foc-choose-header">
            <span className="foc-choose-header-icon">🎁</span>
            <p className="foc-choose-title">
              {activeThreshold.name} — You've Earned Free Gifts!
            </p>
            <span className="foc-counter">{giftsInCart.length}/{giftLimit}</span>
          </div>
          <button
            className="foc-choose-btn"
            onClick={() => setIsModalOpen(true)}
            aria-label="Choose your free gift"
          >
            <div className="foc-choose-btn-shimmer" />
            <span className="foc-choose-btn-left">
              <span>Choose Your Free {giftLimit > 1 ? 'Gifts' : 'Gift'}</span>
              {giftsInCart.length > 0 && (
                <span className="foc-selected-badge">
                  ✓ {giftsInCart.length} Selected
                </span>
              )}
            </span>
            <span className="foc-choose-btn-arrow">›</span>
          </button>

          {/* List selected products with clear Remove button */}
          {giftsInCart.length > 0 && (
            <div className="foc-selected-gifts-list">
              {giftsInCart.map((gift, idx) => (
                <div key={idx} className="foc-selected-gift-row">
                  <div className="foc-selected-gift-left">
                    <span className="foc-selected-gift-icon">🎁</span>
                    <span className="foc-selected-gift-name">
                      {he.decode(gift.product_name)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="foc-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGiftFromCart(gift.product_id, gift.campaign);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── GIFT PICKER MODAL ── */}
      {isModalOpen && activeThreshold && (
        <div
          className="foc-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Choose your free gift"
        >
          <div className="foc-modal">
            {/* Header */}
            <div className="foc-modal-header">
              <div className="foc-modal-header-text">
                <p className="foc-modal-title">
                  🎁 Choose Your Free {giftLimit > 1 ? 'Gifts' : 'Gift'}
                  <span className="foc-modal-subtitle">
                    Select {giftLimit} {giftLimit > 1 ? 'perfumes' : 'perfume'} · {giftsInCart.length}/{giftLimit} selected
                  </span>
                </p>
              </div>
              <button
                className="foc-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close gift picker"
              >
                ✕
              </button>
            </div>

            {/* Body – Gift Grid */}
            <div className="foc-modal-body">
              <div className="foc-gifts-grid">
                {activeThreshold.gifts.map((product, i) => {
                  const isSelected = giftsInCart.some(item => item.product_id === product.product_id);
                  const isMaxedOut = giftsInCart.length >= giftLimit;
                  const isSelectionDisabled = isMaxedOut && !isSelected;

                  return (
                    <div
                      key={i}
                      className={`foc-gift-card ${isSelected ? 'foc-gift-card--selected' : ''} ${isSelectionDisabled ? 'foc-gift-card--disabled' : ''}`}
                      onClick={() => {
                        if (!isSelectionDisabled) {
                          handleGiftSelect(product);
                        }
                      }}
                    >
                      {/* Image */}
                      <div className="foc-gift-card-img">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}storage/${product.image}`}
                          alt={he.decode(product.product_name)}
                          fill
                          sizes="(max-width: 480px) 45vw, 30vw"
                          className="pc__img"
                          loading="lazy"
                          style={{ objectFit: 'cover' }}
                        />
                        <span className="foc-free-badge">FREE</span>
                        {isSelected && (
                          <div className="foc-selected-check">
                            <div className="foc-selected-check-icon">✓</div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="foc-gift-card-info">
                        <p className="foc-gift-card-name">{he.decode(product.product_name)}</p>
                        <button
                          className={`foc-gift-select-btn ${isSelected ? 'foc-gift-select-btn--selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelectionDisabled) {
                              handleGiftSelect(product);
                            }
                          }}
                          disabled={isSelectionDisabled}
                          aria-label={isSelected ? `Remove ${he.decode(product.product_name)}` : `Select ${he.decode(product.product_name)} as free gift`}
                        >
                          {isSelected ? 'Remove' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="foc-modal-footer">
              <button
                className="foc-confirm-btn"
                onClick={handleConfirmSelection}
                disabled={giftsInCart.length === 0}
                aria-label="Confirm gift selection"
              >
                <span>Confirm Selection</span>
                {giftsInCart.length > 0 && <span className="foc-confirm-icon">✓</span>}
              </button>
              {giftsInCart.length < giftLimit && (
                <p className="foc-footer-hint">
                  {giftLimit - giftsInCart.length} more {giftLimit - giftsInCart.length === 1 ? 'gift' : 'gifts'} remaining to select
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreeGiftFeature;