"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";

// Map scent quiz answers → fragrance recommendation
const RECOMMENDATIONS = {
  Oud:     { en: { name: "Bidun Esam", desc: "Bold, woody Oud — powerful and unforgettable.", note: "Oud & Amber", ask: "Ask our team to try Bidun Esam" }, ar: { name: "بدون اسم", desc: "عود جريء خشبي — قوي لا يُنسى.", note: "العود والعنبر", ask: "اطلبي من فريقنا تجربة بدون اسم" } },
  Rose:    { en: { name: "Niswa", desc: "A romantic floral heart — rose and jasmine for the feminine soul.", note: "Rose & Jasmine", ask: "Ask our team to try Niswa" }, ar: { name: "نسوة", desc: "قلب زهري رومانسي — ورد وياسمين للروح الأنثوية.", note: "الورد والياسمين", ask: "اطلبي من فريقنا تجربة نسوة" } },
  Citrus:  { en: { name: "Shaikhahind", desc: "Bright, fresh and vibrant — a citrus floral that stays with you.", note: "Citrus & Florals", ask: "Ask our team to try Shaikhahind" }, ar: { name: "شيخة هند", desc: "منعش، حيوي ومشرق — زهري حمضي يرافقكِ.", note: "الحمضيات والزهور", ask: "اطلبي من فريقنا تجربة شيخة هند" } },
  العود:   { en: { name: "Bidun Esam", desc: "Bold, woody Oud — powerful and unforgettable.", note: "Oud & Amber", ask: "Ask our team to try Bidun Esam" }, ar: { name: "بدون اسم", desc: "عود جريء خشبي — قوي لا يُنسى.", note: "العود والعنبر", ask: "اطلبي من فريقنا تجربة بدون اسم" } },
  الورد:   { en: { name: "Niswa", desc: "A romantic floral heart — rose and jasmine for the feminine soul.", note: "Rose & Jasmine", ask: "Ask our team to try Niswa" }, ar: { name: "نسوة", desc: "قلب زهري رومانسي — ورد وياسمين للروح الأنثوية.", note: "الورد والياسمين", ask: "اطلبي من فريقنا تجربة نسوة" } },
  الحمضيات:{ en: { name: "Shaikhahind", desc: "Bright, fresh and vibrant — a citrus floral that stays with you.", note: "Citrus & Florals", ask: "Ask our team to try Shaikhahind" }, ar: { name: "شيخة هند", desc: "منعش، حيوي ومشرق — زهري حمضي يرافقكِ.", note: "الحمضيات والزهور", ask: "اطلبي من فريقنا تجربة شيخة هند" } },
};

const DEFAULT_REC = {
  en: { name: "Niswa", desc: "Our most-loved women's fragrance — a delicate floral rose and jasmine.", note: "Rose & Jasmine", ask: "Ask our team to try Niswa" },
  ar: { name: "نسوة", desc: "عطرنا الأكثر حباً للنساء — ورد رقيق وياسمين ناعم.", note: "الورد والياسمين", ask: "اطلبي من فريقنا تجربة نسوة" },
};

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://ahmedalmaghribi.com";

const translations = {
  en: {
    label: "Your Result",
    heading: "Your Perfect",
    headingEm: "Fragrance Match",
    scentNote: "Dominant Note",
    askTeam: "👆 Ask Our Team",
    saveHeading: "Save Your Result",
    saveDesc: "Scan this QR code with your phone to remember your fragrance match.",
    orText: "or visit",
    resetHeading: "Thank You! 🌹",
    resetDesc: "We hope you enjoyed the experience. Our team is here to help you find your perfect scent.",
    resetBtn: "Next Customer →",
    staffResetNote: "Staff: Please tap the button above to reset for the next customer.",
    perfumeFamily: "Fragrance Family",
  },
  ar: {
    label: "نتيجتكِ",
    heading: "عطركِ",
    headingEm: "المثالي",
    scentNote: "النوتة المهيمنة",
    askTeam: "👆 اطلبي من فريقنا",
    saveHeading: "احفظي نتيجتكِ",
    saveDesc: "امسحي رمز QR بهاتفكِ لتتذكري عطركِ المثالي.",
    orText: "أو زوري",
    resetHeading: "شكراً لكِ! 🌹",
    resetDesc: "نأمل أنكِ استمتعتِ بالتجربة. فريقنا هنا لمساعدتكِ في إيجاد عطركِ المثالي.",
    resetBtn: "العميلة التالية →",
    staffResetNote: "للموظف: اضغطي الزر أعلاه لإعادة الضبط للعميلة القادمة.",
    perfumeFamily: "عائلة العطر",
  },
};

