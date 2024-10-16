"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin'; // Import ScrollToPlugin
import "./Canvas.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); // Register ScrollToPlugin

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const frameCount = 380;
  let images = [];
  let ball = { frame: 0 };

  // Function to load a single image as a Promise
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  // Preload all images
  const preloadImages = () => {
    const promises = [];
    for (let i = 0; i < frameCount; i++) {
      const imgSrc = currentFrame(i);
      promises.push(loadImage(imgSrc));
    }
    return Promise.all(promises);
  };

  // Generate the current frame image URL
  const currentFrame = (index) => `/assets/final/${(index + 100000).toString()}.jpg`;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Render function to draw the current frame
    const render = () => {
      context.canvas.width = images[0].width;
      context.canvas.height = images[0].height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[ball.frame], 0, 0);
    };

    // Preload images and start the animation
    preloadImages().then((loadedImages) => {
      images = loadedImages;
      images[0].onload = render; // Render the first frame after loading
      
      // ScrollTrigger animation for the canvas
      gsap.to(ball, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          scrub: 1,
          pin: canvas,
          end: '250%',
          onLeave: () => {
            // Snap to the next section when the last frame is reached
            gsap.to(window, {
              scrollTo: { y: "#animation-section", autoKill: false }, // Smooth scroll to the section
              duration: 0.5,
              ease: "power2.inOut",
            });
          },
        },
        onUpdate: render,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="canvas"></canvas>
    </div>
  );
};

export default CanvasAnimation;
