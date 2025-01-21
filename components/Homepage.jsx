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
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

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
            autoplay: {
                delay: 5000,
            },
            modules: [Autoplay, Pagination, Navigation],
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            effect: "fade",
            loop: true,
        });

        swiper.on("slideChange", function () {
            const activeIndex = swiper.realIndex;
            updateNavCircle(activeIndex);
        });

        function updateNavCircle(activeIndex) {
            const circles = document.querySelectorAll(
                ".swiper-pagination-horizontal .swiper-pagination-bullet"
            );
            circles.forEach((circle) => {
                circle.classList.remove("swiper-pagination-bullet-active");
            });

            const activeCircle = document.querySelectorAll(
                ".swiper-pagination-horizontal .swiper-pagination-bullet"
            )[activeIndex];
            if (activeCircle) {
                activeCircle.classList.add("swiper-pagination-bullet-active");
            }
        }

        function handleNavCircleClick(index) {
            swiper.slideTo(index);
        }

        const navCircles = document.querySelectorAll(
            ".swiper-pagination-horizontal .swiper-pagination-bullet"
        );
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

            <section
                id="second-chapter-slider"
                className="container flex__column__center"
                data-v-ea8e1c8e=""
            >
                <div
                    className="container-description flex__column__center__bottom flex__g-xxs"
                    data-v-ea8e1c8e=""
                >
                    <h2 className="h1 text-center pt-3">{t("Best Sellers")}</h2>
                    <div className="t__m t__color-blue" data-v-ea8e1c8e="">
                        The atelier is the expression of Atelier Cologne
                        creativity. Inspired by the traditional spirit of
                        cologne, a unique collective of perfume-artists craft
                        new fragrance explorations. They seek to capture the
                        movement of nature and its vibrant beauty through
                        scented expressions of inner emotions. Atelier Cologne
                        surrounds itself with painters, sculptors, designers who
                        express their intimate connection with fragrances
                        through art.
                    </div>
                </div>

                <div
                    className="swiper swiper-initialized swiper-horizontal slider-artist swiper-backface-hidden mySwiper"
                    data-v-8967c2b9=""
                >
                    <div className="swiper-wrapper">
                        {/* First slider */}
                        <div
                            className="swiper-slide slide"
                            data-swiper-slide-index="0"
                            data-v-8967c2b9=""
                            style={{ width: "752px", marginRight: "10px" }}
                        >
                            <div
                                className="container-desktop d-none d-md-block"
                                data-v-8967c2b9=""
                            >
                                <div
                                    className="container-desktop"
                                    data-v-8967c2b9=""
                                >
                                    <div
                                        className="col-left"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="/assets/images/best-sellers/notes/zumar@1x.jpg 1x, /assets/images/best-sellers/notes/zumar@2x.jpg 2x,"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/notes/zumar@2x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <div
                                            className="container-artist flex__column__left"
                                            data-v-8967c2b9=""
                                        >
                                            <div
                                                className="t__h4 t__color-primary t__capitalize"
                                                data-v-8967c2b9=""
                                            >
                                                Orange Sanguine
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                as painted by Geoffroy Pithon
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="/assets/images/best-sellers/zumar.jpg"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/zumar.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                            className="btn-classic"
                                            data-v-8967c2b9=""
                                            data-v-7aa9e1a2=""
                                        >
                                            <span data-v-7aa9e1a2="">
                                                Discover
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                data-v-8967c2b9=""
                                className="container-mobile d-block d-sm-none"
                            >
                                <div
                                    data-v-8967c2b9=""
                                    className="container-images"
                                >
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-artist"
                                        srcSet="/assets/images/best-sellers/notes/zumar@1x.jpg 1x, /assets/images/best-sellers/notes/zumar@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/notes/zumar@2x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-1/carousel-product-1-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-1/carousel-product-1-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/zumar.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div
                                    data-v-8967c2b9=""
                                    className="container-artist flex__column__left"
                                >
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__h4 t__color-primary t__capitalize"
                                    >
                                        Orange Sanguine
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        as painted by Geoffroy Pithon
                                    </div>
                                </div>
                                <button
                                    data-v-7aa9e1a2=""
                                    data-v-8967c2b9=""
                                    className="btn-classic"
                                >
                                    <span data-v-7aa9e1a2="">Discover</span>
                                </button>
                            </div>
                        </div>
                        {/* First slider */}

                        {/* Second slider */}
                        <div
                            className="swiper-slide slide"
                            data-swiper-slide-index="1"
                            data-v-8967c2b9=""
                            style={{ width: "752px", marginRight: "10px" }}
                        >
                            <div
                                className="container-desktop d-none d-md-block"
                                data-v-8967c2b9=""
                            >
                                <div
                                    className="container-desktop"
                                    data-v-8967c2b9=""
                                >
                                    <div
                                        className="col-left"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-artist-2-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-artist-2-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-artist-2-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <div
                                            className="container-artist flex__column__left"
                                            data-v-8967c2b9=""
                                        >
                                            <div
                                                className="t__h4 t__color-primary t__capitalize"
                                                data-v-8967c2b9=""
                                            >
                                                Oolang Infini
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                as painted by Gabrielle Rul
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-product-2-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-product-2-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-product-2-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                            className="btn-classic"
                                            data-v-8967c2b9=""
                                            data-v-7aa9e1a2=""
                                        >
                                            <span data-v-7aa9e1a2="">
                                                Discover
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                data-v-8967c2b9=""
                                className="container-mobile d-block d-sm-none"
                            >
                                <div
                                    data-v-8967c2b9=""
                                    className="container-images"
                                >
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-artist"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-artist-2-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-artist-2-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-artist-2-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-product-2-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-product-2-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-2/carousel-product-2-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div
                                    data-v-8967c2b9=""
                                    className="container-artist flex__column__left"
                                >
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__h4 t__color-primary t__capitalize"
                                    >
                                        Oolang Infini
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        as painted by Gabrielle Rul
                                    </div>
                                </div>
                                <button
                                    data-v-7aa9e1a2=""
                                    data-v-8967c2b9=""
                                    className="btn-classic"
                                >
                                    <span data-v-7aa9e1a2="">Discover</span>
                                </button>
                            </div>
                        </div>
                        {/* Second slider */}

                        {/* Third slider */}
                        <div
                            className="swiper-slide slide"
                            data-swiper-slide-index="2"
                            data-v-8967c2b9=""
                            style={{ width: "752px", marginRight: "10px" }}
                        >
                            <div
                                className="container-desktop d-none d-md-block"
                                data-v-8967c2b9=""
                            >
                                <div
                                    className="container-desktop"
                                    data-v-8967c2b9=""
                                >
                                    <div
                                        className="col-left"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-artist-3-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-artist-3-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-artist-3-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <div
                                            className="container-artist flex__column__left"
                                            data-v-8967c2b9=""
                                        >
                                            <div
                                                className="t__h4 t__color-primary t__capitalize"
                                                data-v-8967c2b9=""
                                            >
                                                Rose Cuirée
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                as painted by Ziling Wang
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-product-3-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-product-3-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-product-3-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                            className="btn-classic"
                                            data-v-8967c2b9=""
                                            data-v-7aa9e1a2=""
                                        >
                                            <span data-v-7aa9e1a2="">
                                                Discover
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                data-v-8967c2b9=""
                                className="container-mobile d-block d-sm-none"
                            >
                                <div
                                    data-v-8967c2b9=""
                                    className="container-images"
                                >
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-artist"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-artist-3-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-artist-3-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-artist-3-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-product-3-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-product-3-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-3/carousel-product-3-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div
                                    data-v-8967c2b9=""
                                    className="container-artist flex__column__left"
                                >
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__h4 t__color-primary t__capitalize"
                                    >
                                        Rose Cuirée
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        as painted by Ziling Wang
                                    </div>
                                </div>
                                <button
                                    data-v-7aa9e1a2=""
                                    data-v-8967c2b9=""
                                    className="btn-classic"
                                >
                                    <span data-v-7aa9e1a2="">Discover</span>
                                </button>
                            </div>
                        </div>
                        {/* Third slider */}

                        {/* Fourth slider */}
                        <div
                            className="swiper-slide slide"
                            data-swiper-slide-index="3"
                            data-v-8967c2b9=""
                            style={{ width: "752px", marginRight: "10px" }}
                        >
                            <div
                                className="container-desktop d-none d-md-block"
                                data-v-8967c2b9=""
                            >
                                <div
                                    className="container-desktop"
                                    data-v-8967c2b9=""
                                >
                                    <div
                                        className="col-left"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-artist-4-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-artist-4-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-artist-4-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <div
                                            className="container-artist flex__column__left"
                                            data-v-8967c2b9=""
                                        >
                                            <div
                                                className="t__h4 t__color-primary t__capitalize"
                                                data-v-8967c2b9=""
                                            >
                                                Gaïac Eternel
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                as painted by Zoé Rumeau
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-product-4-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-product-4-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-product-4-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                            className="btn-classic"
                                            data-v-8967c2b9=""
                                            data-v-7aa9e1a2=""
                                        >
                                            <span data-v-7aa9e1a2="">
                                                Discover
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                data-v-8967c2b9=""
                                className="container-mobile d-block d-sm-none"
                            >
                                <div
                                    data-v-8967c2b9=""
                                    className="container-images"
                                >
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-artist"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-artist-4-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-artist-4-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-artist-4-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-product-4-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-product-4-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-4/carousel-product-4-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div
                                    data-v-8967c2b9=""
                                    className="container-artist flex__column__left"
                                >
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__h4 t__color-primary t__capitalize"
                                    >
                                        Gaïac Eternel
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        as painted by Zoé Rumeau
                                    </div>
                                </div>
                                <button
                                    data-v-7aa9e1a2=""
                                    data-v-8967c2b9=""
                                    className="btn-classic"
                                >
                                    <span data-v-7aa9e1a2="">Discover</span>
                                </button>
                            </div>
                        </div>
                        {/* Fourth slider */}

                        {/* Fifth slider */}
                        <div
                            className="swiper-slide slide"
                            data-swiper-slide-index="4"
                            data-v-8967c2b9=""
                            style={{ width: "752px", marginRight: "10px" }}
                        >
                            <div
                                className="container-desktop d-none d-md-block"
                                data-v-8967c2b9=""
                            >
                                <div
                                    className="container-desktop"
                                    data-v-8967c2b9=""
                                >
                                    <div
                                        className="col-left"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-artist-5-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-artist-5-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-artist-5-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <div
                                            className="container-artist flex__column__left"
                                            data-v-8967c2b9=""
                                        >
                                            <div
                                                className="t__h4 t__color-primary t__capitalize"
                                                data-v-8967c2b9=""
                                            >
                                                Trèfle Pur
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                Sculptured by Victoire de
                                                Lencquesaing
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-product-5-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-product-5-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-product-5-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                            className="btn-classic"
                                            data-v-8967c2b9=""
                                            data-v-7aa9e1a2=""
                                        >
                                            <span data-v-7aa9e1a2="">
                                                Discover
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                data-v-8967c2b9=""
                                className="container-mobile d-block d-sm-none"
                            >
                                <div
                                    data-v-8967c2b9=""
                                    className="container-images"
                                >
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-artist"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-artist-5-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-artist-5-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-artist-5-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-product-5-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-product-5-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-5/carousel-product-5-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div
                                    data-v-8967c2b9=""
                                    className="container-artist flex__column__left"
                                >
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__h4 t__color-primary t__capitalize"
                                    >
                                        Trèfle Pur
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        Sculptured by Victoire de Lencquesaing
                                    </div>
                                </div>
                                <button
                                    data-v-7aa9e1a2=""
                                    data-v-8967c2b9=""
                                    className="btn-classic"
                                >
                                    <span data-v-7aa9e1a2="">Discover</span>
                                </button>
                            </div>
                        </div>
                        {/* Fifth slider */}

                        {/* Sixth slider */}
                        <div
                            className="swiper-slide slide"
                            data-swiper-slide-index="5"
                            data-v-8967c2b9=""
                            style={{ width: "752px", marginRight: "10px" }}
                        >
                            <div
                                className="container-desktop d-none d-md-block"
                                data-v-8967c2b9=""
                            >
                                <div
                                    className="container-desktop"
                                    data-v-8967c2b9=""
                                >
                                    <div
                                        className="col-left"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-artist-6-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-artist-6-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-artist-6-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <div
                                            className="container-artist flex__column__left"
                                            data-v-8967c2b9=""
                                        >
                                            <div
                                                className="t__h4 t__color-primary t__capitalize"
                                                data-v-8967c2b9=""
                                            >
                                                Camélia Intrépide
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                Imagined by François Azambourg
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-product-6-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-product-6-desktop@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-product-6-desktop@1x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                            className="btn-classic"
                                            data-v-8967c2b9=""
                                            data-v-7aa9e1a2=""
                                        >
                                            <span data-v-7aa9e1a2="">
                                                Discover
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                data-v-8967c2b9=""
                                className="container-mobile d-block d-sm-none"
                            >
                                <div
                                    data-v-8967c2b9=""
                                    className="container-images"
                                >
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-artist"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-artist-6-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-artist-6-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-artist-6-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-product-6-desktop@1x.jpg 1x, https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-product-6-desktop@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="https://www.ateliercologne.com/images/chapters/second/carousel/artist-6/carousel-product-6-desktop@1x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                </div>
                                <div
                                    data-v-8967c2b9=""
                                    className="container-artist flex__column__left"
                                >
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__h4 t__color-primary t__capitalize"
                                    >
                                        Camélia Intrépide
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        Imagined by François Azambourg
                                    </div>
                                </div>
                                <button
                                    data-v-7aa9e1a2=""
                                    data-v-8967c2b9=""
                                    className="btn-classic"
                                >
                                    <span data-v-7aa9e1a2="">Discover</span>
                                </button>
                            </div>
                        </div>
                        {/* Sixth slider */}
                    </div>

                    {/* Navigation buttons */}
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                    {/* Pagination Bullets */}
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

            <section className="d-flex">
                <div className="w-100 d-flex flex-column">
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
                    </div>
                    <Categories section="section3" />
                </div>
            </section>

            <section className="d-flex flex-column align-items-center">
                <span className="t-subtitle">
                    {t("The perfect gift for every occasion")}
                </span>
                <div className="mt-4 mb-5 d-none d-md-block">
                    <a href={`/${locale}/shop/dakhoon/gift-sets`}>
                        <Image
                            loading="lazy"
                            src="/assets/images/Ihda-khas-giftset.jpg"
                            width="600"
                            height="600"
                            alt="Bakhoor-Ahmed"
                            className="w-50 px-1"
                            style={{ objectFit: "contain" }}
                        />
                    </a>
                    <a href={`/${locale}/shop/dakhoon/gift-sets`}>
                        <Image
                            className="w-50 px-1"
                            src="/assets/images/Antee-05-Giftset.jpg"
                            width="600"
                            height="600"
                            alt="Oud-Asateen"
                            style={{ objectFit: "contain" }}
                        />
                    </a>
                </div>

                <div className="mt-4 mb-5 d-block d-sm-none d-flex flex-column">
                    <a href={`/${locale}/shop/dakhoon/gift-sets`}>
                        <Image
                            loading="lazy"
                            src="/assets/images/Ihda-khas-giftset.jpg"
                            width="600"
                            height="600"
                            alt="Bakhoor-Ahmed"
                            className="w-100 px-1"
                            style={{ paddingTop: "1rem", objectFit: "contain" }}
                        />
                    </a>
                    <a href={`/${locale}/shop/dakhoon/gift-sets`}>
                        <Image
                            className="w-100 px-1"
                            src="/assets/images/Antee-05-Giftset.jpg"
                            width="600"
                            height="600"
                            alt="Oud-Asateen"
                            style={{ paddingTop: "1rem", objectFit: "contain" }}
                        />
                    </a>
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
