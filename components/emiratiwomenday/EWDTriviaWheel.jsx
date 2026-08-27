"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import QRCode from "react-qr-code";
import { scrollToNext } from "./ewdScroll";

// ─── WHEEL CONFIG (physical prizes for staff handover) ────────────────────────
const WHEEL_PRIZES_EN = [
  { label: "10% OFF Voucher", icon: "🏷️", color: "#C4596A", textColor: "#fff", physical: "10% discount voucher — hand to customer" },
  { label: "Free Sample",     icon: "🌹", color: "#F9D5DC", textColor: "#9E3348", physical: "Choose one fragrance sample from the tray" },
  { label: "Bakhoor Mini",    icon: "🕯️", color: "#FFE4EC", textColor: "#C4596A", physical: "Gift the bakhoor mini from the prizes box" },
  { label: "Gift Wrap Free",  icon: "🎁", color: "#E8849A", textColor: "#fff",    physical: "Free gift wrapping on their purchase today" },
  { label: "15% OFF Voucher", icon: "🏷️", color: "#9E3348", textColor: "#fff",    physical: "15% discount voucher — hand to customer" },
  { label: "Free Tote Bag",   icon: "👜", color: "#F3EAF9", textColor: "#B88FC8", physical: "Ahmed Al Maghribi tote bag from the display" },
  { label: "Try Again 🌸",   icon: "🌸", color: "#FDF3E3", textColor: "#C9904A", physical: null },
  { label: "Free Sample",     icon: "🌹", color: "#E8849A", textColor: "#fff",    physical: "Choose one fragrance sample from the tray" },
];

const WHEEL_PRIZES_AR = [
  { label: "خصم ١٠٪",         icon: "🏷️", color: "#C4596A", textColor: "#fff",    physical: "قسيمة خصم ١٠٪ — قدّمها للعميل" },
  { label: "عيّنة مجانية",     icon: "🌹", color: "#F9D5DC", textColor: "#9E3348", physical: "اختر عيّنة عطر من الطاولة" },
  { label: "بخور ميني",        icon: "🕯️", color: "#FFE4EC", textColor: "#C4596A", physical: "قدّم بخور ميني من صندوق الجوائز" },
  { label: "تغليف هدايا مجاني",icon: "🎁", color: "#E8849A", textColor: "#fff",    physical: "تغليف هدايا مجاني على مشتراهم اليوم" },
  { label: "خصم ١٥٪",         icon: "🏷️", color: "#9E3348", textColor: "#fff",    physical: "قسيمة خصم ١٥٪ — قدّمها للعميل" },
  { label: "حقيبة توت مجانية", icon: "👜", color: "#F3EAF9", textColor: "#B88FC8", physical: "حقيبة أحمد المغربي من العرض" },
  { label: "حاولي مجدداً 🌸", icon: "🌸", color: "#FDF3E3", textColor: "#C9904A", physical: null },
  { label: "عيّنة مجانية",     icon: "🌹", color: "#E8849A", textColor: "#fff",    physical: "اختر عيّنة عطر من الطاولة" },
];

const TWO_PI = Math.PI * 2;
const ARC = TWO_PI / 8;
const WHEEL_SIZE = 300;

