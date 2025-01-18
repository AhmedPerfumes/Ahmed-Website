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
                        <div className="d-flex justify-content-center pt-5">
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
                    <Image
                        width={40}
                        height={40}
                        className="bottom-0 scroll-icon"
                        src="/assets/images/ahmed-icon.png"
                        alt="logo Ahmed"
                        loading="lazy"
                    />
                    <span className="text-white text-uppercase mt-2">
                        Scroll to discover
                    </span>
                </div>
            </section>

            <section className="scroll-section ">
                <div className="panel w-100 h-100">
                    <div className="">
                        <h2 className="h1 text-center pt-3">
                            {t("Best Sellers")}
                        </h2>
                        <p className="text-center section-paragraph">
                            {t(
                                "Discover our bestsellers crafted to suit diverse tastes From classics to modern blends each fragrance offers something unique for every scent lover"
                            )}
                        </p>
                    </div>
                    <div>
                        <ProductHero />
                    </div>
                </div>
            </section>

            <section className="scroll-section d-flex flex-direction-column section-2">
                <div className="panel sub-section w-100 vh-100">
                    <div className="section-content">
                        <div className="text-center text-white d-flex justify-content-center">
                            <span className="t-subtitle">
                                {t("WHERE LUXURY MEETS YOUR SENSES")}
                            </span>
                        </div>
                        <h2 className="h1 text-center text-white pt-3">
                            {t("Exclusive Collection")}
                        </h2>
                        <p className="text-center text-white section-paragraph">
                            {t(
                                "Explore our exclusive collection of refined scents, made with the finest ingredients. Elegant and original, each fragrance complements your style"
                            )}
                        </p>
                        <div className="d-flex justify-content-center pt-5">
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
                    <Image
                        width={40}
                        height={40}
                        className="bottom-0 scroll-icon"
                        src="/assets/images/ahmed-icon.png"
                        alt="logo Ahmed"
                        loading="lazy"
                    />
                    <span className="text-white text-uppercase mt-2">
                        Scroll to discover
                    </span>
                </div>
            </section>

            <section className="scroll-section d-flex flex-direction-column section-3">
                <div className="panel w-100 h-100">
                    <div className="section-content">
                        <div
                            className="d-flex flex-column justify-content-around
        gap-5"
                        >
                            <div className="section-head">
                                <h2 className=" text-center">
                                    {t("Crafted for The ")}
                                    <br />
                                    <span className="text-italic">
                                        {t("discerning")}
                                    </span>
                                </h2>
                                <p className="text-center section-paragraph">
                                    {t(
                                        "Explore our exclusive collection of refined scents, made with the finest ingredients. "
                                    )}
                                    <br />{" "}
                                    {t(
                                        "Elegant and original, each fragrance complements your style"
                                    )}
                                </p>
                            </div>
                            <div className="videoarea d-block d-lg-block">
                                <VideoPanel src="/assets/videos/multi-product.mp4" />
                            </div>
                            <div className="videoarea d-block d-lg-none">
                                <VideoPanel src="/assets/videos/multi-product-mobile.mp4" />
                            </div>
                            <div className="d-flex justify-content-center pt-5">
                                <Link
                                    href="/shop"
                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium "
                                >
                                    Discover Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="scroll-section d-flex flex-direction-column section-4">
                <div className="panel sub-section w-100 vh-100">
                    <div className="section-content">
                        <div className="text-center text-white d-flex justify-content-center">
                            <span className="t-subtitle">
                                {t("Elegant Treasures for Every Occasion")}
                            </span>
                        </div>
                        <h2 className="h1 text-center text-white pt-3">
                            {t("The Art of Gifting")}
                        </h2>
                        <p className="text-center text-white section-paragraph">
                            {t(
                                "Celebrate special moments with our curated fragrance gift sets Beautifully presented and featuring our finest scents they make the perfect gift for any occasion"
                            )}
                        </p>
                        <div className="d-flex justify-content-center pt-5">
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
                    <Image
                        width={40}
                        height={40}
                        className="bottom-0 scroll-icon"
                        src="/assets/images/ahmed-icon.png"
                        alt="logo Ahmed"
                        loading="lazy"
                    />
                    <span className="text-white text-uppercase mt-2">
                        Scroll to discover
                    </span>
                </div>
            </section>
            <section className="d-flex flex-direction-column section-5">
                <div className="panel ">
                    <div className="d-flex flex-column justify-content-around gap-5">
                        <div className="section-head">
                            <h2 className=" text-center pt-5">
                                {t("Crafted for The ")}
                                <br />
                                <span className="text-italic">
                                    {t("discerning")}
                                </span>
                            </h2>
                            <p className="text-center section-paragraph">
                                {t(
                                    "Explore our exclusive collection of refined scents, made with the finest ingredients. Elegant and original, each fragrance complements your style"
                                )}
                            </p>
                        </div>
                        <Categories />
                        {/* <Lookbook /> */}
                        <div className="section-head d-flex flex-column align-items-center justify-content-center">
                            {/* <h4 className="text-center">
                                {t("The perfect gift for every occasion")}
                            </h4> */}
                            <span className="t-subtitle">
                                {t("The perfect gift for every occasion")}
                            </span>
                            <div className="mt-4 mb-5">
                                <a href={`/${locale}/shop/dakhoon/gift-sets`}>
                                    <Image
                                        loading="lazy"
                                        src="/assets/images/Ihda-khas-giftset.jpg"
                                        width="600"
                                        height="600"
                                        alt="Bakhoor-Ahmed"
                                        className="w-50 px-1"
                                    />
                                </a>
                                <a href={`/${locale}/shop/dakhoon/gift-sets`}>
                                    <Image
                                        className="w-50 px-1"
                                        src="/assets/images/Antee-05-Giftset.jpg"
                                        width="600"
                                        height="600"
                                        alt="Oud-Asateen"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="scroll-section d-flex flex-direction-column section-6">
                <div className="panel w-100 vh-100">
                    <div className="section-content">
                        <div className="text-center text-white d-flex justify-content-center">
                            <span className="t-subtitle">
                                {t("WHERE LUXURY MEETS YOUR SENSES")}
                            </span>
                        </div>
                        <h2 className="h1 text-center text-white pt-3">
                            {t("Exclusive Collection")}
                        </h2>
                        <p className="text-center text-white section-paragraph">
                            {t(
                                "Explore our exclusive collection of refined scents, made with the finest ingredients. Elegant and original, each fragrance complements your style"
                            )}
                        </p>
                        <div className="d-flex justify-content-center pt-5">
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
                    <Image
                        width={40}
                        height={40}
                        className="bottom-0 scroll-icon"
                        src="/assets/images/ahmed-icon.png"
                        alt="logo Ahmed"
                        loading="lazy"
                    />
                    <span className="text-white text-uppercase mt-2">
                        Scroll to discover
                    </span>
                </div>
            </section>

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
                            </h3>
                            <p className="text-center px-3">{t("Step into")}</p>

                            <div className="mt-5">
                                <a
                                    href={`/${locale}/shop/dakhoon/bakhoor/bakhoor-ahmed-40-tabs`}
                                >
                                    <Image
                                        loading="lazy"
                                        src="/assets/images/home/demo8/Bakhoor-Ahmed.jpg"
                                        width="600"
                                        height="600"
                                        alt="Bakhoor-Ahmed"
                                        className="w-50 px-1"
                                    />
                                </a>
                                <a
                                    href={`/${locale}/shop/dakhoon/oud-maattar/oud-mtr-asaateen`}
                                >
                                    <Image
                                        className="w-50 px-1"
                                        src="/assets/images/home/demo8/Oud-Asateen.jpg"
                                        width="600"
                                        height="600"
                                        alt="Oud-Asateen"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="inner2 mt-5">
                        <Categories />
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
