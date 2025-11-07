"use client";
import React from "react";
import HeroSection from "../../../../components/otherPages/KSeries/HeroSection";
import LuxuryLanding from "@/components/otherPages/KSeries/LuxuryLanding";

export default function Page() {
  return (
    <>
      <HeroSection />
      {/* <LuxuryLanding/> */}
      {/* Placeholder next section so the CTA has a destination after the hero */}
      {/* <section className="py-5" style={{ background: "#090b10", color: "#f2f4f8" }}>
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="mb-3">Discover the Collection</h2>
              <p className="lead mb-0">
                Explore the full K‑Series lineup and find your signature scent.
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
