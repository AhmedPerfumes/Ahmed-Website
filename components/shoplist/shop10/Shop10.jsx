"use client";
import BreadCumb from "../BreadCumb";
import Style2 from "./Style2";
import Style3 from "./Style3";
import Style4 from "./Style4";
import Style5 from "./Style5";
import Style6 from "./Style6";
import Style7 from "./Style7";
import Style8 from "./Style8";
import Style9 from "./Style9";
import Style10 from "./Style10";
import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Star from "@/components/common/Star";
import { useContextElement } from "@/context/Context";
import ColorSelection from "@/components/common/ColorSelection";
import Image from "next/image";
import { sortingOptions } from "@/data/products/productCategories";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useShopFilter } from "@/context/ShopFilterContext";
import { useMenu } from "@/context/MenuContext";
import Slider from "rc-slider";
import he from "he";
import ProductFilter from "../ProductFilter";

export default function Shop10({ subCategories, products }) {
  const pathname = usePathname();
  const category = pathname.split("/")[3];
  const subcategory = pathname.split("/")[4];
  const t = useTranslations();
  const locale = useLocale();
  const { isLoading: isMenuLoading, error: isMenuError, currency } = useMenu();

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
  } = useShopFilter();

  const [availableLabels, setAvailableLabels] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isDDActive, setIsDDActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);

  const [sortOption, setSortOption] = useState('popularity');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const allViews = [2, 3, 4];
  const [availableViews, setAvailableViews] = useState(allViews);
  const [selectedColView, setSelectedColView] = useState(3);

  // Extract all unique category names dynamically from active products
  const allProducts = useMemo(() => {
    let allProds = [];
    if (products && products.length > 0) {
      allProds = products;
    } else if (subCategories && subCategories.length > 0) {
      subCategories.forEach(sub => {
        if (sub.products && sub.products.length > 0) {
          allProds = [...allProds, ...sub.products];
        }
      });
    }
    return allProds;
  }, [products, subCategories]);

  const uniqueCategories = useMemo(() => {
    const categories = allProducts.map(p => p.category_name).filter(Boolean);
    return [...new Set(categories)].sort();
  }, [allProducts]);

  // Extract all unique subcategory names dynamically from active products
  const uniqueSubcategories = useMemo(() => {
    const activeProducts = selectedCategories.length > 0 
      ? allProducts.filter(p => selectedCategories.includes(p.category_name))
      : allProducts;

    const subcats = activeProducts
      .map(p => p.subcategory?.subcategory_name || p.subcategory_name || p.subcategory)
      .filter((s) => s && typeof s === 'string');
    return [...new Set(subcats)].sort();
  }, [allProducts, selectedCategories]);

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

  // Fetch filters on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getFilters`);
        const json = await res.json();
        setAvailableLabels(Array.isArray(json.labels) ? json.labels : []);
        setAvailableTags(Array.isArray(json.tags) ? json.tags : []);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, []);

  // Click outside filter popup to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDDActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Update dynamic maxPrice and default priceRange based on active products
  useEffect(() => {
    let allProds = [];
    if (products && products.length > 0) {
      allProds = products;
    } else if (subCategories && subCategories.length > 0) {
      subCategories.forEach(sub => {
        if (sub.products && sub.products.length > 0) {
          allProds = [...allProds, ...sub.products];
        }
      });
    }

    if (allProds.length > 0) {
      const calculatedMax = Math.ceil(Math.max(...allProds.map(p => Number(p.price) || 0)));
      setMaxPrice(calculatedMax || 1000);
      setPriceRange([0, calculatedMax || 1000]);
    } else {
      setMaxPrice(1000);
      setPriceRange([0, 1000]);
    }
  }, [products, subCategories, setPriceRange]);

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
    setSearchTerm('');
  };

  const sortSubCategory = (items, option) => {
    switch (option) {
      case 'popularity':
        return [...items].sort((a, b) => (b.sales || 0) - (a.sales || 0));
      case 'date':
        return [...items].sort((a, b) => (b.product_id || 0) - (a.product_id || 0));
      case 'price':
        return [...items].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      case 'price-desc':
        return [...items].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      default:
        return items;
    }
  };

  const filterAndSortProducts = (items) => {
    if (!items) return [];
    const filtered = items.filter(product => {
      // "New Launch" items are never filtered out
      if (product.collection_name === 'New Launch') {
        return true;
      }

      // Search filter
      const productName = product.product_name || "";
      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // Price filter
      const productPrice = Number(product.price);
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
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

    return sortSubCategory(filtered, sortOption);
  };

  const filteredSubCatProducts = useMemo(() => {
    if (!products) return [];
    return filterAndSortProducts(products);
  }, [products, priceRange, stockAvailability, promotionalOnly, selectedLabels, selectedCategories, selectedSubcategories, selectedTags, sortOption, searchTerm]);

  const filteredCatProducts = useMemo(() => {
    if (!subCategories) return [];
    return subCategories.map(sub => {
      const filteredProds = filterAndSortProducts(sub.products || []);
      return {
        ...sub,
        products: filteredProds
      };
    }).filter(sub => sub.products.length > 0);
  }, [subCategories, priceRange, stockAvailability, promotionalOnly, selectedLabels, selectedCategories, selectedSubcategories, selectedTags, sortOption, searchTerm]);

  return (
    <section className="gift-shop shop-main container">
      <div id="next-section"></div>
      <div className="shop-toolbar">
        <div className="breadcrumb mb-0">
          <BreadCumb category={category} subcategory={subcategory} />
        </div>

        <div className="shop-acs d-flex align-items-center gap-3 position-relative" ref={ref}>
          {/* Search bar (Desktop) */}
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
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>

          {/* Filter button */}
          <button 
            className={`btn d-flex align-items-center text-uppercase fw-bold p-0 border-0 ${isDDActive ? 'text-dark' : 'text-secondary'}`}
            onClick={() => setIsDDActive(!isDDActive)}
            style={{ letterSpacing: '1px', fontSize: '14px' }}
            dir="ltr"
          >
            <svg className="me-2" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 5h16M4 10h12M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
                showOffers={false}
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
      <div className="d-md-none mb-4 mt-3">
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
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>

      <div className="products-grid pt-4">
        {filteredCatProducts && filteredCatProducts.map((subCategory, ind) => {
          return (
            <div key={ind} className="product-section mb-5">
              <h2 className="section-title fw-normal mb-4 text-center text-uppercase" style={{ letterSpacing: '0.1em' }}>
                {t(subCategory.name)}
              </h2>
              <Style2 category={category} subcategory={subCategory.name} products={subCategory.products} selectedColView={selectedColView} />
            </div>
          );
        })}

        {products && filteredSubCatProducts.length > 0 && (
          <div className="product-section mb-5">
            <Style2 category={category} subcategory={subcategory ? subcategory : null} products={filteredSubCatProducts} selectedColView={selectedColView} />
          </div>
        )}

        {products && filteredSubCatProducts.length === 0 && (
          <div className="text-center py-5">
            <h3 className="h5 text-uppercase mb-3">{t("No Products Found")}</h3>
            <p className="text-secondary">{t("Try adjusting or resetting your filters.")}</p>
            <button className="btn btn-outline-dark text-uppercase mt-2" onClick={handleReset}>{t("Reset All")}</button>
          </div>
        )}

        {subCategories && filteredCatProducts.length === 0 && (
          <div className="text-center py-5">
            <h3 className="h5 text-uppercase mb-3">{t("No Products Found")}</h3>
            <p className="text-secondary">{t("Try adjusting or resetting your filters.")}</p>
            <button className="btn btn-outline-dark text-uppercase mt-2" onClick={handleReset}>{t("Reset All")}</button>
          </div>
        )}
      </div>
    </section>
  );
}
