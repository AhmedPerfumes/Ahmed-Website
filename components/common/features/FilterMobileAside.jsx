"use client";
import React from "react";
import FilterDiscounted from "./FilterDiscounted";

export default function FilterMobileAside({ products, isOpen, onClose }) {
  return (
    <>
      {/* Dark Backdrop Overlay */}
      <div 
        className={`aside-overlay ${isOpen ? "active" : ""}`} 
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0)",
          zIndex: 1040,
          display: isOpen ? "block" : "none"
        }}
      />

      {/* The Sidebar */}
      <div
            className={`aside aside_right ${isOpen ? "opened" : ""}`}
            style={{
                position: "fixed",
                top: 0,
                right: isOpen ? "0" : "-100%",
                width: "320px",
                height: "100%",
                backgroundColor: "#ffffff", // Use hex for solid white
                zIndex: 1060,               // Higher than backdrop and sticky headers
                transition: "right 0.3s ease-in-out",
                padding: "20px",
                boxShadow: "-5px 0 25px rgba(0,0,0,0.2)", // Strengthen shadow for depth
                overflowY: "auto",
                opacity: 1,                 // Explicitly set full opacity
                visibility: isOpen ? "visible" : "hidden"
            }}
        >
        <div className="aside-header d-flex align-items-center mb-3">
          <h3 className="text-uppercase fs-6 mb-0">Refine Selection</h3>
          <button 
            className="btn-close ms-auto" 
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.5rem" }}
          >
            ×
          </button>
        </div>

        <div className="aside-content">
          <FilterDiscounted products={products} />
        </div>
      </div>
    </>
  );
}