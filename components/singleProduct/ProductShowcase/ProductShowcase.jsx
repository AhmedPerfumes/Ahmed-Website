"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import "./KSeriesShowcase.css";

// Each era has a background colour taken from its bottle.
const ERAS = [
  {
    year: "2000",
    label: "K 2000",
    word: "THE ROOTS",
    tag: "The Roots",
    text: "Mr. Kafeel Ahmed’s beginnings: a return to authenticity, where every drop is a story of craftsmanship born from nature.",
    img: "/assets/images/kseries/bottle/past_center.png",
    bg: "radial-gradient(ellipse at 50% 55%, #ebcd9f 0%, #d5ab72 55%, #b8864c 100%)",
    ink: "#2b1a0a",
    accent: "#6b4420",
    ghost: "rgba(120, 76, 30, 0.2)",
  },
  {
    year: "2025",
    label: "K 2025",
    word: "THE ALCHEMY LAB",
    tag: "The Alchemy Lab",
    text: "Mr. Kafeel Ahmed’s creative evolution: science, soul and scent blended into a work of living art.",
    img: "/assets/images/kseries/bottle/present_center.png",
    bg: "radial-gradient(ellipse at 50% 55%, #f4e8c6 0%, #e3cc96 55%, #cbab63 100%)",
    ink: "#2a2412",
    accent: "#7a5d1c",
    ghost: "rgba(140, 108, 34, 0.2)",
  },
  {
    year: "2050",
    label: "K 2050",
    word: "THE BEYOND",
    tag: "The Beyond",
    text: "An olfactory glimpse into tomorrow, where scent becomes emotion: the ultimate expression of imagination and connection.",
    img: "/assets/images/kseries/bottle/future_center.png",
    bg: "radial-gradient(ellipse at 50% 55%, #dfe9f3 0%, #b5cadb 55%, #8ca7c0 100%)",
    ink: "#0f1e2d",
    accent: "#2d4a66",
    ghost: "rgba(45, 74, 102, 0.18)",
  },
];

const EASE = [0.22, 1, 0.36, 1];

// dir: 1 = moving to the next era, -1 = previous
// The big word is split into letters; each letter rises out of a mask.
const wordV = {
  enter: {},
  center: { transition: { staggerChildren: 0.045, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};
const letterV = {
  enter: { y: "115%" },
  center: { y: "0%", transition: { duration: 0.9, ease: EASE } },
  exit: { y: "-115%", transition: { duration: 0.5, ease: EASE } },
};
const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
});
const bottleV = {
  enter: (d) => ({ x: d * 180, y: d === 0 ? -90 : 0, opacity: 0, rotate: d * 22, scale: 0.88 }),
  center: {
    x: 0, y: 0, opacity: 1, rotate: 0, scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 16, mass: 1, delay: 0.15 },
  },
  exit: (d) => ({
    x: d * -180, opacity: 0, rotate: d * -22, scale: 0.88,
    transition: { duration: 0.5, ease: EASE },
  }),
};
const copyV = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.25 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

