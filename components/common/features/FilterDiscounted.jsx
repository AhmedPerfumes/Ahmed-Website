"use client";

import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import Slider from "rc-slider";
import { Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "rc-slider/assets/index.css";
import { useMenu } from "@/context/MenuContext";
import { useShopFilter } from "@/context/ShopFilterContext";

const STOCK_OPTIONS = [
  { label: "All Items", value: "all" },
  { label: "In Stock", value: "in_stock" },
];

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-sm rounded-pill me-2 mb-2 ${
        active ? "btn-primary text-white" : "btn-outline-secondary"
      }`}
      style={{ cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

const sectionVariants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.25 } },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
};

export default function FilterDiscounted({ products = [] }) {
  // 1. Pull categoriesSubCategories from useMenu
  const { currency, categoriesSubCategories } = useMenu();
  const {
    priceRange,
    setPriceRange,
    stockAvailability,
    setStockAvailability,
    selectedLabels,
    setSelectedLabels,
    selectedTags,
    setSelectedTags,
  } = useShopFilter();

  const [availableTags, setAvailableTags] = useState([]);

  // Accordion state - 'promo' removed
  const [openSections, setOpenSections] = useState({
    price: true,
    stock: true,
    categories: true,
    caps: true,
  });

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Fetch Size Tags
  useEffect(() => {
    let cancelled = false;
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getFilters`);
        const json = await res.json();
        if (cancelled) return;

        const tags = Array.isArray(json.tags)
          ? json.tags.filter((t) => typeof t === "string")
          : [];
        setAvailableTags(tags);
      } catch (err) {
        const ts = new Set();
        products.forEach((p) => p?.tags?.forEach?.((t) => ts.add(t)));
        setAvailableTags(Array.from(ts));
      }
    };
    fetchFilters();
    return () => { cancelled = true; };
  }, [products]);

  // Derive price slider bounds
  const [derivedMin, derivedMax] = useMemo(() => {
    if (!products.length) return [0, 700];
    const ps = products.map((p) => Number(p.price)).filter((v) => !isNaN(v));
    if (!ps.length) return [0, 700];
    return [Math.floor(Math.min(...ps)), Math.ceil(Math.max(...ps))];
  }, [products]);

  const initializedRef = useRef(false);
  const prevDerivedRef = useRef([null, null]);

  useEffect(() => {
    if (!initializedRef.current) {
      setPriceRange([derivedMin, derivedMax]);
      initializedRef.current = true;
    } else {
      const [prevMin, prevMax] = prevDerivedRef.current;
      if (
        priceRange[0] === prevMin &&
        priceRange[1] === prevMax &&
        (derivedMin !== prevMin || derivedMax !== prevMax)
      ) {
        setPriceRange([derivedMin, derivedMax]);
      }
    }
    prevDerivedRef.current = [derivedMin, derivedMax];
  }, [derivedMin, derivedMax, priceRange, setPriceRange]);

  const formatPrice = useCallback(
    (val) => (val != null ? `${val}${currency?.symbol || ""}` : ""),
    [currency]
  );

  const toggleCategory = (labelName) =>
    setSelectedLabels((prev) =>
      prev.includes(labelName)
        ? prev.filter((c) => c !== labelName)
        : [...prev, labelName]
    );

  const toggleCap = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((c) => c !== tag) : [...prev, tag]
    );

  const handleReset = () => {
    setPriceRange([derivedMin, derivedMax]);
    setStockAvailability("all");
    setSelectedLabels([]);
    setSelectedTags([]);
  };

  return (
    <div className="filter-all p-2" style={{ maxWidth: 400, fontFamily: "'Lato-Regular', sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
        <h5 className="mb-0 fw-semibold">Refine By</h5>
        <Button variant="link" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* Price */}
      <div className="mb-3 border-bottom pb-2">
        <div className="d-flex justify-content-between align-items-center mb-2" onClick={() => toggleSection("price")} style={{ cursor: "pointer", userSelect: "none" }}>
          <div className="fw-medium">Price</div>
          <motion.div animate={{ rotate: openSections.price ? 0 : 180 }} transition={{ duration: 0.2 }} style={{ fontSize: 18, fontWeight: 700 }}>
            {openSections.price ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.price && (
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" style={{ overflow: "visible", paddingBottom: 8, maxWidth: "95%" }}>
              <div className="px-2 mb-3">
                <Slider
                  range
                  min={derivedMin}
                  max={derivedMax}
                  value={priceRange}
                  onChange={setPriceRange}
                  allowCross={false}
                  trackStyle={[{ height: 8, borderRadius: 4 }]}
                  handleStyle={[
                    { borderWidth: 2, height: 24, width: 24, marginTop: -8, background: "#fff", boxShadow: "0 0 6px rgba(0,0,0,0.15)" },
                    { borderWidth: 2, height: 24, width: 24, marginTop: -8, background: "#fff", boxShadow: "0 0 6px rgba(0,0,0,0.15)" },
                  ]}
                />
              </div>
              <div className="d-flex justify-content-between small text-secondary">
                <div>Min: {formatPrice(priceRange[0])}</div>
                <div>Max: {formatPrice(priceRange[1])}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stock */}
      <div className="mb-3 border-bottom pb-2">
        <div className="d-flex justify-content-between align-items-center mb-2" onClick={() => toggleSection("stock")} style={{ cursor: "pointer", userSelect: "none" }}>
          <div className="fw-medium">Stock Availability</div>
          <motion.div animate={{ rotate: openSections.stock ? 0 : 180 }} transition={{ duration: 0.2 }} style={{ fontSize: 18, fontWeight: 700 }}>
            {openSections.stock ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.stock && (
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" style={{ overflow: "hidden" }}>
              <div className="d-flex flex-wrap gap-1">
                {STOCK_OPTIONS.map(({ label, value }) => (
                  <PillButton key={value} active={stockAvailability === value} onClick={() => setStockAvailability(value)}>
                    {label}
                  </PillButton>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actual Product Categories */}
      <div className="mb-3 border-bottom pb-2">
        <div className="d-flex justify-content-between align-items-center mb-2" onClick={() => toggleSection("categories")} style={{ cursor: "pointer", userSelect: "none" }}>
          <div className="fw-medium">Categories</div>
          <motion.div animate={{ rotate: openSections.categories ? 0 : 180 }} transition={{ duration: 0.2 }} style={{ fontSize: 18, fontWeight: 700 }}>
            {openSections.categories ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.categories && (
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" style={{ overflow: "hidden" }}>
              {categoriesSubCategories?.map((cat) => (
                <div className="form-check mb-2 me-3" key={cat.id}>
                  <input
                    type="checkbox"
                    id={`cat-${cat.id}`}
                    className="form-check-input"
                    checked={selectedLabels.includes(cat.name)}
                    onChange={() => toggleCategory(cat.name)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                    {cat.name}
                  </label>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Size (Tags) */}
      <div className="mb-3 border-bottom pb-2 overflow-scroll" style={{ height: "12rem" }}>
        <div className="d-flex justify-content-between align-items-center mb-2" onClick={() => toggleSection("caps")} style={{ cursor: "pointer", userSelect: "none" }}>
          <div className="fw-medium">Size</div>
          <motion.div animate={{ rotate: openSections.caps ? 0 : 180 }} transition={{ duration: 0.2 }} style={{ fontSize: 18, fontWeight: 700 }}>
            {openSections.caps ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.caps && (
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" style={{ overflow: "hidden" }}>
              {availableTags.map((tag, idx) => (
                <div className="form-check mb-2 me-3" key={`${tag}-${idx}`}>
                  <input
                    type="checkbox"
                    id={`cap-${idx}`}
                    className="form-check-input"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleCap(tag)}
                  />
                  <label className="form-check-label" htmlFor={`cap-${idx}`}>
                    {tag}
                  </label>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear */}
      <div className="d-flex gap-2 mt-2">
        <Button variant="outline-secondary" className="flex-grow-1" onClick={handleReset}>
          Clear
        </Button>
      </div>
    </div>
  );
}