function drawWheel(canvas, rotation, prizes) {
  const ctx = canvas.getContext("2d");
  const cx = WHEEL_SIZE / 2;
  const cy = WHEEL_SIZE / 2;
  const r = cx - 4;
  ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

  prizes.forEach((prize, i) => {
    const startAngle = rotation + i * ARC;
    const endAngle = startAngle + ARC;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = prize.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + ARC / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = prize.textColor;
    ctx.font = `bold 12px Inter, sans-serif`;
    ctx.fillText(prize.label, r - 12, 5);
    ctx.restore();
  });

  // Center cap
  ctx.beginPath();
  ctx.arc(cx, cy, 26, 0, TWO_PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "rgba(196, 89, 106, 0.45)";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = "#C4596A";
  ctx.font = `bold 10px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("SPIN", cx, cy + 4);
}

// ─── PRIZE MODAL (shown to staff after spin) ──────────────────────────────────
function PrizeModal({ prize, onClose, t }) {
  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(61,26,34,0.5)", backdropFilter: "blur(8px)",
        padding: 24,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={{
          background: "#fff", borderRadius: 28,
          padding: "48px 40px", maxWidth: 480, width: "100%",
          textAlign: "center", position: "relative",
          border: "2px solid rgba(196,89,106,0.2)",
          boxShadow: "0 24px 80px rgba(196,89,106,0.3)",
        }}
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>{prize.icon}</div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C4596A", marginBottom: 10 }}>
          🎉 {t.youWon}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color: "#3D1A22", marginBottom: 20 }}>
          {prize.label}
        </div>

        {prize.physical && (
          <div style={{
            background: "#FFF0F3", border: "1.5px solid rgba(196,89,106,0.25)",
            borderRadius: 14, padding: "16px 20px", marginBottom: 24,
            fontSize: 14, color: "#9E3348", fontWeight: 600, lineHeight: 1.55,
          }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6, color: "#C4596A" }}>
              📋 {t.staffNote}
            </div>
            {prize.physical}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            background: "linear-gradient(135deg, #C4596A, #E8849A)",
            color: "#fff", border: "none", borderRadius: 50,
            padding: "14px 36px", fontWeight: 800, fontSize: 14,
            letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: "pointer", boxShadow: "0 8px 24px rgba(196,89,106,0.35)",
          }}
        >
          {t.closeModal}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── CHIPS INPUT ────────────────────────────────────────────────────────────────
const VALID_ANSWERS = [
  "perfumes", "concentrated parfum", "dakhoon", "gift sets",
  "care essentials", "collections", "bakhoor",
  "عطور", "عطر مركز", "دخون", "أطقم هدايا", "أساسيات العناية",
];

function ChipsInput({ placeholder, hint, success, nextId }) {
  const [chips, setChips] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [done, setDone] = useState(false);

  const addChip = () => {
    const val = inputVal.trim();
    if (!val || chips.some((c) => c.text.toLowerCase() === val.toLowerCase())) return;
    const isValid = VALID_ANSWERS.some(
      (a) => a.toLowerCase().includes(val.toLowerCase()) || val.toLowerCase().includes(a.toLowerCase())
    );
    const next = [...chips, { text: val, valid: isValid }];
    setChips(next);
    setInputVal("");
    if (next.length >= 3 && !done) {
      setDone(true);
      if (nextId) scrollToNext(nextId, 1000);
    }
  };

  return (
    <div>
      <div className="ewd-chips-input-area" onClick={() => document.getElementById("ewd-chip-input-instore")?.focus()}>
        {chips.map((c, i) => (
          <span key={i} className={`ewd-chip ${c.valid ? "valid" : ""}`}>
            {c.text}
            <button className="ewd-chip__remove" onClick={() => setChips((p) => p.filter((_, idx) => idx !== i))}>×</button>
          </span>
        ))}
        <input
          id="ewd-chip-input-instore"
          className="ewd-chips-input"
          value={inputVal}
          placeholder={chips.length === 0 ? placeholder : ""}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addChip()}
        />
      </div>
      <p className="ewd-chips-hint">{hint}</p>
      {done && <p className="ewd-chips-success">{success}</p>}
    </div>
  );
}

// ── TRUE/FALSE ─────────────────────────────────────────────────────────────────
function TrueFalse({ answer, reveal, options, nextId }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const labels = options || ["True", "False"];

  const handleConfirm = () => {
    setConfirmed(true);
    if (nextId) scrollToNext(nextId, 1200);
  };

  return (
    <div>
      <div className="ewd-tf-options">
        {labels.map((label) => {
          const isCorrect = label === answer;
          let cls = "ewd-tf-btn";
          if (confirmed) {
            if (label === selected) cls += isCorrect ? " correct" : " wrong";
            else if (isCorrect) cls += " correct";
          } else if (label === selected) {
            cls += " selected-preview";
          }
          return (
            <button key={label} className={cls}
              onClick={() => !confirmed && setSelected(label)}
              disabled={confirmed}>
              {label}
            </button>
          );
        })}
      </div>
      {/* Next button — appears after selection, triggers reveal + scroll */}
      {selected && !confirmed && (
        <motion.button
          className="ewd-quiz-next-btn"
          onClick={handleConfirm}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Next →
        </motion.button>
      )}
      <AnimatePresence>
        {confirmed && (
          <motion.div className="ewd-tf-reveal"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {reveal}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MCQ ────────────────────────────────────────────────────────────────────────
function MCQ({ options, answer, nextId }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const letters = ["A", "B", "C"];

  const handleConfirm = () => {
    setConfirmed(true);
    if (nextId) scrollToNext(nextId, 800);
  };

  return (
    <div>
      <div className="ewd-mcq-options">
        {options.map((opt, i) => {
          const isCorrect = opt === answer;
          let cls = "ewd-mcq-btn";
          if (confirmed) {
            if (opt === selected) cls += isCorrect ? " correct" : " wrong";
            else if (isCorrect) cls += " correct";
          } else if (opt === selected) {
            cls += " selected-preview";
          }
          return (
            <button key={i} className={cls}
              onClick={() => !confirmed && setSelected(opt)}
              disabled={confirmed}>
              <span className="ewd-mcq-btn__letter">{letters[i]}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {/* Next button — appears after selection, triggers scroll */}
      {selected && !confirmed && (
        <motion.button
          className="ewd-quiz-next-btn"
          onClick={handleConfirm}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Next →
        </motion.button>
      )}
    </div>
  );
}

// ── SPIN WHEEL ─────────────────────────────────────────────────────────────────
function SpinWheel({ prizes, t }) {
  const canvasRef = useRef(null);
  const rotRef = useRef(0);
  const rafRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [spunOnce, setSpunOnce] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (canvasRef.current) drawWheel(canvasRef.current, rotRef.current, prizes);
  }, [prizes]);

  const spin = useCallback(() => {
    if (spinning || spunOnce) return;
    setSpinning(true);
    const extraSpins = 5 + Math.random() * 5;
    const targetAngle = rotRef.current + extraSpins * TWO_PI + Math.random() * TWO_PI;
    const duration = 4000 + Math.random() * 1500;
    const startTime = performance.now();
    const startAngle = rotRef.current;
    const easeOut = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      rotRef.current = startAngle + easeOut(progress) * (targetAngle - startAngle);
      if (canvasRef.current) drawWheel(canvasRef.current, rotRef.current, prizes);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        const normalized = ((-rotRef.current % TWO_PI) + TWO_PI) % TWO_PI;
        const idx = Math.floor(((normalized + Math.PI * 1.5) % TWO_PI) / ARC) % prizes.length;
        setResult(prizes[idx]);
        setSpinning(false);
        setSpunOnce(true);
        setTimeout(() => setShowModal(true), 400);
        // After prize modal shown, scroll to products section
        scrollToNext("ewd-products", 5000);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [spinning, spunOnce, prizes]);

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  return (
    <>
      <div className="ewd-wheel-wrapper">
        <div className="ewd-wheel-container" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
          <div className="ewd-wheel-pointer" />
          <canvas ref={canvasRef} width={WHEEL_SIZE} height={WHEEL_SIZE} className="ewd-wheel-canvas" />
        </div>
        <button
          className="ewd-wheel-spin-btn"
          onClick={spin}
          disabled={spinning || spunOnce}
          id="ewd-spin-btn"
        >
          {spunOnce ? t.spunLabel : t.spinLabel}
        </button>
        {result && !showModal && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "var(--ewd-rose-pale)", border: "1.5px solid var(--ewd-border)",
              borderRadius: 12, padding: "12px 24px", cursor: "pointer",
              color: "var(--ewd-rose)", fontWeight: 700, fontSize: 13,
            }}
          >
            🎁 {t.viewPrize}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showModal && result && (
          <PrizeModal prize={result} onClose={() => setShowModal(false)} t={t} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const translations = {
  en: {
    label: "Quick-Fire Trivia",
    heading: "How Well Do You",
    headingEm: "Know Your Scents?",
    sub: "Answer fast, win big! Test your fragrance knowledge and spin for a prize.",
    trivia: [
      {
        num: "Trivia 01",
        q: "True or False: Layering different perfumes (like an oil and a spray) makes the scent last longer?",
        type: "tf",
        answer: "True",
        reveal: "✅ True! Layering a concentrated parfum oil under a spray dramatically increases longevity.",
      },
      {
        num: "Trivia 02",
        q: "Name three categories of products we offer at Ahmed Al Maghribi:",
        type: "chips",
        placeholder: "Type a category + Enter…",
        hint: "Hint: Perfumes, Dakhoon, Gift Sets, Concentrated Parfum, Care Essentials…",
        success: "🎉 Well done! You know your Ahmed Al Maghribi.",
      },
      {
        num: "Trivia 03",
        q: "In our 'Find Your Scent' quiz, what is the very first question we ask?",
        type: "mcq",
        options: [
          "What time of day do you wear perfume?",
          "Who Is This Fragrance For? Him, Her, or Both",
          "What is your favourite scent family?",
        ],
        answer: "Who Is This Fragrance For? Him, Her, or Both",
      },
    ],
    spin: {
      heading: "Spin to",
      headingEm: "Win!",
      desc: "One spin per customer. Our team will hand you your prize right here in-store! 🎁",
      prizes: ["10% discount voucher", "Free fragrance sample", "Free bakhoor mini", "Free gift wrapping", "15% discount voucher", "Ahmed Al Maghribi tote bag"],
    },
    youWon: "You Won!",
    staffNote: "Staff: Please hand the customer —",
    closeModal: "Collect My Prize 🎁",
    spinLabel: "🎡 Spin the Wheel!",
    spunLabel: "✅ Already Spun!",
    viewPrize: "View My Prize",
  },
  ar: {
    label: "أسئلة سريعة",
    heading: "كم تعرفين",
    headingEm: "عطوركِ؟",
    sub: "أجيبي بسرعة وافوزي بجوائز! اختبري معرفتك بالعطور وأديري العجلة.",
    trivia: [
      {
        num: "سؤال ٠١",
        q: "صح أم خطأ: تطبيق طبقات من العطور المختلفة يجعل العطر يدوم أطول؟",
        type: "tf",
        answer: "صح",
        tfOptions: ["صح", "خطأ"],
        reveal: "✅ صحيح! تطبيق طبقات من العطر يزيد بشكل كبير من مدة الثبات.",
      },
      {
        num: "سؤال ٠٢",
        q: "سمّي ثلاث فئات من منتجاتنا في أحمد المغربي:",
        type: "chips",
        placeholder: "اكتبي فئة ثم اضغطي Enter…",
        hint: "إشارة: عطور، دخون، أطقم هدايا، عطر مركز، أساسيات العناية…",
        success: "🎉 أحسنتِ! أنتِ تعرفين أحمد المغربي.",
      },
      {
        num: "سؤال ٠٣",
        q: "في اختبار 'اكتشفي عطركِ'، ما هو أول سؤال نطرحه؟",
        type: "mcq",
        options: [
          "في أي وقت من اليوم ترتدين العطر؟",
          "لمن هذا العطر؟ له، لها، أم لكليهما",
          "ما هي عائلة العطر المفضّلة لديكِ؟",
        ],
        answer: "لمن هذا العطر؟ له، لها، أم لكليهما",
      },
    ],
    spin: {
      heading: "أديري للفوز",
      headingEm: "بالجوائز!",
      desc: "دورة واحدة لكل عميلة. سيسلّمك فريقنا جائزتك هنا في المتجر! 🎁",
      prizes: ["قسيمة خصم ١٠٪", "عيّنة عطر مجانية", "بخور ميني مجاني", "تغليف هدايا مجاني", "قسيمة خصم ١٥٪", "حقيبة أحمد المغربي"],
    },
    youWon: "فزتِ!",
    staffNote: "للموظف: قدّم للعميلة —",
    closeModal: "استلمي جائزتي 🎁",
    spinLabel: "🎡 أديري العجلة!",
    spunLabel: "✅ لقد لعبتِ!",
    viewPrize: "اعرضي جائزتي",
  },
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function EWDTriviaWheel() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;
  const prizes = locale === "ar" ? WHEEL_PRIZES_AR : WHEEL_PRIZES_EN;

  return (
    <section id="ewd-trivia" className="ewd-section ewd-trivia" dir={isRtl ? "rtl" : "ltr"}>
      <div className="ewd-container">
        {/* Header */}
        <motion.div className="ewd-trivia__header"
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="ewd-section-label">{t.label}</div>
          <h2 className="ewd-heading">{t.heading} <em>{t.headingEm}</em></h2>
          <p className="ewd-subheading" style={{ margin: "0 auto" }}>{t.sub}</p>
        </motion.div>

        {/* Trivia Cards — IDs for auto-scroll chain */}
        <div className="ewd-trivia__grid">
          {t.trivia.map((q, i) => {
            const cardId = `ewd-trivia-card-${i}`;
            const nextIds = ["ewd-trivia-card-1", "ewd-trivia-card-2", "ewd-spin-section"];
            const nextId = nextIds[i];
            return (
              <motion.div key={i} id={cardId} className="ewd-trivia-card"
                initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.14 }}>
                <div className="ewd-trivia-card__num">{q.num}</div>
                <p className="ewd-trivia-card__q">{q.q}</p>
                {q.type === "tf"    && <TrueFalse answer={q.answer} reveal={q.reveal} options={q.tfOptions} nextId={nextId} />}
                {q.type === "chips" && <ChipsInput placeholder={q.placeholder} hint={q.hint} success={q.success} nextId={nextId} />}
                {q.type === "mcq"   && <MCQ options={q.options} answer={q.answer} nextId={nextId} />}
              </motion.div>
            );
          })}
        </div>


        {/* Spin to Win */}
        <motion.div id="ewd-spin-section" className="ewd-spin-section"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="ewd-spin-info">
            <h3 className="ewd-spin-info__heading">{t.spin.heading} <em>{t.spin.headingEm}</em></h3>
            <p className="ewd-spin-info__desc">{t.spin.desc}</p>
            <ul className="ewd-spin-prizes">
              {t.spin.prizes.map((p, i) => (
                <li key={i} className="ewd-spin-prize">
                  <span className="ewd-spin-prize__dot" />{p}
                </li>
              ))}
            </ul>
          </div>
          <SpinWheel prizes={prizes} t={t} />
        </motion.div>
      </div>
    </section>
  );
}
