"use client";
import React, { useMemo } from "react";
import Link from "next/image";
import NextLink from "next/link";
import { useLocale } from "use-intl";
import { useMenu } from "../../context/MenuContext";
import DiscountGrid from "../common/features/DiscountGrid";

/**
 * Shared Banner Component
 * Handles the responsive display of campaign banners with optimized Next.js Images
 */
const Banner = ({ data, locale, isMobile }) => {
  if (!data) return null;

  const aspectRatio = isMobile ? "6 / 10.5" : "21 / 11";
  const displayClass = isMobile ? "d-block d-lg-none" : "d-none d-lg-block";
  const maxWidth = isMobile ? 980 : 1680;

  return (
    <div className={`container-fluid ${isMobile ? "pt-3" : "pt-4"} ${displayClass} px-3`}>
      <div className="d-flex justify-content-center">
        <NextLink 
          href={`/${locale}/${data.link || "shop"}`} 
          className="w-100 transition-opacity hover-opacity-90" 
          style={{ maxWidth }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio,
              width: "100%",
              borderRadius: isMobile ? 14 : 16,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${isMobile ? (data.mobile_image || data.image) : data.image}`}
              alt={data.title || "Campaign Banner"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading={isMobile ? "lazy" : "eager"} // Desktop banner is usually LCP
            />
          </div>
        </NextLink>
      </div>
    </div>
  );
};

function CityWalk() {
  const locale = useLocale();
  const { homeSliders } = useMenu();

  // Memoize search to prevent expensive array filtering on every render
  const banners = useMemo(() => {
    const checkSale = (s) => {
      const link = String(s.link || "").toLowerCase();
      return link === "sale" || link.includes("/sale");
    };

    const saleSlider = Array.isArray(homeSliders) ? homeSliders.find(checkSale) : null;

    return {
      desktop: saleSlider,
      mobile: saleSlider,
    };
  }, [homeSliders]);

  return (
    <main className="citywalk-campaign">
      {/* Dynamic Banners */}
      <Banner data={banners.desktop} locale={locale} isMobile={false} />
      <Banner data={banners.mobile} locale={locale} isMobile={true} />

      {/* Product Display Section */}
      <div className="mt-4">
        <DiscountGrid 
          title={banners.desktop?.title || "Limited Time Offers"} 
          onlyDiscounted={true} 
        />
      </div>
    </main>
  );
}

export default CityWalk;