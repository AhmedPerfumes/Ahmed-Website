/**
 * FIND YOUR SCENT — Scent Intelligence Engine v4
 *
 * Real-data driven:
 * - Fetches ALL products via api/allProducts (not just best sellers)
 * - Parses actual top_note / heart_note / base_note fields from each product
 * - Oriental category = Arabic/Khaleeji fragrances
 * - Occidental category = French/Western fragrances
 * - Online exclusives (no subcategory) = export products → deprioritised
 */

// ─── QUIZ QUESTIONS (unchanged from v3) ──────────────────────────────────────

export const PART1_QUESTIONS = [
  {
    id: "name", step: 1, part: 1, type: "input", layout: "name",
    question: "What should we call you?",
    subtitle: "We'll personalise every recommendation just for you",
    placeholder: "Your name…",
  },
  {
    id: "for", step: 2, part: 1, type: "choice", layout: "icon",
    question: "Who is this fragrance for?",
    subtitle: "Every portrait starts with the person",
    learnMore: {
      label: "Did you know?",
      text: "Fragrances carry distinct characters, some lean bold and woody, others soft and floral. While scent is deeply personal, knowing who wears it allows our Scent Intelligence to match with far greater precision. Your final result is always uniquely yours."
    },
    options: [
      { id: "self_him", icon: "self_him", label: "HIM", bg: "#BEC8D2", scores: { masculine: 3, woody: 1, oriental: 1 } },
      { id: "self_her", icon: "self_her", label: "HER", bg: "#E4C9C4", scores: { feminine: 3, floral: 2, musk: 1 } },
      { id: "unisex", icon: "fusion", label: "BOTH", bg: "#C8C4B4", scores: { musk: 3, fresh: 2, floral: 2, woody: 1 } },
    ],
  },
  {
    id: "matters", step: 3, part: 1, type: "choice", layout: "icon",
    question: "What calls to you more?",
    subtitle: "Your answer shapes your scent personality",
    options: [
      { id: "safe", icon: "safe", label: "SAFETY & WARMTH", bg: "#D9C9B0", scores: { musk: 3, floral: 2, occasion_daily: 2 } },
      { id: "adventure", icon: "adventure", label: "ADVENTURE & BOLDNESS", bg: "#B8A8B2", scores: { spicy: 3, arabic: 2, sillage_strong: 2 } },
    ],
  },
  {
    id: "feel", step: 4, part: 1, type: "choice", layout: "color",
    question: "How would you like to feel with your perfume?",
    subtitle: "Your mood as a fragrance",
    options: [
      { id: "fresh_elegant", label: "FRESH & ELEGANT", bg: "#C8D8E8", scores: { fresh: 4, occidental: 3, floral: 2 } },
      { id: "seductive_bold", label: "SEDUCTIVE & BOLD", bg: "#EABAB8", scores: { oriental: 4, spicy: 3, arabic: 2, sillage_strong: 2 } },
      { id: "comfortable_warm", label: "COMFORTABLE & WARM", bg: "#D8C9A8", scores: { gourmand: 3, musk: 3, woody: 2, occasion_daily: 2 } },
      { id: "mysterious", label: "MYSTERIOUS & ORIENTAL", bg: "#C4B89A", scores: { arabic: 4, oud: 3, oriental: 3, longevity_long: 2 } },
    ],
  },
];

