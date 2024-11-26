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
  const [images, setImages] = useState([]); // Track loaded images
  let ball = { frame: 0 };

  // Function to preload images concurrently using Promise.all
  const preloadImages = () => {
    const imagePromises = [];

    // Create an array of promises that resolve when each image is loaded
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/assets/mobilescreen/${(i + 1).toString()}.jpg`;
      imagePromises.push(
        new Promise((resolve) => {
          img.onload = resolve; // Resolve the promise when the image is loaded
        })
      );
    }

    // Wait for all images to load concurrently
    Promise.all(imagePromises).then(() => {
      setImages(Array.from({ length: frameCount }, (_, i) => `/assets/mobilescreen/${(i + 1).toString()}.jpg`));
      setIsLoaded(true); // Once all images are loaded, set state to true
      document.body.style.overflow = 'auto'; // Enable scrolling once images are loaded
    });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Disable scrolling while images are loading
    preloadImages(); // Call the preload function when the component mounts

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Function to render the current frame on the canvas
    const render = () => {
      if (images[ball.frame]) {
        const img = new Image();
        img.src = images[ball.frame];
        img.onload = () => {
          context.canvas.width = img.width;
          context.canvas.height = img.height;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
        };
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
  }, [isLoaded, images]); // Re-run when `isLoaded` or `images` state changes

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
        <div className="loading-screen">
          <div className="loading-gif-container">
            <img src="/assets/loading.gif" alt="Loading..." />
          </div>
          <p>Loading...</p>
        </div>
      )}

      {/* Canvas Animation */}
      <div style={{ overflow: isLoaded ? 'auto' : 'hidden' }}>
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
