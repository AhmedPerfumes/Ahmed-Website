import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import BeautyworldLanding from "@/components/otherPages/beautyworld/BeautyworldLanding";

const baseUrl = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || "https://ae.ahmedalmaghribi.com";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const canonicalUrl = `${baseUrl}/${locale}/beautyworld-dubai-2026`;

  return {
    metadataBase: new URL(baseUrl),
    title: "Beautyworld Dubai 2026 | Ahmed Al Maghribi Perfumes",
    description:
      "Meet Ahmed Al Maghribi Perfumes at Beautyworld Dubai 2026 — 6–8 October at the Dubai World Trade Centre. Discover new fragrance launches and book a trade meeting.",
    icons: {
      icon: "/assets/images/ahmed-favicon.png",
    },
    openGraph: {
      title: "Beautyworld Dubai 2026 | Ahmed Al Maghribi Perfumes",
      description:
        "Join us at Beautyworld Dubai 2026 for exclusive fragrance launches, new creations, and trade meetings. 6–8 October · Dubai World Trade Centre.",
      url: canonicalUrl,
      siteName: "Ahmed Al Maghribi Perfumes",
      images: [
        {
          url: `${baseUrl}/assets/images/beautyworld-hero.jpg`,
          width: 1200,
          height: 630,
          alt: "Beautyworld Dubai 2026 – Ahmed Al Maghribi Perfumes",
        },
      ],
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/beautyworld-dubai-2026`,
        ar: `${baseUrl}/ar/beautyworld-dubai-2026`,
        "x-default": `${baseUrl}/en/beautyworld-dubai-2026`,
      },
    },
  };
}

export default function BeautyworldPage() {
  return (
    <>
      <Header14 />
      <main>
        <BeautyworldLanding />
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
