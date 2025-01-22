"use client";

import { useEffect, useState } from "react";
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
import 'swiper/css/pagination';
import { Autoplay, Pagination, Navigation } from "swiper/modules";

gsap.registerPlugin(ScrollTrigger);

const ScrollSnapHorizontalBootstrap = () => {
    const locale = useLocale();
    const t = useTranslations();

    const [isMobile, setIsMobile] = useState(null);

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
                // snap: {
                //     snapTo: 1, // Snap to the nearest section immediately
                //     duration: 0.4, // Very short duration for snapping
                //     ease: "power1.inOut", // No easing for instant snapping
                //     delay: 0, // Remove additional delay
                //     inertia: false, // Disable inertia for quicker snapping
                // },
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

        // swiper.on("slideChange", function () {
        //     const activeIndex = swiper.realIndex;
        //     updateNavCircle(activeIndex);
        // });

        // function updateNavCircle(activeIndex) {
        //     const circles = document.querySelectorAll(".swiper-pagination-horizontal .swiper-pagination-bullet");
        //     circles.forEach((circle) => {
        //         circle.classList.remove("swiper-pagination-bullet-active");
        //     });

        //     const activeCircle = document.querySelectorAll(".swiper-pagination-horizontal .swiper-pagination-bullet")[activeIndex];
        //     if (activeCircle) {
        //         activeCircle.classList.add("swiper-pagination-bullet-active");
        //     }
        // }

        // function handleNavCircleClick(index) {
        //     swiper.slideTo(index);
        // }

        // const navCircles = document.querySelectorAll(".swiper-pagination-horizontal .swiper-pagination-bullet");
        // navCircles.forEach((circle, index) => {
        //     circle.addEventListener("click", () => handleNavCircleClick(index));
        // });
        // Horizontal scrolling within `.horizontal-scroll`
        gsap.to(panels, {
            xPercent: locale == "en"
            ? -100 * (panels.length - 1)
            : 100 * (panels.length - 1), // Move horizontally based on panels
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".horizontal-scroll",
                start: "top top",
                end: `+=${panels.length * window.innerWidth}`, // Adjust end dynamically
                scrub: true, // Smooth scrolling

                pin: true, // Pin during horizontal scroll
                // anticipatePin: 1, // Smooth pinning transition
            },
        });

        // const mobilepanel = gsap.utils.toArray(".mobilecontainer .mobilepanel");
        //     if (mobilepanel.length > 0) {
        //     const mobilepanelTween = gsap.to(mobilepanel, {
        //         xPercent:
        //         locale == "en"
        //             ? -100 * (mobilepanel.length - 1)
        //             : 100 * (panels.length - 1),
        //         ease: "none",
        //         scrollTrigger: {
        //         trigger: ".mobilecontainer",
        //         start: "top top",
        //         end: "+=" + window.innerWidth * 3,
        //         pin: true,
        //         scrub: 3,
        //         },
        //     });
        //     }

        const isMobileDevice = () => {
            return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          };
      
          setIsMobile(isMobileDevice());

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
                                href={`/${locale}/shop`}
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

            {/* <section className="scroll-section ">
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
            </section> */}

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
                    Discover our best-selling perfumes, loved for their captivating aromas and lasting impressions. From floral elegance to bold, woody notes, each fragrance is crafted to perfection, making them timeless favorites.
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
                                            srcSet="/assets/images/best-sellers/notes/zumar@1x.jpg 1x, /assets/images/best-sellers/notes/zumar@2x.jpg 2x"
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
                                                className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                                data-v-8967c2b9=""
                                            >
                                                Zumar
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                {/* as painted by Geoffroy Pithon */}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="/assets/images/best-sellers/zumar@1x.jpg 1x, /assets/images/best-sellers/zumar@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/zumar@2x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                            className="btn-classic"
                                            data-v-8967c2b9=""
                                            data-v-7aa9e1a2=""
                                            onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/oriental-fragrance/zumar")}
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
                                        srcSet="/assets/images/best-sellers/zumar@1x.jpg 1x, /assets/images/best-sellers/zumar@2x.jpg 2x"
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
                                        className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                    >
                                        Zumar
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        {/* as painted by Geoffroy Pithon */}
                                    </div>
                                </div>
                                <button
                                onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/oriental-fragrance/zumar")}
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
                                            srcSet="/assets/images/best-sellers/notes/binshaikh@1x.jpg 1x, /assets/images/best-sellers/notes/binshaikh@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/notes/binshaikh@2x.jpg"
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
                                                className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                                data-v-8967c2b9=""
                                            >
                                                Bin Shaikh
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                {/* as painted by Gabrielle Rul */}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="/assets/images/best-sellers/bin-shaikh@1x.jpg 1x, /assets/images/best-sellers/bin-shaikh@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/bin-shaikh@2x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                        onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/oriental-fragrance/bin-shaikh")}
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
                                        srcSet="/assets/images/best-sellers/notes/binshaikh@1x.jpg 1x, /assets/images/best-sellers/notes/binshaikh@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/notes/binshaikh@2x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="/assets/images/best-sellers/bin-shaikh@1x.jpg 1x, /assets/images/best-sellers/bin-shaikh@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/bin-shaikh@1x.jpg"
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
                                        className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                    >
                                        Bin Shaikh
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        {/* as painted by Gabrielle Rul */}
                                    </div>
                                </div>
                                <button
                                onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/oriental-fragrance/bin-shaikh")}
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
                                            srcSet="/assets/images/best-sellers/notes/ignite-oud@1x.jpg 1x, /assets/images/best-sellers/notes/ignite-oud@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/notes/ignite-oud@2x.jpg"
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
                                                className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                                data-v-8967c2b9=""
                                            >
                                                Ignite Oud
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                {/* as painted by Ziling Wang */}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="/assets/images/best-sellers/ignite-oud@1x.jpg 1x, /assets/images/best-sellers/ignite-oud@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/ignite-oud@2x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                        onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/occidental-fragrance/ignite-oud")}
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
                                        srcSet="/assets/images/best-sellers/notes/ignite-oud@1x.jpg 1x, /assets/images/best-sellers/notes/ignite-oud@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/notes/ignite-oud@2x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="/assets/images/best-sellers/ignite-oud@1x.jpg 1x, /assets/images/best-sellers/ignite-oud@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/ignite-oud@1x.jpg"
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
                                        className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                    >
                                        Ignite Oud
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        {/* as painted by Ziling Wang */}
                                    </div>
                                </div>
                                <button
                                  onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/occidental-fragrance/ignite-oud")}
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
                                            srcSet="/assets/images/best-sellers/notes/marj@1x.jpg 1x, /assets/images/best-sellers/notes/marj@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/notes/marj@2x.jpg"
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
                                                className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                                data-v-8967c2b9=""
                                            >
                                                Marj
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                {/* s painted by Zoé Rumeau */}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="/assets/images/best-sellers/marj@1x.jpg 1x, /assets/images/best-sellers/marj@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/marj@2x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                        onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/oriental-fragrance/marj")}
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
                                        srcSet="/assets/images/best-sellers/notes/marj@1x.jpg 1x, /assets/images/best-sellers/notes/marj@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/notes/marj@2x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="/assets/images/best-sellers/marj@1x.jpg 1x, /assets/images/best-sellers/marj@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/marj@1x.jpg"
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
                                        className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                    >
                                      Marj
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        {/* as painted by Zoé Rumeau */}
                                    </div>
                                </div>
                                <button
                                onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/oriental-fragrance/marj")}
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
                                            srcSet="/assets/images/best-sellers/notes/oud-and-rose@1x.jpg 1x, /assets/images/best-sellers/notes/oud-and-rose@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/notes/oud-and-rose@2x.jpg"
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
                                                className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                                data-v-8967c2b9=""
                                            >
                                                Oud & Roses
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                {/* as painted by Zoé Rumeau */}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="/assets/images/best-sellers/oud-and-roses@1x.jpg 1x, /assets/images/best-sellers/oud-and-roses@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/oud-and-roses@2x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                        onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/occidental-fragrance/oud-roses")}
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
                                        srcSet="/assets/images/best-sellers/notes/oud-and-rose@1x.jpg 1x, /assets/images/best-sellers/notes/oud-and-rose@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/notes/oud-and-rose@2x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="/assets/images/best-sellers/oud-and-roses@1x.jpg 1x, /assets/images/best-sellers/oud-and-roses@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/oud-and-roses@1x.jpg"
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
                                        className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                    >
                                        Oud & Roses
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        {/* Sculptured by Victoire de Lencquesaing */}
                                    </div>
                                </div>
                                <button
                                 onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/occidental-fragrance/oud-roses")}
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
                                            srcSet="/assets/images/best-sellers/notes/kaaf@1x.jpg 1x, /assets/images/best-sellers/notes/kaaf@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/notes/kaaf@2x.jpg"
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
                                                className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                                data-v-8967c2b9=""
                                            >
                                                Kaaf
                                            </div>
                                            <div
                                                className="t__sub-title t__color-blue"
                                                data-v-8967c2b9=""
                                            >
                                                {/* as painted by Zoé Rumeau */}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-right"
                                        data-v-8967c2b9=""
                                    >
                                        <img
                                            className="img-classic loading-background"
                                            srcSet="/assets/images/best-sellers/kaaf@1x.jpg 1x, /assets/images/best-sellers/kaaf@2x.jpg 2x"
                                            sizes="(min-width: 768px) 1040w"
                                            src="/assets/images/best-sellers/kaaf@2x.jpg"
                                            alt=""
                                            loading="lazy"
                                            data-v-8967c2b9=""
                                            data-v-399c522e=""
                                        />
                                        <button
                                        onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/oriental-fragrance/kaaf")}
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
                                        srcSet="/assets/images/best-sellers/notes/kaaf@1x.jpg 1x, /assets/images/best-sellers/notes/kaaf@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/notes/kaaf@2x.jpg"
                                        alt=""
                                        loading="lazy"
                                    />
                                    <img
                                        data-v-399c522e=""
                                        data-v-8967c2b9=""
                                        className="img-classic img-fragrance"
                                        srcSet="/assets/images/best-sellers/kaaf@1x.jpg 1x, /assets/images/best-sellers/kaaf@2x.jpg 2x"
                                        sizes="(min-width: 768px) 1040w"
                                        src="/assets/images/best-sellers/kaaf@1x.jpg"
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
                                        className="t__h4 t__color-primary t__capitalize fs-2 font-weight-bold"
                                    >
                                        Kaaf
                                    </div>
                                    <div
                                        data-v-8967c2b9=""
                                        className="t__sub-title t__color-blue"
                                    >
                                        {/* Imagined by François Azambourg */}
                                    </div>
                                </div>
                                <button
                                onClick={() => window.open("https://www.ahmed-perfume.com/en/shop/perfumes/oriental-fragrance/kaaf")}
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
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
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
                                href={`/${locale}/shop`}
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

            <section className="d-flex section-3">
                <div className="">
                    <div className="section-content">
                        <div className="d-flex flex-column justify-content-around gap-5">
                            <div className="section-head">
                                <h2 className="text-center">
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
                            <div className="d-none d-md-block">
                                <div className="videoarea d-flex align-items-center">
                                    <VideoPanel src="/assets/videos/multi-product.mp4" />
                                </div>
                            </div>
                            <div className="d-block d-sm-none">
                                <div className="videoarea d-flex align-items-center">
                                    <VideoPanel src="/assets/videos/multi-product-mobile.mp4" />
                                </div>
                            </div>
                            <div className="d-flex justify-content-center pt-5">
                                <Link
                                    href={`/${locale}/shop`}
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
                                href={`/${locale}/shop`}
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
                                {t("Gifts for Every ")}
                                <br />
                                <span className="text-italic">
                                    {t("Occasion")}
                                </span>
                            </h2>
                            <p className="text-center section-paragraph">
                                {t(
                                    "Delight your loved ones with our luxurious gift sets, thoughtfully curated to include our most exquisite fragrances.."
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
                    <a href={`/${locale}/shop/gift-sets/gift-sets/ihdaa-khaas`}>
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
                    <a href={`/${locale}/shop/gift-sets/gift-sets/antee-gift-set-05`}>
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
                                href={`/${locale}/shop`}
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
                            
            {!isMobile ? <><section className="horizontal-scroll d-flex flex-row w-100 vh-100">
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
                    <div className="">
                        <h3 className="text-center" style={{ "whiteSpace": "nowrap" }}>
                            {t("Essence of Arabia")}
                        </h3>
                        <p className="text-center">{t("Step into")}</p>
                        <div className="row mt-4 justify-content-center">
                            <div className="col-md-6">
                                <Link href={`/${locale}/shop/dakhoon/bakhoor/bakhoor-ahmed-40-tabs`}>
                                <img
                                    className=""
                                    src="/assets/images/home/demo8/Bakhoor-Ahmed.jpg"
                                    alt="Bakhoor Ahmed"
                                />
                                </Link>
                            </div>
                            <div className="col-md-6">
                                <Link href={`/${locale}/shop/dakhoon/oud-maattar/oud-mtr-asaateen`}>
                                <img
                                    className=""
                                    src="/assets/images/home/demo8/Oud-Asateen.jpg"
                                    alt="Oud Asateen"
                                />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="panel2 mt-5">
                        <div className="inner2 mt-5">
                            <Categories />
                        </div>
                    </div>
                    {/* <div className="inner2 mt-5">
                        <Categories />
                    </div> */}
                    {/* <div className="d-flex flex-column align-items-center">
                        <h3 className="text-center" style={{ "fontSize": "2rem"}}>
                        {t("Reaching Every Corner of the World")}
                        </h3>
                        <p className="text-center">{t("Exports Text")}</p>
                        <Link
                        href={`/${locale}/export`}
                        className="btn-link btn-link_lg default-underline text-uppercase fw-medium pt-5"
                        >
                        {t("Discover More")}
                        </Link>
                    </div> */}
                </div>
                <div className="panel mt-5">
                    <div className="d-flex flex-column align-items-center">
                        <h3 className="text-center w-50" style={{ "fontSize": "2rem"}}>
                        {t("Reaching Every Corner of the World")}
                        </h3>
                        <p className="text-center w-50">{t("Exports Text")}</p>
                        <Link
                        href={`/${locale}/export`}
                        className="btn-link btn-link_lg default-underline text-uppercase fw-medium pt-5"
                        >
                        {t("Discover More")}
                        </Link>
                    </div>
                    <div className="inner2 mt-4 d-flex flex-column flex-md-row justify-content-start">
                        <Link href={`/${locale}/export`}>
                        <img
                            className="px-2 w-100 w-md-auto"
                            src="/assets/images/home/demo8/export/aqua-oud.jpg"
                            alt="Image 1"
                        />
                        </Link>
                        <Link href={`/${locale}/export`}>
                        <img
                            className="px-2 w-100 w-md-auto"
                            src="/assets/images/home/demo8/export/endless.jpg"
                            alt="Image 2"
                        />
                        </Link>
                    </div>
                </div>
            </section></> :
            
            <><section className="horizontal-scroll d-flex flex-row w-100 vh-100">
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
                    <div className="" style={locale === "en" ? { paddingLeft: "10%" } : { paddingRight: "10%" }}>
                        <h3 className="text-center" style={{ "whiteSpace": "nowrap" }}>
                            {t("Essence of Arabia")}
                        </h3>
                        <p className="text-center">{t("Step into")}</p>
                        <div className="row mt-4 justify-content-center">
                            <div className="col-md-6">
                                <Link href={`/${locale}/shop/dakhoon/bakhoor/bakhoor-ahmed-40-tabs`}>
                                <img
                                    className=""
                                    src="/assets/images/home/demo8/Bakhoor-Ahmed.jpg"
                                    alt="Bakhoor Ahmed"
                                />
                                </Link>
                            </div>
                            <div className="col-md-6">
                                <Link href={`/${locale}/shop/dakhoon/oud-maattar/oud-mtr-asaateen`}>
                                <img
                                    className=""
                                    src="/assets/images/home/demo8/Oud-Asateen.jpg"
                                    alt="Oud Asateen"
                                />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="panel2 mt-5">
                        <div className="inner2 mt-5">
                            <Categories />
                        </div>
                    </div>
                    {/* <div className="inner2 mt-5">
                        <Categories />
                    </div> */}
                    {/* <div className="d-flex flex-column align-items-center">
                        <h3 className="text-center" style={{ "fontSize": "2rem"}}>
                        {t("Reaching Every Corner of the World")}
                        </h3>
                        <p className="text-center">{t("Exports Text")}</p>
                        <Link
                        href={`/${locale}/export`}
                        className="btn-link btn-link_lg default-underline text-uppercase fw-medium pt-5"
                        >
                        {t("Discover More")}
                        </Link>
                    </div> */}
                </div>
                <div className="panel mt-5">
                    <div className="d-flex flex-column align-items-center" style={locale === "en" ? { paddingLeft: "20%" } : { paddingRight: "20%" }}>
                        <h3 className="text-center w-50" style={{ "fontSize": "2rem"}}>
                        {t("Reaching Every Corner of the World")}
                        </h3>
                        <p className="text-center w-50">{t("Exports Text")}</p>
                        <Link
                        href={`/${locale}/export`}
                        className="btn-link btn-link_lg default-underline text-uppercase fw-medium pt-5"
                        >
                        {t("Discover More")}
                        </Link>
                    </div>
                    <div className="inner2 mt-4 d-flex flex-column flex-md-row justify-content-start">
                        {/* <Link href={`/${locale}/export`}>
                        <img
                            className="px-2 w-100 w-md-auto"
                            src="/assets/images/home/demo8/export/aqua-oud.jpg"
                            alt="Image 1"
                        />
                        </Link>
                        <Link href={`/${locale}/export`}>
                        <img
                            className="px-2 w-100 w-md-auto"
                            src="/assets/images/home/demo8/export/endless.jpg"
                            alt="Image 2"
                        />
                        </Link> */}
                    </div>
                </div>
            </section></>}

            {/* Vertical Section 3 */}
            {/* <section className="scroll-section">
                <div className="panel orange w-100 vh-100"></div>
            </section> */}

            <section className="scroll-section d-flex flex-direction-column section-7 mt-3">
                <div className="panel w-100 vh-100">
                    <div className="section-content">
                        <div className="text-center text-white d-flex justify-content-center">
                            <span className="t-subtitle">
                                {t("WHERE LUXURY MEETS YOUR SENSES")}
                            </span>
                        </div>
                        <h2 className="h1 text-center text-white pt-3">
                        {t("Your Journey Begins with a Scent")}
                        </h2>
                        <p className="text-center text-white section-paragraph">
                            {t(
                                "At Ahmed Al Maghribi Perfumes each fragrance tells your story Our luxurious scents evoke memories and emotions becoming a lasting part of who you are"
                            )}
                        </p>
                        <div className="d-flex justify-content-center pt-5">
                            <Link
                                href={`/${locale}/shop`}
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

            {/* Vertical Section 4 */}
            {/* <section className="scroll-section">
                <div className="panel blue w-100 vh-100"></div>
            </section> */}
            <section
                id="end"
                className="testsect container d-flex flex-column justify-content-center zoom_img"
            >
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mb-5 pt-5">
                <div className="order-1 order-md-0">
                    <VideoPanel src="/assets/videos/production.mp4" section='last'/>
                </div>
                <div className="col-lg-7 p-5 text-center order-3 order-md-1">
                    <h3 className="mb-3">
                    {t("Quality Crafted Through Expertise 20 plus Years of Mastery")}
                    </h3>
                    <p>
                    {t(
                        "For over 20 years Ahmed Al Maghribi Perfumes has been dedicated to creating luxurious timeless scents Using only the finest natural ingredients we ensure every fragrance is crafted with precision and excellence offering lasting quality"
                    )}
                    </p>
                </div>
                </div>

                <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mt-5">
                <div className="col-lg-7 p-5 text-center order-1 order-md-0">
                    <h3 className="mb-3">{t("The Company")}</h3>
                    <p>{t("Steps")}</p>
                </div>
                <div className="order-0 order-md-1">
                    <img
                    className="h-auto w-100"
                    src="/assets/images/home/demo8/Shop.jpg"
                    alt="image"
                    />
                </div>
                </div>
            </section>
        </div>
    );
};

export default ScrollSnapHorizontalBootstrap;
