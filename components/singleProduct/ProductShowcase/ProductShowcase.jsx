import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const backgroundVariants = {
  initial: { opacity: 0.2 },
  animate: { opacity: 1, transition: { duration: 1.2 } },
  exit: { opacity: 0.2, transition: { duration: 0.6 } }
};

const GRADIENT_OVERLAY = "linear-gradient(180deg, rgba(10, 10, 10, 0.6) 0%, rgba(26, 26, 26, 0.9) 100%)";
const HIGHLIGHT_COLOR = "#e5d4b2";
const GLOW_COLOR = HIGHLIGHT_COLOR;

export default function FamilySection({ data = {} }) {
  const locale = useLocale();
  const t = useTranslations();
  const baseUrl = `${process.env.NEXT_PUBLIC_DEFAULT_ORIGIN}/${locale}/k-series/`;
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setIsMobile(true);
        setDeviceType("mobile");
      } else if (w <= 1536) {
        setIsMobile(false);
        setDeviceType("laptop");
      } else {
        setIsMobile(false);
        setDeviceType("desktop");
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    { 
      label: "K 2000",
      imgCenter: "/assets/images/kseries/bottle/past_center.png",
      imgLeft: "/assets/images/kseries/bottle/past_left.png",
      imgRight: "/assets/images/kseries/bottle/past_right.png",
      nameImg: "/assets/images/2000.svg",
      link: `${baseUrl}2000`,
      bgImg: "https://admin.ahmedalmaghribi.com/public/storage/banners/the-roots-background.jpg"
    },
    { 
      label: "K 2025",
      imgCenter: "/assets/images/kseries/bottle/present_center.png",
      imgLeft: "/assets/images/kseries/bottle/present_left.png",
      imgRight: "/assets/images/kseries/bottle/present_right.png",
      nameImg: "/assets/images/2025.svg",
      link: `${baseUrl}2025`,
      bgImg: "https://admin.ahmedalmaghribi.com/public/storage/banners/the-alchemy-lab-background.jpg"
    },
    { 
      label: "K 2050",
      imgCenter: "/assets/images/kseries/bottle/future_center.png",
      imgLeft: "/assets/images/kseries/bottle/future_left.png",
      imgRight: "/assets/images/kseries/bottle/future_right.png",
      nameImg: "/assets/images/2050.svg",
      link: `${baseUrl}2050`,
      bgImg: "https://admin.ahmedalmaghribi.com/public/storage/banners/the-beyond-background.jpg"
    }
  ];

  const [active, setActive] = useState(1);
  const rotateRight = () => setActive((prev) => (prev + 1) % 3);
  const rotateLeft = () => setActive((prev) => (prev + 2) % 3);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -60) rotateRight(); 
    if (info.offset.x > 60) rotateLeft();   
  };

  const getPosition = (index) => {
    if (index === active) return "center";
    if ((active + 1) % 3 === index) return "right"; 
    return "left";
  };

  const xOffset = deviceType === "mobile" ? 120 : deviceType === "laptop" ? 210 : 300;
  const centerScale = deviceType === "mobile" ? 1.1 : deviceType === "laptop" ? 1.15 : 1.3;
  const sideScale = deviceType === "mobile" ? 0.8 : deviceType === "laptop" ? 0.75 : 0.8;

  const positions = {
    center: { x: 0, z: 0, rotateY: 0, scale: centerScale, opacity: 1, zIndex: 10 },
    left: { x: -xOffset, z: -300, rotateY: 15, scale: sideScale, opacity: 0.4, zIndex: 5 },
    right: { x: xOffset, z: -300, rotateY: -15, scale: sideScale, opacity: 0.4, zIndex: 5 }
  };

  const currentBgImg = items[active].bgImg;
  const currentLabel = items[active].label;
  if (!mounted) return null;
  return (
    <>
      <style>{`
        .carousel-container-3d { 
          perspective: 1500px; 
          width: 100%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
        }
        .carousel-wrapper { 
          position: relative; 
          width: 100%; 
          height: 480px; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          transform-style: preserve-3d; 
        }
        .carousel-item-container { 
          position: absolute; 
          width: 260px; 
          height: 420px; 
          transform-style: preserve-3d; 
        }
        .carousel-item-container:not(.active) { 
          pointer-events: none; 
        }
        .product-showcase-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 25px;
          position: relative;
          z-index: 20;
        }
        .product-showcase-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(229, 212, 178, 0.08);
          border: 1px solid rgba(229, 212, 178, 0.55);
          color: #e5d4b2;
          padding: 12px 36px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          text-decoration: none;
        }
        .product-showcase-btn:hover {
          background: #e5d4b2;
          color: #121212;
          border-color: #e5d4b2;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(229, 212, 178, 0.4);
        }
        .product-showcase-btn svg {
          transition: transform 0.3s ease;
        }
        .product-showcase-btn:hover svg {
          transform: translateX(4px);
        }
        [dir="rtl"] .product-showcase-btn:hover svg {
          transform: translateX(-4px);
        }
        .swiper-like-button {
          position: absolute;
          top: 50%;
          width: 44px;
          height: 44px;
          margin-top: -22px;
          z-index: 50;
          cursor: pointer;
          background: none;
          border: none;
        }
        .swiper-like-button::after {
          font-size: 38px;
          color: #e5d4b2;
          font-weight: bold;
        }
        .swiper-like-prev {
          left: 2%;
        }
        .swiper-like-prev::after {
          content: "‹";
        }
        .swiper-like-next {
          right: 2%;
        }
        .swiper-like-next::after {
          content: "›";
        }

        @media (max-width: 768px) { 
          .carousel-item-container { 
            width: 150px; 
            height: 260px; 
          } 
          .carousel-wrapper { 
            height: 280px; 
          } 
          .product-showcase-inner { 
            padding-top: 2rem !important; 
          }
          .product-showcase-bottom {
            margin-top: 15px !important;
          }
        }

        /* ═══════════════════════════════════════════════════════════════════
           PRODUCT SHOWCASE (K-SERIES) - LAPTOP COMPACT STYLING
           ═══════════════════════════════════════════════════════════════════ */

        @media (min-width: 992px) and (max-width: 1536px) {
          .product-showcase-section {
            height: auto !important;
            min-height: 85vh !important;
            padding: 3rem 0 3.5rem 0 !important;
          }
          .product-showcase-inner {
            padding-top: 2rem !important;
            margin-top: 0.5rem !important;
          }
          .carousel-wrapper {
            height: 330px !important;
            min-height: 330px !important;
          }
          .carousel-item-container {
            width: 175px !important;
            height: 280px !important;
          }
          .product-showcase-bottom {
            margin-top: 28px !important;
          }
          .product-showcase-divider {
            width: 45px !important;
            margin: 0 auto 12px auto !important;
          }
          .product-showcase-name-img {
            width: 140px !important;
            height: 48px !important;
          }
          .product-showcase-btn-wrap {
            margin-top: 14px !important;
            padding: 0 !important;
          }
          .product-showcase-btn {
            padding: 10px 30px !important;
            font-size: 0.74rem !important;
            letter-spacing: 2px !important;
          }
          .swiper-like-button {
            width: 36px !important;
            height: 36px !important;
            margin-top: -18px !important;
          }
          .swiper-like-button::after {
            font-size: 28px !important;
          }
        }

        /* Mid-size laptops (≤1366px) */
        @media (min-width: 992px) and (max-width: 1366px) {
          .product-showcase-section {
            padding: 2.5rem 0 3rem 0 !important;
          }
          .carousel-wrapper {
            height: 300px !important;
            min-height: 300px !important;
          }
          .carousel-item-container {
            width: 160px !important;
            height: 255px !important;
          }
          .product-showcase-bottom {
            margin-top: 24px !important;
          }
          .product-showcase-name-img {
            width: 125px !important;
            height: 42px !important;
          }
          .product-showcase-btn-wrap {
            margin-top: 12px !important;
          }
          .product-showcase-btn {
            padding: 9px 26px !important;
            font-size: 0.7rem !important;
          }
        }

        /* Smaller laptops (≤1200px) */
        @media (min-width: 992px) and (max-width: 1200px) {
          .product-showcase-section {
            padding: 2rem 0 2.5rem 0 !important;
          }
          .carousel-wrapper {
            height: 280px !important;
            min-height: 280px !important;
          }
          .carousel-item-container {
            width: 145px !important;
            height: 230px !important;
          }
          .product-showcase-bottom {
            margin-top: 20px !important;
          }
          .product-showcase-name-img {
            width: 110px !important;
            height: 38px !important;
          }
          .product-showcase-btn-wrap {
            margin-top: 10px !important;
          }
          .product-showcase-btn {
            padding: 8px 22px !important;
            font-size: 0.66rem !important;
          }
        }
      `}</style>

      <div className="product-showcase-section" style={{ position: "relative", color: "white", minHeight: "100vh", width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        
        {/* Background Layer */}
        <AnimatePresence initial={false}>
          <motion.div key={currentBgImg} variants={backgroundVariants} initial="initial" animate="animate" exit="exit" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}>
              <Image src={currentBgImg} alt="bg" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          </motion.div>
        </AnimatePresence>
        
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2, background: GRADIENT_OVERLAY }} />

        <div className="container text-center product-showcase-inner" style={{ position: "relative", zIndex: 10, width: "100%", paddingTop: "3rem" }}>
          <div className="carousel-container-3d">
            <div className="carousel-wrapper">
              {items.map((item, index) => {
                const pos = getPosition(index);
                const isCenter = index === active;
                
                return (
                  <motion.div
                    key={index}
                    className={`carousel-item-container ${isCenter ? 'active' : ''}`}
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    animate={positions[pos]}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    style={{ cursor: isCenter ? "grab" : "default", userSelect: 'none' }}
                  >
                    {/* Glow Component */}
                    {isCenter && (
                      <motion.div 
                        animate={{ opacity: 1 }} initial={{ opacity: 0 }}
                        style={{
                          position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%',
                          borderRadius: '50%', backgroundColor: GLOW_COLOR,
                          filter: `blur(60px) opacity(0.25)`, zIndex: -1,
                          transform: "translateZ(-50px)"
                        }}
                      />
                    )}

                    <Link href={item.link} style={{ display: 'block', height: '100%', position: 'relative', transformStyle: "preserve-3d" }}>
                      
                      {/* CENTER IMAGE LAYER */}
                      <motion.div
                        initial={false}
                        animate={{ opacity: pos === "center" ? 1 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ position: "absolute", inset: 0 }}
                      >
                        <Image src={item.imgCenter} fill sizes="(max-width: 768px) 150px, (max-width: 1536px) 175px, 260px" style={{ objectFit: "contain" }} alt="center" priority />
                      </motion.div>

                      {/* LEFT IMAGE LAYER */}
                      <motion.div
                        initial={false}
                        animate={{ opacity: pos === "left" ? 1 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ position: "absolute", inset: 0 }}
                      >
                        <Image src={item.imgLeft} fill sizes="(max-width: 768px) 150px, (max-width: 1536px) 175px, 260px" style={{ objectFit: "contain" }} alt="left" />
                      </motion.div>

                      {/* RIGHT IMAGE LAYER */}
                      <motion.div
                        initial={false}
                        animate={{ opacity: pos === "right" ? 1 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ position: "absolute", inset: 0 }}
                      >
                        <Image src={item.imgRight} fill sizes="(max-width: 768px) 150px, (max-width: 1536px) 175px, 260px" style={{ objectFit: "contain" }} alt="right" />
                      </motion.div>

                    </Link>
                  </motion.div>
                );
              })}

              <button
                className="swiper-like-button swiper-like-prev"
                onClick={rotateLeft}
                aria-label="Previous"
              >
              </button>

              <button
                className="swiper-like-button swiper-like-next"
                onClick={rotateRight}
                aria-label="Next"
              >
              </button>
            </div>
          </div>

          {/* Bottom Details Section with Guaranteed Clearance */}
          <div className="product-showcase-bottom">
            <motion.div
              className="product-showcase-divider"
              style={{
                width: "60px",
                height: "1px",
                background: `linear-gradient(to right, transparent, ${HIGHLIGHT_COLOR}, transparent)`,
                margin: "0 auto 16px auto",
              }}
            />      

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={currentLabel}
              transition={{ delay: 0.1 }}
              className="d-flex flex-column align-items-center"
            >
              <div
                className="product-showcase-name-img"
                style={{
                  position: "relative",
                  width: isMobile ? "150px" : "220px",
                  height: "70px",
                }}
              >
                <Image
                  src={items[active].nameImg}
                  alt={currentLabel}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 150px, (max-width: 1536px) 140px, 220px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="d-flex flex-column align-items-center product-showcase-btn-wrap"
              style={{ marginTop: "16px" }}
            >
              <Link href={`/${locale}/k-series`}>
                <button className="product-showcase-btn">
                  <span>{t("Discover")}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </motion.div>
          </div>
          
        </div>
      </div>
    </>
  );
}
