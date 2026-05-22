"use client";

import dynamic from "next/dynamic";

// Dynamically import the heavy component to keep initial bundle small
const FindYourScent = dynamic(
  () => import("@/components/FindYourScent/FindYourScent"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: "100svh",
          background: "#0a0a0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#c9a96e",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

export default function FindYourScentPage() {
  return <FindYourScent />;
}
