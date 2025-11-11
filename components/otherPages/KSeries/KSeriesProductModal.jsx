// components/otherPages/KSeries/KSeriesProductModal.jsx

"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./KSeriesProductModal.module.css";

// Mock Data Structure (replace with actual data fetching/passing)
const mockProductDetails = {
  past: {
    cost: "AED 349",
    fragranceNotes: "Oud, Sandalwood, Amber, Spices, Incense",
    longDescription:
      "A rich, authentic scent that captures the heritage of the K-Series. Its complex blend of classic Eastern notes offers a deep, timeless aroma, embodying raw craftsmanship and enduring legacy. A true foundation scent.",
    themeClass: "theme-past",
  },
  present: {
    cost: "AED 399",
    fragranceNotes: "Bergamot, Iris, Violet, Leather, Patchouli",
    longDescription:
      "Precision meets modern luxury. This purplish-themed composition is sharp, innovative, and perfectly balanced. It represents the golden era of perfumery, blending tradition with futuristic complexity.",
    themeClass: "theme-present",
  },
  future: {
    cost: "AED 429",
    fragranceNotes: "Aquatic Accords, White Musk, Neon Woods, Ozone",
    longDescription:
      "A visionary scent of tomorrow. Radiant, clean, and ethereal, K-Series 2050 utilizes abstract notes to create a composition that feels like pure light and space. It's the spirit of the future bottled.",
    themeClass: "theme-future",
  },
};

export default function KSeriesProductModal({ product, onClose }) {
  if (!product) return null;

  const details = mockProductDetails[product.id] || mockProductDetails.past;
  const imageSrc = product.image;
  const themeClass = details.themeClass;
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
        onClose();
        setIsSubmitted(false);
    }, 2500);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modalContent} ${styles[themeClass]}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        {/* Left Panel: Image */}
        <div className={styles.leftPanel}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
              className={styles.productImage}
              priority // For faster loading of the main product image
            />
          </div>
        </div>
            
        {/* Right Panel: Details and Form */}
        <div className={styles.rightPanel}>
            <div className={styles.infoBlock}>
                <h1 className={styles.title}>{product.title}</h1>
                <p className={styles.cost}>{details.cost}</p>
                <hr className={styles.divider} />

                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.description}>{details.longDescription}</p>

                <h3 className={styles.sectionTitle}>Fragrance Notes</h3>
                <p className={styles.notes}>{details.fragranceNotes}</p>
            </div>
            
            <div className={styles.formSection}> {/* NEW WRAPPER FOR FORM */}
                <h2 className={styles.formTitle}>Secure Your Pre-Booking</h2>
                
                {isSubmitted ? (
                    <div className={styles.successMessage}>
                        <p>✅ Thank You! Your pre-booking for **{product.title}** has been secured. We'll be in touch soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.bookingForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="quantity">Quantity</label>
                            <input type="number" id="quantity" name="quantity" defaultValue="1" min="1" required />
                        </div>
                        
                        <p className={styles.finePrint}>
                            By submitting, you agree to receive updates regarding the K-Series launch.
                        </p>

                        <button type="submit" className={styles.submitButton}>
                            Pre-Book Now
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}