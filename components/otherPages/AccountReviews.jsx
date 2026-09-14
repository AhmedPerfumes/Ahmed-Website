"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import he from "he";
import { useUser } from "@/context/UserContext";
import { useMenu } from "@/context/MenuContext";
import { useContextElement } from "@/context/Context";
import { openCart } from "@/utlis/openCart";
import { apiClient } from "@/lib/apiClient";
import styles from "./AccountReviews.module.css";

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const TRANSLATIONS = {
  en: {
    pageTitle: "My Reviews",
    subtitle: "Manage your fragrance reviews and track their approval status.",
    tabAll: "All Reviews",
    tabPublished: "Published",
    tabPending: "Pending Approval",
    orderRef: "Order",
    reviewedOn: "Reviewed on",
    statusPublished: "Published",
    statusPending: "Pending Approval",
    editReview: "Edit Review",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    saving: "Saving...",
    rateLabel: "Rate this perfume:",
    commentPlaceholder: "Update your thoughts on scent notes, longevity, and sillage...",
    emptyTitle: "No Reviews Yet",
    emptySubtitle: "You have not submitted any fragrance reviews in this category yet.",
    emptyAction: "View My Orders",
    buyAgain: "Buy Again",
    addedToCart: "Added to Bag ✓",
    outOfStock: "Out of Stock",
    pagePrev: "← Previous",
    pageNext: "Next →",
    pageOf: (current, total) => `Page ${current} of ${total}`,
    successUpdate: "Your review has been updated successfully and remains pending approval.",
    ratingLabels: {
      5: "Loved it! (5/5)",
      4: "Very Good (4/5)",
      3: "Average (3/5)",
      2: "Below Average (2/5)",
      1: "Poor (1/5)",
    },
    errorRating: "Please select a rating between 1 and 5 stars.",
    errorComment: "Please write a comment for your review.",
    errorGeneric: "An error occurred while updating your review. Please try again.",
  },
  ar: {
    pageTitle: "تقييماتي",
    subtitle: "إدارة ومتابعة تقييمات العطور التي قمت بمشاركتها وحالة اعتمادها.",
    tabAll: "جميع التقييمات",
    tabPublished: "التقييمات المعتمدة",
    tabPending: "قيد المراجعة",
    orderRef: "طلب رقم",
    reviewedOn: "تاريخ التقييم",
    statusPublished: "معتمد",
    statusPending: "قيد المراجعة",
    editReview: "تعديل التقييم",
    cancel: "إلغاء",
    saveChanges: "حفظ التعديلات",
    saving: "جاري الحفظ...",
    rateLabel: "قيّم هذا العطر:",
    commentPlaceholder: "حدّث رأيك الصادق حول نفحات العطر، الفوحان، والثبات...",
    emptyTitle: "لا توجد تقييمات بعد",
    emptySubtitle: "لم تقم بتقديم أي تقييمات في هذا القسم بعد.",
    emptyAction: "عرض مشترياتي",
    buyAgain: "شراء مرة أخرى",
    addedToCart: "تمت الإضافة للسلة ✓",
    outOfStock: "نفدت الكمية",
    pagePrev: "← السابق",
    pageNext: "التالي →",
    pageOf: (current, total) => `صفحة ${current} من ${total}`,
    successUpdate: "تم تحديث تقييمك بنجاح ولا يزال قيد المراجعة والاعتماد.",
    ratingLabels: {
      5: "ممتاز جداً (5/5)",
      4: "جيد جداً (4/5)",
      3: "متوسط (3/5)",
      2: "أقل من المتوسط (2/5)",
      1: "ضعيف (1/5)",
    },
    errorRating: "يرجى تحديد تقييم بالنجوم.",
    errorComment: "يرجى كتابة تعليق التقييم.",
    errorGeneric: "حدث خطأ أثناء تحديث التقييم. يرجى المحاولة لاحقاً.",
  },
};

