"use client";

import {
  brands,
  categories,
  colors,
  filters,
  sizes,
} from "@/data/products/productFilterOptions";
import { useEffect, useState } from "react";
import Slider from "rc-slider";
import { useMenu } from "@/context/MenuContext";
import Link from "next/link";

const STOCK_OPTIONS = [
  { label: "In Stock", value: "in_stock" },
  { label: "All Items", value: "all" },
  { label: "Upcoming", value: "upcoming" },
];

const CATEGORY_OPTIONS = [
  "Luxury",
  "Premium",
  "All time favourite",
  "Hot Selling",
  "New Launch",
];

const CAP_OPTIONS = ["100ml", "90ml", "70ml", "50ml"];

export default function FilterAll() {
  const { isLoading: isMenuLoading, error: isMenuError, currency } = useMenu();
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [activeSizes, setActiveSizes] = useState([]);
  const [filterFacts, setFilterFacts] = useState(filters);

  const [activeBrands, setActiveBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // NEW STATES for added filters
  const [stockAvailability, setStockAvailability] = useState("all");
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeCaps, setActiveCaps] = useState([]);
  const [promotionalOnly, setPromotionalOnly] = useState(false);

  const toggleSize = (size) => {
    if (activeSizes.includes(size)) {
      setActiveSizes((pre) => [...pre.filter((elm) => elm !== size)]);
    } else {
      setActiveSizes((pre) => [...pre, size]);
    }
  };

  const toggleBrands = (brand) => {
    if (activeBrands.includes(brand)) {
      setActiveBrands((pre) => [...pre.filter((elm) => elm !== brand)]);
    } else {
      setActiveBrands((pre) => [...pre, brand]);
    }
  };

  const toggleCategory = (cat) => {
    if (activeCategories.includes(cat)) {
      setActiveCategories((pre) => [...pre.filter((c) => c !== cat)]);
    } else {
      setActiveCategories((pre) => [...pre, cat]);
    }
  };

  const toggleCap = (cap) => {
    if (activeCaps.includes(cap)) {
      setActiveCaps((pre) => [...pre.filter((c) => c !== cap)]);
    } else {
      setActiveCaps((pre) => [...pre, cap]);
    }
  };

  useEffect(() => {
    setActiveBrands((pre) =>
      pre.filter((elm) => elm.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const [price, setPrice] = useState([500, 0]);

  const handleOnChange = (value) => {
    setPrice(value);
  };

  return (
    <>
      {/* Price Range */}
      <div className="accordion" id="price-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header mb-2" id="accordion-heading-price">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-price"
              aria-expanded="true"
              aria-controls="accordion-filter-price"
            >
              Price
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path className="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                  <path className="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-price"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-price"
            data-bs-parent="#price-filters"
          >
            <Slider
              range
              formatLabel={() => ``}
              max={500}
              min={0}
              defaultValue={price}
              onChange={(value) => handleOnChange(value)}
              id="slider"
            />
            <div className="price-range__info d-flex align-items-center mt-2">
              <div className="me-auto">
                <span className="text-secondary">Max Price: </span>
                <span className="price-range__max">
                  {price[1]}
                  {currency.symbol}
                </span>
              </div>
              <div>
                <span className="text-secondary">Min Price: </span>
                <span className="price-range__min">
                  {price[0]}
                  {currency.symbol}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /.accordion */}
      {/* Stock Availability */}
      <div className="accordion" id="stock-filter">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="stock-filter-heading">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#stock-filter-collapse"
              aria-expanded="true"
              aria-controls="stock-filter-collapse"
            >
              Stock Availability
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path className="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                  <path className="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="stock-filter-collapse"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="stock-filter-heading"
            data-bs-parent="#stock-filter"
          >
            <div className="accordion-body px-0 pb-0">
              <ul className="list list-inline row row-cols-1 mb-0">
                {STOCK_OPTIONS.map(({ label, value }) => (
                  <li key={value} className="list-item">
                    <Link
                      href="#"
                      className={`menu-link py-1 ${stockAvailability === value ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setStockAvailability(value);
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="accordion" id="categories-list">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="accordion-heading-11">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-1"
              aria-expanded="true"
              aria-controls="accordion-filter-1"
            >
              Product Categories
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path className="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                  <path className="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-1"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-11"
            data-bs-parent="#categories-list"
          >
            <div className="accordion-body px-0 pb-0">
              <ul className="list list-inline row row-cols-2 mb-0">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`list-item ${
                      activeCategories.includes(category) ? "active" : ""
                    }`}
                  >
                    <Link
                      href="#"
                      className="menu-link py-1"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCategory(category);
                      }}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cap */}
      <div className="accordion" id="cap-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="cap-filter-heading">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#cap-filter-collapse"
              aria-expanded="true"
              aria-controls="cap-filter-collapse"
            >
              Cap
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path className="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                  <path className="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="cap-filter-collapse"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="cap-filter-heading"
            data-bs-parent="#cap-filters"
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap">
                {CAP_OPTIONS.map((cap, i) => (
                  <a
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCap(cap);
                    }}
                    className={`swatch-size btn btn-sm btn-outline-light mb-3 me-3 js-filter ${
                      activeCaps.includes(cap) ? "swatch_active" : ""
                    } `}
                    href="#"
                  >
                    {cap}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color */}
      {/* <div className="accordion" id="color-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="accordion-heading-1">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-2"
              aria-expanded="true"
              aria-controls="accordion-filter-2"
            >
              Color
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path className="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                  <path className="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-2"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-1"
            data-bs-parent="#color-filters"
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap">
                {colors.map((swatch, index) => (
                  <a
                    onClick={() => setActiveColor(swatch)}
                    key={index}
                    className={`swatch-color js-filter ${
                      activeColor == swatch ? "swatch_active" : ""
                    }`}
                    style={{ color: swatch.color }}
                  ></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Sizes */}
      {/* <div className="accordion" id="size-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="accordion-heading-size">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-size"
              aria-expanded="true"
              aria-controls="accordion-filter-size"
            >
              Sizes
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path className="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                  <path className="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-size"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-size"
            data-bs-parent="#size-filters"
          >
            <div className="d-flex flex-wrap">
              {sizes.map((elm, i) => (
                <a
                  key={i}
                  onClick={() => toggleSize(elm)}
                  className={`swatch-size btn btn-sm btn-outline-light mb-3 me-3 js-filter ${
                    activeSizes.includes(elm) ? "swatch_active" : ""
                  } `}
                >
                  {elm}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* Brands */}
      {/* <div className="accordion" id="brand-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="accordion-heading-brand">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-brand"
              aria-expanded="true"
              aria-controls="accordion-filter-brand"
            >
              Brands
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path className="svg-path-vertical" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                  <path className="svg-path-horizontal" d="M14,6 L14,8 L0,8 L0,6 L14,6" />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-brand"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-brand"
            data-bs-parent="#brand-filters"
          >
            <div className="search-field multi-select accordion-body px-0 pb-0">
              <div className="search-field__input-wrapper mb-3">
                <input
                  type="text"
                  name="search_text"
                  className="search-field__input form-control form-control-sm border-light border-2"
                  placeholder="SEARCH"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ul className="multi-select__list list-unstyled">
                {brands
                  .filter((elm) =>
                    elm.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((elm, i) => (
                    <li
                      key={i}
                      onClick={() => toggleBrands(elm)}
                      className={`search-suggestion__item multi-select__item text-primary js-search-select js-multi-select ${
                        activeBrands.includes(elm)
                          ? "mult-select__item_selected"
                          : ""
                      }`}
                    >
                      <span className="me-auto">{elm.name}</span>
                      <span className="text-secondary">{elm.count}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div> */}

      

      {/* Promotional checkbox */}
      <div className="form-check form-switch mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="promotionalSwitch"
          checked={promotionalOnly}
          onChange={() => setPromotionalOnly(!promotionalOnly)}
        />
        <label className="form-check-label" htmlFor="promotionalSwitch">
          Show only active promotions
        </label>
      </div>

      {/* <div className="filter-active-tags pt-2">
        {filterFacts.map((filter) => (
          <button
            onClick={() =>
              setFilterFacts((pre) => [...pre.filter((elm) => elm.label !== filter.label)])
            }
            key={filter.id}
            className="filter-tag d-inline-flex align-items-center mb-3 me-3 text-uppercase js-filter"
          >
            <i className="btn-close-xs d-inline-block" />
            <span className="ms-2">{filter.label}</span>
          </button>
        ))}
        <div></div>
      </div> */}
    </>
  );
}
