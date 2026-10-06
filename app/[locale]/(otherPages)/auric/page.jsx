import React from "react";
import Script from "next/script";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import VideoSection from "@/components/Auric/VideoSection";
import NoteSection from "@/components/Auric/NoteSection";
import FamilySection from "@/components/Auric/FamilySection";
import HeroSection from "@/components/Auric/HeroSection";
import JourneySection from "@/components/Auric/JourneySection";
import HeroSection2 from "@/components/otherPages/oud-roses-auric/HeroSection";
import "@/components/Auric/auric.scss";

// Central config for Auric Landing Page with subtle premium maroon theme
const AURIC_CONFIG = {
  edition: "imperial",
  title: "Oud & Roses Auric",
  subtitle: "The Evolution of an Icon",
  description:
    "An embodiment of majestic opulence and royal craftsmanship — Auric unites the depth of precious oud with velvet amber and intoxicating florals.",
  videoTopText: "The Evolution of an Icon",
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

export async function generateMetadata({ params }) {
  const { locale } = params || {};
  const isArabic = locale === "ar";

  const title = isArabic
    ? "عود آند روزيز أوريك | تطور أيقونة العطور | عطور أحمد المغربي"
    : "Oud & Roses Auric | The Evolution of an Icon | Ahmed Al Maghribi Perfumes";

  const description = isArabic
    ? "اكتشف عطر عود آند روزيز أوريك من عطور أحمد المغربي. تجسيد للفخامة المهيبة وحرفية العطور الاستثنائية التي تجمع بين العود النادر والورد والعنبر."
    : "Experience Oud & Roses Auric by Ahmed Al Maghribi Perfumes. An embodiment of majestic opulence and royal craftsmanship, uniting rare oud, Turkish rose, and amber.";

  const canonicalUrl = `https://ae.ahmedalmaghribi.com/${locale || "en"}/auric`;

  return {
    title,
    description,
    keywords: [
      "Oud & Roses Auric",
      "Ahmed Al Maghribi",
      "Ahmed Al Maghribi Perfumes",
      "Oud and Roses",
      "Extrait de Parfum",
      "Luxury Arabic Perfume",
      "Oud Perfume UAE",
      "Turkish Rose Perfume",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://ae.ahmedalmaghribi.com/en/auric",
        ar: "https://ae.ahmedalmaghribi.com/ar/auric",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: isArabic ? "عطور أحمد المغربي" : "Ahmed Al Maghribi Perfumes",
      images: [
        {
          url: "/assets/auric-bottle.png",
          width: 800,
          height: 1000,
          alt: "Oud & Roses Auric Luxury Flacon",
        },
      ],
      type: "website",
      locale: isArabic ? "ar_AE" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/auric-bottle.png"],
    },
    icons: {
      icon: "/assets/images/ahmed-favicon.png",
    },
  };
}

export default function AuricPage({ params }) {
  const { locale } = params || {};
  const currentLocale = locale || "en";
  const data = AURIC_CONFIG;
  const shopUrl = `/${currentLocale}/shop/perfumes/occidental-fragrance/oud-roses-auric`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://ae.ahmedalmaghribi.com/${currentLocale}/auric#product`,
        name: "Oud & Roses Auric",
        image: "https://ae.ahmedalmaghribi.com/assets/auric-bottle.png",
        description:
          "An embodiment of majestic opulence and royal craftsmanship — Auric unites the depth of precious oud with Turkish rose, immortelle, velvet amber, and warm woods.",
        brand: {
          "@type": "Brand",
          name: "Ahmed Al Maghribi Perfumes",
        },
        category: "Extrait de Parfum",
        offers: {
          "@type": "Offer",
          url: `https://ae.ahmedalmaghribi.com${shopUrl}`,
          priceCurrency: "AED",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Ahmed Al Maghribi Perfumes",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `https://ae.ahmedalmaghribi.com/${currentLocale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Fragrances",
            item: `https://ae.ahmedalmaghribi.com/${currentLocale}/shop`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Oud & Roses Auric",
            item: `https://ae.ahmedalmaghribi.com/${currentLocale}/auric`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="auric-schema-ldjson"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header14 />

      <main className="auric-landing-page">
        <HeroSection2 />
        <VideoSection data={data} />
        <HeroSection data={data} shopUrl={shopUrl} />
        <JourneySection data={data} />
        <NoteSection data={data} />
        <FamilySection data={data} shopUrl={shopUrl} />
      </main>

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
