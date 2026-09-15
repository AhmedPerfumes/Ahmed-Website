"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import styles from "./ActiveDevices.module.css";

const TRANSLATIONS = {
  en: {
    hintText: "Review devices currently authenticated with your Ahmed Al Maghribi account. Sign out of any unfamiliar sessions immediately.",
    headerTitle: "Active Device Sessions",
    sessionCount: "{count} Active Sessions",
    singleSessionCount: "1 Active Session",
    signOutAll: "Sign Out All Other Devices",
    signingOut: "Signing Out…",
    thisDevice: "This Device",
    activeSession: "Active Session",
    signOut: "Sign Out",
    ipAddress: "IP: {ip}",
    unknownIp: "Unknown",
    lastActive: "Last active: {time}",
    justNow: "Just now",
    noDevices: "No Active Sessions",
    noDevicesSub: "No device sessions found for your account.",
    confirmSignOutAllTitle: "Sign Out Other Devices?",
    confirmSignOutAllSub: "Are you sure you want to sign out of all other active devices? You will remain signed in on this current device.",
    confirmSignOutSingleTitle: "Sign Out Device?",
    confirmSignOutSingleSub: "Are you sure you want to terminate this active device session?",
    cancel: "Cancel",
    confirmSignOut: "Yes, Sign Out",
    successRevokeSingle: "Device session signed out successfully.",
    successRevokeAll: "All other device sessions have been signed out.",
    errorGeneric: "An error occurred. Please try again.",
    errorFetch: "Failed to load active device sessions.",
  },
  ar: {
    hintText: "راجع الأجهزة المتصلة بحسابك في أحمد المغربي للعطور. يُرجى تسجيل الخروج من أي جلسات غير مألوفة لحماية حسابك.",
    headerTitle: "جلسات الأجهزة النشطة",
    sessionCount: "{count} جلسات نشطة",
    singleSessionCount: "جلسة واحدة نشطة",
    signOutAll: "تسجيل الخروج من جميع الأجهزة الأخرى",
    signingOut: "جاري تسجيل الخروج…",
    thisDevice: "هذا الجهاز",
    activeSession: "جلسة نشطة",
    signOut: "تسجيل الخروج",
    ipAddress: "عنوان IP: {ip}",
    unknownIp: "غير معروف",
    lastActive: "آخر نشاط: {time}",
    justNow: "الآن",
    noDevices: "لا توجد جلسات نشطة",
    noDevicesSub: "لم يتم العثور على أي جلسات نشطة مسجلة لحسابك.",
    confirmSignOutAllTitle: "تسجيل الخروج من الأجهزة الأخرى؟"
      ,
    confirmSignOutAllSub: "هل أنت متأكد من رغبتك في تسجيل الخروج من جميع الأجهزة الأخرى؟ ستبقى مسجل الدخول على هذا الجهاز الحالي.",
    confirmSignOutSingleTitle: "تسجيل الخروج من هذا الجهاز؟",
    confirmSignOutSingleSub: "هل أنت متأكد من رغبتك في إنهاء هذه الجلسة وتسجيل خروج الجهاز؟",
    cancel: "إلغاء",
    confirmSignOut: "نعم، تسجيل الخروج",
    successRevokeSingle: "تم تسجيل خروج الجهاز بنجاح.",
    successRevokeAll: "تم تسجيل الخروج من جميع الأجهزة الأخرى بنجاح.",
    errorGeneric: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    errorFetch: "تعذر تحميل جلسات الأجهزة النشطة.",
  },
};

