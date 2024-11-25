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
  const [isLoaded, setIsLoaded] = useState(false); // Track loading state
  const [loadingProgress, setLoadingProgress] = useState(0); // Track loading progress
  const frameCount = 355;
  let images = [];
  let ball = { frame: 0 };

  useEffect(() => {
    // Disable scroll until images are loaded
    // document.body.style.overflow = "hidden";

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const currentFrame = (index) =>
      `/assets/webp/${(index + 1).toString()}.webp`;

    // Preload all images and update the loading progress
    const imagePromises = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);

      // Create a promise for each image load
      imagePromises.push(
        new Promise((resolve, reject) => {
          img.onload = () => {
            setLoadingProgress((prev) =>
              Math.round(((i + 1) / frameCount) * 100)
            ); // Update progress
            resolve();
          };
          img.onerror = reject;
        })
      );
    }

    // Once all images are loaded, enable scrolling and start the animation
    Promise.all(imagePromises)
      .then(() => {
        setIsLoaded(true);
        // document.body.style.overflow = ""; // Re-enable scroll
      })
      .catch((error) => {
        console.error("Error loading images:", error);
        setIsLoaded(true);
        // document.body.style.overflow = ""; // Re-enable scroll even if images fail to load
      });

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
  }, []); // Run effect once after component mounts

  // Ensure the loader stays for 2 seconds, even if images load faster
  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setIsLoaded(true); // Hide loader after 2 seconds
    }, 20000);

    return () => clearTimeout(loaderTimeout); // Cleanup the timeout if the component is unmounted
  }, []); // Only run this effect once, after initial render

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
      {/* Show loading GIF until loading is complete */}
      {!isLoaded && (
        <div className="loading-screen">
          <div className="loading-gif-container">
            {/* Your GIF loader here */}
            {/* <img src="/assets/loading.gif" alt="Loading..." /> */}
          </div>
          <p>Loading...</p>
        </div>
      )}

      {/* Canvas Animation */}
      <canvas ref={canvasRef} className="canvas"></canvas>

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
