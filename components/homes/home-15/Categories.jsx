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
import { useRef, useState, useCallback } from "react";

export default function Categories({ section }) {
  const t = useTranslations();
  const locale = useLocale();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Track nav state — null = hidden (not needed), true/false = enabled/disabled
  const [navState, setNavState] = useState({ showPrev: false, showNext: false, hidden: false });

  const updateNavState = useCallback((swiper) => {
    // If all slides fit without scrolling, hide nav entirely
    const isNavigable = swiper.slides.length > swiper.params.slidesPerView;
    if (!isNavigable) {
      setNavState({ showPrev: false, showNext: false, hidden: true });
      return;
    }
    setNavState({
      hidden: false,
      showPrev: !swiper.isBeginning,
      showNext: !swiper.isEnd,
    });
  }, []);

  const swiperOptions = {
    autoplay: { delay: 5000, disableOnInteraction: false },
    modules: [Autoplay, Navigation],
    slidesPerView: 4,
    slidesPerGroup: 1,
    loop: false,
    grabCursor: true,
    navigation: {
      prevEl: prevRef.current,
      nextEl: nextRef.current,
    },
    onBeforeInit: (swiper) => {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
    },
    onSwiper: updateNavState,
    onSlideChange: updateNavState,
    onResize: updateNavState,
    breakpoints: {
      320: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 14 },
      768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
      992: { slidesPerView: 5, slidesPerGroup: 1, spaceBetween: 30 },
    },
  };

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

        <div className="cat-slider-wrap">
          <Swiper {...swiperOptions}>{renderSlides(data)}</Swiper>

          {/* Bottom-right nav — only render when slider is navigable */}
          {!navState.hidden && (
            <div className="cat-nav-group">
              <button
                ref={prevRef}
                className={`cat-nav-btn cat-nav-prev${!navState.showPrev ? " cat-nav-btn--faded" : ""}`}
                aria-label="Previous"
                disabled={!navState.showPrev}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M8.5 2L4 6.5L8.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                ref={nextRef}
                className={`cat-nav-btn cat-nav-next${!navState.showNext ? " cat-nav-btn--faded" : ""}`}
                aria-label="Next"
                disabled={!navState.showNext}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M4.5 2L9 6.5L4.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .cat-slider-wrap {
            position: relative;
          }

          .cat-nav-group {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 18px;
          }

          .cat-nav-btn {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1.5px solid rgba(29, 27, 25, 0.5);
            background: transparent;
            color: #1D1B19;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.25s ease;
            padding: 0;
            flex-shrink: 0;
          }

          .cat-nav-btn:hover:not(:disabled) {
            background: #1D1B19;
            color: #fff;
            border-color: #1D1B19;
          }

          .cat-nav-btn--faded {
            opacity: 0.2;
            cursor: not-allowed;
          }

          [dir='rtl'] .cat-nav-group {
            justify-content: flex-start;
          }
        `}</style>
      </>
    );
  };

  return (
    <section className="category-carousel container position-relative">
      <div className="slider-shadow-left"></div>
      {renderSection()}
      <div className="slider-shadow-right"></div>
    </section>
  );
}
