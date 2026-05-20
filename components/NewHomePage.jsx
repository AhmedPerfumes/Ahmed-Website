"use client";
import React, { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import NewHero from "./NewHero";
import TabSlider from "./TabSlider";
import ProductShowcase from "./singleProduct/ProductShowcase/ProductShowcase";
import NewProductSlider from "./NewProductSlider";
import NewGiftSection from "./NewGiftSection";
import GiftSetBanner from "./GiftSetBanner";
import DakhoonSection from "./Section1";
import Section2 from "./Section2";
import HorizontalScroll from "./HorizontalScroll";
import QualityBoutiqueSection from "./QualityBoutiqueSection";
import NewsLetter from "./modals/NewsLetter";
import { useMenu } from "@/context/MenuContext";
import FindYourScentEntry from "./FindYourScent/FindYourScentEntry";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const NewHomePage = () => {
    const { popUp } = useMenu();
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        lenis.on('scroll', ScrollTrigger.update);

        const updateLenis = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(updateLenis);
        };
    }, []);

    return (
        <div style={{ overflowX: "clip", position: "relative" }}>
            <NewsLetter popUp={popUp} />
            <NewHero />
            <TabSlider />
            <ProductShowcase />
            <Section2 />
            <NewProductSlider />
            <NewGiftSection />
            <FindYourScentEntry />
            <HorizontalScroll />
            <GiftSetBanner />
            <DakhoonSection />
            <QualityBoutiqueSection/>
        </div>
    );
};

export default NewHomePage;
