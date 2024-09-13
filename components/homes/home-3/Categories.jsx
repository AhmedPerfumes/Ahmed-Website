"use client";
import { categories2 } from "@/data/categories";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Categories({ params, subCategories }) {

  const categoryName = usePathname().split("/")[2];

  const handleMouseOver = (e) => {
    const tooltip = document.getElementById("video-tooltip");
    const tooltipVideo = document.getElementById("tooltip-video");
    const videoSrc = e.target.getAttribute("data-video-src");

    if (tooltip && tooltipVideo) {
      tooltipVideo.querySelector("source").src = videoSrc;
      tooltipVideo.load();
      tooltip.classList.add("show");
      tooltip.style.display = "block";
      const rect = e.target.getBoundingClientRect();
      tooltip.style.left = `${rect.left}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight}px`;
    }
  };

  const handleMouseOut = () => {
    const tooltip = document.getElementById("video-tooltip");

    if (tooltip) {
      tooltip.classList.remove("show");
      tooltip.style.display = "none";
    }
  };

  // useEffect(() => {
  //   document.addEventListener("mousemove", (e) => {
  //     const tooltip = document.getElementById("video-tooltip");
  //     if (tooltip && tooltip.classList.contains("show")) {
  //       tooltip.style.left = `${e.pageY}px`;
  //     }
  //   });
  // }, []);
  // // -----------

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
        pagination: false,
      },
      768: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        pagination: false,
      },
      992: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        pagination: false,
      },
      1200: {
        slidesPerView: 5,
        slidesPerGroup: 0,
        pagination: false,
      },
    },
  };

  return (
    <section className="category-carousel container">
      <div className="position-relative">
        <Swiper {...swiperOptions} className="swiper-container js-swiper-slider">
          {subCategories.map((elm, i) => (
            <SwiperSlide key={i} className="swiper-slide text-center">
              <a
                key={i}
                href={`/product-category/${categoryName}/${elm.name.split(' ').join('-').toLowerCase()}`}
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
                  data-video-src={`http://localhost/farmart/public/storage/${ elm.video}`}
                  onMouseOver={(e) => handleMouseOver(e)}
                  onMouseOut={handleMouseOut}
                >
                  <source src={`http://localhost/farmart/public/storage/${ elm.video}`} type="video/mp4" width={200} />
                </video>
              </a>
              <div className="text-center">
                <a
                  href={`/product-category/${categoryName}/${elm.name.split(' ').join('-').toLowerCase()}`}
                  className="menu-link fw-medium"
                  key={i}
                >
                  {elm.name}
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
