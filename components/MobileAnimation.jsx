'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import './Canvas.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false); // State to track if images are loaded
  const [showSkipButton, setShowSkipButton] = useState(false); // Show skip button after scroll enters
  const frameCount = 355; // Number of frames in your animation
  let images = [];
  let ball = { frame: 0 };

  // Preload all images function
  const preloadImages = () => {
    let loadedImagesCount = 0;

    // Function to handle when an image is loaded
    const onImageLoad = () => {
      loadedImagesCount += 1;

      if (loadedImagesCount === frameCount) {
        setIsLoaded(true); // All images are loaded, set state to true
        document.body.style.overflow = "auto";
      }
    };

    // Preload images
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/assets/mobilescreen/${(i + 1).toString()}.jpg`;
      img.onload = onImageLoad; // Attach onLoad event
      images.push(img); // Add image to array
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    preloadImages(); // Call the preload function when the component mounts

    // Once images are loaded, we can start the animation logic
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Function to render the current frame on the canvas
    const render = () => {
      if (images[0]) {
        context.canvas.width = images[0].width;
        context.canvas.height = images[0].height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[ball.frame], 0, 0);
      }
    };

    // GSAP animation on scroll
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
      },
    });

    // Clean up on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoaded]); // Run when `isLoaded` state changes

  // Skip button click handler
  const skipAnimation = () => {
    gsap.to(window, {
      scrollTo: { y: '#main2', autoKill: false },
      duration: 0.5,
      ease: 'power2.inOut',
    });
  };

  return (
    <div>
      {/* Show loading GIF until images are loaded */}
      {!isLoaded && (
        <img src="/assets/loading.gif" alt="Loading..." />
      )}

      {/* Canvas Animation */}
      <div style={{ overflow: isLoaded ? "auto" : "hidden" }}>
        <canvas ref={canvasRef} className="canvas"></canvas>
      </div>

      {/* Skip Button */}
      {showSkipButton && (
        <button onClick={skipAnimation} className="skip-button">
          SKIP INTRO
        </button>
      )}
    </div>
  );
};

export default CanvasAnimation;
