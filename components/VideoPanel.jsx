import { useEffect, useRef } from "react";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure the code runs only on the client-side (browser)
    if (typeof window !== "undefined" && videoRef.current) {
      const video = videoRef.current;

      // Try to autoplay the video on page load
      video.play().catch((error) => {
        console.log("Autoplay blocked or failed:", error);
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      loop
      style={{ width: "100%", height: "auto" }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
