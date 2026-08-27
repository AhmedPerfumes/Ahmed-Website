"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import EWDHero from "@/components/emiratiwomenday/EWDHero";
import EWDScentQuiz from "@/components/emiratiwomenday/EWDScentQuiz";
import EWDHeritageJournal from "@/components/emiratiwomenday/EWDHeritageJournal";
import EWDTriviaWheel from "@/components/emiratiwomenday/EWDTriviaWheel";
import EWDProductStrip from "@/components/emiratiwomenday/EWDProductStrip";
import EWDBakhoor from "@/components/emiratiwomenday/EWDBakhoor";
import EWDSocialFooter from "@/components/emiratiwomenday/EWDSocialFooter";
import EWDResultScreen from "@/components/emiratiwomenday/EWDResultScreen";

const translations = {
  en: { staffLabel: "👩‍💼 Staff Controls", resetBtn: "🔄 Reset for Next Customer" },
  ar: { staffLabel: "👩‍💼 تحكّم الموظف", resetBtn: "🔄 إعادة للعميلة التالية" },
};

export default function EWDPageClient() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;

  // Track scent personality choice for result screen
  const [scentChoice, setScentChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionKey, setSessionKey] = useState(0); // forces re-mount on reset

  const handleReset = useCallback(() => {
    setScentChoice(null);
    setShowResult(false);
    setSessionKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="ewd-page" dir={isRtl ? "rtl" : "ltr"} key={sessionKey}>
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div key="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* 1 — Hero */}
            <EWDHero />

            {/* 2 — Scent Quiz (passes scent choice up) */}
            <EWDScentQuiz onScentChoice={(choice) => setScentChoice(choice)} />

            {/* 3 — Heritage Journal */}
            <EWDHeritageJournal />

            {/* 4 — Trivia + Spin to Win */}
            <EWDTriviaWheel />

            {/* 5 — Women's Collection */}
            <EWDProductStrip />

            {/* 6 — Bakhoor Heritage */}
            <EWDBakhoor />

            {/* 7 — In-store finale (no Instagram CTA) */}
            <EWDSocialFooter onShowResult={() => setShowResult(true)} />
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EWDResultScreen scentChoice={scentChoice} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating staff reset bar — always visible */}
      <div className="ewd-staff-bar">
        <span className="ewd-staff-bar__label">{t.staffLabel}</span>
        <button className="ewd-staff-bar__reset" onClick={handleReset} id="ewd-staff-reset">
          {t.resetBtn}
        </button>
      </div>
    </div>
  );
}
