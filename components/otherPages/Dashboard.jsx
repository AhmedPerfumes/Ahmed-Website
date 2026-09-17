"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLocale } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";
import styles from "./Dashboard.module.css";

const TRANSLATIONS = {
  en: {
    heroGreeting: "My Account",
    verifiedBadge: "Verified Account",
    personalInfoTitle: "Personal Information",
    personalInfoSub: "Manage your personal profile and contact details",
    securityTitle: "Security & Login",
    securitySub: "Keep your account secure with a strong password",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    mobileLabel: "Mobile Number",
    passwordLabel: "Account Password",
    passwordMasked: "••••••••••••",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "Enter your email address",
    mobilePlaceholder: "e.g. 0500000000",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Minimum 6 characters",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-type new password",
    passwordHint: "Ensure password is at least 6 characters.",
    editBtn: "Edit",
    cancelBtn: "Cancel",
    doneBtn: "Done",
    notSet: "Not set",
    unsavedTitle: "You have unsaved changes",
    unsavedSub: "Click save to apply your updated profile information.",
    discardBtn: "Discard",
    saveChangesBtn: "Save Changes",
    confirmModalTitle: "Confirm Security Details",
    confirmModalSub: "For your security, please enter your current password to authorize changes.",
    currentPasswordLabel: "Current Password",
    currentPasswordPlaceholder: "Enter current password",
    saveBtn: "Save",
    savingBtn: "Saving…",
    savePasswordBtn: "Save Password",
    passwordSuccessMsg: "Password updated successfully!",
    successMsg: "Profile updated successfully!",
    validation: {
      nameRequired: "Full name is required.",
      nameMin: "Full name must be at least 2 characters.",
      nameMax: "Full name must not exceed 120 characters.",
      emailRequired: "Email address is required.",
      emailInvalid: "Please enter a valid email address.",
      mobileRequired: "Mobile number is required.",
      mobileInvalid: "Please enter a valid mobile number (9–15 digits).",
      passMin: "New password must be at least 6 characters.",
      passMatch: "Passwords do not match.",
      currentPassRequired: "Please enter your current password to confirm changes.",
      wrongPass: "Incorrect password. Please try again.",
      verifyFail: "Could not verify password. Please try again.",
      updateFail: "Failed to update details. Please check inputs.",
      networkError: "Network error. Please try again.",
    },
  },
  ar: {
    heroGreeting: "حسابي الشخصي",
    verifiedBadge: "حساب موثق",
    personalInfoTitle: "البيانات الشخصية",
    personalInfoSub: "إدارة بيانات ملفك الشخصي ومعلومات الاتصال",
    securityTitle: "الأمان وتسجيل الدخول",
    securitySub: "حافظ على أمان حسابك بكلمة مرور قوية",
    nameLabel: "الاسم الكامل",
    emailLabel: "البريد الإلكتروني",
    mobileLabel: "رقم الهاتف",
    passwordLabel: "كلمة مرور الحساب",
    passwordMasked: "••••••••••••",
    namePlaceholder: "أدخل اسمك الكامل",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    mobilePlaceholder: "مثال: 0500000000",
    newPasswordLabel: "كلمة المرور الجديدة",
    newPasswordPlaceholder: "6 أحرف كحد أدنى",
    confirmPasswordLabel: "تأكيد كلمة المرور",
    confirmPasswordPlaceholder: "أعد كتابة كلمة المرور",
    passwordHint: "يجب ألا تقل كلمة المرور عن 6 أحرف.",
    editBtn: "تعديل",
    cancelBtn: "إلغاء",
    doneBtn: "تم",
    notSet: "غير محدد",
    unsavedTitle: "لديك تغييرات غير محفوظة",
    unsavedSub: "اضغط حفظ لتطبيق بيانات حسابك الجديدة.",
    discardBtn: "تراجع",
    saveChangesBtn: "حفظ التغييرات",
    confirmModalTitle: "تأكيد الأمان",
    confirmModalSub: "لحماية أمان حسابك، يُرجى إدخال كلمة مرورك الحالية لتأكيد التحديث.",
    currentPasswordLabel: "كلمة المرور الحالية",
    currentPasswordPlaceholder: "أدخل كلمة المرور الحالية",
    saveBtn: "حفظ",
    savingBtn: "جاري الحفظ…",
    savePasswordBtn: "حفظ كلمة المرور",
    passwordSuccessMsg: "تم تحديث كلمة المرور بنجاح!",
    successMsg: "تم تحديث البيانات بنجاح!",
    validation: {
      nameRequired: "الاسم الكامل مطلوب.",
      nameMin: "يجب ألا يقل الاسم عن حرفين.",
      nameMax: "يجب ألا يزيد الاسم عن 120 حرفاً.",
      emailRequired: "البريد الإلكتروني مطلوب.",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
      mobileRequired: "رقم الهاتف مطلوب.",
      mobileInvalid: "يرجى إدخال رقم هاتف صحيح (9 إلى 15 رقم).",
      passMin: "يجب ألا تقل كلمة المرور الجديدة عن 6 أحرف.",
      passMatch: "كلمتا المرور غير متطابقتين.",
      currentPassRequired: "يرجى إدخال كلمة المرور الحالية لتأكيد التعديلات.",
      wrongPass: "كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
      verifyFail: "تعذر التحقق من كلمة المرور. يرجى المحاولة مجدداً.",
      updateFail: "فشل تحديث البيانات. يرجى مراجعة الحقول.",
      networkError: "خطأ في الاتصال بالشبكة. يرجى المحاولة مجدداً.",
    },
  },
};

