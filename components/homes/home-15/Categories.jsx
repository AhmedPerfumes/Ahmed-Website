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
import Pagination1 from "@/components/common/Pagination1";

export default function Categories({ section }) {
    const t = useTranslations();
    const locale = useLocale();
    const swiperOptions = {
        autoplay: { delay: 5000 },
        modules: [Autoplay, Navigation],
        slidesPerView: 4,
        slidesPerGroup: 4,
        effect: "none",
        loop: false,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        grabCursor: true,
        breakpoints: {
            320: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 14 },
            768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
            992: { slidesPerView: 5, slidesPerGroup: 1, spaceBetween: 30 },
        },
    };

    const renderSlides = (categories) =>
        categories.map((elm, i) => (
            <SwiperSlide key={i} className="swiper-slide">
                {
                    section != "sectionTop" ? 
                    <Link href={`/${locale}${elm.link}`}
                      className="d-block mb-3 position-relative"
                      style={{ width: '100%', maxWidth: 330, aspectRatio: '330 / 500' }}>
                    {/* Responsive poster image */}
                    <Image
                        src={elm.imgSrc2}
                        alt={t(elm.altText)}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, 330px"
                        quality={75}
                    />
                    {/* Video overlay */}
                     
                        <video
                        muted
                        loop
                        preload="none"
                        onMouseOver={(e) => e.currentTarget.play()}
                        onMouseOut={(e) => e.currentTarget.pause()}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    >
                        <source type="video/mp4" src={elm.videoSrc} />
                    </video>
                    
                </Link> : 
                <Link href={`/${locale}${elm.link}`}
                      className="d-block mb-3 position-relative"
                      style={{ width: '100%', maxWidth: 330, aspectRatio: '330 / 400' }}>
                    {/* Responsive poster image */}
                    <Image
                        src={elm.imgSrc2}
                        alt={t(elm.altText)}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, 330px"
                        quality={75}
                    />
                </Link>
                }
                
                <div className="text-center">
                    <Link href={`${locale}${elm.link}`} className="menu-link h6 fw-medium">
                        {t(elm.altText)}
                    </Link>
                </div>
                <div className="d-flex justify-content-center">
                    <Link href={`/${locale}${elm.btn}`} className="btn-videos btn-link_lg text-uppercase fw-medium">
                        {t("Shop Now")}
                    </Link>
                </div>
            </SwiperSlide>
        ));

    let categoryRend;

    if (section === "section3") {
        categoryRend = (
            <Swiper className="swiper-container" {...swiperOptions}>
                {renderSlides(categories8)}
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
            </Swiper>
        );
    } else if (section === "section4") {
        categoryRend = (
            <>
                <h2 className="section-head section-title text-uppercase fs-25 fw-medium text-center mb-2">
                    {t("Iconic Indulgence")}
                </h2>
                <p className="fs-15 mb-4 pb-xl-2 mb-xl-4 text-secondary text-center section-paragraph">
                    {t("See luxury in motion through the eyes of those who know it best")}
                </p>
                <Swiper className="swiper-container" {...swiperOptions}>
                    {renderSlides(categories88)}
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </Swiper>
            </>
        );
    } else if (section === "sectionTop") {
        categoryRend = (
            <>
                <h2 className="section-head section-title text-uppercase fs-25 fw-medium text-center mb-2">
                    {t("Cherished by All")}
                </h2>
                <p className="fs-15 mb-4 pb-xl-2 mb-xl-4 text-secondary text-center section-paragraph">
                    {t("Long-lasting fragrance in every drop")}
                </p>
                <Swiper className="swiper-container" {...swiperOptions}>
                    {renderSlides(categoriesTop)}
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </Swiper>
            </>
        );
    } else if (section === "fathersDay") {
        categoryRend = (
            <>
                <h2 className="section-title text-uppercase fs-2 fw-medium text-center mb-2">
                    {t("Indulge in the Rich")}
                </h2>
                <p className="fs-3 mb-4 pb-xl-2 mb-xl-4 text-secondary text-center section-paragraph">
                    {t("Aroma of Bakhoor")}
                </p>
                <Swiper className="swiper-container" {...swiperOptions}>
                    {renderSlides(fatherDay)}
                    <div className="swiper-pagination"></div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </Swiper>
            </>
        );
    } else {
        categoryRend = (
            <>
                <h2 className="section-title text-uppercase fs-25 fw-medium text-center mb-2">
                    {t("Luxury Delight")}
                </h2>
                <p className="fs-15 mb-4 pb-xl-2 mb-xl-4 text-secondary text-center">
                    {t("Modern elegance meets Middle Eastern tradition")}
                </p>
                <Swiper className="swiper-container" {...swiperOptions}>
                    {renderSlides(categoriesInfluencers)}
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </Swiper>
            </>
        );
    }

    return (
        <section className="category-carousel container position-relative">
            <div className="slider-shadow-left"></div>
            {categoryRend}
            <div className="slider-shadow-right"></div>
        </section>
    );
}
