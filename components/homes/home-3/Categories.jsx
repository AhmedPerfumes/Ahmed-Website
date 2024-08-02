"use client";
import { categories2 } from "@/data/categories";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import React, { useEffect } from "react";

export default function Categories() {
  const handleMouseOver = (e) => {
    const tooltip = document.getElementById("video-tooltip");
    const tooltipVideo = document.getElementById("tooltip-video");
    const videoSrc = e.target.getAttribute("data-video-src");

    if (tooltip && tooltipVideo) {
      tooltipVideo.querySelector("source").src = videoSrc;
      tooltipVideo.load();
      tooltip.classList.add("show");
      tooltip.style.display = "block";
    }
  };

  const handleMouseOut = (e) => {
    const tooltip = document.getElementById("video-tooltip");

    if (tooltip) {
      tooltip.classList.remove("show");
      tooltip.style.display = "none";
    }
  };

  document.addEventListener("mousemove", (e) => {
    const tooltip = document.getElementById("video-tooltip");
    if (tooltip && tooltip.classList.contains("show")) {
      tooltip.style.left = `${e.pageX}px`;
    }
  });

  // -----------

  const swiperOptions = {
    autoplay: {
      delay: 5000,
    },
    slidesPerView: 4,
    slidesPerGroup: 1,
    effect: "none",
    loop: true,
    modules: [Autoplay, Navigation],
    navigation: {
      nextEl: ".products-carousel__next-1",
      prevEl: ".products-carousel__prev-1",
    },
    breakpoints: {
      320: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        // spaceBetween: 15,
        pagination: false,
      },
      768: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        // spaceBetween: 30,
        pagination: false,
      },
      992: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        // spaceBetween: 45,
        pagination: false,
      },
      1200: {
        slidesPerView: 5,
        slidesPerGroup: 0,
        // spaceBetween: 60,
        pagination: false,
      },
    },
  };
  return (
    <section className="category-carousel container">
      <div className="position-relative">
        {/* <Swiper
          {...swiperOptions}
          className="swiper-container js-swiper-slider"
        >
          {categories2.map((elm, i) => (
            <SwiperSlide key={i} className="swiper-slide text-center">
              <a
                key={i}
                href="/shop-8?category=eau-de-parfum&subcategory=oriental-fragrance"
                className="shop-categories__item mb-3"
              >
                <video
                  loading="lazy"
                  // src={elm.imgSrc}
                  width="200"
                  height="120"
                  alt=""
                  className="shop-categories__item-img rounded-circle text-center"
                  autoPlay
                  loop
                  muted
                >
                  <source src={elm.videoSrc} type="video/mp4" width={200} />
                </video>
              </a>
              <div className="text-center">
                <a
                  href="/shop-8?category=eau-de-parfum&subcategory=oriental-fragrance"
                  className="menu-link fw-medium"
                  key={i}
                >
                  {elm.category.split(" ")[0]}
                  <br />
                  {elm.category.split(" ")[1]}
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper> */}

        <Swiper
          {...swiperOptions}
          className="swiper-container js-swiper-slider"
        >
          {categories2.map((elm, i) => (
            <SwiperSlide key={i} className="swiper-slide text-center">
              <a
                key={i}
                href="/shop-8?category=eau-de-parfum&subcategory=oriental-fragrance"
                className="shop-categories__item mb-3"
              >
                <video
                  loading="lazy"
                  width="200"
                  height="120"
                  className="shop-categories__item-img rounded-circle text-center"
                  autoPlay
                  loop
                  muted
                  data-video-src={elm.videoSrc}
                  onMouseOver={(e) => handleMouseOver(e)}
                  onMouseOut={(e) => handleMouseOut(e)}
                >
                  <source src={elm.videoSrc} type="video/mp4" width={200} />
                </video>
              </a>
              <div className="text-center">
                <a
                  href="/shop-8?category=eau-de-parfum&subcategory=oriental-fragrance"
                  className="menu-link fw-medium"
                  key={i}
                >
                  {elm.category.split(" ")[0]}
                  <br />
                  {elm.category.split(" ")[1]}
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div id="video-tooltip" className="video-tooltip">
          <video id="tooltip-video" autoPlay loop muted>
            <source src="" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
