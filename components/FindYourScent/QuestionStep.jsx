"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── ICONS (64x64 viewBox, bold strokes) ── */
const ICONS = {
  self_him: <svg viewBox="0 0 64 64"><circle cx="32" cy="22" r="12"/><path d="M32 34 L32 52"/><path d="M48 12 L38 22"/><path d="M48 12 L48 20"/><path d="M48 12 L40 12"/></svg>,
  self_her: <svg viewBox="0 0 64 64"><circle cx="32" cy="21" r="12"/><path d="M32 33 L32 50"/><path d="M24 45 L40 45"/></svg>,
  gift_him: <svg viewBox="0 0 64 64"><rect x="14" y="30" width="36" height="22" rx="2"/><rect x="10" y="24" width="44" height="8" rx="2"/><path d="M32 24 L32 52"/><path d="M32 24 C32 18 26 12 22 16 C18 20 24 24 32 24"/><path d="M32 24 C32 18 38 12 42 16 C46 20 40 24 32 24"/><path d="M48 14 L40 22"/><path d="M48 14 L48 20"/><path d="M48 14 L42 14"/></svg>,
  gift_her: <svg viewBox="0 0 64 64"><rect x="14" y="30" width="36" height="22" rx="2"/><rect x="10" y="24" width="44" height="8" rx="2"/><path d="M32 24 L32 52"/><path d="M32 24 C32 18 26 12 22 16 C18 20 24 24 32 24"/><path d="M32 24 C32 18 38 12 42 16 C46 20 40 24 32 24"/><path d="M24 48 L40 48"/></svg>,
  safe: <svg viewBox="0 0 64 64"><path d="M32 8 L50 16 L50 34 C50 46 32 56 32 56 C32 56 14 46 14 34 L14 16 Z"/><path d="M24 32 L30 38 L40 26"/></svg>,
  adventure: <svg viewBox="0 0 64 64"><path d="M12 52 L32 16 L52 52 Z"/><path d="M26 52 L32 40 L38 52"/><circle cx="46" cy="18" r="6"/><line x1="46" y1="8" x2="46" y2="12"/></svg>,
  oriental: <svg viewBox="0 0 64 64"><path d="M32 8 C20 8 12 20 12 32 C12 44 20 52 32 56 C44 52 52 44 52 32 C52 20 44 8 32 8Z"/><path d="M32 20 L34 28 L42 28 L36 33 L38 42 L32 37 L26 42 L28 33 L22 28 L30 28Z"/></svg>,
  occidental: <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/><path d="M32 12 L32 16"/><path d="M32 48 L32 52"/><path d="M12 32 L16 32"/><path d="M48 32 L52 32"/><circle cx="32" cy="32" r="8"/></svg>,
  fusion: <svg viewBox="0 0 64 64"><circle cx="26" cy="32" r="16"/><circle cx="38" cy="32" r="16"/></svg>,
  explore: <svg viewBox="0 0 64 64"><path d="M32 8 L36 24 L52 24 L39 34 L44 52 L32 42 L20 52 L25 34 L12 24 L28 24Z"/></svg>,
};

/* ─── PER-QUESTION ANSWER PANEL COLORS (differentiates visually) ── */
const PANEL_COLORS = {
  "for":       "#D4C5A9",   // warm tan
  "matters":   "#C8BFA8",   // olive sand
  "world":     "#C5D0C8",   // sage green
  "sillage":   "#D8CEB4",   // golden wheat
  "longevity": "#C9C4B8",   // warm grey
};

