import React from "react";

export default function Pagination1() {
  return (
    <div
      className="mt-3 mb-3 ms-auto me-auto"
      style={{ width: "50px", textAlign: "center", color: "#a67b30", paddingTop: "40rem" }}
    >
      {/* <div
        className="progress-bar"
        role="progressbar"
        style={{ width: "39%" }}
        aria-valuenow="39%"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div> */}
      <img src="/assets/images/pre-loader.gif" alt="loading"/>
      -- LOADING --
    </div>
  );
}
