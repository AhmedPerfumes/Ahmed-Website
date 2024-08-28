import Footer14 from "@/components/footers/Footer14";
import Footer5 from "@/components/footers/Footer5";
import Header14 from "@/components/headers/Header14";

import Header5 from "@/components/headers/Header5";
import BestSeller from "@/components/homes/home-5/BestSeller";
import Blogs from "@/components/homes/home-5/Blogs";
import Categories from "@/components/homes/home-5/Categories";
import Cta from "@/components/homes/home-5/Cta";
import Features from "@/components/homes/home-5/Features";
import Hero from "@/components/homes/home-5/Hero";
import LookBook from "@/components/homes/home-5/LookBook";
import TopCollections from "@/components/homes/home-5/TopCollections";
import Wedding from "@/components/homes/home-5/Wedding";
import WeekDeals from "@/components/homes/home-5/WeekDeals";
import React from "react";

export const metadata = {
  title: "Home 5 || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function HomePage5() {
  return (
    <>
      <Header14 />
      <main className="">
        <Hero />
        {/* <div className="mb-4 mb-xl-5 pt-1 pb-5"></div> */}
        <Wedding/>
        {/* <Categories />
        <div className="mb-4 mb-xl-5 pt-1 pb-5"></div>
        <TopCollections />
        <div className="pt-1 pb-5 mb-4 mb-xl-5"></div>
        <LookBook />
        <div className="pt-1 pb-5 mt-4 mt-xl-5"></div>
        <BestSeller />
        <WeekDeals />
        <div className="pt-1 pb-5 mt-4 mt-xl-5"></div>
        <Blogs />
        <div className="pt-1 pb-5 mt-4 mt-xl-5"></div>
        <Features />
        <Cta /> */}
      </main>
      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
        
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5  ">
      <div className="MobileFooter">
      

      <MobileFooter2/>
      </div>
    </section>
      {/* <Footer5 parentclassName={"footer footer_type_2 dark"} /> */}
    </>
  );
}
