import React, { useRef, useState } from "react";

const Zoom = ({ src, zoom = 2, lensSize = 150 }) => {
  const containerRef = useRef(null);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const updateLens = (x, y) => {
    const rect = containerRef.current.getBoundingClientRect();
    setLensPosition({
      x: Math.max(0, Math.min(x, rect.width)),
      y: Math.max(0, Math.min(y, rect.height)),
    });
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    updateLens(e.clientX - rect.left, e.clientY - rect.top);
    if (!visible) setVisible(true);
  };

  const handleMouseLeave = () => setVisible(false);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    updateLens(touch.clientX - rect.left, touch.clientY - rect.top);
    setVisible(true);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    updateLens(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchEnd = () => setVisible(false);

  return (
    <div
      ref={containerRef}
      className="position-relative w-100"
      style={{
        overflow: "hidden",
        touchAction: "none",
        backgroundColor: "#FAF9F7",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={src}
        alt="Product"
        className="w-100"
        style={{
          height: "auto",
          objectFit: "contain",
          mixBlendMode: "multiply",
          transition: "filter 0.3s ease",
          filter: visible ? "blur(2px)" : "none",
        }}
      />

      <div
        className="position-absolute"
        style={{
          pointerEvents: "none",
          width: `${lensSize}px`,
          height: `${lensSize}px`,
          left: `${lensPosition.x - lensSize / 2}px`,
          top: `${lensPosition.y - lensSize / 2}px`,
          borderRadius: "50%",
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${
            containerRef.current?.offsetWidth * zoom || 0
          }px`,
          backgroundPosition: `-${lensPosition.x * zoom - lensSize / 2}px -${
            lensPosition.y * zoom - lensSize / 2
          }px`,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          boxShadow:
            "0 0 15px 5px rgba(150, 150, 150, 0.4), 0 0 25px 10px rgba(100, 100, 100, 0.2)",
          border: "2px solid rgba(255, 255, 255, 0.4)",
          transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
          transform: visible ? "scale(1)" : "scale(0.25) translateY(-8px)",
          opacity: visible ? 1 : 0,
          zIndex: 50,
        }}
      />
    </div>
  );
};

export default Zoom;
