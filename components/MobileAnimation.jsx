"use client";

import "./Canvas.css";

const MobileAnimation = () => {
  return (
    <section className="sectionWebMob">
      <div scroll-frames="demo"
          data-url-mask="/assets/mobilescreencomp/|1 to 140|.jpg"
          data-background-size="cover"
          data-detector="the_detector">
      </div>
      <hr id="the_detector"/>
    </section>
  );
};

export default MobileAnimation;