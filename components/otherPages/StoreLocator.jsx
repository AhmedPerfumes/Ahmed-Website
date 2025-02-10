"use client";
import React, { useState } from "react";
// import StoreMap from "./StoreMap";
// import { storesLocations } from "@/data/storeLocations";
import Script from "next/script";

export default function StoreLocator() {
  return (
    <>
      <Script
        src="https://cdnsl.brandwizard.io/dist/widget.min.js"
        strategy="afterInteractive"
      />
      <div data-rd-locator="a8666474-4080-4998-961a-d5b95746d811"></div>
    </>
  );
}
