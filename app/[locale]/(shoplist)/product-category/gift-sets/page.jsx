import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import MobileFooter2 from "@/components/footers/MobileFooter2";

// import Loader from "@/components/loader/Loader";
import Shop10 from "@/components/shoplist/shop10/Shop10";
import React from "react";

import Shop5 from "@/components/shoplist/Shop5";

import RelatedSlider from "@/components/singleProduct/RelatedSlider";

import QuickView from "@/components/modals/QuickView";
import Banner5 from "@/components/shoplist/Banner5";
import Categories from "@/components/shoplist/Categories";
import { headers } from 'next/headers';
import CollapsibleDescription from "@/components/shoplist/CollapsibleDescription";

export const metadata = {
  title: "Gift Sets | Buy Best Perfumes Online | Ahmed Al Maghribi Perfumes",
  description: "Buy Best Perfumes Online Ahmed Al Maghribi Perfumes.",
  icons: {
    icon: "/assets/images/ahmed-favicon.png",
  },
};

function getRequestOrigin() {
  const headersList = headers();
  const host = headersList.get('host') || process.env.NEXT_PUBLIC_DEFAULT_ORIGIN; // e.g., 'localhost:3000' or 'yourdomain.com'
  const protocol = headersList.get('x-forwarded-proto') || 'https'; // or 'https'
  
  // if (!host) {
  //   // Fallback for local development or edge cases
  //   return process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || 'http://localhost:3000';
  // }

  return `${protocol}://${host}`;
}

async function getCategorySubCategory(categoryName) {
  const origin = getRequestOrigin();
  // console.log('Origin:----------------------------------------------------------------------------------------------------------------------------------------------------------', origin);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/products`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'origin': origin,
    },
    body: JSON.stringify({
      category: categoryName.split("-").join(" ").toUpperCase(),
    }),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// export default function ShopPage5() {
  const ShopPage5 = async () => {
    const category = 'gift-sets';
    // console.log(category);
    try {
      const data = await getCategorySubCategory(category);
      // console.log(data);
      return data && (
      <>
        <QuickView />
        <Header14 />
         <Banner5 image={ data.image } mobile_image={data.mobile_image}/>
         <Categories description={ data.description } subCategories={ data.productSubCategories }/>

        <main>
          {/* <Shop5 /> */}
          

          <Shop10 products={ data.products }/>
          <CollapsibleDescription description={data.description}  />
        </main>

        <section className=" d-none d-lg-block" style={{ height: "100%" }}>
          <Footer14 />
        </section>
        <section className=" d-sm-block d-md-none bg-dark pt-5  ">
        <div className="MobileFooter">
          <MobileFooter2/>
        </div>
      </section>
        {/* <Footer1 /> */}
      </>
    );
  } catch (error) {
    // console.error(error);
    return <><Header14 />
            <main className="page-wrapper">
              <h2 className="h4 text-center text-uppercase mb-4 pb-xl-2 mb-xl-4">No Category Found</h2>
              <RelatedSlider relatedProds={ null }/>
            </main>
            <section className="d-none d-lg-block" style={{ height: "100%" }}>
              <Footer14 />
            </section>
            <section className="d-sm-block d-md-none bg-dark pt-5  ">
              <div className="MobileFooter">
                <MobileFooter2/>
              </div>
            </section></>;
  }
}

export default ShopPage5;
