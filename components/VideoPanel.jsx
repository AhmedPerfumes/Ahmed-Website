import { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ src, section, style, className }) => {
    const videoRef = useRef(null);

    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        // Check if the video element is in the viewport
        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Play the video when it comes into the viewport
                    setIsInView(true);
                    video.play().catch((error) => {
                        // console.log("Autoplay blocked or failed:", error);
                    });
                } else {
                    // Optionally pause the video when it's out of view
                    setIsInView(false);
                    video.pause();
                }
            });
        };

        // Create the Intersection Observer
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5, // Trigger when 50% of the video is visible
        });

        if (video) {
            observer.observe(video);
        }

        // Clean up observer on component unmount
        return () => {
            if (video) {
                observer.unobserve(video);
            }
        };
    }, []);

    const getDefaultClass = () => {
        if (section === 'hundred') return "w-100";
        if (section === 'popup') return "w-75";
        if (section === 'sm_popup') return "w-50";
        return "w-75";
    };

    return (
        <video
            ref={videoRef}
            // autoPlay
            muted
            playsInline
            loop
            className={`${getDefaultClass()} ${className || ''}`}
            style={style}
        >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoPlayer;
