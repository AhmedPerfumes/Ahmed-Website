"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
import Hero from "@/components/homes/home-8/Hero";
import Footer14 from "@/components/footers/Footer14";
import MobileFooter2 from "./footers/MobileFooter2";

import Categories from "@/components/homes/home-15/Categories";
import Lookbook from "@/components/homes/home-9/Lookbook";

import Swiper from "swiper";
import "./Animation.css";
import MobileSlider from "./singleProduct/sliders/MobileSlider";
import { duration } from "@mui/material";

import { useLocale, useTranslations } from "next-intl";

const Animation = () => {
  const locale = useLocale();
  const t = useTranslations();
  useEffect(() => {
    const isMobileDevice = () => {
      return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    };

    gsap.registerPlugin(ScrollTrigger);

    // Snapping logic
    let snap = (value) => value; // a snapping function that we'll set later in a "refresh" event listener

    // ScrollTrigger 1: sections scroll and snap vertically
    // const sections = gsap.utils.toArray(".testsect");

    // ScrollTrigger.create({
    //   start: 1,
    //   end: "max",
    //   snap: {
    //     snapTo: (value, self) => snap(value, self.direction),
    //     duration: { min: 0.01, max: 0.3 },
    //     delay: 0,
    //   },
    // });
    // ScrollTrigger 2: horizontal scroll in section ".container"
    const panels = gsap.utils.toArray(".cont .panel2");

    const panelTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".cont",
        start: "top top",
        end: "+=" + window.innerWidth * 3,
        // markers: true,
        pin: true,
        scrub: 1,
      },
    });
    // ScrollTrigger 3: horizontal scroll in section ".mobilecontainer" without snapping
    const mobilepanel = gsap.utils.toArray(".mobilecontainer .mobilepanel");

    const mobilepanelTween = gsap.to(mobilepanel, {
      xPercent: -100 * (mobilepanel.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".mobilecontainer",
        start: "top top",
        end: "+=" + window.innerWidth * 3,
        // markers: true,
        pin: true,
        scrub: 3,
        // No snap property here
      },
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
      // Remove 'active' class from all circles
      const circles = document.querySelectorAll(".nav-circle");
      circles.forEach((circle) => {
        circle.classList.remove("active");
      });

      // Add 'active' class to the current circle
      const activeCircle =
        document.querySelectorAll(".nav-circle")[activeIndex];
      if (activeCircle) {
        activeCircle.classList.add("active");
      }
    }

    function handleNavCircleClick(index) {
      swiper.slideTo(index);
    }

    // Attach click event listeners to the navigation circles
    const navCircles = document.querySelectorAll(".nav-circle");
    navCircles.forEach((circle, index) => {
      circle.addEventListener("click", () => handleNavCircleClick(index));
    });

    gsap.utils.toArray(".testsect").forEach((section) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          
          trigger: section, // use individual section as trigger
          start: 'top 400px',
          end: 'bottom 95%',
          
          scrub: 4,
          
        }
      });

      timeline.to(section.querySelector(".sub-title"), {
        opacity: 1,
        duration: 1,
      });

      timeline.fromTo(
        section.querySelector(".h2"),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 2.75 }
      );

      timeline.fromTo(
        section.querySelector(".p"),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 2.85 }
      );

      // timeline.to(section.querySelector('.panel2'), {
      //   yPercent: -5,
      //   duration: 1
      // });
    });

    let imgs = gsap.utils.toArray(".zoom_img");
    imgs.forEach((img, i) => {
      gsap.fromTo(
        img,
        { scale: 0.75 }, // Initial scale
        {
          scale: 1, // Final scale
          scrollTrigger: {
            trigger: img,
            start: "top 70%",
            end: "top 7.5%",

            // markers: true,
            scrub: 1,
            // snap: !isMobileDevice() ? true : false,
          },
        }
      );
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div id="main2">
      <section className="vh-100 hero-banner">
        <Hero />
      </section>
      <section className="testsect section1">
        <div className="panel2 position-relative d-flex justify-content-center">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/multiple-products-banner.avif"
            alt={t("Signature Selections")}
          />
          <div className="text_reveal position-absolute">
            <div className="text-center text-white sub-title">
            {t("Signature Selections")}
            </div>
            <h2 className="text-center text-white h2">
              {t("Fragrances Adored by All")}
            </h2>
            <p className="text-center text-white p">
              {t("Discover our bestsellers crafted to suit diverse tastes From classics to modern blends each fragrance offers something unique for every scent lover")}
            </p>
          </div>

          <a
            href="#footer"
            className="d-block position-absolute start-50 translate-middle-x text_dash text-white text-uppercase fw-medium mb-5 text-nowrap"
            style={{ bottom: "0" }}
          >
            Scroll To Discover More
          </a>
        </div>
      </section>

      {/* Top 10 Products */}
      <section className="testsect zoom_img section2 d-flex">
        <div className="panel2 pt-4 d-flex justify-content-center align-items-center">
          <div className="contai ">
            <div className="mySwiper">
              <div className="main-wrapper swiper-wrapper">
                <div className="mainnn swiper-slide " id="beach">
                  <div className="left-sideee">
                    <div className="mainnn-wrapper">
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Bin Shaikh</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        In 20 years, there could be more plastic in our oceans
                        than fish.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        Plastic pollution injures more than 100.000 marine
                        animals every year.It takes around 450 years for one
                        plastic bottle to decompose.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/oriental-fragrance/bin-shaikh"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                <div className="mainnn swiper-slide" id="savanna">
                  <div className="left-sideee">
                    <div className="mainnn-wrapper">
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Ignite Oud</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        The Earth’s area affected by desertification is approx
                        11 times India’s size.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        The Savannas act as a carbon sink, absorbing CO2 from
                        the atmosphere and helping to maintain the balance of
                        global temperatures.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/oriental-fragrance/ignite-oud"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                <div className="mainnn swiper-slide" id="glacier">
                  <div className="left-sideee">
                    <div className="mainnn-wrapper">
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Kaaf</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        Glaciers contain 75% of the World's freshwater.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        The effects of melting ice glaciers are biodiversity
                        loss, the rising of the sea level and the deficiency of
                        freshwater, among others.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/oriental-fragrance/kaaf"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Laathani</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        We will have lost 60% of our coral reefs by 2030.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        Coral reefs are essential to humans, as they protect the
                        shorelines and are a source of nutrients and habitat for
                        thousands of marine species.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/oriental-fragrance/laathani"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Marj</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        We will have lost 60% of our coral reefs by 2030.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        Coral reefs are essential to humans, as they protect the
                        shorelines and are a source of nutrients and habitat for
                        thousands of marine species.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/occidental-fragrance/marj"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Musk & Roses</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        We will have lost 60% of our coral reefs by 2030.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        Coral reefs are essential to humans, as they protect the
                        shorelines and are a source of nutrients and habitat for
                        thousands of marine species.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/occidental-fragrance/musk-roses"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Oud & Roses</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        We will have lost 60% of our coral reefs by 2030.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        Coral reefs are essential to humans, as they protect the
                        shorelines and are a source of nutrients and habitat for
                        thousands of marine species.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/occidental-fragrance/oud-roses"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Oud Lavender</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        We will have lost 60% of our coral reefs by 2030.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        Coral reefs are essential to humans, as they protect the
                        shorelines and are a source of nutrients and habitat for
                        thousands of marine species.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/occidental-fragrance/oud-lavender"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Rose Noir</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        We will have lost 60% of our coral reefs by 2030.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        Coral reefs are essential to humans, as they protect the
                        shorelines and are a source of nutrients and habitat for
                        thousands of marine species.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href={"/en/shop/eau-de-parfum/occidental-fragrance/rose-noir"}
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
                      <h3 className="mainnn-header">BEST SELLERS</h3>
                      <h1 className="mainnn-title">Summer Oud</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title ">
                        We will have lost 60% of our coral reefs by 2030.
                      </div>
                      <div className="mainnn-content__subtitle ">
                        Coral reefs are essential to humans, as they protect the
                        shorelines and are a source of nutrients and habitat for
                        thousands of marine species.
                      </div>
                      <div className="moreee-menu pt-5">
                        <Link
                          href="/en/shop/eau-de-parfum/occidental-fragrance/summer-oud"
                          className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                        >
                          Shop Now
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
              <div className="nav-circle" data-target="#beach"></div>
              <div className="nav-circle" data-target="#savanna"></div>
              <div className="nav-circle" data-target="#glacier"></div>
              <div className="nav-circle" data-target="#coral"></div>
              <div className="nav-circle" data-target="#coral"></div>
              <div className="nav-circle" data-target="#coral"></div>
              <div className="nav-circle" data-target="#coral"></div>
              <div className="nav-circle" data-target="#coral"></div>
              <div className="nav-circle" data-target="#coral"></div>
              <div className="nav-circle" data-target="#coral"></div>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}

      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}
      <section className="testsect section3">
        <div className="panel2 position-relative d-flex justify-content-center">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/collection-bnr.avif"
            alt="Exclusive Collection"
          />

          <div className="text_reveal position-absolute">
            <div className="text-center text-white sub-title">
              {t("Where Luxury Meets Your Senses")}
            </div>
            <h2 className="text-center text-white h2">{t("Exclusive Collection")}</h2>
            <p className="text-center text-white p">
              {t("Explore our exclusive collection of refined scents made with the finest ingredients Elegant and original each fragrance complements your style")}
            </p>
          </div>
          <a
            href="#footer"
            className="d-block position-absolute start-50 translate-middle-x text_dash text-white text-uppercase fw-medium mb-5 text-nowrap"
            style={{ bottom: "0" }}
          >
            Scroll To Discover More
          </a>
        </div>
      </section>
      
      <section id="start" className="testsect zoom_img section4">
        <div className="panel2 d-flex flex-column justify-content-center align-items-center text-center pt-5">
          {/* For Large Screens */}
          <div className="d-none d-lg-block pt-2">
            <h2 className="fw-lighter sec-two-h2 pt-2">
              Crafted for the Discerning Few
            </h2>
            <video muted autoPlay loop className="w-75 pt-5" preload="none">
              <source type="video/mp4" src="/assets/videos/multi-product.mp4" />
            </video>
          </div>
          {/* For small screens */}
          <div className="d-block d-lg-none pt-2">
            <h2 className="fw-lighter sec-two-h2 pt-2 s-font">
              Crafted for the Discerning Few
            </h2>
            <video muted autoPlay loop className="w-75 pt-2" preload="none">
              <source
                type="video/mp4"
                src="/assets/videos/multi-product-mobile.mp4"
              />
            </video>
          </div>

          <Link
            href={`/${locale}/shop`}
            className="btn-link btn-link_lg default-underline text-uppercase fw-medium pt-5"
          >
            Discover More
          </Link>
        </div>
      </section>

      <section className="testsect">
        <div className="panel2 position-relative d-flex justify-content-center">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/giftset-bnr.avif"
            alt="Art of Gifting"
          />
          <div className="text_reveal position-absolute">
            <div className="text-center text-white sub-title">
              {t("Elegant Treasures for Every Occasion")}
            </div>
            <h2 className="text-center text-white h2">{t("The Art of Gifting")}</h2>
            <p className="text-center text-white p">
              {t("Celebrate special moments with our curated fragrance gift sets Beautifully presented and featuring our finest scents they make the perfect gift for any occasion")}
            </p>
          </div>
          <a
            href="#footer"
            className="d-block position-absolute start-50 translate-middle-x text_dash text-white text-uppercase fw-medium mb-5 text-nowrap"
            style={{ bottom: "0" }}
          >
            Scroll To Discover More
          </a>
        </div>
      </section>
      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4 zoom_img"></div> */}
      <section className="testsect d-flex zoom_img">
        <div
          className="panel2 d-flex flex-column justify-content-around
        gap-5"
        >
          <Lookbook />

          <Categories section="section3" />
        </div>
      </section>
      {/* Arabian Dakhoon Section */}
      <section className="testsect section4">
        <div className="panel2 position-relative d-flex justify-content-center">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/dakhoon-bnr.avif"
            alt="Ethereal Essence"
          />
          <div className="text_reveal position-absolute zoom_img">
            <div className="text-center text-white sub-title">
              {t("Ancient Aromas")}
            </div>
            <h2 className="text-center text-white h2">
              {t("The Essence of Arabic Dakhoon")}
            </h2>
            <p className="text-center text-white p">
              {t("Experience the heritage of Arabic Dakhoon made from natural ingredients Enjoy rich long lasting aromas that bring warmth and tradition to your home")}
            </p>
          </div>
          <a
            href="#footer"
            className="d-block position-absolute start-50 translate-middle-x text_dash text-white text-uppercase fw-medium mb-5 text-nowrap"
            style={{ bottom: "0" }}
          >
            Scroll To Discover More
          </a>
        </div>
      </section>
      {/* Full screen vertical Scroll Slider */}
      <section className="cont testsect ">
        <div className="panel2 mb-4">
          <div className="inner2 mt-5 d-flex align-items-center">
            <Categories section="section4" />
          </div>
        </div>

        <div className="panel2 mt-5">
          <div className="inner2">
            <video loop muted autoPlay className="w-100" preload="none">
              <source
                src="/assets/videos/ignite-rose-video.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        <div className="panel2 mt-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <h3 className="text-center">
              Carefully <span className="s-font">selected ingredients</span>
            </h3>
            <p className="text-center px-3">
              From endemic species to renowned terroirs, we are particularly
              meticulous when it comes to sourcing our raw materials. While
              respecting the rhythms of nature, we commit to selecting only the
              highest-quality ingredients, imparting our perfumes with their
              rich olfactory facets.
            </p>
            <div className="mt-4">
              <Link href="#">
                <img
                  className="w-50 px-1"
                  src="/assets/images/home/demo8/Bakhoor-Ahmed.jpg"
                  alt="Image 1"
                />
              </Link>
              <Link href="#">
                <img
                  className="w-50 px-1"
                  src="/assets/images/home/demo8/Oud-Asateen.jpg"
                  alt="Image 1"
                />
              </Link>
            </div>
          </div>
          <div className="inner2 mt-5">
            <Categories section="section4" />
          </div>
        </div>

        <div className="panel2 mt-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <h3 className="text-center">
              Carefully{" "}
              <span
                className="s-font
              
              "
              >
                selected ingredients
              </span>
            </h3>
            <p className="text-center px-3">
              From sadendemic species to renowned terroirs, we are particularly
              meticulous when it comes to sourcing our raw materials. While
              respecting the rhythms of nature, we commit to selecting only the
              highest-quality ingredients, imparting our perfumes with their
              rich olfactory facets.
            </p>
          </div>
          <div className="inner2 mt-4 d-flex flex-column flex-md-row justify-content-start">
            <img
              className="px-2 w-100 w-md-auto"
              src="/assets/images/home/demo8/export/aqua-oud.jpg"
              alt="Image 1"
            />
            <img
              className="px-2 w-100 w-md-auto"
              src="/assets/images/home/demo8/export/endless.jpg"
              alt="Image 2"
            />
          </div>
        </div>
      </section>

      {/* This is the Mobile Slider  */}
      <section className="MobileSlider mobilecontainer d-lg-none zoom_img">
        {/* <div className="mobilepanel d-flex align-items-center">
          <div className="inner">
            <video loop muted autoPlay className="w-100" preload="none">
              <source
                src="/assets/videos/ignite-rose-slideshow.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div> */}
        &nbsp;&nbsp;&nbsp;
        <div className="mobilepanel d-flex justify-content-center">
          <div className="inner text-center pt-5 mt-4">
            <Categories />
          </div>
        </div>
        &nbsp;&nbsp;&nbsp;
        <div className="mobilepanel">
          <div className="inner d-flex align-items-center">
            <video loop muted autoPlay className="w-100" preload="none">
              <source
                src="/assets/videos/ignite-rose-mobile.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        <div className="mobilepanel ">
          <div className="inner text-center pt-5 mt-4">
            <Categories />
          </div>
        </div>
        <div className="mobilepanel">
          <div className="inner text-center pt-5 mt-4">
            <h1>Carefullyyyyy Selected ingredients</h1>
            <p className="fs-5">
              From endemic species to renowned terroirs, we are particularly
              meticulous when it comes to sourcing our raw materials. While
              respecting the rhythms of nature, we commit to selecting only the
              highest-quality ingredients, imparting our perfumes with their
              rich olfactory facets
            </p>

            <img src="assets/images/home/demo8/Bakhoor-Ahmed.jpg" alt="" />
          </div>
        </div>
        <div className="mobilepanel d-flex justify-content-center">
          <div className="inner text-center pt-5 mt-4">
            <h1>Carefully Selected Ingredients</h1>
            <p className="fs-5">
              From endemic species to renowned terroirs, we are particularly
              meticulous when it comes to sourcing our raw materials. While
              respecting the rhythms of nature, we commit to selecting only the
              highest-quality ingredients, imparting our perfumes with their
              rich olfactory facets.
            </p>
            <div className="row">
              <div className="col-6">
                <img
                  src="assets/images/home/demo8/export/aqua-oud.jpg"
                  alt=""
                  className="img-fluid"
                />
              </div>
              <div className="col-6">
                <img
                  src="assets/images/home/demo8/export/endless.jpg"
                  alt=""
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>

      <section className="testsect section4">
        <div className="panel2 position-relative d-flex justify-content-center">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/production.avif"
            alt="Ethereal Essence"
          />
          <div className="text_reveal position-absolute zoom_img">
          
            <h2 className="text-center text-white h2">
            {t("Your Journey Begins with a Scent")}
            </h2>
            <p className="text-center text-white p">
            {t("At Ahmed Al Maghribi Perfumes each fragrance tells your story Our luxurious scents evoke memories and emotions becoming a lasting part of who you are Discover the aroma that")}
            </p>
          </div>
          <a
            href="#footer"
            className="d-block position-absolute start-50 translate-middle-x text_dash text-white text-uppercase fw-medium mb-5 text-nowrap"
            style={{ bottom: "0" }}
          >
            Scroll To Discover More
          </a>
        </div>
      </section>

      {/* Company Information Section */}
      <section
        id="end"
        className="testsect container d-flex flex-column justify-content-center zoom_img"
      >
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mb-5 pt-5">
          <div className="order-1 order-md-0">
            <video loop muted autoPlay className="w-100" preload="none">
              <source src="/assets/videos/production.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="col-lg-7 p-5 text-center order-3 order-md-1">
            <h3 className="mb-3">{t("Quality Crafted Through Expertise 20 plus Years of Mastery")}</h3>
            <p>
              {t("For over 20 years Ahmed Al Maghribi Perfumes has been dedicated to creating luxurious timeless scents Using only the finest natural ingredients we ensure every fragrance is crafted with precision and excellence offering lasting quality")}
            </p>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mt-5">
          <div className="col-lg-7 p-5 text-center order-1 order-md-0">
            <h3 className="mb-3">{t("The Company")}</h3>
            <p>
            {t("Step into olfactory elegance with Ahmed Al Maghribi Perfumes where each composition is a symphony of rare absolutes and precious accords Our meticulously curated essences evoke sophistication crafting sillage that lingers in timeless harmony Experience the alchemy of fragrance at its finest")}
            </p>
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
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4 d-none d-lg-block"></div>
    </div>
  );
};

export default Animation;
