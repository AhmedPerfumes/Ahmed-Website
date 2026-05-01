"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Categories from "@/components/homes/home-15/Categories";

gsap.registerPlugin(ScrollTrigger);

const HorizontalScroll = () => {
    const locale = useLocale();
    const t = useTranslations();
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const panels = gsap.utils.toArray(".panel2");
            if (panels.length > 0) {
                gsap.to(panels, {
                    xPercent: locale === "en" ? -100 * (panels.length - 1) : 100 * (panels.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: () => `+=${panels.length * window.innerWidth}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [locale]);

    return (
        <section ref={containerRef} className="cont testsect">
            {/* Slide 1: Iconic Indulgence */}
            <div className="panel2 mb-4">
                <div className="inner2 mt-5 d-flex align-items-center">
                    <Categories section="section4" />
                </div>
            </div>

            {/* Slide 2: K-Series Video */}
            <div className="panel2 mt-5">
                <div className="inner2">
                    <div className="youtube-wrapper">
                        <iframe
                            src="https://www.youtube.com/embed/gf0kYWgy-58?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=gf0kYWgy-58&modestbranding=1&rel=0"
                            title="K - Series"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>

            {/* Slide 3: Luxury Delight */}
            <div className="panel2 mt-5">
                <div className="inner2 d-flex flex-column align-items-center">
                    <Categories />
                </div>
            </div>

            {/* Slide 4: Essence of Arabia / Bakhoor */}
            <div className="panel2 mt-5">
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <h3 className="section-head section-title text-uppercase fs-25 fw-medium text-center mb-2">
                        {t("Essence of Arabia")}
                    </h3>
                    <p className="text-center section-paragraph pb-3">
                        {t("Step into")}
                    </p>
                    <Link
                        href={`/${locale}/shop/dakhoon`}
                        className="btn-rounded btn-link_lg text-uppercase fw-medium"
                    >
                        {t("Discover")}
                    </Link>
                </div>
                <div className="inner2 mt-4 d-flex align-items-center">
                    <Link href={`/${locale}/shop/dakhoon/bakhoor/bakhoor-ahmed-40-tabs`}>
                        <Image
                            width={0}
                            height={0}
                            sizes="100%"
                            className="w-100"
                            src="/assets/images/bakhoor-ahmed.jpg"
                            alt="Bakhoor Ahmed"
                            loading="lazy"
                            style={{ width: "100%", height: "auto" }}
                        />
                    </Link>
                    <Link href={`/${locale}/shop/dakhoon/oud-maattar/oud-kiflain`}>
                        <Image
                            width={0}
                            height={0}
                            sizes="100%"
                            className="w-100"
                            src="/assets/images/oud-kiflain.jpg"
                            alt="Oud Kiflain"
                            loading="lazy"
                            style={{ width: "100%", height: "auto" }}
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HorizontalScroll;
