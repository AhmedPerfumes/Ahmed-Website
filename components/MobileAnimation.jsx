"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import "./Canvas.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const CanvasAnimation = () => {
  const videoRef = useRef(null); // To reference the video element
  const [isLoaded, setIsLoaded] = useState(false); // State to track if the video is loaded
  const [showSkipButton, setShowSkipButton] = useState(false); // Show skip button after scroll enters
  const playbackConst = 100; // Adjust playback speed constant
  const containerRef = useRef(null); // Reference for the container to adjust height based on video duration

  // Handle video load and set container height based on video duration
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    // Set video duration and adjust container height accordingly
    if (video) {
      video.addEventListener("loadedmetadata", () => {
        const videoDuration = video.duration; // Get video duration
        container.style.height = `${Math.floor(videoDuration) * playbackConst}px`; // Adjust height of container
        setIsLoaded(true); // Set loaded state to true once metadata is loaded
      });
    }

    // Scroll handler to update video playback
    const scrollPlay = () => {
      if (video) {
        const frameNumber = window.pageYOffset / playbackConst; // Calculate frame number based on scroll
        video.currentTime = frameNumber; // Set video current time based on scroll
      }
      window.requestAnimationFrame(scrollPlay); // Keep updating playback on scroll
    };

    // GSAP ScrollTrigger animation to pin the video during scroll
    if (video) {
      gsap.to(video, {
        scrollTrigger: {
          trigger: container, // The element to track scrolling
          start: "top top", // Start when the container reaches the top of the viewport
          end: `+=${Math.floor(video.duration) * playbackConst}px`, // End when the scroll height reaches the video duration
          scrub: true, // Scrub through the video frames as you scroll
          pin: true, // Pin the video during the scroll
          markers: false, // Optionally, disable markers (useful for debugging)
          onEnter: () => setShowSkipButton(true),
          onLeave: () => setShowSkipButton(false),
        },
      });
    }

    // Start scrollPlay when the page is loaded and ready
    window.requestAnimationFrame(scrollPlay);

    return () => {
      // Clean up the ScrollTrigger when the component is unmounted
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [playbackConst]);

  // Skip button click handler
  const skipAnimation = () => {
    gsap.to(window, {
      scrollTo: { y: "#main2", autoKill: false },
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Show loading GIF until the video is loaded */}
      {/* {!isLoaded && (
        <div className="loading-indicator">
          <img src="/assets/loading.gif" alt="Loading..." />
        </div>
      )} */}

      {/* Video element */}
      <video
        ref={videoRef}
        id="v0"
        src="/assets/videos/mobile-screen-video.mp4" // Replace with your video path
        type="video/mp4"
        muted
        playsInline
        loop
        style={{ width: "100%", height: "auto" }}
      />

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
