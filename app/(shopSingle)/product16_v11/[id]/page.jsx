import Footer1 from "@/components/footers/Footer1";

import Header14 from "@/components/headers/Header14";
import RelatedSlider from "@/components/singleProduct/RelatedSlider";
import SingleProduct11 from "@/components/singleProduct/SingleProduct11";
import React from "react";
import { allProducts } from "@/data/products";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: 'https://www.ahmed-perfume.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png',
  },
};
export default function ProductDetailsPage16({ params }) {
  const productId = params.id;
  const product =
    allProducts.filter((elm) => elm.id == productId)[0] || allProducts[0];
  return (
    <>
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
        <SingleProduct11 product={product} />
        <RelatedSlider />
      </main>
      <Footer1 />
    </>
  );
}
