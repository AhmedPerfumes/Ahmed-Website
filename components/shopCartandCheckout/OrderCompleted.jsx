"use client";

import React from "react";
import { useContextElement } from "@/context/Context";
import OrderThankYouSection from "./OrderThankYouSection";

export default function OrderCompleted() {
  const { orderDetails } = useContextElement();

  return (
    <OrderThankYouSection
      orderDetails={orderDetails}
      initialOrderCode={orderDetails?.order_id}
    />
  );
}
