// app/kseries/page.js

"use client";
import React from "react";
import Header14 from "@/components/headers/Header14";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "@/components/footers/MobileFooter2";
import VideoSection from "@/components/k-series/VideoSection";
import NoteSection from "@/components/k-series/NoteSection";
import FamilySection from "@/components/k-series/FamilySection";
import HeroSection from "@/components/k-series/HeroSection";

export default function Page({params}) {
    return (
        <>
            {/* <Header14 /> */}
            {/* <main className="">
                <div>{params.year}</div>
            </main> */}
            <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, #b8860b 0%, #d4af37 25%, #f7e9a0 50%, #d4af37 75%, #b8860b 100%)", borderRadius: "2px"}}></div>
            <VideoSection/>
            <HeroSection/>
            <NoteSection/>
            <FamilySection/>

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