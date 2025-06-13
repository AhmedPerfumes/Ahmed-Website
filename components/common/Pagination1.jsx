import React from "react";
import Image from "next/image";

export default function Pagination1() {
  return (
    <div
      className="mt-3 mb-3 ms-auto me-auto"
      style={{ width: "40px", textAlign: "center", color: "#a67b30", padding: "15rem 0rem" }}
    >
      {/* <img src="/assets/images/pre-loader.gif" alt="loading"/> */}
      <Image
          width={0}
          height={0}
          sizes="100%"
          src="/assets/images/pre-loader.gif"
          alt="Loading"
          style={{ width: "100%", height: "auto" }}
          aria-label="Loading"
      />
      -- LOADING --
    </div>
  );
}
