"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import "./FindYourScent.css";

const STATS = [
  { num: "8", label: "Questions" },
  { num: "3 Min", label: "Your Time" },
  { num: "100%", label: "Personalised" },
];

export default function FindYourScentEntry() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section ref={ref} className="fys-entry" aria-label="Find Your Scent discovery tool">
      {/* Left: editorial image */}
      {/* <div className="fys-entry__visual">
        <img
          src="/images/quiz/reveal-hero.jpg"
          alt="Ahmed Al Maghribi Fragrances"
          className="fys-entry__visual-img"
        />
        <div className="fys-entry__visual-overlay" />
      </div> */}

      {/* Right: CTA content */}
      <div className="fys-entry__content">
        <motion.span
          className="fys-entry__eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          Personalised Discovery
        </motion.span>

        <motion.h2
          className="fys-entry__headline"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7, ease }}
        >
          Find Your<br /><em>Perfect Scent</em>
        </motion.h2>

        <motion.p
          className="fys-entry__body"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease }}
        >
          Answer a few questions and we'll match you with fragrances made for exactly who you are.
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="fys-entry__stats"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="fys-entry__stat">
              <span className="fys-entry__stat-num">{s.num}</span>
              <span className="fys-entry__stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6, ease }}
        >
          <Link href={`/${locale}/find-your-scent`} className="fys-entry__cta" id="fys-homepage-cta">
            Begin the Experience →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
