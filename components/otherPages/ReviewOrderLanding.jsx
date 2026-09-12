"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import he from "he";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import { useMenu } from "@/context/MenuContext";
import Header14 from "../headers/Header14";
import Footer14 from "../footers/Footer14";
import MobileFooter2 from "../footers/MobileFooter2";
import styles from "./ReviewOrderLanding.module.css";

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const TRANSLATIONS = {
  en: {
    heroTitle: "Share Your Fragrance Experience",
    heroSubtitle: "We would love to hear your feedback on your fragrance purchase.",
    verifyingOrder: "Verifying Order",
    validatingLink: "Validating your secure review link...",
    incompleteLink: "This review invitation link is incomplete or missing security credentials.",
    invalidLink: "Invalid, tampered, or expired review link.",
    networkError: "Unable to verify review credentials. Please try again later.",
    unableToAccess: "Unable to Access Review",
    returnHome: "Return to Home",
    orderNumber: "Order Number",
    order: "Order",
    reviewingAs: "Reviewing As",
    datePlaced: "Date Placed",
    orderStatus: "Order Status",
    reviewProgress: "Review Progress",
    progressFormat: (reviewed, total) => `${reviewed} of ${total} reviewed`,
    allItemsReviewed: "All Fragrances Reviewed",
    allItemsReviewedSub: "Thank you! You have submitted reviews for all fragrances in this order.",
    purchasedFragrances: "Purchased Fragrances",
    quantity: "Qty",
    reviewProduct: "★ Drop a Review",
    cancel: "Cancel",
    reviewed: "Review Submitted",
    rateThisProduct: "Rate this perfume:",
    rewardTitle: "Verified Review Reward",
    rewardDesc: "Leave your feedback to receive an exclusive discount coupon for your next fragrance order!",
    ratingLabels: {
      5: "Loved it! (5/5)",
      4: "Very Good (4/5)",
      3: "Average (3/5)",
      2: "Below Average (2/5)",
      1: "Poor (1/5)",
    },
    reviewPlaceholder: "What did you think of the scent notes, longevity, and sillage? Share your honest experience...",
    selectRatingError: "Please select a rating.",
    writeCommentError: "Please write a brief comment about this fragrance.",
    submitting: "Submitting...",
    submitReview: "Submit Review",
    submitSuccess: "Your product review has been submitted for approval. Thank you!",
    submitErrorFallback: "Failed to submit review. Please try again.",
    submitErrorGeneral: "An error occurred while submitting your review.",
    statusDelivered: "Delivered",
    statusCompleted: "Completed",
    copied: "✓ Copied",
    copyCode: "Copy Order Code",
    // Overall Experience Review Form
    experienceTitle: "Rate Your Experience",
    experienceSubtitle: "How was your overall shopping, packaging, and delivery experience today?",
    experiencePlaceholder: "Tell us about delivery speed, fragrance packaging, or customer service...",
    submitFeedback: "Submit Feedback",
    feedbackSuccessAlert: "✓ Thank you! Your overall experience feedback has been submitted. We appreciate your insights!",
    continueShopping: "← Continue Shopping",
  },
  ar: {
    heroTitle: "شاركنا تجربتك في تقييم العطور",
    heroSubtitle: "يسعدنا معرفة رأيك وتقييمك للعطور التي استلمتها.",
    verifyingOrder: "جاري التحقق من الطلب",
    validatingLink: "جاري التحقق من أمان رابط التقييم الخاص بك...",
    incompleteLink: "رابط دعوة التقييم غير مكتمل أو تنقصه بيانات التحقق الأمنية.",
    invalidLink: "رابط التقييم غير صالح أو منتهي الصلاحية أو تم تعديله.",
    networkError: "تعذر التحقق من بيانات التقييم. يرجى المحاولة مرة أخرى لاحقاً.",
    unableToAccess: "تعذر الوصول إلى صفحة التقييم",
    returnHome: "العودة إلى الرئيسية",
    orderNumber: "رقم الطلب",
    order: "طلب رقم",
    reviewingAs: "التقييم باسم",
    datePlaced: "تاريخ الطلب",
    orderStatus: "حالة الطلب",
    reviewProgress: "مستوى التقييم",
    progressFormat: (reviewed, total) => `تم تقييم ${reviewed} من أصل ${total}`,
    allItemsReviewed: "تم تقييم جميع المنتجات",
    allItemsReviewedSub: "شكراً لك! لقد قمت بتقييم جميع العطور في هذا الطلب.",
    purchasedFragrances: "العطور المشتراة",
    quantity: "الكمية",
    reviewProduct: "★ قيّم المنتج",
    cancel: "إلغاء",
    reviewed: "تم التقييم بنجاح",
    rateThisProduct: "قيّم هذا العطر:",
    rewardTitle: "مكافأة التقييم الموثّق",
    rewardDesc: "شاركنا تقييمك لتحصل على كوبون خصم حصري لطلبك القادم فور اعتماد التقييم!",
    ratingLabels: {
      5: "ممتاز جداً (5/5)",
      4: "جيد جداً (4/5)",
      3: "متوسط (3/5)",
      2: "أقل من المتوسط (2/5)",
      1: "ضعيف (1/5)",
    },
    reviewPlaceholder: "ما رأيك في نفحات العطر، الفوحان، والثبات؟ شاركنا تجربتك بكل صدق...",
    selectRatingError: "يرجى تحديد تقييم بالنجوم.",
    writeCommentError: "يرجى كتابة تعليق موجز حول هذا العطر.",
    submitting: "جاري الإرسال...",
    submitReview: "إرسال التقييم",
    submitSuccess: "تم إرسال تقييمك بنجاح للمراجعة. شكراً لمشاركتنا رأيك القيّم.",
    submitErrorFallback: "فشل إرسال التقييم. يرجى المحاولة مرة أخرى.",
    submitErrorGeneral: "حدث خطأ أثناء إرسال التقييم. يرجى المحاولة لاحقاً.",
    statusDelivered: "تم التوصيل",
    statusCompleted: "مكتمل",
    copied: "✓ تم النسخ",
    copyCode: "نسخ رقم الطلب",
    // Overall Experience Review Form
    experienceTitle: "قيّم تجربتك",
    experienceSubtitle: "كيف كانت تجربتك العامة في الطلب والتغليف والتوصيل اليوم؟",
    experiencePlaceholder: "شاركنا رأيك حول سرعة التوصيل، تغليف العطور، أو خدمة العملاء...",
    submitFeedback: "إرسال التقييم",
    feedbackSuccessAlert: "✓ شكراً لك! تم إرسال تقييمك العام بنجاح. نحن نقدر ملاحظاتك القيّمة!",
    continueShopping: "← متابعة التسوق",
  },
};

