import React from "react";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section d-flex align-items-center justify-content-center text-white">
      <div className="overlay"></div>

      <div className="container position-relative z-1">
        <div className="row align-items-center">
          {/* Left Column: Perfume Bottle */}
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <div className="hero-image position-relative">
              <img
                src="/assets/images/kseries/past-center.png"
                alt="Perfume Bottle"
                className="perfume-bottle"
              />
              <div className="bottle-glow"></div>
            </div>
          </div>

          {/* Right Column: Owner Message */}
          <div className="col-md-6">
            <div className="hero-message px-3 px-md-0">
              <h1 className="display-4 fw-bold mb-3 text-gold">
                K Series: <span className="text-cream">Past</span>
              </h1>
              <p className="lead mb-4 text-light">
                <em>
                  "This perfume is a tribute to the memories that shaped us. Each
                  note captures the essence of timeless elegance and the beauty of
                  the moments we cherish most."
                </em>
              </p>
              <p className="text-muted fst-italic">- Dedicated by our founder</p>
              <button className="btn btn-light btn-lg mt-4 px-5 py-3">
                Discover the Scent
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
