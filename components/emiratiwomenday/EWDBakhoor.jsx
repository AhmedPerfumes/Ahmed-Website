"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { scrollToNext } from "./ewdScroll";

const TIMES = [
  {
    id: "morning",
    emoji: "🌅",
    gradient: "linear-gradient(145deg, #FF9A5C 0%, #FFC07A 50%, #FFD4A0 100%)",
  },
  {
    id: "afternoon",
    emoji: "☀️",
    gradient: "linear-gradient(145deg, #C9956C 0%, #E8B07A 50%, #F5C890 100%)",
  },
  {
    id: "evening",
    emoji: "🌙",
    gradient: "linear-gradient(145deg, #4A2060 0%, #7B3FA0 40%, #9B5AC0 100%)",
  },
  {
    id: "midnight",
    emoji: "⭐",
    gradient: "linear-gradient(145deg, #0A0212 0%, #1A0830 50%, #2A1050 100%)",
  },
];

const translations = {
  en: {
    label: "Bakhoor & Dakhoon Heritage",
    heading: "When Do You",
    headingEm: "Scent Your Home?",
    sub: "Bakhoor and Dakhoon are staples in Emirati hospitality. Tell us your favourite ritual.",
    times: {
      morning: {
        label: "Morning Dew",
        desc: "Golden hour",
        mood: "Warm & Awakening",
        heading: "The Morning Ritual",
        text: "As the light filters through mashrabiyya screens and the home stirs awake — the gentle curl of bakhoor smoke is the perfect companion to your morning coffee.",
        products: ["Bakhoor Al Oud", "Mukhallat Sabah"],
      },
      afternoon: {
        label: "Golden Hour",
        desc: "Peak of day",
        mood: "Rich & Inviting",
        heading: "Afternoon Warmth",
        text: "When guests arrive for coffee and dates, the welcoming warmth of dakhoon fills the majlis — a tradition as old as Emirati hospitality itself.",
        products: ["Dakhoon Al Malaki", "Bakhoor Rose Oud"],
      },
      evening: {
        label: "Evening Prayer",
        desc: "After Maghrib",
        mood: "Sacred & Serene",
        heading: "The Sacred Hour",
        text: "After Maghrib, as the family gathers and the world slows — the deep, meditative smoke of bakhoor creates a sanctuary of calm and reflection.",
        products: ["Oud Al Layl", "Mukhallat Laila"],
      },
      midnight: {
        label: "Midnight",
        desc: "Still of night",
        mood: "Deep & Mysterious",
        heading: "Midnight Mystique",
        text: "In the silence of the night, when the stars are out and the world belongs only to you — a single coal of dakhoon fills the room with mystery and depth.",
        products: ["Oud Al Asyad", "Dakhoon Lilith"],
      },
    },
    textarea: "Tell us your bakhoor ritual — what do you light, and why?",
    submit: "Share My Ritual",
    submitted: "✅ A beautiful tradition — thank you for sharing.",
    shop: "Shop Bakhoor & Dakhoon →",
    products: "Products we love for this time:",
  },
  ar: {
    label: "تراث البخور والدخون",
    heading: "متى تُعطّرين",
    headingEm: "منزلكِ؟",
    sub: "البخور والدخون ركيزتان من ركائز الضيافة الإماراتية. أخبرينا عن طقوسكِ المفضّلة.",
    times: {
      morning: {
        label: "صباح الندى",
        desc: "الساعة الذهبية",
        mood: "دافئ ومنعش",
        heading: "طقوس الصباح",
        text: "حين يتسلل الضوء عبر نوافذ المشربية والمنزل يتنهد من النوم — دخان البخور الهادئ الرفيق المثالي لقهوة الصباح.",
        products: ["بخور العود", "مخلط الصباح"],
      },
      afternoon: {
        label: "الساعة الذهبية",
        desc: "ذروة النهار",
        mood: "دافئ ومرحّب",
        heading: "دفء الظهيرة",
        text: "حين يحلّ الضيوف على القهوة والتمر، تملأ رائحة الدخون المجلس بالترحيب — تقليد قديم بقدم الضيافة الإماراتية.",
        products: ["دخون الملكي", "بخور الورد والعود"],
      },
      evening: {
        label: "صلاة المغرب",
        desc: "بعد المغرب",
        mood: "روحاني وهادئ",
        heading: "الساعة المقدسة",
        text: "بعد صلاة المغرب، حين تجتمع الأسرة ويهدأ العالم — يُحيل دخان البخور العميق المكانَ إلى ملاذ من الهدوء والتأمل.",
        products: ["عود الليل", "مخلط ليلى"],
      },
      midnight: {
        label: "منتصف الليل",
        desc: "سكون الليل",
        mood: "عميق وغامض",
        heading: "سحر منتصف الليل",
        text: "في صمت الليل حين تتلألأ النجوم والعالم لكِ وحدكِ — جمرة واحدة من الدخون تملأ الغرفة بالغموض والعمق.",
        products: ["عود الأسياد", "دخون ليليث"],
      },
    },
    textarea: "أخبرينا عن طقوس بخوركِ — ماذا تشعلين، ولماذا؟",
    submit: "شاركي طقوسكِ",
    submitted: "✅ تقليد جميل — شكراً لمشاركتكِ.",
    shop: "تسوّقي البخور والدخون ←",
    products: "منتجاتنا المُحبَّبة لهذا الوقت:",
  },
};

