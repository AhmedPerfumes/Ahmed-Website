"use client";
import { useState, useRef, useEffect } from "react";
import { useContextElement } from "@/context/Context";

import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import Header14 from "@/components/headers/Header14";

import DesignCarousel from "@/components/gift-card/DesignCarousel";
import AmountSelector from "@/components/gift-card/AmountSelector";
import RecipientForm from "@/components/gift-card/RecipientForm";
import MessageBox from "@/components/gift-card/MessageBox";
import PreviewCard from "@/components/gift-card/PreviewCard";

export default function GiftCardPage() {
  const { addProductToCart } = useContextElement();

  const [form, setForm] = useState({
    amount: "",
    customAmount: "",
    isCustom: false,
    design: "design1",
    senderName: "",
    recipientName: "",
    recipientEmail: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const amount = form.customAmount || form.amount;
  const showDetails = amount && Number(amount) > 0;

  // ✅ ANIMATION CONTROL
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      if (showDetails) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [showDetails]);

  // ✅ INLINE VALIDATION
  const validateForm = () => {
    let newErrors = {};

    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "Please select or enter amount";
    }

    if (!form.senderName.trim()) {
      newErrors.senderName = "Please enter your name";
    }

    if (!form.recipientName.trim()) {
      newErrors.recipientName = "Please enter recipient name";
    }

    if (!form.recipientEmail.trim()) {
      newErrors.recipientEmail = "Please enter email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.recipientEmail)) {
        newErrors.recipientEmail = "Please enter valid email";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validateForm()) return;

    const product = {
      product_id: 9999,
      product_name: "eGift Card",
      price: Number(amount),
      product_qty: 999,
      maximum_order_quantity: 10,
      is_gift_card: true,
      meta: {
        amount,
        design: form.design,
        sender_name: form.senderName,
        recipient_name: form.recipientName,
        recipient_email: form.recipientEmail,
        message: form.message,
      },
      unique_key: `gift-${Date.now()}-${Math.random()}`,
    };

    addProductToCart(product);
  };

  return (
    <>
      <Header14 />

      <div style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <h2
            className="text-center mb-5"
            style={{ letterSpacing: "1.5px", fontWeight: "400" }}
          >
            BUY EGIFT CARDS
          </h2>

          {/* TOP SECTION */}
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 mb-4 text-center">
              <PreviewCard form={form} />
            </div>

            <div className="col-lg-6 col-md-12">
              <DesignCarousel form={form} updateField={updateField} />
              <AmountSelector form={form} updateField={updateField} />
            </div>
          </div>

          {/* 🔥 ANIMATED DETAILS */}
          <div
            className="mt-5 pt-4"
            style={{
              borderTop: "1px solid #eee",
              height: height,
              transition:
                "height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div
              ref={contentRef}
              style={{
                opacity: showDetails ? 1 : 0,
                transform: showDetails
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: "all 0.35s ease 0.1s",
                paddingTop: showDetails ? "10px" : "0px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }} className="section-title fw-normal mb-3 pb-2">
                2. Enter eGift card details
              </h2>

              <RecipientForm
                form={form}
                updateField={updateField}
                errors={errors}
                setErrors={setErrors}
              />

              <MessageBox
                form={form}
                updateField={updateField}
              />

              {/* 🔴 AMOUNT ERROR */}
              {errors.amount && (
                <div className="error-text mb-3">
                  {errors.amount}
                </div>
              )}

              <div className="text-end mt-4 btn btn-dark fw-semibold shadow-sm">
                <button
                  type="button"
                  disabled={!showDetails}
                  style={{
                    background: showDetails ? "#111" : "#ccc",
                    color: "#fff",
                    border: "none",
                    letterSpacing: "1px",
                    transition: "0.3s",
                    cursor: showDetails ? "pointer" : "not-allowed",
                  }}
                  onClick={handleAddToCart}
                >
                  ADD TO BAG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="d-none d-lg-block">
        <Footer14 />
      </section>

      <section className="d-sm-block d-md-none bg-dark pt-5">
        <MobileFooter2 />
      </section>
    </>
  );
}