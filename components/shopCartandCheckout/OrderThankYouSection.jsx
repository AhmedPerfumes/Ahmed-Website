"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import he from "he";
import { useContextElement } from "@/context/Context";
import { useMenu } from "@/context/MenuContext";
import { useUser } from "@/context/UserContext";
import styles from "./OrderThankYou.module.css";

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function OrderThankYouSection({ orderDetails: initialOrderDetails, initialOrderCode }) {
  const locale = useLocale();
  const { currency } = useMenu();
  const { setCartProducts } = useContextElement();
  const { user } = useUser();

  const [orderData, setOrderData] = useState(initialOrderDetails || null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hero Reveal Animation Stage: 'initial' -> 'docked'
  const [stage, setStage] = useState("initial");

  // Inline Product Review States
  const [activeReviewProductId, setActiveReviewProductId] = useState(null);
  const [ratingMap, setRatingMap] = useState({});
  const [hoverRatingMap, setHoverRatingMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [submittingMap, setSubmittingMap] = useState({});
  const [reviewedProductIds, setReviewedProductIds] = useState(
    initialOrderDetails?.reviewed_product_ids || []
  );
  const [reviewSuccessMap, setReviewSuccessMap] = useState({});

  // Website Feedback States
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [hoverFeedbackRating, setHoverFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const isPollingRef = useRef(false);
  const hasFiredPurchase = useRef(false);

  // Sync reviewed product IDs if order details update
  useEffect(() => {
    if (orderData?.reviewed_product_ids) {
      setReviewedProductIds((prev) => [
        ...new Set([...prev, ...orderData.reviewed_product_ids]),
      ]);
    }
  }, [orderData?.reviewed_product_ids]);

  // Stage transition timer (1.4s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage("docked");
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // Polling for online payment confirmation (skips for COD or completed)
  useEffect(() => {
    const finalStatuses = ["completed", "failed", "canceled"];

    // COD is confirmed on placement
    if (orderData?.payment_method === "cod") {
      setIsVerifying(false);
      return;
    }

    if (orderData && !finalStatuses.includes(orderData.payment_status)) {
      setIsVerifying(true);

      const pollInterval = setInterval(async () => {
        if (isPollingRef.current) return;
        isPollingRef.current = true;

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/orderDetails`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_number: initialOrderCode || orderData.order_id,
            }),
          });

          if (response.ok) {
            const updatedData = await response.json();
            if (finalStatuses.includes(updatedData.payment_status)) {
              setOrderData(updatedData);
              setIsVerifying(false);
              clearInterval(pollInterval);
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
        } finally {
          isPollingRef.current = false;
        }
      }, 10000);

      const timeoutId = setTimeout(() => {
        clearInterval(pollInterval);
        setIsVerifying(false);
      }, 50000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeoutId);
      };
    } else {
      setIsVerifying(false);
    }
  }, [orderData?.payment_status, orderData?.payment_method, initialOrderCode]);

  // Fire analytics purchase event once order is confirmed
  useEffect(() => {
    if (!orderData || hasFiredPurchase.current) return;

    const isConfirmed =
      orderData.payment_status === "completed" ||
      orderData.payment_method === "cod" ||
      orderData.status === "processing" ||
      orderData.status === "completed";

    if (isConfirmed && orderData.order_id && Array.isArray(orderData.products)) {
      hasFiredPurchase.current = true;

      // Clear cart
      localStorage.removeItem("cartList");
      setCartProducts([]);

      // GA4 Purchase Event
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: orderData.order_id,
          affiliation: "Ahmed Al Maghribi Perfumes Online",
          value: parseFloat(orderData.total || 0),
          currency: currency?.code || "AED",
          items: orderData.products.map((item) => ({
            item_id: item.product_id?.toString() || item.id?.toString(),
            item_name: item.product_name ? he.decode(item.product_name) : "",
            price: parseFloat(item.price || 0),
            quantity: item.qty || 1,
          })),
        },
      });

      // Meta Pixel
      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase", {
          content_ids: orderData.products.map((item) => (item.product_id || item.id)?.toString()),
          content_type: "product",
          contents: orderData.products.map((item) => ({
            id: (item.product_id || item.id)?.toString(),
            quantity: item.qty || 1,
          })),
          value: parseFloat(orderData.total || 0),
          currency: currency?.code || "AED",
          order_id: orderData.order_id,
        });
      }
    }
  }, [orderData, currency, setCartProducts]);

  // Copy order code to clipboard
  const handleCopyCode = () => {
    if (!orderData?.order_id) return;
    navigator.clipboard.writeText(orderData.order_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle inline review accordion for a product
  const toggleReviewDrawer = (productId) => {
    setActiveReviewProductId((prev) => (prev === productId ? null : productId));
  };

  // Submit product review
  const handleProductReviewSubmit = async (e, productId) => {
    e.preventDefault();
    const star = ratingMap[productId] || 5;
    const comment = (commentMap[productId] || "").trim();

    if (!comment) {
      alert("Please write a brief comment about this fragrance.");
      return;
    }

    setSubmittingMap((prev) => ({ ...prev, [productId]: true }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          order_id: orderData.id || orderData.order_id,
          star,
          comment,
          customer_name: orderData.customer_name || user?.name || "Valued Customer",
          customer_email: orderData.customer_email || user?.email || "",
          customer_phone: orderData.customer_phone || user?.phone || "",
          customer_id: user?.id || null,
        }),
      });

      const resData = await response.json();

      if (response.ok) {
        setReviewedProductIds((prev) => [...prev, productId]);
        setReviewSuccessMap((prev) => ({ ...prev, [productId]: true }));
        setActiveReviewProductId(null);
      } else {
        alert(resData.message || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error("Review submission error:", err);
      alert("Network error. Please try again.");
    } finally {
      setSubmittingMap((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Submit website feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedbackRating === 0) {
      alert("Please choose a rating star for your experience.");
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/submitReview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderData.id || orderData.order_id,
          customer_name: orderData.customer_name || user?.name || "Valued Customer",
          star: feedbackRating,
          comment: feedbackComment,
        }),
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
      } else {
        const error = await response.json();
        alert(error.message || "Error submitting feedback.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Helper for formatting order code without duplicate '#'
  const formatOrderCode = (code) => {
    if (!code) return "";
    return code.startsWith("#") ? code : `#${code}`;
  };

  // Helper for Payment Method Label
  const getPaymentMethodLabel = (method) => {
    if (!method) return "Online Payment";
    const m = method.toLowerCase();
    if (m === "cod") return "Cash on Delivery";
    if (m === "paytabs") return "Credit / Debit Card";
    if (m === "tabby") return "Tabby (Pay in 4)";
    if (m === "tamara") return "Tamara (Split in 3/4)";
    return method.toUpperCase();
  };

  // Star label description
  const getRatingDescription = (star) => {
    switch (star) {
      case 5: return "Loved it! (5/5)";
      case 4: return "Very Good (4/5)";
      case 3: return "Average (3/5)";
      case 2: return "Below Average (2/5)";
      case 1: return "Poor (1/5)";
      default: return "Select your rating";
    }
  };

  if (!orderData) {
    return (
      <div className={styles.pageContainer}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "16px" }}>No Order Found</h2>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            We could not locate this order details. It may have expired or been moved.
          </p>
          <Link href={`/${locale}`} className={styles.continueShoppingBtn}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isFailed =
    orderData?.payment_status === "failed" ||
    orderData?.payment_status === "canceled" ||
    orderData?.status === "canceled" ||
    orderData?.status === "failed";

  return (
    <div className={styles.pageContainer}>
      {/* ====================================================================
          Hero Section (Stage 1: Centered Reveal -> Stage 2: Docked Top Banner)
          ==================================================================== */}
      <div
        className={`${styles.heroWrapper} ${stage === "initial" ? styles.heroInitial : styles.heroDocked
          } ${stage !== "initial" && isFailed ? styles.heroDockedFailed : ""}`}
        onClick={() => stage === "initial" && setStage("docked")}
        style={{ cursor: stage === "initial" ? "pointer" : "default" }}
      >
        {stage === "initial" ? (
          <div>
            {/* Animated Large SVG Tick or Cross */}
            <div className={styles.tickWrapper}>
              {isFailed ? (
                <svg className={styles.tickSvg} viewBox="0 0 100 100">
                  <circle className={styles.crossCircle} cx="50" cy="50" r="45" pathLength="100" />
                  <line className={styles.crossLine1} x1="34" y1="34" x2="66" y2="66" pathLength="100" />
                  <line className={styles.crossLine2} x1="66" y1="34" x2="34" y2="66" pathLength="100" />
                </svg>
              ) : (
                <svg className={styles.tickSvg} viewBox="0 0 100 100">
                  <circle className={styles.tickCircle} cx="50" cy="50" r="45" pathLength="100" />
                  <polyline className={styles.tickCheck} points="28,52 44,68 72,34" pathLength="100" />
                </svg>
              )}
            </div>

            <h1 className={styles.initialHeading} style={isFailed ? { color: "#dc2626" } : undefined}>
              {isFailed ? "Order Payment Failed" : "Your order is completed!"}
            </h1>
            <p className={styles.initialSubtitle}>
              {isFailed
                ? "Your payment could not be processed. No charges were made."
                : "Thank you. We have received your order."}
            </p>

            <div className={styles.orderCodePill}>
              <span>Order {formatOrderCode(orderData.order_id)}</span>
              <button
                type="button"
                className={styles.copyButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyCode();
                }}
                title="Copy Order Code"
              >
                {copied ? "✓ Copied" : "📋"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.heroDockedLeft}>
              {isFailed ? (
                <div className={styles.crossIconSmall}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              ) : (
                <div className={styles.tickIconSmall}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              <div>
                <h2 className={styles.dockedTitle} style={isFailed ? { color: "#b91c1c" } : undefined}>
                  {isFailed ? "Order Payment Failed" : "Your order is completed! Thank you."}
                </h2>
                <p className={styles.dockedSubtitle}>
                  {isFailed
                    ? "Payment was unsuccessful. Your cart items are preserved."
                    : "We have received your order and are preparing it with care."}
                </p>
              </div>
            </div>

            <div className={styles.orderCodePill}>
              <span>Order {formatOrderCode(orderData.order_id)}</span>
              <button
                type="button"
                className={styles.copyButton}
                onClick={handleCopyCode}
                title="Copy Order Code"
              >
                {copied ? "✓ Copied" : "📋"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ====================================================================
          Main Order Content (Order Card, Products, Financials, Feedback)
          ==================================================================== */}
      <div
        className={`${styles.contentSection} ${stage === "docked" ? styles.contentSectionVisible : ""
          }`}
      >
        {isVerifying ? (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>
              Verifying Payment with Bank...
            </h3>
            <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ color: "#6b7280", marginTop: "14px" }}>
              Please wait a moment while your payment status is confirmed.
            </p>
          </div>
        ) : isFailed ? (
          <div style={{ textAlign: "center", padding: "48px 24px", background: "#fef2f2", borderRadius: "16px", border: "1px solid #fecaca" }}>
            <h2 style={{ color: "#991b1b", fontSize: "1.5rem", fontWeight: 700, marginBottom: "10px" }}>Order Payment Failed</h2>
            <p style={{ color: "#7f1d1d", marginBottom: "20px" }}>
              Your payment could not be processed by the bank. No charges were made.
            </p>
            <Link href={`/${locale}/shop-checkout`} className={styles.continueShoppingBtn}>
              Try Again in Checkout
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.mainGridLayout}>
              {/* 70% Left Column: Order Card & Navigation Actions */}
              <div className={styles.orderColumn}>
                {/* Order Card Container */}
                <div className={styles.orderCard}>
                  {/* Metadata Grid */}
                  <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Order Number</span>
                      <span className={styles.metaValue}>{formatOrderCode(orderData.order_id)}</span>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Date Placed</span>
                      <span className={styles.metaValue}>
                        {orderData.created_at
                          ? new Date(orderData.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                          : new Date().toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                      </span>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Payment Method</span>
                      <span className={styles.metaValue}>
                        {getPaymentMethodLabel(orderData.payment_method)}
                      </span>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Order Status</span>
                      <div>
                        {orderData.payment_method === "cod" ? (
                          <span className={styles.badgePending}>COD · Confirmed</span>
                        ) : (
                          <span className={styles.badgeSuccess}>✓ Payment Confirmed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Purchased Products List with Inline Review Drawer */}
                  <div className={styles.productsSection}>
                    <h3 className={styles.sectionHeading}>Purchased Fragrances</h3>

                    <div className={styles.productList}>
                      {orderData.products?.map((item, index) => {
                        const productId = item.product_id || item.id;
                        const isReviewed =
                          reviewedProductIds.includes(productId) ||
                          Boolean(reviewSuccessMap[productId]);
                        const isOpen = activeReviewProductId === productId;
                        const rating = ratingMap[productId] || 5;
                        const hoverRating = hoverRatingMap[productId] || 0;
                        const isSubmitting = Boolean(submittingMap[productId]);
                        const isGift = Boolean(item.is_gift && item.is_gift !== "0" && item.is_gift !== 0);

                        // Product Image Fallback
                        const imgSrc = item.product_image
                          ? `${IMG_BASE}storage/${item.product_image}`
                          : "/assets/images/shop/product-thumb.png";

                        return (
                          <div key={productId || index} className={styles.productCard}>
                            {/* Product Row Header */}
                            <div className={styles.productHeaderRow}>
                              <div className={styles.productInfoLeft}>
                                <img
                                  src={imgSrc}
                                  alt={item.product_name ? he.decode(item.product_name) : "Product"}
                                  className={styles.productThumb}
                                  onError={(e) => {
                                    e.currentTarget.src = "/assets/images/ahmed-favicon.png";
                                  }}
                                />
                                <div className={styles.productDetails}>
                                  <h4 className={styles.productTitle}>
                                    {item.product_name ? he.decode(item.product_name) : "Fragrance"}
                                  </h4>
                                  <div className={styles.productMeta}>
                                    <span>Qty: {item.qty || 1}</span>
                                    <span>·</span>
                                    <span>
                                      {isGift ? "Free Gift" : `${parseFloat(item.price || 0).toFixed(2)} ${currency?.symbol || "AED"}`}
                                    </span>
                                    {isGift && <span className={styles.freeGiftBadge}>Free Gift</span>}
                                  </div>
                                </div>
                              </div>

                              <div className={styles.productActions}>
                                {isReviewed ? (
                                  <span className={styles.reviewedBadge}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Review Submitted
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    className={`${styles.dropReviewBtn} ${isOpen ? styles.dropReviewBtnActive : ""
                                      }`}
                                    onClick={() => toggleReviewDrawer(productId)}
                                  >
                                    <span>★ Drop a Review</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      style={{
                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s ease",
                                      }}
                                    >
                                      <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Inline Review Drawer (Collapsible) */}
                            {!isReviewed && (
                              <div
                                className={`${styles.reviewDrawer} ${isOpen ? styles.reviewDrawerOpen : ""
                                  }`}
                              >
                                <div className={styles.drawerInner}>
                                  <div className={styles.rewardNotice}>
                                    <span>🎁</span>
                                    <span>
                                      <strong>Verified Review Reward:</strong> Leave your feedback to receive an exclusive discount coupon for your next fragrance order!
                                    </span>
                                  </div>

                                  <form onSubmit={(e) => handleProductReviewSubmit(e, productId)}>
                                    <div className={styles.ratingRow}>
                                      <div className={styles.ratingLabel}>
                                        <span>Rate this perfume:</span>
                                        <span className={styles.ratingDescription}>
                                          {getRatingDescription(hoverRating || rating)}
                                        </span>
                                      </div>
                                      <div className={styles.starGroup}>
                                        {[1, 2, 3, 4, 5].map((starVal) => (
                                          <button
                                            key={starVal}
                                            type="button"
                                            className={`${styles.starBtn} ${starVal <= (hoverRating || rating)
                                                ? styles.starActive
                                                : ""
                                              }`}
                                            onClick={() =>
                                              setRatingMap((prev) => ({ ...prev, [productId]: starVal }))
                                            }
                                            onMouseEnter={() =>
                                              setHoverRatingMap((prev) => ({
                                                ...prev,
                                                [productId]: starVal,
                                              }))
                                            }
                                            onMouseLeave={() =>
                                              setHoverRatingMap((prev) => ({
                                                ...prev,
                                                [productId]: 0,
                                              }))
                                            }
                                          >
                                            ★
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <textarea
                                      className={styles.textareaField}
                                      placeholder="What did you think of the scent notes, longevity, and sillage? Share your honest experience..."
                                      rows={3}
                                      value={commentMap[productId] || ""}
                                      onChange={(e) =>
                                        setCommentMap((prev) => ({
                                          ...prev,
                                          [productId]: e.target.value,
                                        }))
                                      }
                                      required
                                    />

                                    <div className={styles.drawerFooter}>
                                      <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={() => setActiveReviewProductId(null)}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        className={styles.submitReviewBtn}
                                        disabled={
                                          isSubmitting ||
                                          !(commentMap[productId] || "").trim()
                                        }
                                      >
                                        {isSubmitting ? "Submitting..." : "Submit Review"}
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Financial Breakdown Section */}
                  <div className={styles.financialSection}>
                    <table className={styles.totalsTable}>
                      <tbody>
                        <tr>
                          <th>Subtotal</th>
                          <td>
                            {parseFloat(orderData.sub_total || 0).toFixed(2)}{" "}
                            {currency?.symbol || "AED"}
                          </td>
                        </tr>

                        <tr>
                          <th>Shipping</th>
                          <td>
                            {parseFloat(orderData.shipping_amount || 0) <= 0 ? (
                              <span className={styles.freeShippingText}>Free Shipping ✓</span>
                            ) : (
                              `${parseFloat(orderData.shipping_amount || 0).toFixed(2)} ${currency?.symbol || "AED"}`
                            )}
                          </td>
                        </tr>

                        {parseFloat(orderData.service_amount || 0) > 0 && (
                          <tr>
                            <th>Service Fee</th>
                            <td>
                              {parseFloat(orderData.service_amount || 0).toFixed(2)}{" "}
                              {currency?.symbol || "AED"}
                            </td>
                          </tr>
                        )}

                        {orderData.payment_method === "cod" &&
                          parseFloat(orderData.cod_charge || 0) > 0 && (
                            <tr>
                              <th>COD Collection Fee</th>
                              <td>
                                {parseFloat(orderData.cod_charge || 0).toFixed(2)}{" "}
                                {currency?.symbol || "AED"}
                              </td>
                            </tr>
                          )}

                        <tr className={styles.totalRow}>
                          <th>
                            Total Amount
                            <span className={styles.vatNotice}>
                              Includes {parseFloat(orderData.tax_amount || orderData.vat_amount || 0).toFixed(2)}{" "}
                              {currency?.symbol || "AED"} VAT
                            </span>
                          </th>
                          <td>
                            {parseFloat(orderData.total || 0).toFixed(2)}{" "}
                            {currency?.symbol || "AED"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Actions (Under Order Card in 70% column) */}
                <div className={styles.actionRow}>
                  <Link href={`/${locale}`} className={styles.continueShoppingBtn}>
                    ← Continue Shopping
                  </Link>

                  {user ? (
                    <Link href={`/${locale}/account_orders`} className={styles.viewAccountBtn}>
                      View My Orders
                    </Link>
                  ) : null}
                </div>
              </div>

              {/* 30% Right Column: Sticky Rate Your Website Experience Card */}
              <div className={styles.sidebarColumn}>
                <div className={styles.feedbackCardSticky}>
                  <div className={styles.feedbackHeader}>
                    <h3 className={styles.feedbackTitle}>Rate Your Website Experience</h3>
                    <p className={styles.feedbackSubtitle}>
                      How was your browsing and checkout experience today?
                    </p>
                  </div>

                  {feedbackSubmitted ? (
                    <div className={styles.feedbackSuccessAlert}>
                      ✓ Thank you! Your website feedback has been submitted. We appreciate your insights!
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className={styles.feedbackFormWrapper}>
                      <div className={styles.feedbackStarRow}>
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            className={`${styles.feedbackStar} ${starVal <= (hoverFeedbackRating || feedbackRating)
                                ? styles.feedbackStarActive
                                : ""
                              }`}
                            onClick={() => setFeedbackRating(starVal)}
                            onMouseEnter={() => setHoverFeedbackRating(starVal)}
                            onMouseLeave={() => setHoverFeedbackRating(0)}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      <textarea
                        className={styles.feedbackTextarea}
                        placeholder="Tell us about checkout, speed, or search..."
                        rows={3}
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                      />

                      <button
                        type="submit"
                        className={styles.feedbackSubmitBtn}
                        disabled={feedbackSubmitting || feedbackRating === 0}
                      >
                        {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
