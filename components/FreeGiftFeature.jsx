import React, { useState, useEffect, useCallback } from 'react';
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
    if (loading) return; // Prevent removing gifts before thresholds are fetched

    if (!activeThreshold) {
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
  }, [activeThreshold, cartProducts, removeGiftFromCart, loading]);

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
    return thresholds.find((threshold) => nonCollectionTotalPrice < threshold.min);
  };

  // Hide Free Gift if all products are from Collections
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
      <style>{`
        /* ── FOC Strip — Subtle & Premium ── */
        .foc-strip {
          margin: 10px 0;
          border-radius: 10px;
          font-family: inherit;
        }

        /* ── LOCKED STATE ── */
        .foc-strip--locked {
          background: #faf9f7;
          border: 1px solid #e8e2d9;
          padding: 12px 14px;
        }

        .foc-locked-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 9px;
        }

        .foc-gift-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f3ede3;
          border: 1px solid #e0d5c1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 15px;
        }

        .foc-locked-text {
          flex: 1;
          font-size: 12.5px;
          color: #7a7060;
          line-height: 1.45;
        }

        .foc-locked-text strong {
          color: #5a4e38;
          font-weight: 600;
        }

        .foc-progress-track {
          height: 3px;
          background: #e8e2d9;
          border-radius: 99px;
          overflow: hidden;
        }

        .foc-progress-bar {
          height: 100%;
          border-radius: 99px;
          background: #b9a16b;
          transition: width 0.5s ease;
        }

        /* ── AUTO-GIFT STATE ── */
        .foc-strip--auto {
          background: #f6faf6;
          border: 1px solid #d4e8d4;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 10px;
        }

        .foc-auto-icon {
          font-size: 20px;
          flex-shrink: 0;
          opacity: 0.85;
        }

        .foc-auto-text {
          flex: 1;
        }

        .foc-auto-text .foc-auto-title {
          font-size: 12.5px;
          font-weight: 600;
          color: #2d6a35;
          margin: 0 0 2px;
          letter-spacing: 0.1px;
        }

        .foc-auto-text .foc-auto-sub {
          font-size: 11.5px;
          color: #6a9470;
          margin: 0;
        }

        .foc-auto-badge {
          background: #eaf4ea;
          border: 1px solid #b8d9b8;
          color: #2d6a35;
          font-size: 9.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          flex-shrink: 0;
        }

        /* ── CHOOSE GIFT STATE ── */
        .foc-strip--choose {
          background: #faf9f7;
          border: 1px solid #ddd5c0;
          padding: 12px 14px;
          border-radius: 10px;
        }

        .foc-choose-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .foc-choose-title {
          flex: 1;
          font-size: 12.5px;
          font-weight: 600;
          color: #5a4e38;
          margin: 0;
          letter-spacing: 0.1px;
        }

        .foc-counter {
          background: #f3ede3;
          border: 1px solid #ddd5c0;
          color: #8a7350;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 99px;
        }

        .foc-choose-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 16px;
          border-radius: 8px;
          border: 1px solid #c8b990;
          background: #fff;
          color: #6b5a3a;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.2px;
        }

        .foc-choose-btn:hover {
          background: #f3ede3;
          border-color: #b9a16b;
          color: #4a3c22;
          box-shadow: 0 2px 10px rgba(185,161,107,0.15);
        }

        .foc-choose-btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%);
          animation: foc-shimmer 3s infinite;
        }

        @keyframes foc-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .foc-choose-btn-left {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .foc-choose-btn-arrow {
          font-size: 16px;
          color: #b9a16b;
          position: relative;
          z-index: 1;
          transition: transform 0.2s;
        }

        .foc-choose-btn:hover .foc-choose-btn-arrow {
          transform: translateX(3px);
        }

        /* ── Modal Overlay ── */
        .foc-overlay {
          position: fixed;
          inset: 0;
          background: rgba(30, 25, 18, 0.55);
          backdrop-filter: blur(3px);
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: foc-overlay-in 0.2s ease;
        }

        @media (min-width: 640px) {
          .foc-overlay {
            align-items: center;
          }
        }

        @keyframes foc-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .foc-modal {
          background: #fff;
          width: 100%;
          max-width: 600px;
          border-radius: 18px 18px 0 0;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          animation: foc-modal-up 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.12);
        }

        @media (min-width: 640px) {
          .foc-modal {
            border-radius: 16px;
            max-height: 82vh;
            box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          }
        }

        @keyframes foc-modal-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Modal Header */
        .foc-modal-header {
          background: #fff;
          border-bottom: 1px solid #ece7de;
          padding: 16px 18px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          flex-shrink: 0;
        }

        .foc-modal-title {
          flex: 1;
          font-size: 15px;
          font-weight: 600;
          color: #2e2416;
          margin: 0;
          letter-spacing: 0.1px;
        }

        .foc-modal-subtitle {
          font-size: 11.5px;
          color: #9a8c78;
          font-weight: 400;
          display: block;
          margin-top: 3px;
        }

        .foc-modal-close {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #f3ede3;
          border: 1px solid #e0d5c1;
          color: #8a7a62;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.15s;
          flex-shrink: 0;
          line-height: 1;
          margin-top: 1px;
        }

        .foc-modal-close:hover {
          background: #e8e0d0;
          color: #4a3c22;
        }

        /* Modal Body */
        .foc-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          background: #f7f4ef;
        }

        .foc-modal-body::-webkit-scrollbar {
          width: 3px;
        }

        .foc-modal-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .foc-modal-body::-webkit-scrollbar-thumb {
          background: #d5c8ae;
          border-radius: 99px;
        }

        .foc-gifts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        @media (min-width: 480px) {
          .foc-gifts-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Gift Card */
        .foc-gift-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid #ede7db;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }

        .foc-gift-card:hover {
          border-color: #c8b990;
          box-shadow: 0 4px 14px rgba(185,161,107,0.14);
          transform: translateY(-2px);
        }

        .foc-gift-card--selected {
          border-color: #6aaa6a !important;
          box-shadow: 0 4px 14px rgba(100,170,100,0.15) !important;
        }

        .foc-gift-card-img {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #f5f2ee;
        }

        .foc-gift-card-img img {
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .foc-gift-card:hover .foc-gift-card-img img {
          transform: scale(1.04);
        }

        .foc-free-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #b9a16b;
          color: #fff;
          font-size: 8.5px;
          font-weight: 700;
          padding: 3px 7px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          z-index: 2;
        }

        .foc-selected-check {
          position: absolute;
          inset: 0;
          background: rgba(90,150,90,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        .foc-selected-check-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #5a9a5a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          box-shadow: 0 3px 10px rgba(90,154,90,0.3);
        }

        .foc-gift-card-info {
          padding: 9px 10px 11px;
        }

        .foc-gift-card-name {
          font-size: 11.5px;
          font-weight: 500;
          color: #3a3028;
          margin: 0 0 8px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 30px;
        }

        .foc-gift-select-btn {
          width: 100%;
          padding: 7px 0;
          border-radius: 7px;
          border: 1px solid #c8b990;
          background: transparent;
          color: #8a7350;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .foc-gift-select-btn:hover {
          background: #f3ede3;
          border-color: #b9a16b;
          color: #5a4228;
        }

        .foc-gift-select-btn--selected {
          background: #edf6ed;
          border-color: #6aaa6a;
          color: #2d6a35;
        }

        .foc-gift-select-btn--selected:hover {
          background: #e0f0e0;
          border-color: #5a9a5a;
          color: #1e4e24;
        }

        /* Modal Footer */
        .foc-modal-footer {
          padding: 12px 14px;
          background: #fff;
          border-top: 1px solid #ece7de;
          flex-shrink: 0;
        }

        .foc-confirm-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: 1px solid #c8b990;
          background: #2e2416;
          color: #d5c09a;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .foc-confirm-btn:hover {
          background: #3d3020;
          color: #e8d8b0;
          border-color: #b9a16b;
        }

        .foc-confirm-btn:disabled {
          background: #f0ece4;
          border-color: #ddd5c0;
          color: #b0a488;
          cursor: not-allowed;
        }

        .foc-confirm-btn:disabled:hover {
          background: #f0ece4;
          color: #b0a488;
          border-color: #ddd5c0;
        }

        .foc-footer-hint {
          text-align: center;
          font-size: 11px;
          color: #b0a488;
          margin: 7px 0 0;
        }

        /* ── Mobile Responsive ── */
        @media (max-width: 480px) {

          .foc-strip {
            margin: 6px 0;
            border-radius: 8px;
          }

          /* Locked */
          .foc-strip--locked {
            padding: 9px 11px;
          }

          .foc-locked-row {
            gap: 8px;
            margin-bottom: 7px;
          }

          .foc-gift-icon {
            width: 28px;
            height: 28px;
            font-size: 13px;
          }

          .foc-locked-text {
            font-size: 11px;
            line-height: 1.35;
          }

          .foc-locked-text strong {
            font-size: 11.5px;
          }

          .foc-progress-track {
            height: 3px;
          }

          /* Auto-gift */
          .foc-strip--auto {
            padding: 9px 11px;
            gap: 8px;
          }

          .foc-auto-icon {
            font-size: 16px;
          }

          .foc-auto-text .foc-auto-title {
            font-size: 11px;
          }

          .foc-auto-text .foc-auto-sub {
            font-size: 10.5px;
          }

          .foc-auto-badge {
            font-size: 9px;
            padding: 2px 6px;
          }

          /* Choose */
          .foc-strip--choose {
            padding: 9px 11px;
          }

          .foc-choose-header {
            gap: 6px;
            margin-bottom: 8px;
          }

          .foc-choose-title {
            font-size: 11px;
          }

          .foc-counter {
            font-size: 10px;
            padding: 2px 6px;
          }

          .foc-choose-btn {
            padding: 9px 12px;
            font-size: 12px;
          }

          .foc-choose-btn-arrow {
            font-size: 14px;
          }

          /* Modal */
          .foc-modal {
            border-radius: 14px 14px 0 0;
            max-height: 88vh;
          }

          .foc-modal-header {
            padding: 12px 14px;
          }

          .foc-modal-title {
            font-size: 13px;
          }

          .foc-modal-subtitle {
            font-size: 10.5px;
            margin-top: 2px;
          }

          .foc-modal-close {
            width: 26px;
            height: 26px;
            font-size: 12px;
          }

          .foc-modal-body {
            padding: 10px;
          }

          .foc-gifts-grid {
            gap: 8px;
          }

          .foc-gift-card {
            border-radius: 10px;
          }

          .foc-free-badge {
            font-size: 8px;
            padding: 2px 6px;
            top: 6px;
            left: 6px;
          }

          .foc-selected-check-icon {
            width: 34px;
            height: 34px;
            font-size: 17px;
          }

          .foc-gift-card-info {
            padding: 7px 8px 9px;
          }

          .foc-gift-card-name {
            font-size: 10.5px;
            margin-bottom: 6px;
            min-height: 26px;
          }

          .foc-gift-select-btn {
            padding: 6px 0;
            font-size: 10px;
            border-radius: 6px;
          }

          .foc-modal-footer {
            padding: 10px 12px;
          }

          .foc-confirm-btn {
            padding: 11px;
            font-size: 12.5px;
            border-radius: 9px;
          }

          .foc-footer-hint {
            font-size: 10px;
            margin: 5px 0 0;
          }
        }
      `}</style>

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
            <span style={{ fontSize: '20px' }}>🎁</span>
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
                <span style={{
                  fontSize: '11px',
                  background: '#edf6ed',
                  border: '1px solid #b8d9b8',
                  color: '#2d6a35',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontWeight: 600
                }}>
                  ✓ {giftsInCart.length} Selected
                </span>
              )}
            </span>
            <span className="foc-choose-btn-arrow">›</span>
          </button>
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
              <div style={{ flex: 1 }}>
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
                  return (
                    <div
                      key={i}
                      className={`foc-gift-card ${isSelected ? 'foc-gift-card--selected' : ''}`}
                      onClick={() => handleGiftSelect(product)}
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
                          onClick={(e) => { e.stopPropagation(); handleGiftSelect(product); }}
                          aria-label={isSelected ? `Remove ${he.decode(product.product_name)}` : `Select ${he.decode(product.product_name)} as free gift`}
                        >
                          {isSelected ? '✓ Selected' : 'Select'}
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
                {giftsInCart.length > 0 && <span style={{ fontSize: '16px' }}>✓</span>}
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