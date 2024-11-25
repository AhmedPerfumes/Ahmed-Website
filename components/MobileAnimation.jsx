"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import "./Canvas.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false); // Track loading status
  const frameCount = 355; // Total number of frames
  const images = []; // Array to store preloaded images
  const animationState = { frame: 0 }; // Object for GSAP animation

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Function to get the image path
    const getFrame = (index) => `/assets/webp/${index + 1}.webp`;

    // Preload all frames
    const preloadImages = () => {
      const promises = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = getFrame(i);
        images.push(img);
        promises.push(
          new Promise((resolve) => {
            img.onload = resolve; // Resolve once the image is loaded
            img.onerror = resolve; // Handle errors gracefully
          })
        );
      }
      return Promise.all(promises);
    };

    const renderFrame = (frame) => {
      const image = images[frame];
      if (image) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    };

    // Start preloading and animate after loading
    preloadImages().then(() => {
      setIsLoaded(true); // Hide loader once all images are loaded
      renderFrame(0);

      gsap.to(animationState, {
        frame: frameCount - 1,
        snap: "frame", // Snap to nearest frame
        ease: "none",
        scrollTrigger: {
          scrub: 1, // Smooth animation during scroll
          pin: canvas, // Pin the canvas
          end: "200%", // Adjust the scroll duration as needed
        },
        onUpdate: () => {
          renderFrame(animationState.frame);
        },
        onComplete: () => {
          // Auto-scroll to the next section after the last frame
          gsap.to(window, {
            scrollTo: { y: "#main2", autoKill: false },
            duration: 1,
            ease: "power2.inOut",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div>
      {/* Loader */}
      {!isLoaded && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} className="canvas"></canvas>

      {/* Section after the animation */}
      <div id="main2" className="next-section">
        <h1>Welcome to the Next Section</h1>
        <p>Scroll down to explore more content.</p>
      </div>
    </div>
  );
};

export default CanvasAnimation;
