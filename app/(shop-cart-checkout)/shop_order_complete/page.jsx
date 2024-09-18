import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";

import ChectoutSteps from "@/components/shopCartandCheckout/ChectoutSteps";
import OrderCompleted from "@/components/shopCartandCheckout/OrderCompleted";
import React from "react";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: "https://www.ahmedalmaghribi.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png",
  },
};

export default function () {
  return (
    <>
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="shop-checkout container">
          <h2 className="page-title">ORDER RECEIVED</h2>
          <ChectoutSteps />
          <OrderCompleted />
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer14 />
    </>
  );
}
