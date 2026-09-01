"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import QRCode from "react-qr-code";
import "./EWDStep.css";

// ─── GOOGLE SHEETS SCRIPT URL ─────────────────────────────────────────────────
// After deploying your Apps Script, paste the Web App URL here:
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlSy_fIm5Jc_I1rVIy2lMBLN0E0X1on1sYoWAKPREdbaQoIqqCYosvNYnLce2i3vD4/exec";

// Each step = one full screen
const STEPS_EN = [
  // ── SECTION 1: Find Your Scent ──────────────────────────────────────────────
  {
    id: "scent_note",
    section: "Find Your Scent",
    sectionNum: 1,
    type: "choice",
    question: "If your personality was a fragrance note, which one are you?",
    options: [
      { id: "oud",    label: "Oud",    desc: "Bold · Deep · Powerful",     img: "/ewd/scent-oud.jpg" },
      { id: "rose",   label: "Rose",   desc: "Romantic · Feminine · Warm",  img: "/ewd/scent-rose.jpg" },
      { id: "musk",   label: "Musk",   desc: "Soft · Velvety · Intimate",   img: "/ewd/scent-musk.jpg" },
      { id: "citrus", label: "Citrus", desc: "Fresh · Bright · Energetic",  img: "/ewd/scent-citrus.jpg" },
    ],
  },
  {
    id: "bestseller",
    section: "Find Your Scent",
    sectionNum: 1,
    type: "choice",
    question: "Which Ahmed Al Maghribi collection do you think is our best-seller for women?",
    options: [
      { id: "rose_noir", label: "Rose Noir", desc: "Dark · Mysterious · Bold" },
      { id: "marj",      label: "Marj",       desc: "Timeless · Elegant · Iconic" },
      { id: "niswah",   label: "Niswah",     desc: "Timeless & floral" },
      { id: "blush",    label: "Blush Noire", desc: "Soft · Powdery · Feminine" },
    ],
    reveal: {
      answer: "marj",
      text: "It's Marj! Our most iconic and best-loved women's fragrance. A timeless blend that has captured hearts across the UAE.",
    },
  },
  {
    id: "gift_style",
    section: "Find Your Scent",
    sectionNum: 1,
    type: "toggle_text",
    question: "When choosing a gift for a special woman in your life, what speaks to you more?",
    toggleOptions: [
      { id: "traditional", label: "Traditional - Dakhoon" },
      { id: "modern",      label: "Modern - Concentrated Parfum" },
    ],
    placeholder: "Tell us what makes your perfect gift, and why…",
  },
  // ── SECTION 2: Heritage Journal ─────────────────────────────────────────────
  {
    id: "inspiring_woman",
    section: "Heritage Journal",
    sectionNum: 2,
    type: "textarea_product",
    question: "Who is an Emirati woman that inspires you and which Ahmed Al Maghribi fragrance would you gift her?",
    placeholder: "Write her name and what inspires you about her…",
    productLabel: "Choose a fragrance for her",
    products: ["Niswah", "Marj", "Blush Noire", "Rose Noir", "Musk & Roses", "Oud Lavender", "Bidun Esam", "Oud & Roses"],
  },
  // ── SECTION 3: Spin to Win ───────────────────────────────────────────────────
  {
    id: "spin_wheel",
    section: "Spin to Win",
    sectionNum: 3,
    type: "spin",
    question: "Spin the wheel for a chance to win an in-store prize!",
    sub: "One spin per customer. Our team will hand you your prize right here.",
  },
];

const STEPS_AR = [
  {
    id: "scent_note", section: "اكتشفي عطركِ", sectionNum: 1, type: "choice",
    question: "لو كانت شخصيتكِ نوتة عطرية - أيّها أنتِ؟",
    options: [
      { id: "oud",    label: "العود",     desc: "جريء · عميق · قوي",        img: "/ewd/scent-oud.jpg" },
      { id: "rose",   label: "الورد",     desc: "رومانسي · أنثوي · دافئ",   img: "/ewd/scent-rose.jpg" },
      { id: "musk",   label: "المسك",     desc: "ناعم · مخملي · حميمي",      img: "/ewd/scent-musk.jpg" },
      { id: "citrus", label: "الحمضيات", desc: "منعش · مشرق · حيوي",        img: "/ewd/scent-citrus.jpg" },
    ],
  },
  {
    id: "bestseller", section: "اكتشفي عطركِ", sectionNum: 1, type: "choice",
    question: "أي مجموعة من أحمد المغربي تعتقدين أنها الأكثر مبيعاً للنساء؟",
    options: [
      { id: "rose_noir", label: "روز نوار",   desc: "داكن · غامض · جريء" },
      { id: "marj",      label: "مرج",         desc: "خالد · أنيق · أيقوني" },
      { id: "niswah",   label: "نسوة",        desc: "خالد وزهري" },
      { id: "blush",    label: "بلوش نوار",   desc: "ناعم · بودري · أنثوي" },
    ],
    reveal: {
      answer: "marj",
      text: "هو مرج! عطرنا الأيقوني والأكثر حبّاً للمرأة - مزيج خالد سحر القلوب في كل أنحاء الإمارات.",
    },
  },
  {
    id: "gift_style", section: "اكتشفي عطركِ", sectionNum: 1, type: "toggle_text",
    question: "عند اختيار هدية لامرأة مميزة - أيّهما يعبّر عنكِ أكثر؟",
    toggleOptions: [
      { id: "traditional", label: "تقليدي - دخون" },
      { id: "modern",      label: "عصري - عطر مركز" },
    ],
    placeholder: "أخبرينا ما الذي يجعل هديتكِ مثالية، ولماذا…",
  },
  {
    id: "inspiring_woman", section: "ذاكرة التراث", sectionNum: 2, type: "textarea_product",
    question: "من هي المرأة الإماراتية التي تلهمكِ - وأي عطر من أحمد المغربي ستهدينه لها؟",
    placeholder: "اكتبي اسمها وما الذي يلهمكِ فيها…",
    productLabel: "اختاري عطراً لها",
    products: ["نسوة", "مرج", "بلوش نوار", "روز نوار", "مسك وورد", "عود لافندر", "بدون اسم", "عود وورد"],
  },
  {
    id: "spin_wheel", section: "دوّري للفوز", sectionNum: 3, type: "spin",
    question: "أديري العجلة لفرصة الفوز بجائزة في المتجر!",
    sub: "دورة واحدة لكل عميلة. سيسلّمك فريقنا جائزتك هنا.",
  },
];

const TOTAL = STEPS_EN.length;

// ─── WHEEL CONFIG ─────────────────────────────────────────────────────────────
const PRIZES_EN = [
  { label: "15% Voucher",  color: "#C4596A", textColor: "#fff",    staff: "15% discount voucher - print & hand to customer" },
  { label: "Memories",     color: "#F9D5DC", textColor: "#9E3348", staff: "Gift the Memories keepsake card from the display" },
  { label: "Free Gift",    color: "#FFE4EC", textColor: "#C4596A", staff: "Gift wrap one item from the gift selection tray" },
  { label: "15% Voucher",  color: "#9E3348", textColor: "#fff",    staff: "15% discount voucher - print & hand to customer" },
  { label: "Free Gift",    color: "#E8849A", textColor: "#fff",    staff: "Gift wrap one item from the gift selection tray" },
  { label: "Memories",     color: "#F3EAF9", textColor: "#B88FC8", staff: "Gift the Memories keepsake card from the display" },
  { label: "15% Voucher",  color: "#FDF3E3", textColor: "#C9904A", staff: "15% discount voucher - print & hand to customer" },
  { label: "Free Gift",    color: "#F9D5DC", textColor: "#9E3348", staff: "Gift wrap one item from the gift selection tray" },
];
const PRIZES_AR = [
  { label: "خصم ١٥٪",      color: "#C4596A", textColor: "#fff",    staff: "قسيمة خصم ١٥٪ - اطبعها وقدّمها للعميل" },
  { label: "ذكريات",       color: "#F9D5DC", textColor: "#9E3348", staff: "أهدِ بطاقة ذكريات من الطاولة" },
  { label: "هدية مجانية",  color: "#FFE4EC", textColor: "#C4596A", staff: "قدّم غلاف هدية من صينية الهدايا" },
  { label: "خصم ١٥٪",      color: "#9E3348", textColor: "#fff",    staff: "قسيمة خصم ١٥٪ - اطبعها وقدّمها للعميل" },
  { label: "هدية مجانية",  color: "#E8849A", textColor: "#fff",    staff: "قدّم غلاف هدية من صينية الهدايا" },
  { label: "ذكريات",       color: "#F3EAF9", textColor: "#B88FC8", staff: "أهدِ بطاقة ذكريات من الطاولة" },
  { label: "خصم ١٥٪",      color: "#FDF3E3", textColor: "#C9904A", staff: "قسيمة خصم ١٥٪ - اطبعها وقدّمها للعميل" },
  { label: "هدية مجانية",  color: "#F9D5DC", textColor: "#9E3348", staff: "قدّم غلاف هدية من صينية الهدايا" },
];

