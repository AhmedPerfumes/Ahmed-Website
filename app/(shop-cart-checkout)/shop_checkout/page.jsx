import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import Checkout from "@/components/shopCartandCheckout/Checkout";
import ChectoutSteps from "@/components/shopCartandCheckout/ChectoutSteps";
import React from "react";

export default function () {
  return (
    <>
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="shop-checkout container">
          <h2 className="page-title">Shipping and Checkout</h2>
          <ChectoutSteps />
          <Checkout />
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer14 />
    </>
  );
}
