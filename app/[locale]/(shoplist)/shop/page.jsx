import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import Shop1 from "@/components/shoplist/Shop1";
import React from "react";
import MobileFooter2 from "@/components/footers/MobileFooter2";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const isArabic = locale === "ar";

  const baseUrl = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || "https://ae.ahmedalmaghribi.com";
  const canonicalUrl = `${baseUrl}/${locale}/shop`;

  return {
    metadataBase: new URL(baseUrl),
    title: isArabic
      ? "اكتشف وتسوق أرقى العطور العربية والبخور وزيوت العود الفاخرة أونلاين في الإمارات"
      : "Shop Arabian Perfumes, Bakhoor & Oud Oils Online UAE",
    description: isArabic
      ? "استكشف واشترِ أرقى العطور العربية الفاخرة والبخور وزيوت العود أونلاين، مع روائح أصلية يتم توصيلها في الإمارات."
      : "Browse and buy luxury Arabian perfumes, bakhoor, and oud oils online. Authentic scents delivered in UAE.",
    icons: {
      icon: "/assets/images/ahmed-favicon.png",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/shop`,
        ar: `${baseUrl}/ar/shop`,
        "x-default": `${baseUrl}/en/shop`,
      },
    },
  };
}


const ShopPage = async({ searchParams }) => {
  const search = searchParams.q;
  // console.log('000', search);
  return (
    <>
      <Header14 />
      <main>
        <Shop1 search={search}/>
      </main>
      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5">
        <div className="MobileFooter">
          <MobileFooter2/>
        </div>
      </section>
    </>
  );
}

export default ShopPage;
