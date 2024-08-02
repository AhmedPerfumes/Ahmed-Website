'use client';
import { useRef, useState, useEffect } from "react";
import { motion, useTransform, useScroll } from 'framer-motion';

const Test3 = () => {
    return (
        <div className="bg-dark">
            <HorizontalScrollCarousel />
        </div>
    );
};

const HorizontalScrollCarousel = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="position-relative" style={{ height: "50vh", "background-color": "#171717" }}>
        <div className="d-flex align-items-center overflow-hidden" style={{ position: "sticky", top: 0 }}>
            <motion.div style={{ x, gap: "1rem" }} className="d-flex">
            {cards.map((card) => {
                return <Card card={card} key={card.id} />;
            })}
            </motion.div>
        </div>
        </section>
    );
};

const Card = ({ card }) => {
    return (
        <div
        key={card.id}
        className="position-relative overflow-hidden group" style={{ height: "450px", width: "450px", "background-color": "#e5e5e5" }}
        >
            <div
                style={{
                backgroundImage: `url(${card.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                top: 0, right: 0, bottom: 0, left: 0, transition: "transform 0.3s"
                }}
                className="position-absolute z-index-0"
            >
            </div>
        </div>
    );
};

  const cards = [
    {
      url: "/assets/images/1.jpg",
      title: "Title 1",
      id: 1,
    },
    {
      url: "/assets/images/2.jpg",
      title: "Title 2",
      id: 2,
    },
    {
      url: "/assets/images/3.jpg",
      title: "Title 3",
      id: 3,
    },
    {
      url: "/assets/images/4.jpg",
      title: "Title 4",
      id: 4,
    },
    {
      url: "/assets/images/5.jpg",
      title: "Title 5",
      id: 5,
    },
    {
      url: "/assets/images/6.jpg",
      title: "Title 6",
      id: 6,
    },
    {
      url: "/assets/images/7.jpg",
      title: "Title 7",
      id: 7,
    },
  ];

export default Test3;