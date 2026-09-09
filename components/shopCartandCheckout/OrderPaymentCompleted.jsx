"use client";

import React from "react";
import OrderThankYouSection from "./OrderThankYouSection";

export default function OrderPaymentCompleted({ orderDetails, initialOrderCode }) {
  return (
    <OrderThankYouSection
      orderDetails={orderDetails}
      initialOrderCode={initialOrderCode}
    />
  );
}
