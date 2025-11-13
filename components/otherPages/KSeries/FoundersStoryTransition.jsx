// components/otherPages/KSeries/FoundersStoryTransition.jsx

"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap'
import styles from './HeroSection.module.css';

const BACKGROUND_IMAGE = "/assets/images/kseries/shop-bnr.jpg";
const FOUNDER_IMAGE = "/assets/images/kseries/founder-1.jpg";

export default function FoundersStoryTransition() {
    const sectionRef = useRef(null);

    // Track scroll over a large range (e.g., 100vh scroll height)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Vertical Parallax: Moves background 40% over the entire scroll range
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    // Blur Effect: Max blur happens when the content is centered (scrollYProgress = 0.5)
    const blur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 2, 0]);
    const blurFilter = useTransform(blur, (b) => `blur(${b}px)`);

    return (
        // The scroll container is 100vh to give the fixed background movement range.
        <section ref={sectionRef} className="position-relative overflow-hidden" style={{ zIndex: -1000 }}>
            
            {/* 1. Fixed Parallax Background (Full Screen) */}
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ y: backgroundY, filter: blurFilter }}>
                <Image
                    src={BACKGROUND_IMAGE}
                    alt="Founder's personal collection"
                    fill
                    sizes="100vw"
                    priority={true}
                    style={{ objectFit: "cover", objectPosition: "center center" }}
                    className={styles.heroImage}
                />
                
                {/* Dark Scrim for Readability */}
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}  />
            </div>

            {/* 2. Small, Centered Content Block */}
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{  position: 'relative',  zIndex: 10, marginTop: '12rem', marginBottom: '12rem',  }}>
                <motion.div
                    // Animation to fade/slide in when section is in view
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }} // Only animate once
                    
                    className="text-light text-center p-5 p-md-5"
                    style={{
                        maxWidth: '1300px', // Restrict width to keep text focused
                        width: '100%',
                        backgroundColor: 'rgba(5, 5, 5, 0.96)', 
                        borderRadius: '4px',
                        border: '1px solid rgba(212, 175, 55, 0.4)', // Faint gold border
                        boxShadow: '0 0 70px rgba(0,0,0,0.9), 0 0 20px rgba(212, 175, 55, 0.3)', // Gold glow shadow
                    }}
                >
                    {/* <h2 className={`mb-3 ${styles.serifFont} ${styles.textGold}`}>The Founder's Legacy</h2>
                    <p className={`fs-5 ${styles.sansFont} ${styles.textChampagne}`}>
                        Marking 25 years of Ahmed Al Maghribi Perfumes, the K-Series is a personal signature of
                        Mr. Kafeel Ahmed. Each fragrance represents a chapter in his lifelong journey — a bridge between heritage, mastery, and imagination.
                    </p> */}
                    {/* 1. Full-Length Heading Div */}
                    <div className="text-center mb-5 pb-4" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        <h2 className={`mb-0 ${styles.serifFont} text-light`} style={{ fontSize: '3rem', letterSpacing: '0.15em' }}>
                            The Founder's Legacy
                        </h2>
                    </div>
                    {/* Founder Image & Brief Bio */}
                    <Row className="g-5 g-md-5 align-items-center"> 
                        
                        {/* 30% Left: Image and Bio */}
                        <Col xs={12} md={4} lg={3} className="text-center">
                            
                            {/* Image Container (Square) */}
                            <div className="mx-auto mb-4" style={{ position: 'relative', width: '100%', maxWidth: '250px', aspectRatio: '1/1' }}>
                                <div className="p-2" style={{ border: '4px solid #D4AF37', height: '100%', width: '100%' }}>
                                    <Image
                                        src={FOUNDER_IMAGE}
                                        alt="Mr. Kafeel Ahmed, Founder and Master Perfumer"
                                        fill
                                        sizes="(max-width: 768px) 60vw, 300px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                            
                            {/* Bio Text */}
                            <h3 className={`${styles.textGold} mb-1`} style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                                Mr. Kafeel Ahmed
                            </h3>
                            <p className={`mb-0 ${styles.textChampagne}`} style={{ opacity: 0.8, fontSize: '1.1rem' }}>
                                Founder, Visionary, and Master Perfumer
                            </p>
                        </Col>

                        {/* 70% Right: Curated Message */}
                        <Col xs={12} md={8} lg={20}>
                            <p className={`fs-5 ${styles.sansFont} ${styles.textChampagne}`} style={{ lineHeight: 1.1, textAlign: 'left', textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>
                                <strong>Marking 25 years</strong> of Ahmed Al Maghribi Perfumes, the K-Series stands as the personal signature of Mr. Kafeel Ahmed.
                                <br/><br/>
                                This distinguished trilogy - The Roots (<strong>2000</strong>), The Alchemy Lab (<strong>2025</strong>), and The Beyond (<strong>2050</strong>)Meticulously composed from the world’s finest ingredients, immortalizes his lifelong dedication to perfumery: A bridge between heritage, mastery, innovation, and the ultimate vision of scent's future.
                                <br/><br/>
                                From The Roots to The Beyond, The K-Series immortalizes the journey of Mr. Kafeel Ahmed, celebrating his mastery across time - Past, Present, and Future. Each fragrance is not just a scent, but a story of evolution, dedication, and passion - A true embodiment of The Founder’s Legacy.
                            </p>
                        </Col>
                    </Row>
                </motion.div>
            </Container>
        </section>
    );
}