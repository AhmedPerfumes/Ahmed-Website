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

export default function FilterAll({ products = [] }) {
  const { currency } = useMenu();
  const {
    priceRange,
    setPriceRange,
    stockAvailability,
    setStockAvailability,
    promotionalOnly,
    setPromotionalOnly,

    // context selections for the new filters
    selectedLabels,
    setSelectedLabels,
    selectedTags,
    setSelectedTags,
  } = useShopFilter();

  // fetched filter options to render
  const [availableLabels, setAvailableLabels] = useState([]); // [{label_name, label_color}]
  const [availableTags, setAvailableTags] = useState([]);     // ["75ML", ...]

  // accordion state
  const [openSections, setOpenSections] = useState({
    price: true,
    stock: true,
    categories: true,
    caps: true,
    promo: true,
  });
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // fetch Labels (categories) & Tags (sizes)
  useEffect(() => {
    let cancelled = false;
    const fetchFilters = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/getFilters`
        );
        const json = await res.json();
        if (cancelled) return;

        const labels = Array.isArray(json.labels)
          ? json.labels
              .filter((l) => l && typeof l === "object" && l.label_name)
              .map((l) => ({
                label_name: l.label_name,
                label_color: l.label_color,
              }))
          : [];

        const tags = Array.isArray(json.tags)
          ? json.tags.filter((t) => typeof t === "string")
          : [];

        setAvailableLabels(labels);
        setAvailableTags(tags);
      } catch (err) {
        // fallback: derive from products if API fails
        const lm = new Map();
        products.forEach((p) =>
          p?.labels?.forEach?.((l) => {
            if (l?.label_name) lm.set(l.label_name, l.label_color || "");
          })
        );
        const lbls = Array.from(lm, ([label_name, label_color]) => ({
          label_name,
          label_color,
        }));

        const ts = new Set();
        products.forEach((p) => p?.tags?.forEach?.((t) => ts.add(t)));

        setAvailableLabels(lbls);
        setAvailableTags(Array.from(ts));
        // console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
    return () => {
      cancelled = true;
    };
  }, [products]);

  // derive price slider bounds
  const [derivedMin, derivedMax] = useMemo(() => {
    if (!products.length) return [0, 700];
    const ps = products.map((p) => Number(p.price)).filter((v) => !isNaN(v));
    if (!ps.length) return [0, 700];
    return [Math.floor(Math.min(...ps)), Math.ceil(Math.max(...ps))];
  }, [products]);

  // sync initial priceRange
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

  // toggles for labels/tags (write to context)
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
    setPromotionalOnly(false);
    setSelectedLabels([]);
    setSelectedTags([]);
  };

  return (
    <div
      className="filter-all p-2"
      style={{
        maxWidth: 400,
        fontFamily: "'Lato-Regular', sans-serif"
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
        <h5 className="mb-0 fw-semibold">Refine By</h5>
        <Button variant="link" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* Price */}
      <div className="mb-3 border-bottom pb-2">
        <div
          className="d-flex justify-content-between align-items-center mb-2"
          onClick={() => toggleSection("price")}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div className="fw-medium">Price</div>
          <motion.div
            animate={{ rotate: openSections.price ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 18, fontWeight: 700 }}
          >
            {openSections.price ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.price && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ overflow: "visible", paddingBottom: 8, maxWidth: "95%" }}
            >
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
                    {
                      borderWidth: 2,
                      height: 24,
                      width: 24,
                      marginTop: -8,
                      background: "#fff",
                      boxShadow: "0 0 6px rgba(0,0,0,0.15)",
                    },
                    {
                      borderWidth: 2,
                      height: 24,
                      width: 24,
                      marginTop: -8,
                      background: "#fff",
                      boxShadow: "0 0 6px rgba(0,0,0,0.15)",
                    },
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
        <div
          className="d-flex justify-content-between align-items-center mb-2"
          onClick={() => toggleSection("stock")}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div className="fw-medium">Stock Availability</div>
          <motion.div
            animate={{ rotate: openSections.stock ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 18, fontWeight: 700 }}
          >
            {openSections.stock ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.stock && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ overflow: "hidden" }}
            >
              <div className="d-flex flex-wrap gap-1">
                {STOCK_OPTIONS.map(({ label, value }) => (
                  <PillButton
                    key={value}
                    active={stockAvailability === value}
                    onClick={() => setStockAvailability(value)}
                  >
                    {label}
                  </PillButton>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories (Labels) */}
      <div className="mb-3 border-bottom pb-2">
        <div
          className="d-flex justify-content-between align-items-center mb-2"
          onClick={() => toggleSection("categories")}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div className="fw-medium">Categories</div>
          <motion.div
            animate={{ rotate: openSections.categories ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 18, fontWeight: 700 }}
          >
            {openSections.categories ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.categories && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ overflow: "hidden" }}
            >
              {availableLabels.map(({ label_name }, idx) => (
                <div className="form-check mb-2 me-3" key={`${label_name}-${idx}`}>
                  <input
                    type="checkbox"
                    id={`cat-${idx}`}
                    className="form-check-input"
                    checked={selectedLabels.includes(label_name)}
                    onChange={() => toggleCategory(label_name)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${idx}`}>
                    {label_name}
                  </label>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Size (Tags) */}
      <div className="mb-3 border-bottom pb-2 overflow-scroll "style={{height:"12rem"}}>
        <div
          className="d-flex justify-content-between align-items-center mb-2"
          onClick={() => toggleSection("caps")}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div className="fw-medium">Size</div>
          <motion.div
            animate={{ rotate: openSections.caps ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 18, fontWeight: 700 }}
          >
            {openSections.caps ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.caps && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ overflow: "hidden" }}
            >
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

      {/* Promotional */}
      <div className="mb-4">
        <div
          className="d-flex justify-content-between align-items-center mb-2"
          onClick={() => toggleSection("promo")}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div className="fw-medium">Promotional</div>
          <motion.div
            animate={{ rotate: openSections.promo ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 18, fontWeight: 700 }}
          >
            {openSections.promo ? "−" : "+"}
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {openSections.promo && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ overflow: "hidden" }}
            >
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={promotionalOnly}
                  onChange={() => setPromotionalOnly((p) => !p)}
                />
                <label className="form-check-label">Only active promos</label>
              </div>
              <div
                className="small text-secondary"
                style={{ textTransform: "capitalize" }}
              >
                *Show only products with active promotions*
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear */}
      <div className="d-flex gap-2 mt-2">
        <Button
          variant="outline-secondary"
          className="flex-grow-1"
          onClick={handleReset}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
