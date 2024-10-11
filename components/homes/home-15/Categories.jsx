"use client";
import Link from "next/link";
import { categories8 } from "@/data/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export default function Categories({ section }) {
  const swiperOptions = {
    autoplay: {
      delay: 5000,
    },
    slidesPerView: 5,
    slidesPerGroup: 5,
    effect: "none",
    loop: true,
    pagination: false,
    navigation: false,
    grabCursor: true,
    breakpoints: {
      320: {
        slidesPerView: 3,
        slidesPerGroup: 2,
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 4,
        slidesPerGroup: 3,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 5,
        slidesPerGroup: 1,
        spaceBetween: 30,
        pagination: false,
      },
    },
  };
  return (
    <section className="category-carousel container">
      {section == "section3" ? (
        <></>
      ) : (
        <>
          <h2 className="section-title text-uppercase fs-25 fw-medium text-center mb-2">
            Most Preferred Categories
          </h2>
          <p className="fs-15 mb-4 pb-xl-2 mb-xl-4 text-secondary text-center">
            The World's Premium Brands In One Destination.
          </p>
        </>
      )}

      <div className="position-relative">
        <Swiper
          className="swiper-container js-swiper-slider"
          {...swiperOptions}
        >
          {categories8.map((elm, i) => (
            <SwiperSlide key={i} className="swiper-slide">
              <video
                loading="lazy"
                className="w-100 mb-3"
                width="330"
                height="400"
                style={{ height: "fit-content" }}
                muted
                loop
                onMouseOver={(event) => event.target.play()}
                onMouseOut={(event) => event.target.pause()}
                preload="none"
                poster={ elm.imgSrc2 }
              >
                <source type="video/mp4" src={elm.videoSrc} />
              </video>
              <div className="text-center">
                <Link href="/shop" className="menu-link h6 fw-medium">
                  {elm.altText}
                  <br />
                  <span className="fs-14 text-secondary fst-italic">
                    {elm.subText}
                  </span>
                </Link>
              </div>
            </SwiperSlide>
          ))}

          {/* <!-- /.swiper-wrapper --> */}
        </Swiper>
        {/* <!-- /.swiper-container js-swiper-slider --> */}
      </div>
      {/* <!-- /.position-relative --> */}
    </section>
  );
}
