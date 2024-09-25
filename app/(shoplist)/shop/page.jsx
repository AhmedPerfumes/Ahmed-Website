import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";
import Shop1 from "@/components/shoplist/Shop1";
import React from "react";
import MobileFooter2 from "@/components/footers/MobileFooter2";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: "https://www.ahmedalmaghribi.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png",
  },
};

async function getAllProducts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/allProducts?limit=6}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
const ShopPage = async() => {
  const data = await getAllProducts();
  console.log(data);
  return (
    <>
      <Header14 />
      <main>
        <Shop1 products={ data }/>
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

export default ShopPage;