const TWO_PI = Math.PI * 2;
const ARC    = TWO_PI / 8;
const W_SIZE = 380;

function drawWheel(canvas, rotation, prizes) {
  const ctx = canvas.getContext("2d");
  const cx = W_SIZE / 2, cy = W_SIZE / 2, r = cx - 4;
  ctx.clearRect(0, 0, W_SIZE, W_SIZE);
  prizes.forEach((prize, i) => {
    const s = rotation + i * ARC, e = s + ARC;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, s, e); ctx.closePath();
    ctx.fillStyle = prize.color; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(s + ARC / 2); ctx.textAlign = "right";
    ctx.fillStyle = prize.textColor; ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillText(prize.label, r - 12, 5); ctx.restore();
  });
  ctx.beginPath(); ctx.arc(cx, cy, 30, 0, TWO_PI);
  ctx.fillStyle = "#fff"; ctx.fill();
  ctx.strokeStyle = "rgba(196,89,106,0.4)"; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = "#C4596A"; ctx.font = "bold 10px Inter, sans-serif";
  ctx.textAlign = "center"; ctx.fillText("SPIN", cx, cy + 4);
}

// ─── PRIZE MODAL ──────────────────────────────────────────────────────────────
function PrizeModal({ prize, onClose, t }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    // Elegant palette: champagne gold, rose, ivory, deep wine, blush
    const COLORS = [
      "#C9A84C", "#E2C97E", "#F5E6C8",
      "#C4596A", "#E8A0AD", "#FFF0F3",
      "#8B3A4A", "#F7F0E6", "#D4AF6A",
    ];

    const rand = (min, max) => min + Math.random() * (max - min);

    // Create particles: mix of circles (petals), stars, and thin rectangles (ribbons)
    const particles = Array.from({ length: 120 }, () => {
      const type = ["circle", "star", "ribbon"][Math.floor(Math.random() * 3)];
      return {
        type,
        x:    rand(W * 0.2, W * 0.8),
        y:    rand(H * 0.35, H * 0.55),
        vx:   rand(-5, 5),
        vy:   rand(-14, -4),
        rot:  rand(0, Math.PI * 2),
        rVel: rand(-0.12, 0.12),
        size: type === "ribbon" ? rand(6, 14) : rand(5, 11),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        gravity: rand(0.18, 0.32),
        decay:   rand(0.008, 0.018),
      };
    });

    const drawStar = (ctx, x, y, r, rot) => {
      const pts = 5;
      ctx.beginPath();
      for (let i = 0; i < pts * 2; i++) {
        const angle = (i * Math.PI) / pts + rot;
        const radius = i % 2 === 0 ? r : r * 0.42;
        ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      }
      ctx.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        alive = true;
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += p.gravity;
        p.rot += p.rVel;
        p.alpha = Math.max(0, p.alpha - p.decay);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.type === "circle") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "star") {
          drawStar(ctx, 0, 0, p.size, 0);
          ctx.fill();
        } else {
          // ribbon
          ctx.fillRect(-p.size * 0.35, -p.size, p.size * 0.7, p.size * 2);
        }
        ctx.restore();
      });
      if (alive) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Auto-stop after 4 s
    const timeout = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
    }, 4000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div className="ewd-step-prize-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      {/* Celebration canvas behind the modal card */}
      <canvas ref={canvasRef} className="ewd-prize-canvas" />
      <motion.div className="ewd-step-prize-modal"
        initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={(e) => e.stopPropagation()}>
        <div className="ewd-step-prize-modal__icon">{prize.icon}</div>
        <div className="ewd-step-prize-modal__won">{t.youWon}</div>
        <div className="ewd-step-prize-modal__label">{prize.label}</div>
        <div className="ewd-step-prize-modal__congrats">
          <p>{t.congratsMsg}</p>
        </div>
        <button className="ewd-step-btn-primary" onClick={onClose} style={{ marginTop: 20 }}>
          {t.collectPrize}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── SPIN STEP ────────────────────────────────────────────────────────────────
