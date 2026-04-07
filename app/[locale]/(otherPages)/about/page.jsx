import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import Script from 'next/script' 
import Header14 from "@/components/headers/Header14";
// import Loader from "@/components/loader/Loader";
import About from "@/components/otherPages/about/About";
import Clients from "@/components/otherPages/about/Clients";
import Services from "@/components/otherPages/about/Services";
import React from "react";

export const metadata = {
  title: "Buy Best Perfumes Online | Ahmed Al Maghribi Perfumes",
  description: "Buy Best Perfumes Online Ahmed Al Maghribi Perfumes.",
  icons: {
      icon: "/assets/images/ahmed-favicon.png",
  },
};

export default function AboutPage() {
  const jsonLd = {                              // ← ADD THIS
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ahmed Al Maghribi Perfumes",
    "founder": "Kafeel Ahmed Gudekar",
    "foundingDate": "2000",
    "description": "Global UAE-based luxury fragrance house with 190+ stores.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "2026 Fragrance Catalog",
      "url": "https://ae.ahmedalmaghribi.com/llms-full.txt"
    }
  }
  return (
    <>
    <Script                                   // ← ADD THIS
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    {/* <Loader/> */}
      <Header14 />
      <main className="">
        {/* <div className="mb-4 pb-4"></div> */}
        <About />
        {/* <Services /> */}
        {/* <Clients /> */}
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
