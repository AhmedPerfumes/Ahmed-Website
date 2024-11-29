"use client";

import React, { useEffect, useState } from "react";
import "./Canvas.css";


const CanvasAnimation = () => {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const isMobileDevice = () => {
      return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    };

    setIsMobile(isMobileDevice());
  }, []);

  return (
    !isMobile ?
      <section className="sectionWebMob">
        <div scroll-frames="web" data-url-mask="/assets/final/|1 to 343|.jpg" data-background-size="cover" data-detector="the_detector_web"></div>
        <hr id="the_detector_web"/>
      </section> : 
      <section className="sectionWebMob">
        <div scroll-frames="mobile" data-url-mask="/assets/mobilescreencompressed/|1 to 354|.jpg" data-background-size="contain" data-detector="the_detector_mob"></div>
        <hr id="the_detector_mob"/>
      </section>
  );
};

export default CanvasAnimation;
