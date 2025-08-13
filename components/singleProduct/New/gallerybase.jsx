"use client";

import React from "react";
import Carousel from "./Common/carousel";
import ThumbMobile from "./Common/thumb-mobile";
import Top from "./Common/top";

const GalleryBase = ({
  images,
  activeIndex,
  setActiveIndex,
  onThumbnailClick,
}) => {
  return (
    <div
      className="container gallery-base"
      style={{
        maxWidth: "480px",
      }}
    >
      <div className="d-lg-none">
        <Top />
      </div>

      {/* Carousel wrapper: flex on desktop only */}
      <div
        className="d-flex d-lg-flex justify-content-lg-center"
        style={{
          width: "100%",
        }}
      >
        <Carousel
          images={images}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>

      <ThumbMobile images={images} onThumbnailClick={onThumbnailClick} />
    </div>
  );
};

export default GalleryBase;
