"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { scrollToNext } from "./ewdScroll";

const WOMEN_COLLECTIONS = [
  "Niswa", "Shaikhahind", "Bidun Esam", "Lana", "Fatima",
  "Lamsat Harir", "Mukhallat Laila", "Bint Al Arab",
];

const translations = {
  en: {
    label: "Celebrating Emirati Heritage",
    heading: "Your Story,",
    headingEm: "Told In Scent",
    sub: "Fragrance is memory. Share your most beautiful olfactive moments from the UAE.",
    cards: [
      {
        id: "ewd-journal-card-1",
        nextId: "ewd-journal-card-2",
        icon: "🕌",
        cardLabel: "Heritage Memory",
        question: "Fragrance is a huge part of our heritage. What is your earliest memory of a beautiful scent growing up in the UAE?",
        placeholder: "Perhaps the warm bakhoor drifting from a neighbour's house on a Friday morning, or your grandmother's rose water in the kitchen…",
        type: "text",
        submit: "Share My Memory",
        submitted: "✅ A beautiful memory — scrolling forward…",
      },
      {
        id: "ewd-journal-card-2",
        nextId: "ewd-trivia",
        icon: "👑",
        cardLabel: "Inspiring Women",
        question: "Who is an Emirati woman that inspires you, and if you could gift her any Ahmed Al Maghribi fragrance today, what would it be?",
        placeholder: "Write her name and what inspires you about her…",
        type: "text-product",
        selectLabel: "Choose a fragrance for her",
        submit: "Share My Tribute",
        submitted: "✅ A beautiful tribute — taking you to the next activity…",
      },
    ],
    selectDefault: "Select a fragrance…",
  },
  ar: {
    label: "الاحتفاء بالإرث الإماراتي",
    heading: "قصّتكِ،",
    headingEm: "تُروى بالعطر",
    sub: "العطر ذاكرة. شاركينا أجمل لحظاتك العطرية في الإمارات.",
    cards: [
      {
        id: "ewd-journal-card-1",
        nextId: "ewd-journal-card-2",
        icon: "🕌",
        cardLabel: "ذكرى التراث",
        question: "العطر جزء أصيل من تراثنا. ما هي أول ذكرى عطرية جميلة لكِ وأنتِ تكبرين في الإمارات؟",
        placeholder: "ربما البخور الدافئ يتسرّب من بيت جارٍ صباح الجمعة، أو ماء ورد جدّتكِ في المطبخ…",
        type: "text",
        submit: "شاركي ذكراكِ",
        submitted: "✅ شكراً — ننتقل للأمام…",
      },
      {
        id: "ewd-journal-card-2",
        nextId: "ewd-trivia",
        icon: "👑",
        cardLabel: "إلهام المرأة",
        question: "من هي المرأة الإماراتية التي تلهمكِ؟ وإذا أمكنكِ إهداؤها عطراً من أحمد المغربي اليوم، ماذا ستختارين؟",
        placeholder: "اكتبي اسمها وما الذي يلهمكِ فيها…",
        type: "text-product",
        selectLabel: "اختاري عطراً لها",
        submit: "شاركي إهداءكِ",
        submitted: "✅ إهداء رائع — ننتقل للنشاط التالي…",
      },
    ],
    selectDefault: "اختاري عطراً…",
  },
};

function JournalCard({ card, idx, selectDefault }) {
  const [text, setText] = useState("");
  const [product, setProduct] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = text.trim().length > 10 && (card.type === "text" || product);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    scrollToNext(card.nextId, 900);
  };

  return (
    <motion.div
      id={card.id}
      className="ewd-journal__card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: idx * 0.18 }}
    >
      <div className="ewd-journal__card-icon">{card.icon}</div>
      <div className="ewd-journal__card-label">{card.cardLabel}</div>
      <p className="ewd-journal__card-question">{card.question}</p>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {card.type === "text-product" && (
              <select
                className="ewd-journal__product-select"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option value="">{selectDefault}</option>
                {WOMEN_COLLECTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
            <textarea
              className="ewd-journal__textarea"
              placeholder={card.placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
            />
            <motion.button
              className="ewd-journal__submit"
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{ opacity: canSubmit ? 1 : 0.45 }}
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
            >
              ✦ {card.submit}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            className="ewd-journal__submitted-msg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {card.submitted}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EWDHeritageJournal() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;

  return (
    <section id="ewd-journal" className="ewd-section ewd-journal" dir={isRtl ? "rtl" : "ltr"}>
      <div className="ewd-journal__bg-text" aria-hidden="true">ذاكرة</div>
      <div className="ewd-container">
        <motion.div
          className="ewd-journal__header"
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

        <div className="ewd-journal__grid">
          {t.cards.map((card, i) => (
            <JournalCard key={i} card={card} idx={i} selectDefault={t.selectDefault} />
          ))}
        </div>
      </div>
    </section>
  );
}
