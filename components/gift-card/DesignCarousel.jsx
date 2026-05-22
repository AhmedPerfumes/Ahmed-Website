"use client";
import { useRef } from "react";

export default function DesignCarousel({ form, updateField }) {
  const scrollRef = useRef();

  const designs = [
    "Best-Wishes",
    "Fathers-Day",
    "happy-anniversary",
    "Your-Special",
    "Happy-Birthday",
    "Mother-day",
    "National-Day",
    "Women-Days",
  ];

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3" style={{ marginBottom: "10px",fontFamily: "Kanit-Regular, sans-serif, Serif" }}>Choose a Card</h5>

      <div style={{ position: "relative" }}>
        <button onClick={() => scroll("left")} style={arrow("left")}>
          ‹
        </button>

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            padding: "10px 30px",
            scrollBehavior: "smooth",
          }}
        >
          {designs.map((d) => (
            <div
              key={d}
              onClick={() => updateField("design", d)}
              style={{
                minWidth: "120px",
                height: "80px",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                border:
                  form.design === d
                    ? "2px solid #c9a96e"
                    : "1px solid #eee",
                transform:
                  form.design === d ? "scale(1.08)" : "scale(1)",
                transition: "all 0.25s ease",
              }}
            >
              <img
                src={`/assets/images/gift-card/${d}.png`}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>

        <button onClick={() => scroll("right")} style={arrow("right")}>
          ›
        </button>
      </div>
    </div>
  );
}

const arrow = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "0",
  transform: "translateY(-50%)",
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  cursor: "pointer",
  zIndex: 2,
});