import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import Hero from "@/components/homes/home-8/Hero";
import Animation from "@/components/Animation";

import React from "react";
import MobileFooter2 from "@/components/footers/MobileFooter2";

export const metadata = {
  title: "Home 8 || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function HomePage8() {
  return (
    <>
      <Header14 />
      <main>
        {/* <Hero /> */}
        {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}
        <Animation />
      </main>
      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
        
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5  ">
      <div className="MobileFooter">
      

      <MobileFooter2/>
      </div>
    </section>
      {/* <Footer14 /> */}
    </>
  );
}
