'use client';

import { gsap } from "gsap";
import { useRef, useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from '@gsap/react';

const Test = () => {

  // const containerRef = useRef(null);

  const textRef = useRef(null);

  // const testRef = useRef(null);

  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, useGSAP, gsap);

    // const elementt = testRef.current;

    // ScrollTrigger.create({
    //   trigger: elementt,
    //   start: 'top center', // Start the trigger when the top of the section hits the center of the viewport
    //   onEnter: () => {
    //     gsap.to(window, {
    //       scrollTo: { y: element.offsetTop + element.offsetHeight, autoKill: false },
    //       duration: 1
    //     });
    //   },
    // });

    gsap.from('#page2 .banner2', {
      scale: 0.85,
      duration: 2,
      delay: 1,
      scrollTrigger: {
        trigger: '#page2',
        scroller: 'body',
        markers: true,
        start: 'top 0%',
        end: 'top -20%',
        scrub: true,
        pin: true,
        snap: 1,
      },
    });

    gsap.from('#page4 .banner3', {
      scale: 0.85,
      duration: 1,
      delay: 1,
      scrollTrigger:{
          trigger: '#page4',
          // scroller: "body",
          // markers: true,
          start: "top 0%",
          end: "top -100%",
          scrub: true,
          pin: true
      
      }
    });

    let section=gsap.utils.toArray(".panel");
    gsap.to(section, {
        xPercent: -100 * (section.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: "#page5",
          pin: true,
          scrub: true,
          snap: 1 / (section.length - 1),
          end: () => "+=" + document.querySelector("#page5").offsetWidth
        }
    });

    gsap.from('#page6 .banner4', {
      scale: 0.85,
      duration: 1,
      delay: 1,
      scrollTrigger: {
        trigger: '#page6',
        // scroller: 'body',
        // markers: true,
        start: 'top 0%',
        end: 'top -100%',
        scrub: true,
        pin: true,
        snap: 1,
      },
    });

    // const container = containerRef.current;
    // const sections = container.querySelectorAll('.panel');

    // gsap.from(sections, {
    //   xPercent: -100 * (sections.length - 1),
    //   ease: 'none',
    //   scrollTrigger: {
    //     trigger: container,
    //     pin: true,
    //     scrub: 1,
    //     end: '+=3500',
    //   },
    // });

    // const element = textRef.current;

    // // Fade in from bottom on scroll down
    // gsap.fromTo(element,
    //   { opacity: 0, y: 50 },
    //   {
    //     opacity: 1, y: 0,
    //     scrollTrigger: {
    //       trigger: element,
    //       start: 'top 80%',
    //       end: 'top 60%',
    //       toggleActions: 'play none none reverse',
    //       scrub: true,
    //     }
    //   }
    // );

    // // Fade out to bottom on scroll up
    // gsap.to(element,
    //   {
    //     opacity: 0, y: 50,
    //     scrollTrigger: {
    //       trigger: element,
    //       start: 'top 60%',
    //       end: 'top 40%',
    //       toggleActions: 'play reverse none reverse',
    //       scrub: true,
    //     }
    //   }
    // );

    return () => {
      // Clean up the animation when the component unmounts
      ScrollTrigger.getAll().forEach((trigger) => {
        gsap.killTweensOf(trigger.scroller);
        trigger.kill();
      });
    };
  });

  return (
    <>
      <section id="page2">
        <img
          className="banner2"
          src="/assets/images/background-video-scroll.webp"
          alt="Test Image"
        />
        <div className="overlay-text">
          <h2>CHAPTER 01</h2>
          <h1>Scented Art Crafted from Nature</h1>
          <p ref={textRef}>
            Atelier Cologne Paris, surrounded by perfumers and artists, celebrates and passes on the historical craftsmanship behind our exceptional fragrances.
            In the atelier, the gestures of our experts driven by a creative emulation, transform nature into art and reinvent the traditional Cologne. Our perfumed creations, sublimations of vibrant nature, revealing emotions, bear the imprint of authentic, innovative, and elegant French perfumery.
          </p>
        </div>
      </section>

      <section id="page3">
        <h1 className="title2">Scented Art Crafted from Nature</h1>
        <div className="video">
          <video loop muted autoPlay>
            <source src="/assets/videos/heritage-16-9.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section id="page4">
        <img
          className="banner3"
          src="/assets/images/background-video-scroll.webp"
          alt="Test Image"
        />
        <div className="overlay-text">
          <h2>CHAPTER 01</h2>
          <h1>Scented Art Crafted from Nature</h1>
          <p>
            Atelier Cologne Paris, surrounded by perfumers and artists, celebrates and passes on the historical craftsmanship behind our exceptional fragrances.
            In the atelier, the gestures of our experts driven by a creative emulation, transform nature into art and reinvent the traditional Cologne. Our perfumed creations, sublimations of vibrant nature, revealing emotions, bear the imprint of authentic, innovative, and elegant French perfumery.
          </p>
        </div>
      </section>

      <section id="page5">
        <div className="containerrr panel">
          <div className="left-div">
            <video loop muted autoPlay>
              <source src="/assets/videos/collections.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="right-div">
            <h1>Carefully selected ingridients</h1>
          </div>
        </div>
        <div className="red panel">
          <video loop muted autoPlay>
            <source src="/assets/videos/collections.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section id="page6">
        <img
          className="banner4"
          src="/assets/images/background-video-scroll.webp"
          alt="Test Image"
        />
        <div className="overlay-text">
          <h2>CHAPTER 01</h2>
          <h1>Scented Art Crafted from Nature</h1>
          <p>
            Atelier Cologne Paris, surrounded by perfumers and artists, celebrates and passes on the historical craftsmanship behind our exceptional fragrances.
            In the atelier, the gestures of our experts driven by a creative emulation, transform nature into art and reinvent the traditional Cologne. Our perfumed creations, sublimations of vibrant nature, revealing emotions, bear the imprint of authentic, innovative, and elegant French perfumery.
          </p>
        </div>
      </section>

      {/* <div className='containerrrr' ref={containerRef}>
        <section className="panel">
          <img src="https://www.ahmed-perfume.com/wp-content/uploads/elementor/thumbs/Summer-Collection-Pearl-Oud-Web-Banner--qqk4eslfgvaoav5ye2bqy6speyygsurz6r5o78xg7s.jpg" alt="Test Image 1"/>
        </section>
        <section className="panel">
          <img src="https://www.ahmed-perfume.com/wp-content/uploads/elementor/thumbs/Wholesale-Banner--qqw8f9da9ekpar681y53k8nfyp2ou6npx1pmtbmezc.jpg" alt="Test Image 2"/>
        </section>
        <section className="panel">
          <img src="https://www.ahmed-perfume.com/wp-content/uploads/elementor/thumbs/laathani-website-banner-qlv6f9inql5p7sh8jk7cccerut6g81dp5armakjmfs.jpg" alt="Test Image 3"/>
        </section>
        <section className="panel">
          <img src="https://www.ahmed-perfume.com/wp-content/uploads/elementor/thumbs/banner-qrmci5d54yxs9ghlcq1bq3scoxs7k4kxjslyt0fmmw.jpg" alt="Test Image 4"/>
        </section>
        <section className="panel">
          <img src="https://www.ahmed-perfume.com/wp-content/uploads/elementor/thumbs/Summer-Collection-Pearl-Oud-Web-Banner--qqk4eslfgvaoav5ye2bqy6speyygsurz6r5o78xg7s.jpg" alt="Test Image 5"/>
        </section>
      </div> */}
    </>
  )
}


export default Test;