export const PART2_QUESTIONS = [
  {
    id: "world", step: 5, part: 3, type: "choice", layout: "icon",
    question: "Which fragrance heritage speaks to you?",
    subtitle: "Two great traditions — or a beautiful blend of both",
    learnMore: {
      label: "What's the difference?",
      text: "Oriental fragrances are rich, warm, long-lasting; oud, spices, amber and resins. Occidental fragrances are fresh, elegant, modern - citrus, florals and musk. East meets West is a contemporary blend of both."
    },
    options: [
      { id: "arabic", icon: "safe", label: "ORIENTAL", bg: "#C4A87A", scores: { arabic: 6, oriental: 5, oud: 4, spicy: 2 } },
      { id: "french", icon: "adventure", label: "OCCIDENTAL", bg: "#BCC8D0", scores: { occidental: 6, fresh: 4, floral: 2, musk: 3 } },
      { id: "fusion", icon: "safe", label: "EAST MEETS WEST", bg: "#C0BCB0", scores: { arabic: 3, occidental: 3, floral: 2, oriental: 3, musk: 2 } },
      { id: "explore", icon: "adventure", label: "SURPRISE ME", bg: "#C4B8C8", scores: { musk: 2, fresh: 2, floral: 2 } },
    ],
  },
  {
    id: "notes", step: 6, part: 3, type: "notes", layout: "grid-image",
    multi: true, maxSelect: 2,
    question: "Select your favorite perfume families",
    subtitle: "Share with us your favourite scent families",
    learnMore: {
      label: "Learn More",
      text: "Every perfume has three layers: Top notes hit first (fresh, citrus), Heart notes define the character (florals, spice), and Base notes linger longest (oud, musk, amber, wood)."
    },
    options: [
      { id: "fresh_citrusy", label: "FRESH & CITRUSY", img: "/images/quiz/citrus-fresh.jpg", scores: { fresh: 6, occidental: 4, musk: 2 } },
      { id: "green_aromatic", label: "GREEN & AROMATIC", img: "/images/quiz/green-aromatic.jpg", scores: { fresh: 5, occidental: 3, woody: 2 } },
      { id: "fruity_delicious", label: "FRUITY & DELICIOUS", img: "/images/quiz/fruity-delicious.jpg", scores: { fresh: 4, feminine: 3, gourmand: 3, floral: 2 } },
      { id: "floral_delicate", label: "FLORAL & DELICATE", img: "/images/quiz/floral-delicate.jpg", scores: { floral: 6, feminine: 4, musk: 2, fresh: 1 } },
      { id: "woody_profound", label: "WOODY & PROFOUND", img: "/images/quiz/vanilla-wood.jpg", scores: { woody: 6, gourmand: 3, musk: 2 } },
      { id: "sweet_gourmand", label: "SWEET & GOURMAND", img: "/images/quiz/musk-amber.jpg", scores: { gourmand: 6, musk: 4, oriental: 3 } },
      { id: "spicy_ambery", label: "SPICY & AMBERY", img: "/images/quiz/saffron-spice.jpg", scores: { spicy: 6, arabic: 4, oriental: 4 } },
      { id: "leathery_distinctive", label: "LEATHERY & DISTINCTIVE", img: "/images/quiz/leathery-distinctive.jpg", scores: { woody: 4, arabic: 4, oriental: 3, oud: 3 } },
    ],
  },
  {
    id: "sillage", step: 7, part: 3, type: "choice", layout: "bars",
    question: "How strong do you like your perfume?",
    subtitle: "Sillage — the invisible art of leaving a signature",
    learnMore: {
      label: "Learn More",
      text: "Subtle means only those closest to you will notice. Balanced is confident and present. Strong makes its presence known as soon as you walk in."
    },
    options: [
      { id: "soft", label: "SUBTLE", scores: { sillage_soft: 4, musk: 1, occasion_daily: 1 } },
      { id: "moderate", label: "BALANCED", scores: { sillage_moderate: 4, occasion_daily: 1, occasion_evening: 1 } },
      { id: "strong", label: "STRONG", scores: { sillage_strong: 4, arabic: 2, spicy: 1, longevity_long: 1 } },
    ],
  },
  {
    id: "longevity", step: 8, part: 3, type: "choice", layout: "bars",
    question: "How long should it last?",
    subtitle: "From a light greeting to an everlasting trail",
    options: [
      { id: "light", label: "4-6 HRS", scores: { longevity_light: 4, fresh: 1, occidental: 1 } },
      { id: "moderate", label: "8-12 HRS", scores: { longevity_moderate: 4, musk: 1 } },
      { id: "long", label: "12+ HRS", scores: { longevity_long: 4, arabic: 3, oriental: 2, oud: 2 } },
    ],
  },
];

export const ALL_QUESTIONS = [...PART1_QUESTIONS, ...PART2_QUESTIONS];

// ─── NOTE → DIMENSION MAP ─────────────────────────────────────────────────────
// Maps note text patterns to olfactive dimension scores.
// Applied to top_note, heart_note, base_note fields from the real API.

