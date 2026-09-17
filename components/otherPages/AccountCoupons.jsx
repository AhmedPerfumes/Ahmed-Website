"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLocale } from "next-intl";
import styles from "./AccountCoupons.module.css";

const TRANSLATIONS = {
  en: {
    hintText: "Manage and apply your exclusive discount codes at checkout.",
    tabAll: "All Coupons",
    tabActive: "Active",
    tabRedeemed: "Redeemed",
    tabExpired: "Expired",
    off: "OFF",
    validUntil: "Valid until",
    expiredOn: "Expired on",
    redeemedOn: "Redeemed",
    statusActive: "Active",
    statusExpired: "Expired",
    statusRedeemed: "Redeemed",
    copyCode: "Copy Code",
    copied: "Copied!",
    clickToCopy: "Click to copy code",
    noCoupons: "No Coupons Available",
    noCouponsSub: "You don't have any vouchers in this category at the moment.",
    specialCoupon: "Exclusive Offer",
  },
  ar: {
    hintText: "أدر واستخدم كوبونات الخصم الحصرية الخاصة بك عند إتمام الطلب.",
    tabAll: "جميع الكوبونات",
    tabActive: "النشطة",
    tabRedeemed: "المستخدمة",
    tabExpired: "المنتهية",
    off: "خصم",
    validUntil: "صالح حتى",
    expiredOn: "انتهى في",
    redeemedOn: "تم الاستخدام",
    statusActive: "نشط",
    statusExpired: "منتهي",
    statusRedeemed: "مستخدم",
    copyCode: "نسخ الكود",
    copied: "تم النسخ!",
    clickToCopy: "انقر لنسخ الكود",
    noCoupons: "لا توجد قسائم متاحة",
    noCouponsSub: "ليس لديك أي قسائم أو كوبونات في هذا القسم حالياً.",
    specialCoupon: "عرض خاص",
  },
};

