import React from "react";
import { motion } from "framer-motion";
import "./ProductDescription.css";
import Image from "next/image";

const ProductDescription = ({ product }) => {
    if (!product) return null;

    const notes = [
        { 
            label: "TOP", 
            scriptTitle: "Top Notes", 
            text: product.note_1, 
            image: product.note_1_image 
        },
        { 
            label: "HEART", 
            scriptTitle: "Heart Notes", 
            text: product.note_2, 
            image: product.note_2_image 
        },
        { 
            label: "BASE", 
            scriptTitle: "Base Notes", 
            text: product.note_3, 
            image: product.note_3_image 
        },
    ].filter(note => note.text && note.image);

    if (notes.length === 0) return null;

    // Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.25 } },
    };

    const card = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const dot = {
        hidden: { scale: 0, opacity: 0 },
        show: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    };

    return (
        <div className="pd-container">
            {/* Main Title Section */}
            <motion.div
                className="pd-header"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h1 className="pd-main-title">FRAGRANCE NOTES</h1>
                <p className="pd-subtitle">
                    Fragrance Notes reveal the essence of a perfume, breaking down its scent journey from the first impression to the lingering aroma, helping you understand its personality and character.
                </p>
            </motion.div>

            {/* Timeline Header with connecting lines */}
            <motion.div
                className="pd-timeline"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="pd-timeline-line"></div>
                {notes.map((note, index) => (
                    <motion.div
                        className="pd-timeline-point"
                        key={index}
                        variants={dot}
                    >
                        <div className="pd-timeline-marker">
                            <span className="pd-timeline-label">{note.label}</span>
                            <div className="pd-dot"></div>
                            <div className="pd-connector"></div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Fragrance Notes Grid */}
            <motion.div
                className="pd-notes-grid"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                {notes.map((note, index) => (
                    <motion.div 
                        key={index} 
                        className="pd-note-card"
                        variants={card}
                    >
                        <div className="pd-image-container">
                            <Image
                                width={500}
                                height={500}
                                src={`${process.env.NEXT_PUBLIC_API_URL}storage/${note.image}`} 
                                alt={note.scriptTitle} 
                                className="pd-image" 
                            />
                        </div>
                        <h3 className="pd-card-script-title">{note.scriptTitle}</h3>
                        <div className="pd-card-content">
                            <p className="pd-card-text">{note.text}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default ProductDescription;
