"use client";

import "./Canvas.css";


const CanvasAnimation = () => {
  return (
    <section>
    <div    scroll-frames="demo"
            data-url-mask="/assets/webp/|1 to 355|.webp"
            data-background-size="cover"
            data-detector="the_detector">
    </div>
    <hr id="the_detector"/>
    </section>
  );
};

export default CanvasAnimation;