/* ─── LEARN MORE ── */
function LearnMore({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fys-learn">
      <button className="fys-btn-learn" onClick={() => setOpen(o => !o)}>
        Learn More {open ? "▲" : "▼"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="fys-learn__body-wrap"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}
          >
            <p className="fys-learn__body">{item.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── LEFT PANEL (vertically centered) ── */
function LeftPanel({ question, userName }) {
  return (
    <div className="fys-split__q">
      <motion.div className="fys-split__q-inner"
        initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="fys-split__q-title">
          {userName && question.step > 2 ? `${userName},\n` : ""}{question.question}
        </h2>
        <div className="fys-split__q-meta">
          <span className="fys-btn-select-count">
            {question.multi ? `Select up to ${question.maxSelect || 2}.` : "Select only 1."}
          </span>
          {question.learnMore && <LearnMore item={question.learnMore} />}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── NAME INPUT ── */
function NameInput({ question, onSubmit, userName }) {
  const [val, setVal] = useState(userName || "");
  return (
    <div className="fys-name-screen">
      <motion.div className="fys-name-wrap"
        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="fys-name-eyebrow">Ahmed Al Maghribi · Scent Discovery</p>
        <h2 className="fys-name-headline">What&apos;s your<br /><em>name?</em></h2>
        <p className="fys-name-sub">{question.subtitle}</p>
        <input type="text" value={val} className="fys-name-input"
          onChange={e => setVal(e.target.value)} placeholder={question.placeholder}
          onKeyDown={e => e.key === "Enter" && val.trim() && onSubmit(val.trim())}
          maxLength={32} autoComplete="given-name" autoFocus
        />
        <button className="fys-btn-primary" onClick={() => val.trim() && onSubmit(val.trim())} disabled={!val.trim()}>
          <span>Begin Discovery</span><span className="fys-btn-arrow">→</span>
        </button>
        <p className="fys-name-meta">8 questions · ~3 minutes · Personalised results</p>
      </motion.div>
    </div>
  );
}

/* ─── ICON OPTIONS (with per-question background color) ── */
function IconOpts({ options, selected, onSelect, bgColor }) {
  return (
    <div className="fys-icon-opts fys-split__a" style={{ background: bgColor }}>
      {options.map((opt, i) => (
        <motion.button key={opt.id}
          className={`fys-icon-opt${selected === opt.id ? " fys-icon-opt--sel" : ""}`}
          onClick={() => onSelect(opt.id)}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="fys-icon-opt__wrap">{ICONS[opt.icon || opt.id] || <span style={{fontSize:36}}>◆</span>}</div>
          <span className="fys-icon-opt__label">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── COLOR PANELS (each has own bg) ── */
function ColorOpts({ options, selected, onSelect }) {
  return (
    <div className="fys-color-opts fys-split__a">
      {options.map((opt, i) => (
        <motion.button key={opt.id}
          className={`fys-color-opt${selected === opt.id ? " fys-color-opt--sel" : ""}`}
          style={{ background: opt.bg || (i % 2 === 0 ? "#B8D0D8" : "#E0B8B4") }}
          onClick={() => onSelect(opt.id)}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.07 }}
        >
          <span className="fys-color-opt__label">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── BAR OPTIONS — HORIZONTAL ROW, centered like Maison21G ── */
const BAR_HEIGHTS = [120, 170, 220];
function BarOpts({ options, selected, onSelect, bgColor }) {
  return (
    <div className="fys-bar-opts fys-split__a" style={{ background: bgColor }}>
      {options.map((opt, i) => (
        <motion.button key={opt.id}
          className={`fys-bar-opt${selected === opt.id ? " fys-bar-opt--sel" : ""}`}
          onClick={() => onSelect(opt.id)}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="fys-bar-opt__bar" style={{ height: BAR_HEIGHTS[i] }} />
          <span className="fys-bar-opt__label">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── IMAGE GRID (full-frame: question top-center, grid fills below) ── */
function ImageGrid({ question, selected, onSelect, userName }) {
  const sel = Array.isArray(selected) ? selected : (selected ? [selected] : []);
  const max = question.maxSelect || 2;

  const toggle = (id) => {
    let next;
    if (sel.includes(id)) {
      next = sel.filter(s => s !== id);
    } else if (sel.length < max) {
      next = [...sel, id];
    } else {
      next = [...sel.slice(1), id];
    }
    onSelect(next, false);
  };

  return (
    <div className="fys-imgfull">
      {/* Question header — centered */}
      <motion.div className="fys-imgfull__header"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="fys-imgfull__title">{question.question}</h2>
        <div className="fys-imgfull__meta">
          <span className="fys-btn-select-count">Select up to {max}.</span>
          {question.learnMore && <LearnMore item={question.learnMore} />}
        </div>
        {sel.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button className="fys-btn-primary" onClick={() => onSelect(sel, true)}>
              <span>Next</span><span className="fys-btn-arrow">→</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Full-width image grid */}
      <div className="fys-imgfull__grid">
        {question.options.map((opt, i) => {
          const isSel = sel.includes(opt.id);
          return (
            <motion.button key={opt.id}
              className={`fys-img-card${isSel ? " fys-img-card--sel" : ""}`}
              onClick={() => toggle(opt.id)}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {opt.img && <img src={opt.img} alt={opt.label} className="fys-img-card__photo" />}
              <div className="fys-img-card__body">
                <span className="fys-img-card__label">{opt.label}</span>
                <div className="fys-img-card__circle" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}


/* ─── MAIN ── */
export default function QuestionStep({ question, selectedAnswer, onAnswer, onNameSubmit, userName }) {
  if (question.type === "input") {
    return <NameInput question={question} onSubmit={onNameSubmit} userName={userName} />;
  }

  const layout = question.layout || "icon";
  const bgColor = PANEL_COLORS[question.id] || "#D4C5A9";

  if (layout === "grid-image") {
    return (
      <motion.div style={{ width: "100%", flex: 1, display: "flex" }}
        key={question.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <ImageGrid question={question} selected={selectedAnswer} onSelect={onAnswer} userName={userName} />
      </motion.div>
    );
  }

  return (
    <motion.div className="fys-split"
      key={question.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LeftPanel question={question} userName={userName} />
      {layout === "color" && <ColorOpts options={question.options} selected={selectedAnswer} onSelect={onAnswer} />}
      {layout === "bars"  && <BarOpts  options={question.options} selected={selectedAnswer} onSelect={onAnswer} bgColor={bgColor} />}
      {layout === "icon"  && <IconOpts options={question.options} selected={selectedAnswer} onSelect={onAnswer} bgColor={bgColor} />}
    </motion.div>
  );
}
