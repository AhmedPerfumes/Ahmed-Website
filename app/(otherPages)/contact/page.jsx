import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";

import Header14 from "@/components/headers/Header14";
import Contact from "@/components/otherPages/Contact/Contact";
import LocationMap from "@/components/otherPages/Contact/LocationMap";

import React from "react";

export const metadata = {
  title: "Contact || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function ContactPage() {
  return (
    <>
      <Header14 />
        <Contact />
      <main className="page-wrapper">
    

        <section className="google-map mb-5">
          <h2 className="d-none">Contact US</h2>
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer14 />
      <section className="testsect d-sm-block d-md-none bg-dark pt-5  ">
      <div className="MobileFooter">
      

      <MobileFooter2/>
      </div>
    </section>
    </>
  );
}
