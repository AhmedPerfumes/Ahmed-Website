"use client";
import React, { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMenu } from "@/context/MenuContext";
import dynamic from "next/dynamic";

import NewHero from "./NewHero";

// SSR-enabled dynamic imports — keeps content indexable by Google
const TabSlider = dynamic(() => import("./TabSlider"));
const ProductShowcase = dynamic(() => import("./singleProduct/ProductShowcase/ProductShowcase"));
const Section2 = dynamic(() => import("./Section2"));
const NewProductSlider = dynamic(() => import("./NewProductSlider"));
const GiftSetBanner = dynamic(() => import("./GiftSetBanner"));
const NewGiftSection = dynamic(() => import("./NewGiftSection"));
const QualityBoutiqueSection = dynamic(() => import("./QualityBoutiqueSection"));

// ssr:false — browser-only APIs (GSAP ScrollTrigger) or modals
const HorizontalScroll = dynamic(() => import("./HorizontalScroll"), { ssr: false });
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
