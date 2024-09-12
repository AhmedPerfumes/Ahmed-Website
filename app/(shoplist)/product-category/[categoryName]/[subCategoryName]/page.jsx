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
    icon: "https://www.ahmedalmaghribi.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png",
  },
};

async function getCategorySubCategory(categoryName, subCategoryName) {
  const response = await fetch(`http://localhost/farmart/public/api/products?category=${categoryName.split("-").join(" ").toUpperCase()}&subCategory=${subCategoryName.split("-").join(" ").toUpperCase()}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
// export default function ShopPage8() {
const ShopPage8 = async ({ params }) => {
  const { categoryName, subCategoryName } = params;

  try {
    const data = await getCategorySubCategory(categoryName, subCategoryName);
    console.log(data);
    return (
      <>
      <Loader/>
        <Header14 />
        <Banner5 image={ data.image }/>
        <main className="page-wrapper pt-0">
          <Categories description={ data.description }/>
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
  } catch (error) {
    console.error(error);
    return <p>Failed to load user data.</p>;
  }
}

export default ShopPage8;
