"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PART1_QUESTIONS, PART2_QUESTIONS, ALL_QUESTIONS, computeRecommendations } from "./scentData";
import QuestionStep from "./QuestionStep";
import ScentResults from "./ScentResults";
import "./FindYourScent.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const TOTAL = ALL_QUESTIONS.length;

// ─── SCENT DNA UTILS ────────────────────────────────────────────────────────
const DNA_KEY = "ahmed_scent_dna";

function saveDNA(result, answers) {
  try {
    localStorage.setItem(DNA_KEY, JSON.stringify({
      savedAt: Date.now(),
      answers,
      profile: result.profile,
      recommendations: result.recommendations,
    }));
  } catch {}
}

function loadDNA() {
  try {
    const raw = localStorage.getItem(DNA_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Expire after 90 days
    if (Date.now() - data.savedAt > 90 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(DNA_KEY);
      return null;
    }
    return data;
  } catch { return null; }
}

function clearDNA() {
  try { localStorage.removeItem(DNA_KEY); } catch {}
}

// ─── INTRO ────────────────────────────────────────────────────────────────────
function IntroScreen({ onStart, onResumeDNA, savedDNA }) {
  const savedDate = savedDNA
    ? new Date(savedDNA.savedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <motion.div className="fys-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <motion.span className="fys-intro__eyebrow"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        A Private Consultation
      </motion.span>

      <motion.h1 className="fys-intro__headline"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        An Olfactive<br /><em>Portrait</em>
      </motion.h1>

      <motion.p className="fys-intro__body"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
      >
        Eight carefully crafted questions. Your answers reveal a fragrance
        portrait as individual and unmistakable as your own signature.
      </motion.p>

      <motion.div className="fys-intro__stages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.58 }}>
        <div className="fys-intro__stage">Identity</div>
        <div className="fys-intro__stage">Character</div>
        <div className="fys-intro__stage">Senses</div>
      </motion.div>

      <motion.div className="fys-intro__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68 }}>
        <span>8 Questions</span><span className="fys-dot" /><span>3 Minutes</span><span className="fys-dot" /><span>Your Signature</span>
      </motion.div>

      {/* Saved DNA banner */}
      {savedDNA && (
        <motion.div
          className="fys-dna-banner"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        >
          <div className="fys-dna-banner__top">
            <span className="fys-dna-banner__icon">◆</span>
            <span className="fys-dna-banner__label">Scent DNA Saved</span>
            <span className="fys-dna-banner__date">{savedDate}</span>
          </div>
          {savedDNA.profile?.title && (
            <p className="fys-dna-banner__title">{savedDNA.profile.title}</p>
          )}
          <div className="fys-dna-banner__actions">
            <button className="fys-btn-primary" onClick={onResumeDNA} id="fys-resume-dna">
              <span>View My Results</span>
              <span className="fys-btn-arrow">→</span>
            </button>
            <button className="fys-dna-banner__retake" onClick={onStart}>
              Retake Quiz
            </button>
          </div>
        </motion.div>
      )}

      {!savedDNA && (
        <motion.button className="fys-btn-primary" onClick={onStart} id="fys-start-experience"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78 }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          <span>Begin My Portrait</span>
          <span className="fys-btn-arrow">→</span>
        </motion.button>
      )}
    </motion.div>
  );
}

// ─── PART TRANSITION ──────────────────────────────────────────────────────────
function PartTransition({ name, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div className="fys-transition-screen"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.7 }}
    >
      <motion.div className="fys-transition-screen__act" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        Act <em>II</em>
      </motion.div>
      <motion.h2 className="fys-transition-screen__title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
        {name ? `Beautiful, ${name}.` : "Perfect."}<br />
        <em>Now let&apos;s explore your senses.</em>
      </motion.h2>
      <motion.p className="fys-transition-screen__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
        We&apos;ll now map your olfactive preferences — the notes, families, and intensity that define your signature.
      </motion.p>
      <motion.div className="fys-transition-screen__bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.0, duration: 1.8, ease: "linear" }} />
    </motion.div>
  );
}

