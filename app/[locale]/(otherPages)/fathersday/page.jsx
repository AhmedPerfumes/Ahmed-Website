import React from "react";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import FathersDayHero from "@/components/fathersday/FathersDayHero";
import FathersDayVideo from "@/components/fathersday/FathersDayVideo";
import FathersDaySpecialOffer from "@/components/fathersday/FathersDaySpecialOffer";
import FathersDayBentoGrid from "@/components/fathersday/FathersDayBentoGrid";
import FathersDayProductSlider from "@/components/fathersday/ProductSlider";
import FathersDayVideoSlider from "@/components/fathersday/FathersDayVideoSlider";
import FathersDaySEOContent from "@/components/fathersday/FathersDaySEOContent";


export async function generateMetadata({ params }) {
  const { locale } = params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? "هدايا يوم الأب الفاخرة وأطقم العطور في الإمارات"
      : "Luxury Father's Day Gifts & Perfume Sets in UAE",
    description: isArabic
      ? "تسوّق هدايا يوم الأب الفاخرة وأطقم العطور والبخور وصناديق الهدايا الأنيقة في الإمارات."
      : "Shop luxury Father's Day gifts, perfume gift sets, bakhoor, and elegant hampers for gifting across UAE.",
    icons: {
      icon: "/assets/images/ahmed-favicon.png",
    },
  };
}

const FathersDayGifting = () => {
  return (
    <div className="page-wrapper pt-0 min-vh-100 d-flex flex-column">
      {/* Navigation Header */}
      <Header14 />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        {/* Father's Day Hero with Video Background */}
        <FathersDayHero />

        {/* Father's Day Video Section */}
        <FathersDayVideo />

        {/* Father's Day Special Offers Section */}
        <FathersDaySpecialOffer />

        {/* Bento Grid Gallery */}
        <FathersDayBentoGrid />

        {/* Father's Day Product Slider */}
        <FathersDayProductSlider />

        {/* Father's Day Video/Collection Slider */}
        <FathersDayVideoSlider />

        {/* SEO Content Section */}
        <FathersDaySEOContent />
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
            <MobileFooter2 />
          </div>
        </section>
      </footer>
    </div>
  );
}

export default FathersDayGifting;