export default function MyCoupons() {
  const locale = useLocale();
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const isRtl = locale === "ar";

  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch coupons from SmartView API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("user");
    let user = null;

    if (raw) {
      try {
        user = JSON.parse(atob(raw));
      } catch (e) {
        // failed to decode
      }
    }

    if (!user) {
      setLoading(false);
      return;
    }

    const email = encodeURIComponent(user.email || "");
    const mobileNo = encodeURIComponent(user.phone || user.mobile || "");
    const apiUrl = `${process.env.NEXT_PUBLIC_SMARTVIEW_API_URL}Coupon/AllCoupons`;

    setLoading(true);
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        salesType: "EComm",
        company: "UAE",
        mobileNo,
        email,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const data = json.data || [];

        // Sort: Active first, then Expired, then Redeemed
        const sortedData = data.sort((a, b) => {
          const getWeight = (c) => {
            const isRedeemed = c.status?.toLowerCase() === "redeemed";
            const isExp = c.validTo && new Date(c.validTo) < new Date();
            if (!isRedeemed && !isExp) return 1;
            if (isExp && !isRedeemed) return 2;
            return 3;
          };
          return getWeight(a) - getWeight(b);
        });

        setCoupons(sortedData);
      })
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  }, []);

  // Copy code handler
  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => {
      setCopiedId(null);
    }, 1800);
  };

  // Status helper
  const getCouponStatus = (coupon) => {
    if (coupon.status?.toLowerCase() === "redeemed") return "redeemed";
    if (coupon.validTo && new Date(coupon.validTo) < new Date()) return "expired";
    return "active";
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.slice(0, 10);
      return d.toLocaleDateString(isRtl ? "ar-AE" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr.slice(0, 10);
    }
  };

  // Counts for tabs
  const tabCounts = useMemo(() => {
    const counts = { all: coupons.length, active: 0, redeemed: 0, expired: 0 };
    coupons.forEach((c) => {
      const status = getCouponStatus(c);
      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });
    return counts;
  }, [coupons]);

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    if (activeTab === "all") return coupons;
    return coupons.filter((c) => getCouponStatus(c) === activeTab);
  }, [coupons, activeTab]);

  return (
    <div className={styles.container} dir={isRtl ? "rtl" : "ltr"}>
      {/* Top Hint Banner */}
      <div className={styles.hintBanner}>
        <div className={styles.hintIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
        </div>
        <p className={styles.hintText}>{t.hintText}</p>
      </div>

      {/* Filter Tabs Navigation */}
      <div className={styles.tabsWrapper}>
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
        >
          <span>{t.tabAll}</span>
          <span className={styles.tabBadge}>{tabCounts.all}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`${styles.tabBtn} ${activeTab === "active" ? styles.tabBtnActive : ""}`}
        >
          <span>{t.tabActive}</span>
          <span className={styles.tabBadge}>{tabCounts.active}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("redeemed")}
          className={`${styles.tabBtn} ${activeTab === "redeemed" ? styles.tabBtnActive : ""}`}
        >
          <span>{t.tabRedeemed}</span>
          <span className={styles.tabBadge}>{tabCounts.redeemed}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("expired")}
          className={`${styles.tabBtn} ${activeTab === "expired" ? styles.tabBtnActive : ""}`}
        >
          <span>{t.tabExpired}</span>
          <span className={styles.tabBadge}>{tabCounts.expired}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className={styles.couponList}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                <div className={styles.skeletonRow} style={{ width: "90px", height: "18px" }} />
                <div className={styles.skeletonRow} style={{ width: "140px", height: "28px" }} />
                <div className={styles.skeletonRow} style={{ width: "180px", height: "14px" }} />
              </div>
              <div style={{ width: "160px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div className={styles.skeletonRow} style={{ width: "100%", height: "36px" }} />
                <div className={styles.skeletonRow} style={{ width: "100%", height: "32px" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        /* Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>{t.noCoupons}</h3>
          <p className={styles.emptySub}>{t.noCouponsSub}</p>
        </div>
      ) : (
        /* Coupon Cards List */
        <div className={styles.couponList}>
          {filteredCoupons.map((c) => {
            const status = getCouponStatus(c);
            const isActive = status === "active";
            const isRedeemed = status === "redeemed";
            const isExpired = status === "expired";
            const isCopied = copiedId === c.couponCode;

            const cardClass = `${styles.couponCard} ${
              isActive
                ? styles.couponCardActive
                : isExpired
                ? styles.couponCardExpired
                : styles.couponCardRedeemed
            }`;

            return (
              <div key={c.couponCode} className={cardClass}>
                {/* Left: Offer details */}
                <div className={styles.cardLeft}>
                  <div className={styles.cardTopRow}>
                    <span
                      className={`${styles.statusBadge} ${
                        isActive
                          ? styles.badgeActive
                          : isExpired
                          ? styles.badgeExpired
                          : styles.badgeRedeemed
                      }`}
                    >
                      <span className={styles.statusDot} />
                      {isActive
                        ? t.statusActive
                        : isExpired
                        ? t.statusExpired
                        : t.statusRedeemed}
                    </span>
                    <h4 className={styles.promoTitle}>
                      {c.promotionName || t.specialCoupon}
                    </h4>
                  </div>

                  <div className={styles.discountValue}>
                    {c.baseOn === "Percent" ? (
                      <>
                        <span>{c.value}%</span>
                        <span className={styles.discountUnit}>{t.off}</span>
                      </>
                    ) : (
                      <>
                        <span>AED {c.value}</span>
                        <span className={styles.discountUnit}>{t.off}</span>
                      </>
                    )}
                  </div>

                  <div className={styles.validityRow}>
                    <svg
                      className={styles.validityIcon}
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      {isExpired
                        ? `${t.expiredOn} ${formatDate(c.validTo)}`
                        : isRedeemed
                        ? `${t.redeemedOn}`
                        : `${t.validUntil} ${formatDate(c.validTo)}`}
                    </span>
                  </div>
                </div>

                {/* Perforation Divider */}
                <div className={styles.perforationDivider}>
                  <span className={styles.notchTop} />
                  <span className={styles.notchBottom} />
                </div>

                {/* Right: Code & Copy Action */}
                <div className={styles.cardRight}>
                  <div
                    className={`${styles.codeBox} ${
                      !isActive ? styles.codeBoxDisabled : ""
                    }`}
                    onClick={() => isActive && handleCopy(c.couponCode)}
                    title={isActive ? t.clickToCopy : ""}
                  >
                    <span className={styles.codeText}>{c.couponCode}</span>
                  </div>

                  <button
                    type="button"
                    className={`${styles.btnCopy} ${
                      isCopied ? styles.btnCopied : ""
                    }`}
                    onClick={() => handleCopy(c.couponCode)}
                    disabled={!isActive}
                  >
                    {isCopied ? (
                      <>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{t.copied}</span>
                      </>
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
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>{t.copyCode}</span>
                      </>
                    )}
                  </button>

                  {isActive && (
                    <p className={styles.copyHintText}>{t.clickToCopy}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