export default function EWDBakhoor() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;
  const [activeTime, setActiveTime] = useState("evening");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const timeData = t.times[activeTime];
  const timeVisual = TIMES.find((tt) => tt.id === activeTime);

  return (
    <section id="ewd-bakhoor" className="ewd-section ewd-bakhoor" dir={isRtl ? "rtl" : "ltr"}>
      <div className="ewd-container">
        {/* Header */}
        <motion.div
          className="ewd-bakhoor__header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="ewd-section-label">{t.label}</div>
          <h2 className="ewd-heading">
            {t.heading} <em>{t.headingEm}</em>
          </h2>
          <p className="ewd-subheading" style={{ margin: "0 auto" }}>{t.sub}</p>
        </motion.div>

        {/* Time Selector */}
        <div className="ewd-time-selector">
          {TIMES.map((time) => {
            const td = t.times[time.id];
            return (
              <motion.button
                key={time.id}
                className={`ewd-time-btn ${activeTime === time.id ? "active" : ""}`}
                onClick={() => setActiveTime(time.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                id={`ewd-time-${time.id}`}
              >
                <span className="ewd-time-btn__emoji">{time.emoji}</span>
                <span className="ewd-time-btn__label">{td.label}</span>
                <span className="ewd-time-btn__desc">{td.desc}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Time Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTime}
            className="ewd-time-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Visual */}
            <div className="ewd-time-panel__visual">
              <div
                className="ewd-time-panel__gradient"
                style={{ background: timeVisual?.gradient }}
              >
                <div className="ewd-time-panel__icon">{timeVisual?.emoji}</div>
                <div className="ewd-time-panel__time-label">{timeData.mood}</div>
              </div>
            </div>

            {/* Content */}
            <div className="ewd-time-panel__content">
              <div className="ewd-time-panel__mood">{timeData.mood}</div>
              <h3 className="ewd-time-panel__heading">{timeData.heading}</h3>
              <p className="ewd-time-panel__desc">{timeData.text}</p>

              {/* Recommended products */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ewd-rose)", display: "block", marginBottom: 10 }}>
                  {t.products}
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {timeData.products.map((p) => (
                    <span
                      key={p}
                      style={{
                        background: "var(--ewd-glass)",
                        border: "1px solid var(--ewd-border2)",
                        borderRadius: 50,
                        padding: "6px 14px",
                        fontSize: 13,
                        color: "var(--ewd-rose-light)",
                        fontWeight: 600,
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              {!submitted ? (
                <>
                  <textarea
                    className="ewd-bakhoor-textarea"
                    placeholder={t.textarea}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                  />
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <motion.button
                      className="ewd-journal__submit"
                      onClick={() => {
                        if (text.trim().length > 5) {
                          setSubmitted(true);
                          scrollToNext("ewd-finale", 900);
                        }
                      }}
                      disabled={text.trim().length <= 5}
                      style={{ opacity: text.trim().length > 5 ? 1 : 0.45 }}
                      whileHover={text.trim().length > 5 ? { scale: 1.02 } : {}}
                    >
                      ✦ {t.submit}
                    </motion.button>
                    <Link
                      href={`/${locale}/product-category/dakhoon`}
                      className="ewd-btn-outline"
                      style={{ fontSize: 12, padding: "10px 20px" }}
                      id="ewd-shop-dakhoon"
                    >
                      {t.shop}
                    </Link>
                  </div>
                </>
              ) : (
                <motion.div
                  className="ewd-journal__submitted-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {t.submitted}
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
