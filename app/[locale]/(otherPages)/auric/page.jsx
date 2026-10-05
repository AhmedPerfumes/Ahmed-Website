"use client";

import React, { useState } from "react";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import VideoSection from "@/components/Auric/VideoSection";
import NoteSection from "@/components/Auric/NoteSection";
import FamilySection from "@/components/Auric/FamilySection";
import HeroSection from "@/components/Auric/HeroSection";
import JourneySection from "@/components/Auric/JourneySection";
import "@/components/Auric/auric.css";
import { useRouter } from "next/navigation";

// Central config for Auric Landing Page with subtle premium maroon theme
const AURIC_CONFIG = {
  edition: "imperial",
  title: "Oud & Roses Auric",
  subtitle: "Evolution of an Icon",
  description:
    "An embodiment of majestic opulence and royal craftsmanship — Auric unites the depth of precious oud with velvet amber and intoxicating florals.",
  videoTopText: "Evolution of an Icon",
  videoTitle: "Oud & Roses Auric",
  videoDescription:
    "A founder’s signature. A house’s evolution. A gift to the people who made the journey possible.",
  storyTitle: "A Story That Changed the House",
  storyText:
    "Some fragrances become successful. Others change the direction of a house forever. Oud & Roses became a signature fragrance whose story reached far beyond its origins. Auric honours that legacy and the people who carried the story forward.",
  founderCredit: "Inspired by the vision of our founder, Mr. Kafeel Ahmed",
  bottleImg: "/assets/auric-bottle.png",
  comparisonBeforeImg: "/assets/images/oud-roses.png",
  comparisonAfterImg: "/assets/auric-bottle.png",
  comparisonBeforeLabel: "Oud & Roses",
  comparisonAfterLabel: "Auric",
  videoSrc: "/assets/videos/auric/auric-video.mp4",
  notesImages: {
    top: "/assets/images/auric/top.jpeg",
    mid: "/assets/images/auric/heart.jpeg",
    base: "/assets/images/auric/base.jpeg",
  },
  notesDescription: {
    top: "Bright orange opens the fragrance, warmed by cardamom, pepper and saffron, with an unexpected touch of leather",
    mid: "Immortelle Absolute from the Balkans, heliotrope and orris meet the distinctive Ahmed Al Maghribi Rose Accord.",
    base: "Vanilla, patchouli, musk and incense settle into a deep, lingering base, enriched by the Ahmed Al Maghribi Oud Accord",
  },
  notesHeading: "Fragrance Notes",
  notesSubtitle:
    "A refined journey from radiant spice and rose to warm oud, crafted with depth, character and enduring elegance.",
  heroQuote:
    "Some fragrances become successful. Others change the direction of a house forever. Oud & Roses became a signature fragrance whose story reached far beyond its origins. Auric honours that legacy and the people who carried the story forward.",
  // Subtle and premium maroon theme palette
  accentColor: "#c2596c",
  maroonDark: "#800020",
  textColor: "#ffffff",
  quoteColor: "#e6d5d8",
  buttonColor: "#800020",
  buttonTextColor: "#ffffff",
  dividerGradient: "linear-gradient(to right, #800020, transparent)",
  familyImages: {
    left: "/assets/images/kseries/bottle/past_left.png",
    center: "/assets/auric-bottle.png",
    right: "/assets/images/kseries/bottle/future_right.png",
  },
  familyTag: "REIMAGINED",
  familyHeading: "A Bouquet That Unfolds",
  familyDescription:
    "One composition offers the depth and complexity of fragrance layering, without combining multiple scents.",
  journeyVideoSrc: "/assets/videos/auric/test.mp4",
  journeyTag: "SIGNATURE COLLECTION",
  journeyHeading: "The Story Continues",
  journeyDescription:
    "Discover Auric’s story from the signature that came before it to its new expression.",
};

export default function AuricPage() {
  const router = useRouter();
  const data = AURIC_CONFIG;

  const handleBookNow = () => {
    router.push(`/en/shop`);
  };

  return (
    <>
      <Header14 />

      <div className="auric-landing-page">
        <VideoSection data={data} />
        <HeroSection data={data} onBookNow={handleBookNow} />
        <JourneySection data={data} />
        <NoteSection data={data} />
        <FamilySection data={data} onBookNow={handleBookNow} />
      </div>

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
