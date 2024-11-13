"use client";
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import Footer14 from "@/components/footers/Footer14";
import Animation from "@/components/Animation";
import MobileFooter2 from "@/components/footers/MobileFooter2";

import "./Canvas.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // New state for visibility
  const frameCount = 343;
  let images = [];
  let ball = { frame: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const currentFrame = (index) => `/assets/final/${(index + 1).toString()}.jpg`;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      if (images[0]) {
        context.canvas.width = images[0].width;
        context.canvas.height = images[0].height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[ball.frame], 0, 0);
      }
    };

    images[0].onload = render;

    gsap.to(ball, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        scrub: 1,
        pin: canvas,
        end: '250%',
        onEnter: () => setShowSkipButton(true),
        onLeave: () => setShowSkipButton(false),
      },
      onUpdate: () => {
        render();
        if (Math.round(ball.frame) === frameCount - 2) {
          gsap.to(window, {
            scrollTo: { y: "#main2", autoKill: false },
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      },
      onComplete: () => {
        // Hide the component after the animation completes
        setIsVisible(false); // This will hide the component
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const skipAnimation = () => {
    gsap.to(window, {
      scrollTo: { y: "#main2", autoKill: false },
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  return (
    isVisible ? <div>
      <canvas ref={canvasRef} className="canvas"></canvas>
      {showSkipButton && (
        <button onClick={skipAnimation} className="skip-button">Skip</button>
      )}
    </div> : <>
            <main id="">
            {/* Animation component will render after CanvasAnimation */}
            <Animation />
          </main>
          <section className="d-none d-lg-block" style={{ height: "100%" }}>
            <Footer14 />
          </section>
          <section className="d-sm-block d-md-none bg-dark pt-5">
            <div className="MobileFooter">
              <MobileFooter2 />
            </div>
          </section>
        </>
  );
};

export default CanvasAnimation;
