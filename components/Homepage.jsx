"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import Hero from "@/components/homes/home-8/Hero";
import ProductHero from "@/components/homes/home-5/Hero";
import {
    KeyboardArrowLeftRounded,
    KeyboardArrowRightRounded,
} from "@mui/icons-material";
import "./HomePage.css";
import Swiper from "swiper";
import VideoPanel from "./VideoPanel";
import Categories from "@/components/homes/home-15/Categories";
import Lookbook from "@/components/homes/home-9/Lookbook";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const ScrollSnapHorizontalBootstrap = () => {
    const locale = useLocale();
    const t = useTranslations();
    useEffect(() => {
        const sections = gsap.utils.toArray(".scroll-section");
        const panels = gsap.utils.toArray(".horizontal-scroll .panel");

        // Vertical snapping logic for all sections
        sections.forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: true,
                snap: {
                    snapTo: 1, // Snap to the nearest section immediately
                    duration: 0.4, // Very short duration for snapping
                    ease: "power1.inOut", // No easing for instant snapping
                    delay: 0, // Remove additional delay
                    inertia: false, // Disable inertia for quicker snapping
                },
                onEnter: () => console.log(`Entering section ${i + 1}`),
                onLeaveBack: () => console.log(`Leaving section ${i + 1}`),
            });
        });
        const swiper = new Swiper(".mySwiper", {
            navigation: {
                nextEl: ".swiper-next-button",
                prevEl: ".swiper-prev-button",
            },
            effect: "fade",
            loop: true,
        });

        swiper.on("slideChange", function (sld) {
            document.body.setAttribute("data-sld", sld.realIndex);
        });

        swiper.on("slideChange", function () {
            const activeIndex = swiper.realIndex;
            updateNavCircle(activeIndex);
        });

        function updateNavCircle(activeIndex) {
            const circles = document.querySelectorAll(".nav-circle");
            circles.forEach((circle) => {
                circle.classList.remove("active");
            });

            const activeCircle =
                document.querySelectorAll(".nav-circle")[activeIndex];
            if (activeCircle) {
                activeCircle.classList.add("active");
            }
        }

        function handleNavCircleClick(index) {
            swiper.slideTo(index);
        }

        const navCircles = document.querySelectorAll(".nav-circle");
        navCircles.forEach((circle, index) => {
            circle.addEventListener("click", () => handleNavCircleClick(index));
        });
        // Horizontal scrolling within `.horizontal-scroll`
        gsap.to(panels, {
            xPercent: -100 * (panels.length - 1), // Move horizontally based on panels
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".horizontal-scroll",
                start: "top top",
                end: `+=${panels.length * window.innerWidth}`, // Adjust end dynamically
                scrub: true, // Smooth scrolling
                snap: {
                    snapTo: 0.3, // Snap to the nearest section immediately
                    duration: 0.8, // Very short duration for snapping
                    delay: 0.1, // Remove additional delay
                },
                pin: true, // Pin during horizontal scroll
                anticipatePin: 1, // Smooth pinning transition
            },
        });

        return () => {
            // Cleanup all ScrollTriggers
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div id="main" className="">
            {/* Vertical Section 1 */}
            <section className="scroll-section d-flex flex-direction-column">
                <div className="panel section-slider w-100 vh-100">
                    <Hero />
                </div>
            </section>

            <section className="scroll-section d-flex flex-direction-column section-1">
                <div className="panel section-slider w-100 vh-100">
                    <div className="section-content">
                        <div className="text-center text-white d-flex justify-content-center">
                            <span className="t-subtitle">
                        {t("Signature Selections")}
                        </span>
                        </div>
                        <h2 className="h1 text-center text-white pt-3">
                        {t("Fragrances Adored by All")}
                        </h2>
                        <p className="text-center text-white section-paragraph">
                        {t(
                            "Discover our bestsellers crafted to suit diverse tastes From classics to modern blends each fragrance offers something unique for every scent lover"
                        )}
                        </p>
                        <div className="d-flex justify-content-center">
                        <Link
                href="/shop"
                className="btn-link btn-link_lg default-underline text-uppercase fw-medium text-white"
              >
                Discover Now
              </Link>
              </div>
                    </div>
                </div>
                <div className="bottom-scroll">
                    <Image width={40} height={40} className="bottom-0 scroll-icon" src="/assets/images/ahmed-icon.png" alt="logo Ahmed" loading="lazy" />
                    <span className="text-white text-uppercase mt-2">Scroll to discover</span>
                </div>
            </section>

            {/* <section className="scroll-section d-flex flex-direction-column">
                <div className="panel section-slider w-100 vh-100">
                    <ProductHero />
                </div>
            </section> */}

            {/* Horizontal Scrolling Section */}
            <section className="horizontal-scroll d-flex flex-row w-100 vh-100">
                <div className="panel w-100 vh-100 d-flex justify-content-center align-items-center">
                    <div className="inner">
                        <div className="panel2 mb-4">
                            <div className="inner2 mt-5 d-flex align-items-center">
                                {/* Iconic indulgence */}
                                <Categories section="section4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel w-100 vh-100 d-flex justify-content-center align-items-center">
                    <div className="inner">
                        <VideoPanel src="/assets/videos/zumar-video.mp4" />
                    </div>
                </div>
                <div className="panel w-100 vh-100 d-flex justify-content-center align-items-center">
                    <div className="inner">
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <h3 className="text-center">
                                {t("Essence of Arabia")}
                                {/* Carefully <span className="s-font">selected ingredients</span> */}
                            </h3>
                            <p className="text-center px-3">{t("Step into")}</p>
                            <div className="mt-4">
                                <a
                                    href={`/${locale}/shop/dakhoon/bakhoor/bakhoor-ahmed-40-tabs`}
                                >
                                    {/* <img
                                        className="w-50 px-1"
                                        src=""
                                        alt="Image 1"
                                    /> */}
                                    <Image
                                        loading="lazy"
                                        src="/assets/images/home/demo8/Bakhoor-Ahmed.jpg"
                                        width="400"
                                        height="1000"
                                        alt="AhmedIcon"
                                        className="w-50 px-1"
                                    />
                                </a>
                                <a
                                    href={`/${locale}/shop/dakhoon/oud-maattar/oud-mtr-asaateen`}
                                >
                                    <img
                                        className="w-50 px-1"
                                        src="/assets/images/home/demo8/Oud-Asateen.jpg"
                                        alt="Image 1"
                                    />
                                </a>
                            </div>
                        </div>
                        <div className="inner2 mt-5">
                            <Categories />
                        </div>
                    </div>
                </div>
                <div className="panel w-100 vh-100 d-flex justify-content-center align-items-center">
                    <div className="inner text-center pt-5 mt-4">
                        <h1>Reaching Every Corner of the World</h1>
                        <p className="fs-5">
                            Ahmed Al Maghribi Perfumes proudly spans over 91
                            countries, sharing our luxurious fragrances with the
                            world. With an unwavering commitment to
                            craftsmanship and excellence, our signature scents
                            are now available for global distribution, spreading
                            the essence of timeless luxury and rich tradition to
                            every corner of the globe.
                        </p>

                        <div className="row">
                            <div className="col-6">
                                <a href={`/${locale}/export`}>
                                    <img
                                        src="assets/images/home/demo8/export/aqua-oud.jpg"
                                        alt=""
                                        className="img-fluid"
                                    />
                                </a>
                            </div>
                            <div className="col-6">
                                <a href={`/${locale}/export`}>
                                    <img
                                        src="assets/images/home/demo8/export/endless.jpg"
                                        alt=""
                                        className="img-fluid"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vertical Section 3 */}
            <section className="scroll-section">
                <div className="panel orange w-100 vh-100"></div>
            </section>

            {/* Vertical Section 4 */}
            <section className="scroll-section">
                <div className="panel blue w-100 vh-100"></div>
            </section>
        </div>
    );
};

export default ScrollSnapHorizontalBootstrap;
