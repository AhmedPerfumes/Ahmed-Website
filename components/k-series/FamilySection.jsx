import React, { useState, useEffect, useRef } from "react";

const animationStyles = `
  .family-section-item {
    transition: all 1s ease-out;
    opacity: 0;
  }
  .family-section-item.is-visible {
    opacity: 1;
  }

  /* Default animations */
  .family-section-item.left {
    transform: translateX(-100%) scale(0.85);
  }
  .family-section-item.right {
    transform: translateX(100%) scale(0.85);
  }
  .family-section-item.center {
    transform: scale(0.6) translateY(40px);
    transition-delay: 0.2s;
  }

  /* Visible state */
  .family-section-item.left.is-visible,
  .family-section-item.right.is-visible {
    transform: translateX(0) scale(0.85);
  }
  .family-section-item.center.is-visible {
    transform: scale(1.05) translateY(-20px);
  }
`;

export default function FamilySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  const imgLeft = "/assets/images/kseries/future_left.png";
  const imgCenter = "/assets/images/kseries/past-center.png";
  const imgRight = "/assets/images/kseries/present3.png";

  return (
    <>
      <style>{animationStyles}</style>

      <div className="bg-dark text-light py-5">
        <section ref={sectionRef}>
          <div className="container text-center">
            {/* Heading */}
            <h2
              className="display-5 display-md-3 fw-bold mb-3"
              style={{ color: "#c7af6c" }}
            >
              THREE ERAS.
              <br />One Fragrance Family
            </h2>

            {/* Subheading */}
            <p
              className="lead text-white mb-5 px-3"
              style={{
                maxWidth: "650px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              A collection born from precision, innovation, and artistry. The
              K-Series brings bold identity with striking visuals, premium
              craftsmanship, and a fragrance experience unlike anything before.
            </p>

            {/* Image Row — tighter spacing */}
            <div
              className="d-flex flex-row justify-content-center align-items-end mt-5 pt-5"
              style={{
                gap: "0", // remove Bootstrap gap
                marginLeft: "-20px", // bring side bottles inward
                marginRight: "-20px",
              }}
            >
              {/* Left Image */}
              <div
                className={`family-section-item left ${
                  isVisible ? "is-visible" : ""
                }`}
                style={{ marginRight: "-40px" }} // pulls closer to center
              >
                <img
                  src={imgLeft}
                  alt="KSeries Product 1"
                  className="rounded-5 shadow-lg img-fluid"
                  style={{
                    transformOrigin: "bottom center",
                  }}
                />
              </div>

              {/* Center Image */}
              <div
                className={`family-section-item center ${
                  isVisible ? "is-visible" : ""
                }`}
                style={{ zIndex: 2 }}
              >
                <img
                  src={imgCenter}
                  alt="KSeries Product 2"
                  className="rounded-5 shadow-xl img-fluid"
                  style={{
                    transformOrigin: "bottom center",
                  }}
                />
              </div>

              {/* Right Image */}
              <div
                className={`family-section-item right ${
                  isVisible ? "is-visible" : ""
                }`}
                style={{ marginLeft: "-40px" }} // pulls closer to center
              >
                <img
                  src={imgRight}
                  alt="KSeries Product 3"
                  className="rounded-5 shadow-lg img-fluid"
                  style={{
                    transformOrigin: "bottom center",
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
