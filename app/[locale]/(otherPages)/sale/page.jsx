import React from "react";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import CityWalk from "@/components/campagin/Citywalk";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const isArabic = locale === "ar";
  const baseUrl = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || "https://ae.ahmedalmaghribi.com";

  const canonicalUrl = `${baseUrl}/${locale}/sale`;

  return {
    metadataBase: new URL(baseUrl),

    title: isArabic
      ? "عروض اليوم الوطني الإماراتي على العطور | أحمد المغربي"
      : "UAE National Day Offers & Perfume Sale | Ahmed Al Maghribi",

    description: isArabic
      ? "اكتشف عروض اليوم الوطني الإماراتي على العطور الفاخرة من أحمد المغربي. تسوق أفضل العروض والخصومات الحصرية على تشكيلة متنوعة من العطور."
      : "Explore exclusive UAE National Day offers on luxury perfumes at Ahmed Al Maghribi. Discover special perfume deals and limited-time discounts. Shop Now!",

    icons: {
      icon: '/assets/images/ahmed-favicon.png',
    },

    alternates: {
      canonical: canonicalUrl,

      languages: {
        en: `${baseUrl}/en/sale`,
        ar: `${baseUrl}/ar/sale`,
        "x-default": `${baseUrl}/en/sale`,
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
