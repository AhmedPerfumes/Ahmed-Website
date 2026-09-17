"use client";

import React, { useState, useEffect, useCallback } from "react";
import he from "he";
import { useLocale } from "next-intl";
import { useMenu } from "@/context/MenuContext";
import { apiClient } from "@/lib/apiClient";
import styles from "./AccountOrders.module.css";

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const TRANSLATIONS = {
  en: {
    tabAll: "All Orders",
    tabProcessing: "Processing",
    tabShipped: "Shipped",
    tabDelivered: "Delivered",
    tabCancelled: "Cancelled",
    order: "Order",
    placedOn: "Placed on",
    totalAmount: "Total Amount",
    orderDetails: "View Details",
    moreItems: "+{count} more",
    noOrders: "No Orders Found",
    noOrdersSub: "You have not placed any orders in this category yet.",
    pageInfo: "Page {current} of {total}",
    prevBtn: "← Previous",
    nextBtn: "Next →",
    modalTitle: "Order Details",
    orderNumber: "Order Number",
    datePlaced: "Date Placed",
    paymentMethod: "Payment Method",
    orderStatus: "Order Status",
    purchasedTitle: "Purchased Fragrances",
    reviewProduct: "Review Product",
    reviewed: "Reviewed",
    rateTitle: "Rate this product",
    ratePlaceholder: "Share your experience regarding fragrance, longevity, and quality...",
    cancel: "Cancel",
    submitReview: "Submit Review",
    submitting: "Submitting…",
    reviewSuccess: "Your review has been submitted for approval. Thank you for your feedback!",
    orderSummaryTitle: "Order Summary",
    subtotal: "SUBTOTAL",
    shipping: "SHIPPING",
    freeShipping: "You Got Free Shipping",
    shippingCost: "Shipping Cost: {amount}",
    serviceFee: "SERVICE FEE",
    codCharges: "COD CHARGES",
    discount: "DISCOUNT",
    total: "TOTAL",
    includesVat: "(includes {amount} VAT)",
    contactInfo: "Contact Information",
    shippingAddress: "Shipping Address",
    billingAddress: "Billing Address",
    close: "Close",
    copied: "Copied!",
    copyCode: "Copy Order Code",
    ratingLabels: {
      5: "Loved it! (5/5)",
      4: "Very Good (4/5)",
      3: "Average (3/5)",
      2: "Below Average (2/5)",
      1: "Poor (1/5)",
    },
    errorRating: "Please select a rating.",
    errorComment: "Please write a review comment.",
    errorGeneric: "An error occurred while submitting your review.",
    failedDetails: "Failed to load order details. Please try again.",
  },
  ar: {
    tabAll: "جميع الطلبات",
    tabProcessing: "قيد التجهيز",
    tabShipped: "تم الشحن",
    tabDelivered: "تم التوصيل",
    tabCancelled: "تم الإلغاء",
    order: "طلب",
    placedOn: "بتاريخ",
    totalAmount: "المبلغ الإجمالي",
    orderDetails: "تفاصيل الطلب",
    moreItems: "+{count} إضافية",
    noOrders: "لا توجد طلبات",
    noOrdersSub: "لم تقم بإنشاء أي طلبات في هذه الفئة حتى الآن.",
    pageInfo: "صفحة {current} من {total}",
    prevBtn: "← السابق",
    nextBtn: "التالي →",
    modalTitle: "تفاصيل الطلب",
    orderNumber: "رقم الطلب",
    datePlaced: "تاريخ الطلب",
    paymentMethod: "طريقة الدفع",
    orderStatus: "حالة الطلب",
    purchasedTitle: "العطور المشتراة",
    reviewProduct: "تقييم العطر",
    reviewed: "تم التقييم",
    rateTitle: "قيم هذا العطر",
    ratePlaceholder: "شاركنا انطباعك عن فوحان وثبات وجودة العطر...",
    cancel: "إلغاء",
    submitReview: "إرسال التقييم",
    submitting: "جاري الإرسال…",
    reviewSuccess: "تم إرسال تقييمك للمراجعة. شكراً لك!",
    orderSummaryTitle: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    freeShipping: "شحن مجاني",
    shippingCost: "تكلفة الشحن: {amount}",
    serviceFee: "رسوم الخدمة",
    codCharges: "رسوم الدفع عند الاستلام",
    discount: "الخصم",
    total: "الإجمالي",
    includesVat: "(يشمل {amount} ضريبة)",
    contactInfo: "معلومات التواصل",
    shippingAddress: "عنوان الشحن",
    billingAddress: "عنوان الفاتورة",
    close: "إغلاق",
    copied: "تم النسخ!",
    copyCode: "نسخ رقم الطلب",
    ratingLabels: {
      5: "ممتاز جداً! (5/5)",
      4: "جيد جداً (4/5)",
      3: "متوسط (3/5)",
      2: "أقل من المتوسط (2/5)",
      1: "ضعيف (1/5)",
    },
    errorRating: "يرجى اختيار التقييم بالنجوم.",
    errorComment: "يرجى كتابة تعليق للتقييم.",
    errorGeneric: "حدث خطأ أثناء إرسال التقييم.",
    failedDetails: "تعذر تحميل تفاصيل الطلب. يرجى المحاولة مجدداً.",
  },
};

