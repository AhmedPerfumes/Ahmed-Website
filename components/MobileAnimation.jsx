"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import "./Canvas.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const previousScrollY = useRef(0); // Store previous scroll position for comparison
  const [showSkipButton, setShowSkipButton] = useState(false);
  const frameCount = 355;
  let images = [];
  let ball = { frame: 0 };

  useEffect(() => {
    // Simulate a 1-minute loading time (60000 milliseconds)
    const loadingTimer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 1 minute
    }, 60000);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const currentFrame = (index) => `/assets/webp/${(index + 1).toString()}.webp`;

    // Preload all images and update the loading progress
    const imagePromises = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // Function to render the current frame on the canvas
    const render = () => {
      if (images[0]) {
        context.canvas.width = images[0].width;
        context.canvas.height = images[0].height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[ball.frame], 0, 0);
      }
    };

    // Start rendering once the first image is loaded
    images[0].onload = render;

    // GSAP animation on scroll
    gsap.to(ball, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 1,
        pin: canvas,
        end: "250%",
        onEnter: () => setShowSkipButton(true),
        onLeave: () => setShowSkipButton(false),
      },
      onUpdate: () => {
        render();
        const currentScrollY = window.scrollY;
        if (currentScrollY > previousScrollY.current) {
          if (Math.round(ball.frame) + 50 > frameCount - 5) {
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
      clearTimeout(loadingTimer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []); // Run effect once after component mounts

  // Skip button click handler
  const skipAnimation = () => {
    gsap.to(window, {
      scrollTo: { y: "#main2", autoKill: false },
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  return (
    <div>
      {/* Show loading spinner or animation for 1 minute */}
      {isLoading ? (
        <div className="loader">
          <p>Loading... Please wait for a moment...</p>
          {/* Optionally, you can add a spinner here */}
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Canvas Animation */}
          <canvas ref={canvasRef} className="canvas"></canvas>

          {/* Skip Button */}
          {showSkipButton && (
            <button onClick={skipAnimation} className="skip-button">
              SKIP INTRO
            </button>
          )}
        </>
        )}
    </div>
  );
};

export default CanvasAnimation;
