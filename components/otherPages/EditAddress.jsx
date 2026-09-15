"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import styles from "./EditAddress.module.css";

const EMIRATES = [
  "Abu Dhabi",
  "Ajman",
  "Al Ain",
  "Dubai",
  "Fujairah",
  "Ras Al Khaymah",
  "Sharjah",
  "Umm Al Quwain",
];

const TRANSLATIONS = {
  en: {
    hintTitle: "Default Delivery Address",
    hintText: "Your default delivery address will be selected automatically during checkout.",
    homeAddress: "Home Address",
    otherAddress: "Other Address",
    defaultBadge: "Default",
    setAsDefault: "Set as Default",
    editBtn: "Edit",
    deleteBtn: "Delete",
    nameNotSet: "Name not set",
    addNewAddress: "Add New Address",
    addNewSub: "Add a secondary delivery location",
    capacityNote: "You can save up to 2 delivery addresses (Home and Other).",
    noAddresses: "No Saved Addresses Yet",
    noAddressesSub: "Add your primary delivery location to streamline checkout.",
    addFirstBtn: "Add Address",
    modalAddTitle: "Add Delivery Address",
    modalEditTitle: "Edit Delivery Address",
    areaLabel: "Area / Mantaqa",
    areaPlaceholder: "e.g. Downtown",
    buildingLabel: "Building / Villa / Apartment",
    buildingPlaceholder: "e.g. Burj Views Tower B, Apt 1402",
    emirateLabel: "Emirate",
    emirateSelect: "Select Emirate…",
    defaultCheckbox: "Set as default delivery address",
    cancelBtn: "Cancel",
    saveBtn: "Save Address",
    savingBtn: "Saving…",
    deleteModalTitle: "Delete Address",
    deleteModalConfirm: "Are you sure you want to delete this address? This action cannot be undone.",
    confirmDeleteBtn: "Delete Address",
    validation: {
      areaRequired: "Area / Mantaqa is required",
      buildingRequired: "Building / Villa / Apartment is required",
      emirateRequired: "Please select an Emirate",
    },
  },
  ar: {
    hintTitle: "عنوان التوصيل الافتراضي",
    hintText: "سيتم استخدام عنوان التوصيل الافتراضي تلقائياً عند إتمام الطلب.",
    homeAddress: "عنوان المنزل",
    otherAddress: "عنوان آخر",
    defaultBadge: "افتراضي",
    setAsDefault: "تعيين كافتراضي",
    editBtn: "تعديل",
    deleteBtn: "حذف",
    nameNotSet: "الاسم غير محدد",
    addNewAddress: "إضافة عنوان جديد",
    addNewSub: "أضف موقع توصيل إضافي",
    capacityNote: "يمكنك حفظ عنوانين كحد أقصى (المنزل وعنوان آخر).",
    noAddresses: "لا توجد عناوين محفوظة بعد",
    noAddressesSub: "أضف عنوان التوصيل الأساسي لتسهيل وتوفير الوقت عند الدفع.",
    addFirstBtn: "إضافة عنوان",
    modalAddTitle: "إضافة عنوان توصيل",
    modalEditTitle: "تعديل عنوان التوصيل",
    areaLabel: "المنطقة",
    areaPlaceholder: "مثال: وسط المدينة",
    buildingLabel: "المبنى / الفيلا / الشقة",
    buildingPlaceholder: "مثال: برج الفيو، شقة 1402",
    emirateLabel: "الإمارة",
    emirateSelect: "اختر الإمارة…",
    defaultCheckbox: "تعيين كعنوان توصيل افتراضي",
    cancelBtn: "إلغاء",
    saveBtn: "حفظ العنوان",
    savingBtn: "جاري الحفظ…",
    deleteModalTitle: "حذف العنوان",
    deleteModalConfirm: "هل أنت متأكد من رغبتك في حذف هذا العنوان؟ لا يمكن التراجع عن هذا الإجراء.",
    confirmDeleteBtn: "تأكيد الحذف",
    validation: {
      areaRequired: "المنطقة مطلوبة",
      buildingRequired: "المبنى أو الفيلا مطلوب",
      emirateRequired: "يرجى اختيار الإمارة",
    },
  },
};

