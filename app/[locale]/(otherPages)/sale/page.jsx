import React from "react";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import CityWalk from "@/components/campagin/Citywalk";

export async function generateMetadata({ params }) {
  const { locale } = params;

  const baseUrl = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || "https://ae.ahmedalmaghribi.com";

  const canonicalUrl = `${baseUrl}/${locale}/sale`;

  return {
    metadataBase: new URL(baseUrl),

    title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",

    description: "Buy Best Perfumes Online Ahmed Perfume",

    icons: {
      icon: '/assets/images/ahmed-favicon.png',
    },

    alternates: {
      canonical: canonicalUrl,

      languages: {
        en: "/en/sale",
        ar: "/ar/sale",
        "x-default": "/en/sale",
      },
    },
  };
}

const Citywalk = () => {
  return (
    <div className="page-wrapper pt-0 min-vh-100 d-flex flex-column">
      {/* Navigation Header */}
      <Header14 />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        <CityWalk />
      </main>

      {/* Responsive Footer Strategy */}
      <footer>
        {/* Desktop Footer */}
        <section className="d-none d-lg-block border-top">
          <Footer14 />
        </section>

        {/* Mobile Footer */}
        <section className="d-block d-lg-none bg-dark pt-5 pb-4">
          <div className="container">
            <div className="MobileFooter">
              <MobileFooter2 />
            </div>
          </div>
        </section>
      </footer>
    </div>
  );
}

export default Citywalk;
