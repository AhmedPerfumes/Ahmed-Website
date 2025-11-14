// components/otherPages/KSeries/KSeriesProductCards.jsx

"use client";
import React from "react";
import Image from "next/image";
import styles from "./KSeriesProductCards.module.css";
import { useRouter } from "next/navigation";

// Re-using the product data from KSeriesScrollSection
const slidesData = [
  {
    id: "past",
    image: "/assets/images/kseries/PAST_mobile.jpg",
    title: "The Roots",
    subtitle: "2000",
    description: "Raw, authentic, and timeless—the foundation of our legacy.",
    themeClass: "theme-past",
  },
  {
    id: "present",
    image: "/assets/images/kseries/PRESENT_mobile.jpg",
    title: "The Alchemy Lab",
    subtitle:"2025",
    description: "Precision, innovation, and modern artistry in a single scent.",
    themeClass: "theme-present",
  },
  {
    id: "future",
    image: "/assets/images/kseries/FUTURE_mobile.jpg",
    title: "The Beyond",
    subtitle: "2050",
    description: "A visionary composition, radiant light, and the spirit of tomorrow.",
    themeClass: "theme-future",
  },
];

const ProductCard = ({ data, onClick }) => {
  const { image, title, subtitle, description, themeClass } = data;

  return (
    <div className={`${styles.card} ${styles[themeClass]}`} onClick={() => onClick(data)}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
          className={styles.productImage}
        />
        {/* Subtle inner shadow/vignette */}
        <div className={styles.vignette}></div>
      </div>
      <div className={styles.content}>
        <span className={styles.subtitle}>{subtitle}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <button className={styles.ctaButton} onClick={(e) => { e.stopPropagation(); onClick(data); }}>Discover More</button>
      </div>
    </div>
  );
};

export default function KSeriesProductCards() {
    const router = useRouter();
    const handleCardClick = (productData) => {
    let routeSegment;
    switch (productData.id) {
        case 'past':
            routeSegment = '2000';
            break;
        case 'present':
            routeSegment = '2025';
            break;
        case 'future':
            routeSegment = '2050';
            break;
        default:
            console.error("Unknown product ID:", productData.id);
            return; // Exit if ID is unexpected
    }
    // Construct the path: /en/K-Series/[routeSegment]
    const path = `/en/K-Series/${routeSegment}`;

    // Redirect the user
    router.push(path);
  };
  return (
        <section id="k-series-product-cards" className={styles.productCardsSection}>
        <div className={styles.header}>
            <h2 className={styles.mainTitle}>
            Legacy Crafted <span className={styles.goldText}>Through Time.</span>
            </h2>
            <p className={styles.subText}>
            Explore the iconic scents that define the K-Series: The founders signature collection.
            </p>
        </div>

        <div className={styles.cardsContainer}>
            {slidesData.map((slide) => (
            <ProductCard key={slide.id} data={slide} onClick={handleCardClick}/>
            ))}
        </div>
        </section>
  );
}
