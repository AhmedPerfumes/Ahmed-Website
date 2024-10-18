import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import Export from "@/components/otherPages/Contact/Export"

import Header14 from "@/components/headers/Header14";
import Contact from "@/components/otherPages/Contact/Contact";
import LocationMap from "@/components/otherPages/Contact/LocationMap";

import React from "react";
import Loader from "@/components/loader/Loader";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: 'https://www.ahmedalmaghribi.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png',
  },
};

async function getExportProducts(category_id) {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}api/products`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category_id,
    })
  });
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/exportProducts`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category_id,
    }),
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

const ExportPage = async() => {
  const category = 19;
  console.log(category);
  try {
    const data = await getExportProducts(category);
    console.log(data);
      return data && (
      <>
      <Loader/>
        <Header14 />
        
        
        <Export products={data} />
        
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
    return <><Header14 />
            <main className="page-wrapper">
              <h2 className="h4 text-center text-uppercase mb-4 pb-xl-2 mb-xl-4">No Products Found</h2>
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

export default ExportPage;
