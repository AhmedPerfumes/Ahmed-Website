"use client";

import { useContextElement } from "@/context/Context";
import { useUser } from "@/context/UserContext";
import { useMenu } from "@/context/MenuContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import he from "he";
import { products1 } from "@/data/products/fashion";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Pagination1 from "../common/Pagination1";
import FreeGiftFeature from "@/components/FreeGiftFeature";
import BogoFeature from "@/components/BogoFeature";
import { data } from "jquery";
import { useSearchParams } from "next/navigation";
import { toast } from 'react-toastify';
import TamaraWidget from "@/components/TamaraWidget";
// import { bogoProducts } from "@/components/BogoFeature";

const countries = [ "Abu Dhabi", "Ajman", "Al Ain", "Dubai", "Fujairah", "Ras Al Khaymah", "Sharjah", "Umm Al Quwain", ];

export default function Checkout() {
  // STATES
  const [coupons, setCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [idDDActive, setIdDDActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("cod");
  const [createAccount, setCreateAccount] = useState(false);
  const [finalPriceState, setFinalPriceState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [OTPError, setOTPError] = useState(null);
  const [OTPSuccess, setOTPSuccess] = useState(null);
  const [isSendOTPLoading, setIsSendOTPLoading] = useState(false);
  const [isOTPButton, setIsOTPButton] = useState(true);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(null);
  const [couponData, setCouponData] = useState(null);
  const [formData, setFormData] = useState({
    shippingAddress: { first_name: "", last_name: "", mobile: "", email: "", country: "AE", area: "", building: "", emirates: "", },
    billingAddress: { first_name: "", last_name: "", mobile: "", email: "", country: "AE", area: "", building: "", emirates: "", },
    shippingAdd: false,
    note: "",
    password: "",
    otp: "",
  });
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressUpdateSuccess, setAddressUpdateSuccess] = useState(null);
  // Address management
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressPanel, setShowAddressPanel] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressSaveError, setAddressSaveError] = useState(null);
  const [newAddressForm, setNewAddressForm] = useState({ area: "", building: "", emirates: "" });

  // CONTEXT & HOOKS
  const t = useTranslations("Tabby")
  const { shippingServiceCharges, vatTax, isLoading: isMenuLoading, error: isMenuError, currency, } = useMenu();
  const {cartProducts, totalPrice, freeShippingFlag, setOrderDetails, setCouponDataContext, setCartProducts, removeGiftFromCart, promotionsContext, actualTotalPrice, hasPreBookItem } = useContextElement();
  const router = useRouter();
  const locale = useLocale();
  const { isLoggedIn } = useUser();
  const hasCleaned = useRef(false);
  const hasFetchedRef = useRef(false);
  const hasUserSelectedRef = useRef(false); // Issue #1 fix: true once user manually picks an address
  const searchParams = useSearchParams();
  const disablePlaceOrder = isLoading || (!isLoggedIn && !isOTPVerified) || (isLoggedIn && formData.shippingAdd && !isOTPVerified); 

  // USE EFFECTS
  useEffect(() => {
    if (hasPreBookItem) { setSelectedOption("paytabs"); }
  }, [hasPreBookItem]);

  // Capture removeGiftFromCart in a ref so it can be called on unmount without re-subscribing to renders
  const removeGiftFromCartRef = useRef(removeGiftFromCart);
  useEffect(() => {
    removeGiftFromCartRef.current = removeGiftFromCart;
  });

  // Clean up FOC gifts when leaving checkout — runs ONLY on unmount (empty deps [])
  useEffect(() => {
    return () => {
      removeGiftFromCartRef.current();
    };
  }, []);

  useEffect(() => {
    if (hasCleaned.current) return;
    // Check if any regular (non-gift, non-free) products are in BOGO
    const hasBogoRegularItems = cartProducts.some((item) => 
      !item.is_gift && 
      promotionsContext.some((promo) => promo.buy_products.some((buyItem) => buyItem.product_id === item.product_id))
    );
    
    if (!hasBogoRegularItems) {
      // Only remove coupon properties from products that have no BOGO and no discount
      const cleanedCart = cartProducts.map((item) => {
        const hasDiscount = item.discount != null;
        if (!hasDiscount) {
          const { is_coupon, value, ...rest } = item;
          return rest;
        }
        return item;
      });
      setCartProducts(cleanedCart);
      setCouponDataContext(null);
      hasCleaned.current = true; // prevent future runs
    }
  }, [cartProducts, promotionsContext, setCartProducts, setCouponDataContext]);

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 1 — Instant localStorage pre-fill (zero network latency)
  // Reads `user` and `address` from localStorage and populates the form
  // immediately. This is the reliable fallback that always works, even on
  // slow/offline mobile connections with no API response yet.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    let firstName = "", lastName = "", email = "", mobile = "",
        area = "", building = "", emirates = "";

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(atob(userStr));
        email = user.email || "";
        mobile = user.phone || user.mobile || "";
        if (user.name) {
          const [f, ...lArr] = user.name.split(" ");
          firstName = f || "";
          lastName = lArr.join(" ") || "";
        }
      }
    } catch {}

    try {
      const addrStr = localStorage.getItem("address");
      if (addrStr) {
        const addr = JSON.parse(atob(addrStr));
        area = addr.city || "";
        building = addr.address || "";
        emirates = addr.state || "";
      }
    } catch {}

    // Always set — localStorage is the ground truth for the instant fill.
    // The API phase below will overwrite with fresher data when it arrives.
    setFormData((prev) => ({
      ...prev,
      billingAddress:  { ...prev.billingAddress,  first_name: firstName, last_name: lastName, email, mobile, area, building, emirates },
      shippingAddress: { ...prev.shippingAddress, first_name: firstName, last_name: lastName, email, mobile, area, building, emirates },
    }));
  }, [isLoggedIn]);

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2 — API enrichment (fetches all saved addresses)
  // Runs after Phase 1. When the API responds:
  //   1. Displays all saved address tiles so user can switch between them.
  //   2. Writes the default/first address back to localStorage so the NEXT
  //      visit is also instant (keeps localStorage always up to date).
  //   3. Overwrites form fields with the authoritative API data.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    const raw = localStorage.getItem("user");
    if (!raw) return;
    let customer_id = null;
    try { customer_id = JSON.parse(atob(raw)).id; } catch {}
    if (!customer_id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/customerAddressDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses && data.addresses.length) {
          const raw2 = localStorage.getItem("user");
          const userData = raw2 ? JSON.parse(atob(raw2)) : {};
          const parsed = data.addresses.map((addr) => {
            // Extract building part if address starts with area
            let buildingVal = addr.address || "";
            const areaVal = addr.area || addr.city || "";
            if (areaVal && buildingVal.startsWith(areaVal)) {
              buildingVal = buildingVal.substring(areaVal.length).trim();
            }

            return {
              id: addr.id,
              name: addr.name || userData?.name || "",
              email: addr.email || userData?.email || "",
              mobile: addr.phone || userData?.phone || "",
              area: areaVal,
              building: buildingVal,
              emirates: addr.state || "",
              isDefault: addr.is_default === 1,
            };
          });
          // Ensure only one address is marked as default (first wins)
          let foundDefault = false;
          const parsedSingle = parsed.map((a) => {
            if (a.isDefault && !foundDefault) { foundDefault = true; return a; }
            return { ...a, isDefault: false };
          });
          setSavedAddresses(parsedSingle);

          // Pick the default (or first) address
          const def = parsedSingle.find((a) => a.isDefault) || parsedSingle[0];
          if (def) {
            // ── Issue #2 fix: ALWAYS sync localStorage with the real DB default ──
            // localStorage.address must only ever reflect the true default, not
            // whatever address was clicked during a previous checkout session.
            try {
              localStorage.setItem("address", btoa(JSON.stringify({
                id: def.id,
                city: def.area,
                address: def.building,
                state: def.emirates,
                name: def.name,
                email: def.email,
                phone: def.mobile,
                customer_id: userData.id,
                is_default: 1,
              })));
            } catch {}

            // ── Issue #1 fix: only set form/selection if user hasn't manually picked ──
            // If the API response arrives AFTER the user has already clicked a tile,
            // we must NOT overwrite their choice.
            if (!hasUserSelectedRef.current) {
              setSelectedAddressId(def.id);
              const [firstName = "", ...lastArr] = (def.name || "").split(" ");
              const lastName = lastArr.join(" ");
              setFormData((prev) => ({
                ...prev,
                billingAddress: {
                  ...prev.billingAddress,
                  first_name: firstName || prev.billingAddress.first_name,
                  last_name: lastName || prev.billingAddress.last_name,
                  email: def.email || prev.billingAddress.email,
                  mobile: def.mobile || prev.billingAddress.mobile,
                  area: def.area || prev.billingAddress.area,
                  building: def.building || prev.billingAddress.building,
                  emirates: def.emirates || prev.billingAddress.emirates,
                },
                shippingAddress: {
                  ...prev.shippingAddress,
                  first_name: firstName || prev.shippingAddress.first_name,
                  last_name: lastName || prev.shippingAddress.last_name,
                  email: def.email || prev.shippingAddress.email,
                  mobile: def.mobile || prev.shippingAddress.mobile,
                  area: def.area || prev.shippingAddress.area,
                  building: def.building || prev.shippingAddress.building,
                  emirates: def.emirates || prev.shippingAddress.emirates,
                },
              }));
            }
          }
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    const { mobile, email } = formData.billingAddress;
    if (hasFetchedRef.current) return;
    if (!/^\d{10}$/.test(mobile)) return;
    hasFetchedRef.current = true;

    const transformCouponData = (apiCoupons) => {
      if (!Array.isArray(apiCoupons)) return [];

      return apiCoupons.filter(coupon => coupon.active === true).map((coupon) => ({id: coupon.couponCode, code: coupon.couponCode, title: coupon.promotionName, description: `Get ${coupon.value}${coupon.baseOn === "Percent" ? "%" : " AED"} off`, value: coupon.value, coupon_type: coupon.baseOn ? coupon.baseOn.toLowerCase() : 'percent', type: "customer", end_date: coupon.validTo, start_date: coupon.registrationDate, couponRegistrationId: coupon.couponRegistrationId, couponId: coupon.couponId, salesType: coupon.salesType, company: coupon.company, whsCode: coupon.whsCode }));
    };

    const fetchCoupons = async () => {
      setCouponLoading(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_SMARTVIEW_API_URL}Coupon/ActiveCoupons`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salesType: "EComm", company: "UAE", mobileNo: mobile, email: email }),
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        const transformedData = transformCouponData(data.data);
        setCoupons(transformedData);
        setCouponDataContext(transformedData); // This context is used by FreeGiftFeature
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
        setCoupons([]);
      } finally { setCouponLoading(false); }
    };
    fetchCoupons();

  }, [formData.billingAddress.mobile]);

  useEffect(() => {
    const finalPrice = !freeShippingFlag ? parseFloat(shippingServiceCharges[0]?.price) + totalPrice + parseFloat(shippingServiceCharges[1]?.price) : 0 + totalPrice + parseFloat(shippingServiceCharges[1]?.price);
    setFinalPriceState(finalPrice);
  }, [selectedOption]);

  useEffect(() => {
    const tabbyCardScript = document.createElement("script");
    tabbyCardScript.src = "https://checkout.tabby.ai/tabby-card.js";
    tabbyCardScript.async = true;
    document.body.appendChild(tabbyCardScript);
    const finalPrice = !freeShippingFlag ? parseFloat(shippingServiceCharges[0]?.price) + totalPrice + parseFloat(shippingServiceCharges[1]?.price) : 0 + totalPrice + parseFloat(shippingServiceCharges[1]?.price);
    tabbyCardScript.onload = () => { new window.TabbyCard({selector: "#tabbyCard", currency: "AED", lang: locale, price: finalPrice, size: "wide", theme: "black", header: true, });};
    return () => { document.body.removeChild(tabbyCardScript); };
  }, [selectedOption]);

  useEffect(() => {
    const errorMsg = searchParams.get("error");
    if (errorMsg) {
      setError(errorMsg);
      toast.error(errorMsg, { position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, });
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  // Auto-scroll to top when mobile summary is opened
  useEffect(() => {
    if (isOrderSummaryOpen && typeof window !== "undefined" && window.innerWidth < 1200) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isOrderSummaryOpen]);

  // ---- GA4 begin_checkout (fires once on mount) ----
  // The TikTok listener in layout.jsx auto-maps this to ttq.track("InitiateCheckout")
  const hasTrackedCheckout = useRef(false);
  useEffect(() => {
    if (hasTrackedCheckout.current) return;
    if (!cartProducts || cartProducts.length === 0) return;
    hasTrackedCheckout.current = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "AED",
        value: parseFloat(totalPrice || 0),
        items: cartProducts
          .filter((item) => !item.is_gift)
          .map((item) => ({
            item_id: item.product_id?.toString(),
            item_name: item.product_name,
            price: parseFloat(item.price || 0),
            quantity: item.quantity || 1,
            item_category: item.category_name || "",
          })),
      },
    });
  }, [cartProducts]);


  const handleRadioChange = (event) => { setSelectedOption(event.target.value); };

  const updateAddress = async () => {
    const billing = formData.billingAddress;
    setAddressSaving(true);
    setAddressSaveError(null);
    try {
      const addrPayload = { city: billing.area, address: billing.building, state: billing.emirates };
      localStorage.setItem("address", btoa(JSON.stringify(addrPayload)));

      // Also update via API
      const raw = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const userData = raw ? JSON.parse(atob(raw)) : {};
      const customer_id = userData.id;
      if (customer_id && selectedAddressId) {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/customerAddressUpdate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
          body: JSON.stringify({
            address_id: selectedAddressId,
            customer_id,
            name: billing.first_name + " " + billing.last_name,
            email: billing.email,
            mobile: billing.mobile,
            country: "AE",
            address: `${billing.area} ${billing.building}`,
            area: billing.area,
            city: billing.emirates,
            state: billing.emirates,
            is_default: 1,
          }),
        });
        const res = await resp.json();
        // Update savedAddresses list
        setSavedAddresses((prev) =>
          prev.map((a) =>
            a.id === selectedAddressId
              ? { ...a, area: billing.area, building: billing.building, emirates: billing.emirates }
              : a
          )
        );
        if (res?.error === "Unauthorized" || res?.message === "Unauthorized") {
          localStorage.removeItem("token"); localStorage.removeItem("user");
        }
      }
      setAddressUpdateSuccess("Address updated successfully!");
      setIsEditingAddress(false);
      setTimeout(() => setAddressUpdateSuccess(null), 3000);
    } catch (e) {
      console.error("Failed to update address", e);
      setAddressSaveError("Failed to update. Please try again.");
    } finally {
      setAddressSaving(false);
    }
  };

  const selectSavedAddress = (addr) => {
    // Issue #1 fix: mark that user has made a manual selection.
    // This prevents Phase 2 (API response) from overwriting what the user clicked.
    hasUserSelectedRef.current = true;
    setSelectedAddressId(addr.id);
    setFormData((prev) => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, area: addr.area, building: addr.building, emirates: addr.emirates },
      shippingAddress: { ...prev.shippingAddress, area: addr.area, building: addr.building, emirates: addr.emirates },
    }));
    // Issue #2 fix: do NOT write to localStorage here.
    // localStorage.address must only reflect the real DB default (managed by
    // Phase 2 and the dashboard save). Writing here was causing the wrong address
    // to flash on the next checkout visit.
    setShowAddressPanel(false);
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewAddress = async () => {
    // 2-address limit: only Home and Other allowed
    if (!isEditingAddress && savedAddresses.length >= 2) {
      setAddressSaveError("You can only save 2 addresses: Home and Other.");
      return;
    }
    if (!newAddressForm.area.trim() || !newAddressForm.building.trim() || !newAddressForm.emirates.trim()) {
      setAddressSaveError("All fields (Area, Building, Emirate) are required.");
      return;
    }
    setAddressSaving(true);
    setAddressSaveError(null);
    try {
      const raw = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const userData = raw ? JSON.parse(atob(raw)) : {};
      const customer_id = userData.id;

      // Determine address ID (if editing, use selectedAddressId, otherwise -1)
      const isEditing = isEditingAddress;
      const targetAddressId = isEditing ? selectedAddressId : -1;

      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/customerAddressUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({
          address_id: targetAddressId,
          customer_id,
          name: userData.name || "",
          email: userData.email || "",
          mobile: userData.phone || "",
          country: "AE",
          address: `${newAddressForm.area} ${newAddressForm.building}`,
          area: newAddressForm.area,
          city: newAddressForm.emirates,
          state: newAddressForm.emirates,
          is_default: isEditing ? (savedAddresses.find(a => a.id === targetAddressId)?.isDefault ? 1 : 0) : 0,
        }),
      });
      const res = await resp.json();
      
      if (isEditing) {
        setSavedAddresses((prev) =>
          prev.map((a) =>
            a.id === selectedAddressId
              ? { ...a, area: newAddressForm.area, building: newAddressForm.building, emirates: newAddressForm.emirates }
              : a
          )
        );
        selectSavedAddress({ id: selectedAddressId, area: newAddressForm.area, building: newAddressForm.building, emirates: newAddressForm.emirates, name: userData.name || "", email: userData.email || "", mobile: userData.phone || "" });
        setIsEditingAddress(false);
      } else {
        const newId = res?.id || res?.addresses?.id || Date.now();
        const newAddr = {
          id: newId,
          name: userData.name || "",
          email: userData.email || "",
          mobile: userData.phone || "",
          area: newAddressForm.area,
          building: newAddressForm.building,
          emirates: newAddressForm.emirates,
          isDefault: false,
        };
        setSavedAddresses((prev) => [...prev, newAddr]);
        selectSavedAddress(newAddr);
        setIsAddingNewAddress(false);
      }
      setNewAddressForm({ area: "", building: "", emirates: "" });
      setShowAddressPanel(false);
    } catch (e) {
      setAddressSaveError("Failed to save address. Please try again.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("shipping") || name.startsWith("billing")) {
      const addressField = name.startsWith("shipping") ? "shippingAddress" : "billingAddress";
      const fieldName = name.split(".")[1];
      setFormData((prevData) => ({ ...prevData, [addressField]: { ...prevData[addressField], [fieldName]: value,},}));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value, }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => {
      const newSameAsShipping = !prevData.shippingAdd;
      if (!newSameAsShipping) { setIsOTPButton(true); setIsOTPVerified(false); setOTPSuccess(null); setOTPError(null); }
      return { 
        ...prevData, 
        shippingAdd: newSameAsShipping, 
        shippingAddress: { first_name: "", last_name: "", mobile: "", email: "", area: "", building: "", emirates: "", }, };
    });
  };

  const handleEmiratesChange = (event, emirates) => {
    const { id } = event.target;
    if (id.startsWith("shipping") || id.startsWith("billing")) {
      const addressField = id.startsWith("shipping") ? "shippingAddress" : "billingAddress";
      const fieldName = id.split(".")[1];
      setFormData((prevData) => {
        return { ...prevData, [addressField]: { ...prevData[addressField], [fieldName]: emirates, }, };
      });
    }
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
    setCouponSuccess(null);
    setCouponData(null);
    setCouponDataContext(null);

    const cleanedCart = cartProducts.map((item) => {
      const { is_coupon, value, ...rest } = item;
      return rest;
    });

    setCartProducts(cleanedCart);
  };

  const handleSelectCoupon = async (code, id) => {
    setCouponData(null);
    setCouponCode(code);
    setCopiedId(id);
    setShowCouponModal(false);
    setTimeout(() => setCopiedId(null), 1400);
  };

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1400);
  };

  const removeCoupon = (e) => {
    setCouponCode("");
    setCouponSuccess(null);
    setCouponData(null);
    setCouponDataContext(null);

    const cleanedCart = cartProducts.map((item) => {
      const { is_coupon, value, ...rest } = item;
      return rest;
    });

    setCartProducts(cleanedCart);
  };

  const applyCoupon = async (e) => {
    e.preventDefault();

    const user = isLoggedIn ? JSON.parse(atob(localStorage.getItem("user"))) : null;
    const code = couponCode.toLowerCase();

    if (!couponCode.trim()) {
      setCouponError("Coupon Code is Required");
      return;
    }

    if (!isOTPVerified && !isLoggedIn) {
      setCouponError("Please verify your mobile number first.");
      return;
    }

    const eligibleItems = cartProducts.filter((item) => {
      const isBogoProduct = promotionsContext.some((promo) => promo.buy_products.some((buyItem) => buyItem.product_id === item.product_id));
      return !item.discount && !isBogoProduct && !item.is_gift && !item.collection_name;
    });

    if (eligibleItems.length === 0) {
      setCouponError("This coupon is not applicable to the items in your cart.");
      setCouponCode("");
      return;
    }

    const validCoupon = coupons.find((c) => c.code.toLowerCase() === code);

    let payload = { company: "UAE", salesType: "EComm", couponRegistrationId: validCoupon ? validCoupon.couponRegistrationId : 0, couponCode: validCoupon ? "" : couponCode.trim(), mobileNo: user?.phone || formData.billingAddress.mobile, email: user?.email || formData.billingAddress.email, };

    const res = await fetch(`${process.env.NEXT_PUBLIC_SMARTVIEW_API_URL}Coupon/ActiveCoupons`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      setCouponError("Invalid or expired coupon code.");
      setCouponCode("");
      return;
    }

    const data = await res.json();
    let apiCoupon = data.data && data.data[0];

    // Normalize API coupon if present
    if (apiCoupon && !validCoupon) {
      apiCoupon = {  id: apiCoupon.couponCode, code: apiCoupon.couponCode, title: apiCoupon.promotionName, description: apiCoupon.promotionName, value: apiCoupon.value, coupon_type: apiCoupon.baseOn === "P" ? "percent" : "amount", type: "customer", end_date: apiCoupon.validTo, start_date: apiCoupon.registrationDate, couponRegistrationId: apiCoupon.couponRegistrationId, salesType: apiCoupon.salesType, company: apiCoupon.company, whsCode: apiCoupon.whsCode, };
    }
    const couponToApply = validCoupon || apiCoupon;
    if (!couponToApply) {
      setCouponError("Invalid or expired coupon code.");
      setCouponCode("");
      return;
    }

    const updatedCartProducts = cartProducts.map((item) => {
      const isBogoProduct = promotionsContext.some((promo) => promo.buy_products.some((buyItem) => buyItem.product_id === item.product_id));
      const isEligible = !item.discount && !isBogoProduct && !item.is_gift;
      return { ...item, ...(isEligible ? { is_coupon: true, value: couponToApply.value, coupon_type: couponToApply.coupon_type, } : {}), };
    });

    setCartProducts(updatedCartProducts); 
    setCouponError(null);
    setCouponData(couponToApply);
    setCouponDataContext(couponToApply);
    setCouponSuccess( `Applied Coupon: ${couponToApply.code} - ${couponToApply.title}` );
  };

  const subTotalPrice = (elm) => {
    if (elm.is_gift) { return <td>0.00{currency.symbol} (Free Gift)</td>; }

    const currentUTC = new Date();
    const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000);
    const current_date_time = currentGST.toISOString() .slice(0, 19).replace("T", " ");
    const bogoFreeQty = Number(elm.bogo_free_qty || 0);
    const paidQty = Math.max(0, (elm.quantity || 0) - bogoFreeQty);
    let itemPrice = elm.price;

    // BOGO: show paid + free breakdown
    if (bogoFreeQty > 0) {
      return (
        <td>
          <span className="money price price-sale"> {currency.symbol} {(itemPrice * paidQty).toFixed(2)} </span>
          <span className="money price price-old"> {currency.symbol} {(itemPrice * elm.quantity).toFixed(2)} </span>
          <br /><span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '12px' }}>🎁 {bogoFreeQty} FREE</span>
        </td>
      );
    }

    if ( elm?.discount && new Date(current_date_time) >= new Date(elm.discount.start_date) && new Date(current_date_time) <= new Date(elm.discount.end_date)) {
      if (elm.discount.discount_type == "percent") { itemPrice = elm.price - (elm.price / 100) * elm.discount.value; } 
      else if (elm.discount.discount_type == "amount") { itemPrice = elm.discount.final_price; }
      return (
        <td>
          <span className="money price price-sale"> {currency.symbol} {(itemPrice * elm.quantity).toFixed(2)} </span>
          <span className="money price price-old"> {currency.symbol} {(elm.price * elm.quantity).toFixed(2)} </span>
        </td>
      );
    }

    if ( couponData && couponData.type === "customer" && elm.is_coupon ) {
      if (couponData.coupon_type == "percent") { itemPrice = elm.price - (elm.price / 100) * couponData.value; } 
      else if (couponData.coupon_type == "amount") { itemPrice = elm.price - couponData.value; }
      return (
        <td>
          <span className="money price price-sale"> {currency.symbol} {(itemPrice * elm.quantity).toFixed(2)} </span>
          <span className="money price price-old"> {currency.symbol} {(elm.price * elm.quantity).toFixed(2)} </span>
        </td>
      );
    }

    return (
      <td>
        <span className="money price"> {currency.symbol} {(elm.price * elm.quantity).toFixed(2)} </span>
      </td>
    );
  };

  const getColors = (status, idx) => {
    const golds = ["#BB8502", "#D44F35", "#726060"];
    const bgs = ["#FFF7E7", "#FFF3F0", "#F6F6F6"];
    if (status === "expired") { return { color: "#9A9A9A", bg: "#F6F6F6" }; }
    return { color: golds[idx % golds.length], bg: bgs[idx % bgs.length] };
  };

  const isExpired = (end_date) => { return new Date(end_date) < new Date(); };

  const mapProductsFromFormData = (products) => {
    const mapped = [];
    products.forEach((item) => {
      if (item.bogo_free_qty && item.bogo_free_qty > 0) {
        const paidQty = (item.quantity || 0) - item.bogo_free_qty;

        // Paid portion
        if (paidQty > 0) {
          mapped.push({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: paidQty,
            category_name: item.category_name,
            subcategory_name: item.subcategory_name,
            coupon: item.coupon,
            discount: null,
            _original_discount: item._original_discount || null,
            ...('is_coupon' in item && { is_coupon: item.is_coupon }),
            ...('coupon_type' in item && { coupon_type: item.coupon_type }),
            ...('value' in item && { value: item.value }),
          });
        }

        // BOGO free portion
        mapped.push({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.bogo_free_qty,
          category_name: item.category_name,
          subcategory_name: item.subcategory_name,
          coupon: [],
          discount: null,
          is_gift: true,
          type: 'bogo',
          campaign: item.bogo_campaign,
        });
      } else {
        // Regular product (no BOGO)
        mapped.push({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          category_name: item.category_name,
          subcategory_name: item.subcategory_name,
          coupon: item.coupon,
          discount: item.discount,
          ...('_original_discount' in item && { _original_discount: item._original_discount }),
          ...('is_coupon' in item && { is_coupon: item.is_coupon }),
          ...('is_gift' in item && { is_gift: item.is_gift }),
          ...('coupon_type' in item && { coupon_type: item.coupon_type }),
          ...('value' in item && { value: item.value }),
          ...('campaign' in item && { campaign: item.campaign }),
          ...('type' in item && { type: item.type }),
        });
      }
    });
    return mapped;
  };

  async function onOrder(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // ---- Pixel: Fire AddPaymentInfo on first Place Order attempt only ----
    // Correct event for "Place Order" click — NOT Purchase (Purchase fires on Thank You page).
    // useRef guard ensures this fires exactly once per checkout session,
    // even if user clicks multiple times due to validation errors or slow API.
    try {
      const hasTrackedPlaceOrder = typeof window.__placeOrderTracked !== "undefined";

      if (!hasTrackedPlaceOrder && cartProducts && cartProducts.length > 0) {
        window.__placeOrderTracked = true; // session-level guard (resets on page reload)

        // GA4 add_payment_info (TikTok listener maps to AddPaymentInfo)
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "add_payment_info",
          ecommerce: {
            currency: "AED",
            value: parseFloat(totalPrice || 0),
            payment_type: selectedOption || "cod",
            items: cartProducts
              .filter((item) => !item.is_gift)
              .map((item) => ({
                item_id: item.product_id?.toString(),
                item_name: item.product_name,
                price: parseFloat(item.price || 0),
                quantity: item.quantity || 1,
              })),
          },
        });

        // Meta Pixel: AddPaymentInfo is the correct pre-purchase event
        if (typeof window.fbq === "function") {
          window.fbq("track", "AddPaymentInfo", {
            content_ids: cartProducts
              .filter((item) => !item.is_gift)
              .map((item) => item.product_id?.toString()),
            content_type: "product",
            value: parseFloat(totalPrice || 0),
            currency: "AED",
          });
        }
      }
    } catch (e) { /* tracking errors must never block order submission */ }

    const billing = formData.billingAddress;
    const newErrors = {};

    if (!billing.first_name.trim()) newErrors.first_name = "First Name is required";
    if (!billing.country.trim()) newErrors.country = "Country is required";
    if (!billing.area.trim()) newErrors.area = "Area / Mantaqa is required";
    if (!billing.building.trim()) newErrors.building = "Building / Villa / Apartment is required";
    if (!billing.emirates.trim()) newErrors.emirates = "Emirate is required";
    if (!billing.email.trim()) newErrors.email = "Email is required";
    if (!billing.mobile.trim()) newErrors.mobile = "Mobile Number is required";
    if (!isLoggedIn && !isOTPVerified) newErrors.otp = "OTP must be verified";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setIsLoading(false); 
      return;
    } else { 
      setFieldErrors({}); 
    }

    const shippingPrice = freeShippingFlag ? 0.0 : parseFloat(shippingServiceCharges[0].price);
    const shippingPriceVat = (shippingPrice / 100) * vatTax.percentage;
    const finalPrice = parseFloat((!freeShippingFlag ? parseFloat(shippingServiceCharges[0].price) + totalPrice + parseFloat(shippingServiceCharges[1].price) + (selectedOption === "cod" ? parseFloat(shippingServiceCharges[2].price) : 0.0) : 0 + totalPrice + parseFloat(shippingServiceCharges[1].price) + (selectedOption === "cod" ? parseFloat(shippingServiceCharges[2].price) : 0.0)).toFixed(2));
    const servicePrice = shippingServiceCharges[1].price;
    const servicePriceVat = (servicePrice / 100) * vatTax.percentage;
    const codPrice = selectedOption === "cod" ? shippingServiceCharges[2].price : 0.0;
    const codPriceVat = (codPrice / 100) * vatTax.percentage;
    let userJson = null;
    if (isLoggedIn) {
      const user = atob(localStorage.getItem("user"));
      userJson = JSON.parse(user);
    }

    const {
      shippingAdd,
      note,
      password,
      otp,
      ...cleanFormData
    } = formData;

    const additionalFields = {...cleanFormData, products: mapProductsFromFormData(cartProducts), payment_method: selectedOption, shippingPrice, shippingPriceVat, servicePrice, servicePriceVat, vatTax: vatTax.percentage, totalPrice, finalPrice, customer_id: isLoggedIn && userJson ? userJson.id : null, locale, couponCode, codPrice, codPriceVat, couponData, };
    const token = localStorage.getItem('token');
    // console.log('additionalFields', additionalFields);return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/storeOrder`,
        {
          method: "POST",
          body: JSON.stringify(additionalFields),
          headers: { "content-type": "application/json", ...(token && { Authorization: `Bearer ${token}` })},
        }
      );

      if (response.status === 401) {
        // Clear all authentication-related items
        if (localStorage.getItem('user')) {
          localStorage.removeItem('user');
        }
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }

        // If they were a guest user verified via OTP, they need to re-verify
        // If they were logged in, they need to re-login
        const errorMsg = isLoggedIn 
          ? 'Your session has expired. Please login again.' 
          : 'Mobile verification expired. Please verify your number again.';

        setError(errorMsg);

        setTimeout(() => {
          // Redirecting to the combined login/register/OTP page
          window.location.reload();
        }, 2000);

        return; // Stop execution
      }
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || data.error || "Failed to submit the data. Please try again.";
        throw new Error(errorMessage);
      }
      
      if (data.message && data.message.split(" ")[0] == "Order") {
        setSuccess(data.message);
        setError(null);
        setOrderDetails(data);
        setFormData({
          shippingAddress: { first_name: "", last_name: "", mobile: "", email: "", area: "", building: "", emirates: "" },
          billingAddress: {first_name: "", last_name: "", mobile: "", email: "", area: "", building: "", emirates: "" },
          shippingAdd: false,
        });
        setTimeout(() => router.push(`/${locale}/shop-order-complete`), 1000);
      } else if (data.message && data.message.split(" ")[0] == "Redirecting") {
        setSuccess(data.message);
        setError(null);
        router.push(data.redirect_url);
      } else if (data.qtyMessage) {
        setError(data.qtyMessage);
      } else if (data.discountMessage) {
        setError(data.discountMessage);
      } else if (data.couponMessage) {
        setError(data.couponMessage);
      } else if (data.duplicateOrderMessage) {
        setError(data.duplicateOrderMessage);
      } else if (data.priceMessage) {
        setError(data.priceMessage);
      } else if (data.collectionMessage) {
        setError(data.collectionMessage);
      } else if (data.focMessage) {
        setError(data.focMessage);
      } else if (data.bogoMessage) {
        setError(data.bogoMessage);
      } else {
        if (data.products) setError(data.products);
        if (data["billingAddress.first_name"]) setError(data["billingAddress.first_name"]);
        if (data["billingAddress.email"]) setError(data["billingAddress.email"]);
        if (data["billingAddress.mobile"]) setError(data["billingAddress.mobile"]);
        if (data["billingAddress.area"]) setError(data["billingAddress.area"]);
        if (data["billingAddress.building"]) setError(data["billingAddress.building"]);
        if (data["billingAddress.emirates"]) setError(data["billingAddress.emirates"]);
        setSuccess(null);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendOTP(e) {
    e.preventDefault();
    setIsSendOTPLoading(true);

    const targetMobile = !isLoggedIn ? formData.billingAddress.mobile : formData.shippingAddress.mobile;
    const regex = /^\d{10}$/;

    if (targetMobile == "") {
      setOTPError("Mobile Number is Required");
      setOTPSuccess(null);
      setIsSendOTPLoading(false);
      return;
    }
    
    if (!regex.test(targetMobile)) {
      setOTPError("Invalid Mobile Number");
      setOTPSuccess(null);
      setIsSendOTPLoading(false);
      return;
    }
    setOTPError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/sendOTP`,
        {
          method: "POST",
          body: JSON.stringify({ mobile: targetMobile }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) { throw new Error("Failed to submit the data. Please try again."); }

      const data = await response.json();
      if (data.message && data.message.split(" ")[0] == "OTP") {
        setOTPSuccess(data.message);
        setOTPError(null);
        setIsOTPButton(false);
      } else {
        if (data["mobile"]) { setOTPSuccess(data["mobile"]); }
        setOTPSuccess(null);
      }
    } catch (error) {
      setOTPSuccess(error.message);
    } finally {
      setIsSendOTPLoading(false);
    }
  }

  async function verifyOTP(e) {
    e.preventDefault();
    setIsSendOTPLoading(true);

    const targetMobile = !isLoggedIn ? formData.billingAddress.mobile : formData.shippingAddress.mobile;
    const regex = /^\d+$/;

    if (formData.otp === "") {
      setOTPError("OTP is Required");
      setOTPSuccess(null);
      setIsSendOTPLoading(false);
      return;
    }
    
    if (!regex.test(formData.otp)) {
      setOTPError("Invalid OTP");
      setOTPSuccess(null);
      setIsSendOTPLoading(false);
      return;
    }
    setOTPError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/verifyOTP`,
        {
          method: "POST",
          body: JSON.stringify({ mobile: targetMobile, otp: formData.otp, flag: "checkout", }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) { throw new Error("Failed to submit the data. Please try again."); }

      const data = await response.json();
      if (data.message && data.message.split(" ")[0] === "Invalid") {
        setOTPSuccess(null);
        setOTPError(data.message);
      } else if (data.message && data.message.split(" ")[0] === "OTP") {
        setOTPSuccess(data.message);
        setIsOTPVerified(true);
        setIsDisabled(false);
        setOTPError(null);
        localStorage.setItem("token", data.access_token);
      } else {
        if (data["mobile"]) setOTPError(data["mobile"]);
        if (data["otp"]) setOTPError(data["otp"]);
        setOTPSuccess(null);
      }
    } catch (error) {
      setOTPError(error.message);
    } finally {
      setIsSendOTPLoading(false);
    }
  }

  if (isMenuLoading) { return ( <div> <Pagination1 /> </div> ); }
  if (isMenuError) { return <div>{isMenuError}</div>; }

  // Price calculations and helpers for clean code
  const shippingCost = !freeShippingFlag && shippingServiceCharges && shippingServiceCharges[0] ? parseFloat(shippingServiceCharges[0].price || 0) : 0;
  const serviceFee = shippingServiceCharges && shippingServiceCharges[1] ? parseFloat(shippingServiceCharges[1].price || 0) : 0;
  const codFee = selectedOption === "cod" && shippingServiceCharges && shippingServiceCharges[2] ? parseFloat(shippingServiceCharges[2].price || 0) : 0;
  const finalOrderPrice = (totalPrice + shippingCost + serviceFee + codFee).toFixed(2);

  const vatRate = parseFloat(vatTax?.percentage || 0) / 100;
  const calculateVatForAmount = (amount) => {
    return amount - (amount / (1 + vatRate));
  };
  const totalVat = (
    calculateVatForAmount(totalPrice) +
    calculateVatForAmount(shippingCost) +
    calculateVatForAmount(serviceFee) +
    calculateVatForAmount(codFee)
  ).toFixed(2);

  return (
    <>
      {cartProducts.length ? (
        <>
          <BogoFeature />
          <form onSubmit={onOrder}>
            <div className="checkout-form">
              <div className="billing-info__wrapper text-uppercase">

                  {/* ── Saved Address Cards — always visible at top for logged-in users ── */}
                  {isLoggedIn && (
                    <div className="checkout-addr-section">
                      <div className="checkout-addr-section-label">
                        <span className="checkout-addr-section-label__title">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          Delivery Address
                        </span>
                        {addressUpdateSuccess && <span className="checkout-addr-success">Saved successfully</span>}
                        {addressSaveError && !isAddingNewAddress && <span className="checkout-addr-error">{addressSaveError}</span>}
                      </div>

                      <div className="checkout-addr-row">
                        {savedAddresses.map((addr, idx) => {
                          const isSelected = selectedAddressId === addr.id;
                          const isEditingThis = isEditingAddress && isSelected;
                          return (
                            <div
                              key={addr.id}
                              className={`checkout-addr-tile ${isSelected ? "checkout-addr-tile--selected" : ""}`}
                              onClick={() => { if (!isEditingThis) { selectSavedAddress(addr); setIsEditingAddress(false); setAddressSaveError(null); } }}
                            >
                              <div className="checkout-addr-tile__header">
                                <span className={`checkout-addr-tile__radio ${isSelected ? "checkout-addr-tile__radio--selected" : ""}`}></span>
                                <span className="checkout-addr-tile__type">
                                  {idx === 0 ? "Home" : "Other"}
                                </span>
                              </div>

                              {isSelected && (
                                <button type="button" className="checkout-addr-tile__edit" title="Edit this address"
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setIsEditingAddress(true); 
                                    setAddressSaveError(null); 
                                    setNewAddressForm({
                                      area: addr.area || "",
                                      building: addr.building || "",
                                      emirates: addr.emirates || ""
                                    });
                                  }}>
                                  Edit
                                </button>
                              )}
                              <div className="checkout-addr-tile__body">
                                <p className="checkout-addr-tile__name" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>
                                  {addr.name || "—"} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#777" }}>({addr.email || "—"})</span>
                                </p>
                                <p className="checkout-addr-tile__line">
                                  <span className="checkout-addr-tile__line--street">{addr.building || "—"}</span>, {addr.area || "—"}{addr.emirates ? `, ${addr.emirates}` : ""}, <span className="checkout-addr-tile__line--country">UAE</span>
                                </p>
                              </div>
                              <div className="checkout-addr-tile__footer">
                                {addr.isDefault ? (
                                  <span className="checkout-addr-tile__default">Primary</span>
                                ) : (
                                  <span></span>
                                )}
                                {isSelected && (
                                  <span className="checkout-addr-tile__check">
                                    <svg viewBox="0 0 12 10" width="10" height="10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,5 4.5,8.5 11,1"/></svg>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* + Add address & Manage Addresses row */}
                      <div style={{ marginTop: "10px", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
                        {/* Only show Add New if user has fewer than 2 addresses (Home + Other limit) */}
                        {savedAddresses.length < 2 && (
                          <>
                            <button
                              type="button"
                              onClick={() => { setIsAddingNewAddress(true); setAddressSaveError(null); }}
                              style={{
                                background: "none", border: "none", padding: 0,
                                color: "#a67b30", fontSize: "0.85rem", fontWeight: 600,
                                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px"
                              }}
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                              Add New Address
                            </button>
                            {/* Divider dot */}
                            <span style={{ color: "#ccc", fontSize: "1rem", lineHeight: 1 }}>·</span>
                          </>
                        )}

                        <Link
                          href={`/${locale}/account_edit_address`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#555", fontSize: "0.85rem", fontWeight: 500,
                            display: "inline-flex", alignItems: "center", gap: "6px",
                            textDecoration: "none",
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Manage Addresses
                        </Link>
                      </div>

                    </div>
                  )}

                  {/* ── Guest Checkout Form ── */}
                  {!isLoggedIn && (
                    <>
                      <h4>Billing Details</h4>
                      <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input type="text" className="form-control" id="checkout_first_name" placeholder=" " readOnly={isLoggedIn && !isEditingAddress} name="billingAddress.first_name" value={formData.billingAddress.first_name} onChange={handleChange} required />
                      <label htmlFor="checkout_first_name">First Name</label>
                      {fieldErrors.first_name && ( <div style={{ color: "red", fontSize: "0.85rem" }}> {fieldErrors.first_name} </div> )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input type="text" className="form-control" id="checkout_last_name" placeholder=" " readOnly={isLoggedIn && !isEditingAddress} name="billingAddress.last_name" value={formData.billingAddress.last_name} onChange={handleChange} />
                      <label htmlFor="checkout_last_name">Last Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="search-field my-3">
                      <div className={`form-label-fixed hover-container ${ idDDActive ? "js-content_visible" : "" }`}>
                        <label htmlFor="country" className="form-label"> Country / Region* </label>
                        <div className="js-hover__open">
                          <input type="text" className="form-control form-control-lg search-field__actor" id="country" name="billingAddress.country" value="United Arab Emirates" readOnly placeholder="United Arab Emirates"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Area and Building — side by side */}
                  <div className="col-md-6">
                    <div className="form-floating mt-3 mb-3">
                      <input type="text" className="form-control" id="checkout_street_address" placeholder=" " readOnly={isLoggedIn && !isEditingAddress} name="billingAddress.area" value={formData.billingAddress.area} onChange={handleChange} maxLength={15} required />
                      <label htmlFor="checkout_company_name"> Area / Mantaqa * </label>
                      {fieldErrors.area && ( <div style={{ color: "red", fontSize: "0.85rem" }}> {fieldErrors.area} </div> )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mt-3 mb-3">
                      <input type="text" className="form-control" id="checkout_street_address_2" placeholder=" " name="billingAddress.building" readOnly={isLoggedIn && !isEditingAddress} value={formData.billingAddress.building} onChange={handleChange} required />
                      <label htmlFor="checkout_company_name"> Building / Villa / Apartment </label>
                      {fieldErrors.building && ( <div style={{ color: "red", fontSize: "0.85rem" }}> {fieldErrors.building} </div> )}
                    </div>
                  </div>

                  {/* Emirates — half width */}
                  <div className="col-md-6">
                    <div className="search-field my-3">
                      <div className={`form-label-fixed hover-container ${ idDDActive ? "js-content_visible" : "" }`} >
                        <label htmlFor="search-dropdown" className="form-label" > Emirates* </label>
                        <div className="js-hover__open">
                          <input type="text" className="form-control form-control-lg search-field__actor search-field__arrow-down" id="search-dropdown" name="billingAddress.emirates" value={formData.billingAddress.emirates} readOnly={isLoggedIn && !isEditingAddress} placeholder="Select Emirate..." onClick={() => { if (!isLoggedIn || isEditingAddress) setIdDDActive((pre) => !pre); }} required />
                        </div>
                        <div className="filters-container js-hidden-content mt-2">
                          <div className="search-field__input-wrapper">
                            <input type="text" className="search-field__input form-control form-control-sm bg-lighter border-lighter" placeholder="Search" onChange={(e) => {setSearchQuery(e.target.value);}}/>
                          </div>
                          <ul className="search-suggestion list-unstyled">
                            {countries.filter((elm) => elm.toLowerCase().includes(searchQuery.toLowerCase())).map((elm, i) => (
                              <li id="billingAddress.emirates" onClick={(e) => { handleEmiratesChange(e, elm); setIdDDActive(false); }} key={i} className="search-suggestion__item js-search-select"> {elm} </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email + Mobile — side by side */}
                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input type="email" className="form-control" id="billingAddress.email" placeholder=" " name="billingAddress.email" readOnly={isLoggedIn && !isEditingAddress} value={formData.billingAddress.email} onChange={handleChange} required />
                      <label htmlFor="checkout_email">Email Address *</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input type="tel" className="form-control" id="checkout_billing_mobile" placeholder=" " name="billingAddress.mobile" readOnly={isLoggedIn && !isEditingAddress} value={formData.billingAddress.mobile} onChange={handleChange} required />
                      <label htmlFor="checkout_phone"> Mobile Number* </label>
                    </div>
                  </div>

                  {!isLoggedIn && (
                    <div className="col-md-12">
                      {OTPError ? ( <div style={{ color: "red" }}>{OTPError}</div> ) : ( <div style={{ color: "green" }}>{OTPSuccess}</div> )}
                      {isOTPButton ? ( <button className="btn btn-primary w-100 text-uppercase" type="button" disabled={isSendOTPLoading} onClick={sendOTP} > {isSendOTPLoading ? "Loading..." : "Send OTP"} </button> ) : ( 
                        <>
                        {!isOTPVerified && ( 
                          <>
                            <div className="form-floating my-3">
                              <input type="number" className="form-control" id="billing_otp" placeholder=" " name="otp" value={formData.otp} onChange={handleChange} />
                              <label htmlFor="billing_otp"> OTP (Eg. 1234)* </label>
                            </div>
                            <button className="btn btn-primary w-100 text-uppercase" type="button" disabled={isSendOTPLoading} onClick={verifyOTP} >
                              {isSendOTPLoading ? "Loading..." : "Verify OTP"} 
                            </button>
                          </>
                        )}
                        </>
                      )}
                    </div>
                  )}

                  <div className="col-md-12">
                    <div className="form-check mt-3 mb-3 d-flex align-items-center flex-wrap gap-4 p-0">
                      <div className="d-flex align-items-center">
                        <input className="form-check-input form-check-input_fill m-0 me-2" type="checkbox" defaultValue="" id="create_account" onClick={(prev) => setCreateAccount(!createAccount)} name="create_account" />
                        <label className="form-check-label mb-0" htmlFor="create_account" style={{ cursor: "pointer" }} > CREATE AN ACCOUNT? </label>
                      </div>
                      <Link href={`/${locale}/login_register`} className="text-decoration-underline" style={{ fontSize: "0.9rem", color: "#666" }}>
                        ALREADY HAVE AN ACCOUNT?
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="row">
              <div className="col-md-12">
                <div className="form-check mb-3 mt-3 d-flex align-items-center p-0">
                  <input className="form-check-input form-check-input_fill m-0 me-2" type="checkbox" defaultValue="" id="ship_different_address" onClick={handleCheckboxChange} name="shipping" />
                  <label className="form-check-label mb-0" htmlFor="ship_different_address" style={{ cursor: "pointer" }}> SHIP TO A DIFFERENT ADDRESS? </label>
                </div>
              </div>
                  {formData.shippingAdd && (
                    <div className="accordion mt-3" id="shippingAddressAccordion" >
                      <div className="accordion-item">
                        <h4 className="accordion-header" id="headingShipping" > Shipping Details </h4>
                        <div id="collapseShipping" className="accordion-collapse collapse show" aria-labelledby="headingShipping" data-bs-parent="#shippingAddressAccordion" >
                          <div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input type="text" className="form-control" id="shipping_first_name" placeholder=" " name="shippingAddress.first_name" value={ formData.shippingAddress.first_name } onChange={handleChange} required />
                                  <label htmlFor="shipping_first_name"> First Name </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input type="text" className="form-control" id="shipping_last_name" placeholder=" " name="shippingAddress.last_name" value={formData.shippingAddress.last_name} onChange={handleChange} required />
                                  <label htmlFor="shipping_last_name"> Last Name </label>
                                </div>
                              </div>
                              {/* Shipping: Area + Building side by side */}
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input type="text" className="form-control" id="shipping_area" placeholder=" " name="shippingAddress.area" value={formData.shippingAddress.area} onChange={handleChange} maxLength={15} required />
                                  <label htmlFor="shipping_area"> Area / Mantaqa * </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input type="text" className="form-control" id="shipping_building" placeholder=" " name="shippingAddress.building" value={ formData.shippingAddress.building } onChange={handleChange} required />
                                  <label htmlFor="shipping_building"> Building / Villa / Apartment </label>
                                </div>
                              </div>
                              {/* Emirates half + Mobile half */}
                              <div className="col-md-6">
                                <div className="search-field my-3">
                                  <label htmlFor="shipping_emirates" className="form-label" > Emirates* </label>
                                  <select id="shipping_emirates" className="form-control" name="shippingAddress.emirates" value={ formData.shippingAddress.emirates } onChange={handleChange} required >
                                    <option value=""> Select Emirate... </option>
                                    {countries.map((em, i) => ( <option key={i} value={em}> {em} </option> ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input type="tel" className="form-control" id="shipping_mobile" placeholder=" " name="shippingAddress.mobile" value={formData.shippingAddress.mobile} onChange={handleChange} required />
                                  <label htmlFor="shipping_mobile"> Mobile Number* </label>
                                </div>
                              </div>
                              {/* Email full width */}
                              <div className="col-md-12">
                                <div className="form-floating my-3">
                                  <input type="email" className="form-control" id="shipping_email" placeholder=" " name="shippingAddress.email" value={formData.shippingAddress.email} onChange={handleChange} required />
                                  <label htmlFor="shipping_email"> Email Address * </label>
                                </div>
                              </div>
                              {isLoggedIn && (
                                <div className="col-md-12">
                                  {OTPError ? ( <div style={{ color: "red" }}> {OTPError} </div>) : ( <div style={{ color: "green" }}> {OTPSuccess} </div> )}
                                  {isOTPButton ? ( <button className="btn btn-primary w-100 text-uppercase" type="button" disabled={isSendOTPLoading} onClick={sendOTP} > {isSendOTPLoading ? "Loading..." : "Send OTP"} </button> ) : (
                                    <>
                                      {!isOTPVerified && (
                                        <>
                                          <div className="form-floating my-3">
                                            <input type="number" className="form-control" id="shipping_otp" placeholder=" "  name="otp" value={formData.otp} onChange={handleChange} />
                                            <label htmlFor="shipping_otp"> OTP (Eg. 1234)* </label>
                                          </div>
                                          <button className="btn btn-primary w-100 text-uppercase" type="button" disabled={isSendOTPLoading} onClick={verifyOTP} >
                                            {isSendOTPLoading ? "Loading..." : "Verify OTP"}
                                          </button>
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              {createAccount && (
                  <div className="col-md-12">
                    <div className="form-floating my-3">
                      <input type="password" className="form-control" id="password" placeholder=" " name="password" value={formData.password} onChange={handleChange} required />
                      <label htmlFor="checkout_email">Password *</label>
                    </div>
                  </div>
                )}
              </div>

              <div className="checkout__totals-wrapper">
                <div className="sticky-content">
                  <FreeGiftFeature couponData={couponData} autoPopup={true} />
                  <div className={`checkout__totals ${isOrderSummaryOpen ? "is-open" : ""}`}>
                    {/* Collapsible Header/Toggle Bar */}
                    <div 
                      className="checkout-summary-toggle-bar" 
                      onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                      role="button"
                      aria-expanded={isOrderSummaryOpen}
                    >
                      <div className="toggle-left">
                        <svg className="summary-bag-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span className="toggle-text toggle-text-desktop">
                          Order Summary
                        </span>
                        <span className="toggle-text toggle-text-mobile">
                          {isOrderSummaryOpen ? "Hide order summary" : "Show order summary"}
                        </span>
                        <svg 
                          className={`toggle-chevron ${isOrderSummaryOpen ? "rotated" : ""}`} 
                          viewBox="0 0 24 24" 
                          width="16" 
                          height="16" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      <div className="toggle-right">
                        <span className="summary-total-price">
                          {finalOrderPrice} {currency.symbol}
                        </span>
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    <div className={`checkout-summary-collapsible-content ${isOrderSummaryOpen ? "expanded" : ""}`}>
                      <div className="cart-items-collapse">
                        <table className="checkout-cart-items">
                          <thead> <tr> <th>PRODUCT</th> <th>SUBTOTAL</th> </tr> </thead>
                          <tbody> {cartProducts.map((elm, i) => ( <tr key={i}> <td> {he.decode(elm.product_name)} x {elm.quantity} </td> {subTotalPrice(elm)} </tr> ))} </tbody>
                        </table>
                      </div>
                      
                      <table className="checkout-totals">
                        <tbody>
                          <tr> <th>SUBTOTAL</th> <td> {totalPrice.toFixed(2)}{currency.symbol} </td> </tr>
                          <tr> <th>SHIPPING</th> <td> {freeShippingFlag ? "You Got Free Shipping" : `Shipping Cost: ${shippingServiceCharges[0].price}${currency.symbol}`} </td> </tr>
                          <tr> <th>SERVICE FEE</th> <td> {shippingServiceCharges[1].price} {currency.symbol} </td> </tr>
                          {selectedOption === "cod" && ( <tr> <th>COD Charges</th> <td> {shippingServiceCharges[2].price}{currency.symbol} </td> </tr> )}
                          <tr> 
                            <th>TOTAL</th>
                            <td> 
                              {finalOrderPrice} {currency.symbol} (includes {totalVat} {currency.symbol} VAT)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <TamaraWidget amount={finalOrderPrice} inlineType='2' inlineVariant='outlined'/>
                    </div>
                  </div>

                  <div className="checkout__coupon-wrapper premium-coupon-container">
                    <div className="premium-coupon-header">
                      <span className="premium-coupon-title">Have a promo code?</span>
                      <button className="premium-coupon-view-btn" onClick={(e) => { e.preventDefault(); setShowCouponModal(true); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.5 12H16c-.7 2-3 3-4.5 1.5S10 9 12 8c2-1 4.5.5 4.5 2.5h5"></path>
                          <path d="M3 6h18v12H3z"></path>
                        </svg>
                        View Offers
                      </button>
                    </div>

                    {couponError && <div className="premium-coupon-msg error">{couponError}</div>}
                    {couponSuccess && <div className="premium-coupon-msg success">{couponSuccess}</div>}

                    <div className="premium-coupon-input-group">
                      <input 
                        className="premium-coupon-input" 
                        type="text" 
                        name="coupon_code" 
                        placeholder="Enter code" 
                        value={couponCode} 
                        onChange={handleCouponChange} 
                        disabled={!!couponData}
                      />
                      {!couponData ? ( 
                        <button className="premium-coupon-apply-btn" onClick={(e) => { e.preventDefault(); applyCoupon(e); }}>Apply</button> 
                      ) : ( 
                        <button className="premium-coupon-remove-btn" onClick={(e) => { e.preventDefault(); removeCoupon(e); }}>Remove</button> 
                      )}
                    </div>
                  

                </div>


                  <div className="checkout__payment-methods">
                    {!hasPreBookItem && <div className={`form-check premium-payment-card ${selectedOption === "cod" ? "active" : ""}`}>
                      <input className="form-check-input form-check-input_fill" type="radio" name="checkout_payment_method" id="checkout_payment_method_3" value={"cod"} checked={selectedOption === "cod"} onChange={handleRadioChange} />
                      <label className="form-check-label" htmlFor="checkout_payment_method_3" > Cash on delivery </label>
                    </div>}
                    <div className={`form-check premium-payment-card ${selectedOption === "paytabs" ? "active" : ""}`}>
                      <input className="form-check-input form-check-input_fill" type="radio" name="checkout_payment_method" id="checkout_payment_method_4" value={"paytabs"} checked={selectedOption === "paytabs"} onChange={handleRadioChange} />
                      <label className="form-check-label" htmlFor="checkout_payment_method_4">
                        PayTabs - Credit / Debit Card
                        <div className="payment-logos">
                          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20" viewBox="0 0 77 16" >
                            <g transform="translate(-523 -415)">
                              <rect style={{ fill: "#fff", opacity: 0 }} className="a" width="77" height="16" transform="translate(523 415)"/>
                              <path style={{ fill: "#2a2a6c" }} className="b" d="M70.75,432.369l-5.76,13.746H61.23L58.4,435.145a1.522,1.522,0,0,0-.847-1.21,15.018,15.018,0,0,0-3.509-1.167l.087-.4h6.049a1.657,1.657,0,0,1,1.64,1.4l1.5,7.955,3.7-9.357H70.75m14.727,9.256c.017-3.625-5.017-3.823-4.98-5.446.009-.494.479-1.019,1.507-1.151a6.719,6.719,0,0,1,3.507.612l.624-2.912a9.55,9.55,0,0,0-3.325-.609c-3.515,0-5.989,1.869-6.009,4.543-.023,1.978,1.765,3.082,3.113,3.741,1.385.674,1.847,1.1,1.842,1.708-.008.923-1.1,1.325-2.126,1.344a7.433,7.433,0,0,1-3.654-.869l-.644,3.014a10.87,10.87,0,0,0,3.956.731c3.735,0,6.178-1.849,6.19-4.707m9.28,4.49h3.29l-2.87-13.746H92.14a1.624,1.624,0,0,0-1.514,1.007l-5.332,12.739h3.732l.741-2.053H94.33Zm-3.967-4.87,1.872-5.161,1.077,5.161Zm-14.959-8.875L72.89,446.114H69.334l2.942-13.746Z" transform="translate(470.495 -16.119)" />
                              <g transform="translate(1.466 -18.353)">
                                <rect style={{ fill: "#ff5f00" }} className="c" width="6.84" height="11.172" transform="translate(581.019 435.873)" />
                                <path style={{ fill: "#eb001b" }} className="d" d="M16.226,14.558A7.093,7.093,0,0,1,18.94,8.973a7.1,7.1,0,1,0,0,11.172,7.093,7.093,0,0,1-2.714-5.587Z" transform="translate(565.497 426.902)" />
                                <path style={{ fill: "#f79e1b" }} className="e" d="M119.946,64.636v-.229h.1V64.36h-.235v.047h.093v.229Zm.456,0V64.36h-.071l-.083.2-.083-.2h-.071v.276h.051v-.209l.077.18h.053l.077-.18v.209Z" transform="translate(475.307 381.226)" />
                                <path style={{ fill: "#f79e1b" }} className="e" d="M77.186,14.547a7.1,7.1,0,0,1-11.5,5.585,7.1,7.1,0,0,0,0-11.172,7.1,7.1,0,0,1,11.5,5.585Z" transform="translate(518.747 426.913)"/>
                              </g>
                            </g>
                          </svg> 
                          <Image src="/assets/images/paytabs-svg/UnionPay_logo.png" alt="Union Pay" width={50} height={20} />
                          <Image src="/assets/images/paytabs-svg/Apple_Pay_logo.png" alt="Apple Pay" width={50} height={20} />
                          <Image src="/assets/images/paytabs-svg/Samsung_Pay_Logo.png" alt="Samsung Pay" width={50} height={20} />
                        </div>
                      </label>
                    </div>
                    
                    <div className={`form-check premium-payment-card ${selectedOption === "tamara" ? "active" : ""}`}>
                      <input className="form-check-input form-check-input_fill" type="radio" name="checkout_payment_method" id="checkout_payment_method_5" value={'tamara'} checked={selectedOption === 'tamara'} onChange={handleRadioChange} />
                      <label className="form-check-label" htmlFor="checkout_payment_method_5" style={{display: "inline-flex", alignItems: "center", gap: "8px"}} > 
                        Tamara - No interest, No fees. <TamaraWidget inlineType='4' inlineVariant='text'/> 
                      </label>
                    </div>

                    <div className={`form-check premium-payment-card ${selectedOption === "tabby" ? "active" : ""}`}>
                      <input  className="form-check-input form-check-input_fill" type="radio" name="checkout_payment_method" id="checkout_payment_method_6" value={'tabby'} checked={selectedOption === 'tabby'} onChange={handleRadioChange} />
                      <label className="form-check-label" htmlFor="checkout_payment_method_6" >
                        <div style={{display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"}}>
                          <Image src="/assets/images/paymentGateway/Tabby.png" width="60" height="25" alt="Tabby Logo" />
                          <span>{t("CheckoutTitle")} <sup style={{fontSize: "0.7em"}}><strong>ⓘ</strong></sup></span>
                        </div>
                        <span style={{fontWeight: "normal", fontSize: "0.8rem", color: "#666", marginTop: "4px"}}>{t("CheckoutDescription")}</span>
                      </label>
                      {selectedOption == 'tabby' && <div id="tabbyCard" style={{marginTop: "12px"}}></div>}
                    </div> 

                    <div className="policy-wrapper mt-3">
                      <p className="small text-muted mb-3" style={{ lineHeight: '1.5' }}>
                        {locale === 'ar' ? "سيتم استخدام بياناتك الشخصية لمعالجة طلبك، ودعم تجربتك في هذا الموقع، ولأغراض أخرى موصوفة في " : "Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our " }
                        <Link href={`/${locale}/privacy`} className="text-dark text-decoration-underline fw-medium" target="_blank"> {locale === 'ar' ? "سياسة الخصوصية." : "privacy policy."} </Link>
                      </p>

                      {/* Interactive Checkbox */}
                      <div className="form-check d-flex align-items-start p-0">
                        <input className="form-check-input border-secondary" type="checkbox" id="terms-agreement" required style={{ marginTop: '0.25rem', width: '1.1em', height: '1.1em', cursor: 'pointer', marginLeft: locale === 'ar' ? '0.5rem' : '0', marginRight: locale === 'ar' ? '0' : '0.5rem' }} />
                        <label htmlFor="terms-agreement" className="form-check-label small" style={{ cursor: 'pointer', userSelect: 'none' }} >
                          {locale === 'ar' ? "لقد قرأت ووافقت على " : "I have read and agree to the website "}
                          <Link href={`/${locale}/terms`} className="text-primary text-decoration-underline" target="_blank" > {locale === 'ar' ? "شروط وأحكام الموقع" : "terms and conditions"} </Link>
                          <span className="text-danger fw-bold mx-1">*</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {error ? ( <div style={{ backgroundColor: "#ffebe9", color: "#cf1e1e", padding: "14px 20px", marginBottom: "1rem", textAlign: "center", fontSize: "15px", fontWeight: "500", borderRadius: "2px",}}>{error}</div>) : success ? ( <div style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "14px 20px", marginBottom: "1rem", textAlign: "center", fontSize: "15px", fontWeight: "500", borderRadius: "2px", }} > {success} </div>) : null}
                  <div className="mobile_fixed-btn_wrapper">
                    <div className="button-wrapper container">
                      <button className="btn btn-primary w-100 text-uppercase btn-checkout" type="submit" disabled={disablePlaceOrder} > {isLoading ? "Loading..." : "Place Order"} </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>

      ) : (
        <>
          <div className="fs-20">Your Shopping cart is empty</div>
          <button className="btn mt-3 mb-3 btn-light"> <Link href={`/${locale}/shop`}>Shop Now</Link> </button>
        </>
      )}

      {/* ── Address Modal (Add / Edit) ──────────────────────────────────────── */}
      {(isAddingNewAddress || isEditingAddress) && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => { setIsAddingNewAddress(false); setIsEditingAddress(false); setAddressSaveError(null); }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "440px",
              padding: "28px 24px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h5 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#1a1a1a" }}>
                {isEditingAddress ? "Edit Address" : "Add New Address"}
              </h5>
              <button
                type="button"
                onClick={() => { setIsAddingNewAddress(false); setIsEditingAddress(false); setAddressSaveError(null); setNewAddressForm({ area: "", building: "", emirates: "" }); }}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#666", lineHeight: 1, padding: "2px 6px" }}
              >
                ✕
              </button>
            </div>

            {/* Area / Mantaqa */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="modal_new_addr_area"
                placeholder=" "
                name="area"
                value={newAddressForm.area}
                onChange={handleNewAddressChange}
                maxLength={15}
              />
              <label htmlFor="modal_new_addr_area">Area / Mantaqa *</label>
            </div>

            {/* Building / Villa */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="modal_new_addr_building"
                placeholder=" "
                name="building"
                value={newAddressForm.building}
                onChange={handleNewAddressChange}
              />
              <label htmlFor="modal_new_addr_building">Building / Villa / Apartment *</label>
            </div>

            {/* Emirate */}
            <div className="mb-3">
              <select
                className="form-control"
                id="modal_new_addr_emirates"
                name="emirates"
                value={newAddressForm.emirates}
                onChange={handleNewAddressChange}
                style={{ height: "58px", borderRadius: "6px", fontSize: "14px", color: newAddressForm.emirates ? "#1a1a1a" : "#888" }}
              >
                <option value="">Select Emirate *</option>
                {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Error */}
            {addressSaveError && (
              <div style={{ color: "#e74c3c", fontSize: "13px", marginBottom: "12px", padding: "8px 12px", background: "#fef2f2", borderRadius: "6px" }}>
                {addressSaveError}
              </div>
            )}

            {/* Footer buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => { setIsAddingNewAddress(false); setAddressSaveError(null); setNewAddressForm({ area: "", building: "", emirates: "" }); }}
                style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #d1d5db", background: "#f9fafb", fontSize: "14px", cursor: "pointer", color: "#374151", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveNewAddress}
                disabled={addressSaving}
                style={{ flex: 2, padding: "12px", borderRadius: "6px", border: "none", background: addressSaving ? "#9ca3af" : "#1a1a1a", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: addressSaving ? "not-allowed" : "pointer", letterSpacing: "0.5px" }}
              >
                {addressSaving ? "Saving…" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCouponModal && ( 
        <div className="coupon-modal-overlay" onClick={() => setShowCouponModal(false)} >
          <div className="coupon-modal" onClick={(e) => e.stopPropagation()} >
            <div className="coupon-header">
              <h3>Available Offers</h3>
              <button className="close-btn" onClick={() => setShowCouponModal(false)} > &times; </button>
            </div>
            <div className="coupon-subheader border-bottom"> <h3>Coupon Offers</h3> </div>
            {couponLoading ? ( <div className="coupon-loading">Loading…</div> ) : coupons.length === 0 ? ( <div className="coupon-empty"> You have no coupons yet. </div> ) : ( 
              <div className="coupon-body"> 
                {coupons.map((c, idx) => {
                  const expired = isExpired(c.end_date);
                  return ( 
                    <div key={c.id || `coupon-${idx}`} className={`coupon-ticket ${ expired ? "expired" : "" }`} >
                      <div className="coupon-left">
                        <div className="coupon-title"> {c.title || "Special Offer"} </div>
                        <div className="coupon-desc"> <h5> {c.description || (c.coupon_type === "percent" ? `${c.value}% OFF` : `AED${c.value} OFF`)} </h5> </div>
                        <div className="coupon-validity"> {expired ? `Expired: ${c.end_date?.slice(0, 10)}` : `Valid until: ${c.end_date?.slice(0, 10)}`}</div>
                      </div>
                      <div className="coupon-right"> 
                        <div className={`coupon-code-box ${copiedId === (c.id || `coupon-${idx}`) ? "copied" : "" }`} onClick={() => !expired && handleCopy(c.code, c.id || `coupon-${idx}`)}>
                          <span className="coupon-code"> {c.code} </span>
                        </div>
                        {!expired && ( 
                          <button className={`apply-btn ${copiedId === (c.id || `coupon-${idx}`) ? "applied" : "" }`} onClick={() => handleSelectCoupon(c.code, c.id || `coupon-${idx}` )}>
                            {copiedId === (c.id || `coupon-${idx}`) ? "Copied!" : "Click to Copy"} 
                          </button>
                        )}
                        {expired && ( <div className="coupon-expired-badge"> Expired </div> )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


// All Comments



  // ✅ [CHANGED] - Use the new API to fetch active coupons
  // useEffect(() => {
  //   // Helper function to map new API response to the structure your app uses
  //   const transformCouponData = (apiCoupons) => {
  //     if (!Array.isArray(apiCoupons)) return [];
  //     return apiCoupons.map((coupon) => ({
  //       id: coupon.couponCode, // Assuming couponCode is unique
  //       code: coupon.couponCode,
  //       title: coupon.promotionName,
  //       description: `Get ${coupon.value}${coupon.baseOn === "Percent" ? "%" : " AED"} off`,
  //       value: coupon.value,
  //       coupon_type: coupon.baseOn.toLowerCase(), // 'percent' or 'amount'
  //       type: "customer", // Assuming all coupons from this API are customer-level
  //       end_date: coupon.validTo,
  //       start_date: coupon.registrationDate,
  //     }));
  //   };

  //   const fetchCoupons = async () => {
  //     const { email, mobile } = formData.billingAddress;

  //     // Only fetch if email and a valid mobile number are available
  //     if (!email || !/^\d{10}$/.test(mobile)) {
  //       setCoupons([]);
  //       return;
  //     }

  //     setCouponLoading(true);
  //     try {
  //       const apiUrl = `${process.env.NEXT_PUBLIC_SMARTVIEW_API_URL}Coupon/ActiveCoupons?salesType=EComm&company=UAE&mobileNo=${mobile}&email=${email}`;
  //       const response = await fetch(apiUrl);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data, "data")
  //       console.log(response, "response")

  //       const transformedData = transformCouponData(data);
  //       console.log(transformedData, "transformCouponData")
  //       setCoupons(transformedData);
  //       // This context might not be needed anymore, but keeping for compatibility
  //       setCouponDataContext(transformedData);
  //       console.log("Setttttt Coupons",coupons);
        
  //     } catch (err) {
  //       console.error("Failed to fetch coupons:", err);
  //       setCoupons([]);
  //     } finally {
  //       setCouponLoading(false);
  //     }
  //   };

  //   fetchCoupons();
  //   // This effect runs when user details change in the form
  // }, [formData.billingAddress.email, formData.billingAddress.mobile]);
 // ✅ [FINAL VERSION] - Use the new API to fetch active coupons


    // if (
    //   elm?.coupon &&
    //   Object.keys(elm.coupon).length !== 0 &&
    //   couponData &&
    //   couponCode &&
    //   elm.coupon[couponCode.toLowerCase()]?.code ===
    //     couponData.code.toLowerCase() &&
    //   new Date(current_date_time) >=
    //     new Date(elm.coupon[couponCode.toLowerCase()]?.start_date) &&
    //   new Date(current_date_time) <=
    //     new Date(elm.coupon[couponCode.toLowerCase()]?.end_date) &&
    //   !promotionsContext.some((promo) =>
    //     promo.buy_products.some((item) => item.product_id === elm.product_id)
    //   ) &&
    //   !elm.discount
    // ) {
    //   itemPrice =
    //     elm.price - (elm.price / 100) * elm.coupon[couponCode.toLowerCase()].value;
    //   return (
    //     <td>
    //       <span className="money price price-sale">
    //         {currency.symbol}
    //         {(itemPrice * elm.quantity).toFixed(2)}
    //       </span>
    //       <span className="money price price-old">
    //         {currency.symbol}
    //         {(elm.price * elm.quantity).toFixed(2)}
    //       </span>
    //     </td>
    //   );
    // }