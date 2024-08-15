import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";
import About from "@/components/otherPages/about/About";
import Clients from "@/components/otherPages/about/Clients";
import Services from "@/components/otherPages/about/Services";
import React from "react";

export const metadata = {
  title: "About || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function AboutPage() {
  return (
    <>
      <Header14 />
      <main className="">
        {/* <div className="mb-4 pb-4"></div> */}
        <About />
        {/* <Services /> */}
        {/* <Clients /> */}
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer14 />
      
    </>
  );
}