function SpinStep({ prizes, onNext, t }) {
  const canvasRef = useRef(null);
  const rotRef = useRef(0);
  const rafRef = useRef(null);

  const [spinning, setSpinning] = useState(false);
  const [spunOnce, setSpunOnce] = useState(false);
  const [result,   setResult]   = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (canvasRef.current) drawWheel(canvasRef.current, rotRef.current, prizes);
  }, [prizes]);

  const spin = () => {
    if (spinning || spunOnce) return;
    setSpinning(true);

    // Pre-pick a truly random winner index
    const winnerIdx = Math.floor(Math.random() * prizes.length);
    // The pointer sits at the TOP of the canvas = canvas angle 3π/2
    // Segment i is centered at: rotation + i*ARC + ARC/2
    // For segment winnerIdx to be at the pointer:
    //   rotTarget + winnerIdx*ARC + ARC/2 = 3π/2  (mod 2π)
    //   rotTarget = 3π/2 - (winnerIdx + 0.5)*ARC
    const THREE_HALF_PI = Math.PI * 1.5;
    const currentNorm  = ((rotRef.current % TWO_PI) + TWO_PI) % TWO_PI;
    const targetRot    = ((THREE_HALF_PI - (winnerIdx + 0.5) * ARC) % TWO_PI + TWO_PI) % TWO_PI;
    let   delta        = (targetRot - currentNorm + TWO_PI) % TWO_PI;
    if (delta < 0.3) delta += TWO_PI; // at least ~17°
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * TWO_PI;
    const target   = rotRef.current + fullSpins + delta;
    const duration = 4000 + Math.random() * 1500;
    const start    = performance.now();
    const startAngle = rotRef.current;
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const frame = (now) => {
      const p = Math.min((now - start) / duration, 1);
      rotRef.current = startAngle + ease(p) * (target - startAngle);
      if (canvasRef.current) drawWheel(canvasRef.current, rotRef.current, prizes);
      if (p < 1) { rafRef.current = requestAnimationFrame(frame); }
      else {
        setResult(prizes[winnerIdx]);
        setSpinning(false);
        setSpunOnce(true);
        setTimeout(() => setShowModal(true), 400);
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  };

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  return (
    <div className="ewd-step-spin-layout">
      <div className="ewd-step-spin-wheel-wrap">
        <div className="ewd-step-spin-pointer" />
        <canvas ref={canvasRef} width={W_SIZE} height={W_SIZE} className="ewd-step-spin-canvas" />
      </div>
      <button className="ewd-step-btn-primary ewd-step-spin-btn"
        onClick={spin} disabled={spinning || spunOnce}
        style={{ opacity: spinning || spunOnce ? 0.5 : 1 }}>
        {spunOnce ? t.spunLabel : t.spinLabel}
      </button>
      {spunOnce && (
        <button className="ewd-step-btn-next" onClick={onNext} style={{ marginTop: 8 }}>
          {t.nextBtn} →
        </button>
      )}
      <AnimatePresence>
        {showModal && result && (
          <PrizeModal prize={result} onClose={() => setShowModal(false)} t={t} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CHIPS STEP ───────────────────────────────────────────────────────────────
function ChipsStep({ step, onNext, t }) {
  const [chips, setChips] = useState([]);
  const [val, setVal] = useState("");
  const inputId = "ewd-chips-input";

  const addChip = () => {
    const v = val.trim();
    if (!v || chips.some((c) => c.text.toLowerCase() === v.toLowerCase())) return;
    const isValid = step.validAnswers.some(
      (a) => a.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(a.toLowerCase())
    );
    setChips((p) => [...p, { text: v, valid: isValid }]);
    setVal("");
  };

  const done = chips.length >= step.targetCount;

  return (
    <div className="ewd-step-chips">
      <div className="ewd-step-chips-area" onClick={() => document.getElementById(inputId)?.focus()}>
        {chips.map((c, i) => (
          <span key={i} className={`ewd-step-chip ${c.valid ? "valid" : ""}`}>
            {c.text}
            <button onClick={() => setChips((p) => p.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
        <input id={inputId} className="ewd-step-chips-input" value={val}
          placeholder={chips.length === 0 ? step.placeholder : ""}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addChip()} />
      </div>
      <p className="ewd-step-chips-hint">{step.hint}</p>
      {done && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <p className="ewd-step-chips-success">🎉 {t.wellDone}</p>
          <button className="ewd-step-btn-next" onClick={onNext}>{t.nextBtn} →</button>
        </motion.div>
      )}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function StepProgress({ current, total, onBack, sections, isRtl }) {
  const pct = Math.round((current / total) * 100);
  const uniqueSections = [...new Set(sections.map((s) => s.section))];

  return (
    <div className="ewd-step-progress" dir={isRtl ? "rtl" : "ltr"}>
      <button className="ewd-step-progress__back" onClick={onBack}>
        {isRtl ? "→ رجوع" : "← Back"}
      </button>
      <div className="ewd-step-progress__track">
        <motion.div className="ewd-step-progress__fill"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
        <motion.div className="ewd-step-progress__pct-wrap"
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <span className="ewd-step-progress__pct">{pct}%</span>
        </motion.div>
        {uniqueSections.map((sec, i) => {
          const pos = (sections.findIndex((s) => s.section === sec) / total) * 100;
          return (
            <div key={i} className="ewd-step-progress__dot"
              style={{ left: `${pos}%`, opacity: pct >= pos ? 1 : 0.35 }}>
              <span className="ewd-step-progress__dot-label">{i + 1}</span>
            </div>
          );
        })}
      </div>
      <span className="ewd-step-progress__counter">{current}/{total}</span>
    </div>
  );
}

// ─── RESULT SCREEN ────────────────────────────────────────────────────────────
// Each scent note → primary match + "you might also love" picks
const RECS = {
  oud: {
    en: {
      primary: { name: "Bidun Esam",   note: "Warm oud, amber & woody depths",            desc: "Bold, woody and unforgettable - crafted for the powerful, decisive woman." },
      also: [
        { name: "Oud & Roses",   note: "Rich oud softened by blooming roses",    desc: "Where deep oud meets blooming roses - rich, romantic, luxurious." },
        { name: "Oud Lavender",  note: "Earthy oud lifted by cool lavender",      desc: "A modern twist on oud - fresh lavender softens the depth beautifully." },
        { name: "Rose Noir",     note: "Velvety dark rose with smoky oud base",   desc: "Mysterious and daring - a dark rose for a woman who commands attention." },
      ],
    },
    ar: {
      primary: { name: "بدون اسم",  note: "عود دافئ وعنبر وعمق خشبي",             desc: "جريء، خشبي، لا يُنسى - صُنع للمرأة القوية الواثقة." },
      also: [
        { name: "عود وورد",   note: "عود غني يُلطّفه عبق الورود",         desc: "حيث يلتقي العود العميق بالورود المتفتحة - غني، رومانسي، فاخر." },
        { name: "عود لافندر", note: "عود ترابي ترفعه نفحة اللافندر",      desc: "لمسة عصرية على العود - اللافندر المنعش يُلطف العمق بشكل رائع." },
        { name: "روز نوار",   note: "وردة داكنة مع قاعدة عود معتّق",     desc: "غامض وجريء - وردة داكنة لامرأة تفرض حضورها." },
      ],
    },
  },
  rose: {
    en: {
      primary: { name: "Niswah", note: "Fresh rose petals over warm jasmine", desc: "A romantic floral heart - feminine, timeless and deeply beloved." },
      also: [
        { name: "Blush Noire",  note: "Soft powder, peony & white musk",          desc: "Soft, powdery florals with a whisper of mystery - endlessly wearable." },
        { name: "Rose Noir",    note: "Velvety dark rose with smoky oud base",    desc: "For when you want your rose to have an edge - bold and captivating." },
        { name: "Musk & Roses", note: "Dewy rose heart wrapped in warm skin musk", desc: "Roses wrapped in the warmth of musk - intimate, lingering, feminine." },
      ],
    },
    ar: {
      primary: { name: "نسوة", note: "بتلات وردة طازجة فوق ياسمين دافئ", desc: "قلب زهري رومانسي - أنثوي، خالد، محبوب بعمق." },
      also: [
        { name: "بلوش نوار", note: "بودرة ناعمة وبيونية ومسك أبيض",     desc: "زهور ناعمة وبودرية بلمسة من الغموض - يُلبس في كل الأوقات." },
        { name: "روز نوار",  note: "وردة داكنة مع قاعدة عود معتّق",     desc: "حين تريدين لوردتك حدّة - جريء وآسر." },
        { name: "مسك وورد",  note: "قلب وردي يلتف بمسك الجلد الدافئ",   desc: "ورود تلتف بدفء المسك - حميمي، ثابت، أنثوي." },
      ],
    },
  },
  musk: {
    en: {
      primary: { name: "Musk & Roses", note: "Dewy rose heart wrapped in warm skin musk", desc: "Soft, velvety and deeply feminine - a comforting scent that stays beautifully close." },
      also: [
        { name: "Blush Noire", note: "Soft powder, peony & white musk",          desc: "Delicate and powdery - effortlessly elegant from morning to evening." },
        { name: "Niswah",      note: "Fresh rose petals over warm jasmine",       desc: "A beloved floral classic - warm, feminine and always in style." },
        { name: "Marj",        note: "Bright citrus, floral heart, warm musk",    desc: "Our most iconic women's fragrance - timeless and beautifully balanced." },
      ],
    },
    ar: {
      primary: { name: "مسك وورد", note: "قلب وردي يلتف بمسك الجلد الدافئ", desc: "ناعم، مخملي، أنثوي بعمق - عطر مريح يلتصق بك بشكل جميل." },
      also: [
        { name: "بلوش نوار", note: "بودرة ناعمة وبيونية ومسك أبيض",      desc: "رقيق وبودري - أناقة خفية من الصباح حتى المساء." },
        { name: "نسوة",      note: "بتلات وردة طازجة فوق ياسمين دافئ",   desc: "كلاسيكي زهري محبوب - دافئ، أنثوي، لا يخرج عن الموضة." },
        { name: "مرج",       note: "قمة حمضية، قلب زهري، قاعدة مسكية",   desc: "عطرنا الأيقوني الأكثر حبّاً - خالد ومتوازن بشكل رائع." },
      ],
    },
  },
  citrus: {
    en: {
      primary: { name: "Marj", note: "Bright citrus top, floral heart, warm musky base", desc: "Our most iconic and best-loved women's fragrance - fresh, vibrant and timeless. A scent that tells the story of the Emirati woman." },
      also: [
        { name: "Oud Lavender", note: "Earthy oud lifted by cool lavender",      desc: "Fresh lavender over warm oud - the perfect balance of light and depth." },
        { name: "Blush Noire",  note: "Soft powder, peony & white musk",          desc: "A softer, more delicate side - beautiful for those quieter moments." },
        { name: "Niswah",       note: "Fresh rose petals over warm jasmine",      desc: "A beloved floral classic - warm, feminine and always in style." },
      ],
    },
    ar: {
      primary: { name: "مرج", note: "قمة حمضية مشرقة، قلب زهري، قاعدة مسكية دافئة", desc: "عطرنا الأيقوني الأكثر حبّاً - منعش، حيوي وخالد. عطر يحكي قصة المرأة الإماراتية." },
      also: [
        { name: "عود لافندر", note: "عود ترابي ترفعه نفحة اللافندر",     desc: "لافندر منعش فوق عود دافئ - التوازن المثالي بين الخفة والعمق." },
        { name: "بلوش نوار",  note: "بودرة ناعمة وبيونية ومسك أبيض",    desc: "جانب أكثر نعومة ورقة - جميل للحظات الهادئة." },
        { name: "نسوة",       note: "بتلات وردة طازجة فوق ياسمين دافئ", desc: "كلاسيكي زهري محبوب - دافئ، أنثوي، لا يخرج عن الموضة." },
      ],
    },
  },
};

// ─── FRAGRANCE SCORING ENGINE ────────────────────────────────────────────────
const FRAG_PROFILES = {
  "Bidun Esam":   { oud:5, rose:1, musk:1, citrus:0, traditional:5, modern:1 },
  "Marj":         { oud:2, rose:2, musk:3, citrus:5, traditional:3, modern:4 },
  "Niswah":       { oud:1, rose:5, musk:2, citrus:2, traditional:4, modern:2 },
  "Blush Noire":  { oud:0, rose:3, musk:5, citrus:1, traditional:1, modern:5 },
  "Rose Noir":    { oud:3, rose:4, musk:2, citrus:1, traditional:2, modern:4 },
  "Musk & Roses": { oud:1, rose:4, musk:5, citrus:2, traditional:2, modern:4 },
  "Oud & Roses":  { oud:4, rose:4, musk:2, citrus:1, traditional:4, modern:2 },
  "Oud Lavender": { oud:3, rose:1, musk:2, citrus:3, traditional:2, modern:5 },
};
const FRAG_COPY = {
  en: {
    "Bidun Esam":   { note:"Warm oud, amber & woody depths",             desc:"Bold, woody and unforgettable — crafted for the powerful, decisive woman." },
    "Marj":         { note:"Bright citrus, floral heart, warm musk",     desc:"Our most iconic women's fragrance — timeless and beautifully balanced." },
    "Niswah":       { note:"Fresh rose petals over warm jasmine",         desc:"A romantic floral heart — feminine, timeless and deeply beloved." },
    "Blush Noire":  { note:"Soft powder, peony & white musk",            desc:"Soft, powdery florals with a whisper of mystery — endlessly wearable." },
    "Rose Noir":    { note:"Velvety dark rose with smoky oud base",       desc:"Mysterious and daring — a dark rose for a woman who commands attention." },
    "Musk & Roses": { note:"Dewy rose heart wrapped in warm skin musk",   desc:"Soft, velvety and deeply feminine — a comforting scent that stays close." },
    "Oud & Roses":  { note:"Rich oud softened by blooming roses",         desc:"Where deep oud meets blooming roses — rich, romantic, luxurious." },
    "Oud Lavender": { note:"Earthy oud lifted by cool lavender",          desc:"A modern twist on oud — fresh lavender softens the depth beautifully." },
  },
  ar: {
    "بدون اسم":  { note:"عود دافئ وعنبر وعمق خشبي",              desc:"جريء، خشبي، لا يُنسى — صُنع للمرأة القوية الواثقة." },
    "مرج":       { note:"قمة حمضية، قلب زهري، قاعدة مسكية",       desc:"عطرنا الأيقوني الأكثر حبّاً — خالد ومتوازن بشكل رائع." },
    "نسوة":      { note:"بتلات وردة طازجة فوق ياسمين دافئ",        desc:"قلب زهري رومانسي — أنثوي، خالد، محبوب بعمق." },
    "بلوش نوار": { note:"بودرة ناعمة وبيونية ومسك أبيض",           desc:"زهور ناعمة وبودرية بلمسة من الغموض — يُلبس في كل الأوقات." },
    "روز نوار":  { note:"وردة داكنة مع قاعدة عود معتّق",            desc:"غامض وجريء — وردة داكنة لامرأة تفرض حضورها." },
    "مسك وورد":  { note:"قلب وردي يلتف بمسك الجلد الدافئ",          desc:"ناعم، مخملي، أنثوي بعمق — عطر مريح يلتصق بك بشكل جميل." },
    "عود وورد":  { note:"عود غني يُلطّفه عبق الورود",                desc:"حيث يلتقي العود العميق بالورود المتفتحة — غني، رومانسي، فاخر." },
    "عود لافندر":{ note:"عود ترابي ترفعه نفحة اللافندر",             desc:"لمسة عصرية على العود — اللافندر المنعش يُلطف العمق بشكل رائع." },
  },
};
const AR_TO_EN = {
  "بدون اسم":"Bidun Esam","مرج":"Marj","نسوة":"Niswah",
  "بلوش نوار":"Blush Noire","روز نوار":"Rose Noir","مسك وورد":"Musk & Roses",
  "عود وورد":"Oud & Roses","عود لافندر":"Oud Lavender",
};
function scoreFragrances(answers, locale) {
  const all = Object.keys(FRAG_PROFILES);
  const scores = Object.fromEntries(all.map((n) => [n, 0]));
  // scent note ×3
  const scentNote = answers.scent_note;
  if (scentNote) all.forEach((n) => { scores[n] += (FRAG_PROFILES[n][scentNote] || 0) * 3; });
  // gift style ×2
  const gs = answers.gift_style;
  if (gs === "traditional" || gs === "modern") all.forEach((n) => { scores[n] += (FRAG_PROFILES[n][gs] || 0) * 2; });
  // inspiring woman product pick ×4 (strong direct signal)
  let insp = answers.inspiring_woman;
  if (insp) { insp = AR_TO_EN[insp] || insp; if (scores[insp] !== undefined) scores[insp] += 20; }
  // bestseller guess ×1
  const bsMap = { rose_noir:"Rose Noir", marj:"Marj", niswah:"Niswah", blush:"Blush Noire" };
  const bp = bsMap[answers.bestseller]; if (bp) scores[bp] += 3;
  const sorted = all.slice().sort((a, b) => scores[b] - scores[a]);
  const copy = FRAG_COPY[locale] || FRAG_COPY.en;
  const getName = (en) => { if (locale !== "ar") return en; const e = Object.entries(AR_TO_EN).find(([,v])=>v===en); return e?e[0]:en; };
  const toCard = (en) => ({ name: getName(en), ...(copy[getName(en)] || FRAG_COPY.en[en] || { note:"", desc:"" }) });
  return { primary: toCard(sorted[0]), also: sorted.slice(1,4).map(toCard) };
}

const SITE_URL  = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN || "https://ae.ahmedalmaghribi.com";
const API_URL   = process.env.NEXT_PUBLIC_API_URL        || "https://admin.ahmedalmaghribi.com/public/";

// ── Module-level product cache ───────────────────────────────────────────────────
// allProducts is fetched ONCE and reused by all components (ResultScreen + StepScreen).
// This eliminates repeated API calls when navigating between quiz steps.
let _productsFetchPromise = null;
const KNOWN_IDS = {
  // EN product names
  "Rose Noir":    62,
  "Marj":         49,
  "Niswah":       354,
  "Blush Noire":  446,
  "Oud & Roses":  57,
  "Musk & Roses": 51,
  "Oud Lavender": 56,
  "Bidun Esam":   32,
  // Scent-note option labels (short) → best representative product
  "Oud":    32,   // Bidun Esam
  "Rose":   354,  // Niswah
  "Musk":   51,   // Musk & Roses
  "Citrus": 49,   // Marj
  // AR product names (same IDs)
  "نسوة":       354,
  "مرج":         49,
  "عود وورد":  57,
  "مسك وورد": 51,
  "روز نوار":   62,
  "بلوش نوار":  446,
  "عود لافندر": 56,
  "بدون اسم":   32,
  // AR scent-note option labels (with الـ prefix as in STEPS_AR)
  "العود":    32,
  "الورد":    354,
  "المسك":    51,
  "الحمضيات": 49,
};

function fetchProductsOnce(apiUrl) {
  if (!_productsFetchPromise) {
    _productsFetchPromise = fetch(`${apiUrl}api/allProducts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: 1, limit: 200 }),
    })
      .then((r) => r.json())
      .then((data) => {
        const all = data.data || [];
        const byId = {};
        const byImages = {};
        all.forEach((p) => {
          byId[p.product_id] = p.image || null;
          byImages[p.product_id] = p.images || null;
        });
        return { byId, byImages };
      })
      .catch(() => ({ byId: {}, byImages: {} }));
  }
  return _productsFetchPromise;
}

// Static image overrides — these take priority over API image fields.
// Use when a specific URL is known and the API doesn't return it correctly.
const STATIC_IMAGE_OVERRIDES = {
  62: "https://admin.ahmedalmaghribi.com/public/storage/epdnew/rose-noir.jpg", // Rose Noir
};

function resolveProductUrl(id, byId, byImages, apiUrl) {
  // Static override takes highest priority
  if (STATIC_IMAGE_OVERRIDES[id]) return STATIC_IMAGE_OVERRIDES[id];
  const imgPath = byId[id];
  if (imgPath) return `${apiUrl}storage/${imgPath}`;
  // Fall back to images JSON array (e.g. Rose Noir has image=null)
  const imgArr = byImages[id];
  if (imgArr) {
    try {
      const parsed = JSON.parse(imgArr);
      if (parsed[0]) return `${apiUrl}storage/${parsed[0]}`;
    } catch (_) {}
  }
  return null;
}

function ResultScreen({ answers, onReset, t, locale, customerData }) {
  const { primary, also } = scoreFragrances(answers, locale);
  const isRtl = locale === "ar";

  // Fetch product IDs + images for primary and all "also" cards in one call
  const [productData, setProductData] = useState({}); // { "ProductName": { id, image } }
  const [productId,   setProductId]   = useState(null);

  useEffect(() => {
    fetchProductsOnce(API_URL).then(({ byId, byImages }) => {
      const map = {};
      [primary.name, ...also.map((a) => a.name)].forEach((name) => {
        const id = KNOWN_IDS[name] ?? null;
        map[name] = { id, image: id ? resolveProductUrl(id, byId, byImages, API_URL) : null };
      });
      setProductData(map);
      const primaryId = KNOWN_IDS[primary.name] ?? null;
      if (primaryId) setProductId(primaryId);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verified live product URLs on ae.ahmedalmaghribi.com
  // Format: /[locale]/shop/perfumes/[subcategory]/[slug]
  const PRODUCT_SLUGS = {
    "Marj":         "shop/perfumes/oriental-fragrance/marj",
    "Niswah":       "shop/perfumes/oriental-fragrance/niswah",
    "Bidun Esam":   "shop/perfumes/oriental-fragrance/bidun-esam",
    "Rose Noir":    "shop/perfumes/occidental-fragrance/rose-noir",
    "Musk & Roses": "shop/perfumes/occidental-fragrance/musk-roses",
    "Oud & Roses":  "shop/perfumes/occidental-fragrance/oud-roses",
    "Blush Noire":  "shop/perfumes/occidental-fragrance/blush-noire",
    "Oud Lavender": "shop/perfumes/occidental-fragrance/oud-lavender",
  };
  const productSlug = PRODUCT_SLUGS[primary.name];
  const qrUrl = productSlug
    ? `https://ae.ahmedalmaghribi.com/${locale}/${productSlug}`
    : `https://ae.ahmedalmaghribi.com/${locale}/product-category/perfumes`;

  // ── Submit to Google Sheets once on mount ──────────────────────────────────
  useEffect(() => {
    if (!SCRIPT_URL || !SCRIPT_URL.startsWith("https://script.google.com")) return;
    const payload = {
      customer: customerData || {},
      answers,
      scentMatch: primary.name,
      locale,
    };
    console.log("[EWD] Submitting to Google Sheets…", payload);
    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    })
      .then(() => console.log("[EWD] Submitted ✅"))
      .catch((err) => console.error("[EWD] Submit failed:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <motion.div className="ewd-step-result" dir={isRtl ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

      {/* ── Header ── */}
      <div className="ewd-step-result__top">
        <div className="ewd-step-result__eyebrow">{t.yourResult}</div>
        <h2 className="ewd-step-result__heading">{t.yourMatch}</h2>
      </div>

      {/* ── Primary match ── */}
      <div className="ewd-step-result__primary">
        {/* Left: product image */}
        <div className="ewd-step-result__primary-img">
          {productData[primary.name]?.image ? (
            <Image
              src={productData[primary.name].image}
              alt={primary.name}
              width={200}
              height={260}
              priority
              unoptimized
              style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
              onError={(e) => { e.target.style.opacity = 0; }}
            />
          ) : (
            <div className="ewd-step-result__img-placeholder" />
          )}
        </div>
        {/* Right: info */}
        <div className="ewd-step-result__primary-info">
          <div className="ewd-step-result__primary-badge">{t.topPick}</div>
          <div className="ewd-step-result__primary-name">{primary.name}</div>
          <div className="ewd-step-result__primary-note">{primary.note}</div>
          <p className="ewd-step-result__primary-desc">{primary.desc}</p>
        </div>
      </div>

      {/* ── You might also love ── */}
      <div className="ewd-step-result__also-wrap">
        <p className="ewd-step-result__also-heading">{t.alsoLove}</p>
        <div className="ewd-step-result__also-grid">
          {also.map((item) => (
            <motion.div key={item.name}
              className="ewd-step-result__also-card"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -3 }}>
              {productData[item.name]?.image ? (
                <div className="ewd-step-result__also-img">
                  <Image
                    src={productData[item.name].image}
                    alt={item.name}
                    width={70}
                    height={90}
                    unoptimized
                    style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
                    onError={(e) => { e.target.style.opacity = 0; }}
                  />
                </div>
              ) : (
                <div className="ewd-step-result__also-img ewd-step-result__also-img--empty" />
              )}
              <div className="ewd-step-result__also-info">
                <span className="ewd-step-result__also-name">{item.name}</span>
                <span className="ewd-step-result__also-note">{item.note}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── QR + Reset ── */}
      <div className="ewd-step-result__footer">
        <div className="ewd-step-result__qr">
          <div className="ewd-step-result__qr-heading">{t.saveResult}</div>
          <div className="ewd-step-result__qr-desc">{t.saveDesc}</div>
          <div className="ewd-step-result__qr-box">
            <QRCode value={qrUrl} size={130} bgColor="#ffffff" fgColor="#3D1A22" level="M" />
          </div>
          <p className="ewd-step-result__qr-note">
            {productId ? t.qrNote : (locale === "ar" ? "يفتح قسم العطور" : "Opens our fragrances collection")}
          </p>
        </div>
      </div>

      <button className="ewd-step-btn-reset" onClick={onReset}>{t.nextCustomer} →</button>
      <p className="ewd-step-result__staff-note">{t.staffNote2}</p>
    </motion.div>
  );
}


// ─── LUXURY BACKGROUND ANIMATION (LIGHT THEME) ──────────────────────────────
function StepBg() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const t0Ref     = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (a, b) => a + Math.random() * (b - a);
    const W = () => canvas.width;
    const H = () => canvas.height;

    // ── Layer 1: Large soft watercolour blobs ────────────────────────────────
    // Very low alpha pastel radial gradients — the signature look of luxury beauty
    const BLOB_PALETTES = [
      ["#F9D2D9", "#FDE8EC"],   // rose blush
      ["#F5C6A0", "#FDE8D8"],   // warm peach
      ["#E8C88A", "#FAF0D0"],   // champagne gold
      ["#F2B8C6", "#FDE0EA"],   // deep blush
      ["#D8C4F0", "#EFE0FF"],   // soft lavender (feminine accent)
    ];
    const blobs = BLOB_PALETTES.map(([inner, outer]) => ({
      xBase: rand(0.05, 0.95),
      yBase: rand(0.05, 0.95),
      r:     rand(160, 340),
      inner, outer,
      px: rand(0, Math.PI * 2), py: rand(0, Math.PI * 2), ps: rand(0, Math.PI * 2),
      fx: rand(0.00006, 0.00014), fy: rand(0.00006, 0.00014), fs: rand(0.0001, 0.00018),
      ax: rand(0.06, 0.14), ay: rand(0.06, 0.14),
      alpha: rand(0.09, 0.17),
    }));

    // ── Layer 2: Flowing silk curve lines ────────────────────────────────────
    const SILK_COLORS = ["#C4596A","#D4AF6A","#E8A0AD","#C9A84C"];
    const silks = Array.from({ length: 6 }, () => ({
      x0: rand(0, 1), y0: rand(0, 1),
      x1: rand(0, 1), y1: rand(0, 1),
      cx0: rand(0, 1), cy0: rand(0, 1), // control points
      cx1: rand(0, 1), cy1: rand(0, 1),
      color: SILK_COLORS[Math.floor(Math.random() * SILK_COLORS.length)],
      alpha: rand(0.04, 0.09),
      width: rand(1, 2.5),
      // Each control point oscillates independently
      pcx0: rand(0, Math.PI * 2), pcy0: rand(0, Math.PI * 2),
      pcx1: rand(0, Math.PI * 2), pcy1: rand(0, Math.PI * 2),
      fcx0: rand(0.00005, 0.00012), fcy0: rand(0.00005, 0.00012),
      fcx1: rand(0.00005, 0.00012), fcy1: rand(0.00005, 0.00012),
      acx: rand(0.08, 0.22), acy: rand(0.08, 0.22),
    }));

    // ── Layer 3: Glitter sparkles ─────────────────────────────────────────────
    const SPARK_COLORS = ["#C9A84C","#D4AF6A","#E2C97E","#C4596A","#E8A0AD","#F0C4CE"];
    const sparks = Array.from({ length: 45 }, () => ({
      x:     rand(0, 1),
      y:     rand(0, 1),
      size:  rand(1, 3.5),
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      ab:    rand(0.4, 0.85),
      aa:    rand(0.2, 0.5),
      ph:    rand(0, Math.PI * 2),
      fr:    rand(0.0005, 0.002),
      vy:   -rand(0.00004, 0.00013),
      vx:    rand(-0.00003, 0.00003),
    }));

    const tick = (now) => {
      const t = now - t0Ref.current;
      ctx.clearRect(0, 0, W(), H());

      // Draw blobs
      blobs.forEach((b) => {
        const bx = (b.xBase + Math.sin(t * b.fx + b.px) * b.ax) * W();
        const by = (b.yBase + Math.sin(t * b.fy + b.py) * b.ay) * H();
        const br = b.r * (1 + Math.sin(t * b.fs + b.ps) * 0.10);
        const g  = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0,   b.inner + "CC");
        g.addColorStop(0.5, b.outer + "66");
        g.addColorStop(1,   b.outer + "00");
        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle   = g;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw silk lines
      silks.forEach((s) => {
        const cx0 = (s.cx0 + Math.sin(t * s.fcx0 + s.pcx0) * s.acx) * W();
        const cy0 = (s.cy0 + Math.sin(t * s.fcy0 + s.pcy0) * s.acy) * H();
        const cx1 = (s.cx1 + Math.sin(t * s.fcx1 + s.pcx1) * s.acx) * W();
        const cy1 = (s.cy1 + Math.sin(t * s.fcy1 + s.pcy1) * s.acy) * H();
        ctx.save();
        ctx.globalAlpha  = s.alpha;
        ctx.strokeStyle  = s.color;
        ctx.lineWidth    = s.width;
        ctx.lineCap      = "round";
        ctx.beginPath();
        ctx.moveTo(s.x0 * W(), s.y0 * H());
        ctx.bezierCurveTo(cx0, cy0, cx1, cy1, s.x1 * W(), s.y1 * H());
        ctx.stroke();
        ctx.restore();
      });

      // Draw sparkles
      sparks.forEach((s) => {
        s.x += s.vx; s.y += s.vy;
        if (s.y < -0.02) { s.y = 1.02; s.x = rand(0, 1); }
        const alpha = Math.max(0, Math.min(1, s.ab + Math.sin(t * s.fr * 1000 + s.ph) * s.aa));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = s.color;
        ctx.shadowBlur  = s.size * 5;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x * W(), s.y * H(), s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ewd-step-bg-canvas" aria-hidden="true" />;
}

// ─── STEP SCREEN ──────────────────────────────────────────────────────────────
const STEP_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.ahmedalmaghribi.com/public/";

function StepScreen({ step, onNext, onBack, stepIdx, total, steps, answers, onAnswer, t, locale }) {
  const isRtl = locale === "ar";
  const prizes = locale === "ar" ? PRIZES_AR : PRIZES_EN;
  const [selected, setSelected]   = useState(answers[step.id] || null);
  const [confirmed, setConfirmed] = useState(!!answers[step.id]);
  const [toggleChoice, setToggle] = useState(null);
  const [text, setText]           = useState("");
  const [product, setProduct]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── Fetch product images using exact product IDs (verified from API) ────────
  const [stepProductImgs, setStepProductImgs] = useState({});
  useEffect(() => {
    const needsImages =
      (step.id === "scent_note") ||
      (step.id === "bestseller") ||
      (step.type === "textarea_product");
    if (!needsImages) return;

    fetchProductsOnce(STEP_API_URL).then(({ byId, byImages }) => {
      const map = {};
      Object.entries(KNOWN_IDS).forEach(([name, id]) => {
        map[name] = id ? resolveProductUrl(id, byId, byImages, STEP_API_URL) : null;
      });
      setStepProductImgs(map);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  // Text is always optional; for textarea_product a product pick is required
  const canTextSubmit = step.type !== "textarea_product" || !!product;

  const handleChoice = (id) => {
    if (confirmed) return;
    setSelected(id);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    onAnswer(step.id, selected);
    // If step has no reveal, auto-advance quickly
    // If step HAS a reveal, stay on screen so user can read it - they click Next manually
    if (!step.reveal) {
      setTimeout(() => onNext(), 400);
    }
  };

  const handleTextSubmit = () => {
    if (!canTextSubmit) return;
    setSubmitted(true);
    onAnswer(step.id, text);
    setTimeout(() => onNext(), 700);
  };

  const handleToggleText = () => {
    if (!canTextSubmit) return;
    setSubmitted(true);
    onAnswer(step.id, `${toggleChoice}:${text}`);
    setTimeout(() => onNext(), 700);
  };

  const handleProductText = () => {
    if (!canTextSubmit) return;
    setSubmitted(true);
    // Use ||| as separator so colons in the answer text don't break parsing
    onAnswer(step.id, `${product}|||${text}`);
    setTimeout(() => onNext(), 700);
  };

  // Reveal logic for choice steps
  const showReveal = confirmed && step.reveal;
  const isCorrect  = step.reveal && selected === step.reveal.answer;

  return (
    <motion.div className="ewd-step-screen" dir={isRtl ? "rtl" : "ltr"}
      key={step.id}
      initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRtl ? 40 : -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <StepBg />

      <StepProgress current={stepIdx + 1} total={total} onBack={onBack} sections={steps} isRtl={isRtl} />

      <div className="ewd-step-body">
        {/* Section badge */}
        <motion.div className="ewd-step-section-badge"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="ewd-step-section-icon">{step.icon}</span>
          <span>{step.section}</span>
        </motion.div>

        {/* Question */}
        <motion.h2 className="ewd-step-question"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
          {step.question}
        </motion.h2>

        {/* CHOICE */}
        {(step.type === "choice" || step.type === "true_false") && (
          <motion.div className="ewd-step-options"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            {step.options.map((opt) => {
              let cls = "ewd-step-option";
              if (selected === opt.id) cls += " selected";
              if (confirmed && step.reveal) {
                if (opt.id === step.reveal.answer) cls += " correct";
                else if (opt.id === selected)      cls += " wrong";
              }
              // opt.img = static local image (scent_note); stepProductImgs = API product image (bestseller etc.)
              const optImg = opt.img || stepProductImgs[opt.label];
              const isFirstStep = step.id === "scent_note";
              const imgStyle = opt.img
                ? { objectFit: "cover" }   // atmospheric scent images fill the card
                : { objectFit: "contain" }; // product bottle images stay contained
              return (
                <button key={opt.id} className={cls}
                  onClick={() => handleChoice(opt.id)}
                  disabled={confirmed}>
                  {optImg && (
                    <span className="ewd-step-option__img">
                      <Image src={optImg} alt={opt.label} fill unoptimized priority={isFirstStep} style={imgStyle} sizes="90px" onError={(e) => { e.target.style.opacity = 0; }} />
                    </span>
                  )}
                  <span className="ewd-step-option__text">
                    <span className="ewd-step-option__label">{opt.label}</span>
                    {opt.desc && <span className="ewd-step-option__desc">{opt.desc}</span>}
                  </span>
                  {selected === opt.id && !confirmed && (
                    <span className="ewd-step-option__check">✓</span>
                  )}
                </button>
              );
            })}

            {/* Confirm button */}
            {selected && !confirmed && (
              <motion.button className="ewd-step-btn-next"
                onClick={handleConfirm}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {t.nextBtn} →
              </motion.button>
            )}

            {/* Next button shown after reveal so user can read it */}
            {confirmed && step.reveal && (
              <motion.button className="ewd-step-btn-next"
                onClick={onNext}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {t.nextBtn} →
              </motion.button>
            )}

            {/* Reveal banner */}
            <AnimatePresence>
              {showReveal && (
                <motion.div className={`ewd-step-reveal ${isCorrect ? "correct" : "wrong"}`}
                  initial={{ opacity: 0, y: 8, scaleY: 0.8 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  transition={{ duration: 0.45 }}>
                  {step.reveal.text}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TEXTAREA */}
        {step.type === "textarea" && (
          <motion.div className="ewd-step-textarea-wrap"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <textarea className="ewd-step-textarea" placeholder={step.placeholder}
                    value={text} onChange={(e) => setText(e.target.value)} rows={5} />
                  <button className="ewd-step-btn-next" onClick={handleTextSubmit}
                    disabled={!canTextSubmit} style={{ opacity: canTextSubmit ? 1 : 0.42 }}>
                     {t.submitAnswer}
                  </button>
                </motion.div>
              ) : (
                <motion.div className="ewd-step-submitted" key="done"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  {t.submittedMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TEXTAREA PRODUCT — pill selector only, no textarea */}
        {step.type === "textarea_product" && (
          <motion.div className="ewd-step-textarea-wrap"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="ewd-fragrance-label">{step.productLabel}</span>
                  <div className="ewd-fragrance-pills">
                    {step.products.map((p) => {
                      const pillImg = stepProductImgs[p];
                      return (
                        <button
                          key={p}
                          type="button"
                          className={`ewd-fragrance-pill${product === p ? " selected" : ""}${pillImg ? " has-img" : ""}`}
                          onClick={() => {
                            setProduct(p);
                            // Auto-submit when a pill is tapped
                            onAnswer(step.id, p);
                            setSubmitted(true);
                            setTimeout(() => onNext(), 700);
                          }}
                          disabled={submitted}
                        >
                          {pillImg && (
                            <span className="ewd-fragrance-pill__img">
                              <Image src={pillImg} alt={p} fill unoptimized style={{ objectFit: "contain" }} sizes="56px" onError={(e) => { e.target.style.opacity = 0; }} />
                            </span>
                          )}
                          <span className="ewd-fragrance-pill__name">{p}</span>
                          <span className="ewd-fragrance-pill__check">✓</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div className="ewd-step-submitted" key="done"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  {t.submittedMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}


        {/* TOGGLE — auto-advances on selection, no textarea */}
        {step.type === "toggle_text" && (
          <motion.div className="ewd-step-textarea-wrap"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="ewd-step-toggle">
              {step.toggleOptions.map((opt) => (
                <button key={opt.id}
                  className={`ewd-step-toggle__btn ${toggleChoice === opt.id ? "active" : ""}`}
                  onClick={() => {
                    setToggle(opt.id);
                    onAnswer(step.id, opt.id);
                    setSubmitted(true);
                    setTimeout(() => onNext(), 500);
                  }}
                  disabled={submitted}>
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
            {submitted && (
              <motion.div className="ewd-step-submitted"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {t.submittedMsg}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* CHIPS */}
        {step.type === "chips" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <ChipsStep step={step} onNext={onNext} t={t} />
          </motion.div>
        )}

        {/* SPIN */}
        {step.type === "spin" && (
          <motion.div className="ewd-step-spin-wrap"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <p className="ewd-step-spin-sub">{step.sub}</p>
            <SpinStep prizes={prizes} onNext={onNext} t={t} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── CUSTOMER FORM MODAL ──────────────────────────────────────────────────────
function CustomerFormModal({ onSubmit, t, isRtl }) {
  const [form, setForm] = useState({ fullName: "", email: "", contactNumber: "" });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.div className="ewd-customer-form-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="ewd-customer-form-modal"
        initial={{ scale: 0.88, y: 40 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}
        dir={isRtl ? "rtl" : "ltr"}>
        <div className="ewd-customer-form-modal__header">
          <h2 className="ewd-customer-form-modal__title">{t.formTitle}</h2>
          <p className="ewd-customer-form-modal__sub">{t.formSub}</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="ewd-customer-form-modal__form">
          <div className="ewd-customer-form-field">
            <label>{t.formFullName}</label>
            <input
              type="text"
              placeholder={t.formFullNamePlaceholder}
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            />
          </div>
          <div className="ewd-customer-form-field">
            <label>{t.formEmail}</label>
            <input
              type="email"
              placeholder={t.formEmailPlaceholder}
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="ewd-customer-form-field">
            <label>{t.formContact}</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder={t.formContactPlaceholder}
              value={form.contactNumber}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9+ ()-]/g, "");
                setForm((p) => ({ ...p, contactNumber: v }));
              }}
            />
          </div>
          <motion.button
            type="submit"
            className="ewd-step-btn-primary ewd-customer-form-modal__submit"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {t.formSubmit} →
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
// ─── ATTRACT SCREEN (Kiosk idle / screensaver) ────────────────────────────────────
function AttractScreen({ onTap, isRtl }) {
  const videoRef    = useRef(null);
  const loopCount   = useRef(0);       // how many times the video has fully played
  const pausedByMax = useRef(false);   // true once we've hit 3 loops
  const MAX_LOOPS   = 3;

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // ── 1. Resume from beginning on any user interaction after 3 loops ─────────
    const onInteract = () => {
      if (!pausedByMax.current) return;
      pausedByMax.current = false;
      loopCount.current   = 0;
      vid.currentTime     = 0;
      vid.play().catch(() => {});
    };
    document.addEventListener("pointerdown", onInteract);
    document.addEventListener("keydown",     onInteract);

    // ── 2. Count loops; pause after MAX_LOOPS ──────────────────────────────────
    const onEnded = () => {
      loopCount.current += 1;
      if (loopCount.current >= MAX_LOOPS) {
        // Hold on the last frame — frees the decoder / GPU pressure
        pausedByMax.current = true;
        vid.pause();
      } else {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    };
    vid.addEventListener("ended", onEnded);

    // ── 3. IntersectionObserver — pause when off-screen ───────────────────────
    const io = new IntersectionObserver(
      ([entry]) => {
        if (pausedByMax.current) return; // already paused by loop limit
        if (entry.intersectionRatio < 0.1) {
          vid.pause();
        } else {
          vid.play().catch(() => {});
        }
      },
      { threshold: 0.1 }
    );
    io.observe(vid);

    // ── 4. Page Visibility API — pause when tab is hidden ─────────────────────
    const onVisibility = () => {
      if (pausedByMax.current) return;
      if (document.hidden) vid.pause();
      else                  vid.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ── Start ─────────────────────────────────────────────────────────────────
    vid.play().catch(() => {});

    return () => {
      vid.pause();
      vid.src = ""; // release GPU memory / decoder immediately
      vid.removeEventListener("ended", onEnded);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("pointerdown", onInteract);
      document.removeEventListener("keydown",     onInteract);
    };
  }, []);

  return (
    <motion.div
      className="ewd-attract"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onTap}
    >
      {/* No `loop` attr — we handle looping manually to count iterations */}
      <video
        ref={videoRef}
        className="ewd-attract__video"
        src="/assets/ewd-video.mp4"
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
      />

      {/* Dark overlay so text is readable */}
      <div className="ewd-attract__overlay" />

      {/* Pulsing prompt — CSS @keyframes keeps animation off the JS thread */}
      <div className="ewd-attract__cta ewd-attract__cta--pulse">
        <div className="ewd-attract__cta-title">
          {isRtl ? "اضغطي للبدء" : "Tap to Begin"}
        </div>
        <div className="ewd-attract__cta-sub">
          {isRtl
            ? "اكتشفي عطركِ المثالي مع أحمد المغربي"
            : "Discover Your Signature Scent with Ahmed Al Maghribi"}
        </div>
      </div>
    </motion.div>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart, t, isRtl }) {
  const [showForm, setShowForm] = useState(false);

  const handleBegin = () => setShowForm(true);
  const handleFormSubmit = (customerData) => {
    // Customer data collected; proceed to quiz
    setShowForm(false);
    onStart(customerData);
  };

  return (
    <>
      <motion.div className="ewd-step-intro" dir={isRtl ? "rtl" : "ltr"}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="ewd-step-intro__badge"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {t.eventName}
        </motion.div>
        <motion.h1 className="ewd-step-intro__heading"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.7 }}>
          {t.introHeading}<br /><em>{t.introHeadingEm}</em>
        </motion.h1>
        <motion.p className="ewd-step-intro__desc"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}>
          {t.introDesc}
        </motion.p>
        <motion.div className="ewd-step-intro__stages"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.58 }}>
          {t.stages.map((s) => <div key={s} className="ewd-step-intro__stage">{s}</div>)}
        </motion.div>
        {/* <motion.div className="ewd-step-intro__meta"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68 }}>
          <span>{TOTAL} {t.questions}</span>
          <span className="ewd-step-intro__dot" />
          <span>{t.timeEst}</span>
          <span className="ewd-step-intro__dot" />
          <span>{t.tagline}</span>
        </motion.div> */}
        <motion.button className="ewd-step-btn-primary ewd-step-intro__cta"
          onClick={handleBegin} id="ewd-start-experience"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <span>{t.startBtn}</span>
          <span>→</span>
        </motion.button>
      </motion.div>
      <AnimatePresence>
        {showForm && (
          <CustomerFormModal onSubmit={handleFormSubmit} t={t} isRtl={isRtl} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const UI = {
  en: {
    eventName: "Emirati Women's Day",
    introHeading: "Discover Your",
    introHeadingEm: "Scent Story",
    introDesc: "A curated journey through fragrance and heritage. Your answers reveal a perfume portrait as unique as you are.",
    stages: ["Fragrance", "Heritage", "Win a Prize"],
    questions: "Questions",
    timeEst: "~3 Minutes",
    tagline: "Your Scent Journey",
    startBtn: "Begin the Experience",
    nextBtn: "Next",
    submitAnswer: "Submit My Answer",
    submittedMsg: "Beautiful, moving forward…",
    wellDone: "Well done! You know your Ahmed Al Maghribi.",
    section: "Section",
    youWon: "Congratulations!",
    congratsMsg: "What a wonderful moment - you've earned this! We hope this prize adds a little joy to your day and reminds you of the beauty of this celebration. Enjoy it with our warmest wishes.",
    staffNote2: "Tap the button above to reset.",
    collectPrize: "Claim My Prize",
    spinLabel: "Spin the Wheel!",
    spunLabel: "Thank You!",
    yourResult: "Your Result",
    yourMatch: "Your Perfect Fragrance Match",
    askTeam: "Ask our team for",
    topPick: "Your Top Pick",
    alsoLove: "You Might Also Love",
    saveResult: "Shop Your Match",
    saveDesc: "Scan to find your recommended fragrance on our website.",
    qrNote: "Opens the product page for your matched scent.",
    nextCustomer: "Thank You",
    formTitle: "Welcome",
    formSub: "Before we begin, please share your details.",
    formFullName: "Full Name",
    formFullNamePlaceholder: "Your full name",
    formEmail: "Email Address",
    formEmailPlaceholder: "your@email.com",
    formContact: "Contact Number",
    formContactPlaceholder: "+971 xx xxx xxxx",
    formSubmit: "Begin the Experience",
  },
  ar: {
    eventName: "يوم المرأة الإماراتية",
    introHeading: "اكتشفي",
    introHeadingEm: "قصتكِ العطرية",
    introDesc: "رحلة مختارة بعناية عبر العطر والتراث. إجاباتكِ ترسم صورة عطرية بقدر تفردكِ.",
    stages: ["العطر", "التراث", "فوزي بجائزة"],
    questions: "أسئلة",
    timeEst: "~٣ دقائق",
    tagline: "رحلتكِ العطرية",
    startBtn: "ابدئي التجربة",
    nextBtn: "التالي",
    submitAnswer: "أرسلي إجابتي",
    submittedMsg: "جميل - ننتقل للأمام…",
    wellDone: "أحسنتِ! أنتِ تعرفين أحمد المغربي.",
    section: "القسم",
    youWon: "مبروك!",
    congratsMsg: "يا له من لحظة رائعة - لقد استحققتِ هذا! نأمل أن تضيف هذه الجائزة لمسة من الفرح ليومكِ وتذكّركِ بجمال هذا الاحتفال. استمتعي بها مع أدفأ أمنياتنا.",
    staffNote2: "للموظف: اضغطي أعلاه لإعادة الضبط للعميلة التالية.",
    collectPrize: "استلمي جائزتي",
    spinLabel: "أديري العجلة!",
    spunLabel: "لقد لعبتِ!",
    yourResult: "نتيجتكِ",
    yourMatch: "عطركِ المثالي",
    askTeam: "اطلبي من فريقنا",
    topPick: "اختيارك المثالي",
    alsoLove: "قد تعجبكِ أيضاً",
    saveResult: "تسوّقي مطابقتكِ",
    saveDesc: "امسحي الرمز للعثور على عطركِ الموصى به على موقعنا.",
    qrNote: "يفتح صفحة المنتج لعطركِ المختار.",
    nextCustomer: "العميلة التالية",
    formTitle: "أهلاً بكِ",
    formSub: "قبل أن نبدأ، يرجى مشاركة بياناتكِ.",
    formFullName: "الاسم الكامل",
    formFullNamePlaceholder: "اسمكِ الكامل",
    formEmail: "البريد الإلكتروني",
    formEmailPlaceholder: "your@email.com",
    formContact: "رقم التواصل",
    formContactPlaceholder: "+971 xx xxx xxxx",
    formSubmit: "ابدئي التجربة",
  },
};


// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function EWDStepExperience({ onScentChoice, onReset }) {
  const locale  = useLocale();
  const isRtl   = locale === "ar";
  const t       = UI[locale] || UI.en;
  const steps   = locale === "ar" ? STEPS_AR : STEPS_EN;
  const TOTAL_STEPS = steps.length;

  const [phase,      setPhase]      = useState("attract"); // attract | intro | quiz | result
  const [stepIdx,    setStepIdx]    = useState(0);
  const [answers,    setAnswers]    = useState({});
  const [customerData, setCustomerData] = useState(null); // from the entry form

  // ── Kick off product image fetch immediately on mount so images are warm by step 1 ──
  // After data loads, inject <link rel="preload"> for every product image to prime the cache.
  useEffect(() => {
    fetchProductsOnce(API_URL).then(({ byId, byImages }) => {
      const urls = new Set();
      Object.values(KNOWN_IDS).forEach((id) => {
        const url = resolveProductUrl(id, byId, byImages, API_URL);
        if (url) urls.add(url);
      });
      urls.forEach((url) => {
        if (document.querySelector(`link[rel="preload"][href="${url}"]`)) return;
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;
        document.head.appendChild(link);
      });
    });
  }, []);

  // ── Idle timeout: return to attract after 2 min of no interaction ──────────
  const idleTimer = useRef(null);
  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    // Only count idle during intro/quiz phases (not during result — staff needs time)
    if (phase === "intro" || phase === "quiz") {
      idleTimer.current = setTimeout(() => setPhase("attract"), 2 * 60 * 1000);
    }
  };
  useEffect(() => {
    if (phase === "intro" || phase === "quiz") {
      resetIdleTimer();
      window.addEventListener("click", resetIdleTimer);
      window.addEventListener("touchstart", resetIdleTimer);
    }
    return () => {
      clearTimeout(idleTimer.current);
      window.removeEventListener("click", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleStart = (formData) => {
    setCustomerData(formData);
    setPhase("quiz");
    setStepIdx(0);
    setAnswers({});
  };

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    // Pass scent choice up for result screen
    if (id === "scent_note" && onScentChoice) onScentChoice(value);
  };

  const handleNext = () => {
    if (stepIdx < TOTAL_STEPS - 1) {
      setStepIdx((s) => s + 1);
    } else {
      setPhase("result");
    }
  };

  const handleBack = () => {
    if (stepIdx > 0) setStepIdx((s) => s - 1);
    else setPhase("intro");
  };

  const handleReset = () => {
    setPhase("attract");
    setStepIdx(0);
    setAnswers({});
    setCustomerData(null);
    if (onReset) onReset();
  };

  return (
    <div className="ewd-steps-shell" dir={isRtl ? "rtl" : "ltr"}>
      <AnimatePresence mode="wait">
        {phase === "attract" && (
          <AttractScreen key="attract" onTap={() => setPhase("intro")} isRtl={isRtl} />
        )}

        {phase === "intro" && (
          <IntroScreen key="intro" onStart={handleStart} t={t} isRtl={isRtl} />
        )}

        {phase === "quiz" && (
          <StepScreen
            key={`step-${stepIdx}`}
            step={steps[stepIdx]}
            stepIdx={stepIdx}
            total={TOTAL_STEPS}
            steps={steps}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
            t={t}
            locale={locale}
          />
        )}

        {phase === "result" && (
          <ResultScreen
            key="result"
            answers={answers}
            onReset={handleReset}
            t={t}
            locale={locale}
            customerData={customerData}
          />
        )}
      </AnimatePresence>

      {/* Floating staff reset */}
      {/* <div className="ewd-step-staff-bar">
        <span className="ewd-step-staff-bar__label">
          {isRtl ? "👩‍💼 تحكّم الموظف" : "👩‍💼 Staff Controls"}
        </span>
        <button className="ewd-step-staff-bar__reset" onClick={handleReset} id="ewd-staff-reset">
          {isRtl ? "🔄 إعادة للعميلة التالية" : "🔄 Reset"}
        </button>
      </div> */}
    </div>
  );
}
