"use client";
import React, { useEffect, useRef } from "react";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules"; // Import the Pagination module
import "./Shop5.css"; // Import your CSS file for styling

const Shop5 = () => {
  const swiperRef = useRef(null); // Create a ref to the Swiper instance

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const { activeIndex, slides } = swiperRef.current.swiper;
      // Check if the active slide is the last one
      if (activeIndex === slides.length) {
        // Disable mousewheel interaction on the last slide
        swiperRef.current.swiper.mousewheel.disable();
      } else {
        // Enable mousewheel interaction on other slides
        swiperRef.current.swiper.mousewheel.enable();
      }
    }
  };

  return (
    <div className="scrollify-container">
      <Swiper
        ref={swiperRef} // Attach the ref to the Swiper
        direction="vertical"
        mousewheel={true}
        modules={[Mousewheel, Pagination]} // Add Pagination module
        pagination={{
          clickable: true, // Make pagination circles clickable
          renderBullet: (index, className) => {
            return `<span class="${className} circle-pagination"></span>`; // Custom rendering of pagination circles
          },
        }}
        style={{ height: "100vh" }} // Make sure Swiper takes full height
        onSlideChange={handleSlideChange} // Handle slide change event
      >
        <SwiperSlide className="panel">
          <img
            src="/assets/images/home/demo8/gift-sets/oud-and-roses-gift-set-bnr.jpg"
            alt="Oud and Roses Gift Set"
          />
        </SwiperSlide>
        <SwiperSlide className="panel">
          <img
            src="/assets/images/home/demo8/gift-sets/shauque-al-shuyookh-bnr.jpg"
            alt="Shauque Al Shuyookh Gift Set"
          />
        </SwiperSlide>
        <SwiperSlide className="panel">
          <img
            src="/assets/images/home/demo8/gift-sets/bidun-esam-giftset-bnr.jpg"
            alt="Bidun Esam Gift Set"
          />
        </SwiperSlide>
        <SwiperSlide className="panel">
          <img
            src="/assets/images/home/demo8/gift-sets/dakhoon-collection-bnr.jpg"
            alt="The Dukhoon Collection"
          />
        </SwiperSlide>
      </Swiper>

      {/* Content of the next section */}
      <div className="next-section">
        <h2>Next Section</h2>
        <p>This is the content of the next section.</p>
      </div>
    </div>
  );
};

export default Shop5;
