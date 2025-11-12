"use client";
import Link from "next/link";
import {
  categories8,
  categories88,
  categoriesTop,
  categoriesInfluencers,
  fatherDay,
} from "@/data/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Autoplay, Navigation } from "swiper/modules";
import { useEffect } from "react";

export default function Categories({ section }) {
  const t = useTranslations();
  const locale = useLocale();

  const swiperOptions = {
    autoplay: { delay: 5000 },
    modules: [Autoplay, Navigation],
    slidesPerView: 4,
    slidesPerGroup: 4,
    loop: false,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 14 },
      768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
      992: { slidesPerView: 5, slidesPerGroup: 1, spaceBetween: 30 },
    },
  };

  // Prevent next/prev clicks from triggering links
  useEffect(() => {
    const buttons = document.querySelectorAll(".swiper-button-next, .swiper-button-prev");
    const stopClick = (e) => e.stopPropagation();
    buttons.forEach((btn) => btn.addEventListener("click", stopClick));
    return () => buttons.forEach((btn) => btn.removeEventListener("click", stopClick));
  }, []);

  const renderSlides = (categories) =>
    categories.map((elm, i) => (
      <SwiperSlide key={i}>
        {section !== "sectionTop" ? (
          <Link
            href={`/${locale}${elm.link}`}
            className="d-block mb-3 position-relative"
            style={{ width: "100%", maxWidth: 330, aspectRatio: "330 / 500" }}
          >
            <Image
              src={elm.imgSrc2}
              alt={t(elm.altText)}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, 330px"
              quality={75}
            />
            {elm.videoSrc && (
              <video
                muted
                loop
                preload="none"
                onMouseOver={(e) => e.currentTarget.play()}
                onMouseOut={(e) => e.currentTarget.pause()}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              >
                <source type="video/mp4" src={elm.videoSrc} />
              </video>
            )}
          </Link>
        ) : (
          <Link
            href={`/${locale}${elm.link}`}
            className="d-block mb-3 position-relative"
            style={{ width: "100%", maxWidth: 330, aspectRatio: "330 / 400" }}
          >
            <Image
              src={elm.imgSrc2}
              alt={t(elm.altText)}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, 330px"
              quality={75}
            />
          </Link>
        )}

        <div className="text-center">
          <Link href={`/${locale}${elm.link}`} className="menu-link h6 fw-medium">
            {t(elm.altText)}
          </Link>
        </div>
        <div className="d-flex justify-content-center">
          <Link
            href={`/${locale}${elm.btn}`}
            className="btn-videos btn-link_lg text-uppercase fw-medium"
          >
            {t("Shop Now")}
          </Link>
        </div>
      </SwiperSlide>
    ));

  const renderSection = () => {
    let title = "";
    let subtitle = "";
    let data = [];

    switch (section) {
      case "section3":
        data = categories8;
        break;
      case "section4":
        title = "Iconic Indulgence";
        subtitle = "See luxury in motion through the eyes of those who know it best";
        data = categories88;
        break;
      case "sectionTop":
        title = "Cherished by All";
        subtitle = "Long-lasting fragrance in every drop";
        data = categoriesTop;
        break;
      case "fathersDay":
        title = "Timeless Fragrance,";
        subtitle = "Eternal Bakhoor";
        data = fatherDay;
        break;
      default:
        title = "Luxury Delight";
        subtitle = "Modern elegance meets Middle Eastern tradition";
        data = categoriesInfluencers;
        break;
    }

    return (
      <>
        {title && (
          <h2 className="section-head section-title text-uppercase fs-25 fw-medium text-center mb-2">
            {t(title)}
          </h2>
        )}
        {subtitle && (
          <p className="fs-15 mb-4 pb-xl-2 mb-xl-4 text-secondary text-center section-paragraph">
            {t(subtitle)}
          </p>
        )}

        <div className="swiper-container position-relative">
          <Swiper {...swiperOptions}>{renderSlides(data)}</Swiper>

          {/* Arrows placed at the same visual position */}
          <div className="swiper-button-prev custom-swiper-btn"></div>
          <div className="swiper-button-next custom-swiper-btn"></div>
        </div>
      </>
    );
  };

  return (
    <section className="category-carousel container position-relative">
      <div className="slider-shadow-left"></div>
      {renderSection()}
      <div className="slider-shadow-right"></div>

      <style jsx global>{`
        .swiper-container {
          position: relative;
        }

        .swiper-button-next,
        .swiper-button-prev {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          z-index: 15 !important;
          pointer-events: auto !important;
          display: flex;
          align-items: center;
          justify-content: center;
        } 

        /* Prevent arrow clicks from triggering links */
        .swiper-button-next *,
        .swiper-button-prev * {
          pointer-events: none !important;
        }

        .swiper-slide a {
          pointer-events: auto;
        }

        @media (max-width: 768px) {
          .swiper-button-prev {
            left: -10px;
          }
          .swiper-button-next {
            right: -10px;
          }
        }
      `}</style>
    </section>
  );
}
