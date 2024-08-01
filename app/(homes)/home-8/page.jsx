import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import Hero from "@/components/homes/home-8/Hero";
// import Test from "@/components/Test";
// import Test2 from "@/components/Test2";
// import Test4 from "@/components/Test4";
import Test5 from "@/components/Test5";
// import Test6 from "@/components/Test6";

import React from "react";

export const metadata = {
  title: "Home 8 || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function HomePage8() {
  return (
    <>
      <Header14 />
      <main>
        <Hero />
        <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
        {/* <Test /> */}
        {/* <Test2 /> */}
        {/* <Test4 /> */}
        <Test5 />
        {/* <Test6 /> */}
      </main>
      <Footer14 />
    </>
  );
}
