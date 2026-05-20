"use client";
import React, { useState, useEffect } from "react";

export default function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 300) {
        // Hide if near the top
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Show if scrolling UP
        setIsVisible(true);
      } else {
        // Hide if scrolling DOWN
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      id="scrollTop"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`${isVisible ? "" : "visually-hidden"}`}
    >
      {/* Your scroll to top content */}
    </div>
  );
}
