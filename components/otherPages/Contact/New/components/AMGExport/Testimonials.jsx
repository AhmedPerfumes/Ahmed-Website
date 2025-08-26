import React, { useState, useEffect } from 'react';
import styles from './AMGExport.module.css';

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const testimonials = [
        { text: "Partnering with Ahmed Al Maghribi has been a game-changer for our business. Their quality and brand recognition are unmatched in the luxury perfume market.", author: "- Jean-Pierre, Distributor, France" },
        { text: "The support from the export team is phenomenal. They truly feel like an extension of our own company and are invested in our success.", author: "- Fatima Al-Sayed, Retail Partner, KSA" },
        { text: "Our customers adore the unique scents. Ahmed Al Maghribi perfumes consistently fly off the shelves. The demand is incredible.", author: "- David Chen, Wholesaler, USA" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(current => (current + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <section className={styles.testimonialsSection}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Voices of Our Partners</h2>
                <div className={styles.testimonialWrapper}>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className={`${styles.testimonialItem} ${index === activeIndex ? styles.active : ''}`}>
                            <p>"{testimonial.text}"</p>
                            <p>{testimonial.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;