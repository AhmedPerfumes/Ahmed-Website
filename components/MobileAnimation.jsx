"use client";
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import "./Canvas.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const MobileAnimation = () => {
  const canvasRef = useRef(null);
  const previousScrollY = useRef(0); // Store previous scroll position for comparison
  const [showSkipButton, setShowSkipButton] = useState(false);
  const frameCount = 355;
  let images = [];
  let ball = { frame: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const currentFrame = (index) => `/assets/mobilescreen/${(index + 1).toString()}.jpg`;

    // Preload all images in parallel
    const loadImages = async () => {
      const imagePromises = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        imagePromises.push(new Promise((resolve) => {
          img.onload = resolve;
        }));
        images.push(img);
      }
      await Promise.all(imagePromises); // Wait for all images to load
      render();
    };

    const render = () => {
      context.canvas.width = images[0].width;
      context.canvas.height = images[0].height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[ball.frame], 0, 0);
    };

    loadImages(); // Start preloading images

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
        const currentScrollY = window.scrollY;
        if (currentScrollY > previousScrollY.current) {
          console.log(Math.round(ball.frame) + ' === ' + frameCount);
          if (Math.round(ball.frame) + 50 > frameCount - 2) {
            gsap.to(window, {
              scrollTo: { y: "#main2", autoKill: false },
              duration: 0.5,
              ease: "power2.inOut",
            });
          }
        }
        previousScrollY.current = currentScrollY;
      },
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
    <div>
      <canvas ref={canvasRef} className="canvas"></canvas>
      {showSkipButton && (
        <button onClick={skipAnimation} className="skip-button2">
          SKIP INTRO
        </button>
      )}
    </div>
  );
};

export default MobileAnimation;
