"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { scrollToNext } from "./ewdScroll";

const translations = {
  en: {
    label: "Find Your Scent Tie-In",
    heading: "Which Scent",
    headingEm: "Are You?",
    sub: "Three questions. Flip each card, pick your answer — you can always change it before moving on.",
    nextBtn: "Next →",
    cards: [
      {
        id: "ewd-quiz-card-1",
        nextId: "ewd-quiz-card-2",
        icon: "✨",
        qLabel: "Personality",
        question: "If your personality was a fragrance note — are you bold like Oud, sweet like Rose, or fresh like Citrus?",
        hint: "Tap a card to answer",
        backTitle: "Choose Your Note",
        type: "scent",
        options: [
          { emoji: "🪵", name: "Oud",    desc: "Bold · Deep · Powerful",      key: "Oud" },
          { emoji: "🌹", name: "Rose",   desc: "Romantic · Feminine · Warm",  key: "Rose" },
          { emoji: "🍋", name: "Citrus", desc: "Fresh · Bright · Energetic",  key: "Citrus" },
        ],
      },
      {
        id: "ewd-quiz-card-2",
        nextId: "ewd-quiz-card-3",
        icon: "👑",
        qLabel: "Bestseller Guess",
        question: "Which Ahmed Al Maghribi collection do you think is our best-seller for women?",
        hint: "Take a guess — you can change your pick",
        backTitle: "Which One?",
        type: "bestseller",
        options: [
          { name: "Bidun Esam",   badge: "Mystery" },
          { name: "Shaikhahind", badge: "Royal" },
          { name: "Niswa",       badge: "Heritage" },
        ],
        answer: "Niswa",
        reveal: "🌹 Niswa is our most beloved women's fragrance — a romantic heart of rose and jasmine that captures the essence of the Emirati woman.",
      },
      {
        id: "ewd-quiz-card-3",
        nextId: "ewd-journal",
        icon: "🎁",
        qLabel: "Gift Preference",
        question: "When choosing a gift for a special woman, do you look for something traditional like Dakhoon, or a modern Concentrated Parfum?",
        hint: "Tell us your preference",
        backTitle: "Your Gift Style",
        type: "gift",
        placeholder: "What makes your perfect gift, and why?",
      },
    ],
    traditional: "Traditional — Dakhoon",
    modern: "Modern — Concentrated Parfum",
    submitText: "✦ Submit My Answer",
    submitted: "✅ Noted — moving forward…",
  },
  ar: {
    label: "اكتشفي عطركِ",
    heading: "أي عطر",
    headingEm: "أنتِ؟",
    sub: "ثلاثة أسئلة. اقلبي كل بطاقة واختاري إجابتكِ — يمكنكِ دائماً تغييرها قبل الانتقال.",
    nextBtn: "التالي →",
    cards: [
      {
        id: "ewd-quiz-card-1",
        nextId: "ewd-quiz-card-2",
        icon: "✨",
        qLabel: "شخصيتكِ",
        question: "لو كانت شخصيتكِ نوتة عطرية — هل أنتِ جريئة كالعود، حلوة كالورد، أم منعشة كالحمضيات؟",
        hint: "اضغطي على بطاقة للإجابة",
        backTitle: "اختاري نوتتكِ",
        type: "scent",
        options: [
          { emoji: "🪵", name: "العود",     desc: "جريء · عميق · قوي",           key: "العود" },
          { emoji: "🌹", name: "الورد",     desc: "رومانسي · أنثوي · دافئ",       key: "الورد" },
          { emoji: "🍋", name: "الحمضيات", desc: "منعش · مشرق · حيوي",           key: "الحمضيات" },
        ],
      },
      {
        id: "ewd-quiz-card-2",
        nextId: "ewd-quiz-card-3",
        icon: "👑",
        qLabel: "خمّني الأكثر مبيعاً",
        question: "أي مجموعة من أحمد المغربي تعتقدين أنها الأكثر مبيعاً للنساء؟",
        hint: "خمّني — يمكنكِ تغيير اختيارك",
        backTitle: "أيّها؟",
        type: "bestseller",
        options: [
          { name: "بدون اسم",  badge: "غموض" },
          { name: "شيخة هند", badge: "ملكي" },
          { name: "نسوة",     badge: "تراث" },
        ],
        answer: "نسوة",
        reveal: "🌹 نسوة هو عطرنا الأكثر حباً للنساء — قلب رومانسي من الورد والياسمين يجسّد روح المرأة الإماراتية.",
      },
      {
        id: "ewd-quiz-card-3",
        nextId: "ewd-journal",
        icon: "🎁",
        qLabel: "تفضيل الهدية",
        question: "عند اختيار هدية لامرأة مميزة، هل تبحثين عن شيء تقليدي كالدخون أم عطر مركز عصري؟",
        hint: "أخبرينا بتفضيلكِ",
        backTitle: "أسلوب هديتكِ",
        type: "gift",
        placeholder: "ما الذي يجعل هديتكِ مثالية، ولماذا؟",
      },
    ],
    traditional: "تقليدي — دخون",
    modern: "عصري — عطر مركز",
    submitText: "✦ أرسلي إجابتي",
    submitted: "✅ شكراً — ننتقل للأمام…",
  },
};

