"use client";

import "./Homepage.css";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import Hero from "@/components/homes/home-8/Hero";
import {
    KeyboardArrowLeftRounded,
    KeyboardArrowRightRounded,
} from "@mui/icons-material";
import Swiper from "swiper";

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
                snap: 1, // Snap to the start of each section
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
            ease: "none",
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
        <div id="main" className="overflow-hidden">
            {/* Vertical Section 1 */}
            <section className="scroll-section">
                <div className="panel section-slider w-100 vh-100">
                    <Hero />
                </div>
            </section>

            {/* Vertical Section 2 */}
            <section className="scroll-section">
                <div className="panel section-1 w-100 vh-100">
                    <div className="position-absolute px-5">
                        <div className="text-center text-white ">
                            SIGNATURE SELECTIONS
                        </div>
                        <h2 className="text-center text-white ">
                            Fragrances Adored by All
                        </h2>
                        <p className="text-center text-white">
                            Discover our bestsellers, crafted to suit diverse
                            tastes. From classics to modern blends, each
                            fragrance offers something unique for every scent
                            lover.
                        </p>
                    </div>
                    <Link
                        href=""
                        className="anchor text_dash text-white text-uppercase fw-medium mb-5 text-nowrap"
                    >
                        Scroll To Discover More
                    </Link>
                </div>
            </section>

            <section className="scroll-section">
                <div className="panel w-100 vh-100 ">
                    <div className="contai">
                        <div className="mySwiper">
                            <div className="main-wrapper swiper-wrapper">
                                <div
                                    className="mainnn swiper-slide "
                                    id="beach"
                                >
                                    <div className="">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Bin Shaikh")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 215.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t(
                                                        "French Lavender Saffron Rose Citrus Oakmoss"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t(
                                                        "Jasmine Orchid Sugar Violet Incense Bakhoor"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "Patchouli Agarwood Ambroxan Musk White Amber Resins"
                                                    )}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/oriental-fragrance/bin-shaikh`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/bin-shaikh.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/bin-shaikh.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="mainnn swiper-slide"
                                    id="savanna"
                                >
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Ignite Oud")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 250.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t("GERANIUM LEATHER")}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t("CEDARWOOD PATCHOULI")}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "MOSS MUSK AMBER SANDALWOOD"
                                                    )}
                                                </p>
                                            </div>
                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/oriental-fragrance/ignite-oud`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/ignite-oud.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/ignite-oud.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="mainnn swiper-slide"
                                    id="glacier"
                                >
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Kaaf")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 90.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t(
                                                        "RED FRUITS WATERMELON LAVENDER SICILIAN ORANGE"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t(
                                                        "SANDALWOOD AMBBROXAN WHITE MUSK"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "LOTUS JASMINE LILLY OF THE VALLEY SEA ACCORD"
                                                    )}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/oriental-fragrance/kaaf`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/kaaf.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/kaaf.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mainnn swiper-slide" id="coral">
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Laathani")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 175.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t(
                                                        "FRESH NOTES CANDIED FRUITS PINK PEPPER"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t(
                                                        "OUD ACCORDS ROSEMARY BAKHOOR ACCORDS"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "WHITE AMBER VETIVER MUSK LEATHER"
                                                    )}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/oriental-fragrance/laathani`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/laathani.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/laathani.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mainnn swiper-slide" id="coral">
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Marj")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 165.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t(
                                                        "BERGAMOT PINK PEPPER ELEMI NUTMEG TANGERINE OUD HONEY"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t(
                                                        "PATCHOULI AROMATIC ACCORDS VETIVER CASHMERE WOOD CINNAMON ROSE SAFFRON JASMINE ORANGE BLOSSOM"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "MUSK AMBER RASPBERRY SAFFRON OAKMOSS POWDER AMBRETTE SEEDS LEATHER SANDALWOOD VIOLET AGARWOOD AMBROXAN"
                                                    )}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/occidental-fragrance/marj`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/marj.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/marj.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mainnn swiper-slide" id="coral">
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Musk & Roses")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 110.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t("Floral Raspberry")}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t("Roses")}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t("Musky")}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/occidental-fragrance/musk-roses`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/musk-and-roses.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/musk-and-roses.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mainnn swiper-slide" id="coral">
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Oud & Roses")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 135.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t(
                                                        "Turkish rose lavender lemon peony"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t(
                                                        "sandal wood white flowers frankincense"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "agarwood guaiac wood oak moss Musk amber"
                                                    )}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/occidental-fragrance/oud-roses`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/oud-and-roses.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/oud-and-roses.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mainnn swiper-slide" id="coral">
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Oud Lavender")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 135.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t(
                                                        "Hyacinth Lavender Fruits"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t(
                                                        "Iris Jasmine Pink Pepper"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "Vetiver Amber Oud Musk"
                                                    )}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/occidental-fragrance/oud-lavender`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/oud-lavender.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/oud-lavender.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mainnn swiper-slide" id="coral">
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Rose Noir")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 110.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t("Rose Jasmine Peony")}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t(
                                                        "White Flower Sandal Wood Frankincense"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "Agarwood Musk Amber Oak Moss"
                                                    )}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/occidental-fragrance/rose-noir`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/rose-noir.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/rose-noir.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mainnn swiper-slide" id="coral">
                                    <div className="left-sideee">
                                        <div className="mainnn-wrapper">
                                            <h3 className="mainnn-header">
                                                {t("Best Sellers")}
                                            </h3>
                                            <h1 className="mainnn-title">
                                                {t("Summer Oud")}
                                            </h1>
                                            <h2 className="mainnn-subtitle">
                                                د.إ 150.00
                                            </h2>
                                        </div>
                                        <div className="mainnn-content">
                                            <div className="mainnn-content__title ">
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Top Notes: ")}
                                                    </span>
                                                    {t(
                                                        "CYPRIOL SAFFRON INCENSE MANDARIN"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Heart Notes: ")}
                                                    </span>
                                                    {t(
                                                        "ROSE AMBER PATCHOULI CASHMERE WOOD CARAMEL"
                                                    )}
                                                </p>
                                                <p>
                                                    <span
                                                        style={{
                                                            color: "#bb8c1c",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {t("Base Notes: ")}
                                                    </span>
                                                    {t(
                                                        "OUD ACCORDS MUSK OAKMOSS VETIVER LEATHER"
                                                    )}
                                                </p>
                                            </div>

                                            <div className="moreee-menu pt-5">
                                                <Link
                                                    href={`/${locale}/shop/eau-de-parfum/occidental-fragrance/summer-oud`}
                                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                                >
                                                    {t("Shop Now")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="centerrr">
                                        <div className="right-side__img">
                                            <img
                                                className="bottle-bg"
                                                src="assets/images/home/demo8/top/summer-oud.jpg"
                                                alt=""
                                            />
                                            <img
                                                className="bottle-img"
                                                src="assets/images/home/demo8/top/bottles/summer-oud.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="nav-circle-container">
                            <KeyboardArrowLeftRounded
                                className="left-arrow"
                                style={{ color: "#bb8c1c", cursor: "pointer" }}
                            />

                            <div
                                className="nav-circle"
                                data-target="#beach"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#savanna"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#glacier"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#coral"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#coral"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#coral"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#coral"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#coral"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#coral"
                            ></div>
                            <div
                                className="nav-circle"
                                data-target="#coral"
                            ></div>
                            <KeyboardArrowRightRounded
                                className="right-arrow"
                                style={{ color: "#bb8c1c", cursor: "pointer" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="scroll-section">
                <div className="panel section-2 w-100 vh-100">
                    <div className="position-absolute px-5">
                        <div className="text-center text-white ">
                            SIGNATURE SELECTIONS
                        </div>
                        <h2 className="text-center text-white ">
                            Fragrances Adored by All
                        </h2>
                        <p className="text-center text-white">
                            Discover our bestsellers, crafted to suit diverse
                            tastes. From classics to modern blends, each
                            fragrance offers something unique for every scent
                            lover.
                        </p>
                    </div>
                    <Link
                        href="#"
                        className="anchor text_dash text-white text-uppercase fw-medium mb-5 text-nowrap"
                    >
                        Scroll To Discover More
                    </Link>
                </div>
            </section>

            {/* Horizontal Scrolling Section */}
            <section className="horizontal-scroll d-flex flex-row w-100 vh-100">
                <div className="panel red w-100 vh-100 d-flex justify-content-center align-items-center">
                    <div className="inner">Panel 1</div>
                </div>
                <div className="panel green w-100 vh-100 d-flex justify-content-center align-items-center">
                    <div className="inner">Panel 2</div>
                </div>
                <div className="panel red w-100 vh-100 d-flex justify-content-center align-items-center">
                    <div className="inner">Panel 3</div>
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