const emptyAddr = (userData = {}) => ({
  id: -1,
  name: userData?.name || "",
  email: userData?.email || "",
  mobile: userData?.phone || "",
  area: "",
  building: "",
  emirates: "",
  isDefault: false,
});

export default function EditAddress() {
  const locale = useLocale();
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const isRtl = locale === "ar";

  const [addresses, setAddresses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  // Modal & Edit state
  const [show, setShow] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = add new
  const [form, setForm] = useState(emptyAddr());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // { addr, idx }
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch addresses on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("user");
    let customer_id = null;
    let user = null;

    if (raw) {
      try {
        user = JSON.parse(atob(raw));
        customer_id = user.id;
      } catch {}
    }

    setUserData(user);
    setCustomerId(customer_id);

    setLoading(true);
    apiClient(`api/customerAddressDetails`, {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses && data.addresses.length) {
          const parsed = data.addresses.map((addr) => {
            let buildingVal = addr.address || "";
            const areaVal = addr.area || addr.city || "";
            if (areaVal && buildingVal.startsWith(areaVal)) {
              buildingVal = buildingVal.substring(areaVal.length).trim();
            }

            return {
              id: addr.id,
              name: addr.name || user?.name || "",
              email: addr.email || user?.email || "",
              mobile: addr.phone || user?.phone || "",
              area: areaVal,
              building: buildingVal,
              emirates: addr.state || "",
              isDefault: addr.is_default === 1,
            };
          });

          // Ensure only one default
          let foundDefault = false;
          const parsedSingle = parsed.map((a) => {
            if (a.isDefault && !foundDefault) {
              foundDefault = true;
              return a;
            }
            return { ...a, isDefault: false };
          });

          setAddresses(parsedSingle);
        } else {
          setAddresses([]);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const openEdit = (idx) => {
    setEditingIndex(idx);
    setForm({ ...addresses[idx] });
    setErrors({});
    setShow(true);
  };

  const openAddNew = () => {
    if (addresses.length >= 2) return;
    setEditingIndex(null);
    setForm(emptyAddr(userData));
    setErrors({});
    setShow(true);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "isDefault") {
      setForm((f) => ({ ...f, isDefault: checked }));
    } else if (name === "area") {
      setForm((f) => ({ ...f, area: value.slice(0, 15) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSetDefault = async (addr, idx) => {
    if (!customerId || addr.isDefault) return;

    try {
      const resp = await apiClient(`api/customerAddressUpdate`, {
        method: "POST",
        body: JSON.stringify({
          address_id: addr.id,
          name: addr.name,
          email: addr.email,
          mobile: addr.mobile,
          country: "AE",
          address: `${addr.area} ${addr.building}`,
          area: addr.area,
          city: addr.area,
          state: addr.emirates,
          is_default: 1,
        }),
      });

      if (resp.ok) {
        setAddresses((prev) =>
          prev.map((a, i) => ({
            ...a,
            isDefault: i === idx,
          }))
        );

        try {
          localStorage.setItem(
            "address",
            btoa(
              JSON.stringify({
                id: addr.id,
                name: addr.name,
                email: addr.email,
                phone: addr.mobile,
                country: "AE",
                state: addr.emirates,
                city: addr.emirates,
                area: addr.area,
                address: `${addr.area} ${addr.building}`,
                customer_id: customerId,
                is_default: 1,
              })
            )
          );
        } catch {}
      }
    } catch {}
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { addr, idx } = deleteTarget;
    setDeleteLoading(true);

    try {
      const resp = await apiClient("api/customerAddressDelete", {
        method: "POST",
        body: JSON.stringify({
          address_id: addr.id,
        }),
      });

      const res = await resp.json();
      if (!resp.ok) {
        alert(res.message || "Failed to delete address.");
        return;
      }

      setAddresses((prev) => prev.filter((_, i) => i !== idx));

      // Synchronize localStorage
      try {
        const stored = localStorage.getItem("address");
        if (stored) {
          const parsed = JSON.parse(atob(stored));
          if (parsed?.id === addr.id) {
            if (res.addresses && res.addresses.length > 0) {
              const defaultAddr =
                res.addresses.find((a) => a.is_default) || res.addresses[0];
              localStorage.setItem("address", btoa(JSON.stringify(defaultAddr)));
            } else {
              localStorage.removeItem("address");
            }
          }
        }
      } catch {}

      setDeleteTarget(null);
    } catch {
      alert("Failed to delete address. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const save = async () => {
    if (!customerId) return;

    const newErrors = {};
    if (!form.area?.trim()) newErrors.area = t.validation.areaRequired;
    if (!form.building?.trim()) newErrors.building = t.validation.buildingRequired;
    if (!form.emirates?.trim()) newErrors.emirates = t.validation.emirateRequired;

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setSaving(true);

    try {
      const resp = await apiClient(`api/customerAddressUpdate`, {
        method: "POST",
        body: JSON.stringify({
          address_id: form.id,
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          country: "AE",
          address: `${form.area} ${form.building}`,
          area: form.area,
          city: form.area,
          state: form.emirates,
          is_default: form.isDefault ? 1 : 0,
        }),
      });

      const res = await resp.json();

      if (res?.message === "Unauthorized" || res?.error === "Unauthorized") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login_register";
        return;
      }

      const savedId = res?.id ?? res?.addresses?.id ?? form.id;

      if (form.isDefault) {
        try {
          localStorage.setItem(
            "address",
            btoa(
              JSON.stringify({
                id: savedId,
                name: form.name,
                email: form.email,
                phone: form.mobile,
                country: "AE",
                state: form.emirates,
                city: form.emirates,
                area: form.area,
                address: `${form.area} ${form.building}`,
                customer_id: customerId,
                is_default: 1,
              })
            )
          );
        } catch {}
      }

      setAddresses((prev) => {
        let updated;
        if (editingIndex === null) {
          updated = [...prev, { ...form, id: savedId }];
        } else {
          updated = prev.map((a, i) =>
            i === editingIndex ? { ...form, id: savedId } : a
          );
        }

        if (form.isDefault) {
          updated = updated.map((a, i) => {
            const isThis =
              editingIndex === null ? i === updated.length - 1 : i === editingIndex;
            return isThis ? a : { ...a, isDefault: false };
          });
        }

        return updated;
      });

      setShow(false);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container} dir={isRtl ? "rtl" : "ltr"}>
      {/* Top Delivery Info Banner */}
      <div className={styles.hintBanner}>
        <div className={styles.hintIcon} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <p className={styles.hintText}>{t.hintText}</p>
      </div>

      {/* Addresses List / Loading Skeletons */}
      {loading ? (
        <div className={styles.addressList}>
          {[1, 2].map((i) => (
            <div key={i} className={styles.addressCard} style={{ opacity: 0.8 }}>
              <div className={styles.cardHeader}>
                <div className={styles.skeletonRow} style={{ width: 110, height: 18 }} />
                <div className={styles.skeletonRow} style={{ width: 70, height: 22, borderRadius: 9999 }} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.skeletonRow} style={{ width: 160, height: 20 }} />
                <div className={styles.skeletonRow} style={{ width: 220, height: 15 }} />
                <div className={styles.skeletonRow} style={{ width: 260, height: 15 }} />
                <div className={styles.skeletonRow} style={{ width: 120, height: 28, alignSelf: "flex-end", borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h4 className={styles.emptyTitle}>{t.noAddresses}</h4>
          <p className={styles.emptySub}>{t.noAddressesSub}</p>
          <button
            type="button"
            className={styles.btnAction}
            style={{ marginTop: 8, background: "#111827", color: "#ffffff", borderColor: "#111827" }}
            onClick={openAddNew}
          >
            + {t.addFirstBtn}
          </button>
        </div>
      ) : (
        <div className={styles.addressList}>
          {addresses.map((addr, idx) => {
            const isHome = idx === 0;

            return (
              <div
                key={addr.id ?? idx}
                className={`${styles.addressCard} ${addr.isDefault ? styles.addressCardDefault : ""}`}
              >
                {/* Header */}
                <div className={styles.cardHeader}>
                  <span className={styles.cardCategory}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {isHome ? (
                        <>
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </>
                      ) : (
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      )}
                    </svg>
                    {isHome ? t.homeAddress : t.otherAddress}
                  </span>

                  {addr.isDefault && (
                    <span className={styles.badgeDefault}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {t.defaultBadge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className={styles.cardBody}>
                  <h4 className={styles.recipientName}>
                    {addr.name || <span style={{ color: "#9ca3af", fontWeight: 400 }}>{t.nameNotSet}</span>}
                  </h4>

                  {(addr.email || addr.mobile) && (
                    <div className={styles.contactRow}>
                      {addr.mobile && (
                        <span className={styles.contactItem}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          {addr.mobile}
                        </span>
                      )}
                      {addr.email && (
                        <span className={styles.contactItem}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          {addr.email}
                        </span>
                      )}
                    </div>
                  )}

                  <div className={styles.addressRow}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.addressIcon}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>
                      {addr.area}
                      {addr.area && addr.building && ", "}
                      {addr.building}
                      {addr.emirates && `, ${addr.emirates}`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        className={`${styles.btnAction} ${styles.btnActionDefault}`}
                        onClick={() => handleSetDefault(addr, idx)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 14 14" />
                        </svg>
                        {t.setAsDefault}
                      </button>
                    )}

                    <button
                      type="button"
                      className={styles.btnAction}
                      onClick={() => openEdit(idx)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      {t.editBtn}
                    </button>

                    <button
                      type="button"
                      className={`${styles.btnAction} ${styles.btnActionDelete}`}
                      onClick={() => setDeleteTarget({ addr, idx })}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      {t.deleteBtn}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Address Card (when < 2) */}
      {!loading && addresses.length < 2 && (
        <button
          type="button"
          className={styles.btnAddCard}
          onClick={openAddNew}
        >
          <div className={styles.addIconCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <h5 className={styles.btnAddCardText}>{t.addNewAddress}</h5>
          <p className={styles.btnAddCardSub}>{t.addNewSub}</p>
        </button>
      )}

      {!loading && addresses.length >= 2 && (
        <p className={styles.capacityNote}>{t.capacityNote}</p>
      )}

      {/* Custom Add / Edit Modal */}
      {show && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) setShow(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <div className={styles.modalIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h4 className={styles.modalTitle}>
                  {editingIndex === null ? t.modalAddTitle : t.modalEditTitle}
                </h4>
              </div>

              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShow(false)}
                disabled={saving}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Emirate Select */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t.emirateLabel}</label>
                <select
                  name="emirates"
                  value={form.emirates}
                  onChange={handleChange}
                  className={`${styles.selectInput} ${errors.emirates ? styles.inputError : ""}`}
                >
                  <option value="">{t.emirateSelect}</option>
                  {EMIRATES.map((em) => (
                    <option key={em} value={em}>
                      {em}
                    </option>
                  ))}
                </select>
                {errors.emirates && (
                  <span className={styles.fieldErrorText}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.emirates}
                  </span>
                )}
              </div>

              {/* Area / Mantaqa */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t.areaLabel}</label>
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  maxLength={15}
                  placeholder={t.areaPlaceholder}
                  className={`${styles.textInput} ${errors.area ? styles.inputError : ""}`}
                  autoFocus
                />
                {errors.area && (
                  <span className={styles.fieldErrorText}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.area}
                  </span>
                )}
              </div>

              {/* Building / Villa / Apartment */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t.buildingLabel}</label>
                <input
                  type="text"
                  name="building"
                  value={form.building}
                  onChange={handleChange}
                  placeholder={t.buildingPlaceholder}
                  className={`${styles.textInput} ${errors.building ? styles.inputError : ""}`}
                />
                {errors.building && (
                  <span className={styles.fieldErrorText}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.building}
                  </span>
                )}
              </div>

              {/* Default Address Checkbox */}
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxLabel}>{t.defaultCheckbox}</span>
              </label>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnModalCancel}
                onClick={() => setShow(false)}
                disabled={saving}
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                className={styles.btnModalSave}
                onClick={save}
                disabled={saving}
              >
                {saving && <span className={styles.spinnerSmall} />}
                {saving ? t.savingBtn : t.saveBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteLoading) setDeleteTarget(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.confirmDeleteWindow}>
            <div className={styles.deleteIconCircle}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h4 className={styles.deleteTitle}>{t.deleteModalTitle}</h4>
            <p className={styles.deleteSub}>{t.deleteModalConfirm}</p>

            <div className={styles.deleteActions}>
              <button
                type="button"
                className={styles.btnModalCancel}
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                className={styles.btnConfirmDelete}
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading && <span className={styles.spinnerSmall} />}
                {deleteLoading ? t.savingBtn : t.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
