import React from "react";

function VideoSection() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff", // all text white
        padding: "100px 20px",
        textAlign: "center",
      }}
    >
      {/* TEXT */}
      <h2
        style={{
          fontSize: "52px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#fff",
        }}
      >
        K Series in Motion
      </h2>

      <p
        style={{
          fontSize: "20px",
          maxWidth: "600px",
          color: "#fff", // white text
          margin: "0 auto 50px",
          lineHeight: 1.5,
        }}
      >
        Discover the essence of past, present, and future with the K Series perfumes — a journey of timeless elegance, modern sophistication, and visionary allure.
      </p>

      {/* VIDEO WRAPPER */}
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          borderRadius: "28px",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            border: "none",
            outline: "none",
            // marginLeft: "-5%",
          }}
        >
          <source
            src="/assets/images/kseries/past.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </section>
  );
}

export default VideoSection;