export default function AccountReviews() {
  const locale = useLocale();
  const router = useRouter();
  const currentLang = locale === "ar" ? "ar" : "en";
  const t = TRANSLATIONS[currentLang];
  const { isLoggedIn, authLoading } = useUser();
  const { currency } = useMenu();
  const { addProductToCart } = useContextElement();

  const [reviews, setReviews] = useState([]);
  const [counts, setCounts] = useState({ all: 0, published: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [addedReviewId, setAddedReviewId] = useState(null);

  // Edit Drawer State
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [hoverEditRating, setHoverEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const handleBuyAgain = (review) => {
    if (!review.product_id || review.in_stock === false) return;

    const baseProduct = review.product || {};
    const primaryImage =
      baseProduct.image ||
      review.product_image ||
      (Array.isArray(baseProduct.images) ? baseProduct.images[0] : null) ||
      (typeof baseProduct.images === "string" ? (() => { try { return JSON.parse(baseProduct.images)[0]; } catch { return null; } })() : null);

    const productObj = {
      ...baseProduct,
      id: review.product_id,
      product_id: review.product_id,
      name: baseProduct.product_name || review.product_name,
      product_name: baseProduct.product_name || review.product_name,
      price: baseProduct.price || review.price || 0,
      sale_price: baseProduct.sale_price || review.sale_price || null,
      image: primaryImage,
      product_qty: baseProduct.product_qty || review.product_qty || 999,
      quantity: 1,
      category_name: baseProduct.category_name,
      subcategory_name: baseProduct.subcategory?.subcategory_name || baseProduct.subcategory,
    };

    addProductToCart(productObj);
    openCart();

    setAddedReviewId(review.id);
    setTimeout(() => {
      setAddedReviewId(null);
    }, 2000);
  };

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace(`/${locale}/login_register`);
    }
  }, [authLoading, isLoggedIn, router, locale]);

  // Fetch reviews from backend
  const fetchReviews = useCallback(async (tab, pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        pageSize: "4",
      });
      if (tab && tab !== "all") {
        params.append("status", tab);
      }

      const res = await apiClient(`api/customerReviews?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setReviews(json.data || []);
        if (json.counts) {
          setCounts(json.counts);
        }
        setPage(json.current_page || 1);
        setLastPage(json.last_page || 1);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchReviews(activeTab, page);
    }
  }, [isLoggedIn, activeTab, page, fetchReviews]);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
    setPage(1);
    setEditingId(null);
  };

  const toggleEditing = (review) => {
    if (editingId === review.id) {
      setEditingId(null);
      setEditError("");
      return;
    }
    setEditingId(review.id);
    setEditRating(review.star || 5);
    setHoverEditRating(0);
    setEditComment(review.comment || "");
    setEditError("");
  };

  const handleSaveEdit = async (e, reviewId) => {
    e.preventDefault();
    if (!editRating || editRating < 1 || editRating > 5) {
      setEditError(t.errorRating);
      return;
    }
    if (!editComment.trim()) {
      setEditError(t.errorComment);
      return;
    }

    setSaving(true);
    setEditError("");

    try {
      const res = await apiClient(`api/customerReviews/${reviewId}/update`, {
        method: "POST",
        body: JSON.stringify({
          star: editRating,
          comment: editComment.trim(),
        }),
      });

      const json = await res.json();

      if (res.ok && json.status === "success") {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? {
                ...r,
                star: editRating,
                comment: editComment.trim(),
                updated_at: new Date().toISOString(),
              }
              : r
          )
        );
        setEditingId(null);
        setSuccessToast(t.successUpdate);
        setTimeout(() => setSuccessToast(""), 5000);
      } else {
        setEditError(json.message || t.errorGeneric);
      }
    } catch (err) {
      setEditError(t.errorGeneric);
    } finally {
      setSaving(false);
    }
  };

  const getRatingDesc = (star) => {
    return t.ratingLabels[star] || "";
  };

  return (
    <div className={styles.container} dir={currentLang === "ar" ? "rtl" : "ltr"}>
      {/* Header Subtitle */}
      <div className={styles.headerRow}>
        <p className={styles.subTitle}>{t.subtitle}</p>
      </div>

      {/* Filter Tabs (Compact Pills) */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("all")}
        >
          <span>{t.tabAll}</span>
          <span className={styles.tabBadge}>{counts.all}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "published" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("published")}
        >
          <span>{t.tabPublished}</span>
          <span className={styles.tabBadge}>{counts.published}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "pending" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("pending")}
        >
          <span>{t.tabPending}</span>
          <span className={styles.tabBadge}>{counts.pending}</span>
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className={styles.toastSuccess}>
          <span>✓</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className="spinner-border text-dark" role="status" style={{ width: "2rem", height: "2rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>★</div>
          <h4 className={styles.emptyTitle}>{t.emptyTitle}</h4>
          <p className={styles.emptySubtitle}>{t.emptySubtitle}</p>
          <Link href={`/${currentLang}/account_orders`} className={styles.emptyActionBtn}>
            {t.emptyAction}
          </Link>
        </div>
      ) : (
        /* Reviews List (Compact Cards matching Thank You page) */
        <div className={styles.reviewsList}>
          {reviews.map((review) => {
            const isEditing = editingId === review.id;
            const isPending = review.status === "pending";
            const isPublished = review.status === "published";

            const displayName = currentLang === "ar" && review.product?.product_name_ar
              ? review.product.product_name_ar
              : (review.product?.product_name || review.product_name || "Fragrance");

            const rawImg = review.product?.images[0];
            const imgSrc = rawImg
              ? rawImg.startsWith("http")
                ? rawImg
                : `${IMG_BASE}storage/${rawImg.replace(/^\//, "")}`
              : "/no-img.png";

            const origPrice = Number(review.product?.price || review.price || 0);
            const discountFinal = review.product?.discount?.final_price
              ? Number(review.product.discount.final_price)
              : (review.product?.discount?.discount_type === "percent" && review.product?.discount?.value)
                ? origPrice - (origPrice * Number(review.product.discount.value)) / 100
                : null;
            const effectiveSale = discountFinal !== null ? discountFinal : (review.product?.sale_price ? Number(review.product.sale_price) : (review.sale_price ? Number(review.sale_price) : null));
            const hasDiscount = effectiveSale !== null && effectiveSale < origPrice;
            const productPrice = effectiveSale !== null ? effectiveSale : origPrice;

            const categoryName = review.product?.category_name;
            const subcategoryName = review.product?.subcategory?.subcategory_name;
            const permalinkKey = review.product?.permalink?.key;
            const productSlug = permalinkKey || (displayName ? displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "");
            const categorySlug = categoryName ? categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "";
            const subcategorySlug = subcategoryName ? subcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-") : categorySlug;
            const productHref = categorySlug && productSlug ? `/${locale}/shop/${categorySlug}/${subcategorySlug}/${productSlug}` : null;

            return (
              <div key={review.id} className={styles.productCard}>
                {/* Compact Product Header Row */}
                <div className={styles.productHeaderRow}>
                  <div className={styles.productInfoLeft}>
                    {productHref ? (
                      <Link href={productHref} className={styles.productThumbLink}>
                        <img
                          src={imgSrc}
                          alt={displayName ? he.decode(displayName) : "Product"}
                          className={styles.productThumb}
                          onError={(e) => {
                            e.currentTarget.src = "/no-img.png";
                          }}
                        />
                      </Link>
                    ) : (
                      <img
                        src={imgSrc}
                        alt={displayName ? he.decode(displayName) : "Product"}
                        className={styles.productThumb}
                        onError={(e) => {
                          e.currentTarget.src = "/no-img.png";
                        }}
                      />
                    )}
                    <div className={styles.productDetails}>
                      <h4 className={styles.productTitle}>
                        {productHref ? (
                          <Link href={productHref}>
                            {displayName ? he.decode(displayName) : "Fragrance"}
                          </Link>
                        ) : (
                          displayName ? he.decode(displayName) : "Fragrance"
                        )}
                      </h4>
                      <div className={styles.productMeta}>
                        {/* 5 Stars display */}
                        <span className={styles.starsRow}>
                          {[1, 2, 3, 4, 5].map((sVal) => (
                            <span
                              key={sVal}
                              className={sVal <= review.star ? "" : styles.starEmpty}
                            >
                              ★
                            </span>
                          ))}
                        </span>

                        {categoryName && (
                          <>
                            <span>·</span>
                            <span className={styles.categoryBadge}>
                              {categoryName}
                            </span>
                          </>
                        )}

                        {productPrice > 0 && (
                          <>
                            <span>·</span>
                            <span className={styles.priceBadge}>
                              {hasDiscount && (
                                <span style={{ textDecoration: "line-through", opacity: 0.5, marginInlineEnd: "6px" }}>
                                  {origPrice.toFixed(currency?.decimals ?? 2)}
                                </span>
                              )}
                              {productPrice.toFixed(currency?.decimals ?? 2)} {currency?.symbol || "AED"}
                            </span>
                          </>
                        )}

                        {review.order_code && (
                          <>
                            <span>·</span>
                            <span className={styles.orderBadge}>
                              {t.orderRef} {review.order_code}
                            </span>
                          </>
                        )}

                        {review.created_at && (
                          <>
                            <span>·</span>
                            <span>
                              {new Date(review.created_at).toLocaleDateString(
                                currentLang === "ar" ? "ar-AE" : "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Pill Badges */}
                  <div className={styles.productActions}>
                    <div className={styles.statusBadgeWrapper}>
                      {isPublished ? (
                        <span className={styles.reviewedBadge}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {t.statusPublished}
                        </span>
                      ) : (
                        <span className={styles.pendingBadge}>
                          <span>⏳</span>
                          <span>{t.statusPending}</span>
                        </span>
                      )}
                    </div>

                    <div className={`${styles.actionButtonsWrapper} ${review.can_edit ? styles.hasEditBtn : ""}`}>
                      {/* Buy Again Button */}
                      <button
                        type="button"
                        className={`${styles.buyAgainBtn} ${addedReviewId === review.id ? styles.buyAgainBtnAdded : ""
                          }`}
                        onClick={() => handleBuyAgain(review)}
                        disabled={review.in_stock === false}
                        title={review.in_stock === false ? t.outOfStock : t.buyAgain}
                      >
                        {addedReviewId === review.id ? (
                          <>
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{t.addedToCart}</span>
                          </>
                        ) : review.in_stock === false ? (
                          <span>{t.outOfStock}</span>
                        ) : (
                          <>
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                              <line x1="3" y1="6" x2="21" y2="6" />
                              <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <span>{t.buyAgain}</span>
                          </>
                        )}
                      </button>

                      {review.can_edit && (
                        <button
                          type="button"
                          className={`${styles.dropReviewBtn} ${isEditing ? styles.dropReviewBtnActive : ""
                            }`}
                          onClick={() => toggleEditing(review)}
                        >
                          <span>{isEditing ? t.cancel : t.editReview}</span>
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transform: isEditing ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.2s ease",
                            }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Comment Snippet (shown when drawer is closed) */}
                {!isEditing && review.comment && (
                  <div className={styles.commentRow}>
                    <span className={styles.commentQuoteIcon}>“</span>
                    <p className={styles.commentSnippet}>{review.comment}</p>
                  </div>
                )}

                {/* Inline Edit Drawer (Accordion matching Thank You page) */}
                {isEditing && (
                  <div className={`${styles.reviewDrawer} ${styles.reviewDrawerOpen}`}>
                    <div className={styles.drawerInner}>
                      <form onSubmit={(e) => handleSaveEdit(e, review.id)}>
                        <div className={styles.ratingRow}>
                          <div className={styles.ratingLabel}>
                            <span>{t.rateLabel}</span>
                            <span className={styles.ratingDescription}>
                              {getRatingDesc(hoverEditRating || editRating)}
                            </span>
                          </div>
                          <div className={styles.starGroup}>
                            {[1, 2, 3, 4, 5].map((starVal) => (
                              <button
                                key={starVal}
                                type="button"
                                className={`${styles.starBtn} ${starVal <= (hoverEditRating || editRating)
                                  ? styles.starActive
                                  : ""
                                  }`}
                                onClick={() => setEditRating(starVal)}
                                onMouseEnter={() => setHoverEditRating(starVal)}
                                onMouseLeave={() => setHoverEditRating(0)}
                                aria-label={`Rate ${starVal} of 5`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          className={styles.textareaField}
                          rows={3}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          placeholder={t.commentPlaceholder}
                          required
                        />

                        {editError && (
                          <div className={styles.errorMessage}>{editError}</div>
                        )}

                        <div className={styles.drawerFooter}>
                          <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => setEditingId(null)}
                          >
                            {t.cancel}
                          </button>
                          <button
                            type="submit"
                            className={styles.submitReviewBtn}
                            disabled={saving || !editComment.trim()}
                          >
                            {saving ? t.saving : t.saveChanges}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className={styles.paginationRow}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t.pagePrev}
              </button>
              <span className={styles.pageInfo}>{t.pageOf(page, lastPage)}</span>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page >= lastPage || loading}
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              >
                {t.pageNext}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
