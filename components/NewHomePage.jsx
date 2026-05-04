"use client";
import React from "react";
import NewHero from "./NewHero";
import TabSlider from "./TabSlider";
import ProductShowcase from "./singleProduct/ProductShowcase/ProductShowcase";
import NewProductSlider from "./NewProductSlider";
import NewGiftSection from "./NewGiftSection";
import GiftSetBanner from "./GiftSetBanner";
import DakhoonSection from "./Section1";
import Section2 from "./Section2";
import HorizontalScroll from "./HorizontalScroll";

const NewHomePage = () => {
    return (
        <div style={{ overflowX: "hidden", position: "relative" }}>
            <NewHero />
            <TabSlider />
            <ProductShowcase />
            <Section2 />
            <NewProductSlider />
            <NewGiftSection />
            <HorizontalScroll />
            <GiftSetBanner />
            <DakhoonSection />
        </div>
    );
};

export default NewHomePage;