export default function AccountOrders() {
  const locale = useLocale();
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const isRtl = locale === "ar";
  const { currency } = useMenu();

  const [data, setData] = useState([]);
  const [orderSummaries, setOrderSummaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });
  const [pageCount, setPageCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Product review states
  const [reviewedProductIds, setReviewedProductIds] = useState([]);
  const [activeReviewProductId, setActiveReviewProductId] = useState(null);
  const [currentRating, setCurrentRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

  const FILTER_TABS = [
    { key: "all", label: t.tabAll, status: null },
    { key: "processing", label: t.tabProcessing, status: "processing" },
    { key: "shipped", label: t.tabShipped, status: "shipped" },
    { key: "delivered", label: t.tabDelivered, status: "delivered,completed" },
    { key: "cancelled", label: t.tabCancelled, status: "cancelled,canceled" },
  ];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const activeTab = FILTER_TABS.find((tab) => tab.key === activeStatus);
    const statusQuery = activeTab?.status;

    const params = new URLSearchParams({
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
      orderBy: "created_at",
      orderDir: "desc",
      with_products: "1",
      ...(statusQuery ? { status: statusQuery } : {}),
    });

    try {
      const res = await apiClient(`api/customerOrders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      setData(json.data || []);
      setPageCount(json.last_page || Math.ceil((json.total || 0) / pagination.pageSize) || 1);

      const summaryResults = {};
      (json.data || []).forEach((order) => {
        summaryResults[order.id] = order.products || [];
      });
      setOrderSummaries(summaryResults);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, activeStatus, t]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openDetails = async (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setModalLoading(true);
    setActiveReviewProductId(null);
    setReviewComment("");
    setReviewError("");
    setReviewSuccessMessage("");
    setCurrentRating(5);
    setHoveredRating(0);

    try {
      const resp = await apiClient(`api/customerOrderDetails`, {
        method: "POST",
        body: JSON.stringify({ order_id: order.id }),
      });
      const json = await resp.json();
      setModalDetails(json);
      if (json.order) {
        setSelectedOrder(json.order);
      }
      if (Array.isArray(json.reviewed_product_ids)) {
        setReviewedProductIds(json.reviewed_product_ids.map(Number));
      }
    } catch {
      setModalDetails(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveReviewProductId(null);
    setReviewComment("");
    setReviewError("");
    setReviewSuccessMessage("");
  };

  const handleCopyCode = (e, code, id) => {
    e.stopPropagation();
    if (!code) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

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

  const handleReviewSubmit = async (productId) => {
    if (!currentRating || currentRating < 1 || currentRating > 5) {
      setReviewError(t.errorRating);
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError(t.errorComment);
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      const customerName = modalDetails?.order_address?.[0]?.name || "Customer";
      const customerEmail = modalDetails?.order_address?.[0]?.email || "";
      const customerPhone = modalDetails?.order_address?.[0]?.phone || "";

      const resp = await apiClient("api/reviews", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          order_id: selectedOrder?.id,
          star: currentRating,
          comment: reviewComment.trim(),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        }),
      });

      const json = await resp.json();

      if (resp.ok) {
        setReviewedProductIds((prev) => [...new Set([...prev, Number(productId)])]);
        setActiveReviewProductId(null);
        setReviewComment("");
        setReviewSuccessMessage(t.reviewSuccess);
        setTimeout(() => setReviewSuccessMessage(""), 5000);
      } else {
        setReviewError(json.message || t.errorGeneric);
      }
    } catch {
      setReviewError(t.errorGeneric);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    const rawVal = status?.value || (typeof status === "string" ? status : "");
    const val = String(rawVal).toLowerCase().trim();
    const rawLabel = status?.label || (typeof status === "string" ? status : "") || "";

    if (val === "delivered" || val === "completed") {
      return (
        <span className={`${styles.statusBadge} ${styles.statusDelivered}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t.tabDelivered}
        </span>
      );
    }
    if (val === "shipped") {
      return (
        <span className={`${styles.statusBadge} ${styles.statusShipped}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          {t.tabShipped}
        </span>
      );
    }
    if (val === "processing") {
      return (
        <span className={`${styles.statusBadge} ${styles.statusProcessing}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {t.tabProcessing}
        </span>
      );
    }
    if (val === "cancelled" || val === "canceled") {
      return (
        <span className={`${styles.statusBadge} ${styles.statusCancelled}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          {t.tabCancelled}
        </span>
      );
    }
    return (
      <span className={`${styles.statusBadge} ${styles.statusDefault}`}>
        {rawLabel || val || "Pending"}
      </span>
    );
  };

  const getPaymentMethodName = (channel) => {
    if (!channel) return "—";
    const map = {
      cod: locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery",
      paytabs: "PayTabs",
      tamara: "Tamara",
    };
    return map[channel] || channel;
  };

  return (
    <div className={styles.container} dir={isRtl ? "rtl" : "ltr"}>
      {/* Modern Filter Tabs Navigation */}
      <div className={styles.tabsWrapper} role="tablist">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeStatus === tab.key}
            className={`${styles.tabBtn} ${activeStatus === tab.key ? styles.tabBtnActive : ""}`}
            onClick={() => {
              setActiveStatus(tab.key);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List / Loading Skeleton / Empty State */}
      {loading ? (
        <div className={styles.orderList}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.orderCard} style={{ opacity: 0.8 }}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.skeletonRow} style={{ width: 110, height: 26, borderRadius: 9999 }} />
                  <div className={styles.skeletonRow} style={{ width: 130, height: 16 }} />
                </div>
                <div className={styles.skeletonRow} style={{ width: 80, height: 24, borderRadius: 9999 }} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.previewsRow}>
                  {[1, 2, 3].map((j) => (
                    <div key={j} className={styles.skeletonRow} style={{ width: 56, height: 56, borderRadius: 8 }} />
                  ))}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.skeletonRow} style={{ width: 140, height: 18 }} />
                <div className={styles.skeletonRow} style={{ width: 90, height: 30, borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      ) : data.length > 0 ? (
        <div className={styles.orderList}>
          {data.map((order) => {
            const products = orderSummaries[order.id] || [];
            const isCopied = copiedId === order.id;

            return (
              <div key={order.id} className={styles.orderCard}>
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    <div className={styles.orderCodePill}>
                      <span>{t.order} {order.code}</span>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={(e) => handleCopyCode(e, order.code, order.id)}
                        title={t.copyCode}
                      >
                        {isCopied ? (
                          <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <span className={styles.orderDate}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {getStatusBadge(order.status)}
                </div>

                {/* Previews Body */}
                <div className={styles.cardBody}>
                  <div className={styles.previewsRow}>
                    {products.slice(0, 4).map((prod, i) => (
                      <img
                        key={i}
                        className={styles.thumbImg}
                        src={prod.product_image ? `${IMG_BASE}storage/${prod.product_image}` : "/assets/images/ahmed-favicon.png"}
                        alt={prod.product_name ? he.decode(prod.product_name) : "Product"}
                        onError={(e) => {
                          e.currentTarget.src = "/assets/images/ahmed-favicon.png";
                        }}
                      />
                    ))}
                    {products.length > 4 && (
                      <span className={styles.moreCountPill}>
                        {t.moreItems.replace("{count}", String(products.length - 4))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  <div className={styles.totalGroup}>
                    <span className={styles.totalLabel}>{t.totalAmount}:</span>
                    <span className={styles.totalAmount}>
                      {Number(order.amount).toFixed(currency?.decimals || 2)} {currency?.symbol || "AED"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.btnDetails}
                    onClick={() => openDetails(order)}
                  >
                    <span>{t.orderDetails}</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points={isRtl ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h4 className={styles.emptyTitle}>{t.noOrders}</h4>
          <p className={styles.emptySub}>{t.noOrdersSub}</p>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            {t.pageInfo
              .replace("{current}", String(pagination.pageIndex + 1))
              .replace("{total}", String(pageCount))}
          </div>
          <div className={styles.paginationActions}>
            <button
              type="button"
              className={styles.paginationBtn}
              disabled={pagination.pageIndex === 0}
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            >
              {t.prevBtn}
            </button>
            <button
              type="button"
              className={styles.paginationBtn}
              disabled={pagination.pageIndex === pageCount - 1}
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            >
              {t.nextBtn}
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal (Shop Order Complete Style) */}
      {showModal && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalWindow}>
            {/* Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTitle}>
                <h3 className={styles.modalTitle}>{t.modalTitle}</h3>
                {selectedOrder && getStatusBadge(selectedOrder.status)}
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={closeModal}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Meta Grid Strip */}
            {selectedOrder && (
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{t.orderNumber}</span>
                  <span className={styles.metaValue}>{selectedOrder.code}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{t.datePlaced}</span>
                  <span className={styles.metaValue}>
                    {new Date(selectedOrder.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{t.paymentMethod}</span>
                  <span className={styles.metaValue}>
                    {getPaymentMethodName(selectedOrder.payment_channel)}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{t.orderStatus}</span>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
            )}

            {/* Scrollable Body */}
            <div className={styles.modalBodyScroll}>
              {modalLoading ? (
                <div style={{ textAlign: "center", padding: "40px 16px" }}>
                  <div className={styles.spinnerSmall} style={{ width: 26, height: 26, borderWidth: 3, margin: "0 auto 12px" }} />
                  <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>Loading details…</p>
                </div>
              ) : modalDetails ? (
                <div>
                  {reviewSuccessMessage && (
                    <div className={styles.reviewSuccessAlert}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {reviewSuccessMessage}
                    </div>
                  )}

                  <div className={styles.modalColumns}>
                    {/* Left Column: Fragrances */}
                    <div>
                      <h4 className={styles.modalSectionTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {t.purchasedTitle}
                      </h4>

                      <div className={styles.productsList}>
                        {(modalDetails.order_products || []).map((item, idx) => {
                          const orderStatusVal = (selectedOrder?.status?.value || selectedOrder?.status || "")
                            .toLowerCase()
                            .trim();
                          const isCompletedOrder =
                            orderStatusVal === "completed" || orderStatusVal === "delivered";
                          const isReviewed =
                            item.product_id && reviewedProductIds.includes(Number(item.product_id));
                          const isDrawerOpen = activeReviewProductId === item.product_id;

                          return (
                            <div key={idx} className={styles.productCard}>
                              <div className={styles.productRow}>
                                <div className={styles.productLeft}>
                                  <img
                                    className={styles.productItemImg}
                                    src={item.product_image ? `${IMG_BASE}storage/${item.product_image}` : "/assets/images/ahmed-favicon.png"}
                                    alt={item.product_name ? he.decode(item.product_name) : "Product"}
                                    onError={(e) => {
                                      e.currentTarget.src = "/assets/images/ahmed-favicon.png";
                                    }}
                                  />
                                  <div className={styles.productInfo}>
                                    <h5 className={styles.productName}>
                                      {he.decode(item.product_name || "")}
                                    </h5>
                                    <span className={styles.productPriceQty}>
                                      {item.qty} × {Number(item.gross_amount / (item.qty || 1)).toFixed(currency?.decimals || 2)} {currency?.symbol || "AED"}
                                    </span>
                                  </div>
                                </div>

                                {isCompletedOrder && item.product_id && (
                                  <div>
                                    {isReviewed ? (
                                      <span className={styles.badgeReviewed}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {t.reviewed}
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        className={styles.btnReviewTrigger}
                                        onClick={() => toggleReviewDrawer(item.product_id)}
                                      >
                                        {isDrawerOpen ? t.cancel : t.reviewProduct}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Interactive Review Drawer */}
                              {isDrawerOpen && (
                                <div className={styles.reviewDrawer}>
                                  <div className={styles.reviewDrawerHeader}>
                                    <span className={styles.reviewDrawerTitle}>{t.rateTitle}</span>
                                    <span className={styles.ratingLabel}>
                                      {t.ratingLabels[hoveredRating || currentRating] || ""}
                                    </span>
                                    <div className={styles.starRatingGroup}>
                                      {[1, 2, 3, 4, 5].map((star) => {
                                        const isActive = star <= (hoveredRating || currentRating);
                                        return (
                                          <button
                                            key={star}
                                            type="button"
                                            className={`${styles.starBtn} ${isActive ? styles.starBtnActive : ""}`}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => setCurrentRating(star)}
                                            aria-label={`Rate ${star} of 5`}
                                          >
                                            <svg
                                              width="18"
                                              height="18"
                                              viewBox="0 0 24 24"
                                              fill={isActive ? "#c7944b" : "none"}
                                              stroke={isActive ? "#c7944b" : "#d1d5db"}
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
                                    placeholder={t.ratePlaceholder}
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    rows={3}
                                  />

                                  {reviewError && (
                                    <div className={styles.reviewErrorMsg}>{reviewError}</div>
                                  )}

                                  <div className={styles.reviewDrawerActions}>
                                    <button
                                      type="button"
                                      className={styles.btnReviewCancel}
                                      onClick={() => setActiveReviewProductId(null)}
                                      disabled={submittingReview}
                                    >
                                      {t.cancel}
                                    </button>
                                    <button
                                      type="button"
                                      className={styles.btnReviewSubmit}
                                      onClick={() => handleReviewSubmit(item.product_id)}
                                      disabled={submittingReview}
                                    >
                                      {submittingReview && <span className={styles.spinnerSmall} />}
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

                    {/* Right Column: Financial Summary & Addresses */}
                    <div>
                      <div className={styles.summaryCard}>
                        <h5 className={styles.modalSectionTitle} style={{ marginBottom: 4 }}>
                          {t.orderSummaryTitle}
                        </h5>

                        {(() => {
                          const currentOrder = modalDetails.order || selectedOrder;
                          const subTotal = Number(currentOrder?.sub_total || 0);
                          const shippingCost =
                            Number(currentOrder?.shipping_amount || 0) +
                            Number(currentOrder?.shipping_amount_vat || 0);
                          const serviceFee =
                            Number(currentOrder?.service_amount || 0) +
                            Number(currentOrder?.service_amount_vat || 0);
                          const codCharge =
                            Number(currentOrder?.cod_charge || 0) +
                            Number(currentOrder?.cod_charge_vat || 0);
                          const discountAmount = Number(currentOrder?.discount_amount || 0);
                          const totalAmount = Number(currentOrder?.amount || 0);
                          const totalVat = Number(currentOrder?.tax_amount || 0);
                          const isCod = currentOrder?.payment_channel === "cod" || codCharge > 0;

                          return (
                            <table className={styles.financialTable}>
                              <tbody>
                                <tr>
                                  <th>{t.subtotal}</th>
                                  <td>{subTotal.toFixed(currency?.decimals || 2)} {currency?.symbol || "AED"}</td>
                                </tr>
                                <tr>
                                  <th>{t.shipping}</th>
                                  <td>
                                    {shippingCost <= 0 ? (
                                      <span className={styles.freeShippingPill}>✓ {t.freeShipping}</span>
                                    ) : (
                                      `${shippingCost.toFixed(currency?.decimals || 2)} ${currency?.symbol || "AED"}`
                                    )}
                                  </td>
                                </tr>
                                {serviceFee > 0 && (
                                  <tr>
                                    <th>{t.serviceFee}</th>
                                    <td>{serviceFee.toFixed(currency?.decimals || 2)} {currency?.symbol || "AED"}</td>
                                  </tr>
                                )}
                                {isCod && (
                                  <tr>
                                    <th>{t.codCharges}</th>
                                    <td>{codCharge.toFixed(currency?.decimals || 2)} {currency?.symbol || "AED"}</td>
                                  </tr>
                                )}
                                {discountAmount > 0 && (
                                  <tr>
                                    <th>{t.discount}</th>
                                    <td className={styles.discountValue}>
                                      -{discountAmount.toFixed(currency?.decimals || 2)} {currency?.symbol || "AED"}
                                    </td>
                                  </tr>
                                )}
                                <tr className={styles.grandTotalRow}>
                                  <th>{t.total}</th>
                                  <td>
                                    {totalAmount.toFixed(currency?.decimals || 2)} {currency?.symbol || "AED"}
                                    <span className={styles.vatSubtext}>
                                      {t.includesVat.replace(
                                        "{amount}",
                                        `${totalVat.toFixed(currency?.decimals || 2)} ${currency?.symbol || "AED"}`
                                      )}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          );
                        })()}

                        {/* Payment Method */}
                        <div className={styles.infoBlock}>
                          <span className={styles.infoBlockTitle}>{t.paymentMethod}</span>
                          <p className={styles.infoBlockContent}>
                            {getPaymentMethodName(modalDetails?.order?.payment_channel || selectedOrder?.payment_channel)}
                          </p>
                        </div>

                        {/* Contact Information */}
                        {modalDetails.order_address?.[0] && (
                          <>
                            <div className={styles.infoBlock}>
                              <span className={styles.infoBlockTitle}>{t.contactInfo}</span>
                              <p className={styles.infoBlockContent}>
                                <strong>{modalDetails.order_address[0]?.name}</strong><br />
                                {modalDetails.order_address[0]?.phone}<br />
                                {modalDetails.order_address[0]?.email}
                              </p>
                            </div>

                            <div className={styles.infoBlock}>
                              <span className={styles.infoBlockTitle}>{t.shippingAddress}</span>
                              <p className={styles.infoBlockContent}>
                                {modalDetails.order_address[0]?.address}<br />
                                {modalDetails.order_address[0]?.city}, {modalDetails.order_address[0]?.state}
                              </p>
                            </div>

                            <div className={styles.infoBlock}>
                              <span className={styles.infoBlockTitle}>{t.billingAddress}</span>
                              <p className={styles.infoBlockContent}>
                                {modalDetails.order_address[0]?.address}<br />
                                {modalDetails.order_address[0]?.city}, {modalDetails.order_address[0]?.state}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 16px", color: "#dc2626" }}>
                  {t.failedDetails}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnModalClose}
                onClick={closeModal}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}