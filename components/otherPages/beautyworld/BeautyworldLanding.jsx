"use client";

import "./beautyworld.scss";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Calendar helper ──────────────────────────────────────────────────────────
function buildICSLink() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "SUMMARY:Beautyworld Dubai 2026 – Ahmed Al Maghribi Perfumes",
    "DTSTART:20261006T090000Z",
    "DTEND:20261008T180000Z",
    "LOCATION:Dubai World Trade Centre, Dubai, UAE",
    "DESCRIPTION:Visit Ahmed Al Maghribi Perfumes at Beautyworld Dubai 2026.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}

// ── Timeline data ────────────────────────────────────────────────────────────
const JOURNEY_FALLBACK = "/assets/images/beautyworld-journey-hero.jpg";

const timelineYears = [
  {
    year: "2022",
    label: "First Presence",
    desc: "Ahmed Al Maghribi makes its debut at Beautyworld Middle East, introducing the brand on the global fragrance stage.",
    image: "/assets/images/beautyworld-2022-stand.jpg",
  },
  {
    year: "2023",
    label: "Growing Reach",
    desc: "Expanded collection showcased with key trade partnerships established across the GCC and beyond.",
    image: "/assets/images/beautyworld-2023-stand.jpg",
  },
  {
    year: "2024",
    label: "New Creations",
    desc: "Launch of exclusive Arabian and niche fragrance lines, drawing international wholesale and retail interest.",
    image: "/assets/images/beautyworld-2024-stand.jpg",
  },
  {
    year: "2025",
    label: "Global Expansion",
    desc: "A record year — new markets entered, distribution channels widened, presence across multiple continents.",
    image: "/assets/images/beautyworld-2025-stand.jpg",
  },
  {
    year: "2026",
    label: "A New Chapter",
    desc: "Beautyworld Dubai 2026 marks the unveiling of our boldest fragrance creation yet. Be part of the moment.",
    active: true,
    image: "/assets/images/beautyworld-2026-stand.jpg",
  },
];

// ── Form options ─────────────────────────────────────────────────────────────
const businessTypes  = ["Distributor", "Importer", "Wholesaler", "Retailer", "E-commerce", "Travel Retail", "Other"];
const categories     = ["Finished Fragrances", "Arabian Fragrances", "Oud", "Niche Fragrances", "Premium Fragrances"];
const preferredDates = ["6 October 2026", "7 October 2026", "8 October 2026"];
const preferredTimes = ["09:00 – 11:00", "11:00 – 13:00", "13:00 – 15:00", "15:00 – 17:00"];