export default function MyDetails() {
  const locale = useLocale();
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const isRtl = locale === "ar";
  const { setUser } = useUser() || {};

  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [initialDetails, setInitialDetails] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
  });

  const [values, setValues] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const [edit, setEdit] = useState({
    customer_name: false,
    customer_email: false,
    customer_mobile: false,
    password: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
    password: "",
  });

  // Modal states
  const [saveDialog, setSaveDialog] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showVerifyPass, setShowVerifyPass] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Direct password save states
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Load customer id from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(atob(raw));
        if (user && user.id) {
          setCustomerId(user.id);
        }
      } catch {}
    }
  }, []);

  // Fetch customer details
  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    apiClient(`api/customerDetails`, {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((json) => {
        const name = json.customer_name || "";
        const email = json.customer_email || "";
        const mobile = json.customer_mobile || "";

        const loaded = {
          customer_name: name,
          customer_email: email,
          customer_mobile: mobile,
        };

        setValues((v) => ({
          ...v,
          ...loaded,
          password: "",
          new_password: "",
          confirm_password: "",
        }));
        setInitialDetails(loaded);

        const updatedUser = {
          id: customerId,
          name,
          email,
          phone: mobile,
        };
        localStorage.setItem("user", btoa(JSON.stringify(updatedUser)));
        if (setUser) setUser(updatedUser);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId, setUser]);

  // Derived user avatar initials
  const initials = useMemo(() => {
    const rawName = values.customer_name || initialDetails.customer_name || "";
    const parts = rawName.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "AM";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [values.customer_name, initialDetails.customer_name]);

  // Check if personal details were edited (password has direct save flow)
  const isEdited =
    values.customer_name !== initialDetails.customer_name ||
    values.customer_email !== initialDetails.customer_email ||
    values.customer_mobile !== initialDetails.customer_mobile;

  // Field validation
  const validateField = (field, val, currentValues = values) => {
    const trimmed = (val || "").toString().trim();
    if (field === "customer_name") {
      if (!trimmed) return t.validation.nameRequired;
      if (trimmed.length < 2) return t.validation.nameMin;
      if (trimmed.length > 120) return t.validation.nameMax;
      return "";
    }
    if (field === "customer_email") {
      if (!trimmed) return t.validation.emailRequired;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return t.validation.emailInvalid;
      return "";
    }
    if (field === "customer_mobile") {
      if (!trimmed) return t.validation.mobileRequired;
      const phoneRegex = /^\d{9,15}$/;
      if (!phoneRegex.test(trimmed)) return t.validation.mobileInvalid;
      return "";
    }
    if (field === "password") {
      const newPass = currentValues.new_password || "";
      const confPass = currentValues.confirm_password || "";
      if (newPass || confPass) {
        if (newPass.length < 6) return t.validation.passMin;
        if (newPass !== confPass) return t.validation.passMatch;
      }
      return "";
    }
    return "";
  };

  const toggleEdit = (field) => {
    if (edit[field]) {
      // Closing edit: validate or keep value
      const err = validateField(field, values[field]);
      setFieldErrors((f) => ({ ...f, [field]: err }));
      setEdit((e) => ({ ...e, [field]: false }));
    } else {
      setEdit((e) => ({ ...e, [field]: true }));
      setFieldErrors((f) => ({ ...f, [field]: "" }));
    }
  };

  const cancelEdit = (field) => {
    setValues((v) => ({
      ...v,
      [field]: initialDetails[field] || "",
      new_password: "",
      confirm_password: "",
    }));
    setEdit((e) => ({ ...e, [field]: false }));
    setPasswordSuccess("");
    setFieldErrors((f) => ({
      ...f,
      [field]: "",
      ...(field === "password" ? { password: "" } : {}),
    }));
  };

  const discardAll = () => {
    setValues({
      customer_name: initialDetails.customer_name || "",
      customer_email: initialDetails.customer_email || "",
      customer_mobile: initialDetails.customer_mobile || "",
      password: "",
      new_password: "",
      confirm_password: "",
    });
    setEdit({
      customer_name: false,
      customer_email: false,
      customer_mobile: false,
      password: false,
    });
    setFieldErrors({
      customer_name: "",
      customer_email: "",
      customer_mobile: "",
      password: "",
    });
    setError("");
  };

  const handleChange = (field, value) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);

    if (field === "new_password" || field === "confirm_password") {
      const passErr = validateField("password", "", newValues);
      setFieldErrors((f) => ({ ...f, password: passErr }));
    } else {
      const err = validateField(field, value, newValues);
      setFieldErrors((f) => ({ ...f, [field]: err }));
    }
  };

  const validateAll = () => {
    const errors = {
      customer_name: validateField("customer_name", values.customer_name),
      customer_email: validateField("customer_email", values.customer_email),
      customer_mobile: validateField("customer_mobile", values.customer_mobile),
      password: validateField("password", "", values),
    };

    setFieldErrors(errors);
    return !Object.values(errors).some((err) => Boolean(err));
  };

  const handleShowSave = () => {
    if (!validateAll()) return;
    setVerifyPassword("");
    setShowVerifyPass(false);
    setError("");
    setSuccess("");
    setSaveDialog(true);
  };

  const handleSave = async () => {
    if (!validateAll()) return;

    if (!verifyPassword) {
      setError(t.validation.currentPassRequired);
      return;
    }

    setSaveLoading(true);
    setError("");
    setSuccess("");

    // 1. Verify current password
    try {
      const passCheckResp = await apiClient(`api/customerPasswordCheck`, {
        method: "POST",
        body: JSON.stringify({
          customer_id: customerId,
          customer_password: verifyPassword,
        }),
      });
      const passCheck = await passCheckResp.json();

      if (
        passCheck.message &&
        passCheck.message.toLowerCase().includes("incorrect password")
      ) {
        setError(t.validation.wrongPass);
        setSaveLoading(false);
        return;
      }
    } catch {
      setError(t.validation.verifyFail);
      setSaveLoading(false);
      return;
    }

    // 2. Submit customer update
    try {
      const resp = await apiClient(`api/customerUpdate`, {
        method: "POST",
        body: JSON.stringify({
          customer_name: values.customer_name,
          customer_email: values.customer_email,
          customer_mobile: values.customer_mobile,
          customer_password: values.new_password ? values.new_password : undefined,
        }),
      });
      const res = await resp.json();

      if (
        resp.status === 422 ||
        (res.message && res.message !== "Customer Updated Successfully")
      ) {
        const newFieldErrors = {
          customer_name: "",
          customer_email: "",
          customer_mobile: "",
          password: "",
        };

        if (res.errors) {
          if (res.errors.customer_name) newFieldErrors.customer_name = res.errors.customer_name[0];
          if (res.errors.customer_email) newFieldErrors.customer_email = res.errors.customer_email[0];
          if (res.errors.customer_mobile) newFieldErrors.customer_mobile = res.errors.customer_mobile[0];
          if (res.errors.customer_password) newFieldErrors.password = res.errors.customer_password[0];

          const firstErrKey = Object.keys(res.errors)[0];
          setError(res.errors[firstErrKey][0]);
        } else {
          setError(res.message || t.validation.updateFail);
        }

        setFieldErrors(newFieldErrors);
        setSaveLoading(false);
        return;
      }

      // Success
      const updatedValues = {
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_mobile: values.customer_mobile,
      };

      setInitialDetails(updatedValues);

      const updatedUser = {
        id: customerId,
        name: values.customer_name,
        email: values.customer_email,
        phone: values.customer_mobile,
      };
      localStorage.setItem("user", btoa(JSON.stringify(updatedUser)));
      if (setUser) setUser(updatedUser);

      setEdit({
        customer_name: false,
        customer_email: false,
        customer_mobile: false,
        password: false,
      });

      setValues((v) => ({
        ...v,
        password: "",
        new_password: "",
        confirm_password: "",
      }));
      setFieldErrors({
        customer_name: "",
        customer_email: "",
        customer_mobile: "",
        password: "",
      });

      setSuccess(t.successMsg);
      setError("");

      setTimeout(() => {
        setSaveDialog(false);
        setSuccess("");
      }, 1500);
    } catch {
      setError(t.validation.networkError);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSavePasswordDirectly = async () => {
    const newPass = (values.new_password || "").trim();
    const confPass = (values.confirm_password || "").trim();

    if (!newPass) {
      setFieldErrors((f) => ({ ...f, password: t.validation.passMin }));
      return;
    }
    if (newPass.length < 6) {
      setFieldErrors((f) => ({ ...f, password: t.validation.passMin }));
      return;
    }
    if (newPass !== confPass) {
      setFieldErrors((f) => ({ ...f, password: t.validation.passMatch }));
      return;
    }

    setPasswordLoading(true);
    setPasswordSuccess("");
    setFieldErrors((f) => ({ ...f, password: "" }));

    try {
      const resp = await apiClient(`api/customerUpdate`, {
        method: "POST",
        body: JSON.stringify({
          customer_name: initialDetails.customer_name || values.customer_name,
          customer_email: initialDetails.customer_email || values.customer_email,
          customer_mobile: initialDetails.customer_mobile || values.customer_mobile,
          customer_password: newPass,
        }),
      });
      const res = await resp.json();

      if (
        resp.status === 422 ||
        (res.message && res.message !== "Customer Updated Successfully")
      ) {
        if (res.errors && res.errors.customer_password) {
          setFieldErrors((f) => ({ ...f, password: res.errors.customer_password[0] }));
        } else {
          setFieldErrors((f) => ({
            ...f,
            password: res.message || t.validation.updateFail,
          }));
        }
        setPasswordLoading(false);
        return;
      }

      // Success
      setPasswordSuccess(t.passwordSuccessMsg);
      setValues((v) => ({
        ...v,
        password: "",
        new_password: "",
        confirm_password: "",
      }));
      setFieldErrors((f) => ({ ...f, password: "" }));

      setTimeout(() => {
        setEdit((e) => ({ ...e, password: false }));
        setPasswordSuccess("");
      }, 1400);
    } catch {
      setFieldErrors((f) => ({ ...f, password: t.validation.networkError }));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className={styles.container} dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero Profile Summary Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <div className={styles.avatarCircle} aria-hidden="true">
            {initials}
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroTitleRow}>
              <h3 className={styles.heroName}>
                {loading ? (
                  <div className={styles.skeletonRow} style={{ width: 140 }} />
                ) : (
                  values.customer_name || t.notSet
                )}
              </h3>
              <span className={styles.badgeVerified}>
                <span className={styles.verifiedDot} />
                {t.verifiedBadge}
              </span>
            </div>
            <p className={styles.heroEmail}>
              {loading ? (
                <div className={styles.skeletonRow} style={{ width: 180, height: 14, marginTop: 4 }} />
              ) : (
                values.customer_email || t.notSet
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Card 1: Personal Information */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h4 className={styles.sectionTitle}>{t.personalInfoTitle}</h4>
              <p className={styles.sectionSub}>{t.personalInfoSub}</p>
            </div>
          </div>
        </div>

        <div className={styles.fieldsList}>
          {/* Full Name Row */}
          <div className={`${styles.fieldRow} ${edit.customer_name ? styles.fieldRowActive : ""}`}>
            <div className={styles.fieldMain}>
              <div className={styles.fieldLabelArea}>
                <span className={styles.fieldLabel}>{t.nameLabel}</span>
                <span className={styles.fieldValue}>
                  {loading ? (
                    <div className={styles.skeletonRow} style={{ width: 160 }} />
                  ) : (
                    values.customer_name || <span className={styles.fieldValueEmpty}>{t.notSet}</span>
                  )}
                </span>
              </div>
              <button
                type="button"
                className={`${styles.actionBtn} ${edit.customer_name ? styles.actionBtnActive : ""}`}
                onClick={() => toggleEdit("customer_name")}
                aria-expanded={edit.customer_name}
              >
                {edit.customer_name ? t.doneBtn : t.editBtn}
              </button>
            </div>

            {edit.customer_name && (
              <div className={styles.inlineEditArea}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>{t.nameLabel}</label>
                  <input
                    type="text"
                    className={`${styles.textInput} ${fieldErrors.customer_name ? styles.textInputError : ""}`}
                    placeholder={t.namePlaceholder}
                    value={values.customer_name}
                    onChange={(e) => handleChange("customer_name", e.target.value)}
                    autoFocus
                  />
                  {fieldErrors.customer_name && (
                    <span className={styles.fieldErrorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {fieldErrors.customer_name}
                    </span>
                  )}
                </div>
                <div className={styles.inlineActionsRow}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => cancelEdit("customer_name")}
                  >
                    {t.cancelBtn}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Email Address Row */}
          <div className={`${styles.fieldRow} ${edit.customer_email ? styles.fieldRowActive : ""}`}>
            <div className={styles.fieldMain}>
              <div className={styles.fieldLabelArea}>
                <span className={styles.fieldLabel}>{t.emailLabel}</span>
                <span className={styles.fieldValue}>
                  {loading ? (
                    <div className={styles.skeletonRow} style={{ width: 200 }} />
                  ) : (
                    values.customer_email || <span className={styles.fieldValueEmpty}>{t.notSet}</span>
                  )}
                </span>
              </div>
              <button
                type="button"
                className={`${styles.actionBtn} ${edit.customer_email ? styles.actionBtnActive : ""}`}
                onClick={() => toggleEdit("customer_email")}
                aria-expanded={edit.customer_email}
              >
                {edit.customer_email ? t.doneBtn : t.editBtn}
              </button>
            </div>

            {edit.customer_email && (
              <div className={styles.inlineEditArea}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>{t.emailLabel}</label>
                  <input
                    type="email"
                    className={`${styles.textInput} ${fieldErrors.customer_email ? styles.textInputError : ""}`}
                    placeholder={t.emailPlaceholder}
                    value={values.customer_email}
                    onChange={(e) => handleChange("customer_email", e.target.value)}
                    autoFocus
                  />
                  {fieldErrors.customer_email && (
                    <span className={styles.fieldErrorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {fieldErrors.customer_email}
                    </span>
                  )}
                </div>
                <div className={styles.inlineActionsRow}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => cancelEdit("customer_email")}
                  >
                    {t.cancelBtn}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Number Row */}
          <div className={`${styles.fieldRow} ${edit.customer_mobile ? styles.fieldRowActive : ""}`}>
            <div className={styles.fieldMain}>
              <div className={styles.fieldLabelArea}>
                <span className={styles.fieldLabel}>{t.mobileLabel}</span>
                <span className={styles.fieldValue}>
                  {loading ? (
                    <div className={styles.skeletonRow} style={{ width: 140 }} />
                  ) : (
                    values.customer_mobile || <span className={styles.fieldValueEmpty}>{t.notSet}</span>
                  )}
                </span>
              </div>
              <button
                type="button"
                className={`${styles.actionBtn} ${edit.customer_mobile ? styles.actionBtnActive : ""}`}
                onClick={() => toggleEdit("customer_mobile")}
                aria-expanded={edit.customer_mobile}
              >
                {edit.customer_mobile ? t.doneBtn : t.editBtn}
              </button>
            </div>

            {edit.customer_mobile && (
              <div className={styles.inlineEditArea}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>{t.mobileLabel}</label>
                  <input
                    type="tel"
                    className={`${styles.textInput} ${fieldErrors.customer_mobile ? styles.textInputError : ""}`}
                    placeholder={t.mobilePlaceholder}
                    value={values.customer_mobile}
                    onChange={(e) => handleChange("customer_mobile", e.target.value)}
                    autoFocus
                  />
                  {fieldErrors.customer_mobile && (
                    <span className={styles.fieldErrorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {fieldErrors.customer_mobile}
                    </span>
                  )}
                </div>
                <div className={styles.inlineActionsRow}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => cancelEdit("customer_mobile")}
                  >
                    {t.cancelBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Security & Password */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h4 className={styles.sectionTitle}>{t.securityTitle}</h4>
              <p className={styles.sectionSub}>{t.securitySub}</p>
            </div>
          </div>
        </div>

        <div className={styles.fieldsList}>
          <div className={`${styles.fieldRow} ${edit.password ? styles.fieldRowActive : ""}`}>
            <div className={styles.fieldMain}>
              <div className={styles.fieldLabelArea}>
                <span className={styles.fieldLabel}>{t.passwordLabel}</span>
                <span className={`${styles.fieldValue} ${styles.fieldValueMasked}`}>
                  {t.passwordMasked}
                </span>
              </div>
              <button
                type="button"
                className={`${styles.actionBtn} ${edit.password ? styles.actionBtnActive : styles.actionBtnGold}`}
                onClick={() => (edit.password ? cancelEdit("password") : toggleEdit("password"))}
                aria-expanded={edit.password}
              >
                {edit.password ? t.cancelBtn : t.editBtn}
              </button>
            </div>

            {edit.password && (
              <div className={styles.inlineEditArea}>
                <p className={styles.passwordHint}>{t.passwordHint}</p>
                <div className={styles.passwordGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>{t.newPasswordLabel}</label>
                    <input
                      type="password"
                      className={`${styles.textInput} ${fieldErrors.password ? styles.textInputError : ""}`}
                      placeholder={t.newPasswordPlaceholder}
                      value={values.new_password}
                      onChange={(e) => handleChange("new_password", e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>{t.confirmPasswordLabel}</label>
                    <input
                      type="password"
                      className={`${styles.textInput} ${fieldErrors.password ? styles.textInputError : ""}`}
                      placeholder={t.confirmPasswordPlaceholder}
                      value={values.confirm_password}
                      onChange={(e) => handleChange("confirm_password", e.target.value)}
                    />
                  </div>
                </div>

                {fieldErrors.password && (
                  <span className={styles.fieldErrorText}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {fieldErrors.password}
                  </span>
                )}

                {passwordSuccess && (
                  <div className={styles.passwordSuccessBanner}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {passwordSuccess}
                  </div>
                )}

                <div className={styles.passwordActionsRow}>
                  <button
                    type="button"
                    className={styles.btnSavePassword}
                    onClick={handleSavePasswordDirectly}
                    disabled={passwordLoading}
                  >
                    {passwordLoading && <span className={styles.spinnerSmall} />}
                    {passwordLoading ? t.savingBtn : t.savePasswordBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Docked / Floating Action Bar when changes exist */}
      {isEdited && (
        <div className={styles.dockedSaveBar} role="region" aria-label="Unsaved changes banner">
          <div className={styles.dockedBarLeft}>
            <span className={styles.unsavedDot} />
            <div className={styles.dockedBarText}>
              <span className={styles.dockedBarTitle}>{t.unsavedTitle}</span>
              <span className={styles.dockedBarSubtitle}>{t.unsavedSub}</span>
            </div>
          </div>
          <div className={styles.dockedBarButtons}>
            <button
              type="button"
              className={styles.btnDiscard}
              onClick={discardAll}
            >
              {t.discardBtn}
            </button>
            <button
              type="button"
              className={styles.btnSave}
              onClick={handleShowSave}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t.saveChangesBtn}
            </button>
          </div>
        </div>
      )}

      {/* Verification Password Modal */}
      {saveDialog && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget && !saveLoading) {
              setSaveDialog(false);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalWindow}>
            {success ? (
              /* Success Screen with Order Complete Checkmark */
              <div className={styles.successOverlay}>
                <div className={styles.tickWrapper}>
                  <svg className={styles.tickSvg} viewBox="0 0 52 52">
                    <circle className={styles.tickCircle} cx="26" cy="26" r="24" />
                    <path className={styles.tickCheck} d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h4 className={styles.successTitle}>{t.successMsg}</h4>
                <p className={styles.successSub}>{t.unsavedSub}</p>
              </div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <button
                    type="button"
                    className={styles.modalCloseBtn}
                    onClick={() => setSaveDialog(false)}
                    aria-label="Close"
                    disabled={saveLoading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <div className={styles.modalShieldIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h4 className={styles.modalTitle}>{t.confirmModalTitle}</h4>
                  <p className={styles.modalSubtitle}>{t.confirmModalSub}</p>
                </div>

                <div className={styles.modalBody}>
                  {error && (
                    <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>{t.currentPasswordLabel}</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type={showVerifyPass ? "text" : "password"}
                        className={styles.textInput}
                        placeholder={t.currentPasswordPlaceholder}
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !saveLoading) {
                            handleSave();
                          }
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className={styles.passwordToggleBtn}
                        onClick={() => setShowVerifyPass(!showVerifyPass)}
                        aria-label="Toggle password visibility"
                      >
                        {showVerifyPass ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className={styles.modalFooter}>
                    <button
                      type="button"
                      className={styles.btnModalCancel}
                      onClick={() => setSaveDialog(false)}
                      disabled={saveLoading}
                    >
                      {t.cancelBtn}
                    </button>
                    <button
                      type="button"
                      className={styles.btnModalConfirm}
                      onClick={handleSave}
                      disabled={saveLoading}
                    >
                      {saveLoading && <span className={styles.spinnerSmall} />}
                      {saveLoading ? t.savingBtn : t.saveBtn}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
