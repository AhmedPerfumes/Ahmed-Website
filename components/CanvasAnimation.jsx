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
  const [loadingProgress, setLoadingProgress] = useState(0); // To track the loading progress (percentage)
  const frameCount = 343;
  const images = useRef([]); // Store images in a ref to avoid reloading
  const [loadedImages, setLoadedImages] = useState(false); // State to track if images are loaded
  const ball = useRef({ frame: 0 });

  useEffect(() => {
    const loadImages = async () => {
      const loadImage = (index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/assets/final/${(index + 1).toString()}.jpg`;
          img.onload = () => resolve(img);
        });
      };

      const imagePromises = [];
      let loadedCount = 0;

      for (let i = 0; i < frameCount; i++) {
        imagePromises.push(
          loadImage(i).then((img) => {
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / frameCount) * 100)); // Update loading progress
            return img;
          })
        );
      }

      const loadedImgs = await Promise.all(imagePromises);
      images.current = loadedImgs;
      setLoadedImages(true); // Set images loaded to true once all images are loaded
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!loadedImages || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // if (images[0]) {
    //   context.canvas.width = images[0].width;
    //   context.canvas.height = images[0].height;
    // }

    const render = () => {
      if (images.current[0]) {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before each render
        context.drawImage(images.current[Math.round(ball.current.frame)], 0, 0);
      }
    };

    // ScrollTrigger animation
    gsap.to(ball.current, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 1,
        pin: canvas,
        start: "top top",
        end: "250%",
        onEnter: () => setShowSkipButton(true),
        onLeave: () => setShowSkipButton(false),
      },
      onUpdate: () => {
        render(); // Update canvas frame on scroll
        const currentScrollY = window.scrollY;
        if (currentScrollY > previousScrollY.current) {
          if (Math.round(ball.current.frame) + 50 > frameCount - 2) {
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
  }, [loadedImages]);

  const skipAnimation = () => {
    gsap.to(window, {
      scrollTo: { y: "#main2", autoKill: false },
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  return (
    <div>
      <canvas ref={canvasRef} className="canvas" />
      
      {/* Loading Overlay */}
      {!loadedImages && (
        <div className="loading-overlay">
          <div className="loading-bar" style={{ width: `${loadingProgress}%` }}></div>
          <span className="loading-text">Loading {loadingProgress}%</span>
        </div>
      )}

      {/* Skip button */}
      {showSkipButton && (
        <button onClick={skipAnimation} className="skip-button">
          SKIP INTRO
        </button>
      )}
    </div>
  );
};

export default CanvasAnimation;