// ─────────────────────────────────────────────────────────────────────────────
export default function BeautyworldLanding() {
  const [activeYear, setActiveYear] = useState("2026");
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [formStep,   setFormStep]   = useState(1);   // 1 = Contact Details, 2 = Business + Message
  const [form, setForm] = useState({
    fullName: "", company: "", jobTitle: "", country: "",
    email: "", mobile: "",
    businessType: "", category: "",
    message: "",
  });

  const heroRef    = useRef(null);
  const revealRef  = useRef(null);
  const journeyRef = useRef(null);
  const meetingRef = useRef(null);
  const videoRef   = useRef(null);

  // Fade-in animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("bw-visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".bw-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Mobile video: play when visible, pause when scrolled away (saves bandwidth)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 }
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  }

  function scrollTo(ref) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── Timeline progress width ──────────────────────────────────────────────
  const activeIdx   = timelineYears.findIndex((y) => y.year === activeYear);
  const progressPct = (activeIdx / (timelineYears.length - 1)) * 100;
  const activeData  = timelineYears[activeIdx] || timelineYears[0];

  return (
    <div className="bw-page">

      {/* ════════════════════════════════════════
          01 · HERO
      ════════════════════════════════════════ */}
      <section className="bw-hero" ref={heroRef}>
        <div className="bw-hero__bg">

          {/* Desktop: static image */}
          <Image
            src="/assets/images/beautyworld-hero.jpg"
            alt="Beautyworld Dubai 2026 – Ahmed Al Maghribi Perfumes"
            fill
            priority
            className="bw-hero__img bw-hero__img--desktop"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />

          {/* Mobile: video plays only when visible */}
          <video
            ref={videoRef}
            className="bw-hero__video bw-hero__video--mobile"
            src="/assets/videos/beautyworld-hero.mp4"
            muted
            loop
            playsInline
            aria-hidden="true"
          />

          <div className="bw-hero__overlay" />
        </div>

        <div className="bw-hero__content">
          {/* <p className="bw-eyebrow bw-animate">Ahmed Al Maghribi Perfumes</p> */}
          <h1 className="bw-hero__brand bw-animate">
            BEAUTYWORLD<br />DUBAI 2026
          </h1>
          <p className="bw-hero__meta bw-animate">6–8 Oct 26 · DWTC</p>
          <p className="bw-hero__copy bw-animate">
            Discover new creations, exclusive launches, and meet our team in Dubai.
          </p>

          <div className="bw-hero__actions bw-animate">
            <button
              className="bw-btn bw-btn--primary"
              onClick={() => scrollTo(meetingRef)}
              id="hero-book-meeting-btn"
            >
              Book a Meeting
            </button>
            <a
              className="bw-btn bw-btn--ghost"
              href={buildICSLink()}
              download="beautyworld-dubai-2026.ics"
              id="hero-add-to-calendar-btn"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Add to Calendar
            </a>
          </div>
        </div>

        <div className="bw-hero__scroll" onClick={() => scrollTo(revealRef)} role="button" aria-label="Scroll to next section">
          <span />
        </div>
      </section>

      {/* ════════════════════════════════════════
          02 · THE REVEAL
      ════════════════════════════════════════ */}
      <section className="bw-reveal" ref={revealRef} id="the-reveal">

        {/* Mobile-only: full-bleed artwork image */}
        <div className="bw-reveal__mobile-image">
          <Image
            src="/assets/images/beautyworld-reveal-mobile.png"
            alt="A New Chapter in Fragrance – Ahmed Al Maghribi at Beautyworld Dubai 2026"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
          <div className="bw-reveal__mobile-cta">
            <button
              className="bw-btn bw-btn--outline"
              onClick={() => scrollTo(meetingRef)}
              id="reveal-mobile-experience-btn"
            >
              Experience the Reveal
            </button>
          </div>
        </div>

        {/* Desktop: bg image + text overlay */}
        <div className="bw-reveal__image-wrap bw-reveal__desktop-only">
          <Image
            src="/assets/images/beautyworld-reveal.jpg"
            alt="A new fragrance creation — coming soon"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
          <div className="bw-reveal__veil" />
        </div>

        <div className="bw-reveal__content bw-reveal__desktop-only">
          <div className="bw-container">
            <p className="bw-eyebrow bw-animate">02 · The Reveal</p>
            <h2 className="bw-section-title bw-animate">A New Chapter<br />in Fragrance</h2>
            <p className="bw-reveal__copy bw-animate">
              Beautyworld Dubai 2026 will mark the unveiling of a major new perfume creation,<br className="d-none d-lg-block" />
              joined by a curated selection of new releases.
            </p>
            <p className="bw-reveal__tease bw-animate">
              Until then, the reveal remains under wraps.
            </p>
            <button
              className="bw-btn bw-btn--outline bw-animate"
              onClick={() => scrollTo(meetingRef)}
              id="reveal-experience-btn"
            >
              Experience the Reveal at the Show
            </button>
          </div>

          <div className="bw-reveal__curtain" aria-hidden="true">
            <div className="bw-reveal__curtain-left" />
            <div className="bw-reveal__curtain-right" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          03 · OUR BEAUTYWORLD JOURNEY
      ════════════════════════════════════════ */}
      <section className="bw-journey" ref={journeyRef} id="our-journey">

        {/* Full-bleed image stack */}
        {timelineYears.map((item) => (
          <div
            key={item.year}
            className={"bw-journey__img-slot" + (activeYear === item.year ? " is-active" : "")}
          >
            <Image
              src={item.image || JOURNEY_FALLBACK}
              alt={item.year + " - " + item.label + " · Ahmed Al Maghribi at Beautyworld"}
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        ))}

        {/* Gradient scrim */}
        <div className="bw-journey__scrim" aria-hidden="true" />

        {/* Content overlay anchored to bottom */}
        <div className="bw-journey__content">
          <span className="bw-journey__gold-line" aria-hidden="true" />

          <div className="bw-journey__text-wrap">
            {timelineYears.map((item) => (
              <div
                key={item.year}
                className={"bw-journey__text-panel" + (activeYear === item.year ? " is-active" : "")}
              >
                <h2 className="bw-journey__label">{item.label}</h2>
                <p  className="bw-journey__desc">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bw-timeline">
            <div className="bw-timeline__track">
              {timelineYears.map((item) => (
                <button
                  key={item.year}
                  className={"bw-timeline__node" + (activeYear === item.year ? " is-active" : "") + (item.active ? " is-current" : "")}
                  onClick={() => setActiveYear(item.year)}
                  id={"timeline-" + item.year + "-btn"}
                >
                  <span className="bw-timeline__dot" />
                  <span className="bw-timeline__year">{item.year}</span>
                </button>
              ))}
              <div
                className="bw-timeline__progress"
                style={{ width: progressPct + "%" }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          04 · BOOK A MEETING
      ════════════════════════════════════════ */}
      <section className="bw-meeting" ref={meetingRef} id="book-a-meeting">
        <div className="bw-container">

          {submitted ? (
            /* ── Full-section thank you ── */
            <div className="bw-meeting__thankyou bw-animate" id="meeting-success-message">
              <div className="bw-meeting__thankyou-icon">
                <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <p className="bw-eyebrow">Confirmed</p>
              <h2 className="bw-section-title">Thank You.</h2>
              <p className="bw-meeting__copy">
                Your meeting request has been received.<br />
                Our team will be in touch shortly to confirm the details.
              </p>
            </div>
          ) : (
            /* ── Normal: header + form ── */
            <>
              <div className="bw-meeting__header">
                <p className="bw-eyebrow bw-animate">Book a Meeting</p>
                <h2 className="bw-section-title bw-animate">Meet Us in Dubai</h2>
                <p className="bw-meeting__copy bw-animate">
                  Connect with our team during Beautyworld Dubai 2026 to explore distribution, wholesale,<br className="d-none d-lg-block" />
                  retail and international fragrance opportunities.<br /><br />
                  Share your details and our team will arrange a suitable meeting during the exhibition.
                </p>
              </div>
            <form className="bw-form bw-animate" onSubmit={handleSubmit} id="beautyworld-meeting-form" noValidate>

              {/* ── Step indicator ── */}
              <div className="bw-form__steps">
                <button
                  type="button"
                  className={"bw-form__step" + (formStep === 1 ? " is-active" : " is-done")}
                  onClick={() => setFormStep(1)}
                  aria-current={formStep === 1 ? "step" : undefined}
                >
                  <span className="bw-form__step-num">1</span>
                  <span className="bw-form__step-label">Contact Details</span>
                </button>
                <span className="bw-form__step-rule" />
                <button
                  type="button"
                  className={"bw-form__step" + (formStep === 2 ? " is-active" : "")}
                  onClick={() => formStep > 1 && setFormStep(2)}
                  aria-current={formStep === 2 ? "step" : undefined}
                >
                  <span className="bw-form__step-num">2</span>
                  <span className="bw-form__step-label">Business &amp; Message</span>
                </button>
              </div>

              {/* ════ STEP 1 — Contact Details ════ */}
              {formStep === 1 && (
                <div className="bw-form__panel">
                  <div className="bw-form__grid bw-form__grid--2">
                    <div className="bw-form__field">
                      <label htmlFor="bw-fullName">Full Name <span aria-hidden="true">*</span></label>
                      <input id="bw-fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} placeholder="Your full name" required />
                    </div>
                    <div className="bw-form__field">
                      <label htmlFor="bw-company">Company <span aria-hidden="true">*</span></label>
                      <input id="bw-company" name="company" type="text" value={form.company} onChange={handleChange} placeholder="Company name" required />
                    </div>
                    <div className="bw-form__field">
                      <label htmlFor="bw-jobTitle">Job Title</label>
                      <input id="bw-jobTitle" name="jobTitle" type="text" value={form.jobTitle} onChange={handleChange} placeholder="Your role" />
                    </div>
                    <div className="bw-form__field">
                      <label htmlFor="bw-country">Country <span aria-hidden="true">*</span></label>
                      <input id="bw-country" name="country" type="text" value={form.country} onChange={handleChange} placeholder="Country of operation" required />
                    </div>
                    <div className="bw-form__field">
                      <label htmlFor="bw-email">Email <span aria-hidden="true">*</span></label>
                      <input id="bw-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="business@email.com" required />
                    </div>
                    <div className="bw-form__field">
                      <label htmlFor="bw-mobile">Mobile / WhatsApp <span aria-hidden="true">*</span></label>
                      <input id="bw-mobile" name="mobile" type="tel" value={form.mobile} onChange={handleChange} placeholder="+971 xx xxx xxxx" required />
                    </div>
                  </div>

                  <div className="bw-form__actions">
                    <button
                      type="button"
                      className="bw-btn bw-btn--primary"
                      id="form-step1-next-btn"
                      onClick={() => {
                        if (!form.fullName || !form.company || !form.email || !form.mobile || !form.country) return;
                        setFormStep(2);
                      }}
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* ════ STEP 2 — Business & Message ════ */}
              {formStep === 2 && (
                <div className="bw-form__panel">
                  <div className="bw-form__grid bw-form__grid--2">
                    <div className="bw-form__field">
                      <label htmlFor="bw-businessType">Business Type <span aria-hidden="true">*</span></label>
                      <select id="bw-businessType" name="businessType" value={form.businessType} onChange={handleChange} required>
                        <option value="">Select type</option>
                        {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="bw-form__field">
                      <label htmlFor="bw-category">Category of Interest <span aria-hidden="true">*</span></label>
                      <select id="bw-category" name="category" value={form.category} onChange={handleChange} required>
                        <option value="">Select category</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bw-form__field bw-form__field--full">
                    <label htmlFor="bw-message">Message</label>
                    <textarea id="bw-message" name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Share anything you'd like our team to know before the meeting…" />
                  </div>

                  <div className="bw-form__actions bw-form__actions--spread">
                    <button type="button" className="bw-btn bw-btn--ghost" id="form-step2-back-btn" onClick={() => setFormStep(1)}>
                      &larr; Back
                    </button>
                    <button
                      className={"bw-btn bw-btn--primary bw-btn--submit" + (loading ? " is-loading" : "")}
                      type="submit"
                      id="meeting-submit-btn"
                      disabled={loading}
                    >
                      {loading ? <span className="bw-spinner" aria-hidden="true" /> : "Request a Meeting"}
                    </button>
                  </div>
                </div>
              )}

            </form>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
