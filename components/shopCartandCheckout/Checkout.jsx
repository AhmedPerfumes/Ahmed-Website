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
  const searchParams = useSearchParams();
  const disablePlaceOrder = isLoading || (!isLoggedIn && !isOTPVerified) || (isLoggedIn && formData.shippingAdd && !isOTPVerified); 

  // USE EFFECTS
  useEffect(() => {
    if (hasPreBookItem) { setSelectedOption("paytabs"); }
  }, [hasPreBookItem]);



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

  // Pre-fill form for logged-in users
  useEffect(() => {
    if (isLoggedIn) {
      const userStr = localStorage.getItem("user");
      let firstName = "";
      let lastName = "";
      let email = "";
      let mobile = "";
      let area = "";
      let building = "";
      let emirates = "";

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

      const addrStr = localStorage.getItem("address");
      if (addrStr) {
        const addr = JSON.parse(atob(addrStr));
        area = addr.city || "";
        building = addr.address || "";
        emirates = addr.state || "";
      }

      setFormData((prev) => ({ 
        ...prev, 
        billingAddress: { ...prev.billingAddress, first_name: firstName, last_name: lastName, email, mobile, area, building, emirates, }, 
        shippingAddress: { ...prev.shippingAddress, first_name: firstName, last_name: lastName, email, mobile, area, building, emirates, },}));
    }
  }, [isLoggedIn]);

  // Fetch all saved addresses for logged-in users
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
          const parsed = data.addresses.map((addr) => ({
            id: addr.id,
            name: addr.name || userData?.name || "",
            email: addr.email || userData?.email || "",
            mobile: addr.phone || userData?.phone || "",
            area: addr.city || "",
            building: addr.address || "",
            emirates: addr.state || "",
            isDefault: addr.is_default === 1,
          }));
          setSavedAddresses(parsed);
          // auto-select default or first
          const def = parsed.find((a) => a.isDefault) || parsed[0];
          if (def) setSelectedAddressId(def.id);
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
            address: billing.building,
            city: billing.area,
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
    setSelectedAddressId(addr.id);
    setFormData((prev) => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, area: addr.area, building: addr.building, emirates: addr.emirates },
      shippingAddress: { ...prev.shippingAddress, area: addr.area, building: addr.building, emirates: addr.emirates },
    }));
    // Update localStorage default
    const raw = localStorage.getItem("user");
    const userData = raw ? JSON.parse(atob(raw)) : {};
    localStorage.setItem("address", btoa(JSON.stringify({
      id: addr.id, city: addr.area, address: addr.building, state: addr.emirates,
      name: addr.name, email: addr.email, phone: addr.mobile,
      customer_id: userData.id, is_default: 1,
    })));
    setShowAddressPanel(false);
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewAddress = async () => {
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

      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/customerAddressUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({
          address_id: -1, // -1 = create new address (handled by backend)
          customer_id,
          name: userData.name || "",
          email: userData.email || "",
          mobile: userData.phone || "",
          address: newAddressForm.building,
          city: newAddressForm.area,
          state: newAddressForm.emirates,
          is_default: 0,
        }),
      });
      const res = await resp.json();
      // Backend returns the real new DB id in res.id
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
          <FreeGiftFeature couponData={couponData} />
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
                        {savedAddresses.map((addr) => {
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
                                  {addr.isDefault ? "Primary" : "Saved"}
                                </span>
                              </div>

                              {isSelected && !isEditingAddress && (
                                <button type="button" className="checkout-addr-tile__edit" title="Edit this address"
                                  onClick={(e) => { e.stopPropagation(); setIsEditingAddress(true); setAddressSaveError(null); }}>
                                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                              )}
                              {isEditingThis && (
                                <div className="checkout-addr-tile__actions">
                                  <button type="button" className="checkout-addr-tile__save-btn" onClick={(e) => { e.stopPropagation(); updateAddress(); }} disabled={addressSaving}>
                                    {addressSaving ? "Saving…" : "Save"}
                                  </button>
                                  <button type="button" className="checkout-addr-tile__cancel-btn" onClick={(e) => { e.stopPropagation(); setIsEditingAddress(false); setAddressSaveError(null); }}>
                                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                  </button>
                                </div>
                              )}
                              <div className="checkout-addr-tile__body">
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

                      {/* + Add address inline link */}
                      <div style={{ marginTop: "10px", paddingLeft: "4px" }}>
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
                      </div>

                    </div>
                  )}

                <h4>Billing Details</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input type="text" className="form-control" id="checkout_first_name" placeholder="First Name" readOnly={isLoggedIn && !isEditingAddress} name="billingAddress.first_name" value={formData.billingAddress.first_name} onChange={handleChange} required />
                      <label htmlFor="checkout_first_name">First Name</label>
                      {fieldErrors.first_name && ( <div style={{ color: "red", fontSize: "0.85rem" }}> {fieldErrors.first_name} </div> )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input type="text" className="form-control" id="checkout_last_name" placeholder="Last Name" readOnly={isLoggedIn && !isEditingAddress} name="billingAddress.last_name" value={formData.billingAddress.last_name} onChange={handleChange} />
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
                      <input type="text" className="form-control" id="checkout_street_address" placeholder="Area / Mantaqa *" readOnly={isLoggedIn && !isEditingAddress} name="billingAddress.area" value={formData.billingAddress.area} onChange={handleChange} required />
                      <label htmlFor="checkout_company_name"> Area / Mantaqa * </label>
                      {fieldErrors.area && ( <div style={{ color: "red", fontSize: "0.85rem" }}> {fieldErrors.area} </div> )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mt-3 mb-3">
                      <input type="text" className="form-control" id="checkout_street_address_2" placeholder="Building / Villa / Apartment" name="billingAddress.building" readOnly={isLoggedIn && !isEditingAddress} value={formData.billingAddress.building} onChange={handleChange} required />
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
                      <input type="email" className="form-control" id="billingAddress.email" placeholder="Your Mail *" name="billingAddress.email" readOnly={isLoggedIn && !isEditingAddress} value={formData.billingAddress.email} onChange={handleChange} required />
                      <label htmlFor="checkout_email">Email Address *</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input type="tel" className="form-control" id="checkout_billing_mobile" placeholder="Eg. 0500000000 *" name="billingAddress.mobile" readOnly={isLoggedIn && !isEditingAddress} value={formData.billingAddress.mobile} onChange={handleChange} required />
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
                              <input type="number" className="form-control" id="billing_otp" placeholder="Eg. 1234 *" name="otp" value={formData.otp} onChange={handleChange} />
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
                    {!isLoggedIn && (
                      <div className="form-check mt-3">
                        <input className="form-check-input form-check-input_fill" type="checkbox" defaultValue="" id="create_account" onClick={(prev) => setCreateAccount(!createAccount)} name="create_account" />
                        <label className="form-check-label" htmlFor="create_account" > CREATE AN ACCOUNT? </label>
                      </div>
                    )}
                    <div className="form-check mb-3">
                      <input className="form-check-input form-check-input_fill" type="checkbox" defaultValue="" id="ship_different_address" onClick={handleCheckboxChange} name="shipping" />
                      <label className="form-check-label" htmlFor="ship_different_address" > SHIP TO A DIFFERENT ADDRESS? </label>
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
                                  <input type="text" className="form-control" id="shipping_first_name" placeholder="First Name" name="shippingAddress.first_name" value={ formData.shippingAddress.first_name } onChange={handleChange} required />
                                  <label htmlFor="shipping_first_name"> First Name </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input type="text" className="form-control" id="shipping_last_name" placeholder="Last Name" name="shippingAddress.last_name" value={formData.shippingAddress.last_name} onChange={handleChange} required />
                                  <label htmlFor="shipping_last_name"> Last Name </label>
                                </div>
                              </div>
                              {/* Shipping: Area + Building side by side */}
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input type="text" className="form-control" id="shipping_area" placeholder="Area / Mantaqa" name="shippingAddress.area" value={formData.shippingAddress.area} onChange={handleChange} required />
                                  <label htmlFor="shipping_area"> Area / Mantaqa * </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input type="text" className="form-control" id="shipping_building" placeholder="Building / Villa / Apartment" name="shippingAddress.building" value={ formData.shippingAddress.building } onChange={handleChange} required />
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
                                  <input type="tel" className="form-control" id="shipping_mobile" placeholder="Eg. 0500000000" name="shippingAddress.mobile" value={formData.shippingAddress.mobile} onChange={handleChange} required />
                                  <label htmlFor="shipping_mobile"> Mobile Number* </label>
                                </div>
                              </div>
                              {/* Email full width */}
                              <div className="col-md-12">
                                <div className="form-floating my-3">
                                  <input type="email" className="form-control" id="shipping_email" placeholder="Your Mail" name="shippingAddress.email" value={formData.shippingAddress.email} onChange={handleChange} required />
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
                                            <input type="number" className="form-control" id="shipping_otp" placeholder="Eg. 1234"  name="otp" value={formData.otp} onChange={handleChange} />
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
                      <input type="password" className="form-control" id="password" placeholder="Password *" name="password" value={formData.password} onChange={handleChange} required />
                      <label htmlFor="checkout_email">Password *</label>
                    </div>
                  </div>
                )}
              </div>

              <div className="checkout__totals-wrapper">
                <div className="sticky-content">
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
                        <button className="premium-coupon-apply-btn" onClick={(e) => { e.preventDefault(); applyCoupon(); }}>Apply</button> 
                      ) : ( 
                        <button className="premium-coupon-remove-btn" onClick={(e) => { e.preventDefault(); removeCoupon(); }}>Remove</button> 
                      )}
                    </div>
                  
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
                                        {copiedId === (c.id || `coupon-${idx}`) ? "Applied!" : "Click to Apply"} 
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
                </div>

                  <style jsx>{` 
                    .coupon-modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 999; }
                    .coupon-modal { background: #fff; border-radius: 12px; width: 500px; max-width: 90%; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); overflow:  hidden; font-family: "Inter", sans-serif; }
                    .coupon-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid #f0f0f0; }
                    .coupon-header h3 { margin: 0; font-size: 20px; font-weight: 600; color: #222; }
                    .coupon-subheader { padding: 10px 18px; border-bottom: 1px solid #f0f0f0; }
                    .coupon-subheader h3 { margin: 0; font-size: 16px; font-weight: 600; color: #a67b30; background: #fffaf2ff; }
                    .close-btn { background: none; border: none; font-size: 20px; color: #666; cursor: pointer; }
                    .coupon-body { display: flex; flex-direction: column; gap: 12px; padding: 16px; }
                    .coupon-ticket { display: flex; justify-content: space-between; align-items: center; border: 1px solid #e5e5e5; border-radius: 12px; background: #fff; padding: 14px 16px; position: relative; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); overflow: hidden; }
                    .coupon-ticket::before, .coupon-ticket::after { content: ""; position: absolute; top: 50%; width: 20px; height: 20px; background: #f5f5f5; border: 1.5px solid #dbdbdb; border-radius: 50%; transform: translateY(-50%); z-index: 2; }
                    .coupon-ticket::before { left: -10px; }
                    .coupon-ticket::after { right: -10px; }
                    .coupon-left { display: flex; flex-direction: column; gap: 4px; }
                    .coupon-title { font-size: 14px; font-weight: 600; color: #222; }
                    .coupon-desc { font-size: 12px; color: #555; }
                    .coupon-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; } 
                    .coupon-code { background: #f0fdf4; color: #198754; font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
                    .apply-btn { background: none; border: none; color: #a67b30; font-size: 12px; font-weight: 600; cursor: pointer; padding: 0; text-transform: uppercase; }
                    .apply-btn:hover { text-decoration: underline; }
                    .coupon-ticket.expired { opacity: 0.6; }
                    .coupon-loading, .coupon-empty { text-align: center; padding: 30px; color: #777; font-size: 13px; }
                    .coupon-action-btn { width: 100%; padding: 12px; background-color: #222; color: #fff; border: 1px solid #222; border-radius: 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; margin-top: 8px; }
                    .coupon-action-btn:hover { background-color: #000; border-color: #000; }
                    .coupon-action-btn.remove { background-color: transparent; color: #dc3545; border: 1px solid #dc3545; }
                    .coupon-action-btn.remove:hover { background-color: #dc3545; color: #fff; }

                    /* Premium Coupon Input Styles */
                    .premium-coupon-container {
                      background: #fdfcfa;
                      border: 1px solid #e9e3d5;
                      border-radius: 8px;
                      padding: 1.25rem;
                      margin-top: 1rem;
                      margin-bottom: 1.5rem;
                    }
                    .premium-coupon-header {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-bottom: 0.875rem;
                    }
                    .premium-coupon-title {
                      font-size: 0.8125rem;
                      font-weight: 700;
                      color: #222;
                      letter-spacing: 0.03em;
                      text-transform: uppercase;
                    }
                    .premium-coupon-view-btn {
                      background: none;
                      border: none;
                      color: #a67b30;
                      font-size: 0.75rem;
                      font-weight: 700;
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                      display: flex;
                      align-items: center;
                      gap: 4px;
                      cursor: pointer;
                      padding: 0;
                    }
                    .premium-coupon-view-btn:hover {
                      text-decoration: underline;
                    }
                    .premium-coupon-input-group {
                      display: flex;
                      gap: 8px;
                      position: relative;
                    }
                    .premium-coupon-input {
                      flex: 1;
                      border: 1px solid #e5e5e5;
                      border-radius: 6px;
                      padding: 0.625rem 1rem;
                      font-size: 0.875rem;
                      color: #222;
                      background: #fff;
                      transition: all 0.2s ease;
                      text-transform: uppercase;
                      height: 42px;
                    }
                    .premium-coupon-input:focus {
                      border-color: #a67b30;
                      outline: none;
                      box-shadow: 0 0 0 2px rgba(166, 123, 48, 0.1);
                    }
                    .premium-coupon-input:disabled {
                      background: #f5f5f5;
                      color: #666;
                      border-color: #ddd;
                    }
                    .premium-coupon-apply-btn {
                      background: #222;
                      color: #fff;
                      border: none;
                      border-radius: 6px;
                      padding: 0 1.25rem;
                      font-size: 0.8125rem;
                      font-weight: 700;
                      cursor: pointer;
                      transition: background 0.2s;
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                      height: 42px;
                    }
                    .premium-coupon-apply-btn:hover {
                      background: #000;
                    }
                    .premium-coupon-remove-btn {
                      background: #fdfcfa;
                      color: #dc3545;
                      border: 1px solid #dc3545;
                      border-radius: 6px;
                      padding: 0 1.25rem;
                      font-size: 0.8125rem;
                      font-weight: 700;
                      cursor: pointer;
                      transition: all 0.2s;
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                      height: 42px;
                    }
                    .premium-coupon-remove-btn:hover {
                      background: #dc3545;
                      color: #fff;
                    }
                    .premium-coupon-msg {
                      font-size: 0.75rem;
                      margin-bottom: 0.625rem;
                      font-weight: 600;
                      letter-spacing: 0.02em;
                    }
                    .premium-coupon-msg.error {
                      color: #dc3545;
                    }
                    .premium-coupon-msg.success {
                      color: #2e7d32;
                    }
                    /* Collapsible Order Summary Premium Styles */
                    .checkout-summary-toggle-bar {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 1rem 1.25rem;
                      background-color: #FCFAF6;
                      border: none;
                      border-bottom: 1px solid transparent;
                      cursor: pointer;
                      user-select: none;
                      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .checkout-summary-toggle-bar[aria-expanded="true"] {
                      border-bottom: 1px solid #F1ECE0;
                      background-color: #ffffff;
                    }

                    .checkout-summary-toggle-bar:hover {
                      background-color: #FAF6EE;
                    }

                    .toggle-left {
                      display: flex;
                      align-items: center;
                      gap: 0.625rem;
                    }

                    .summary-bag-icon {
                      color: #bca172;
                      flex-shrink: 0;
                      transition: transform 0.3s ease;
                    }

                    .checkout-summary-toggle-bar:hover .summary-bag-icon {
                      transform: translateY(-1px);
                    }

                    .toggle-text {
                      font-size: 0.75rem;
                      font-weight: 500;
                      color: #222;
                      letter-spacing: 0.08em;
                      text-transform: uppercase;
                      font-family: "Inter", sans-serif;
                    }

                    .toggle-text-desktop {
                      display: none;
                    }

                    .toggle-text-mobile {
                      display: inline;
                    }

                    .toggle-chevron {
                      color: #bca172;
                      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .toggle-chevron.rotated {
                      transform: rotate(180deg);
                    }

                    .toggle-right {
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                    }

                    .summary-total-price {
                      font-size: 0.9375rem;
                      font-weight: 600;
                      color: #111;
                      letter-spacing: 0.02em;
                      font-family: "Inter", sans-serif;
                    }

                    .checkout-summary-collapsible-content {
                      overflow: hidden;
                      max-height: 0;
                      opacity: 0;
                      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
                      padding: 0 1.25rem;
                    }

                    .checkout-summary-collapsible-content.expanded {
                      max-height: 2000px;
                      opacity: 1;
                      padding: 0.5rem 1.25rem 1.25rem 1.25rem;
                    }

                    @media (max-width: 1199.98px) {
                      .checkout__totals {
                        position: sticky !important;
                        top: 64px !important;
                        z-index: 99 !important;
                        background: #ffffff !important;
                        border: 1px solid #efeae0 !important;
                        border-radius: 12px !important;
                        padding: 0 !important;
                        margin-bottom: 1.5rem !important;
                        box-shadow: 0 10px 30px rgba(166, 123, 48, 0.08) !important;
                        overflow: hidden;
                        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                      }

                      .checkout__totals.is-open {
                        position: static !important;
                      }
                    }



                    /* ══ Address Tile Row — horizontal card selector ══ */
                    .checkout-addr-section {
                      margin: 0 0 2rem 0;
                      padding: 1.5rem;
                      background: #fdfcfa !important;
                      border: 1px solid #e9e3d5 !important;
                      border-radius: 8px !important;
                      text-transform: none !important;
                    }
                    .checkout-addr-section * {
                      text-transform: none !important;
                    }
                    .checkout-addr-section-label {
                      font-size: 0.75rem !important;
                      font-weight: 700 !important;
                      color: #a67b30 !important;
                      letter-spacing: 0.05em !important;
                      text-transform: uppercase !important;
                      margin-bottom: 1.25rem !important;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      width: 100%;
                    }
                    .checkout-addr-success {
                      color: #2e7d32 !important;
                      font-size: 0.75rem !important;
                      font-weight: 600 !important;
                    }
                    .checkout-addr-error {
                      color: #cf1e1e !important;
                      font-size: 0.75rem !important;
                      font-weight: 600 !important;
                    }
                    .checkout-addr-row {
                      display: flex !important;
                      flex-direction: row !important;
                      gap: 16px !important;
                      overflow-x: auto !important;
                      padding: 4px 4px 12px 4px !important;
                      scrollbar-width: thin !important;
                      scrollbar-color: #a67b30 transparent !important;
                      align-items: stretch !important;
                    }
                    .checkout-addr-row::-webkit-scrollbar {
                      height: 6px !important;
                    }
                    .checkout-addr-row::-webkit-scrollbar-thumb {
                      background: #a67b30 !important;
                      border-radius: 3px !important;
                    }
                    .checkout-addr-row::-webkit-scrollbar-track {
                      background: #f1ebd9 !important;
                    }
                    .checkout-addr-tile {
                      position: relative !important;
                      flex: 0 0 250px !important;
                      min-height: 165px !important;
                      border: 1px solid #e2ddd4 !important;
                      border-radius: 8px !important;
                      padding: 1.25rem 1rem 1rem !important;
                      background: #ffffff !important;
                      cursor: pointer !important;
                      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                      text-align: left !important;
                      display: flex !important;
                      flex-direction: column !important;
                      justify-content: space-between !important;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02) !important;
                    }
                    .checkout-addr-tile:hover {
                      border-color: #a67b30 !important;
                      transform: translateY(-2px) !important;
                      box-shadow: 0 4px 12px rgba(166, 123, 48, 0.08) !important;
                    }
                    .checkout-addr-tile--selected {
                      border-color: #a67b30 !important;
                      border-width: 2px !important;
                      background: #fffbf4 !important;
                      box-shadow: 0 4px 15px rgba(166, 123, 48, 0.12) !important;
                    }
                    .checkout-addr-tile__header {
                      display: flex !important;
                      align-items: center !important;
                      gap: 8px !important;
                      margin-bottom: 8px !important;
                      font-size: 0.75rem !important;
                      font-weight: 700 !important;
                      color: #888 !important;
                      letter-spacing: 0.03em !important;
                      text-transform: uppercase !important;
                    }
                    .checkout-addr-tile--selected .checkout-addr-tile__header {
                      color: #a67b30 !important;
                    }
                    .checkout-addr-tile__radio {
                      width: 14px !important;
                      height: 14px !important;
                      border-radius: 50% !important;
                      border: 1.5px solid #ccc !important;
                      display: inline-block !important;
                      position: relative !important;
                    }
                    .checkout-addr-tile__radio--selected {
                      border-color: #a67b30 !important;
                    }
                    .checkout-addr-tile__radio--selected::after {
                      content: "" !important;
                      position: absolute !important;
                      top: 2.5px !important;
                      left: 2.5px !important;
                      width: 6px !important;
                      height: 6px !important;
                      border-radius: 50% !important;
                      background: #a67b30 !important;
                    }
                    .checkout-addr-tile__body {
                      flex-grow: 1 !important;
                      display: flex !important;
                      flex-direction: column !important;
                      gap: 3px !important;
                      margin-bottom: 8px !important;
                      padding-right: 15px !important;
                    }
                    .checkout-addr-tile__line {
                      font-size: 0.785rem !important;
                      color: #555 !important;
                      line-height: 1.45 !important;
                      margin: 0 !important;
                      text-transform: none !important;
                    }
                    .checkout-addr-tile__line b {
                      color: #222 !important;
                      font-weight: 600 !important;
                    }
                    .checkout-addr-tile__footer {
                      display: flex !important;
                      align-items: center !important;
                      justify-content: space-between !important;
                      margin-top: auto !important;
                    }
                    .checkout-addr-tile__check {
                      display: inline-flex !important;
                      align-items: center !important;
                      justify-content: center !important;
                      width: 18px !important;
                      height: 18px !important;
                      background: #a67b30 !important;
                      color: #fff !important;
                      border-radius: 50% !important;
                      font-size: 11px !important;
                      font-weight: bold !important;
                    }
                    .checkout-addr-tile__default {
                      display: inline-block !important;
                      font-size: 0.625rem !important;
                      background: #bca172 !important;
                      color: #fff !important;
                      border-radius: 4px !important;
                      padding: 2px 6px !important;
                      font-weight: 700 !important;
                      text-transform: uppercase !important;
                      letter-spacing: 0.05em !important;
                    }
                    .checkout-addr-tile__edit {
                      position: absolute !important;
                      top: 12px !important;
                      right: 12px !important;
                      background: #faf7f0 !important;
                      border: 1px solid #e9e2d3 !important;
                      width: 28px !important;
                      height: 28px !important;
                      border-radius: 50% !important;
                      display: flex !important;
                      align-items: center !important;
                      justify-content: center !important;
                      cursor: pointer !important;
                      font-size: 12px !important;
                      transition: all 0.2s ease !important;
                      padding: 0 !important;
                    }
                    .checkout-addr-tile__edit:hover {
                      background: #a67b30 !important;
                      color: #fff !important;
                      border-color: #a67b30 !important;
                    }
                    .checkout-addr-tile__actions {
                      position: absolute !important;
                      top: 10px !important;
                      right: 10px !important;
                      display: flex !important;
                      gap: 6px !important;
                      z-index: 10 !important;
                    }
                    .checkout-addr-tile__save-btn {
                      background: #2e7d32 !important;
                      color: #fff !important;
                      border: none !important;
                      border-radius: 4px !important;
                      padding: 4px 10px !important;
                      font-size: 0.6875rem !important;
                      font-weight: 700 !important;
                      cursor: pointer !important;
                      display: flex !important;
                      align-items: center !important;
                      gap: 4px !important;
                      box-shadow: 0 2px 4px rgba(46, 125, 50, 0.2) !important;
                      transition: background 0.2s !important;
                    }
                    .checkout-addr-tile__save-btn:hover {
                      background: #1b5e20 !important;
                    }
                    .checkout-addr-tile__cancel-btn {
                      background: #fff !important;
                      color: #555 !important;
                      border: 1px solid #ccc !important;
                      border-radius: 4px !important;
                      padding: 4px 8px !important;
                      font-size: 0.6875rem !important;
                      cursor: pointer !important;
                      transition: all 0.2s !important;
                    }
                    .checkout-addr-tile__cancel-btn:hover {
                      background: #f5f5f5 !important;
                      border-color: #999 !important;
                    }
                    .checkout-addr-tile--add {
                      flex: 0 0 200px !important;
                      display: flex !important;
                      flex-direction: column !important;
                      align-items: center !important;
                      justify-content: center !important;
                      gap: 8px !important;
                      border: 1.5px dashed #a67b30 !important;
                      color: #a67b30 !important;
                      background: transparent !important;
                      transition: all 0.25s ease !important;
                    }
                    .checkout-addr-tile--add:hover {
                      background: #fffbf4 !important;
                      border-style: solid !important;
                      transform: translateY(-2px) !important;
                    }
                    .checkout-addr-tile__plus {
                      font-size: 24px !important;
                      font-weight: 300 !important;
                      line-height: 1 !important;
                    }
                    .checkout-addr-new-form {
                      flex: 0 0 280px !important;
                      border: 1px solid #a67b30 !important;
                      border-radius: 8px !important;
                      padding: 1rem !important;
                      background: #ffffff !important;
                      display: flex !important;
                      flex-direction: column !important;
                      gap: 8px !important;
                      box-shadow: 0 4px 15px rgba(166, 123, 48, 0.08) !important;
                    }
                    .checkout-addr-new-form__header {
                      display: flex !important;
                      justify-content: space-between !important;
                      align-items: center !important;
                      font-size: 0.75rem !important;
                      font-weight: 700 !important;
                      color: #a67b30 !important;
                      text-transform: uppercase !important;
                      letter-spacing: 0.05em !important;
                      margin-bottom: 4px !important;
                    }
                     .checkout-addr-new-form__header button {
                      background: none !important;
                      border: none !important;
                      font-size: 16px !important;
                      cursor: pointer !important;
                    }
                    .checkout-addr-new-form__header button:hover {
                      color: #222 !important;
                    }
                    .checkout-addr-new-form .form-control {
                      font-size: 0.75rem !important;
                      padding: 8px 12px !important;
                      height: auto !important;
                      border: 1px solid #ddd !important;
                      border-radius: 4px !important;
                      color: #222 !important;
                      background-color: #fff !important;
                    }
                    .checkout-addr-new-form .form-control:focus {
                      border-color: #a67b30 !important;
                      box-shadow: none !important;
                      color: #222 !important;
                      background-color: #fff !important;
                    }
                    .checkout-addr-new-form select.form-control {
                      padding: 8px 12px !important;
                      color: #222 !important;
                      background-color: #fff !important;
                    }
                    .checkout-addr-new-form select.form-control option {
                      color: #222 !important;
                      background-color: #fff !important;
                    }
                    .checkout-addr-new-form .form-floating {
                      position: relative !important;
                    }
                    .checkout-addr-new-form .form-floating label {
                      font-size: 0.6875rem !important;
                      padding: 8px 12px !important;
                    }
                  `}</style>

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

      {/* ── Add New Address Modal ──────────────────────────────────────── */}
      {isAddingNewAddress && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => { setIsAddingNewAddress(false); setAddressSaveError(null); }}
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
                Add New Address
              </h5>
              <button
                type="button"
                onClick={() => { setIsAddingNewAddress(false); setAddressSaveError(null); setNewAddressForm({ area: "", building: "", emirates: "" }); }}
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
                placeholder="Area"
                name="area"
                value={newAddressForm.area}
                onChange={handleNewAddressChange}
              />
              <label htmlFor="modal_new_addr_area">Area / Mantaqa *</label>
            </div>

            {/* Building / Villa */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="modal_new_addr_building"
                placeholder="Building"
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