"use client";
import React, { useEffect, useRef, useState } from "react";

const ScrollVideoPlayer = () => {
  const videoRef = useRef(null); // To reference the video element
  const [videoDuration, setVideoDuration] = useState(0); // To store the video duration
  const playbackConst = 50; // Adjust the playback speed
  const containerRef = useRef(null); // Reference for the container to adjust the height

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    // Dynamically set the height of the container based on the video duration
    if (video) {
      video.addEventListener('loadedmetadata', () => {
        setVideoDuration(video.duration);
        container.style.height = `${Math.floor(video.duration) * playbackConst}px`;
      });
    }

    // Scroll handler to update video playback
    const scrollPlay = () => {
      if (video) {
        const frameNumber = window.pageYOffset / playbackConst;
        video.currentTime = frameNumber;
      }
      // Keep the scroll play going as the user scrolls
      window.requestAnimationFrame(scrollPlay);
    };

    // Start scrollPlay when the page is loaded and ready
    window.requestAnimationFrame(scrollPlay);

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', () => {});
      }
    };
  }, [playbackConst]);

  return (
    <div ref={containerRef}>
      {/* Video element */}
      <video
        ref={videoRef}
        id="v0"
        src="/assets/videos/mobile-screen-video.mp4" // Replace with your video path
        type="video/mp4"
        muted
        playsInline
        loop
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default ScrollVideoPlayer;
