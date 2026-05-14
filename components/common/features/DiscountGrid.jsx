"use client";

import { useContextElement } from "@/context/Context";
import { useEffect, useState, useMemo, useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import he from "he";
import Slider from "rc-slider";
import Pagination2 from "@/components/common/Pagination2";
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from "@/context/MenuContext";
import { useShopFilter } from "@/context/ShopFilterContext";
import Link from "next/link";
import { 
  removeSpecialCharactersAndAmp, 
  sanitizeUrlParam,
  formatPrice 
} from "@/utils/shop";
import { sortingOptions } from "@/data/products/productCategories";

const ProductPrice = ({ elm, currency }) => {
  const currentUTC = new Date();
  const currentGST = new Date(currentUTC.getTime() + (4 * 60 * 60 * 1000));
  const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");
  
  const isDiscountActive = elm?.discount && 
    new Date(current_date_time) >= new Date(elm.discount.start_date) && 
    new Date(current_date_time) <= new Date(elm.discount.end_date);

  if (isDiscountActive) {
    let discountedPrice = elm.price;
    if (elm.discount.discount_type === "percent") {
      discountedPrice = elm.price - (elm.price / 100 * elm.discount.value);
    } else if (elm.discount.discount_type === "amount") {
      discountedPrice = elm.price - elm.discount.value;
    }
    return (
      <>
        <span className="money price price-old">{formatPrice(elm.price, currency)}</span> 
        <span className="money price price-sale"> {formatPrice(discountedPrice, currency)}</span>
      </>
    );
  } else if (elm?.sale_price) {
    const salePrice = elm.price - (elm.price / 100 * elm.sale_price);
    return (
      <>
        <span className="money price price-old">{formatPrice(elm.price, currency)}</span> 
        <span className="money price price-sale"> {formatPrice(salePrice, currency)}</span>
      </>
    );
  }
  return <span className="money price">{formatPrice(elm.price, currency)}</span>;
};

const ProductCardSkeleton = () => (
  <div className="product-card-wrapper">
    <div className="product-card">
      <div className="pc__img-wrapper" style={{ background: '#f0f0f0', aspectRatio: '4/5' }}></div>
      <div className="pc__info" style={{ padding: '15px 10px' }}>
        <div className="skeleton-bar" style={{ height: '14px', width: '70%', background: '#eee', margin: '0 auto 8px', borderRadius: '4px' }}></div>
        <div className="skeleton-bar" style={{ height: '12px', width: '40%', background: '#f5f5f5', margin: '0 auto', borderRadius: '4px' }}></div>
      </div>
    </div>
  </div>
);

function DiscountGrid({ title, onlyDiscounted = false }) {
  const { isLoading: isMenuLoading, error: isMenuError, currency } = useMenu();
  const { 
    rawProducts, 
    setRawProducts,
    stockAvailability,
    setStockAvailability,
    selectedLabels,
    setSelectedLabels,
    selectedTags,
    setSelectedTags
  } = useShopFilter();
  
  const locale = useLocale();
  const { 
    addProductToCart, 
    cartProducts,
    setCartProducts 
  } = useContextElement();

  const [loading, setLoading] = useState(true);
  const [selectedColView, setSelectedColView] = useState(3);
  const [page, setPage] = useState(1);
  const perPage = 12;
  const t = useTranslations();

  const [isDDActive, setIsDDActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('popularity');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const ref = useRef(null);
  const gridRef = useRef(null);

  const availableViews = [2, 3, 4];

  // Helper for Clean URLs (legacy compatibility)
  const clean = (s) => s?.toLowerCase().replace(/&amp;/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  const uniqueLabels = useMemo(() => {
    const labels = rawProducts.map(p => p.category_name).filter(Boolean);
    return [...new Set(labels)].sort();
  }, [rawProducts]);

  const uniqueTags = useMemo(() => {
    const tags = rawProducts.flatMap(p => Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : [])).filter(Boolean);
    return [...new Set(tags)].sort();
  }, [rawProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDDActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const sortItems = (items, option) => {
    switch (option) {
      case 'popularity':
        return [...items].sort((a, b) => (b.sales || 0) - (a.sales || 0));
      case 'date':
        return [...items].sort((a, b) => b.product_id - a.product_id);
      case 'price':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...items].sort((a, b) => b.price - a.price);
      default:
        return items;
    }
  };

  useEffect(() => {
    const getAllProducts = async () => {
      if (rawProducts.length > 0) {
        setLoading(false);
        const calculatedMax = Math.ceil(Math.max(...rawProducts.map(p => p.price)));
        setMaxPrice(calculatedMax);
        setPriceRange([0, calculatedMax]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/allProducts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: 1, limit: 1000 }),
          }
        );
        const result = await response.json();
        const data = result.data || [];
        const norm = data.map((p) => ({ ...p, price: Number(p.price) }));
        setRawProducts(norm);
        
        const calculatedMax = norm.length > 0 ? Math.ceil(Math.max(...norm.map(p => p.price))) : 1000;
        setMaxPrice(calculatedMax);
        setPriceRange([0, calculatedMax]);
      } catch (error) {
        console.error("Failed to fetch all products", error);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, [setRawProducts]); // Only fetch if context is empty

  const isSubcategoryFunc = (category, subcategory) => {
    if (subcategory) return sanitizeUrlParam(subcategory.subcategory_name);
    
    const categorySlug = removeSpecialCharactersAndAmp(category).split(" ").join("-").toLowerCase();
    const categoryMap = {
      "gift-sets": "gift-sets",
      "hair-mist": "hair-mist",
      "extrait-de-parfum": "extrait-de-parfum",
      "xtrait-de-parfum": "extrait-de-parfum"
    };

    return categoryMap[categorySlug] || "online-exclusive";
  };

  const getProductQuantity = (id) => {
    const item = cartProducts.find(p => p.product_id === id);
    return item ? item.quantity : 0;
  };

  const updateQuantity = (id, delta) => {
    setCartProducts(prev => {
      return prev.map(p => {
        if (p.product_id === id) {
          const newQty = (p.quantity || 1) + delta;
          return newQty > 0 ? { ...p, quantity: newQty } : null;
        }
        return p;
      }).filter(Boolean);
    });
  };

  const filteredProducts = useMemo(() => {
    const [low, high] = priceRange;

    const filtered = rawProducts.filter((p) => {
      // 1. Search Filter
      const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Stock Filter
      if (stockAvailability === "in_stock" && p.product_qty <= 0) return false;
      
      // 3. Price Filter
      if (p.price < low || p.price > high) return false;

      // 4. Campaign/Promotional Filter (Reverted to old logic)
      if (onlyDiscounted) {
        if (!p.discount) return false;
      }

      // 5. Category/Label Filter
      if (selectedLabels.length > 0) {
        if (!selectedLabels.includes(p.category_name)) return false;
      }

      // 6. Tags Filter
      if (selectedTags.length > 0) {
        const pTags = Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : []);
        if (!pTags.some(t => selectedTags.includes(t))) return false;
      }

      return true;
    });
    
    return sortItems(filtered, sortOption);
  }, [rawProducts, priceRange, sortOption, onlyDiscounted, searchTerm, stockAvailability, selectedLabels, selectedTags]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const currentProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  if (isMenuError) return <div className="container py-5 text-center">Error loading products</div>;

  return (
    <section className="container py-4" ref={gridRef}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <h2 className="section-title fw-normal mb-0 text-uppercase h4 text-center text-md-start w-100">{title}</h2>
        
        <div className="shop-acs d-flex align-items-center justify-content-end gap-2 gap-md-3 position-relative w-100 w-md-auto" ref={ref}>
          <div className="search-field position-relative flex-grow-1 flex-md-grow-0">
            <input 
              type="text" 
              className="form-control border px-3 py-1" 
              placeholder={t("Search Products")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                fontSize: '13px', 
                width: '100%',
                maxWidth: '180px',
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

          <button 
            className={`btn d-flex align-items-center text-uppercase fw-bold p-0 border-0 ${isDDActive ? 'text-dark' : 'text-secondary'}`}
            onClick={() => setIsDDActive(!isDDActive)}
            style={{ letterSpacing: '1px', fontSize: '13px', whiteSpace: 'nowrap' }}
            dir="ltr"
          >
            <svg className="me-1 me-md-2" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 5h16M4 10h12M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="d-none d-xs-inline">{t("Filter")}</span>
          </button>

          {isDDActive && (
            <div 
              className="filter-popup position-absolute top-100 mt-3 p-4 bg-white shadow-xl rounded-4 animate__animated animate__fadeInUp animate__faster" 
              style={{ 
                zIndex: 1000, 
                width: '320px', 
                maxWidth: 'calc(100vw - 30px)',
                maxHeight: '80vh',
                overflowY: 'auto',
                [locale === 'ar' ? 'left' : 'right']: 0,
                border: '1px solid #f0f0f0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
              }}
            >
              <div className="mb-4">
                <label className="text-uppercase fw-bold text-secondary mb-3 d-block" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>{t("Sort By")}</label>
                <select
                  className="form-select border rounded-3 fs-sm py-2 px-3"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{ fontSize: '14px', cursor: 'pointer' }}
                >
                  {sortingOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 d-none d-md-block">
                <label className="text-uppercase fw-bold text-secondary mb-3 d-block" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>{t("View")}</label>
                <div className="d-flex align-items-center gap-2">
                  {availableViews.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColView(c)}
                      className={`flex-grow-1 py-2 rounded-3 border transition-all justify-content-center ${selectedColView === c ? "bg-dark border-dark" : "bg-light border-light"} ${c === 4 ? 'd-none d-lg-flex' : 'd-flex'}`}
                      aria-label={`View ${c} columns`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={selectedColView === c ? "#fff" : "#666"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {Array.from({ length: c }).map((_, idx) => {
                          const spacing = 16 / (c + 1);
                          const x = 4 + spacing * (idx + 1);
                          return <line key={idx} x1={x} y1="5" x2={x} y2="19" />;
                        })}
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-0">
                <label className="text-uppercase fw-bold text-secondary mb-4 d-block" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>{t("Price Range")}</label>
                <div className="px-2">
                  <Slider
                    range
                    max={maxPrice}
                    min={0}
                    defaultValue={priceRange}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value)}
                    reverse={locale === 'ar'}
                  />
                </div>
                <div className="d-flex justify-content-between mt-3 pt-1 fw-medium" style={{ fontSize: '12px' }}>
                  <div>
                    <span className={`${locale === 'ar' ? 'ms-1' : 'me-1'} text-secondary`}>{t("Min")}:</span>
                    <span>{priceRange[0]}{currency?.symbol}</span>
                  </div>
                  <div>
                    <span className={`${locale === 'ar' ? 'ms-1' : 'me-1'} text-secondary`}>{t("Max")}:</span>
                    <span>{priceRange[1]}{currency?.symbol}</span>
                  </div>
                </div>
              </div>

              {/* Stock Availability */}
              <div className="mt-4 pt-3 border-top">
                <label className="text-uppercase fw-bold text-secondary mb-3 d-block" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>{t("Availability")}</label>
                <div className="d-flex gap-2">
                  {['all', 'in_stock'].map((option) => (
                    <button
                      key={option}
                      className={`btn btn-sm px-3 py-2 border rounded-pill transition-all ${stockAvailability === option ? 'bg-dark text-white border-dark' : 'bg-light text-dark'}`}
                      onClick={() => setStockAvailability(option)}
                      style={{ fontSize: '12px' }}
                    >
                      {t(option === 'all' ? "All" : "In Stock")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories/Labels */}
              {uniqueLabels.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <label className="text-uppercase fw-bold text-secondary mb-3 d-block" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>{t("Categories")}</label>
                  <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                    {uniqueLabels.map((label) => (
                      <button
                        key={label}
                        className={`btn btn-sm px-2 py-1 border rounded-3 transition-all ${selectedLabels.includes(label) ? 'bg-dark text-white border-dark' : 'bg-light text-dark'}`}
                        onClick={() => setSelectedLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label])}
                        style={{ fontSize: '11px' }}
                      >
                        {t(label)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {uniqueTags.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <label className="text-uppercase fw-bold text-secondary mb-3 d-block" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>{t("Tags")}</label>
                  <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {uniqueTags.map((tag) => (
                      <button
                        key={tag}
                        className={`btn btn-sm px-2 py-1 border rounded-3 transition-all ${selectedTags.includes(tag) ? 'bg-dark text-white border-dark' : 'bg-light text-dark'}`}
                        onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                        style={{ fontSize: '11px' }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {(selectedLabels.length > 0 || selectedTags.length > 0 || stockAvailability !== 'all' || priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                <button 
                  className="btn btn-link btn-sm text-danger mt-4 p-0 text-decoration-none fw-bold w-100" 
                  style={{ fontSize: '11px', letterSpacing: '1px' }}
                  onClick={() => {
                    setPriceRange([0, maxPrice]);
                    setStockAvailability('all');
                    setSelectedLabels([]);
                    setSelectedTags([]);
                  }}
                >
                  {t("Clear All Filters")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`products-grid row row-cols-2 row-cols-md-${selectedColView === 2 ? 2 : 3} row-cols-lg-${selectedColView}`}>
        {loading || isMenuLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : (
            currentProducts.map((elm, i) => (
          <div key={elm.product_id || i} className="product-card-wrapper">
            <div className="product-card mb-3 mb-md-4 mb-xxl-5">
              <div className="pc__img-wrapper">
                <Swiper 
                  className="swiper swiper-container background-img js-swiper-slider" 
                  slidesPerView={1} 
                >
                  <SwiperSlide className="swiper-slide">
                    <Link
                      href={`/${locale}/shop/${sanitizeUrlParam(elm.category_name)}/${isSubcategoryFunc(elm.category_name, elm.subcategory)}/${sanitizeUrlParam(elm.product_name)}`}
                    >
                      {elm?.images && (
                        <>
                          {JSON.parse(elm.images)[0] && (
                            <Image
                              loading="lazy"
                              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(elm.images)[0]}`}
                              width={480}
                              height={600}
                              alt={elm.product_name}
                              className="pc__img"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          )}
                          {JSON.parse(elm.images)[1] && (
                            <Image
                              loading="lazy"
                              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(elm.images)[1]}`}
                              width={480}
                              height={600}
                              alt={elm.product_name}
                              className="pc__img pc__img-second"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          )}
                        </>
                      )}
                    </Link>
                    {elm.label_name && (
                      <div style={{ backgroundColor: elm.label_color }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2">
                        {elm.label_name}
                      </div>
                    )}

                    {elm.product_qty <= 0 ? (
                      <div className="product-label label--out-of-stock">
                        {t("Out Of Stock")}
                      </div>
                    ) : (
                      elm.discount && (
                        <div className="product-label label--sale">
                          {t("Sale")} {elm.discount.value}%
                        </div>
                      )
                    )}
                  </SwiperSlide>
                </Swiper>
                <div className="product-card__actions">
                  {getProductQuantity(elm.product_id) > 0 ? (
                    <div className="pc__qty-selector--desktop">
                      <button className="qty-btn" onClick={() => updateQuantity(elm.product_id, -1)} aria-label={t("Decrease quantity")}>−</button>
                      <span className="qty-value">{getProductQuantity(elm.product_id)}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(elm.product_id, 1)} aria-label={t("Increase quantity")}>+</button>
                    </div>
                  ) : elm.product_qty > 0 ? (
                    <button
                      className="btn btn-primary js-add-cart"
                      onClick={() => addProductToCart({...elm, category_name: elm.category_name, subcategory_name: elm.subcategory?.subcategory_name})}
                      title={t("Add To Cart")}
                    >
                      {t("Add To Cart")}
                    </button>
                  ) : (
                    <button className="btn btn-out-of-stock" disabled>
                      {t("Out Of Stock")}
                    </button>
                  )}
                </div>
              </div>

              <div className="pc__info position-relative">
                <p className="pc__category">{t(elm.category_name)}</p>
                <h6 className="pc__title">
                  <Link
                    href={`/${locale}/shop/${sanitizeUrlParam(elm.category_name)}/${isSubcategoryFunc(elm.category_name, elm.subcategory)}/${sanitizeUrlParam(elm.product_name)}`}
                  >
                    {t(he.decode(elm.product_name))}
                  </Link>
                </h6>

                <div className="product-card__price d-flex">
                  <ProductPrice elm={elm} currency={currency} />
                </div>

                {getProductQuantity(elm.product_id) > 0 ? (
                  <div className="pc__qty-selector">
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(elm.product_id, -1)}
                      aria-label={t("Decrease quantity")}
                    >
                      −
                    </button>
                    <span className="qty-value">{getProductQuantity(elm.product_id)}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(elm.product_id, 1)}
                      aria-label={t("Increase quantity")}
                    >
                      +
                    </button>
                  </div>
                ) : elm?.product_qty > 0 ? (
                  <button
                    className="pc__atc-mobile"
                    onClick={() => addProductToCart({...elm, category_name: elm.category_name, subcategory_name: elm.subcategory?.subcategory_name})}
                    aria-label={t("Add {name} to cart", { name: elm.product_name })}
                  >
                    {t("Add To Cart")}
                  </button>
                ) : (
                  <button className="pc__atc-mobile pc__atc-mobile--oos" disabled>
                    {t("Out Of Stock")}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      </div>



      {!loading && filteredProducts.length > 0 && (
        <p className="mt-5 mb-2 text-center fw-medium text-secondary" style={{ fontSize: '13px' }}>
          {t("Showing")} {filteredProducts.length} {t("items")}
        </p>
      )}

      {totalPages > 1 && (
        <Pagination2 
          totalPages={totalPages} 
          currentPage={page} 
          onPageChange={(p) => {
            setPage(p);
            gridRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}
    </section>
  );
}

export default DiscountGrid;