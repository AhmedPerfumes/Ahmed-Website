import React from "react";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import IslamicHero from "@/components/ramadan/IslamicHero";
import RamadanSpecialOffer from "@/components/ramadan/RamadanSpecialOffer";
import RamadanCountdown from "@/components/ramadan/RamadanCountdown";
import RamadanTabSlider from "@/components/ramadan/RamadanTabSlider";
import RamadanBentoGrid from "@/components/ramadan/RamadanBentoGrid";
import RamadanVideoSlider from "@/components/ramadan/RamadanVideoSlider";
// import RamadanEmailSignup from "@/components/ramadan/RamadanEmailSignup";
import RamadanSEOContent from "@/components/ramadan/RamadanSEOContent";
import RamadanVideo from "@/components/ramadan/RamadanVideo";


export async function generateMetadata({ params }) {
  const { locale } = params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? "هدايا العيد الفاخرة وأطقم العطور في الإمارات"
      : "Luxury Eid Gifts & Perfume Sets in UAE",
    description: isArabic
      ? "تسوّق هدايا العيد الفاخرة وأطقم العطور والبخور وصناديق الهدايا الأنيقة للعائلة والأصدقاء وهدايا الشركات في الإمارات."
      : "Shop luxury Eid gifts, perfume gift sets, bakhoor, and elegant hampers for family, friends, and corporate gifting across UAE.",
    icons: {
      icon: "/assets/images/ahmed-favicon.png",
    },
  };
}

const RamadanGifting = () => {
  return (
    <div className="page-wrapper pt-0 min-vh-100 d-flex flex-column">
      {/* Navigation Header */}
      <Header14 />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        {/* Deal Countdown */}
        {/* <RamadanCountdown /> */}

        {/* Trial Section 1: Islamic Hero */}
        <IslamicHero />
        <RamadanVideo/>

        {/* Ramadan Special Offers Section */}
        <RamadanSpecialOffer />

        {/* Trial Section 2: Ramadan Tab Slider */}
        {/* <RamadanTabSlider /> */}

        {/* Trial Section 3: Bento Grid Gallery */}
        <RamadanBentoGrid />

        {/* Trial Section 4: Video Slider */}
        <RamadanVideoSlider />

        {/* Trial Section 5: Email Signup */}
        {/* <RamadanEmailSignup /> */}

        {/* SEO Content Section */}
        <RamadanSEOContent />
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

export default RamadanGifting;