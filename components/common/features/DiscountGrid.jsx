"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import he from "he";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from "@/context/MenuContext";
import { useShopFilter } from "@/context/ShopFilterContext";
import { useContextElement } from "@/context/Context";
import { renderPrice } from "@/utlis/priceRenderer";
import { openModalShopFilter } from "@/utlis/aside";
// import FilterAll from "../../shop/filter/FilterAll";
import Pagination1 from "../Pagination1";
import FilterDiscounted from "./FilterDiscounted";
import FilterMobileAside from "./FilterMobileAside";

export default function DiscountGrid({ title, onlyDiscounted = false }) {
  const { currency, isLoading: isMenuLoading } = useMenu();
  const locale = useLocale();
  const t = useTranslations();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  // Filter Context Logic
  const {
    rawProducts,
    setRawProducts,
    priceRange,
    setPriceRange,
    stockAvailability,
    promotionalOnly,
    selectedLabels,
    selectedTags,
  } = useShopFilter();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const perPage = 12;

  // 1. Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/allProducts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, limit: 1000 }),
        });
        const result = await response.json();
        const norm = (result.data || []).map((p) => ({ ...p, price: Number(p.price) }));
        setRawProducts(norm);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [setRawProducts]);

  // 2. Scroll to Grid Start on Page Change
  useEffect(() => {
    if (!loading) {
      const element = document.getElementById("product-grid-start");
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 120,
          behavior: "smooth",
        });
      }
    }
  }, [page, loading]);

  // 3. Integrated Filtering Logic
  const filteredProducts = useMemo(() => {
    const [low, high] = priceRange;

    return rawProducts.filter((p) => {
      // Search Filter
      const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Stock Filter
      if (stockAvailability === "in_stock" && p.product_qty <= 0) return false;
      
      // Price Filter
      if (p.price < low || p.price > high) return false;

      // Campaign/Promotional Filter
      if (onlyDiscounted || promotionalOnly) {
        if (!p.discount) return false;
      }

      // Sidebar Label/Category Filter
      if (selectedLabels?.length > 0) {
        if (!selectedLabels.includes(p.category_name)) return false;
      }

      // Sidebar Size/Tag Filter
      if (selectedTags?.length > 0) {
        const tags = Array.isArray(p.tags) ? p.tags : [];
        if (!tags.some((t) => selectedTags.includes(t))) return false;
      }

      return true;
    });
  }, [rawProducts, searchQuery, priceRange, stockAvailability, promotionalOnly, selectedLabels, selectedTags, onlyDiscounted]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const currentProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  // Helper for Clean URLs
  const clean = (s) => s?.toLowerCase().replace(/&amp;/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  const openCampaignFilter = () => {
    const filterAside = document.getElementById("campaignFilter");
    if (filterAside) {
      filterAside.classList.add("opened");
      document.body.classList.add("aside-opened");
    }
  };

  if (loading || isMenuLoading) return <Pagination1 />;

  return (
    <section className="container py-4" id="product-grid-start">
      <div className="row">
        {/* Desktop Sidebar */}
        <aside className="col-lg-3 d-none d-lg-block side-sticky">
          <FilterDiscounted products={rawProducts} />
        </aside>

        {/* Main Grid Area */}
        <div className="col-lg-9">
          {/* Header & Search */}
          <div className="d-flex flex-column justify-content-between align-items-center mb-4 gap-3">
            <h2 className="section-title h4 fw-normal mb-0 text-uppercase">{title}</h2>
            
            <div className="d-flex gap-2 w-100 justify-content-end">
              <input
                type="text"
                className="form-control form-control-sm border-2 rounded-0 shadow-none w-25 "
                placeholder={t("Search perfumes...")}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                style={{ minWidth: '250px' }}
              />
              {/* 2. Mobile Filter Trigger Button */}
              <button 
              className="btn btn-outline-dark d-lg-none btn-sm" 
              onClick={() => setIsAsideOpen(true)}
            >
              Filter
            </button>
            </div>
          </div>

          {/* Grid */}
          <div className={`products-grid row row-cols-2 row-cols-md-3 row-cols-lg-3`}>
            {currentProducts.map((elm, i) => (
              <div key={elm.product_id || i} className="product-card-wrapper">
                {console.log(elm, "elmmm")}
                <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                  <div className="pc__img-wrapper">
                    <Swiper className="background-img" slidesPerView={1} navigation={false} modules={[Navigation]}>
                      {JSON.parse(elm.images).map((img, index) => (
                        <SwiperSlide key={index}>
                          <Link href={`/${locale}/shop/${clean(elm.category_name)}/${elm.subcategory ? clean(elm.subcategory.subcategory_name) : clean(elm.category_name)}/${clean(elm.product_name)}`}>
                            <Image
                              loading="lazy"
                              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${img}`}
                              width={330}
                              height={400}
                              alt={elm.product_name}
                              className={`pc__img ${index === 1 ? "pc__img-second" : ""}`}
                            />
                          </Link>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Preserved Original Labels/Badges */}
                    {elm.label_name && (
                      <div style={{ backgroundColor: elm.label_color }} className="product-label text-uppercase text-white top-0 left-auto right-0 mt-2 mx-2">
                        {elm.label_name}
                      </div>
                    )}

                    {elm.product_qty <= 0 ? (
                      <div style={{ backgroundColor: "#dc3545" }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2 ">
                        Out Of Stock
                      </div>
                    ) : (
                      elm.discount && elm.discount.discount_type === 'percent' && (
                        <div style={{ backgroundColor: "#198754" }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2">
                          Sale {elm.discount.value}%
                        </div>
                      )
                    )}

                    {elm.product_qty > 0 && (
                      <button
                        className="pc__atc btn anim_appear-bottom position-absolute border-0 text-uppercase fw-medium"
                        onClick={() => addProductToCart(elm)}
                        disabled={isAddedToCartProducts(elm.product_id)}
                      >
                        {t(isAddedToCartProducts(elm.product_id) ? "Already Added" : "Add To Cart")}
                      </button>
                    )}
                  </div>

                  <div className="pc__info position-relative">
                    <p className="pc__category">{t(elm.category_name)}</p>
                    <h6 className="pc__title">
                      <Link href={`/${locale}/shop/${clean(elm.category_name)}/${elm.subcategory ? clean(elm.subcategory.subcategory_name) : clean(elm.category_name)}/${clean(elm.product_name)}`}>
                        {t(he.decode(elm.product_name))}
                      </Link>
                    </h6>
                    <div className="product-card__price d-flex">{renderPrice(elm, currency)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Smart Ellipsis Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
               <PaginationGroup currentPage={page} totalPages={totalPages} setPage={setPage} />
            </div>
          )}
        </div>
      </div>

      <FilterMobileAside 
        products={rawProducts} 
        isOpen={isAsideOpen} 
        onClose={() => setIsAsideOpen(false)} 
      />
    </section>
  );
}

/**
 * Logic for 1, 2, 3 ... 54 Pagination
 */
function PaginationGroup({ currentPage, totalPages, setPage }) {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <ul className="pagination pagination-sm gap-2 align-items-center">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link rounded-circle border-0" onClick={() => setPage(p => p - 1)}>&laquo;</button>
      </li>
      {getPages().map((pg, i) => (
        <li key={i} className={`page-item ${currentPage === pg ? 'active' : ''} ${pg === '...' ? 'disabled' : ''}`}>
          {pg === "..." ? (
            <span className="px-2">...</span>
          ) : (
            <button 
              className={`page-link rounded-circle border-0 ${currentPage === pg ? 'bg-dark text-white' : 'bg-light text-dark'}`} 
              onClick={() => setPage(pg)}
              style={{ width: '38px', height: '38px' }}
            >
              {pg}
            </button>
          )}
        </li>
      ))}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button className="page-link rounded-circle border-0" onClick={() => setPage(p => p + 1)}>&raquo;</button>
      </li>
    </ul>
  );
}