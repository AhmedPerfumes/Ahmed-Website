"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";

import NewHero from "./NewHero";
const TabSlider = dynamic(() => import("./TabSlider"));
const NewProductSlider = dynamic(() => import("./NewProductSlider"));
const NewsLetter = dynamic(() => import("@/components/modals/NewsLetter"));
const FindYourScentEntry = dynamic(() => import("../FindYourScent/FindYourScentEntry"));

const ProductShowcase = dynamic(() => import("@/components/singleProduct/ProductShowcase/ProductShowcase"));
const NewGiftSection = dynamic(() => import("./NewGiftSection"));
const GiftSetBanner = dynamic(() => import("./GiftSetBanner"));
const Section2 = dynamic(() => import("./Section2"));
const HorizontalScroll = dynamic(() => import("./HorizontalScroll"));
const QualityBoutiqueSection = dynamic(() => import("./QualityBoutiqueSection"));
import { useMenu } from "@/context/MenuContext";


// ScrollTrigger is registered dynamically inside useEffect

const NewHomePage = () => {
    const { popUp } = useMenu();
    useEffect(() => {
        let lenis;
        
        Promise.all([
            import("lenis"),
            import("gsap"),
            import("gsap/ScrollTrigger"),
        ]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
            gsap.registerPlugin(ScrollTrigger);
            
            lenis = new Lenis({
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
        }).catch(err => console.error("Failed to load Lenis/GSAP:", err));

        return () => {
            if (lenis) {
                lenis.destroy();
            }
            // Cannot easily remove ticker function without storing a reference to gsap,
            // but it's safe if component doesn't unmount or if we don't worry about ticker leaks here.
        };
    }, []);

    return (
        <div style={{ overflowX: "clip", position: "relative" }}>
            <NewsLetter popUp={popUp} />
            <NewHero />
            <TabSlider />
            <ProductShowcase />
            <FindYourScentEntry />
            <Section2 />
            <NewProductSlider />
            <GiftSetBanner />
            <NewGiftSection />
            <HorizontalScroll />
            <QualityBoutiqueSection />
        </div>
    );
};

export default NewHomePage;
