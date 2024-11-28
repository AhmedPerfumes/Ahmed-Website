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
  const [loading, setLoading] = useState(true);  // Track loading state
  const frameCount = 318;
  let images = [];
  let ball = { frame: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const currentFrame = (index) => `/assets/mobilescreencompressed/${(index + 1).toString()}-min.jpg`;

    // Preload all images and update the loading progress
    const imagePromises = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      if(i + 1 != 22 && i + 1 != 148 && i + 1 != 223 && i + 1 != 224 && i + 1 != 225 && i + 1 != 226 && i + 1 != 227 && i + 1 != 228 && i + 1 != 229 && i + 1 != 230 && i + 1 != 231 && i + 1 != 232 &&
        i + 1 != 233 && i + 1 != 234 && i + 1 != 235 && i + 1 != 236 && i + 1 != 237 && i + 1 != 238 && i + 1 != 239 && i + 1 != 240 && i + 1 != 241 && i + 1 != 242 && i + 1 != 243 && i + 1 != 244) {
        img.src = currentFrame(i);
      }
      images.push(img);

      img.onload = () => {
        // Check if all images are loaded
        if (images.every((img) => img.complete)) {
          setLoading(false);  // Set loading to false when all images are loaded
        }
      };
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

  // Function to draw the placeholder
  const drawPlaceholder = (context) => {
    context.fillStyle = "#f0f0f0";  // Light gray background for placeholder
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);  // Draw background
    context.fillStyle = "#888";  // Placeholder text color
    context.font = "20px Arial";  // Font style
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Loading...", context.canvas.width / 2, context.canvas.height / 2);  // Placeholder text
  };

  return (
    <div>
      {/* Canvas Animation */}
      <canvas ref={canvasRef} className="canvas">
        {/* Show a loading placeholder when images are not loaded */}
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#888",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            Loading...
          </div>
        )}
      </canvas>

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
