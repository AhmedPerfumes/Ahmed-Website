import React, { useRef, useState, useEffect } from "react";

const Description = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "60px");
    }
  }, [expanded]);

  return (
    <div
      style={{
        overflow: "hidden",
        transition: "max-height 0.5s ease-in-out",
        fontFamily: `'Merriweather', serif`,
      }}
    >
      
      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          transition: "max-height 0.5s ease-in-out",
          overflow: "hidden",
          fontSize: "0.875rem", // text-sm
          color: "#6E6E73",
          letterSpacing: "0.025em",
          lineHeight: "1.5"
        }}
      >
        {description}
      </div>

      {description.length > 100 && (
        <div className="d-flex justify-content-end">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-link p-0 mt-1"
            style={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              color: "#6E6E73",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.color = "#1C1C1E")}
            onMouseOut={(e) => (e.target.style.color = "#6E6E73")}
          >
            {expanded ? "Show less" : "...Read more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Description;