const NOTE_PATTERNS = [
  // ── FRAGRANCE NOTES ──
  { re: /\boud\b/i, s: { oud: 5, arabic: 4, oriental: 3, longevity_long: 2 } },
  { re: /\brose\b/i, s: { floral: 5, musk: 1, feminine: 2 } },
  { re: /\bsaffron\b/i, s: { spicy: 5, arabic: 4, oriental: 3 } },
  { re: /\bamber\b/i, s: { oriental: 4, musk: 2, gourmand: 2 } },
  { re: /\bvanilla\b/i, s: { gourmand: 4, musk: 2, longevity_moderate: 1 } },
  { re: /\bsandalwood\b/i, s: { woody: 5, musk: 2, longevity_moderate: 2 } },
  { re: /\bcedarwood\b|\bcedar\b/i, s: { woody: 4, masculine: 2 } },
  { re: /\bpatchouli\b/i, s: { woody: 3, oriental: 2, spicy: 1 } },
  { re: /\bvetiver\b/i, s: { woody: 4, masculine: 2, fresh: 1 } },
  { re: /\bbergamot\b/i, s: { fresh: 5, occidental: 3 } },
  { re: /\bcitrus\b|\blemon\b|\borange\b/i, s: { fresh: 4, occidental: 2 } },
  { re: /\bjasmine\b/i, s: { floral: 5, oriental: 2, feminine: 3 } },
  { re: /\bneroli\b/i, s: { fresh: 4, floral: 3, occidental: 2 } },
  { re: /\btuberose\b/i, s: { floral: 5, feminine: 3, oriental: 1 } },
  { re: /\bpeony\b|\bpeony\b/i, s: { floral: 4, feminine: 3 } },
  { re: /\borganic rose\b|\bdamask\b|\btaif\b/i, s: { floral: 5, arabic: 3, feminine: 2 } },
  { re: /\bpepper\b|\bcardamom\b|\bcinnamon\b/i, s: { spicy: 5, oriental: 3, arabic: 2 } },
  { re: /\blavender\b/i, s: { fresh: 3, masculine: 2, occidental: 2 } },
  { re: /\bmusk\b/i, s: { musk: 5, sillage_soft: 1 } },
  { re: /\bwhite musk\b|\bclean musk\b/i, s: { musk: 5, fresh: 2, occidental: 2 } },
  { re: /\bout rose\b|\boud rose\b/i, s: { arabic: 6, oud: 5, floral: 4, oriental: 4 } },
  { re: /\bincense\b|\bfrankincense\b|\bbakhoor\b/i, s: { arabic: 5, oriental: 4, sillage_strong: 2 } },
  { re: /\bagarwood\b/i, s: { oud: 4, arabic: 4, oriental: 3, longevity_long: 2 } },
  { re: /\btonka\b|\bcoumarin\b/i, s: { gourmand: 4, musk: 2 } },
  { re: /\bfresh\b|\baquat/i, s: { fresh: 4, occidental: 2 } },
  { re: /\bwood\b|\bwoody\b|\bguaiac\b/i, s: { woody: 4, oriental: 1 } },
  { re: /\bgrapefruit\b/i, s: { fresh: 5, occidental: 3 } },
  { re: /\biris\b|\bviolet\b/i, s: { floral: 4, occidental: 2, musk: 1 } },
  { re: /\bpeach\b|\bfig\b|\bapple\b|\bpear\b/i, s: { gourmand: 3, fresh: 2 } },
  { re: /\bcaramel\b|\bhoney\b/i, s: { gourmand: 5, oriental: 2 } },
  { re: /\bresin\b|\bmyrrh\b|\bbenzoin\b/i, s: { oriental: 4, arabic: 3, longevity_long: 2 } },
  { re: /\bambroxan\b|\bambergris\b/i, s: { musk: 3, occidental: 2, longevity_long: 2 } },
  { re: /\boakmoss\b|\bmoss\b/i, s: { woody: 3, masculine: 2 } },
  { re: /\bleather\b/i, s: { masculine: 4, woody: 2, oriental: 1 } },

  // ── SILLAGE INFERENCE (from description text) ──
  { re: /\bstrong\b|\bpowerful\b|\bintense\b|\bbold presence\b|\bheavy\b/i, s: { sillage_strong: 2 } },
  { re: /\bwearable\b|\brefined\b|\bbalanced\b|\bmoderate presence\b/i, s: { sillage_moderate: 2 } },
  { re: /\bdelicate\b|\bwhisper\b|\bsubtle\b|\bintimate\b|\bairy\b/i, s: { sillage_soft: 2 } },

  // ── LONGEVITY INFERENCE (from description text) ──
  { re: /\b12[+\s]*h|all[- ]?day|enduring|long[- ]last|lasting warmth/i, s: { longevity_long: 2 } },
  { re: /\b8[- ](?:to|–|-)?\s*1[02]\s*h|full day|dependable/i, s: { longevity_moderate: 2 } },
  { re: /\b4[- ](?:to|–|-)?\s*6\s*h|light.*finish|breezy\b/i, s: { longevity_light: 2 } },

  // ── GENDER / OCCASION SIGNALS ──
  { re: /\bmasculine\b|\bvirile\b|\bfor him\b|\bmen\'s\b/i, s: { masculine: 3 } },
  { re: /\bfeminine\b|\bwomanly\b|\bfor her\b|\bwomen\'s\b/i, s: { feminine: 3 } },
  { re: /\beveryday\b|\bdaily\b|\boffice\b|\bwork\b/i, s: { occasion_daily: 2 } },
  { re: /\bevening\b|\bnight\b|\bdate\b|\bdinne?r\b|\bromantic\b/i, s: { occasion_evening: 2 } },
  { re: /\bwedding\b|\bcelebration\b|\beid\b|\bspecial occasion\b/i, s: { occasion_special: 2 } },
];

// ─── CATEGORY → DIMENSION MAP ─────────────────────────────────────────────────
// category_name = "Perfumes" (generic)
// subcategory.subcategory_name = "Oriental Fragrance" / "Occidental Fragrance" (the real classifier)

function getCategoryBonus(product) {
  const sub = (product.subcategory?.subcategory_name || "").toLowerCase();
  if (sub.includes("oriental")) return { arabic: 5, oud: 3, oriental: 4, spicy: 2, longevity_long: 2, sillage_strong: 1 };
  if (sub.includes("occidental")) return { occidental: 5, fresh: 3, floral: 2, musk: 3, longevity_moderate: 2 };
  if (sub.includes("concentrated") || sub.includes("extrait")) return { arabic: 3, oriental: 3, longevity_long: 4, sillage_strong: 2 };
  if (sub.includes("hair")) return { fresh: 3, musk: 3, sillage_soft: 2 };
  return {};
}

// ─── REAL NOTE PARSER ─────────────────────────────────────────────────────────
// Strips HTML from description field and scores it against NOTE_PATTERNS.
// This is the primary source of olfactive data since the API has no
// separate top_note/heart_note/base_note fields.

function parseNoteDimensions(product) {
  // Prefer structured note fields (from api/products enrichment) over description parsing
  const structured = [
    product.top_note || "",
    product.heart_note || "",
    product.base_note || "",
    product.olfactory_family || "",
  ].join(", ");

  // Also parse description HTML (rich narrative text has note keywords too)
  const descText = (product.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Combine: structured notes first for precision, description for depth
  const combined = `${structured} ${descText}`.trim();
  if (!combined) return {};

  const dims = {};
  NOTE_PATTERNS.forEach(({ re, s }) => {
    if (re.test(combined)) {
      Object.entries(s).forEach(([k, v]) => {
        dims[k] = Math.max(dims[k] || 0, v);
      });
    }
  });
  return dims;
}

// Bonus from the sillage field (e.g. "Strong", "Moderate", "Soft")
function getSillageBonus(product) {
  const s = (product.sillage || "").toLowerCase();
  if (s.includes("strong") || s.includes("bold") || s.includes("heavy")) return { sillage_strong: 3 };
  if (s.includes("moderate") || s.includes("medium")) return { sillage_moderate: 3 };
  if (s.includes("soft") || s.includes("light") || s.includes("subtle")) return { sillage_soft: 3 };
  return {};
}

// Bonus from the longevity field (e.g. "12+ hrs", "8-10 hrs", "4-6 hrs")
function getLongevityBonus(product) {
  const l = (product.longevity || "").toLowerCase();
  if (l.includes("12") || l.startsWith("long")) return { longevity_long: 3 };
  if (l.includes("8") || l.includes("10") || l.includes("day")) return { longevity_moderate: 3 };
  if (l.includes("4") || l.includes("5") || l.includes("6")) return { longevity_light: 3 };
  return {};
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const cleanStr = (s = "") =>
  s.replace(/&amp;/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, " ")
    .trim().split(" ").join("-").toLowerCase();

// A product is online-exclusive if it has no subcategory at all
function isOnlineExclusive(product) {
  return !product.subcategory;
}

function isRecommendable(product) {
  if (Number(product.product_qty || 0) <= 0) return false;
  // Only show PERFUMES category (covers Oriental, Occidental, and Online Exclusive sub-products)
  const cat = (product.category_name || "").toLowerCase().trim();
  if (cat !== "perfumes") return false;
  return true;
}

// ─── SCORING ENGINE ───────────────────────────────────────────────────────────

export function buildUserDimensions(answers) {
  const dims = {};
  ALL_QUESTIONS.forEach((q) => {
    const ans = answers[q.id];
    if (!ans || q.type === "input") return;

    // Support multi-select (array) or single string
    const ids = Array.isArray(ans) ? ans : [ans];
    ids.forEach((id) => {
      const opt = q.options?.find((o) => o.id === id);
      if (!opt) return;
      Object.entries(opt.scores || {}).forEach(([k, v]) => {
        dims[k] = (dims[k] || 0) + v;
      });
    });
  });
  return dims;
}

export function computeRecommendations(answers, liveProducts = []) {
  const dims = buildUserDimensions(answers);

  const scored = liveProducts
    .filter(isRecommendable)
    .map((product) => {
      // Layer 1: category bonus (subcategory.subcategory_name)
      const catBonus = getCategoryBonus(product);
      // Layer 2: sillage + longevity from API fields
      const silBonus = getSillageBonus(product);
      const lonBonus = getLongevityBonus(product);
      // Layer 3: note scoring from top_note/heart_note/base_note + description
      const noteDims = parseNoteDimensions(product);

      // Merge all layers: structured fields override category defaults
      const dna = { ...catBonus, ...silBonus, ...lonBonus };
      Object.entries(noteDims).forEach(([k, v]) => {
        dna[k] = Math.max(dna[k] || 0, v);
      });

      // Dot-product score against user dimensions
      let score = 0;
      Object.entries(dims).forEach(([k, userVal]) => {
        score += userVal * (dna[k] || 0);
      });

      // Deprioritise online-exclusive / export products
      if (isOnlineExclusive(product)) score *= 0.55;

      return { product, score, dna };
    })
    .sort((a, b) => b.score - a.score);

  // Deduplicate by product_id, return top 3
  const seen = new Set();
  const topN = [];
  for (const item of scored) {
    if (!seen.has(item.product.product_id) && topN.length < 3) {
      seen.add(item.product.product_id);
      topN.push(item);
    }
  }

  return { recommendations: topN, userDimensions: dims, profile: buildScentProfile(dims, answers) };
}

// ─── SCENT PROFILE (gender-aware) ────────────────────────────────────────────
// answers.for: "self_him" | "gift_him" | "self_her" | "gift_her" | undefined

export function buildScentProfile(dims, answers = {}) {
  const isFem = ["self_her", "gift_her"].includes(answers.for);
  const isMasc = ["self_him", "gift_him"].includes(answers.for);
  const v = isFem ? "fem" : isMasc ? "masc" : "neutral";

  const ORDER = ["arabic", "oud", "oriental", "occidental", "fresh", "floral", "spicy", "musk", "woody", "gourmand"];
  const top = ORDER
    .filter((k) => dims[k] > 0)
    .sort((a, b) => (dims[b] || 0) - (dims[a] || 0))
    .slice(0, 2);

  // Each key → { fem, masc, neutral } — title/desc chosen by gender selection
  const PROFILES = {
    "arabic-oud": {
      fem: { title: "The Arabian Queen", desc: "Your aura commands presence — you wear oud like a crown, radiant and utterly unforgettable." },
      masc: { title: "The Arabian Connoisseur", desc: "Your soul resonates with the ancient art of Arabian perfumery — deep, opulent, unforgettable." },
      neutral: { title: "The Arabian Devotee", desc: "You speak the ancient language of oud — rich, opulent, and eternally captivating." },
    },
    "arabic-oriental": {
      fem: { title: "The Heritage Goddess", desc: "Rooted in tradition, you carry the warmth of the Orient with grace and timeless elegance." },
      masc: { title: "The Heritage Keeper", desc: "Rooted in tradition, you carry the warmth of the Orient wherever you go." },
      neutral: { title: "The Heritage Soul", desc: "Deeply connected to the warmth and richness of Eastern heritage." },
    },
    "arabic-spicy": {
      fem: { title: "The Fierce Alchemist", desc: "Spice and fire — you leave every room charged with an energy that is impossible to ignore." },
      masc: { title: "The Bold Alchemist", desc: "Complex, commanding, impossible to ignore — you wear your confidence as your most powerful scent." },
      neutral: { title: "The Daring Alchemist", desc: "Complex and commanding — your scent is as bold and uncompromising as your spirit." },
    },
    "oriental-spicy": {
      fem: { title: "The Dark Goddess", desc: "Layered with mystery and heat — your scent is a story only the brave dare to lean in for." },
      masc: { title: "The Dark Romantic", desc: "Layered with mystery and warmth, your scent tells stories that words cannot." },
      neutral: { title: "The Dark Romantic", desc: "Layered with mystery and warmth, your scent tells stories that words cannot." },
    },
    "occidental-fresh": {
      fem: { title: "The Modern Muse", desc: "Clean, luminous, effortlessly chic — you embody the spirit of contemporary feminine elegance." },
      masc: { title: "The Modern Minimalist", desc: "Clean, effortless, universally admired — your fragrance is a breath of fresh air." },
      neutral: { title: "The Modern Soul", desc: "Clean, effortless, universally admired — your fragrance is a breath of confident fresh air." },
    },
    "fresh-musk": {
      fem: { title: "The Free Spirit", desc: "Light yet captivating, you leave a trail of effortless allure wherever you wander." },
      masc: { title: "The Urban Explorer", desc: "Fresh and open — your scent is as free and confident as your outlook on the world." },
      neutral: { title: "The Free Spirit", desc: "Light yet captivating, you leave a trail of effortless allure wherever you wander." },
    },
    "floral-musk": {
      fem: { title: "The Romantic", desc: "Tender and warm, your fragrance blooms like a garden at golden hour." },
      masc: { title: "The Gentleman Romantic", desc: "Warm and approachable — your floral heart speaks of quiet confidence and depth." },
      neutral: { title: "The Romantic", desc: "Tender and warm, your fragrance blooms like a garden at golden hour." },
    },
    "floral-oriental": {
      fem: { title: "The Sensual Dreamer", desc: "You live where elegance meets warmth — floral petals kissed by Oriental amber." },
      masc: { title: "The Eastern Explorer", desc: "You live where two worlds collide — florals deepened by the mystery of the East." },
      neutral: { title: "The Sensual Dreamer", desc: "You live where elegance meets warmth — floral petals kissed by Oriental amber." },
    },
    "musk-woody": {
      fem: { title: "The Elegant Soul", desc: "Grounded and refined — your scent is a masterclass in understated feminine luxury." },
      masc: { title: "The Sophisticated Soul", desc: "Grounded and refined — your scent is a masterclass in understated masculine luxury." },
      neutral: { title: "The Sophisticated Soul", desc: "Grounded and refined — your scent is a masterclass in understated luxury." },
    },
    "woody-oriental": {
      fem: { title: "The Wanderer", desc: "Deep roots, curious heart — you seek the extraordinary and leave an unforgettable trail." },
      masc: { title: "The Explorer", desc: "Deep roots, curious spirit — you seek the extraordinary in every experience." },
      neutral: { title: "The Explorer", desc: "Deep roots, curious spirit — you seek the extraordinary in every experience." },
    },
    "gourmand-woody": {
      fem: { title: "The Warm Presence", desc: "Comforting and captivating — people feel drawn to you the moment you enter the room." },
      masc: { title: "The Warm Presence", desc: "Comforting, irresistible — people feel instantly at ease the moment you arrive." },
      neutral: { title: "The Warm Presence", desc: "Comforting, irresistible — people feel at ease the moment you enter the room." },
    },
  };

  const FALLBACK = {
    fem: { title: "The Unique Individual", desc: "Your fragrance profile is beautifully complex and entirely your own — feminine, free, unclassifiable." },
    masc: { title: "The Unique Individual", desc: "Your fragrance profile is boldly complex and entirely your own — strong, original, unclassifiable." },
    neutral: { title: "The Unique Individual", desc: "Your fragrance profile defies categories — beautifully complex and entirely your own." },
  };

  const key = top.join("-");
  const bucket = PROFILES[key] || PROFILES[`${top[1]}-${top[0]}`] || FALLBACK;
  const chosen = bucket[v] || bucket.neutral;

  return { ...chosen, notes: top.map((t) => t.charAt(0).toUpperCase() + t.slice(1)) };
}
