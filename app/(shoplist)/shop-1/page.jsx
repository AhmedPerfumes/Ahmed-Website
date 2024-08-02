import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";
import Shop1 from "@/components/shoplist/Shop1";
import React from "react";

export const metadata = {
  title: "Shop 1 || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function ShopPage1() {
  return (
    <>
      <Header14 />
      <main>
        <Shop1 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer14 />
    </>
  );
}
