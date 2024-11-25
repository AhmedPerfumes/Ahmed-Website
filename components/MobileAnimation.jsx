"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import "./Canvas.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const CanvasAnimation = () => {
  const videoRef = useRef(null);
  const previousScrollY = useRef(0); // Store previous scroll position for comparison
  const [showSkipButton, setShowSkipButton] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadataLoaded = () => {
      video.pause();
      video.currentTime = 0;

      gsap.to(video, {
        currentTime: video.duration || 1, // Use a fallback value if duration is unavailable
        scrollTrigger: {
          scrub: 1,
          pin: video,
          end: "250%",
          onEnter: () => setShowSkipButton(true),
          onLeave: () => setShowSkipButton(false),
        },
        onUpdate: () => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > previousScrollY.current) {
            // Check if scroll has passed the threshold for skipping
            if (video.currentTime >= (video.duration || 1) - 2) {
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
    };

    // Attach the event listener for when the video's metadata is loaded
    video.addEventListener("loadedmetadata", handleMetadataLoaded);

    return () => {
      // Clean up event listeners and ScrollTrigger instances
      video.removeEventListener("loadedmetadata", handleMetadataLoaded);
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
      <video
        ref={videoRef}
        className="video"
        src="/assets/videos/mobile-screen-video.mp4"
        type="video/mp4"
        muted
        loop
      />
      {showSkipButton && (
        <button onClick={skipAnimation} className="skip-button">
          SKIP INTRO
        </button>
      )}
    </div>
  );
};

export default CanvasAnimation;
