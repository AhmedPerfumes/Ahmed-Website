import React from "react";

const RamadanVideo = () => {
  const goldColor = "#c19844";

  return (
    <section
      className="py-5 position-relative"
      style={{ background: "linear-gradient(135deg, #1c1c1c, #000000)" }}
    >
      <div className="container text-center position-relative">
        {/* Section Title */}
        <h2
          className="display-5 fw-bold mb-4 text-uppercase"
          style={{ color: goldColor, letterSpacing: "1px" }}
        >
          Unity In Scent – Ramadan Kareem
        </h2>
        {/* <p className="text-light mb-4">
          مجموعة رمضان لدى أحمد المغربي للعطور
        </p> */}

        {/* Video Container */}
        <div
          className="ratio ratio-16x9 rounded shadow-lg"
          style={{ border: `3px solid ${goldColor}`, overflow: "hidden" }}
        >
          <iframe
            src="https://www.youtube.com/embed/LlaGANDEYJ8?autoplay=1&mute=1&controls=0&loop=1&playlist=LlaGANDEYJ8&modestbranding=1"
            title="Unity In Scent - Ramadan Kareem"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          ></iframe>
        </div>
      </div>

      {/* Optional floating decoration */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "radial-gradient(circle at top right, rgba(193, 152, 68, 0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      ></div>
    </section>
  );
};

export default RamadanVideo;