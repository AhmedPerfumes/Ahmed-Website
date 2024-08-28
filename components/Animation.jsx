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
        duration: { min: 0.01, max: 2 },
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

    // Update snapping function after ScrollTrigger refresh
    // const updateSnap = () => {
    //   const start = panelTween.scrollTrigger.start;
    //   const end = panelTween.scrollTrigger.end;
    //   const each = (end - start) / (panels.length - 1);
    //   const max = ScrollTrigger.maxScroll(window);
    //   const sectionPositions = sectionTriggers.map(
    //     (trigger) => trigger.start / max
    //   ); // snapping values must be in ratios
    //   panels.forEach((panel2, i) =>
    //     sectionPositions.push((start + i * each) / max)
    //   ); // add panel2 positions
    //   snap = ScrollTrigger.snapDirectional(sectionPositions); // directional snapping function
    // };
    // ScrollTrigger.addEventListener("refresh", updateSnap);

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

    let headings = gsap.utils.toArray(".h2");
    headings.forEach((heading, i) => {
      gsap.fromTo(
        heading,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: heading,
            start: "top 80%",
            end: "top 30%",
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
            end: "top 20%",
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
            snap: (!isMobileDevice()) ? true : false,
          },
        }
      );
    });
    
    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // ScrollTrigger.removeEventListener("refresh", updateSnap);
    };
  }, []);

  return (
    <div id="main2">
      <section className="testsect hero-banner">
        <Hero />
      </section>
      <section className="testsect section1">
        <div className="panel2 position-relative">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="https://www.ateliercologne.com/us_en/images/chapters/first/background-video-scroll.png"
            alt="Section 1"
          />
          <div className="text_reveal position-absolute">
            <h2 className="text-center text-white h2">Section 1</h2>
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
                      <h3 className="mainnn-header">EAU DE PARFUM</h3>
                      <h1 className="mainnn-title">Oriental Fragrance</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title fs-5">
                        In 20 years, there could be more plastic in our oceans
                        than fish.
                      </div>
                      <div className="mainnn-content__subtitle fs-5">
                        Plastic pollution injures more than 100.000 marine
                        animals every year.It takes around 450 years for one
                        plastic bottle to decompose.
                      </div>
                      <div className="moreee-menu pt-2">
                        <Link href=""className="fs-4">
                          Swipe to see more{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="-5" y1="12" x2="19" y2="12" />
                            <line x1="15" y1="16" x2="19" y2="12" />
                            <line x1="15" y1="8" x2="19" y2="12" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="centerrr">
                    <div className="right-side__img">
                      <img
                        className="bottle-bg"
                        src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2902&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                      />
                      <img
                        className="bottle-img"
                        src="https://www.designforfinland.com/product-images/Closca_Bottle_Wave_Antarctica_450ml_Close.png/2083089000004207012/1100x1100"
                      />
                    </div>
                  </div>
                </div>
                <div className="mainnn swiper-slide" id="savanna">
                  <div className="left-sideee">
                    <div className="mainnn-wrapper">
                      <h3 className="mainnn-header">CONCENTRATED PARFUM</h3>
                      <h1 className="mainnn-title">Dehn Al Oud</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title fs-5">
                        The Earth’s area affected by desertification is approx
                        11 times India’s size.
                      </div>
                      <div className="mainnn-content__subtitle fs-5">
                        The Savannas act as a carbon sink, absorbing CO2 from
                        the atmosphere and helping to maintain the balance of
                        global temperatures.
                      </div>
                      <div className="moreee-menu pt-2 fs-4">
                        <Link href="">
                          Shop Now{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="-5" y1="12" x2="19" y2="12" />
                            <line x1="15" y1="16" x2="19" y2="12" />
                            <line x1="15" y1="8" x2="19" y2="12" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="centerrr">
                    <div className="right-side__img">
                      <img
                        className="bottle-bg"
                        src="https://images.unsplash.com/photo-1613109526778-27605f1f27d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                        alt=""
                      />
                      <img
                        className="bottle-img"
                        src="https://fnac.sa/cdn/shop/files/Closca_Bottle_Wave_Sahara_600ml_Close.png?v=1703675684"
                      />
                    </div>
                  </div>
                </div>
                <div className="mainnn swiper-slide" id="glacier">
                  <div className="left-sideee">
                    <div className="mainnn-wrapper">
                      <h3 className="mainnn-header">DHAKOON</h3>
                      <h1 className="mainnn-title">Bakhoor</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title fs-5">
                        Glaciers contain 75% of the World's freshwater.
                      </div>
                      <div className="mainnn-content__subtitle fs-5">
                        The effects of melting ice glaciers are biodiversity
                        loss, the rising of the sea level and the deficiency of
                        freshwater, among others.
                      </div>
                      <div className="moreee-menu pt-2 fs-4">
                        <Link href="">
                          Shop Now{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="-5" y1="12" x2="19" y2="12" />
                            <line x1="15" y1="16" x2="19" y2="12" />
                            <line x1="15" y1="8" x2="19" y2="12" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="centerrr">
                    <div className="right-side__img">
                      <img
                        className="bottle-bg"
                        src="https://www.discover-the-world.com/app/uploads/2018/05/chile-patagonia-calving-glacier-is-1150x863-c-default.jpg"
                        alt=""
                      />
                      <img
                        className="bottle-img"
                        src="https://gomagcdn.ro/domains/alty.ro/files/product/original/sticla-reutilizabila-apa-closca-glacier-copie-848-7049.png"
                      />
                    </div>
                  </div>
                </div>
                <div className="mainnn swiper-slide" id="coral">
                  <div className="left-sideee">
                    <div className="mainnn-wrapper">
                      <h3 className="mainnn-header">GIFT SETS</h3>
                      <h1 className="mainnn-title">GIFT SETS</h1>
                      <h2 className="mainnn-subtitle">AED 39.90</h2>
                    </div>
                    <div className="mainnn-content">
                      <div className="mainnn-content__title fs-5">
                        We will have lost 60% of our coral reefs by 2030.
                      </div>
                      <div className="mainnn-content__subtitle fs-5">
                        Coral reefs are essential to humans, as they protect the
                        shorelines and are a source of nutrients and habitat for
                        thousands of marine species.
                      </div>
                      <div className="moreee-menu pt-2 fs-4">
                        <Link href="">
                          Shop Now{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="-5" y1="12" x2="19" y2="12" />
                            <line x1="15" y1="16" x2="19" y2="12" />
                            <line x1="15" y1="8" x2="19" y2="12" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="centerrr">
                    <div className="right-side__img">
                      <img
                        className="bottle-bg"
                        src="https://images.unsplash.com/photo-1546500840-ae38253aba9b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3260&q=80"
                        alt=""
                      />
                      <img
                        className="bottle-img"
                        src="https://fnac.sa/cdn/shop/files/Closca_Bottle_Wave_Arizona_600ml_Close.png?v=1703675684&width=1946"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
            src="https://www.ateliercologne.com/images/chapters/second/introduction/background@1x.jpg"
            alt="Section 2"
          />
          <div className="text_reveal position-absolute">
            <h2 className="text-center text-white h2">Section 2</h2>
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
        <div className="panel2 d-flex flex-column justify-content-center align-items-center text-center">
          <h2 className="mb-4 mb-md-2 ">Most Preferred Categories</h2>
          <div className="w-60 w-md-50">
            <video muted autoPlay loop className="w-100">
              <source
                type="video/mp4"
                src="https://www.ateliercologne.com/videos/chapters/first/heritage-16-9.mp4"
              />
            </video>
          </div>
        </div>
      </section>
      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}

      {/* <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div> */}
      <section className="testsect">
        <div className="panel2 position-relative">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="https://www.ateliercologne.com/images/chapters/third/introduction/background@1x.jpg"
            alt="Section 3"
          />
          <div className="text_reveal position-absolute">
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
        <div className="panel2 position-relative">
          <img
            className="zoom_img"
            style={{ width: "100%" }}
            src="https://www.ateliercologne.com/images/chapters/fourth/introduction/background@1x.jpg"
            alt="Section 4"
          />
          <div className="text_reveal position-absolute zoom_img">
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
            <video loop muted autoPlay className="w-100">
              <source
                src="https://www.ateliercologne.com/videos/chapters/fourth/stories/collection.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-center mt-4">
            <h3 className="text-center">
              Carefully <span>selected ingredients</span>
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
            </div>
          </div>
        </div>

        <div className="panel2 mt-5">
          <div className="inner2">
            <video loop muted autoPlay className="w-100">
              <source
                src="https://www.ateliercologne.com/videos/chapters/fourth/stories/second/intotheglassatelier_16x9.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        <div className="panel2 mt-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <h3 className="text-center">
              Carefully <span>selected ingredients</span>
            </h3>
            <p className="text-center px-3">
              From endemic species to renowned terroirs, we are particularly
              meticulous when it comes to sourcing our raw materials. While
              respecting the rhythms of nature, we commit to selecting only the
              highest-quality ingredients, imparting our perfumes with their
              rich olfactory facets.
            </p>
            <div className="mt-4">
              <img
                className="w-100"
                src="https://www.ateliercologne.com/images/chapters/fourth/stories/second/content/into-glass@1x.jpg"
                alt="Image 1"
              />
            </div>
          </div>
          <div className="inner2 mt-5">
            <Categories section="section4" />
          </div>
        </div>

        <div className="panel2 mt-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <h3 className="text-center">
              Carefully <span>selected ingredients</span>
            </h3>
            <p className="text-center px-3">
              From endemic species to renowned terroirs, we are particularly
              meticulous when it comes to sourcing our raw materials. While
              respecting the rhythms of nature, we commit to selecting only the
              highest-quality ingredients, imparting our perfumes with their
              rich olfactory facets.
            </p>
          </div>
          <div className="inner2 mt-4 d-flex flex-column flex-md-row justify-content-center">
            <img
              className="px-2 w-100 w-md-auto"
              src="https://www.ateliercologne.com/images/chapters/fourth/stories/second/visual/into-glass@1x.jpg"
              alt="Image 1"
            />
            <img
              className="px-2 w-100 w-md-auto"
              src="https://www.ateliercologne.com/images/chapters/fourth/stories/second/visual/into-glass@1x.jpg"
              alt="Image 2"
            />
          </div>
        </div>
      </section>

      {/* This is the Mobile Slider  */}
      <section className="MobileSlider mobilecontainer d-lg-none zoom_img">
        <div className="mobilepanel d-flex align-items-center">
          <div className="inner">
            <video loop muted autoPlay className="w-100">
              <source
                src="https://www.ateliercologne.com/videos/chapters/fourth/stories/collection.mp4"
                type="video/mp4"
              />
            </video>{" "}
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
            </div>
          </div>
        </div>

        <div className="mobilepanel">
          <div className="inner d-flex align-items-center">
            <video loop muted autoPlay className="w-100">
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
                  src="https://www.ateliercologne.com/images/chapters/fourth/stories/second/visual/into-glass@1x.jpg"
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
            <video loop muted autoPlay loading="lazy" className="w-100">
              <source
                src="https://www.ateliercologne.com/videos/chapters/fifth/art-of-gifting/art-of-boxing-video-16-9.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="col-lg-7 p-5 text-center order-3 order-md-1">
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
              loading="lazy"
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
