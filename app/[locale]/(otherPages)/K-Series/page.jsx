"use client";
import React from "react";
import HeroSection from "../../../../components/otherPages/KSeries/HeroSection";
import KSeriesScrollSection from "@/components/otherPages/KSeries/KSeriesScrollSection";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";

export default function Page() {
    return (
        <>
            <Header14 />
            <main className="page-wrapper">
                <HeroSection />
                <KSeriesScrollSection />
            </main>
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
