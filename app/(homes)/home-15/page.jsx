import Brands from "@/components/common/brands/Brands";
import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";

import Blogs from "@/components/homes/home-15/Blogs";
import Categories from "@/components/homes/home-15/Categories";
import Featured from "@/components/homes/home-15/Featured";
import Hero from "@/components/homes/home-15/Hero";
import Instagram from "@/components/homes/home-15/Instagram";
import Lookbook from "@/components/homes/home-15/Lookbook";
import PopulerProducts from "@/components/homes/home-15/PopulerProducts";
import React from "react";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: 'https://www.ahmed-perfume.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png',
  },
};
export default function HomePage15() {
  return (
    <>
      <div className="theme-15">
        <Header14 />
        <main>
          <Hero />
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <Featured />
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <Categories />
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <PopulerProducts />
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <Lookbook />
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <Blogs />
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <Brands />
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <Instagram />
        </main>
        <Footer14 />
      </div>
    </>
  );
}
