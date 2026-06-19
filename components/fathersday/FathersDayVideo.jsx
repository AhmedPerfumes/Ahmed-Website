import React from "react";
import { useLocale } from "next-intl";

const FathersDayVideo = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const goldColor = "#c19844";

  return (
    <section
      className="py-5 position-relative"
      style={{ background: "linear-gradient(135deg, #1c1c1c, #000000)" }}
    >
      <div className="container text-center position-relative" style={{ zIndex: 2 }}>
        {/* Section Title */}
        <h2
          className="display-5 fw-bold mb-4 text-uppercase"
          style={{ color: goldColor, letterSpacing: "1px" }}
        >
          {isArabic ? "اتحاد في العبير - الاحتفال بيوم الأب" : "Unity In Scent – Celebrating Father's Day"}
        </h2>

        {/* Video Container */}
        <div
          className="ratio ratio-16x9 rounded shadow-lg mx-auto"
          style={{ border: `3px solid ${goldColor}`, overflow: "hidden", maxWidth: "1000px" }}
        >
          <iframe
            src="https://www.youtube.com/embed/6kjDI37HAW4?si=ztmKYwgPkWTfOdlt&autoplay=1&mute=1&controls=0&loop=1&playlist=6kjDI37HAW4&modestbranding=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Optional floating decoration */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "radial-gradient(circle at top right, rgba(193, 152, 68, 0.15), transparent 70%)",
          pointerEvents: "none",
          zIndex: 1
        }}
      ></div>
    </section>
  );
};

export default FathersDayVideo;