export default function ProductShowcase() {
  const locale = useLocale();
  const t = useTranslations();
  const reduce = useReducedMotion();
  const [[i, dir], setState] = useState([1, 0]); // dir 0 = first entrance
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });
  const era = ERAS[i];
  const baseUrl = `/${locale}/k-series/`;

  const go = (n, d) => setState([(n + ERAS.length) % ERAS.length, d]);
  const next = () => go(i + 1, 1);
  const prev = () => go(i - 1, -1);
  const [paused, setPaused] = useState(false);
  const AUTO_MS = 4500;

  // auto-advance; any manual change (i) restarts the timer
  useEffect(() => {
    if (!inView || paused || reduce) return;
    const id = setTimeout(() => {
      if (document.hidden) return;
      setState(([cur]) => [(cur + 1) % ERAS.length, 1]);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [i, inView, paused, reduce]);

  const jump = (n) => n !== i && go(n, n > i ? 1 : -1);

  const onDragEnd = (_, info) => {
    if (info.offset.x < -60) next();
    if (info.offset.x > 60) prev();
  };

  // pointer parallax: text and bottle drift in opposite directions
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const ghostX = useTransform(sx, (v) => v * -26);
  const ghostY = useTransform(sy, (v) => v * -10);
  const bottleX = useTransform(sx, (v) => v * 18);
  const bottleY = useTransform(sy, (v) => v * 10);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section
      ref={sectionRef}
      className="pks product-showcase-section"
      style={{ "--ink": era.ink, "--accent": era.accent, "--ghost": era.ghost }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
    >
      {/* all backgrounds stay mounted and cross-fade */}
      {ERAS.map((e, n) => (
        <div
          key={e.year}
          className={`pks__bg${n === i ? " is-on" : ""}`}
          style={{ background: e.bg }}
          aria-hidden="true"
        />
      ))}
      <div className="pks__pattern" aria-hidden="true" />

      <motion.div className="pks__head" {...(inView ? fadeUp(0.1) : { initial: { opacity: 0 } })}>
        <h2 className="pks__title">K-Series</h2>
        <p className="pks__sub">Three eras, one signature collection</p>
      </motion.div>

      {/* stage mounts when the section scrolls into view, so the entrance plays on screen */}
      {inView && (
        <div className="pks__stage">
          {/* word behind the bottle: letters rise out of a mask */}
          <AnimatePresence custom={dir} mode="popLayout">
            <motion.div
              key={"g-" + era.year}
              className="pks__ghostPos"
              variants={wordV}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <motion.div className="pks__ghost" aria-hidden="true" style={{ x: ghostX, y: ghostY }}>
                {era.word.split("").map((ch, n) => (
                  <span className="pks__mask" key={n}>
                    <motion.span className="pks__letter" variants={letterV}>
                      {ch === " " ? " " : ch}
                    </motion.span>
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence custom={dir} mode="popLayout">
            <motion.div
              key={"b-" + era.year}
              className="pks__bottlePos"
              custom={dir}
              variants={bottleV}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <motion.div style={{ x: bottleX, y: bottleY }}>
                <motion.div
                  className="pks__bottle"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.35}
                  onDragStart={() => setPaused(true)}
                  onDragEnd={(e, info) => { setPaused(false); onDragEnd(e, info); }}
                  whileHover={reduce ? undefined : { scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                >
                  <motion.div
                    initial={{ rotate: 11 }}
                    animate={reduce ? { rotate: 11 } : { y: [0, -12, 0], rotate: [11, 9.5, 11] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Link href={baseUrl + era.year} draggable={false} className="pks__bottleLink">
                      <Image
                        src={era.img}
                        alt={era.tag + " bottle"}
                        width={300}
                        height={600}
                        priority
                        draggable={false}
                        className="pks__img"
                      />
                      {/* light sweep, clipped to the bottle's own silhouette */}
                      <span
                        className="pks__shine"
                        aria-hidden="true"
                        style={{
                          WebkitMaskImage: "url(" + era.img + ")",
                          maskImage: "url(" + era.img + ")",
                        }}
                      />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
              <div className="pks__shadow" aria-hidden="true" />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={"c-" + era.year}
              className="pks__copy"
              variants={copyV}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <span className="pks__label">{era.label}</span>
              <p className="pks__text">{era.text}</p>
            </motion.div>
          </AnimatePresence>

          <motion.div className="pks__ctaWrap" {...fadeUp(1.1)}>
            <Link href={baseUrl + era.year} className="pks__cta">
              <span>{t("Discover")} {era.tag}</span>
            </Link>
          </motion.div>
        <motion.div className="pks__controls" dir="ltr" {...fadeUp(1.3)}>
          <button type="button" className="pks__arrow" onClick={prev} aria-label="Previous">‹</button>
          <div className="pks__dashes">
            {ERAS.map((e, n) => (
              <button
                key={e.year}
                type="button"
                className={"pks__dash" + (n === i ? " is-active" : "")}
                onClick={() => jump(n)}
                aria-label={"Show " + e.tag}
                aria-current={n === i}
              />
            ))}
          </div>
          <button type="button" className="pks__arrow" onClick={next} aria-label="Next">›</button>
        </motion.div>
        </div>
      )}
    </section>
  );
}
