"use client";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import { slides1 } from "@/data/heroslides";
import Image from "next/image";
import { socialLinks } from "@/data/socials";

import { useLocale } from "next-intl";
export default function Hero() {

  const locale = useLocale();
  const swiperOptions = {
    autoplay: {
      delay: 5000,
    },
    slidesPerView: 1,
    modules: [Pagination, EffectFade],
    effect: "fade",
    loop: true,
    pagination: {
      el: ".slideshow-pagination",
      type: "bullets",
      clickable: true,
    },
  };
  return (
    <Swiper
      style={{ maxWidth: "100%", overflow: "hidden" }}
      className="swiper-container js-swiper-slider slideshow full-width_padding swiper-container-fade swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events"
      {...swiperOptions}
    >
      {" "}
      {slides1.map((elm, i) => (
        <SwiperSlide
          key={i}
          className="swiper-slide full-width_border border-1"

        >
          <div className="overflow-hidden position-relative h-100">
            <div
              className="slideshow-bg"
            
            >
              <Image
                loading="lazy"
                src={elm.image}
                width="1761"
                height="778"
                alt="Pattern"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
            {/* <!-- <p className="slideshow_markup font-special text-uppercase position-absolute end-0 bottom-0">Summer</p> --> */}
            <div className="slideshow-character position-absolute bottom-0 pos_right-center">
              
              <div className="character_markup text-primary">
                {/* <p className="text-black text-uppercase font-sofia fw-bold animate animate_fade animate_rtl animate_delay-10">
                  {elm.characterText}
                </p> */}
              </div>
            </div>
            <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
              <h6 className="text_dash text-uppercase text-gray fs-base fw-medium animate animate_fade animate_btt animate_delay-3">
                {elm.text1}
              </h6>
              <h2 className="text-uppercase h1 fw-normal mb-0 animate animate_fade animate_btt animate_delay-5">
                {elm.text2}
              </h2>
              {elm.text3 ? (
                <h2 className="text-uppercase h1 fw-bold animate animate_fade animate_btt animate_delay-5">
                  {elm.text3}
                </h2>
              ) : (
                ""
              )}
              {elm.text4 ? (
                <h6 className="text-uppercase mb-5 animate animate_fade animate_btt animate_delay-3">
                  {elm.text4}
                </h6>
              ) : (
                ""
              )}
              <Link
                href={`/${locale}/shop/perfumes/oriental-fragrance/niswah`}
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
              >
              "Discover More"
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div className="container">
        {/* <div className="slideshow-pagination d-flex align-items-center position-absolute bottom-0 mb-5"></div> */}
        {/* <!-- /.products-pagination --> */}
      </div>
      {/* <!-- /.container --> */}
     
      {/* <!-- /.slideshow-social-follow --> */}
      <a
        href="#section-collections-grid_masonry"
        className="slideshow-scroll d-none d-xxl-block position-absolute end-0 bottom-0 text_dash text-uppercase fw-medium"
      >
        Scroll
      </a>
    </Swiper>
  );
}
