"use client";
const countries = [
  "Abu Dhabi",
  "Ajman",
  "Al Ain",
  "Dubai",
  "Fujairah",
  "Ras Al Khaymah",
  "Sharjah",
  "Umm Al Quwain",
];
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
// import { bogoProducts } from "@/components/BogoFeature";

import TamaraWidget from "@/components/TamaraWidget";

export default function Checkout() {
  const t = useTranslations("Tabby")
  const {
    shippingServiceCharges,
    vatTax,
    isLoading: isMenuLoading,
    error: isMenuError,
    currency,
  } = useMenu();
  const router = useRouter();
  const locale = useLocale();

  const [coupons, setCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const {
    cartProducts,
    totalPrice,
    freeShippingFlag,
    setOrderDetails,
    setCouponDataContext,
    setCartProducts,
    removeGiftFromCart,
    promotionsContext,
    actualTotalPrice,
    hasPreBookItem
  } = useContextElement();
  const { isLoggedIn } = useUser();
  const [fieldErrors, setFieldErrors] = useState({});
  const [idDDActive, setIdDDActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("cod");

  useEffect(() => {
    if (hasPreBookItem) {
      setSelectedOption("paytabs");
    }
  }, [hasPreBookItem]);

  const [formData, setFormData] = useState({
    shippingAddress: {
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      country: "AE",
      area: "",
      building: "",
      emirates: "",
    },
    billingAddress: {
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      country: "AE",
      area: "",
      building: "",
      emirates: "",
    },
    shippingAdd: false,
    note: "",
    password: "",
    otp: "",
  });
  const [createAccount, setCreateAccount] = useState(false);
  const [finalPriceState, setFinalPriceState] = useState(null);

  const hasCleaned = useRef(false);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasCleaned.current) return;

    const hasBogo = cartProducts.some((item) =>
      promotionsContext.some((promo) =>
        promo.buy_products.some(
          (buyItem) => buyItem.product_id === item.product_id
        )
      )
    );

    if (!hasBogo) {
      const cleanedCart = cartProducts.map(
        ({ is_coupon, value, ...rest }) => rest
      );
      setCartProducts(cleanedCart);
      setCouponDataContext(null);
      hasCleaned.current = true; // prevent future runs
    }
  }, [cartProducts, promotionsContext, setCartProducts, setCouponDataContext]);

  // Pre-fill form for logged-in users
  useEffect(() => {
    if (isLoggedIn) {
      let firstName = "";
      let lastName = "";
      let email = "";
      let mobile = "";
      let area = "";
      let building = "";
      let emirates = "";

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

      const addrStr = localStorage.getItem("address");
      if (addrStr) {
        const addr = JSON.parse(atob(addrStr));
        area = addr.city || "";
        building = addr.address || "";
        emirates = addr.state || "";
      }

      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          first_name: firstName,
          last_name: lastName,
          email,
          mobile,
          area,
          building,
          emirates,
        },
        shippingAddress: {
          ...prev.shippingAddress,
          first_name: firstName,
          last_name: lastName,
          email,
          mobile,
          area,
          building,
          emirates,
        },
      }));
    }
  }, [isLoggedIn]);

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
  useEffect(() => {
  const { mobile, email } = formData.billingAddress;

  // If already fetched once, stop here
  if (hasFetchedRef.current) return;

  // If mobile is missing or not valid, don't fetch yet
  if (!/^\d{10}$/.test(mobile)) {
    return;
  }

  // Mark as fetched so it won't run again
  hasFetchedRef.current = true;

  // ---- Your existing code ----

  const transformCouponData = (apiCoupons) => {
    if (!Array.isArray(apiCoupons)) return [];

    return apiCoupons
      .filter(coupon => coupon.active === true)
      .map((coupon) => ({
        id: coupon.couponCode,
        code: coupon.couponCode,
        title: coupon.promotionName,
        description: `Get ${coupon.value}${coupon.baseOn === "Percent" ? "%" : " AED"} off`,
        value: coupon.value,
        coupon_type: coupon.baseOn ? coupon.baseOn.toLowerCase() : 'percent',
        type: "customer",
        end_date: coupon.validTo,
        start_date: coupon.registrationDate,
        couponRegistrationId: coupon.couponRegistrationId,
        couponId: coupon.couponId,
        salesType: coupon.salesType,
        company: coupon.company,
        whsCode: coupon.whsCode
      }));
    };

  const fetchCoupons = async () => {
    setCouponLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SMARTVIEW_API_URL}Coupon/ActiveCoupons`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salesType: "EComm",
          company: "UAE",
          mobileNo: mobile,
          email: email
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const transformedData = transformCouponData(data.data);

      setCoupons(transformedData);
      setCouponDataContext(transformedData);

    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      setCoupons([]);
    } finally {
      setCouponLoading(false);
    }
  };

  fetchCoupons();
}, [formData.billingAddress.mobile]);

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

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("shipping") || name.startsWith("billing")) {
      const addressField = name.startsWith("shipping")
        ? "shippingAddress"
        : "billingAddress";
      const fieldName = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        [addressField]: {
          ...prevData[addressField],
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => {
      const newSameAsShipping = !prevData.shippingAdd;
      if (!newSameAsShipping) {
        setIsOTPButton(true);
        setIsOTPVerified(false);
        setOTPSuccess(null);
        setOTPError(null);
      }
      return {
        ...prevData,
        shippingAdd: newSameAsShipping,
        shippingAddress: {
          first_name: "",
          last_name: "",
          mobile: "",
          email: "",
          area: "",
          building: "",
          emirates: "",
        },
      };
    });
  };

  useEffect(() => {
      const finalPrice = !freeShippingFlag ? parseFloat(shippingServiceCharges[0]?.price) + totalPrice + parseFloat(shippingServiceCharges[1]?.price) : 0 + totalPrice + parseFloat(shippingServiceCharges[1]?.price);
      setFinalPriceState(finalPrice);
  }, [selectedOption]);

  useEffect(() => {
    // Load the TabbyCard script
    const tabbyCardScript = document.createElement("script");
    tabbyCardScript.src = "https://checkout.tabby.ai/tabby-card.js";
    tabbyCardScript.async = true;
    document.body.appendChild(tabbyCardScript);

    // Load the TabbyPromo script
    // const tabbyPromoScript = document.createElement("script");
    // tabbyPromoScript.src = "https://checkout.tabby.ai/tabby-promo.js";
    // tabbyPromoScript.async = true;
    // document.body.appendChild(tabbyPromoScript);

    const finalPrice = !freeShippingFlag ? parseFloat(shippingServiceCharges[0]?.price) + totalPrice + parseFloat(shippingServiceCharges[1]?.price) : 0 + totalPrice + parseFloat(shippingServiceCharges[1]?.price);

    tabbyCardScript.onload = () => {
      new window.TabbyCard({
        selector: "#tabbyCard", // empty div for TabbyCard.
        currency: "AED", // required, AED|SAR|KWD only supported.
        lang: locale, // Optional, language of snippet and popups.
        price: finalPrice, // required, total cart amount.
        size: "wide", // required, narrow|wide supported.
        theme: "black", // required, black|default supported.
        header: true, // if a Payment method name is present already.
      });
    };

    // tabbyPromoScript.onload = () => {
    //   new window.TabbyPromo({
    //         selector: '#TabbyPromo', // required, content of tabby Promo Snippet will be placed in element with that selector.
    //         currency: 'AED', // required, AED|SAR|KWD only supported, with no spaces or lowercase.
    //         price: !freeShippingFlag ? (parseFloat(shippingServiceCharges[0].price) + totalPrice + parseFloat(shippingServiceCharges[1].price)).toFixed(2) : (0 + totalPrice + parseFloat(shippingServiceCharges[1].price)).toFixed(2), // required, price of the product. 2 decimals max for AED|SAR and 3 decimals max for KWD.
    //         lang: locale, // Optional, en|ar only supported
    //         source: 'product', // Optional, snippet placement; `product` for product page and `cart` for cart page.
    //         publicKey: process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY, // required, Public Key
    //         merchantCode: 'APM'  // required
    //     });
    // };

    return () => {
      document.body.removeChild(tabbyCardScript);
      // document.body.removeChild(tabbyPromoScript);
    };
  }, [selectedOption]);
  const searchParams = useSearchParams();
  useEffect(() => {
    const errorMsg = searchParams.get("error");
    
    if (errorMsg) {
      setError(errorMsg);

      // 2. Show the Toast notification
      toast.error(errorMsg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  const handleEmiratesChange = (event, emirates) => {
    const { id } = event.target;
    if (id.startsWith("shipping") || id.startsWith("billing")) {
      const addressField = id.startsWith("shipping")
        ? "shippingAddress"
        : "billingAddress";
      const fieldName = id.split(".")[1];
      setFormData((prevData) => {
        return {
          ...prevData,
          [addressField]: {
            ...prevData[addressField],
            [fieldName]: emirates,
          },
        };
      });
    }
  };

  async function onOrder(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const billing = formData.billingAddress;
    const newErrors = {};

    if (!billing.first_name.trim())
      newErrors.first_name = "First Name is required";
    if (!billing.country.trim()) newErrors.country = "Country is required";
    if (!billing.area.trim()) newErrors.area = "Area / Mantaqa is required";
    if (!billing.building.trim())
      newErrors.building = "Building / Villa / Apartment is required";
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

    const shippingPrice = freeShippingFlag
      ? 0.0
      : parseFloat(shippingServiceCharges[0].price);
    const shippingPriceVat = (shippingPrice / 100) * vatTax.percentage;
    const finalPrice = parseFloat(
      (!freeShippingFlag
        ? parseFloat(shippingServiceCharges[0].price) +
          totalPrice +
          parseFloat(shippingServiceCharges[1].price) +
          (selectedOption === "cod"
            ? parseFloat(shippingServiceCharges[2].price)
            : 0.0)
        : 0 +
          totalPrice +
          parseFloat(shippingServiceCharges[1].price) +
          (selectedOption === "cod"
            ? parseFloat(shippingServiceCharges[2].price)
            : 0.0)
      ).toFixed(2)
    );

    const servicePrice = shippingServiceCharges[1].price;
    const servicePriceVat = (servicePrice / 100) * vatTax.percentage;

    const codPrice =
      selectedOption === "cod" ? shippingServiceCharges[2].price : 0.0;
    const codPriceVat = (codPrice / 100) * vatTax.percentage;

    let userJson = null;
    if (isLoggedIn) {
      const user = atob(localStorage.getItem("user"));
      userJson = JSON.parse(user);
    }

    // console.log("coupponData", couponData);return;

    const additionalFields = {
      ...formData,
      products: cartProducts,
      payment_method: selectedOption,
      shippingPrice,
      shippingPriceVat,
      servicePrice,
      servicePriceVat,
      vatTax: vatTax.percentage,
      totalPrice,
      finalPrice,
      customer_id: isLoggedIn && userJson ? userJson.id : null,
      locale,
      couponCode,
      codPrice,
      codPriceVat,
      couponData,
    };

    // console.log("additionalFields", additionalFields);return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/storeOrder`,
        {
          method: "POST",
          body: JSON.stringify(additionalFields),
          headers: {
            "content-type": "application/json",
          },
        }
      );

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
          shippingAddress: {
            first_name: "",
            last_name: "",
            mobile: "",
            email: "",
            area: "",
            building: "",
            emirates: "",
          },
          billingAddress: {
            first_name: "",
            last_name: "",
            mobile: "",
            email: "",
            area: "",
            building: "",
            emirates: "",
          },
          shippingAdd: false,
        });
        setTimeout(() => router.push(`/${locale}/shop-order-complete`), 1000);
      } else if (
        data.message &&
        data.message.split(" ")[0] == "Redirecting"
      ) {
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
      } else {
        if (data.products) setError(data.products);
        if (data["billingAddress.first_name"])
          setError(data["billingAddress.first_name"]);
        if (data["billingAddress.email"])
          setError(data["billingAddress.email"]);
        if (data["billingAddress.mobile"])
          setError(data["billingAddress.mobile"]);
        if (data["billingAddress.area"]) setError(data["billingAddress.area"]);
        if (data["billingAddress.building"])
          setError(data["billingAddress.building"]);
        if (data["billingAddress.emirates"])
          setError(data["billingAddress.emirates"]);
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

    const targetMobile = !isLoggedIn
      ? formData.billingAddress.mobile
      : formData.shippingAddress.mobile;

    if (targetMobile == "") {
      setOTPError("Mobile Number is Required");
      setOTPSuccess(null);
      setIsSendOTPLoading(false);
      return;
    }
    const regex = /^\d{10}$/;
    if (!regex.test(targetMobile)) {
      setOTPError("Invalid Mobile Number");
      setOTPSuccess(null);
      setIsSendOTPLoading(false);
      return;
    }
    setOTPError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/sendOTP`,
        {
          method: "POST",
          body: JSON.stringify({ mobile: targetMobile }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      const data = await response.json();
      if (data.message && data.message.split(" ")[0] == "OTP") {
        setOTPSuccess(data.message);
        setOTPError(null);
        setIsOTPButton(false);
      } else {
        if (data["mobile"]) {
          setOTPSuccess(data["mobile"]);
        }
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

    if (formData.otp === "") {
      setOTPError("OTP is Required");
      setOTPSuccess(null);
      setIsSendOTPLoading(false);
      return;
    }
    const regex = /^\d+$/;
    if (!regex.test(formData.otp)) {
      setOTPError("Invalid OTP");
      setOTPSuccess(null);
      setIsSendOTPLoading(false);
      return;
    }
    setOTPError(null);

    const targetMobile = !isLoggedIn
      ? formData.billingAddress.mobile
      : formData.shippingAddress.mobile;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/verifyOTP`,
        {
          method: "POST",
          body: JSON.stringify({
            mobile: targetMobile,
            otp: formData.otp,
            flag: "checkout",
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      const data = await response.json();
      if (data.message && data.message.split(" ")[0] === "Invalid") {
        setOTPSuccess(null);
        setOTPError(data.message);
      } else if (data.message && data.message.split(" ")[0] === "OTP") {
        setOTPSuccess(data.message);
        setIsOTPVerified(true);
        setIsDisabled(false);
        setOTPError(null);
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

  // ✅ [REWRITTEN] - Apply coupon using client-side validation
  const applyCoupon = async (e) => {
    e.preventDefault();

    const user = isLoggedIn ? JSON.parse(atob(localStorage.getItem("user"))) : null;

    if (!couponCode.trim()) {
      setCouponError("Coupon Code is Required");
      return;
    }

    if (!isOTPVerified && !isLoggedIn) {
      setCouponError("Please verify your mobile number first.");
      return;
    }

    const code = couponCode.toLowerCase();

    const eligibleItems = cartProducts.filter((item) => {
      const isBogoProduct = promotionsContext.some((promo) =>
        promo.buy_products.some(
          (buyItem) => buyItem.product_id === item.product_id
        )
      );
      return !item.discount && !isBogoProduct && !item.is_gift && !item.collection_name;
    });

    if (eligibleItems.length === 0) {
      setCouponError("This coupon is not applicable to the items in your cart.");
      setCouponCode("");
      return;
    }

    // Find the coupon from the state (fetched from the new API)
    const validCoupon = coupons.find((c) => c.code.toLowerCase() === code);

    let payload = {
      company: "UAE",
      salesType: "EComm",
      couponRegistrationId: validCoupon ? validCoupon.couponRegistrationId : 0,
      couponCode: validCoupon ? "" : couponCode.trim(),
      mobileNo: user?.phone || formData.billingAddress.mobile,
      email: user?.email || formData.billingAddress.email,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SMARTVIEW_API_URL}Coupon/ActiveCoupons`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      apiCoupon = {
        id: apiCoupon.couponCode,
        code: apiCoupon.couponCode,
        title: apiCoupon.promotionName,
        description: apiCoupon.promotionName,
        value: apiCoupon.value,
        coupon_type: apiCoupon.baseOn === "P" ? "percent" : "amount",
        type: "customer",
        end_date: apiCoupon.validTo,
        start_date: apiCoupon.registrationDate,
        couponRegistrationId: apiCoupon.couponRegistrationId,
        salesType: apiCoupon.salesType,
        company: apiCoupon.company,
        whsCode: apiCoupon.whsCode,
      };
    }

    // If validCoupon exists, use it. Otherwise, use normalized apiCoupon from response.
    const couponToApply = validCoupon || apiCoupon;

    if (!couponToApply) {
      setCouponError("Invalid or expired coupon code.");
      setCouponCode("");
      return;
    }

    // Apply coupon to eligible items
    const updatedCartProducts = cartProducts.map((item) => {
      const isBogoProduct = promotionsContext.some((promo) =>
        promo.buy_products.some(
          (buyItem) => buyItem.product_id === item.product_id
        )
      );
      const isEligible = !item.discount && !isBogoProduct && !item.is_gift;
      return {
        ...item,
        ...(isEligible
          ? {
              is_coupon: true,
              value: couponToApply.value,
              coupon_type: couponToApply.coupon_type,
            }
          : {}),
      };
    });

    setCartProducts(updatedCartProducts); 
    setCouponError(null);
    setCouponData(couponToApply);
    console.log("Applied coupon:", couponToApply);
    console.log("Cart products after coupon:", updatedCartProducts);
    setCouponDataContext(couponToApply);
    setCouponSuccess(
      `Applied Coupon: ${couponToApply.code} - ${couponToApply.title}`
    );
  };

  if (isMenuLoading) {
    return (
      <div>
        <Pagination1 />
      </div>
    );
  }
  if (isMenuError) {
    return <div>{isMenuError}</div>;
  }

  const subTotalPrice = (elm) => {
    if (elm.is_gift) {
      return <td>0.00{currency.symbol} (Free Gift)</td>;
    }

    const currentUTC = new Date();
    const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000);
    const current_date_time = currentGST
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    let itemPrice = elm.price;

    if (
      elm?.discount &&
      new Date(current_date_time) >= new Date(elm.discount.start_date) &&
      new Date(current_date_time) <= new Date(elm.discount.end_date)
    ) {
      if (elm.discount.discount_type == "percent") {
        itemPrice = elm.price - (elm.price / 100) * elm.discount.value;
      } else if (elm.discount.discount_type == "amount") {
        itemPrice = elm.discount.final_price;
      }
      return (
        <td>
          <span className="money price price-sale">
            {currency.symbol}
            {(itemPrice * elm.quantity).toFixed(2)}
          </span>
          <span className="money price price-old">
            {currency.symbol}
            {(elm.price * elm.quantity).toFixed(2)}
          </span>
        </td>
      );
    }

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

    if (
      couponData &&
      
      couponData.type === "customer" &&
      elm.is_coupon // Check the flag we set
    )
     {
      console.log("couponData:", couponData);
      
      
      if (couponData.coupon_type == "percent") {
        itemPrice = elm.price - (elm.price / 100) * couponData.value;
      } else if (couponData.coupon_type == "amount") {
        itemPrice = elm.price - couponData.value;
      }
      return (
        <td>
          <span className="money price price-sale">
            {currency.symbol}
            {(itemPrice * elm.quantity).toFixed(2)}
          </span>
          <span className="money price price-old">
            {currency.symbol}
            {(elm.price * elm.quantity).toFixed(2)}
          </span>
        </td>
      );
    }

    return (
      <td>
        <span className="money price">
          {currency.symbol}
          {(elm.price * elm.quantity).toFixed(2)}
        </span>
      </td>
    );
  };

  const disablePlaceOrder =
    isLoading ||
    (!isLoggedIn && !isOTPVerified) ||
    (isLoggedIn && formData.shippingAdd && !isOTPVerified);

  const getColors = (status, idx) => {
    const golds = ["#BB8502", "#D44F35", "#726060"];
    const bgs = ["#FFF7E7", "#FFF3F0", "#F6F6F6"];
    if (status === "expired") {
      return { color: "#9A9A9A", bg: "#F6F6F6" };
    }
    return { color: golds[idx % golds.length], bg: bgs[idx % bgs.length] };
  };

  const isExpired = (end_date) => {
    return new Date(end_date) < new Date();
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

  return (
    <>
      {cartProducts.length ? (
        <>
          <FreeGiftFeature couponData={couponData} />
          <BogoFeature />
          <form onSubmit={onOrder}>
            {/* ... your entire JSX form remains unchanged here ... */}
            {/* I am omitting the large JSX part for brevity, but you should keep your existing return() statement's content from <div className="checkout-form"> onwards */}
            <div className="checkout-form">
              <div className="billing-info__wrapper text-uppercase">
                <h4>Billing Details</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input
                        type="text"
                        className="form-control"
                        id="checkout_first_name"
                        placeholder="First Name"
                        readOnly={isLoggedIn}
                        name="billingAddress.first_name"
                        value={formData.billingAddress.first_name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="checkout_first_name">First Name</label>
                      {fieldErrors.first_name && (
                        <div style={{ color: "red", fontSize: "0.85rem" }}>
                          {fieldErrors.first_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating my-3">
                      <input
                        type="text"
                        className="form-control"
                        id="checkout_last_name"
                        placeholder="Last Name"
                        readOnly={isLoggedIn}
                        name="billingAddress.last_name"
                        value={formData.billingAddress.last_name}
                        onChange={handleChange}
                      />
                      <label htmlFor="checkout_last_name">Last Name</label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="search-field my-3">
                      <div
                        className={`form-label-fixed hover-container ${
                          idDDActive ? "js-content_visible" : ""
                        }`}
                      >
                        <label htmlFor="country" className="form-label">
                          Country / Region*
                        </label>
                        <div className="js-hover__open">
                          <input
                            type="text"
                            className="form-control form-control-lg search-field__actor"
                            id="country"
                            name="billingAddress.country"
                            value="United Arab Emirates"
                            readOnly={isLoggedIn}
                            placeholder="United Arab Emirates"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-floating mt-3 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="checkout_street_address"
                        placeholder="Area / Mantaqa *"
                        readOnly={isLoggedIn}
                        name="billingAddress.area"
                        value={formData.billingAddress.area}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="checkout_company_name">
                        Area / Mantaqa *
                      </label>
                      {fieldErrors.area && (
                        <div style={{ color: "red", fontSize: "0.85rem" }}>
                          {fieldErrors.area}
                        </div>
                      )}
                    </div>
                    <div className="form-floating mt-3 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="checkout_street_address_2"
                        placeholder="Building / Villa / Apartment"
                        name="billingAddress.building"
                        readOnly={isLoggedIn}
                        value={formData.billingAddress.building}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="checkout_company_name">
                        Building / Villa / Apartment
                      </label>
                      {fieldErrors.building && (
                        <div style={{ color: "red", fontSize: "0.85rem" }}>
                          {fieldErrors.building}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="search-field my-3">
                      <div
                        className={`form-label-fixed hover-container ${
                          idDDActive ? "js-content_visible" : ""
                        }`}
                      >
                        <label
                          htmlFor="search-dropdown"
                          className="form-label"
                        >
                          Emirates*
                        </label>
                        <div className="js-hover__open">
                          <input
                            type="text"
                            className="form-control form-control-lg search-field__actor search-field__arrow-down"
                            id="search-dropdown"
                            name="billingAddress.emirates"
                            value={formData.billingAddress.emirates}
                            readOnly={isLoggedIn}
                            placeholder="Select Emirate..."
                            onClick={() => setIdDDActive((pre) => !pre)}
                            required
                          />
                        </div>
                        <div className="filters-container js-hidden-content mt-2">
                          <div className="search-field__input-wrapper">
                            <input
                              type="text"
                              className="search-field__input form-control form-control-sm bg-lighter border-lighter"
                              placeholder="Search"
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                              }}
                            />
                          </div>
                          <ul className="search-suggestion list-unstyled">
                            {countries
                              .filter((elm) =>
                                elm
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                              )
                              .map((elm, i) => (
                                <li
                                  id="billingAddress.emirates"
                                  onClick={(e) => {
                                    handleEmiratesChange(e, elm);
                                    setIdDDActive(false);
                                  }}
                                  key={i}
                                  className="search-suggestion__item js-search-select"
                                >
                                  {elm}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <Link
                      className="btn-link btn-link_lg text-center fw-bold text-danger p-2"
                      href={`/${locale}/account_edit_address`}
                      target="_blank"
                    >
                      - Click to Edit Address -
                    </Link>
                  )}
                  <div className="col-md-12">
                    <div className="form-floating my-3">
                      <input
                        type="email"
                        className="form-control"
                        id="billingAddress.email"
                        placeholder="Your Mail *"
                        name="billingAddress.email"
                        readOnly={isLoggedIn}
                        value={formData.billingAddress.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="checkout_email">Email Address *</label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-floating my-3">
                      <input
                        type="tel"
                        className="form-control"
                        id="checkout_billing_mobile"
                        placeholder="Eg. 0500000000 *"
                        name="billingAddress.mobile"
                        readOnly={isLoggedIn}
                        value={formData.billingAddress.mobile}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="checkout_phone">
                        Mobile Number (Eg. 0500000000)*
                      </label>
                    </div>
                  </div>

                  {!isLoggedIn && (
                    <div className="col-md-12">
                      {OTPError ? (
                        <div style={{ color: "red" }}>{OTPError}</div>
                      ) : (
                        <div style={{ color: "green" }}>{OTPSuccess}</div>
                      )}
                      {isOTPButton ? (
                        <button
                          className="btn btn-primary w-100 text-uppercase"
                          type="button"
                          disabled={isSendOTPLoading}
                          onClick={sendOTP}
                        >
                          {isSendOTPLoading ? "Loading..." : "Send OTP"}
                        </button>
                      ) : (
                        <>
                          {!isOTPVerified && (
                            <>
                              <div className="form-floating my-3">
                                <input
                                  type="number"
                                  className="form-control"
                                  id="billing_otp"
                                  placeholder="Eg. 1234 *"
                                  name="otp"
                                  value={formData.otp}
                                  onChange={handleChange}
                                />
                                <label htmlFor="billing_otp">
                                  OTP (Eg. 1234)*
                                </label>
                              </div>
                              <button
                                className="btn btn-primary w-100 text-uppercase"
                                type="button"
                                disabled={isSendOTPLoading}
                                onClick={verifyOTP}
                              >
                                {isSendOTPLoading
                                  ? "Loading..."
                                  : "Verify OTP"}
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
                        <input
                          className="form-check-input form-check-input_fill"
                          type="checkbox"
                          defaultValue=""
                          id="create_account"
                          onClick={(prev) => setCreateAccount(!createAccount)}
                          name="create_account"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="create_account"
                        >
                          CREATE AN ACCOUNT?
                        </label>
                      </div>
                    )}
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input form-check-input_fill"
                        type="checkbox"
                        defaultValue=""
                        id="ship_different_address"
                        onClick={handleCheckboxChange}
                        name="shipping"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="ship_different_address"
                      >
                        SHIP TO A DIFFERENT ADDRESS?
                      </label>
                    </div>
                  </div>
                  {formData.shippingAdd && (
                    <div
                      className="accordion mt-3"
                      id="shippingAddressAccordion"
                    >
                      <div className="accordion-item">
                        <h4
                          className="accordion-header"
                          id="headingShipping"
                        >
                          Shipping Details
                        </h4>
                        <div
                          id="collapseShipping"
                          className="accordion-collapse collapse show"
                          aria-labelledby="headingShipping"
                          data-bs-parent="#shippingAddressAccordion"
                        >
                          <div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="shipping_first_name"
                                    placeholder="First Name"
                                    name="shippingAddress.first_name"
                                    value={
                                      formData.shippingAddress.first_name
                                    }
                                    onChange={handleChange}
                                    required
                                  />
                                  <label htmlFor="shipping_first_name">
                                    First Name
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating my-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="shipping_last_name"
                                    placeholder="Last Name"
                                    name="shippingAddress.last_name"
                                    value={formData.shippingAddress.last_name}
                                    onChange={handleChange}
                                    required
                                  />
                                  <label htmlFor="shipping_last_name">
                                    Last Name
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-floating my-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="shipping_area"
                                    placeholder="Area / Mantaqa"
                                    name="shippingAddress.area"
                                    value={formData.shippingAddress.area}
                                    onChange={handleChange}
                                    required
                                  />
                                  <label htmlFor="shipping_area">
                                    Area / Mantaqa *
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-floating my-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="shipping_building"
                                    placeholder="Building / Villa / Apartment"
                                    name="shippingAddress.building"
                                    value={
                                      formData.shippingAddress.building
                                    }
                                    onChange={handleChange}
                                    required
                                  />
                                  <label htmlFor="shipping_building">
                                    Building / Villa / Apartment
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="search-field my-3">
                                  <label
                                    htmlFor="shipping_emirates"
                                    className="form-label"
                                  >
                                    Emirates*
                                  </label>
                                  <select
                                    id="shipping_emirates"
                                    className="form-control"
                                    name="shippingAddress.emirates"
                                    value={
                                      formData.shippingAddress.emirates
                                    }
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value="">
                                      Select Emirate...
                                    </option>
                                    {countries.map((em, i) => (
                                      <option key={i} value={em}>
                                        {em}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-floating my-3">
                                  <input
                                    type="email"
                                    className="form-control"
                                    id="shipping_email"
                                    placeholder="Your Mail"
                                    name="shippingAddress.email"
                                    value={formData.shippingAddress.email}
                                    onChange={handleChange}
                                    required
                                  />
                                  <label htmlFor="shipping_email">
                                    Email Address *
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-floating my-3">
                                  <input
                                    type="tel"
                                    className="form-control"
                                    id="shipping_mobile"
                                    placeholder="Eg. 0500000000"
                                    name="shippingAddress.mobile"
                                    value={formData.shippingAddress.mobile}
                                    onChange={handleChange}
                                    required
                                  />
                                  <label htmlFor="shipping_mobile">
                                    Mobile Number (Eg. 0500000000)*
                                  </label>
                                </div>
                              </div>
                              {isLoggedIn && (
                                <div className="col-md-12">
                                  {OTPError ? (
                                    <div style={{ color: "red" }}>
                                      {OTPError}
                                    </div>
                                  ) : (
                                    <div style={{ color: "green" }}>
                                      {OTPSuccess}
                                    </div>
                                  )}
                                  {isOTPButton ? (
                                    <button
                                      className="btn btn-primary w-100 text-uppercase"
                                      type="button"
                                      disabled={isSendOTPLoading}
                                      onClick={sendOTP}
                                    >
                                      {isSendOTPLoading
                                        ? "Loading..."
                                        : "Send OTP"}
                                    </button>
                                  ) : (
                                    <>
                                      {!isOTPVerified && (
                                        <>
                                          <div className="form-floating my-3">
                                            <input
                                              type="number"
                                              className="form-control"
                                              id="shipping_otp"
                                              placeholder="Eg. 1234"
                                              name="otp"
                                              value={formData.otp}
                                              onChange={handleChange}
                                            />
                                            <label htmlFor="shipping_otp">
                                              OTP (Eg. 1234)*
                                            </label>
                                          </div>
                                          <button
                                            className="btn btn-primary w-100 text-uppercase"
                                            type="button"
                                            disabled={isSendOTPLoading}
                                            onClick={verifyOTP}
                                          >
                                            {isSendOTPLoading
                                              ? "Loading..."
                                              : "Verify OTP"}
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
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password *"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="checkout_email">Password *</label>
                    </div>
                  </div>
                )}
              </div>

              <div className="checkout__totals-wrapper">
                <div className="sticky-content">
                  <div className="checkout__totals">
                    <h3>Your Order</h3>
                    <table className="checkout-cart-items">
                      <thead>
                        <tr>
                          <th>PRODUCT</th>
                          <th>SUBTOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartProducts.map((elm, i) => (
                          <tr key={i}>
                            <td>
                              {he.decode(elm.product_name)} x {elm.quantity}
                            </td>
                            {subTotalPrice(elm)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <table className="checkout-totals">
                      <tbody>
                        <tr>
                          <th>SUBTOTAL</th>
                          <td>
                            {totalPrice.toFixed(2)}
                            {currency.symbol}
                          </td>
                        </tr>
                        <tr>
                          <th>SHIPPING</th>
                          <td>
                            {freeShippingFlag
                              ? "You Got Free Shipping"
                              : `Shipping Cost: ${shippingServiceCharges[0].price}${currency.symbol}`}
                          </td>
                        </tr>
                        <tr>
                          <th>SERVICE FEE</th>
                          <td>
                            {shippingServiceCharges[1].price}
                            {currency.symbol}
                          </td>
                        </tr>
                        {selectedOption === "cod" && (
                          <tr>
                            <th>COD Charges</th>
                            <td>
                              {shippingServiceCharges[2].price}
                              {currency.symbol}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <th>TOTAL</th>
                          <td>
                            {!freeShippingFlag
                              ? (
                                  parseFloat(
                                    shippingServiceCharges[0].price
                                  ) +
                                  totalPrice +
                                  parseFloat(
                                    shippingServiceCharges[1].price
                                  ) +
                                  (selectedOption === "cod"
                                    ? parseFloat(
                                        shippingServiceCharges[2].price
                                      )
                                    : parseFloat(0.0))
                                ).toFixed(2)
                              : (
                                  0 +
                                  totalPrice +
                                  parseFloat(
                                    shippingServiceCharges[1].price
                                  ) +
                                  (selectedOption === "cod"
                                    ? parseFloat(
                                        shippingServiceCharges[2].price
                                      )
                                    : parseFloat(0.0))
                                ).toFixed(2)}
                            {currency.symbol} (includes{" "}
                            {!freeShippingFlag
                              ? (
                                  parseFloat(
                                    shippingServiceCharges[0].price
                                  ) -
                                  parseFloat(
                                    shippingServiceCharges[0].price
                                  ) /
                                    (1 +
                                      parseFloat(vatTax.percentage / 100)) +
                                  (parseFloat(totalPrice) -
                                    parseFloat(totalPrice) /
                                      (1 +
                                        parseFloat(
                                          vatTax.percentage / 100
                                        ))) +
                                  (parseFloat(
                                    shippingServiceCharges[1].price
                                  ) -
                                    parseFloat(
                                      shippingServiceCharges[1].price
                                    ) /
                                      (1 +
                                        parseFloat(
                                          vatTax.percentage / 100
                                        ))) +
                                  (selectedOption === "cod"
                                    ? parseFloat(
                                        shippingServiceCharges[2].price
                                      ) -
                                      parseFloat(
                                        shippingServiceCharges[2].price
                                      ) /
                                        (1 +
                                          parseFloat(
                                            vatTax.percentage / 100
                                          ))
                                    : parseFloat(0.0))
                                ).toFixed(2)
                              : (
                                  0 +
                                  (parseFloat(totalPrice) -
                                    parseFloat(totalPrice) /
                                      (1 +
                                        parseFloat(
                                          vatTax.percentage / 100
                                        ))) +
                                  (parseFloat(
                                    shippingServiceCharges[1].price
                                  ) -
                                    parseFloat(
                                      shippingServiceCharges[1].price
                                    ) /
                                      (1 +
                                        parseFloat(
                                          vatTax.percentage / 100
                                        ))) +
                                  (selectedOption === "cod"
                                    ? parseFloat(
                                        shippingServiceCharges[2].price
                                      ) -
                                      parseFloat(
                                        shippingServiceCharges[2].price
                                      ) /
                                        (1 +
                                          parseFloat(
                                            vatTax.percentage / 100
                                          ))
                                    : parseFloat(0.0))
                                ).toFixed(2)}
                            {currency.symbol} VAT)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <TamaraWidget amount={!freeShippingFlag
                    ? (
                        parseFloat(shippingServiceCharges[0].price) +
                        totalPrice +
                        parseFloat(shippingServiceCharges[1].price) +
                        (selectedOption === "cod"
                          ? parseFloat(
                              shippingServiceCharges[2].price
                            )
                          : parseFloat(0.0))
                      ).toFixed(2)
                    : (
                        0 +
                        totalPrice +
                        parseFloat(shippingServiceCharges[1].price) +
                        (selectedOption === "cod"
                          ? parseFloat(
                              shippingServiceCharges[2].price
                            )
                          : parseFloat(0.0))
                      ).toFixed(2)} inlineType='2' inlineVariant='outlined'/>
                  </div>

                  <div>
                    {couponError ? (
                      <div style={{ color: "red" }}>{couponError}</div>
                    ) : (
                      <div style={{ color: "green" }}>{couponSuccess}</div>
                    )}

                    <div style={{ position: "relative" }}>
                      <input
                        className="form-control mb-1"
                        type="text"
                        name="coupon_code"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={handleCouponChange}
                        style={{ paddingRight: "100px" }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "12px",
                          transform: "translateY(-50%)",
                          fontSize: 14,
                          color: "#a67b30",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => setShowCouponModal(true)}
                      >
                        View Coupons
                      </span>
                    </div>

                    {!couponData ? (
                      <input
                        className="coupon-action-btn"
                        type="button"
                        value="APPLY COUPON"
                        onClick={applyCoupon}
                      />
                    ) : (
                      <input
                        className="coupon-action-btn remove"
                        type="button"
                        value="REMOVE COUPON"
                        onClick={removeCoupon}
                      />
                    )}
                    <br />
                    <br />

                    {showCouponModal && (
                      <div
                        className="coupon-modal-overlay"
                        onClick={() => setShowCouponModal(false)}
                      >
                        <div
                          className="coupon-modal"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="coupon-header">
                            <h3>Available Offers</h3>
                            <button
                              className="close-btn"
                              onClick={() => setShowCouponModal(false)}
                            >
                              &times;
                            </button>
                          </div>
                          <div className="coupon-subheader border-bottom">
                            <h3>Coupon Offers</h3>
                          </div>

                          {couponLoading ? (
                            <div className="coupon-loading">Loading…</div>
                          ) : coupons.length === 0 ? (
                            <div className="coupon-empty">
                              You have no coupons yet.
                            </div>
                          ) : (
                            <div className="coupon-body">
                              {coupons.map((c, idx) => {
                                const expired = isExpired(c.end_date);
                                return (
                                  <div
                                    key={c.id || `coupon-${idx}`}
                                    className={`coupon-ticket ${
                                      expired ? "expired" : ""
                                    }`}
                                  >
                                    <div className="coupon-left">
                                      <div className="coupon-title">
                                        {c.title || "Special Offer"}
                                      </div>
                                      <div className="coupon-desc">
                                        <h5>
                                          {c.description ||
                                            (c.coupon_type === "percent"
                                              ? `${c.value}% OFF`
                                              : `AED${c.value} OFF`)}
                                        </h5>
                                      </div>
                                      <div className="coupon-validity">
                                        {expired
                                          ? `Expired: ${c.end_date?.slice(
                                              0,
                                              10
                                            )}`
                                          : `Valid until: ${c.end_date?.slice(
                                              0,
                                              10
                                            )}`}
                                      </div>
                                    </div>

                                    <div className="coupon-right">
                                      <div
                                        className={`coupon-code-box ${
                                          copiedId ===
                                          (c.id || `coupon-${idx}`)
                                            ? "copied"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          !expired &&
                                          handleCopy(
                                            c.code,
                                            c.id || `coupon-${idx}`
                                          )
                                        }
                                      >
                                        <span className="coupon-code">
                                          {c.code}
                                        </span>
                                      </div>

                                      {!expired && (
                                        <button
                                          className={`apply-btn ${
                                            copiedId ===
                                            (c.id || `coupon-${idx}`)
                                              ? "applied"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            handleSelectCoupon(
                                              c.code,
                                              c.id || `coupon-${idx}`
                                            )
                                          }
                                        >
                                          {copiedId ===
                                          (c.id || `coupon-${idx}`)
                                            ? "Applied!"
                                            : "Click to Apply"}
                                        </button>
                                      )}

                                      {expired && (
                                        <div className="coupon-expired-badge">
                                          Expired
                                        </div>
                                      )}
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
                    .coupon-modal-overlay {
                      position: fixed;
                      inset: 0;
                      background: rgba(0, 0, 0, 0.5);
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      z-index: 999;
                    }

                    .coupon-modal {
                      background: #fff;
                      border-radius: 12px;
                      width: 500px;
                      max-width: 90%;
                      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                      overflow: hidden;
                      font-family: "Inter", sans-serif;
                    }

                    .coupon-header {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 14px 18px;
                      border-bottom: 1px solid #f0f0f0;
                    }
                    .coupon-header h3 {
                      margin: 0;
                      font-size: 20px;
                      font-weight: 600;
                      color: #222;
                    }
                    .coupon-subheader {
                      padding: 10px 18px;
                      border-bottom: 1px solid #f0f0f0;
                    }
                    .coupon-subheader h3 {
                      margin: 0;
                      font-size: 16px;
                      font-weight: 600;
                      color: #a67b30;
                      background: #fffaf2ff;
                    }
                    .close-btn {
                      background: none;
                      border: none;
                      font-size: 20px;
                      color: #666;
                      cursor: pointer;
                    }

                    .coupon-body {
                      display: flex;
                      flex-direction: column;
                      gap: 12px;
                      padding: 16px;
                    }

                    .coupon-ticket {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      border: 1px solid #e5e5e5;
                      border-radius: 12px;
                      background: #fff;
                      padding: 14px 16px;
                      position: relative;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                      overflow: hidden;
                    }

                    .coupon-ticket::before,
                    .coupon-ticket::after {
                      content: "";
                      position: absolute;
                      top: 50%;
                      width: 20px;
                      height: 20px;
                      background: #f5f5f5;
                      border: 1.5px solid #dbdbdb;
                      border-radius: 50%;
                      transform: translateY(-50%);
                      z-index: 2;
                    }
                    .coupon-ticket::before {
                      left: -10px;
                    }
                    .coupon-ticket::after {
                      right: -10px;
                    }

                    .coupon-left {
                      display: flex;
                      flex-direction: column;
                      gap: 4px;
                    }
                    .coupon-title {
                      font-size: 14px;
                      font-weight: 600;
                      color: #222;
                    }
                    .coupon-desc {
                      font-size: 12px;
                      color: #555;
                    }

                    .coupon-right {
                      display: flex;
                      flex-direction: column;
                      align-items: flex-end;
                      gap: 6px;
                    }
                    .coupon-code {
                      background: #f0fdf4;
                      color: #198754;
                      font-size: 13px;
                      font-weight: 600;
                      padding: 4px 10px;
                      border-radius: 6px;
                    }

                    .apply-btn {
                      background: none;
                      border: none;
                      color: #a67b30;
                      font-size: 12px;
                      font-weight: 600;
                      cursor: pointer;
                      padding: 0;
                      text-transform: uppercase;
                    }
                    .apply-btn:hover {
                      text-decoration: underline;
                    }

                    .coupon-ticket.expired {
                      opacity: 0.6;
                    }

                    .coupon-loading,
                    .coupon-empty {
                      text-align: center;
                      padding: 30px;
                      color: #777;
                      font-size: 13px;
                    }

                    .coupon-action-btn {
                      width: 100%;
                      padding: 12px;
                      background-color: #222; /* Dark background for contrast */
                      color: #fff;
                      border: 1px solid #222;
                      border-radius: 4px;
                      font-size: 13px;
                      font-weight: 600;
                      letter-spacing: 0.5px;
                      text-transform: uppercase;
                      cursor: pointer;
                      transition: all 0.3s ease;
                      margin-top: 8px;
                    }

                    .coupon-action-btn:hover {
                      background-color: #000;
                      border-color: #000;
                    }

                    /* Specific style for the Remove button */
                    .coupon-action-btn.remove {
                      background-color: transparent;
                      color: #dc3545; /* Red color */
                      border: 1px solid #dc3545;
                    }

                    .coupon-action-btn.remove:hover {
                      background-color: #dc3545;
                      color: #fff;
                    }
                  `}</style>

                  <div className="checkout__payment-methods">
                    {!hasPreBookItem && <div className="form-check">
                      <input
                        className="form-check-input form-check-input_fill"
                        type="radio"
                        name="checkout_payment_method"
                        id="checkout_payment_method_3"
                        value={"cod"}
                        checked={selectedOption === "cod"}
                        onChange={handleRadioChange}
                      />
                      <label className="form-check-label" htmlFor="checkout_payment_method_3" >
                        Cash on delivery
                      </label>
                    </div>}
                    <div className="form-check">
                      <input className="form-check-input form-check-input_fill" type="radio" name="checkout_payment_method" id="checkout_payment_method_4" value={"paytabs"} checked={selectedOption === "paytabs"} onChange={handleRadioChange} />
                      <label className="form-check-label" htmlFor="checkout_payment_method_4" style={{ display: "flex", flexDirection: "column" }} >
                        PayTabs - Credit / Debit Card
                        <div style={{ display: "flex", gap: "6px" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20" viewBox="0 0 77 16" >
                            <g transform="translate(-523 -415)">
                              <rect style={{ fill: "#fff", opacity: 0 }} className="a" width="77" height="16" transform="translate(523 415)"/>
                              <path style={{ fill: "#2a2a6c" }} className="b" d="M70.75,432.369l-5.76,13.746H61.23L58.4,435.145a1.522,1.522,0,0,0-.847-1.21,15.018,15.018,0,0,0-3.509-1.167l.087-.4h6.049a1.657,1.657,0,0,1,1.64,1.4l1.5,7.955,3.7-9.357H70.75m14.727,9.256c.017-3.625-5.017-3.823-4.98-5.446.009-.494.479-1.019,1.507-1.151a6.719,6.719,0,0,1,3.507.612l.624-2.912a9.55,9.55,0,0,0-3.325-.609c-3.515,0-5.989,1.869-6.009,4.543-.023,1.978,1.765,3.082,3.113,3.741,1.385.674,1.847,1.1,1.842,1.708-.008.923-1.1,1.325-2.126,1.344a7.433,7.433,0,0,1-3.654-.869l-.644,3.014a10.87,10.87,0,0,0,3.956.731c3.735,0,6.178-1.849,6.19-4.707m9.28,4.49h3.29l-2.87-13.746H92.14a1.624,1.624,0,0,0-1.514,1.007l-5.332,12.739h3.732l.741-2.053H94.33Zm-3.967-4.87,1.872-5.161,1.077,5.161Zm-14.959-8.875L72.89,446.114H69.334l2.942-13.746Z" transform="translate(470.495 -16.119)" />
                              <g transform="translate(1.466 -18.353)">
                                <rect style={{ fill: "#ff5f00" }} className="c" width="6.84" height="11.172" transform="translate(581.019 435.873)" />
                                <path style={{ fill: "#eb001b" }} className="d" d="M16.226,14.558A7.093,7.093,0,0,1,18.94,8.973a7.1,7.1,0,1,0,0,11.172,7.093,7.093,0,0,1-2.714-5.587Z" transform="translate(565.497 426.902)" />
                                <path style={{ fill: "#f79e1b" }} className="e" d="M119.946,64.636v-.229h.1V64.36h-.235v.047h.093v.229Zm.456,0V64.36h-.071l-.083.2-.083-.2h-.071v.276h.051v-.209l.077.18h.053l.077-.18v. 209Z" transform="translate(475.307 381.226)" />
                                <path style={{ fill: "#f79e1b" }} className="e" d="M77.186,14.547a7.1,7.1,0,0,1-11.5,5.585,7.1,7.1,0,0,0,0-11.172,7.1,7.1,0,0,1,11.5,5.585Z" transform="translate(518.747 426.913)"/>
                              </g>
                            </g>
                          </svg> <hr></hr>
                          <Image src="/assets/images/paytabs-svg/UnionPay_logo.png" alt="Union Pay" width={50} height={20} />
                          <Image src="/assets/images/paytabs-svg/Apple_Pay_logo.png" alt="Apple Pay" width={50} height={20} />
                          <Image src="/assets/images/paytabs-svg/Samsung_Pay_Logo.png" alt="Samsung Pay" width={50} height={20} />
                        </div>
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input form-check-input_fill" type="radio" name="checkout_payment_method" id="checkout_payment_method_5" value={'tamara'} checked={selectedOption === 'tamara'} onChange={handleRadioChange} />
                      <label className="form-check-label" htmlFor="checkout_payment_method_5" style={{display: "inline-flex"}} >
                        Tamara - No interest, No fees. 
                        <TamaraWidget inlineType='4' inlineVariant='text'/>
                      </label>
                    </div>

                    <div className="form-check">
                    <input
                      className="form-check-input form-check-input_fill"
                      type="radio"
                      name="checkout_payment_method"
                      id="checkout_payment_method_6"
                      value={'tabby'}
                      checked={selectedOption === 'tabby'}
                      onChange={handleRadioChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="checkout_payment_method_6"
                    >
                      <Image
                        src="/assets/images/paymentGateway/Tabby.png"
                        width="60"
                        height="25"
                        alt="Cropped Faux leather Jacket"

                      />
                      <span style={{marginLeft: "0.5rem"}}>{t("CheckoutTitle")} <sup><strong>ⓘ</strong></sup></span><br/>{t("CheckoutDescription")}
                      {/* <button style={{ 'border-radius': '50px', 'border': 'none' }} type="button" data-tabby-info="installments" data-tabby-price={finalPriceState && finalPriceState} data-tabby-currency="AED">?</button> */}
                    </label>
                    {selectedOption == 'tabby' && <><div id="tabbyCard"></div></>}
                  </div> 

                    <div className="policy-wrapper mt-3">
                      {/* Privacy Notice Text */}
                      <p className="small text-muted mb-3" style={{ lineHeight: '1.5' }}>
                        {locale === 'ar'
                          ? "سيتم استخدام بياناتك الشخصية لمعالجة طلبك، ودعم تجربتك في هذا الموقع، ولأغراض أخرى موصوفة في "
                          : "Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our "
                        }
                        <Link 
                          href={`/${locale}/privacy`} 
                          className="text-dark text-decoration-underline fw-medium" 
                          target="_blank"
                        >
                          {locale === 'ar' ? "سياسة الخصوصية." : "privacy policy."}
                        </Link>
                      </p>

                      {/* Interactive Checkbox */}
                      <div className="form-check d-flex align-items-start p-0">
                        <input
                          className="form-check-input border-secondary"
                          type="checkbox"
                          id="terms-agreement"
                          required
                          style={{ 
                            marginTop: '0.25rem', 
                            width: '1.1em', 
                            height: '1.1em', 
                            cursor: 'pointer',
                            // Logic: Add margin to the correct side based on direction
                            marginLeft: locale === 'ar' ? '0.5rem' : '0',
                            marginRight: locale === 'ar' ? '0' : '0.5rem'
                          }}
                        />
                        <label 
                          htmlFor="terms-agreement" 
                          className="form-check-label small" 
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                          {locale === 'ar' ? "لقد قرأت ووافقت على " : "I have read and agree to the website "}
                          <Link 
                            href={`/${locale}/terms`} 
                            className="text-primary text-decoration-underline" 
                            target="_blank"
                          >
                            {locale === 'ar' ? "شروط وأحكام الموقع" : "terms and conditions"}
                          </Link>
                          <span className="text-danger fw-bold mx-1">*</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {error ? (
                    <div
                      style={{
                        backgroundColor: "#ffebe9", // Light red background
                        color: "#cf1e1e",           // Dark red text
                        padding: "14px 20px",
                        marginBottom: "1rem",
                        textAlign: "center",
                        fontSize: "15px",
                        fontWeight: "500",
                        borderRadius: "2px",        // Slight corner rounding
                      }}
                    >
                      {error}
                    </div>
                  ) : success ? (
                    <div
                      style={{
                        backgroundColor: "#e8f5e9", // Light green background
                        color: "#2e7d32",           // Dark green text
                        padding: "14px 20px",
                        marginBottom: "1rem",
                        textAlign: "center",
                        fontSize: "15px",
                        fontWeight: "500",
                        borderRadius: "2px",
                      }}
                    >
                      {success}
                    </div>
                  ) : null}
                  <button
                    className="btn btn-primary w-100 text-uppercase"
                    type="submit"
                    disabled={disablePlaceOrder}
                  >
                    {isLoading ? "Loading..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="fs-20">Your Shopping cart is empty</div>
          <button className="btn mt-3 mb-3 btn-light">
            <Link href={`/${locale}/shop`}>Shop Now</Link>
          </button>
        </>
      )}
    </>
  );
}