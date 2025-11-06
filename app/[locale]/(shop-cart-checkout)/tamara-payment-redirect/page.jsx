import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import TamaraPaymentRedirect from "@/components/shopCartandCheckout/TamaraPaymentRedirect";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import React from "react";
import { headers } from 'next/headers';

export const metadata = {
  title: "Buy Best Perfumes Online | Ahmed Al Maghribi Perfumes",
  description: "Buy Best Perfumes Online Ahmed Al Maghribi Perfumes.",
  icons: {
      icon: "/assets/images/ahmed-favicon.png",
  },
};

const TamaraPayment = async () => {
      return (
        <>
          <Header14 />
          <main className="page-wrapper">
            <div className="mb-4 pb-4"></div>
            <section className="shop-checkout container">
              {/* <h2 className="page-title">{data.payment_status != 'failed' ? 'ORDER RECEIVED' : 'ORDER FAILED'}</h2> */}
              <TamaraPaymentRedirect/>
            </section>
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

export default TamaraPayment;