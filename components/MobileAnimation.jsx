"use client";
import React, { useEffect, useRef, useState } from "react";

const ScrollVideoPlayer = () => {
  const videoRef = useRef(null); // To reference the video element
  const [videoDuration, setVideoDuration] = useState(0); // To store the video duration
  const [isLoading, setIsLoading] = useState(true); // To track loading state
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

      // Event listener for when the video can start playing
      video.addEventListener('canplay', () => {
        setIsLoading(false); // Video is ready to play
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
        video.removeEventListener('canplay', () => {});
      }
    };
  }, [playbackConst]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-indicator">
          <img src="/assets/loading.gif" alt="Loading..." /> {/* Replace with your loading gif */}
        </div>
      )}

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
