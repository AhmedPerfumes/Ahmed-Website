import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import OrderTrack from "@/components/shopCartandCheckout/OrderTrack";
import MobileFooter2 from "@/components/footers/MobileFooter2";

import React from "react";

export const metadata = {
  title: "Order Tracking | Track Perfume Order | Ahmed Al Maghribi",
  description: "Track Your Order Easily at Ahmed Al Maghribi UAE Stay Updated on Perfume Delivery Status Fast Secure Tracking System for Hassle Free Shopping Experience",
  icons: {
      icon: "/assets/images/ahmed-favicon.png",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function () {
  return (
    <>
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <OrderTrack />
      </main>
      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
        
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5  ">
      <div className="MobileFooter">
      

      <MobileFooter2/>
      </div>
      </section>
    </>
  );
}
