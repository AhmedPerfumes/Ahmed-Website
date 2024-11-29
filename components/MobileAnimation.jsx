"use client";

import "./Canvas.css";


const CanvasAnimation = () => {
  return (
    <section className="sectionMob">
      <div    scroll-frames="mobile"
              data-url-mask="/assets/mobilescreencompressed/|1 to 354|.jpg"
              data-background-size="contain"
              data-detector="the_detector">
      </div>
      <hr id="the_detector"/>
    </section>
  );
};

export default CanvasAnimation;
