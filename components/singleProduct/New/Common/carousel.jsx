import React, { useEffect, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Zoom from "./zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from "swiper/modules";

const Carousel = ({ images, activeIndex, setActiveIndex }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(activeIndex);
    }
  }, [activeIndex]);
  return (
    <Swiper
      ref={swiperRef}
      modules={[Navigation, EffectFade]}
      effect="fade"
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      className="w-100 responsive-swiper position-relative"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <div className="d-flex align-items-center justify-content-center w-100 h-100">
            <Zoom src={`${process.env.NEXT_PUBLIC_API_URL}storage/${img}`} zoom={2} lensSize={180} />
          </div>

          {/* Badge Overlay */}
          {index === 0 && (
            <div
              className="position-absolute shadow rounded-pill d-flex align-items-center"
              style={{
                top: "1.75rem",
                right: "1rem",
                backgroundColor: "#facc15",
                color: "black",
                fontSize: "0.75rem",
                fontWeight: "600",
                padding: "0.25rem 0.75rem",
                zIndex: 10,
              }}
            >
              <img
                src="https://www.svgrepo.com/show/527045/fire.svg"
                alt="bestseller"
                style={{
                  width: "14px",
                  height: "14px",
                  marginRight: "0.25rem",
                }}
              />
              Bestseller
            </div>
          )}

          {index === 1 && (
            <div
              className="position-absolute shadow rounded-pill d-flex align-items-center"
              style={{
                top: "1.75rem",
                right: "1rem",
                backgroundColor: "#000",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "600",
                padding: "0.25rem 0.75rem",
                zIndex: 10,
              }}
            >
              <img
                src="https://www.svgrepo.com/show/523816/star-fall-minimalistic-2.svg"
                alt="5-star"
                style={{
                  width: "14px",
                  height: "14px",
                  marginRight: "0.25rem",
                  filter: "invert(1)",
                }}
              />
              5-Star Rated
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
