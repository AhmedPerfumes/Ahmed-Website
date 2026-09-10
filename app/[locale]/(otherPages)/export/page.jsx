
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import Export from "@/components/otherPages/Contact/Export"

import Header14 from "@/components/headers/Header14";
import Contact from "@/components/otherPages/Contact/Contact";
import LocationMap from "@/components/otherPages/Contact/LocationMap";

import React from "react";
// import Loader from "@/components/loader/Loader";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const isArabic = locale === "ar";

  const baseUrl = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || "https://ae.ahmedalmaghribi.com";
  const canonicalUrl = `${baseUrl}/${locale}/export`;

  return {
    metadataBase: new URL(baseUrl),
    title: isArabic
      ? "كن شريكنا: التصدير العالمي وتوزيع العطور"
      : "Become Our Partner: Global Exports & Perfume Distribution",
    description: isArabic
      ? "انضم كشريك لـ «أحمد المغربي للعطور» في مجالات التصدير العالمي وتوزيع العطور. نقوم بتوريد العطور العربية الفاخرة إلى أكثر من 100 دولة حول العالم. تواصل معنا اليوم!"
      : "Partner with Ahmed Al Maghribi Perfumes for global exports & perfume distribution. Supplying luxury Arabian perfumes to 100+ countries. Contact us today!",
    icons: {
      icon: "/assets/images/ahmed-favicon.png",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/export`,
        ar: `${baseUrl}/ar/export`,
        "x-default": `${baseUrl}/en/export`,
      },
    },
  };
}

const ExportPage = () => {
  return (
    <>
      {/* <Loader/> */}
      <Header14 />
      <Export />
      {/* <AMGExport/> */}
      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5  ">
        <div className="MobileFooter">
          <MobileFooter2 />
        </div>
      </section>
    </>
  );
}

export default ExportPage;
