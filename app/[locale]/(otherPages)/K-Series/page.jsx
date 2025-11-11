// app/kseries/page.js

"use client";
import React from "react";
import HeroSection from "../../../../components/otherPages/KSeries/HeroSection";
import KSeriesProductCards from "@/components/otherPages/KSeries/KSeriesProductCards"; // <-- NEW IMPORT
import KSeriesScrollSection from "@/components/otherPages/KSeries/KSeriesScrollSection";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";

export default function Page() {
    return (
        <>
            {/* <Header14 /> */}
            <main className="">
                <HeroSection />
                <KSeriesProductCards /> {/* <-- NEW COMPONENT PLACEMENT */}
                {/* <KSeriesScrollSection /> */}
            </main>
            <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, #b8860b 0%, #d4af37 25%, #f7e9a0 50%, #d4af37 75%, #b8860b 100%)", borderRadius: "2px"}}></div>

            <section className="d-none d-lg-block" style={{ height: "100%" }}>
                <Footer14 />
            </section>
            <section className="d-sm-block d-md-none bg-dark pt-5  ">
                <div className="MobileFooter">
                    <MobileFooter2 />
                </div>
            </section>
        </>
    );
}