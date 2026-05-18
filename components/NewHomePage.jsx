"use client";
import React, { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMenu } from "@/context/MenuContext";

import dynamic from "next/dynamic";

import NewHero from "./NewHero";

// Dynamic imports for below-fold components to improve PageSpeed performance
const TabSlider = dynamic(() => import("./TabSlider"), { ssr: false });
const ProductShowcase = dynamic(() => import("./singleProduct/ProductShowcase/ProductShowcase"), { ssr: false });
const Section2 = dynamic(() => import("./Section2"), { ssr: false });
const NewProductSlider = dynamic(() => import("./NewProductSlider"), { ssr: false });
const GiftSetBanner = dynamic(() => import("./GiftSetBanner"), { ssr: false });
const NewGiftSection = dynamic(() => import("./NewGiftSection"), { ssr: false });
const HorizontalScroll = dynamic(() => import("./HorizontalScroll"), { ssr: false });
const QualityBoutiqueSection = dynamic(() => import("./QualityBoutiqueSection"), { ssr: false });
const NewsLetter = dynamic(() => import("./modals/NewsLetter"), { ssr: false });

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const NewHomePage = () => {
    const { popUp } = useMenu();
    useEffect(() => {
        let lenis;
        let rafId;

        const initLenis = () => {
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
        };

        // Defer to after first paint to keep main thread free
        if (typeof requestIdleCallback !== 'undefined') {
            rafId = requestIdleCallback(initLenis, { timeout: 2000 });
        } else {
            rafId = setTimeout(initLenis, 200);
        }

        return () => {
            if (typeof cancelIdleCallback !== 'undefined') {
                cancelIdleCallback(rafId);
            } else {
                clearTimeout(rafId);
            }
            if (lenis) {
                lenis.destroy();
                gsap.ticker.remove((time) => lenis.raf(time * 1000));
            }
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
            <GiftSetBanner />
            <NewGiftSection />
            <HorizontalScroll />
            <QualityBoutiqueSection/>
        </div>
    );
};

export default NewHomePage;
