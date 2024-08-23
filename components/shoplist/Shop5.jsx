"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

export default function Shop5() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const sections = document.querySelectorAll("section");
    const scrolling = {
      enabled: true,
      events: "scroll,wheel,touchmove,pointermove".split(","),
      prevent: (e) => e.preventDefault(),
      disable() {
        if (scrolling.enabled) {
          scrolling.enabled = false;
          window.addEventListener("scroll", gsap.ticker.tick, { passive: true });
          scrolling.events.forEach((e, i) =>
            (i ? document : window).addEventListener(e, scrolling.prevent, {
              passive: false
            })
          );
        }
      },
      enable() {
        if (!scrolling.enabled) {
          scrolling.enabled = true;
          window.removeEventListener("scroll", gsap.ticker.tick);
          scrolling.events.forEach((e, i) =>
            (i ? document : window).removeEventListener(e, scrolling.prevent)
          );
        }
      }
    };

    function goToSection(section, anim) {
      if (scrolling.enabled) {
        scrolling.disable();
        gsap.to(window, {
          scrollTo: { y: section, autoKill: false },
          onComplete: scrolling.enable,
          duration: 0.1
        });

        anim && anim.restart();
      }
    }

    function setOpacity(section, value, duration) {
      gsap.to(section.querySelector(".content"), {
        opacity: value,
        duration: duration
      });
    }

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom-=1",
        end: "bottom top+=1",
        onEnter: () => {
          goToSection(section);
        },
        onEnterBack: () => {
          goToSection(section);
        }
      });

      ScrollTrigger.create({
        trigger: section,
        // markers: true,
        start: "center",
        end: "center",
        onEnter: () => {
          setOpacity(section, 1, 1);
        },
        onEnterBack: () => {
          setOpacity(section, 1, 1);
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      scrolling.enable(); // Ensure scrolling is enabled if component unmounts
    };
  }, []);

  return (
    <div>
      
    <section id="gift1" className="blue hero hero1 position-relative">
      <div className="content w-100 h-100 position-relative">
        <img
          className="w-100 h-100"
          src="https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Library-Sites-Guerlain_SharedLibrary/default/dwfa0745e9/home_page/2024/Skincare/OI/OI_BLACK/OI-BLACK-LOTION_HOMEPAGE-TILES_HOMEPAGE_DESKTOP.jpg?sfrm=jpg"
          alt=""
        />
        <div className="position-absolute top-50 end-0 translate-middle-y text-end me-4 p-5">
          <h2 className="text-white ">Your Text Here</h2>
          <h4 className="text-white">Your Subheading</h4>
          <button className="btn btn-outline-light rounded-pill">Discover</button>
        </div>
      </div>
    </section>
  
    <section id="gift2" className="blue hero hero1 position-relative">
      <div className="content w-100 h-100 position-relative">
        <img
          className="w-100 h-100"
          src="https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Library-Sites-Guerlain_SharedLibrary/default/dwe07c55fa/home_page/2022/Fragrance/Haute_Parfumerie/AM-OUDS_HOMEPAGE-TILE_HOMEPAGE_DESKTOP_CHERRY.jpg?sfrm=jpg"
          alt=""
        />
        <div className="position-absolute top-50 end-0 translate-middle-y text-end me-4  px-5">
          <h2 className="text-white">Your Text Here</h2>
          <button className="btn btn-outline-light rounded-pill">Discover</button>
        </div>
      </div>
    </section>
  
    <section id="gift3" className="blue hero hero1 position-relative">
      <div className="content w-100 h-100 position-relative">
        <img
          className="w-100 h-100"
          src="https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Library-Sites-Guerlain_SharedLibrary/default/dw06d07d41/home_page/2024/Fragrance/ABSOLUS_ALLEGORIA/ABSO-ALLEGORIA_HOMEPAGE-TILES_HOMEPAGE_DESKTOP_CUIR.jpg?sfrm=jpg"
          alt=""
        />
        <div className="position-absolute top-50 end-0 translate-middle-y text-end me-4 p-5">
          <h2 className="text-white">Your Text Here</h2>
          <button className="btn btn-outline-light rounded-pill">Discover</button>
        </div>
      </div>
    </section>
  
    <section id="gift4" className="green hero hero2 position-relative ">
      <div className="content w-100 position-relative">
        <img
          className="w-100"
          src="https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Library-Sites-Guerlain_SharedLibrary/default/dw8c8aa80a/home_page/2024/Skincare/AR/AR-TRIO-24_HOMEPAGE-TILES_HOMEPAGE_DESKTOP.jpg?sfrm=jpg"
          alt=""
        />
        <div className="position-absolute top-50 end-0 translate-middle-y text-end me-4 p-4">
          <h2 className="text-white">Your Text Here</h2>
          <button className="btn btn-outline-light rounded-pill">Discover</button>
        </div>
      </div>
    </section>
  
    <section id="gift5" className="purple hero hero3 position-relative">
      <div className="content w-100 position-relative">
        <img className="w-100" src="https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Library-Sites-Guerlain_SharedLibrary/default/dwc771d636/home_page/2024/MAKEUP/terracotta/TERRA-BLUSH_HOMEPAGE-TILES_HOMEPAGE_DESKTOP.jpg?sfrm=jpg" alt=""/>
        <div className="position-absolute top-50 end-0 translate-middle-y text-end me-4 p-4">
          <h2 className="text-white">Your Text Here</h2>
          <button className="btn btn-outline-light rounded-pill">Discover</button>
        </div>
      </div>  
    </section>

    {/* Navigation circle code */}
    
    <div className="position-fixed top-50 start-0 translate-middle-y px-5">
  <ul className="nav flex-column text-center">
    <li className="nav-item mb-3">
      <a
        className="nav-link p-2 text-white"
        href="#gift1"
      
      >
        
      </a>
    </li>
    <li className="nav-item mb-3">
      <a
        className="nav-link p-2 text-white"
        href="#gift2"
       
      >
        
      </a>
    </li>
    <li className="nav-item mb-3">
      <a
        className="nav-link p-2 text-white"
        href="#gift3"
      
      >
        
      </a>
    </li>
    <li className="nav-item mb-3">
      <a
        className="nav-link p-2 text-white"
        href="#gift4"
        
      >
        
      </a>
    </li>
    <li className="nav-item">
      <a
        className="nav-link p-2 text-white"
        href="#gift5"
      
      >
        
      </a>
    </li>
  </ul>
</div>

  </div>
  
  );
}