/* ── SHARED NEXT BUTTON ─────────────────────────────────────────────────────── */
function NextButton({ show, nextId, label, onNext }) {
  if (!show) return null;
  return (
    <motion.button
      className="ewd-quiz-next-btn"
      onClick={() => {
        if (onNext) onNext();
        scrollToNext(nextId, 400);
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  );
}

/* ── SCENT PERSONALITY CARD ─────────────────────────────────────────────────── */
function ScentCard({ card, t, isFlipped, onFlip, onScentChoice }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (opt) => {
    setSelected(opt.key);           // Always changeable — just update
    if (onScentChoice) onScentChoice(opt.key);
  };

  return (
    <div className={`ewd-flip-card ${isFlipped ? "is-flipped" : ""}`} id={card.id}
      onClick={() => !isFlipped && onFlip()}>
      <div className="ewd-flip-card__inner">
        {/* FRONT */}
        <div className="ewd-flip-card__front">
          <div className="ewd-flip-card__icon">{card.icon}</div>
          <div className="ewd-flip-card__q-label">{card.qLabel}</div>
          <p className="ewd-flip-card__question">{card.question}</p>
          <div className="ewd-flip-card__hint">{card.hint}</div>
        </div>
        {/* BACK */}
        <div className="ewd-flip-card__back">
          <div className="ewd-flip-back-header">
            <span className="ewd-flip-back-title">{card.backTitle}</span>
            <button className="ewd-flip-back-close"
              onClick={(e) => { e.stopPropagation(); onFlip(true); }}>✕</button>
          </div>
          <div className="ewd-scent-options">
            {card.options.map((opt) => (
              <button
                key={opt.key}
                className={`ewd-scent-option ${selected === opt.key ? "selected" : ""}`}
                onClick={(e) => { e.stopPropagation(); handleSelect(opt); }}
              >
                <span className="ewd-scent-option__emoji">{opt.emoji}</span>
                <span className="ewd-scent-option__text">
                  <span className="ewd-scent-option__name">{opt.name}</span>
                  <span className="ewd-scent-option__desc">{opt.desc}</span>
                </span>
                {selected === opt.key && (
                  <span style={{ marginLeft: "auto", color: "var(--ewd-rose)", fontWeight: 800 }}>✓</span>
                )}
              </button>
            ))}
          </div>
          {/* Next button — only shows after a selection, triggers scroll */}
          <NextButton show={!!selected} nextId={card.nextId} label={t.nextBtn} />
        </div>
      </div>
    </div>
  );
}

/* ── BESTSELLER CARD ────────────────────────────────────────────────────────── */
function BestsellerCard({ card, t, isFlipped, onFlip }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (name) => {
    setSelected(name);   // Always changeable
    setRevealed(false);  // Reset reveal if they change answer
  };

  const handleNext = () => {
    setRevealed(true);   // Show the reveal when they click Next
  };

  return (
    <div className={`ewd-flip-card ${isFlipped ? "is-flipped" : ""}`} id={card.id}
      onClick={() => !isFlipped && onFlip()}>
      <div className="ewd-flip-card__inner">
        <div className="ewd-flip-card__front">
          <div className="ewd-flip-card__icon">{card.icon}</div>
          <div className="ewd-flip-card__q-label">{card.qLabel}</div>
          <p className="ewd-flip-card__question">{card.question}</p>
          <div className="ewd-flip-card__hint">{card.hint}</div>
        </div>
        <div className="ewd-flip-card__back">
          <div className="ewd-flip-back-header">
            <span className="ewd-flip-back-title">{card.backTitle}</span>
            <button className="ewd-flip-back-close"
              onClick={(e) => { e.stopPropagation(); onFlip(true); }}>✕</button>
          </div>
          <div className="ewd-bestseller-options">
            {card.options.map((opt) => {
              let cls = "ewd-bestseller-option";
              if (revealed && selected) {
                if (opt.name === card.answer) cls += " correct";
                else if (opt.name === selected) cls += " wrong";
              } else if (opt.name === selected) {
                cls += " selected";
              }
              return (
                <button key={opt.name} className={cls}
                  onClick={(e) => { e.stopPropagation(); if (!revealed) handleSelect(opt.name); }}>
                  <span className="ewd-bestseller-option__name">{opt.name}</span>
                  <span className="ewd-bestseller-option__badge">{opt.badge}</span>
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {revealed && (
              <motion.div className="ewd-bestseller-reveal"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {card.reveal}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Next button — reveals answer AND scrolls to card 3 */}
          <NextButton show={!!selected && !revealed} nextId={card.nextId} label={t.nextBtn} onNext={handleNext} />
          {/* After reveal, show Next again to continue */}
          <NextButton show={revealed} nextId={card.nextId} label={t.nextBtn} />
        </div>
      </div>
    </div>
  );
}

/* ── GIFT CARD ──────────────────────────────────────────────────────────────── */
function GiftCard({ card, t, isFlipped, onFlip }) {
  const [choice, setChoice] = useState(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = text.trim().length >= 5;

  const handleSubmit = () => {
    setSubmitted(true);
    scrollToNext(card.nextId, 700);
  };

  return (
    <div className={`ewd-flip-card ${isFlipped ? "is-flipped" : ""}`} id={card.id}
      onClick={() => !isFlipped && onFlip()}>
      <div className="ewd-flip-card__inner">
        <div className="ewd-flip-card__front">
          <div className="ewd-flip-card__icon">{card.icon}</div>
          <div className="ewd-flip-card__q-label">{card.qLabel}</div>
          <p className="ewd-flip-card__question">{card.question}</p>
          <div className="ewd-flip-card__hint">{card.hint}</div>
        </div>
        <div className="ewd-flip-card__back">
          <div className="ewd-flip-back-header">
            <span className="ewd-flip-back-title">{card.backTitle}</span>
            <button className="ewd-flip-back-close"
              onClick={(e) => { e.stopPropagation(); onFlip(true); }}>✕</button>
          </div>
          <div className="ewd-gift-toggle" onClick={(e) => e.stopPropagation()}>
            <button className={`ewd-gift-toggle__btn ${choice === "traditional" ? "active" : ""}`}
              onClick={() => setChoice("traditional")} disabled={submitted}>
              🕯️ {t.traditional}
            </button>
            <button className={`ewd-gift-toggle__btn ${choice === "modern" ? "active" : ""}`}
              onClick={() => setChoice("modern")} disabled={submitted}>
              🌸 {t.modern}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={(e) => e.stopPropagation()}>
                <textarea className="ewd-gift-textarea" placeholder={card.placeholder}
                  value={text} onChange={(e) => setText(e.target.value)} rows={3} />
                <button className="ewd-quiz-submit" onClick={handleSubmit}
                  disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.42 }}>
                  {t.submitText}
                </button>
              </motion.div>
            ) : (
              <motion.div key="done" className="ewd-journal__submitted-msg"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {t.submitted}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN EXPORT ────────────────────────────────────────────────────────────── */
export default function EWDScentQuiz({ onScentChoice }) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;
  const [flipped, setFlipped] = useState([false, false, false]);

  const handleFlip = (idx, forceClose = false) => {
    setFlipped((prev) => {
      const next = [...prev];
      next[idx] = forceClose ? false : !prev[idx];
      return next;
    });
  };

  return (
    <section id="ewd-quiz" className="ewd-section ewd-quiz" dir={isRtl ? "rtl" : "ltr"}>
      <div className="ewd-container">
        <motion.div className="ewd-quiz__header"
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="ewd-section-label">{t.label}</div>
          <h2 className="ewd-heading">{t.heading} <em>{t.headingEm}</em></h2>
          <p className="ewd-subheading" style={{ margin: "0 auto" }}>{t.sub}</p>
        </motion.div>

        <div className="ewd-quiz__grid">
          {t.cards.map((card, i) => {
            const props = {
              card, t,
              isFlipped: flipped[i],
              onFlip: (forceClose) => handleFlip(i, forceClose),
            };
            if (card.type === "scent")
              return <ScentCard key={i} {...props} onScentChoice={onScentChoice} />;
            if (card.type === "bestseller")
              return <BestsellerCard key={i} {...props} />;
            if (card.type === "gift")
              return <GiftCard key={i} {...props} />;
            return null;
          })}
        </div>
      </div>
    </section>
  );
}