// ─── BOTTLE SVG ─────────────────────────────────────────────────────────────
const BottleSVG = () => (
  <svg width="18" height="28" viewBox="0 0 18 28" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M6 4 L6 2 L12 2 L12 4" />
    <path d="M4 4 L4 10 C1 12 1 15 1 15 L1 25 C1 26.1 1.9 27 3 27 L15 27 C16.1 27 17 26.1 17 25 L17 15 C17 15 17 12 14 10 L14 4 Z" />
    <line x1="1" y1="16" x2="17" y2="16" />
  </svg>
);

// ─── PROGRESS (numbered dots + bottle icons) ─────────────────────────────────
function Progress({ current, total, onBack }) {
  const pct = Math.round((current / total) * 100);
  const DOTS = [
    { label: "About",       n: 1, pos: 2 / total },
    { label: "Personality", n: 2, pos: 5 / total },
    { label: "Scents",      n: 3, pos: 8 / total },
  ];
  const prog = current / total;
  return (
    <div className="fys-progress">
      <button className="fys-progress__back" onClick={onBack}>
        ← BACK
      </button>
      <span className="fys-progress__bottle" style={{ color: "var(--ink)" }}><BottleSVG /></span>
      <div className="fys-progress__track">
        <motion.div className="fys-progress__fill" animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
        {/* % badge travels with fill */}
        <motion.div style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)" }}
          animate={{ left: `${pct}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="fys-progress__pct">{pct}%</span>
        </motion.div>
        {DOTS.map((d) => {
          const done = prog > d.pos;
          const active = !done && prog > (d.pos - 3 / total);
          return (
            <div key={d.n} className={`fys-progress__dot ${done ? "fys-progress__dot--done" : ""} ${active ? "fys-progress__dot--active" : ""}`}
              style={{ left: `${d.pos * 100}%` }}
            >
              <div className="fys-progress__dot-num">{d.n}</div>
              <span className="fys-progress__dot-label">{d.label}</span>
            </div>
          );
        })}
      </div>
      <span className="fys-progress__bottle" style={{ color: "var(--ink5)" }}><BottleSVG /></span>
    </div>
  );
}

// ─── COMPUTING ────────────────────────────────────────────────────────────────
function ComputingScreen({ name }) {
  const msgs = [
    "Reading your olfactive signature…",
    "Matching fragrance families…",
    "Scoring notes and accords…",
    name ? `Curating your selection, ${name}…` : "Curating your collection…",
  ];
  const [msg, setMsg] = useState(0);
  useEffect(() => { const t = setInterval(() => setMsg((m) => Math.min(m + 1, msgs.length - 1)), 600); return () => clearInterval(t); }, []);

  return (
    <motion.div className="fys-computing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fys-computing__loader" />
      <AnimatePresence mode="wait">
        <motion.p key={msg} className="fys-computing__msg"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
        >{msgs[msg]}</motion.p>
      </AnimatePresence>
      <div className="fys-computing__badge">◆ Scent Intelligence™</div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FindYourScent() {
  const [phase, setPhase] = useState("intro"); // intro|quiz|transition|computing|results
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [savedDNA, setSavedDNA] = useState(null);
  const productsRef = useRef([]);

  const userName = answers.name || "";
  const currentQ = ALL_QUESTIONS[stepIdx];
  const currentPart = currentQ?.part || 1;

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Load saved DNA on mount
    const dna = loadDNA();
    if (dna) setSavedDNA(dna);

    // Fetch ALL products for scoring — POST with limit:1000 (same pattern as rest of site)
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}api/allProducts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, limit: 1000 }),
        });
        const data = await res.json();
        productsRef.current = data.data || [];
      } catch { /* silent — scoring still works if this fails */ }
    })();
  }, []);

  const handleAnswer = useCallback((optionId, advance = true) => {
    const qId = ALL_QUESTIONS[stepIdx].id;
    const newAnswers = { ...answers, [qId]: optionId };
    setAnswers(newAnswers);

    // For multi-select image grid, advance=false means just record, advance=true means go next
    if (!advance) return;

    const isLast = stepIdx === ALL_QUESTIONS.length - 1;

    if (isLast) {
      setPhase("computing");

      const finalize = async () => {
        const computed = computeRecommendations(newAnswers, productsRef.current);

        const enriched = await Promise.all(
          computed.recommendations.map(async (rec) => {
            try {
              const p = rec.product;
              const res = await fetch(`${BASE_URL}api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  category: (p.category_name || "PERFUMES").toUpperCase(),
                  subCategory: p.subcategory?.subcategory_name || "",
                  product: p.product_name,
                }),
              });
              const full = await res.json();
              if (full && full.product_id) return { ...rec, product: { ...p, ...full } };
            } catch {}
            return rec;
          })
        );

        setResult({ ...computed, recommendations: enriched, answers: newAnswers });
        setPhase("results");
        // ── Auto-save Scent DNA to localStorage ──
        saveDNA({ ...computed, recommendations: enriched }, newAnswers);
        setSavedDNA(loadDNA());
      };

      setTimeout(() => finalize(), reducedMotion ? 200 : 2200);
    } else {
      setTimeout(() => setStepIdx((s) => s + 1), reducedMotion ? 0 : 350);
    }
  }, [answers, stepIdx, reducedMotion]);

  const handleNameSubmit = useCallback((name) => {
    setAnswers((a) => ({ ...a, name }));
    setTimeout(() => setStepIdx((s) => s + 1), reducedMotion ? 0 : 300);
  }, [reducedMotion]);

  const handleTransitionDone = useCallback(() => {
    setStepIdx(PART1_QUESTIONS.length);
    setPhase("quiz");
  }, []);

  const handleBack = useCallback(() => {
    if (stepIdx > 0) setStepIdx((s) => s - 1);
    else setPhase("intro");
  }, [stepIdx]);

  const handleRetake = useCallback(() => {
    clearDNA();
    setSavedDNA(null);
    setAnswers({}); setStepIdx(0); setResult(null); setPhase("intro");
  }, []);

  const handleResumeDNA = useCallback(() => {
    if (!savedDNA) return;
    setResult({
      recommendations: savedDNA.recommendations,
      profile: savedDNA.profile,
      answers: savedDNA.answers,
    });
    setAnswers(savedDNA.answers || {});
    setPhase("results");
  }, [savedDNA]);

  return (
    <section className="fys-section" aria-label="Find Your Scent">
      <div className="fys-container">
        <AnimatePresence mode="wait">
          {phase === "intro" && <IntroScreen key="intro" onStart={() => { clearDNA(); setSavedDNA(null); setPhase("quiz"); }} savedDNA={savedDNA} onResumeDNA={handleResumeDNA} />}

          {phase === "quiz" && currentQ && (
            <motion.div key={`q-${stepIdx}`}
              style={{width:"100%",display:"flex",flexDirection:"column",minHeight:"calc(100vh - 140px)"}}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Progress current={stepIdx + 1} total={TOTAL} onBack={handleBack} />
              <QuestionStep
                question={currentQ}
                selectedAnswer={answers[currentQ.id]}
                onAnswer={handleAnswer}
                onNameSubmit={handleNameSubmit}
                userName={userName}
              />
            </motion.div>
          )}

          {phase === "transition" && (
            <PartTransition key="transition" name={userName} onDone={handleTransitionDone} />
          )}

          {phase === "computing" && <ComputingScreen key="computing" name={userName} />}

          {phase === "results" && result && (
            <motion.div key="results" style={{width:"100%"}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <ScentResults
                recommendations={result.recommendations}
                scentProfile={result.profile}
                answers={result.answers || answers}
                userName={userName}
                onRetake={handleRetake}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
