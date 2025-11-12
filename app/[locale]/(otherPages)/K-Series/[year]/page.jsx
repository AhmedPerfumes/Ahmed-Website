// app/kseries/[year]/page.js
"use client";

import React from "react";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import VideoSection from "@/components/k-series/VideoSection";
import NoteSection from "@/components/k-series/NoteSection";
import FamilySection from "@/components/k-series/FamilySection";
import HeroSection from "@/components/k-series/HeroSection";

// central config: ONLY 3 choices
const K_CONFIG = {
  "2000": {
    key: "past",
    year: "2000",
    title: "K-Series 2000",
    subtitle: "The Roots",
    themeLabel: "Past",
    bottleImg: "/assets/images/kseries/past-center.png",
    videoSrc: "/assets/images/kseries/past.mp4",
    notesImages: {
      top: "/assets/images/kseries/past_top.jpg",
      mid: "/assets/images/kseries/past_mid.jpg",
      base: "/assets/images/kseries/past_base.jpg",
    },
    heroQuote:
      `"This perfume is a tribute to the memories that shaped us. Each note captures the essence of timeless elegance and the beauty of the moments we cherish most."`,
  },
  "2025": {
    key: "present",
    year: "2025",
    title: "K-Series 2025",
    subtitle: "The Alchemy Lab",
    themeLabel: "Present",
    bottleImg: "/assets/images/kseries/present-center.png",
    videoSrc: "/assets/images/kseries/present.mp4",
    notesImages: {
      top: "/assets/images/kseries/present_top.jpg",
      mid: "/assets/images/kseries/present_mid.jpg",
      base: "/assets/images/kseries/present_base.jpg",
    },
    heroQuote:
      `"Today is where precision meets artistry. Modern craftsmanship distilled into a signature that feels unmistakably now."`,
  },
  "2050": {
    key: "future",
    year: "2050",
    title: "K-Series 2050",
    subtitle: "The Beyond",
    themeLabel: "Future",
    bottleImg: "/assets/images/kseries/future-center.png",
    videoSrc: "/assets/images/kseries/future.mp4",
    notesImages: {
      top: "/assets/images/kseries/future_top.jpg",
      mid: "/assets/images/kseries/future_mid.jpg",
      base: "/assets/images/kseries/future_base.jpg",
    },
    heroQuote:
      `"A visionary composition—radiant, weightless, and forward-looking. It hints at what tomorrow will remember about us."`,
  },
};

function resolveConfig(year) {
  if (year in K_CONFIG) return K_CONFIG[year];
  // fallback: 2000
  return K_CONFIG["2000"];
}

export default function Page({ params }) {
  const rawYear = params?.year?.toString() || "2000";
  const data = resolveConfig(rawYear);

  return (
    <>
      {/* <Header14 /> */}

      {/* Optional: visual divider */}
      {/* <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, #b8860b 0%, #d4af37 25%, #f7e9a0 50%, #d4af37 75%, #b8860b 100%)", borderRadius: "2px"}} /> */}

      <VideoSection data={data} />
      <HeroSection data={data} />
      <NoteSection data={data} />
      <FamilySection data={data} />

      <section className="d-none d-lg-block" style={{ height: "100%" }}>
        <Footer14 />
      </section>
      <section className="d-sm-block d-md-none bg-dark pt-5">
        <div className="MobileFooter">
          <MobileFooter2 />
        </div>
      </section>
    </>
  );
}