export default function ActiveDevices() {
  const locale = useLocale();
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const isRtl = locale === "ar";

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "single", // "single" | "all"
    sessionId: null,
  });

  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient("api/sessions");
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSessions(data.sessions || []);
      } else {
        setError(data.message || t.errorFetch);
      }
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiClient("api/sessions/revoke", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccess(t.successRevokeSingle);
        setConfirmModal({ open: false, type: "single", sessionId: null });
        fetchSessions();
      } else {
        setError(data.message || t.errorGeneric);
      }
    } catch {
      setError(t.errorGeneric);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeOthers = async () => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiClient("api/sessions/revoke-others", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccess(data.message || t.successRevokeAll);
        setConfirmModal({ open: false, type: "all", sessionId: null });
        fetchSessions();
      } else {
        setError(data.message || t.errorGeneric);
      }
    } catch {
      setError(t.errorGeneric);
    } finally {
      setActionLoading(false);
    }
  };

  const openConfirmSingle = (sessionId) => {
    setConfirmModal({
      open: true,
      type: "single",
      sessionId,
    });
  };

  const openConfirmAll = () => {
    setConfirmModal({
      open: true,
      type: "all",
      sessionId: null,
    });
  };

  const closeConfirmModal = () => {
    if (actionLoading) return;
    setConfirmModal({ open: false, type: "single", sessionId: null });
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return t.justNow;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat(isRtl ? "ar-AE" : "en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const renderDeviceIcon = (type) => {
    if (type === "mobile") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    }
    if (type === "tablet") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    }
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  };

  const sessionCountText =
    sessions.length === 1
      ? t.singleSessionCount
      : t.sessionCount.replace("{count}", sessions.length);

  return (
    <div className={styles.container} dir={isRtl ? "rtl" : "ltr"}>
      {/* Top Security Hint Banner */}
      <div className={styles.hintBanner}>
        <div className={styles.hintIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className={styles.hintText}>{t.hintText}</p>
      </div>

      {/* Header & Bulk Action */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h3 className={styles.headerTitle}>{t.headerTitle}</h3>
          {!loading && sessions.length > 0 && (
            <span className={styles.sessionCountBadge}>{sessionCountText}</span>
          )}
        </div>

        {sessions.length > 1 && (
          <button
            type="button"
            className={styles.btnRevokeAll}
            onClick={openConfirmAll}
            disabled={actionLoading || loading}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>{t.signOutAll}</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`${styles.alertBanner} ${styles.alertError}`}>
          <div className={styles.alertContent}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            type="button"
            className={styles.alertCloseBtn}
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className={`${styles.alertBanner} ${styles.alertSuccess}`}>
          <div className={styles.alertContent}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{success}</span>
          </div>
          <button
            type="button"
            className={styles.alertCloseBtn}
            onClick={() => setSuccess("")}
            aria-label="Dismiss success"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className={styles.deviceList}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                <div className={styles.skeletonRow} style={{ width: "44px", height: "44px", borderRadius: "12px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <div className={styles.skeletonRow} style={{ width: "160px", height: "16px" }} />
                  <div className={styles.skeletonRow} style={{ width: "220px", height: "12px" }} />
                </div>
              </div>
              <div className={styles.skeletonRow} style={{ width: "80px", height: "30px", borderRadius: "8px" }} />
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        /* Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h4 className={styles.emptyTitle}>{t.noDevices}</h4>
          <p className={styles.emptySub}>{t.noDevicesSub}</p>
        </div>
      ) : (
        /* Sessions List */
        <div className={styles.deviceList}>
          {sessions.map((session) => {
            const isCurrent = session.is_current;
            const cardClass = `${styles.deviceCard} ${isCurrent ? styles.deviceCardCurrent : ""}`;

            return (
              <div key={session.session_id} className={cardClass}>
                <div className={styles.deviceLeft}>
                  <div className={styles.deviceIconCircle}>
                    {renderDeviceIcon(session.device_type)}
                  </div>

                  <div className={styles.deviceInfo}>
                    <div className={styles.deviceTitleRow}>
                      <h4 className={styles.deviceName}>
                        {session.device_name || "Device"}
                      </h4>
                      {isCurrent && (
                        <span className={styles.badgeCurrent}>
                          <span className={styles.currentDot} />
                          {t.thisDevice}
                        </span>
                      )}
                    </div>

                    <div className={styles.deviceMeta}>
                      <span className={styles.metaItem}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        {t.ipAddress.replace("{ip}", session.ip_address || t.unknownIp)}
                      </span>
                      <span className={styles.metaSeparator}>•</span>
                      <span className={styles.metaItem}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {session.last_active_at
                          ? t.lastActive.replace("{time}", formatTimestamp(session.last_active_at))
                          : t.justNow}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.deviceRight}>
                  {!isCurrent ? (
                    <button
                      type="button"
                      className={styles.btnRevoke}
                      onClick={() => openConfirmSingle(session.session_id)}
                      disabled={actionLoading}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>{t.signOut}</span>
                    </button>
                  ) : (
                    <span className={styles.currentDeviceTag}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{t.activeSession}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className={styles.modalBackdrop} onClick={closeConfirmModal}>
          <div
            className={styles.modalWindow}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIconCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h4 className={styles.modalTitle}>
              {confirmModal.type === "all"
                ? t.confirmSignOutAllTitle
                : t.confirmSignOutSingleTitle}
            </h4>

            <p className={styles.modalSub}>
              {confirmModal.type === "all"
                ? t.confirmSignOutAllSub
                : t.confirmSignOutSingleSub}
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnModalCancel}
                onClick={closeConfirmModal}
                disabled={actionLoading}
              >
                {t.cancel}
              </button>

              <button
                type="button"
                className={styles.btnModalConfirm}
                onClick={() => {
                  if (confirmModal.type === "all") {
                    handleRevokeOthers();
                  } else {
                    handleRevokeSession(confirmModal.sessionId);
                  }
                }}
                disabled={actionLoading}
              >
                {actionLoading && <span className={styles.spinnerSmall} />}
                <span>{actionLoading ? t.signingOut : t.confirmSignOut}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