export default function EWDResultScreen({ scentChoice, onReset }) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = translations[locale] || translations.en;
  const [showReset, setShowReset] = useState(false);

  const recData = RECOMMENDATIONS[scentChoice] || DEFAULT_REC;
  const rec = recData[locale] || recData.en;

  const qrUrl = `${SITE_BASE}/${locale}/emirati-women-day`;

  return (
    <AnimatePresence mode="wait">
      {!showReset ? (
        <motion.section
          key="result"
          id="ewd-result"
          className="ewd-section ewd-result-screen"
          dir={isRtl ? "rtl" : "ltr"}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
        >
          <div className="ewd-container">
            <div className="ewd-result__inner">
              {/* Left: Recommendation */}
              <div className="ewd-result__rec">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="ewd-section-label" style={{ justifyContent: isRtl ? "flex-end" : "flex-start" }}>
                    {t.label}
                  </div>
                  <h2 className="ewd-heading" style={{ textAlign: isRtl ? "right" : "left" }}>
                    {t.heading} <em>{t.headingEm}</em>
                  </h2>

                  {/* Perfume card */}
                  <div className="ewd-result__perfume-card">
                    <div className="ewd-result__perfume-glow" />
                    <div className="ewd-result__perfume-icon">🌹</div>
                    <div className="ewd-result__perfume-info">
                      <div className="ewd-result__perfume-name">{rec.name}</div>
                      <div className="ewd-result__perfume-note">
                        <span className="ewd-result__note-label">{t.scentNote}</span>
                        <span className="ewd-result__note-val">{rec.note}</span>
                      </div>
                      <p className="ewd-result__perfume-desc">{rec.desc}</p>
                    </div>
                  </div>

                  {/* Ask team CTA — very prominent for in-store */}
                  <motion.div
                    className="ewd-result__ask-team"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>🌹</span>
                    <span>{rec.ask}</span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right: QR + Reset */}
              <div className="ewd-result__side">
                {/* QR Code */}
                <motion.div
                  className="ewd-result__qr-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="ewd-result__qr-heading">{t.saveHeading}</div>
                  <div className="ewd-result__qr-desc">{t.saveDesc}</div>
                  <div className="ewd-result__qr-box">
                    <QRCode
                      value={qrUrl}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#3D1A22"
                      level="M"
                    />
                  </div>
                  <div className="ewd-result__qr-url">
                    <span style={{ opacity: 0.5, fontSize: 11 }}>{t.orText}</span>
                    <span style={{ fontSize: 11, wordBreak: "break-all", color: "var(--ewd-rose)" }}>
                      {qrUrl}
                    </span>
                  </div>
                </motion.div>

                {/* Reset button for staff */}
                <motion.button
                  className="ewd-result__reset-btn"
                  onClick={() => setShowReset(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  id="ewd-reset-btn"
                >
                  {t.resetBtn}
                </motion.button>
                <p className="ewd-result__staff-note">{t.staffResetNote}</p>
              </div>
            </div>
          </div>
        </motion.section>
      ) : (
        /* Thank You / Reset Screen */
        <motion.div
          key="thankyou"
          className="ewd-thankyou-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: "5rem", marginBottom: 24 }}>🌹</div>
          <h2 className="ewd-thankyou__heading">{t.resetHeading}</h2>
          <p className="ewd-thankyou__desc">{t.resetDesc}</p>
          <motion.button
            className="ewd-btn-primary"
            onClick={onReset}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontSize: 16, padding: "18px 48px" }}
            id="ewd-next-customer"
          >
            {t.resetBtn}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
