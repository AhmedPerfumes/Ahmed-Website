"use client";
import Pagination1 from "../common/Pagination1";
import { useEffect, useState, useRef, useMemo } from "react";
import BreadCumb from "./BreadCumb";
import he from 'he';
import Slider from "rc-slider";
import ProductFilter from "./ProductFilter";
import ProductCard, { ProductCardSkeleton } from "@/components/common/ProductCard";

import { useLocale, useTranslations } from 'next-intl';
import { useMenu } from '@/context/MenuContext';
import { useShopFilter } from "@/context/ShopFilterContext";
import {
  removeSpecialCharactersAndAmp,
  sanitizeUrlParam,
  capitalizeEachWord,
  formatPrice
} from "@/utils/shop";
import Image from "next/image";

export default function Shop1({ search }) {
  const { isLoading: isMenuLoading, error: isMenuError, currency } = useMenu();
  const locale = useLocale();


  const {
    priceRange,
    setPriceRange,
    stockAvailability,
    setStockAvailability,
    promotionalOnly,
    setPromotionalOnly,
    selectedLabels,
    setSelectedLabels,
    selectedTags,
    setSelectedTags,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    selectedCategories,
    setSelectedCategories,
    selectedSubcategories,
    setSelectedSubcategories,
    maxPrice,
    setMaxPrice,
    rawProducts: products,
    setRawProducts: setProducts,
    lastSearchQuery,
    setLastSearchQuery,
  } = useShopFilter();

  const [availableLabels, setAvailableLabels] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const allViews = [2, 3, 4];
  const smallViews = [1, 2];
  const [availableViews, setAvailableViews] = useState(allViews);
  const [selectedColView, setSelectedColView] = useState(3);
  const t = useTranslations();

  const [loading, setLoading] = useState(false);

  // Extract all unique category names dynamically from active products
  const uniqueCategories = useMemo(() => {
    const categories = products.map(p => p.category_name).filter(Boolean);
    return [...new Set(categories)].sort();
  }, [products]);

  // Extract all unique subcategory names dynamically from active products
  const uniqueSubcategories = useMemo(() => {
    const activeProducts = selectedCategories.length > 0
      ? products.filter(p => selectedCategories.includes(p.category_name))
      : products;

    const subcats = activeProducts
      .map(p => p.subcategory?.subcategory_name || p.subcategory_name || p.subcategory)
      .filter((s) => s && typeof s === 'string');
    return [...new Set(subcats)].sort();
  }, [products, selectedCategories]);

  const [collapsedSections, setCollapsedSections] = useState({
    sortBy: false,
    priceRange: false,
    categories: false,
    labels: false,
    size: true,
    availability: false,
    promotional: true,
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSectionHeader = (title, key) => {
    const isCollapsed = collapsedSections[key];
    return (
      <div
        className="d-flex justify-content-between align-items-center cursor-pointer mb-3 select-none"
        onClick={() => toggleSection(key)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <span
          className="text-uppercase fw-bold text-secondary mb-0 transition-colors"
          style={{ fontSize: '10px', letterSpacing: '1.5px', transition: 'color 0.2s ease' }}
        >
          {title}
        </span>
        <svg
          className="transition-transform duration-200 text-secondary"
          style={{
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.6
          }}
          width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="2 4 5 7 8 4" />
        </svg>
      </div>
    );
  };
  const [isDDActive, setIsDDActive] = useState(false);
  const ref = useRef(null);
  const gridRef = useRef(null);

  // Sorting function
  const sortItems = (items, option) => {
    switch (option) {
      case 'popularity':
        return [...items].sort((a, b) => (b.sales || 0) - (a.sales || 0));
      case 'date':
        return [...items].sort((a, b) => (b.product_id || 0) - (a.product_id || 0));
      case 'price':
        return [...items].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return [...items].sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return items;
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getFilters`);
        const json = await res.json();
        setAvailableLabels(Array.isArray(json.labels) ? json.labels : []);
        setAvailableTags(Array.isArray(json.tags) ? json.tags : []);
      } catch (err) {
        // // console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // "New Launch" items are never filtered out
      if (product.collection_name === 'New Launch') {
        return true;
      }

      // Search filter
      const translatedName = t(he.decode(product.product_name)).toLowerCase();
      const matchesSearch = translatedName.includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      if (!matchesPrice) return false;

      // Stock filter
      if (stockAvailability === "in_stock" && product.product_qty <= 0) return false;
      if (stockAvailability === "upcoming" && product.product_qty > 0) return false;

      // Promotional filter
      if (promotionalOnly && !product.discount) return false;

      // Labels filter
      if (selectedLabels.length > 0) {
        const labels = Array.isArray(product.labels) ? product.labels : [];
        const hasLabel = labels.some(l => selectedLabels.includes(l.label_name));
        if (!hasLabel) return false;
      }

      // Categories filter
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.includes(product.category_name);
        if (!matchesCategory) return false;
      }

      // Subcategories filter
      if (selectedSubcategories.length > 0) {
        const subcatVal = product.subcategory?.subcategory_name || product.subcategory_name || product.subcategory;
        const matchesSubcategory = selectedSubcategories.includes(subcatVal);
        if (!matchesSubcategory) return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const tags = Array.isArray(product.tags) ? product.tags : [];
        const hasTag = tags.some(t => selectedTags.includes(t));
        if (!hasTag) return false;
      }

      return true;
    });
    return sortItems(filtered, sortOption);
  }, [products, priceRange, stockAvailability, promotionalOnly, selectedLabels, selectedCategories, selectedSubcategories, selectedTags, sortOption, searchTerm, t]);

  useEffect(() => {
    // If we already have products and the search query hasn't changed, 
    // don't fetch again to preserve scroll position and state
    if (products.length > 0 && search === lastSearchQuery) {
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const head = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/allProducts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: 1,
              limit: 1,
              search: search?.replace(/-/g, " ") || "",
            }),
          }
        );
        const { total } = await head.json();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/allProducts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: 1,
              limit: total,
              search: search?.replace(/-/g, " ") || "",
            }),
          }
        );
        const { data = [] } = await res.json();
        const norm = data.map((p) => ({ ...p, price: Number(p.price) }));
        const calculatedMax = norm.length > 0 ? Math.ceil(Math.max(...norm.map(p => p.price))) : 1000;

        setMaxPrice(calculatedMax);
        // Only reset price range if it's currently at default or was never set
        if (priceRange[0] === 0 && priceRange[1] === 500) {
          setPriceRange([0, calculatedMax]);
        }

        setProducts(norm);
        setLastSearchQuery(search);
      } catch (e) {
        // // // console.error("Error fetching products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [search, setPriceRange, products.length, lastSearchQuery, setProducts, setMaxPrice, setLastSearchQuery]);

  useEffect(() => {
    const updateViews = () => {
      const isSmall = window.innerWidth < 992;
      if (isSmall) {
        setAvailableViews(smallViews);
        setSelectedColView((prev) => (smallViews.includes(prev) ? prev : 2));
      } else {
        setAvailableViews(allViews);
        setSelectedColView((prev) => (allViews.includes(prev) ? prev : 3));
      }
    };
    updateViews();
    window.addEventListener("resize", updateViews);
    return () => window.removeEventListener("resize", updateViews);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDDActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);



  const toggleFilter = (array, setArray, value) => {
    setArray(prev =>
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    );
  };

  const handleReset = () => {
    setPriceRange([0, maxPrice]);
    setStockAvailability("all");
    setPromotionalOnly(false);
    setSelectedLabels([]);
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedSubcategories([]);
  };

  return (
    <>
      <section className="full-width_padding">
        <div className="full-width_border border-2" style={{ borderColor: "#eeeeee" }}>
          <div className="shop-banner position-relative">
            <div className="background-img" style={{ backgroundColor: "#eeeeee" }}>
              <Image
                loading="lazy"
                src="/assets/images/shop/multiple-products-banner.jpg"
                width="1759"
                height="420"
                alt="Pattern"
                className="slideshow-bg__img object-fit-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4 pb-lg-3"></div>

      <section className="gift-shop shop-main container" ref={gridRef}>
        <div className="shop-toolbar">
          <div className="breadcrumb mb-0">
            <BreadCumb category={null} subcategory={null} />
          </div>
          <div className="shop-acs d-flex align-items-center gap-3 position-relative" ref={ref}>
            <div className="search-field position-relative d-none d-md-block">
              <input
                type="text"
                className="form-control border px-3 py-1"
                placeholder={t("Search Products")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  fontSize: '13px',
                  width: '200px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #eee',
                  borderRadius: 0
                }}
              />
              <svg
                className="position-absolute top-50 translate-middle-y"
                style={{ [locale === 'ar' ? 'left' : 'right']: '12px', opacity: 0.4 }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            <button
              className={`btn d-flex align-items-center text-uppercase fw-bold p-0 border-0 ${isDDActive ? 'text-dark' : 'text-secondary'}`}
              onClick={() => setIsDDActive(!isDDActive)}
              style={{ letterSpacing: '1px', fontSize: '14px' }}
              dir="ltr"
            >
              <svg className="me-2" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5h16M4 10h12M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {t("Filter")}
              {(selectedLabels.length > 0 || selectedTags.length > 0 || selectedCategories.length > 0 || selectedSubcategories.length > 0 || promotionalOnly || stockAvailability !== 'all') && (
                <span className="ms-1 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '16px', height: '16px', fontSize: '10px' }}>
                  {selectedLabels.length + selectedTags.length + selectedCategories.length + selectedSubcategories.length + (promotionalOnly ? 1 : 0) + (stockAvailability !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>

            {isDDActive && (
              <div
                className="filter-popup position-absolute top-100 mt-3 p-4 bg-white shadow-xl rounded-4 animate__animated animate__fadeInUp animate__faster"
                style={{
                  zIndex: 1000,
                  width: '350px',
                  [locale === 'ar' ? 'left' : 'right']: 0,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  maxHeight: '80vh',
                  overflowY: 'auto'
                }}
              >
                <ProductFilter
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  maxPrice={maxPrice}
                  currency={currency}
                  uniqueCategories={uniqueCategories}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  uniqueSubcategories={uniqueSubcategories}
                  selectedSubcategories={selectedSubcategories}
                  setSelectedSubcategories={setSelectedSubcategories}
                  availableLabels={availableLabels}
                  selectedLabels={selectedLabels}
                  setSelectedLabels={setSelectedLabels}
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  stockAvailability={stockAvailability}
                  setStockAvailability={setStockAvailability}
                  promotionalOnly={promotionalOnly}
                  setPromotionalOnly={setPromotionalOnly}
                  handleReset={handleReset}
                  showSortBy={true}
                  showPriceRange={true}
                  showCategories={true}
                  showSubcategories={true}
                  showLabel={true}
                  showSize={true}
                  showAvailability={true}
                  showOffers={true}
                  showViewSelector={true}
                  availableViews={availableViews}
                  selectedColView={selectedColView}
                  setSelectedColView={setSelectedColView}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="d-md-none mb-4">
          <div className="position-relative">
            <input
              type="text"
              className="form-control border px-3 py-2 w-100"
              placeholder={t("Search Products")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '14px', backgroundColor: '#f8f9fa', border: '1px solid #eee', borderRadius: 0 }}
            />
            <svg
              className="position-absolute top-50 translate-middle-y"
              style={{ [locale === 'ar' ? 'left' : 'right']: '12px', opacity: 0.4 }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        <div className={`products-grid row row-cols-${Math.min(selectedColView, 2)} row-cols-md-${selectedColView}`} id="products-grid">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : (
            filteredProducts?.map((elm, i) => (
              <ProductCard
                key={elm.product_id || i}
                product={elm}
                index={i}
              />
            ))
          )}
        </div>
        {!loading && <p className="mb-5 text-center fw-medium">{t("Showing")} {filteredProducts.length} {t("items")}</p>}
        {loading && <Pagination1 />}
      </section>
    </>
  );
}