export default function ReviewOrderLanding() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const s = searchParams.get("s");
  const locale = useLocale();
  const currentLang = locale === "ar" ? "ar" : "en";
  const t = TRANSLATIONS[currentLang];
  const tt = useTranslations();
  const { currency } = useMenu() || {};

  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const [customErrorMessage, setCustomErrorMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);
  const [copied, setCopied] = useState(false);

  // Per-Product Review Drawer States (matching OrderThankYouSection maps)
  const [activeReviewProductId, setActiveReviewProductId] = useState(null);
  const [ratingMap, setRatingMap] = useState({});
  const [hoverRatingMap, setHoverRatingMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [submittingMap, setSubmittingMap] = useState({});
  const [reviewErrorMap, setReviewErrorMap] = useState({});
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

  // Overall Website / Experience Feedback States
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [hoverFeedbackRating, setHoverFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    if (!q || !s) {
      setErrorCode("incomplete");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      setLoading(true);
      setErrorCode(null);
      setCustomErrorMessage("");
      try {
        const resp = await apiClient(`api/orderReviewDetails?q=${encodeURIComponent(q)}&s=${encodeURIComponent(s)}`, {
          method: "GET",
        });

        const data = await resp.json();

        if (resp.ok && data.status === "success") {
          setOrderDetails(data);
          setReviewedProductIds(data.reviewed_product_ids || []);
        } else {
          if (data.message) {
            setCustomErrorMessage(data.message);
            setErrorCode("custom");
          } else {
            setErrorCode("invalid");
          }
        }
      } catch (err) {
        setErrorCode("network");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [q, s]);

  const toggleReviewDrawer = (productId) => {
    setActiveReviewProductId((prev) => (prev === productId ? null : productId));
    if (!ratingMap[productId]) {
      setRatingMap((prev) => ({ ...prev, [productId]: 5 }));
    }
  };

  const getRatingDescription = (star) => {
    return t.ratingLabels[star] || "";
  };

  // Copy order code to clipboard
  const handleCopyCode = () => {
    const code = orderDetails?.order_code || orderDetails?.order_id;
    if (!code) return;
    navigator.clipboard.writeText(code.toString().replace(/^#/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Product Review
  const handleProductReviewSubmit = async (e, productId) => {
    e.preventDefault();
    const star = ratingMap[productId] || 5;
    const comment = (commentMap[productId] || "").trim();

    if (!star || star < 1 || star > 5) {
      setReviewErrorMap((prev) => ({ ...prev, [productId]: t.selectRatingError }));
      return;
    }
    if (!comment) {
      setReviewErrorMap((prev) => ({ ...prev, [productId]: t.writeCommentError }));
      return;
    }

    setSubmittingMap((prev) => ({ ...prev, [productId]: true }));
    setReviewErrorMap((prev) => ({ ...prev, [productId]: "" }));

    try {
      const resp = await apiClient("api/reviews", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          order_id: orderDetails?.order_id,
          star,
          comment,
          customer_name: orderDetails?.customer_name || "Valued Customer",
          customer_email: orderDetails?.customer_email || "",
          customer_phone: orderDetails?.customer_phone || "",
        }),
      });

      const json = await resp.json();

      if (resp.ok) {
        setReviewedProductIds((prev) => [...new Set([...prev, Number(productId)])]);
        setActiveReviewProductId(null);
        setCommentMap((prev) => ({ ...prev, [productId]: "" }));
        setReviewSuccessMessage(t.submitSuccess);
        setTimeout(() => setReviewSuccessMessage(""), 6000);
      } else {
        setReviewErrorMap((prev) => ({
          ...prev,
          [productId]: json.message || t.submitErrorFallback,
        }));
      }
    } catch (err) {
      setReviewErrorMap((prev) => ({
        ...prev,
        [productId]: t.submitErrorGeneral,
      }));
    } finally {
      setSubmittingMap((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Submit Overall Website / Experience Feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackRating || feedbackRating === 0) {
      setFeedbackError(t.selectRatingError);
      return;
    }

    setFeedbackSubmitting(true);
    setFeedbackError("");

    try {
      const resp = await apiClient("api/submitReview", {
        method: "POST",
        body: JSON.stringify({
          order_id: orderDetails?.order_id,
          customer_name: orderDetails?.customer_name || "Valued Customer",
          star: feedbackRating,
          comment: feedbackComment.trim(),
        }),
      });

      if (resp.ok) {
        setFeedbackSubmitted(true);
      } else {
        const json = await resp.json();
        setFeedbackError(json.message || t.submitErrorFallback);
      }
    } catch (err) {
      setFeedbackError(t.submitErrorGeneral);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const totalProducts = orderDetails?.products?.length || 0;
  const reviewedCount = (orderDetails?.products || []).filter((p) =>
    reviewedProductIds.includes(Number(p.product_id))
  ).length;
  const unreviewedCount = totalProducts - reviewedCount;
  const progressPercent = totalProducts > 0 ? Math.round((reviewedCount / totalProducts) * 100) : 0;

  const formattedOrderCode = orderDetails?.order_code
    ? orderDetails.order_code.startsWith("#")
      ? orderDetails.order_code
      : `#${orderDetails.order_code}`
    : "";

  const statusStr = typeof orderDetails?.order_status === "object"
    ? (orderDetails.order_status?.label || orderDetails.order_status?.value || "")
    : (orderDetails?.order_status || "");

  const rawStatus = statusStr.trim() || "Delivered";

  let displayStatus = rawStatus;
  if (rawStatus.toLowerCase() === "delivered") {
    displayStatus = t.statusDelivered;
  } else if (rawStatus.toLowerCase() === "completed") {
    displayStatus = t.statusCompleted;
  }

  const displayedError = errorCode === "incomplete"
    ? t.incompleteLink
    : errorCode === "invalid"
      ? t.invalidLink
      : errorCode === "network"
        ? t.networkError
        : customErrorMessage;

  return (
    <div>
      <Header14 />

      <main className={styles.pageContainer} dir={currentLang === "ar" ? "rtl" : "ltr"}>
        <div className={styles.contentWrapper}>

          {/* Loading State */}
          {loading && (
            <div className={styles.stateCard}>
              <h2 className={styles.stateHeading}>{t.verifyingOrder}</h2>
              <p className={styles.stateSub}>{t.validatingLink}</p>
            </div>
          )}

          {/* Error State */}
          {!loading && displayedError && (
            <div className={styles.stateCard}>
              <h2 className={styles.stateHeading}>{t.unableToAccess}</h2>
              <p className={styles.stateSub}>{displayedError}</p>
              <Link href={`/${currentLang}`} className={styles.btnReturnHome}>
                {t.returnHome}
              </Link>
            </div>
          )}

          {/* Success Toast */}
          {reviewSuccessMessage && (
            <div className={styles.successToast}>
              {reviewSuccessMessage}
            </div>
          )}

          {/* Active Order Content: Shop Checkout Complete Style */}
          {!loading && !displayedError && orderDetails && (
            <>
              {/* Top Docked Header Bar (matching OrderThankYou heroDocked) */}
              <div className={styles.heroDocked}>
                <div className={styles.heroDockedLeft}>
                  <div className={styles.tickIconSmall}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className={styles.dockedTitle}>
                      {t.heroTitle}
                    </h2>
                    <p className={styles.dockedSubtitle}>
                      {t.heroSubtitle}
                    </p>
                  </div>
                </div>

                <div className={styles.orderCodePill}>
                  <span>{t.order} {formattedOrderCode}</span>
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={handleCopyCode}
                    title={t.copyCode}
                  >
                    {copied ? t.copied : "📋"}
                  </button>
                </div>
              </div>

              {/* Main 70-30 Grid Layout */}
              <div className={styles.mainGridLayout}>

                {/* 70% Left Column: Unified Order Card & Product Reviews */}
                <div className={styles.orderColumn}>

                  {/* Unified Order Card (matching OrderThankYou orderCard) */}
                  <div className={styles.orderCard}>

                    {/* Metadata Grid (4 Columns) */}
                    <div className={styles.metaGrid}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t.orderNumber}</span>
                        <span className={styles.metaValue}>{formattedOrderCode}</span>
                      </div>

                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t.datePlaced}</span>
                        <span className={styles.metaValue}>
                          {orderDetails.created_at
                            ? new Date(orderDetails.created_at).toLocaleDateString(currentLang === "ar" ? "ar-AE" : "en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                            : "-"}
                        </span>
                      </div>

                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t.reviewingAs}</span>
                        <span className={styles.metaValue}>
                          {orderDetails.customer_name || "Valued Customer"}
                        </span>
                      </div>

                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t.orderStatus}</span>
                        <div>
                          <span className={styles.badgeSuccess}>
                            ✓ {displayStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Purchased Products Section with Inline Review Drawer */}
                    <div className={styles.productsSection}>
                      <div className={styles.sectionHeaderRow}>
                        <h3 className={styles.sectionHeading}>{t.purchasedFragrances}</h3>
                        {totalProducts > 1 && (
                          <span className={styles.progressCounter}>
                            {t.progressFormat(reviewedCount, totalProducts)}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar for multiple products */}
                      {totalProducts > 1 && (
                        <div className={styles.progressBarWrapper}>
                          <div className={styles.progressBarTrack}>
                            <div
                              className={styles.progressBarFill}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* All Items Reviewed Callout */}
                      {unreviewedCount === 0 && (
                        <div className={styles.completeBanner}>
                          <h4 className={styles.completeHeading}>{t.allItemsReviewed}</h4>
                          <p className={styles.completeSub}>{t.allItemsReviewedSub}</p>
                        </div>
                      )}

                      {/* Product Review Cards List */}
                      <div className={styles.productList}>
                        {(orderDetails.products || []).map((item, idx) => {
                          const productId = item.product_id;
                          const isReviewed = productId && reviewedProductIds.includes(Number(productId));
                          const isOpen = activeReviewProductId === productId;
                          const rating = ratingMap[productId] || 5;
                          const hoverRating = hoverRatingMap[productId] || 0;
                          const isSubmitting = Boolean(submittingMap[productId]);
                          const itemError = reviewErrorMap[productId] || "";

                          const imgSrc = item.product_image
                            ? item.product_image.startsWith("http")
                              ? item.product_image
                              : `${IMG_BASE}storage/${item.product_image.replace(/^\//, "")}`
                            : "/no-img.png";

                          return (
                            <div key={productId || idx} className={styles.productCard}>
                              {/* Product Header Row */}
                              <div className={styles.productHeaderRow}>
                                <div className={styles.productInfoLeft}>
                                  <img
                                    src={imgSrc}
                                    alt={item.product_name ? he.decode(item.product_name) : "Product"}
                                    className={styles.productThumb}
                                    onError={(e) => {
                                      e.currentTarget.src = "/no-img.png";
                                    }}
                                  />
                                  <div className={styles.productDetails}>
                                    <h4 className={styles.productTitle}>
                                      {tt(he.decode(item.product_name || ""))}
                                    </h4>
                                    <div className={styles.productMeta}>
                                      <span>{t.quantity}: {item.qty || 1}</span>
                                      {item.price && (
                                        <>
                                          <span>·</span>
                                          <span className={styles.productPrice}>
                                            {parseFloat(item.price).toFixed(2)} {currency?.symbol || "AED"}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className={styles.productActions}>
                                  {isReviewed ? (
                                    <span className={styles.reviewedBadge}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                      {t.reviewed}
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => toggleReviewDrawer(productId)}
                                      className={`${styles.dropReviewBtn} ${isOpen ? styles.dropReviewBtnActive : ""}`}
                                    >
                                      <span>{isOpen ? t.cancel : t.reviewProduct}</span>
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
                                  className={`${styles.reviewDrawer} ${
                                    isOpen ? styles.reviewDrawerOpen : ""
                                  }`}
                                >
                                  <div className={styles.drawerInner}>
                                    <div className={styles.rewardNotice}>
                                      <span>🎁</span>
                                      <span>
                                        <strong>{t.rewardTitle}:</strong> {t.rewardDesc}
                                      </span>
                                    </div>

                                    <form onSubmit={(e) => handleProductReviewSubmit(e, productId)}>
                                      <div className={styles.ratingRow}>
                                        <div className={styles.ratingLabel}>
                                          <span>{t.rateThisProduct}</span>
                                          <span className={styles.ratingDescription}>
                                            {getRatingDescription(hoverRating || rating)}
                                          </span>
                                        </div>
                                        <div className={styles.starGroup}>
                                          {[1, 2, 3, 4, 5].map((starVal) => (
                                            <button
                                              key={starVal}
                                              type="button"
                                              className={`${styles.starBtn} ${
                                                starVal <= (hoverRating || rating)
                                                  ? styles.starActive
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                setRatingMap((prev) => ({
                                                  ...prev,
                                                  [productId]: starVal,
                                                }))
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
                                              aria-label={`Rate ${starVal} of 5`}
                                            >
                                              ★
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <textarea
                                        className={styles.textareaField}
                                        placeholder={t.reviewPlaceholder}
                                        value={commentMap[productId] || ""}
                                        onChange={(e) =>
                                          setCommentMap((prev) => ({
                                            ...prev,
                                            [productId]: e.target.value,
                                          }))
                                        }
                                        rows={3}
                                        required
                                      />

                                      {itemError && (
                                        <div className={styles.errorMessage}>
                                          {itemError}
                                        </div>
                                      )}

                                      <div className={styles.drawerFooter}>
                                        <button
                                          type="button"
                                          className={styles.cancelBtn}
                                          onClick={() => setActiveReviewProductId(null)}
                                        >
                                          {t.cancel}
                                        </button>
                                        <button
                                          type="submit"
                                          className={styles.submitReviewBtn}
                                          disabled={
                                            isSubmitting ||
                                            !(commentMap[productId] || "").trim()
                                          }
                                        >
                                          {isSubmitting ? t.submitting : t.submitReview}
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
                  </div>

                  {/* Bottom Action Row (Under Order Card in 70% column) */}
                  <div className={styles.actionRow}>
                    <Link href={`/${currentLang}`} className={styles.continueShoppingBtn}>
                      {t.continueShopping}
                    </Link>
                  </div>
                </div>

                {/* 30% Right Column: Sticky Rate Your Website Experience Card */}
                <div className={styles.sidebarColumn}>
                  <div className={styles.feedbackCardSticky}>
                    <div className={styles.feedbackHeader}>
                      <h3 className={styles.feedbackTitle}>{t.experienceTitle}</h3>
                      <p className={styles.feedbackSubtitle}>
                        {t.experienceSubtitle}
                      </p>
                    </div>

                    {feedbackSubmitted ? (
                      <div className={styles.feedbackSuccessAlert}>
                        {t.feedbackSuccessAlert}
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className={styles.feedbackFormWrapper}>
                        <div className={styles.feedbackStarRow}>
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              key={starVal}
                              type="button"
                              className={`${styles.feedbackStar} ${
                                starVal <= (hoverFeedbackRating || feedbackRating)
                                  ? styles.feedbackStarActive
                                  : ""
                              }`}
                              onClick={() => setFeedbackRating(starVal)}
                              onMouseEnter={() => setHoverFeedbackRating(starVal)}
                              onMouseLeave={() => setHoverFeedbackRating(0)}
                              aria-label={`Rate ${starVal} of 5`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        {feedbackRating > 0 && (
                          <div className={styles.feedbackRatingLabel}>
                            {getRatingDescription(hoverFeedbackRating || feedbackRating)}
                          </div>
                        )}

                        <textarea
                          className={styles.feedbackTextarea}
                          placeholder={t.experiencePlaceholder}
                          rows={3}
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                        />

                        {feedbackError && (
                          <div className={styles.errorMessage}>{feedbackError}</div>
                        )}

                        <button
                          type="submit"
                          className={styles.feedbackSubmitBtn}
                          disabled={feedbackSubmitting || feedbackRating === 0}
                        >
                          {feedbackSubmitting ? t.submitting : t.submitFeedback}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </main>

      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5">
        <div className="MobileFooter">
          <MobileFooter2 />
        </div>
      </section>
    </div>
  );
}

