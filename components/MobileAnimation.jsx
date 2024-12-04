"use client";
import { useEffect, useRef, useState } from "react";
import "./Canvas.css";

const MobileAnimation = () => {
  const previousScrollY = useRef(0); // Store previous scroll position for comparison
  const [showSkipButton, setShowSkipButton] = useState(true);
  const [showModal, setShowModal] = useState(true); // Modal state

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollTop / totalHeight;  // Get the scroll percentage (0 to 1)

    // Determine the image based on scroll percentage
    const totalImages = 136; // Total number of images (adjust based on your data)
    const imageIndex = Math.floor(scrollPercentage * totalImages);  // Calculate the image index

    // Update the image source
    // console.log(imageIndex);

    // Auto-scroll to the next section when imageIndex reaches 9
    const currentScrollY = window.scrollY;
    if (currentScrollY > previousScrollY.current) {
      if (imageIndex === 9) {
        // Scroll to the next section with a smooth scroll
        const nextSection = document.getElementById("main2");
        if (nextSection) {
          setShowSkipButton(false);
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    previousScrollY.current = currentScrollY;
  };

  const skipAnimation = () => {
    const nextSection = document.getElementById("main2");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
      setShowSkipButton(false);
    }
  };

  useEffect(() => {
    // Automatically hide the modal after 3 seconds (3000 ms)
    const modalTimer = setTimeout(() => {
      setShowModal(false); // Close the modal after 3 seconds
    }, 3000);

    // Use setTimeout to ensure page rendering is complete before scrolling
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);  // Delay the scroll action to ensure it's executed after render

    // Disable scrolling while the modal is active
    if (showModal) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable scroll when modal is closed
    }

    if (showModal) {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) {
        modalContent.style.pointerEvents = "auto"; // Add pointer-events: auto
      }
    }

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener and the timeout when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(modalTimer); // Clear the timeout if the component is unmounted
    };
  }, [showModal]); // Effect runs when showModal changes

  return (
    <section className="sectionWebMob">
      {/* Modal */}
      {showModal && (
        <div className="modal loader-modal">
          <div className="modal-content loader-modal-content">
            <img src="/assets/loading.gif" alt="Modal Image" />
          </div>
        </div>
      )}

      <div
        scroll-frames="demo"
        data-url-mask="/assets/mobilescreencomp/|1 to 136|.jpg"
        data-background-size="cover"
        data-detector="the_detector"
      ></div>

      <hr id="the_detector" />

      {showSkipButton && (
        <button onClick={skipAnimation} className="skip-button">
          SKIP INTRO
        </button>
      )}
    </section>
  );
};

export default MobileAnimation;
