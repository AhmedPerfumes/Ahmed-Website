"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import he from "he";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import Header14 from "../headers/Header14";
import Footer14 from "../footers/Footer14";
import MobileFooter2 from "../footers/MobileFooter2";
import styles from "./ReviewOrderLanding.module.css";

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const TRANSLATIONS = {
  en: {
    eyebrow: "Verified Purchase Experience",
    mainHeading: "Share Your Experience",
    subHeading: "Your honest feedback helps perfume connoisseurs discover their signature scent and helps us continually refine our art.",
    verifyingOrder: "Verifying Order",
    validatingLink: "Validating your secure review link...",
    incompleteLink: "This review invitation link is incomplete or missing security credentials.",
    invalidLink: "Invalid, tampered, or expired review link.",
    networkError: "Unable to verify review credentials. Please try again later.",
    unableToAccess: "Unable to Access Review",
    returnHome: "Return to Home",
    orderReference: "Order Reference",
    order: "Order",
    reviewingAs: "Reviewing as",
    placedOn: "Placed on",
    reviewProgress: "Review Progress",
    progressFormat: (reviewed, total) => `${reviewed} of ${total} reviewed`,
    allItemsReviewed: "All Items Reviewed",
    allItemsReviewedSub: "Thank you! You have reviewed all products in this order.",
    quantity: "Quantity",
    reviewProduct: "Review Product",
    cancel: "Cancel",
    reviewed: "Reviewed",
    rateThisProduct: "Rate this product",
    ratingLabels: {
      5: "Excellent (5/5)",
      4: "Very Good (4/5)",
      3: "Average (3/5)",
      2: "Below Average (2/5)",
      1: "Poor (1/5)",
    },
    reviewPlaceholder: "Share your experience regarding fragrance notes, sillage, longevity, and quality...",
    selectRatingError: "Please select a rating.",
    writeCommentError: "Please write a review comment.",
    submitting: "Submitting...",
    submitReview: "Submit Review",
    submitSuccess: "Your review has been submitted for approval. Thank you for your feedback.",
    submitErrorFallback: "Failed to submit review. Please try again.",
    submitErrorGeneral: "An error occurred while submitting your review.",
    statusDelivered: "Delivered",
    statusCompleted: "Completed",
  },
  ar: {
    eyebrow: "تجربة شراء موثّقة",
    mainHeading: "شاركنا تجربتك",
    subHeading: "تقييمك الصادق يساعد عشاق العطور في اكتشاف عطرهم المميز ويساعدنا على تطوير إبداعاتنا باستمرار.",
    verifyingOrder: "جاري التحقق من الطلب",
    validatingLink: "جاري التحقق من أمان رابط التقييم الخاص بك...",
    incompleteLink: "رابط دعوة التقييم غير مكتمل أو تنقصه بيانات التحقق الأمنية.",
    invalidLink: "رابط التقييم غير صالح أو منتهي الصلاحية أو تم تعديله.",
    networkError: "تعذر التحقق من بيانات التقييم. يرجى المحاولة مرة أخرى لاحقاً.",
    unableToAccess: "تعذر الوصول إلى صفحة التقييم",
    returnHome: "العودة إلى الرئيسية",
    orderReference: "مرجع الطلب",
    order: "طلب رقم",
    reviewingAs: "التقييم باسم",
    placedOn: "تاريخ الطلب",
    reviewProgress: "مستوى التقييم",
    progressFormat: (reviewed, total) => `تم تقييم ${reviewed} من أصل ${total}`,
    allItemsReviewed: "تم تقييم جميع المنتجات",
    allItemsReviewedSub: "شكراً لك! لقد قمت بتقييم جميع المنتجات في هذا الطلب.",
    quantity: "الكمية",
    reviewProduct: "تقييم المنتج",
    cancel: "إلغاء",
    reviewed: "تم التقييم",
    rateThisProduct: "قيّم هذا المنتج",
    ratingLabels: {
      5: "ممتاز (5/5)",
      4: "جيد جداً (4/5)",
      3: "متوسط (3/5)",
      2: "أقل من المتوسط (2/5)",
      1: "ضعيف (1/5)",
    },
    reviewPlaceholder: "شاركنا تجربتك حول نفحات العطر، الفوحان، الثبات، والجودة...",
    selectRatingError: "يرجى تحديد تقييم بالنجوم.",
    writeCommentError: "يرجى كتابة تعليق التقييم.",
    submitting: "جاري الإرسال...",
    submitReview: "إرسال التقييم",
    submitSuccess: "تم إرسال تقييمك بنجاح للمراجعة. شكراً لمشاركتنا رأيك القيّم.",
    submitErrorFallback: "فشل إرسال التقييم. يرجى المحاولة مرة أخرى.",
    submitErrorGeneral: "حدث خطأ أثناء إرسال التقييم. يرجى المحاولة لاحقاً.",
    statusDelivered: "تم التوصيل",
    statusCompleted: "مكتمل",
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

  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const [customErrorMessage, setCustomErrorMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);

  // Active review drawer state
  const [activeReviewProductId, setActiveReviewProductId] = useState(null);
  const [currentRating, setCurrentRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

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
    if (activeReviewProductId === productId) {
      setActiveReviewProductId(null);
      setReviewComment("");
      setReviewError("");
    } else {
      setActiveReviewProductId(productId);
      setReviewComment("");
      setReviewError("");
      setCurrentRating(5);
      setHoveredRating(0);
    }
  };

  const getRatingLabel = (star) => {
    return t.ratingLabels[star] || "";
  };

  const handleReviewSubmit = async (productId) => {
    if (!currentRating || currentRating < 1 || currentRating > 5) {
      setReviewError(t.selectRatingError);
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError(t.writeCommentError);
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      const resp = await apiClient("api/reviews", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          order_id: orderDetails?.order_id,
          star: currentRating,
          comment: reviewComment.trim(),
          customer_name: orderDetails?.customer_name || "Valued Customer",
          customer_email: orderDetails?.customer_email || "",
          customer_phone: orderDetails?.customer_phone || "",
        }),
      });

      const json = await resp.json();

      if (resp.ok) {
        setReviewedProductIds((prev) => [...new Set([...prev, Number(productId)])]);
        setActiveReviewProductId(null);
        setReviewComment("");
        setReviewSuccessMessage(t.submitSuccess);
        setTimeout(() => setReviewSuccessMessage(""), 6000);
      } else {
        setReviewError(json.message || t.submitErrorFallback);
      }
    } catch (err) {
      setReviewError(t.submitErrorGeneral);
    } finally {
      setSubmittingReview(false);
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

  const rawStatus = typeof orderDetails?.order_status === "object"
    ? orderDetails.order_status?.label || orderDetails.order_status?.value || "Delivered"
    : orderDetails?.order_status || "Delivered";

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

          {/* Luxury Header */}
          <div className={styles.headerBlock}>
            <span className={styles.eyebrow}>
              {t.eyebrow}
            </span>
            <h1 className={styles.mainHeading}>
              {t.mainHeading}
            </h1>
            <p className={styles.subHeading}>
              {t.subHeading}
            </p>
          </div>

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

          {/* Order Content */}
          {!loading && !displayedError && orderDetails && (
            <div>
              {/* Order Meta Card */}
              <div className={styles.orderMetaCard}>
                <div className={styles.orderMetaTop}>
                  <div>
                    <div className={styles.orderLabel}>{t.orderReference}</div>
                    <h3 className={styles.orderNumber}>
                      {t.order} {formattedOrderCode}
                    </h3>
                  </div>

                  <div className={styles.statusPill}>
                    <span className={styles.statusDot} />
                    <span>{displayStatus}</span>
                  </div>
                </div>

                <div className={styles.orderMetaBottom}>
                  {orderDetails.customer_name && (
                    <div className={styles.customerTag}>
                      {t.reviewingAs} <strong>{orderDetails.customer_name}</strong>
                    </div>
                  )}
                  {orderDetails.created_at && (
                    <div>
                      {t.placedOn}{" "}
                      {new Date(orderDetails.created_at).toLocaleDateString(currentLang === "ar" ? "ar-AE" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </div>

                {/* Progress Indicator */}
                {totalProducts > 1 && (
                  <div className={styles.progressContainer}>
                    <div className={styles.progressLabelRow}>
                      <span>{t.reviewProgress}</span>
                      <span>{t.progressFormat(reviewedCount, totalProducts)}</span>
                    </div>
                    <div className={styles.progressBarTrack}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* All Items Completed Notice */}
              {unreviewedCount === 0 && (
                <div className={styles.completeBanner}>
                  <h4 className={styles.completeHeading}>{t.allItemsReviewed}</h4>
                  <p className={styles.completeSub}>
                    {t.allItemsReviewedSub}
                  </p>
                </div>
              )}

              {/* Product Review List */}
              <div className={styles.productList}>
                {(orderDetails.products || []).map((item, idx) => {
                  const isReviewed = item.product_id && reviewedProductIds.includes(Number(item.product_id));
                  const isDrawerOpen = activeReviewProductId === item.product_id;

                  const imgSrc = item.product_image
                    ? item.product_image.startsWith("http")
                      ? item.product_image
                      : `${IMG_BASE}storage/${item.product_image.replace(/^\//, "")}`
                    : "/no-img.png";

                  return (
                    <div key={idx} className={styles.productCard}>
                      <div className={styles.productHeaderRow}>
                        <div className={styles.productLeft}>
                          <div className={styles.thumbnailWrapper}>
                            <img
                              src={imgSrc}
                              alt=""
                              className={styles.productThumb}
                            />
                          </div>
                          <div className={styles.productDetails}>
                            <h4 className={styles.productTitle}>
                              {tt(he.decode(item.product_name || ""))}
                            </h4>
                            <div className={styles.productQty}>
                              {t.quantity}: {item.qty}
                            </div>
                          </div>
                        </div>

                        <div className={styles.productRight}>
                          {isReviewed ? (
                            <span className={styles.badgeReviewed}>
                              {t.reviewed}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleReviewDrawer(item.product_id)}
                              className={isDrawerOpen ? styles.btnCancelToggle : styles.btnReview}
                            >
                              {isDrawerOpen ? t.cancel : t.reviewProduct}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Smooth Accordion Drawer */}
                      {isDrawerOpen && (
                        <div className={styles.drawerWrapper}>
                          <div className={styles.drawerRatingRow}>
                            <span className={styles.rateHeaderTitle}>
                              {t.rateThisProduct}
                            </span>
                            <span className={styles.ratingLabelText}>
                              {getRatingLabel(hoveredRating || currentRating)}
                            </span>
                            <div className={styles.starsContainer}>
                              {[1, 2, 3, 4, 5].map((star) => {
                                const isActive = star <= (hoveredRating || currentRating);
                                return (
                                  <button
                                    key={star}
                                    type="button"
                                    className={styles.starBtn}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setCurrentRating(star)}
                                    aria-label={`Rate ${star} of 5`}
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      className={styles.starSvg}
                                      fill={isActive ? "#111827" : "none"}
                                      stroke={isActive ? "#111827" : "#D1D5DB"}
                                      strokeWidth="1.5"
                                    >
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <textarea
                            className={styles.reviewTextarea}
                            placeholder={t.reviewPlaceholder}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={3}
                          />

                          {reviewError && (
                            <div className={styles.errorMessage}>
                              {reviewError}
                            </div>
                          )}

                          <div className={styles.drawerActions}>
                            <button
                              type="button"
                              onClick={() => handleReviewSubmit(item.product_id)}
                              disabled={submittingReview}
                              className={styles.btnDrawerSubmit}
                            >
                              {submittingReview ? t.submitting : t.submitReview}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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
