import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";
import Categories from "@/components/shoplist/Categories";
// import Categories from "@/components/homes/home-3/Categories";
import Shop10 from "@/components/shoplist/shop10/Shop10";
import Banner5 from "@/components/shoplist/Banner5";
import React from "react";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import Loader from "@/components/loader/Loader";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: "https://www.ahmed-perfume.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png",
  },
};
export default function ShopPage8() {
  return (
    <>
    <Loader/>
      <Header14 />
      <Banner5 />
      <main className="page-wrapper pt-0">
        <Categories />
        <div className="mb-4 pb-lg-3"></div>
        <Shop10 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
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
