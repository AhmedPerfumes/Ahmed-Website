

"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaLeaf, FaCrown, FaMoon, FaSun, FaWater, FaFire } from "react-icons/fa";

export default function PerfumeQuiz() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [displayedText, setDisplayedText] = useState("");
  const [showPersonality, setShowPersonality] = useState(false);
  const textRef = useRef();

  const questions = [
    {
      key: "feeling",
      question: "How do you want your fragrance to make you feel?",
      options: [
        { label: "Confident & Powerful", icon: <FaFire /> },
        { label: "Elegant & Sophisticated", icon: <FaCrown /> },
        { label: "Mysterious & Alluring", icon: <FaMoon /> },
        { label: "Comforted & Serene", icon: <FaLeaf /> },
      ],
    },
    {
      key: "fragrance_family",
      question: "What type of scent do you prefer?",
      options: [
        { label: "Fresh", icon: <FaWater /> },
        { label: "Woody", icon: <FaLeaf /> },
        { label: "Oriental", icon: <FaCrown /> },
        { label: "Floral", icon: <FaSun /> },
      ],
    },
    {
      key: "intensity",
      question: "Do you prefer light or strong fragrances?",
      options: [
        { label: "Light", icon: <FaSun /> },
        { label: "Strong", icon: <FaFire /> },
      ],
    },
  ];

  const demoPerfumes = [
    {
      id: 1,
      name: "Noor Al Sabah",
      collection: "Prestige Collection",
      price: "$185 USD",
      image_url: "https://images.unsplash.com/photo-1600180758895-7b1a7e2b6a0a?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Khalifa Bloom",
      collection: "Signature Collection",
      price: "$170 USD",
      image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Amber Zest Elixir",
      collection: "Heritage Collection",
      price: "$165 USD",
      image_url: "https://images.unsplash.com/photo-1616628182505-4a1cb43f8e67?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      name: "Sultan's Citrus Aura",
      collection: "Exquisite Blends",
      price: "$175 USD",
      image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const personalityDescriptions = {
    "Confident & Powerful": {
      title: "Modern & Minimalist",
      description: "You have a contemporary and chic aesthetic, appreciating clean lines and understated quality. Your perfect scent is effortlessly cool and sophisticated.",
      notes: "Your ideal fragrances feature notes of: crisp citrus, clean musk, light woods..."
    },
    "Elegant & Sophisticated": {
      title: "Classic & Timeless",
      description: "You appreciate traditional elegance with a modern twist. Your fragrance should be refined and memorable, just like you.",
      notes: "Your ideal fragrances feature notes of: bergamot, jasmine, sandalwood..."
    },
    "Mysterious & Alluring": {
      title: "Dark & Sensual",
      description: "You have an enigmatic presence that draws people in. Your scent should be as intriguing and complex as your personality.",
      notes: "Your ideal fragrances feature notes of: dark vanilla, patchouli, smoky oud..."
    },
    "Comforted & Serene": {
      title: "Warm & Inviting",
      description: "You radiate calm and warmth, making everyone feel at ease. Your fragrance should be comforting yet sophisticated.",
      notes: "Your ideal fragrances feature notes of: amber, cashmeran, soft florals..."
    }
  };

  const handleAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    setStep(step + 1);
  };

  const handleSubmit = () => {
    const shuffled = [...demoPerfumes].sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, 4));
    setShowPersonality(true);

    // Start typewriter effect after a short delay
    setTimeout(() => {
      const personalityKey = answers.feeling || "Confident & Powerful";
      const fullText = personalityDescriptions[personalityKey].description;
      let i = 0;
      const typingEffect = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText(fullText.substring(0, i + 1));
          i++;
          textRef.current.scrollTop = textRef.current.scrollHeight;
        } else {
          clearInterval(typingEffect);
        }
      }, 30);
    }, 500);
  };

  const handleRetake = () => {
    setStep(-1);
    setAnswers({});
    setRecommendations([]);
    setShowPersonality(false);
    setDisplayedText("");
  };

  const progressPercent = step >= 0 ? ((step + 1) / questions.length) * 100 : 0;

  // Get personality info based on answers
  const getPersonalityInfo = () => {
    const personalityKey = answers.feeling || "Confident & Powerful";
    return personalityDescriptions[personalityKey];
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      <div className="p-4 w-100" style={{ maxWidth: "1000px" }}>
        {/* WELCOME SCREEN */}
        {step === -1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="fw-bold mb-3 display-5" style={{ color: '#FFFFF' }}>
              Discover Your Signature Scent
            </h1>
            <p className="text-black mb-4 fs-5">
              Embark on an AI-powered journey to find the Ahmed Al Maghribi
              fragrance that truly represents you.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(0)}
              className="px-5 py-3 rounded-pill text-white border-0 fw-bold"
              style={{
                background: "linear-gradient(90deg, rgb(217, 119, 6), rgb(146, 64, 14))",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              Begin Your Journey
            </motion.button>
          </motion.div>
        )}

        {/* QUIZ QUESTIONS */}
        {step >= 0 && step < questions.length && (
          <>
            <div className="mb-5">
              <div
                className="position-relative"
                style={{
                  height: "6px",
                  borderRadius: "3px",
                  background: "#f1f1f1",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                  className="position-absolute top-0 start-0 h-100"
                  style={{
                    borderRadius: "3px",
                        background: "linear-gradient(90deg, #e8c372, #b8860b)",
                  }}
                ></motion.div>
              </div>
              <p className="text-center mt-2 small text-muted">
                Question {step + 1} of {questions.length}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="mb-4 text-center">{questions[step].question}</h2>
                <div className="row g-3 justify-content-center">
                  {questions[step].options.map((opt) => (
                    <div
                      key={opt.label}
                      className={`col-6 col-md-${questions[step].options.length > 2 ? "3" : "6"}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(questions[step].key, opt.label)}
                        className="border rounded-4 py-4 px-3 h-100 d-flex flex-column align-items-center justify-content-center"
                        style={{
                          cursor: "pointer",
                          borderColor: "#e8c372",
                          transition: "0.3s",
                        }}
                      >
                        <span className="fs-2 mb-2" style={{ color: "#b8860b" }}>
                          {opt.icon}
                        </span>
                        <span className="fw-semibold text-dark text-center">
                          {opt.label}
                        </span>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* SUBMIT SCREEN */}
        {step === questions.length && recommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="mb-4">Ready for your perfect match?</h2>
            <button
              onClick={handleSubmit}
              className="btn px-5 py-3 rounded-pill"
              style={{
                background: "linear-gradient(90deg, rgb(217, 119, 6), rgb(146, 64, 14))",
                color: "white",
                border: "none"
              }}
            >
              Get Recommendations
            </button>
          </motion.div>
        )}

        {/* RESULTS PAGE */}
        {showPersonality && (
          <div className="result-page">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center mb-5"
            >
              <h2 className="fw-bold mb-3" style={{ color: '#b35309', fontSize: '1.2rem', letterSpacing: '2px' }}>
                YOUR FRAGRANCE PERSONALITY IS
              </h2>
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#B8860B' }}>
                 {getPersonalityInfo().title}
              </h1>

              <div className="mx-auto mb-4" style={{ maxWidth: '600px', minHeight: '120px' }}>
                <div
                  ref={textRef}
                  className="fs-5"
                  style={{
                    minHeight: '100px',
                    textAlign: 'center',
                    lineHeight: '1.6'
                  }}
                >
                  {displayedText}
                  <span className="blinking-cursor">|</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="" style={{ fontSize: '1.1rem' }}>
                  {getPersonalityInfo().notes}
                </p>
              </div>
            </motion.div>

            <div className="text-center mb-5">
              <h2 className="fw-bold mb-4" style={{ color: '#333', fontFamily: 'serif' }}>
                Your Curated Selection
              </h2>
            </div>

            <div className="row g-4 mb-5">
  {recommendations.map((perfume) => (
    <div key={perfume.id} className="col-md-3">
      <motion.div
        whileHover={{ y: -12, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #fff 0%, #f9f7f3 100%)",
          borderRadius: "1.5rem",
        }}
      >
        {/* Image Section */}
        <div className="position-relative overflow-hidden">
          <motion.img
            src={perfume.image_url}
            alt={perfume.name}
            className="card-img-top"
            style={{
              height: "260px",
              objectFit: "contain",
              transition: "transform 0.5s ease",
            }}
            whileHover={{ scale: 1.08 }}
          />

          {/* Golden Collection Badge */}
          <div
            className="position-absolute top-0 start-0 px-3 py-1"
            style={{
              background: "linear-gradient(90deg, #d4af37, #b8860b)",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: "600",
              borderBottomRightRadius: "1rem",
              boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
            }}
          >
            {perfume.collection}
          </div>
        </div>

        {/* Body */}
        <div className="card-body text-center pt-4">
          <h5 className="fw-bold mb-2" style={{ fontFamily: "serif" }}>
            {perfume.name}
          </h5>
          <p className="text-muted mb-3" style={{ fontSize: "1rem" }}>
            {perfume.price}
          </p>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0 0 12px rgba(146,64,14,0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="btn rounded-pill px-4 py-2 fw-semibold"
            style={{
              background: "linear-gradient(90deg, rgb(217, 119, 6), rgb(146, 64, 14))",
              color: "white",
              border: "none",
              letterSpacing: "0.5px",
            }}
          >
            View Product
          </motion.button>
        </div>
      </motion.div>
    </div>
  ))}
</div>


            <div className="text-center mt-4">
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Share functionality would go here
                    alert("Share functionality would be implemented here");
                  }}
                  className="btn rounded-pill px-4 py-2 fw-semibold"
                  style={{
                   background: "linear-gradient(90deg, rgb(217, 119, 6), rgb(146, 64, 14))",
                    color: "white",
                    border: "none"
                  }}
                >
                  Share Your Personality
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetake}
                  className="btn rounded-pill px-4 py-2 fw-semibold"
                  style={{
                    background: "white",
                    color: "#B8860B",
                    border: "2px solid #B8860B"
                  }}
                >
                  Retake The Journey
                </motion.button>
              </div>
            </div>
          </div>
        )}


        <style jsx>{`
          .blinking-cursor {
            display: inline-block;
            width: 3px;
            height: 24px;
            background-color: #333;
            animation: blink 1s infinite;
            vertical-align: middle;
            margin-left: 2px;
          }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          .result-page {
            max-width: 1000px;
            margin: 0 auto;
          }
        `}</style>
      </div>
    </div>
  );
}
