// components/Pagination1.tsx

export default function Pagination1() {
  return (
    <div
      className="mt-3 mb-3 mx-auto text-center"
      style={{
        width: "60px",
        padding: "15rem 0",
        color: "#a67b30",
      }}
    >
      {/* Inline SVG spinner */}
      <svg
        width="60"
        height="60"
        viewBox="0 0 50 50"
        role="img"
        aria-label="Loading"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#a67b30"
          strokeWidth="5"
          fill="none"
          opacity="0.2"
        />
        <path
          d="M45 25a20 20 0 0 1-20 20"
          stroke="#a67b30"
          strokeWidth="5"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <div className="fs-14 mt-2">-- LOADING --</div>
    </div>
  );
}
