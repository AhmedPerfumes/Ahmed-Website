import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import './FreeGiftFeature.css';
import Image from 'next/image';
import { useContextElement } from '@/context/Context';
import he from 'he';
import { useUser } from "@/context/UserContext";
import { useLocale } from "next-intl";

export const isProductOutOfStock = (product) => {
  if (!product) return false;
  if (product.is_out_of_stock === true || product.is_out_of_stock === 1 || product.is_out_of_stock === '1') {
    return true;
  }
  if (product.stock_status === 'out_of_stock') {
    return true;
  }
  if (product.product_qty !== undefined && product.product_qty !== null && Number(product.product_qty) <= 0) {
    return true;
  }
  if (product.quantity !== undefined && product.quantity !== null && Number(product.quantity) <= 0) {
    return true;
  }
  return false;
};

const FreeGiftFeature = ({ couponData, autoPopup = false, forcedOpen = false, onForcedClose, onEligibilityChange }) => {
  const { cartProducts, totalPrice, addProductToCart, setCartProducts, promotionsContext, removeGiftFromCart } = useContextElement();
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasAutoPoppedRef = useRef(false);

  const locale = useLocale();
  const isArabic = locale === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isLoggedIn } = useUser();

  // Filter products that count towards the threshold
  const getEligibleProducts = useCallback((allowWithDiscount = false) => {
    return cartProducts.filter(
      (item) =>
        !item.is_gift &&
        (allowWithDiscount || (!item.discount && !item.sale_price)) &&
        !promotionsContext.some((promo) =>
          promo.buy_products?.some((buyItem) => buyItem.product_id === item.product_id)
        )
    );
  }, [cartProducts, promotionsContext]);

  const currentUTC = new Date();
  const currentGST = new Date(currentUTC.getTime() + (4 * 60 * 60 * 1000));
  const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");

  // Total price of eligible products
  const calculateEligibleTotalPrice = useCallback((allowWithDiscount = false) => {
    const products = getEligibleProducts(allowWithDiscount);
    return products.reduce(
      (acc, item) => {
        const actualPrice = item.sale_price || item.price;
        if (couponData?.code && new Date(current_date_time) >= new Date(item.coupon?.[couponData?.code.toLowerCase()]?.start_date) && new Date(current_date_time) <= new Date(item.coupon?.[couponData?.code.toLowerCase()]?.end_date) && item.coupon?.[couponData?.code.toLowerCase()]?.code == couponData?.code.toLowerCase()) {
          return acc + (parseFloat(actualPrice - (actualPrice / 100 * item.coupon[couponData?.code.toLowerCase()]?.value)) * item.quantity);
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
  }, [getEligibleProducts, couponData, current_date_time, isLoggedIn]);

  // Active threshold based on eligible product price
  const activeThreshold = thresholds.find(
    (threshold) => {
      const allowWithDiscount = Boolean(Number(threshold.allow_with_discount));
      const total = calculateEligibleTotalPrice(allowWithDiscount);
      return (
        total >= parseFloat(threshold.min) &&
        (!threshold.max || total <= parseFloat(threshold.max))
      );
    }
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

  // Reset auto-popup ref if active threshold changes
  useEffect(() => {
    if (activeThreshold?.id) {
      hasAutoPoppedRef.current = false;
    }
  }, [activeThreshold?.id]);

  // Auto-open modal on load if autoPopup is enabled, eligible, in-stock options exist, and user hasn't selected free gift(s) yet
  useEffect(() => {
    if (!autoPopup || loading || !activeThreshold) return;

    const inStock = activeThreshold.gifts?.filter(g => !isProductOutOfStock(g)) || [];
    if (inStock.length === 0) return; // Do not auto popup if no gifts are in stock

    const giftLimit = activeThreshold.gift_limit || 1;
    // Skip auto popup if single gift is automatically added
    const isSingleAutoAdded = activeThreshold.gifts?.length === 1 && giftLimit === 1 && !isProductOutOfStock(activeThreshold.gifts[0]);
    if (isSingleAutoAdded) return;

    const effectiveLimit = Math.min(giftLimit, inStock.length);
    const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');

    if (giftsInCart.length < effectiveLimit && !hasAutoPoppedRef.current) {
      setIsModalOpen(true);
      hasAutoPoppedRef.current = true;
    }
  }, [activeThreshold, autoPopup, loading, cartProducts]);

  // Handle gift selection with toggle and swap behavior
  const handleGiftSelect = (product) => {
    try {
      if (isProductOutOfStock(product)) {
        return; // Cannot select out-of-stock product
      }
      const inStock = activeThreshold?.gifts?.filter(g => !isProductOutOfStock(g)) || [];
      const giftLimit = Math.min(activeThreshold?.gift_limit || 1, inStock.length);
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
    if (forcedOpen && onForcedClose) {
      onForcedClose();
    }
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
      const inStock = activeThreshold.gifts?.filter(g => !isProductOutOfStock(g)) || [];
      const giftLimit = activeThreshold.gift_limit || 1;
      const effectiveLimit = Math.min(giftLimit, inStock.length);
      const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');

      // Auto-add if there's only one product option available in activeThreshold AND limit is 1 AND product is in stock
      if (activeThreshold.gifts.length === 1 && giftLimit === 1) {
        const singleGift = activeThreshold.gifts[0];
        if (!isProductOutOfStock(singleGift)) {
          const isAlreadyInCart = giftsInCart.some(item => item.product_id === singleGift.product_id);
          if (!isAlreadyInCart) {
            addProductToCart({ ...singleGift, quantity: 1, is_gift: true, campaign: singleGift.campaign, type: 'foc' });
          }
        }
      }

      // If gifts in cart exceed current effectiveLimit, trim excess gifts
      if (giftsInCart.length > effectiveLimit) {
        const excessGifts = giftsInCart.slice(effectiveLimit);
        excessGifts.forEach((gift) => {
          removeGiftFromCart(gift.product_id, gift.campaign);
        });
      }

      // Ensure all gifts in cart are valid for current threshold AND not out of stock
      giftsInCart.forEach((gift) => {
        const matchingGift = activeThreshold.gifts.find(g => g.product_id === gift.product_id);
        const isValid = matchingGift && !isProductOutOfStock(matchingGift);
        if (!isValid) {
          removeGiftFromCart(gift.product_id, gift.campaign);
        }
      });
    }
  }, [activeThreshold, cartProducts, loading, thresholds]);

  // Report eligibility status to parent so the order gate can use it
  useEffect(() => {
    if (!onEligibilityChange) return;
    if (loading) return;
    const giftsInCartNow = cartProducts.filter((item) => item.is_gift && item.type === 'foc');
    const giftLimitNow = activeThreshold?.gift_limit || 1;
    const inStock = activeThreshold?.gifts?.filter(g => !isProductOutOfStock(g)) || [];

    // If no active threshold or no gifts in stock, no action required from user
    if (!activeThreshold || inStock.length === 0) {
      onEligibilityChange({ isEligible: false, giftsNeeded: 0 });
      return;
    }

    // Single auto-added gift requires no user action (only if in stock)
    const isSingleAutoAdded =
      activeThreshold?.gifts?.length === 1 && giftLimitNow === 1 && !isProductOutOfStock(activeThreshold.gifts[0]);
    const effectiveLimit = Math.min(giftLimitNow, inStock.length);
    const isEligible = !isSingleAutoAdded && effectiveLimit > 0;
    const giftsNeeded = isEligible ? Math.max(0, effectiveLimit - giftsInCartNow.length) : 0;
    onEligibilityChange({ isEligible, giftsNeeded });
  }, [activeThreshold, cartProducts, loading, onEligibilityChange]);

  // Sync forcedOpen → open the modal imperatively from parent
  useEffect(() => {
    if (forcedOpen) {
      setIsModalOpen(true);
    }
  }, [forcedOpen]);

  // Close modal on Escape key (disabled in mandatory/forced mode)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !forcedOpen) setIsModalOpen(false);
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
  }, [isModalOpen, forcedOpen]);

  // Calculate next threshold info
  const getNextThreshold = () => {
    return thresholds.find((threshold) => {
      const allowWithDiscount = Boolean(Number(threshold.allow_with_discount));
      const total = calculateEligibleTotalPrice(allowWithDiscount);
      return total < parseFloat(threshold.min);
    });
  };

  const nextThreshold = getNextThreshold();
  const nextThresholdAllowDiscount = nextThreshold ? Boolean(Number(nextThreshold.allow_with_discount)) : false;
  const currentTotalForNext = calculateEligibleTotalPrice(nextThresholdAllowDiscount);

  // Check if any cart product is eligible under any threshold
  const anyThresholdAllowsDiscount = thresholds.some((t) => Boolean(Number(t.allow_with_discount)));
  const hasEligibleCartProducts = getEligibleProducts(anyThresholdAllowsDiscount).length > 0;

  // Hide Free Gift if no eligible products in cart (and clean up any existing FOC gifts)
  useEffect(() => {
    if (!loading && !hasEligibleCartProducts) {
      cartProducts.forEach((item) => {
        if (item.is_gift && item.type === 'foc') {
          removeGiftFromCart(item.product_id, item.campaign);
        }
      });
    }
  }, [hasEligibleCartProducts, loading]);

  if (!hasEligibleCartProducts) return null;
  if (loading) return <></>;

  const giftsInCart = cartProducts.filter((item) => item.is_gift && item.type === 'foc');
  const inStockGifts = activeThreshold?.gifts?.filter(g => !isProductOutOfStock(g)) || [];
  const giftLimit = activeThreshold?.gift_limit || 1;
  const effectiveGiftLimit = Math.min(giftLimit, inStockGifts.length);

  // Progress towards next threshold
  const progressPercent = nextThreshold
    ? Math.min(100, (currentTotalForNext / nextThreshold.min) * 100)
    : 100;

  const amountNeeded = nextThreshold
    ? (nextThreshold.min - currentTotalForNext).toFixed(2)
    : 0;

  return (
    <>
      {/* ── LOCKED STATE ── */}
      {!activeThreshold && nextThreshold && (
        <div className="foc-strip foc-strip--locked">
          <div className="foc-locked-row">
            <div className="foc-gift-icon">🎁</div>
            <div className="foc-locked-text">
              <strong>
                {isArabic ? `أنفق ${amountNeeded} د.إ إضافية` : `Spend AED ${amountNeeded} more`}
              </strong>{' '}
              {isArabic ? 'للحصول على هدية مجانية!' : 'to unlock a free gift!'}
            </div>
          </div>
          <div className="foc-progress-track">
            <div className="foc-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* ── UNLOCKED: SINGLE AUTO-ADDED GIFT ── */}
      {activeThreshold && activeThreshold.gifts.length === 1 && giftLimit === 1 && (
        isProductOutOfStock(activeThreshold.gifts[0]) ? (
          <div className="foc-strip foc-strip--locked foc-strip--oos">
            <div className="foc-locked-row">
              <div className="foc-gift-icon">🎁</div>
              <div className="foc-locked-text">
                <strong>{activeThreshold.name}</strong> — {he.decode(
                  (isArabic && activeThreshold.gifts[0]?.product_name_ar) || activeThreshold.gifts[0]?.product_name || ''
                )} {isArabic ? 'غير متوفر حالياً في المخزون' : 'is currently out of stock'}.
              </div>
            </div>
          </div>
        ) : (
          <div className="foc-strip foc-strip--auto">
            <div className="foc-auto-icon">🎁</div>
            <div className="foc-auto-text">
              <p className="foc-auto-title">{activeThreshold.name} — {isArabic ? 'تمت إضافة الهدية المجانية!' : 'Free Gift Added!'}</p>
              <p className="foc-auto-sub">
                {he.decode(
                  (isArabic && activeThreshold.gifts[0]?.product_name_ar) || activeThreshold.gifts[0]?.product_name || ''
                )} {isArabic ? 'تمت إضافتها إلى سلتك مجاناً.' : 'has been added to your cart for free.'}
              </p>
            </div>
            <span className="foc-auto-badge">{isArabic ? 'مجاناً' : 'FREE'}</span>
          </div>
        )
      )}

      {/* ── UNLOCKED: CHOOSE GIFT BUTTON ── */}
      {activeThreshold && !(activeThreshold.gifts.length === 1 && giftLimit === 1) && (
        inStockGifts.length === 0 ? (
          <div className="foc-strip foc-strip--locked foc-strip--oos">
            <div className="foc-locked-row">
              <div className="foc-gift-icon">🎁</div>
              <div className="foc-locked-text">
                <strong>{activeThreshold.name}</strong> — {isArabic ? 'هدايا العرض الترويجي غير متوفرة حالياً في المخزون.' : 'Free gifts for this promotion are currently out of stock.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="foc-strip foc-strip--choose">
            <div className="foc-choose-header">
              <span className="foc-choose-header-icon">🎁</span>
              <p className="foc-choose-title">
                {activeThreshold.name} — {isArabic ? 'لقد حصلت على هدايا مجانية!' : "You've Earned Free Gifts!"}
              </p>
              <span className="foc-counter">{giftsInCart.length}/{effectiveGiftLimit}</span>
            </div>
            <button
              className="foc-choose-btn"
              onClick={() => setIsModalOpen(true)}
              aria-label="Choose your free gift"
            >
              <div className="foc-choose-btn-shimmer" />
              <span className="foc-choose-btn-left">
                <span>{isArabic ? (effectiveGiftLimit > 1 ? 'اختر هداياك المجانية' : 'اختر هديتك المجانية') : `Choose Your Free ${effectiveGiftLimit > 1 ? 'Gifts' : 'Gift'}`}</span>
                {giftsInCart.length > 0 && (
                  <span className="foc-selected-badge">
                    ✓ {giftsInCart.length} {isArabic ? 'محدد' : 'Selected'}
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
                        {he.decode((isArabic && gift.product_name_ar) || gift.product_name || '')}
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
                      {isArabic ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}

      {/* ── GIFT PICKER MODAL ── */}
      {isModalOpen && activeThreshold && mounted && createPortal(
        <div
          className="foc-overlay"
          onClick={(e) => { if (e.target === e.currentTarget && !forcedOpen) setIsModalOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Choose your free gift"
        >
          <div className="foc-modal">
            {/* Header */}
            <div className="foc-modal-header">
              <div className="foc-modal-header-text">
                <p className="foc-modal-title">
                  🎁 {isArabic ? (effectiveGiftLimit > 1 ? 'اختر هداياك المجانية' : 'اختر هديتك المجانية') : `Choose Your Free ${effectiveGiftLimit > 1 ? 'Gifts' : 'Gift'}`}
                  <span className="foc-modal-subtitle">
                    {isArabic
                      ? `اختر ${effectiveGiftLimit} · ${giftsInCart.length}/${effectiveGiftLimit} محدد`
                      : `Select ${effectiveGiftLimit} ${effectiveGiftLimit > 1 ? 'perfumes' : 'perfume'} · ${giftsInCart.length}/${effectiveGiftLimit} selected`}
                  </span>
                </p>
              </div>
              {!forcedOpen && (
                <button
                  className="foc-modal-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close gift picker"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Body – Gift Grid */}
            <div className="foc-modal-body">
              <div className="foc-gifts-grid">
                {activeThreshold.gifts.map((product, i) => {
                  const isOutOfStock = isProductOutOfStock(product);
                  const isSelected = giftsInCart.some(item => item.product_id === product.product_id);
                  const isMaxedOut = giftsInCart.length >= effectiveGiftLimit;
                  const isSelectionDisabled = isOutOfStock ? !isSelected : (isMaxedOut && !isSelected);
                  const displayName = (isArabic && product.product_name_ar) || product.product_name || '';

                  return (
                    <div
                      key={i}
                      className={`foc-gift-card ${isSelected ? 'foc-gift-card--selected' : ''} ${isOutOfStock ? 'foc-gift-card--oos' : ''} ${isSelectionDisabled && !isOutOfStock ? 'foc-gift-card--disabled' : ''}`}
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
                          alt={he.decode(displayName)}
                          fill
                          sizes="(max-width: 480px) 45vw, 30vw"
                          className="pc__img"
                          loading="lazy"
                          style={{ objectFit: 'cover' }}
                        />
                        {isOutOfStock ? (
                          <span className="foc-oos-badge">
                            {isArabic ? 'غير متوفر' : 'Out of Stock'}
                          </span>
                        ) : (
                          <span className="foc-free-badge">
                            {isArabic ? 'مجاناً' : 'FREE'}
                          </span>
                        )}
                        {isSelected && (
                          <div className="foc-selected-check">
                            <div className="foc-selected-check-icon">✓</div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="foc-gift-card-info">
                        <p className="foc-gift-card-name">{he.decode(displayName)}</p>
                        <button
                          className={`foc-gift-select-btn ${isSelected ? 'foc-gift-select-btn--selected' : ''} ${isOutOfStock ? 'foc-gift-select-btn--oos' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelectionDisabled) {
                              handleGiftSelect(product);
                            }
                          }}
                          disabled={isSelectionDisabled}
                          aria-label={
                            isOutOfStock
                              ? `${he.decode(displayName)} ${isArabic ? 'غير متوفر' : 'is out of stock'}`
                              : isSelected
                              ? `${isArabic ? 'إزالة' : 'Remove'} ${he.decode(displayName)}`
                              : `${isArabic ? 'اختيار' : 'Select'} ${he.decode(displayName)}`
                          }
                        >
                          {isOutOfStock
                            ? (isArabic ? 'غير متوفر' : 'Out of Stock')
                            : isSelected
                            ? (isArabic ? 'إزالة' : 'Remove')
                            : (isArabic ? 'اختيار' : 'Select')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="foc-modal-footer">
              {forcedOpen && effectiveGiftLimit > 0 && giftsInCart.length < effectiveGiftLimit && (
                <p className="foc-footer-hint" style={{ color: '#e53e3e', fontWeight: '600', marginBottom: '8px' }}>
                  ⚠️ {isArabic
                    ? `يرجى اختيار هديتك المجانية (${effectiveGiftLimit > 1 ? `${effectiveGiftLimit} هدايا` : 'هدية واحدة'}) للمتابعة في إتمام الطلب.`
                    : `Please select your free ${effectiveGiftLimit > 1 ? `${effectiveGiftLimit} gifts` : 'gift'} to continue placing your order.`}
                </p>
              )}
              <button
                className="foc-confirm-btn"
                onClick={handleConfirmSelection}
                disabled={effectiveGiftLimit > 0 && giftsInCart.length === 0}
                aria-label="Confirm gift selection"
              >
                <span>{isArabic ? 'تأكيد الاختيار' : 'Confirm Selection'}</span>
                {giftsInCart.length > 0 && <span className="foc-confirm-icon">✓</span>}
              </button>
              {!forcedOpen && effectiveGiftLimit > 0 && giftsInCart.length < effectiveGiftLimit && (
                <p className="foc-footer-hint">
                  {effectiveGiftLimit - giftsInCart.length} {isArabic ? 'متبقي للاختيار' : `${effectiveGiftLimit - giftsInCart.length === 1 ? 'gift' : 'gifts'} remaining to select`}
                </p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default FreeGiftFeature;