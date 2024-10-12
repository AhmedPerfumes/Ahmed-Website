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

const Animation = () => {
  useEffect(() => {
    const isMobileDevice = () => {
      return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    };

    gsap.registerPlugin(ScrollTrigger);

    // Snapping logic
    let snap = (value) => value; // a snapping function that we'll set later in a "refresh" event listener

    // ScrollTrigger 1: sections scroll and snap vertically
    const sections = gsap.utils.toArray(".testsect");

    ScrollTrigger.create({
      start: 1,
      end: "max",
      snap: {
        snapTo: (value, self) => snap(value, self.direction),
        duration: { min: 0.01, max: 0.3 },
        delay: 0,
      },
    });
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
    // ScrollTrigger for each section to get their positions
    const sectionTriggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        refreshPriority: -1,
      })
    );
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

    let headings = gsap.utils.toArray(".h2");
    headings.forEach((heading, i) => {
      gsap.fromTo(
        heading,
        {
          opacity: 0,
          y: 50,
          delay: 1,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: heading,
            start: "top 80%",
            end: "top -5%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    let parags = gsap.utils.toArray(".p");
    parags.forEach((parag, i) => {
      gsap.fromTo(
        parag,
        {
          opacity: 0,
          y: 50,
          delay: 1,
        },
        {
          opacity: 1,
          y: 0,
          delay: 1,
          scrollTrigger: {
            trigger: parag,
            start: "top 70%",
            end: "top -5%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    let subtitles = gsap.utils.toArray(".sub-title");
    subtitles.forEach((subtitle, i) => {
      gsap.fromTo(
        subtitle,
        {
          opacity: 0,
          y: 50,
          delay: 1,
        },
        {
          opacity: 1,
          y: 0,
          delay: 1,
          scrollTrigger: {
            trigger: subtitle,
            start: "top 80%",
            end: "top -5%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    let imgs = gsap.utils.toArray(".zoom_img");
    imgs.forEach((img, i) => {
      gsap.fromTo(
        img,
        { scale: 0.85 }, // Initial scale
        {
          scale: 1, // Final scale
          scrollTrigger: {
            trigger: img,
            start: "top 100%",
            end: "top 7.5%",
            // markers: true,
            scrub: 1,
            snap: !isMobileDevice() ? true : false,
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
      <section className="testsect hero-banner">
        <Hero />
      </section>
      <section className="testsect section1">
        <div className="panel2 position-relative d-flex justify-content-center">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/multiple-products-banner.avif"
            alt="Section 1"
          />
          <div className="text_reveal position-absolute">
            <div className="text-center text-white sub-title">Best Sellers</div>
            <h2 className="text-center text-white h2">
              Fragrances Loved by All
            </h2>
            <p className="text-center text-white p">
              This panel gets pinned in a similar way, and has a more involved
              animation that's wrapped in a timeline, fading the background
              color and animating the transforms of the paragraph in addition to
              the line, all synced with the scroll position perfectly.
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
      <section className="testsect zoom_img section2">
        <div className="panel2 d-flex justify-content-center align-items-center">
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
                          href="/shop"
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
                          href="/shop"
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
                          href="/shop"
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
                          href="/shop"
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
                          href="/shop"
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
                          href="/shop"
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
                          href="/shop"
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
                          href="/shop"
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
                          href="/shop"
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
                          href="/shop"
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
        <div className="panel2 position-relative">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/collection-bnr.avif"
            alt="Exclusive Collection"
          />

          <div className="text_reveal position-absolute">
            <div className="text-center text-white sub-title">
              Where Luxury Meets Your Senses
            </div>
            <h2 className="text-center text-white h2">Exclusive Collection</h2>
            <p className="text-center text-white p">
              This panel gets pinned in a similar way, and has a more involved
              animation that's wrapped in a timeline, fading the background
              color and animating the transforms of the paragraph in addition to
              the line, all synced with the scroll position perfectly.
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
          <h2 className="fw-lighter sec-two-h2 pt-5">
            Crafted for the Discerning Few
          </h2>
          <div className="d-none d-lg-block pt-5">
            <video muted autoPlay loop className="w-75" preload="none">
              <source type="video/mp4" src="/assets/videos/multi-product.mp4" />
            </video>
          </div>
          <div className="d-block d-lg-none pt-5">
            <video muted autoPlay loop className="w-100" preload="none">
              <source
                type="video/mp4"
                src="/assets/videos/multi-product-mobile.mp4"
              />
            </video>
          </div>

          <Link
            href="/shop"
            className="btn-link btn-link_lg default-underline text-uppercase fw-medium pt-5"
          >
            Discover More
          </Link>
        </div>
      </section>
      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}

      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}
      <section className="testsect">
        <div className="panel2 position-relative d-flex justify-content-center">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/giftset-bnr.avif"
            alt="Section 3"
          />
          <div className="text_reveal position-absolute">
            <div className="text-center text-white sub-title">Best Sellers</div>
            <h2 className="text-center text-white h2">Section 3</h2>
            <p className="text-center text-white p">
              This panel gets pinned in a similar way, and has a more involved
              animation that's wrapped in a timeline, fading the background
              color and animating the transforms of the paragraph in addition to
              the line, all synced with the scroll position perfectly.
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
      <section className="testsect zoom_img">
        <div className="panel2 d-flex flex-column justify-content-around">
          <Lookbook />

          <Categories section="section3" />
        </div>
      </section>
      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}
      <section className="testsect">
        <div className="panel2 position-relative d-flex justify-content-center">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="/assets/images/home/demo8/avif/dakhoon-bnr.avif"
            alt="Section 4"
          />
          <div className="text_reveal position-absolute zoom_img">
            <div className="text-center text-white sub-title">Best Sellers</div>
            <h2 className="text-center text-white h2">Section 4</h2>
            <p className="text-center text-white p">
              This panel gets pinned in a similar way, and has a more involved
              animation that's wrapped in a timeline, fading the background
              color and animating the transforms of the paragraph in addition to
              the line, all synced with the scroll position perfectly.
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
      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}
      <section className="cont testsect ">
        <div className="panel2 mb-4">
          <div className="inner2 zoom_img">
            <video loop muted autoPlay className="w-100" preload="none">
              <source
                src="/assets/videos/ignite-rose-slideshow.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-center mt-4">
            <h3 className="text-center ">
              Carefully <span className="s-font">selected ingredients</span>
            </h3>
            <p className="text-center px-3">
              From endemic species to renowned terroirs, we are particularly
              meticulous when it comes to sourcing our raw materials. While
              respecting the rhythms of nature, we commit to selecting only the
              highest-quality ingredients, imparting our perfumes with their
              rich olfactory facets.
            </p>
            <div className="mt-4 d-flex flex-column flex-md-row justify-content-center align-items-center">
              <img
                className="p-2 w-100 w-md-auto"
                src="https://www.ateliercologne.com/images/chapters/fourth/stories/first/ingredients_1-Desktop@1x.jpg"
                alt="Image 1"
              />
              <img
                className="p-2 w-100 w-md-auto"
                src="https://www.ateliercologne.com/images/chapters/fourth/stories/first/ingredients_2-Desktop@1x.jpg"
                alt="Image 2"
              />
              <img
                className="p-2 w-100 w-md-auto"
                src="https://www.ateliercologne.com/images/chapters/fourth/stories/first/ingredients_2-Desktop@1x.jpg"
                alt="Image 2"
              />
            </div>
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
        <div className="mobilepanel d-flex align-items-center">
          <div className="inner">
            <video loop muted autoPlay className="w-100" preload="none">
              <source
                src="https://www.ateliercologne.com/videos/chapters/fourth/stories/collection.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        &nbsp;&nbsp;&nbsp;
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

            <div className="row justify-content-center">
              <div className="col-6 col-md-4">
                <img
                  src="https://www.ateliercologne.com/images/chapters/fourth/stories/first/ingredients_1-Desktop@1x.jpg"
                  alt=""
                  className="img-fluid"
                />
              </div>
              <div className="col-6 col-md-4">
                <img
                  src="https://www.ateliercologne.com/images/chapters/fourth/stories/first/ingredients_1-Desktop@1x.jpg"
                  alt=""
                  className="img-fluid"
                />
              </div>
              <div className="col-6 col-md-4 pt-2">
                <img
                  src="https://www.ateliercologne.com/images/chapters/fourth/stories/first/ingredients_1-Desktop@1x.jpg"
                  alt=""
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
        &nbsp;&nbsp;&nbsp;
        <div className="mobilepanel">
          <div className="inner d-flex align-items-center">
            <video loop muted autoPlay className="w-100" preload="none">
              <source
                src="https://www.ateliercologne.com/videos/chapters/fourth/stories/second/intotheglassatelier_16x9.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        <div className="mobilepanel ">
          <div className="inner text-center pt-5 mt-4">
            {/* <h1>Most Preferred Categories</h1>
          <p className="fs-5">The World's Premium Brands In One destination</p> */}
            <Categories />
          </div>
        </div>
        <div className="mobilepanel">
          <div className="inner text-center pt-5 mt-4">
            <h1>Carefully Selected ingredients</h1>
            <p className="fs-5">
              From endemic species to renowned terroirs, we are particularly
              meticulous when it comes to sourcing our raw materials. While
              respecting the rhythms of nature, we commit to selecting only the
              highest-quality ingredients, imparting our perfumes with their
              rich olfactory facets
            </p>

            <img
              src="https://www.ateliercologne.com/images/chapters/fourth/stories/second/content/into-glass@1x.jpg"
              alt=""
            />
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
                  src="https://www.ateliercologne.com/images/chapters/fourth/stories/second/visual/into-glass@1x.jpg"
                  alt=""
                  className="img-fluid"
                />
              </div>
              <div className="col-6">
                <img
                  src="https://www.ateliercologne.com/images/chapters/fourth/stories/second/visual/mixed_collection@1x.jpg"
                  alt=""
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
        {/* <MobileSlider/> */}
      </section>
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
      <section className="testsect">
        <div className="panel2 position-relative">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="https://www.ateliercologne.com/images/chapters/third/introduction/background@1x.jpg"
            alt="Section 2"
          />
          <div className="text_reveal position-absolute">
            <h2 className="text-center text-white h2">Section 5</h2>
            <p className="text-center text-white p">
              This panel gets pinned in a similar way, and has a more involved
              animation that's wrapped in a timeline, fading the background
              color and animating the transforms of the paragraph in addition to
              the line, all synced with the scroll position perfectly.
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
      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}
      <section
        id="end"
        className="testsect container d-flex flex-column justify-content-center zoom_img"
      >
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mb-5 pt-5">
          <div className="order-1 order-md-0">
            <video loop muted autoPlay className="w-100" preload="none">
              <source src="/assets/videos/shop-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="col-lg-7 p-5 text-center order-3 order-md-1">
            <h3 className="mb-3">Quality Since 20+ Years</h3>
            <p>
              Quality is of prime importance at Al Maghribi Perfumes. We
              consider to take the same approach to fragrances that connoisseurs
              take. Careful consideration is given when bringing together
              different elements that emit exquisite aromas. At each stage of
              our production process, we have austere quality control checks
              that ensure our lofty benchmarks are being met.
            </p>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mt-5">
          <div className="col-lg-7 p-5 text-center order-1 order-md-0">
            <h3 className="mb-3">The Company</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
              sapien dignissim a elementum. Sociis metus, hendrerit mauris id
              in. Quis sit sit ultrices tincidunt euismod luctus diam. Turpis
              sodales orci etiam phasellus lacus id leo. Amet turpis nunc, nulla
              massa est viverra interdum. Praesent auctor nulla morbi non
              posuere mattis. Arcu eu id maecenas cras.
            </p>
          </div>
          <div className="order-0 order-md-1">
            <img
              className="h-auto w-100"
              src="https://www.ateliercologne.com/images/chapters/fifth/store-locator/perview@1x.jpg"
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
