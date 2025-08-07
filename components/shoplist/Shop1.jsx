// components/shoplist/Shop1.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import BreadCumb from "./BreadCumb";
import Link from "next/link";
import Image from "next/image";
import Pagination1 from "../common/Pagination1";
import { useContextElement } from "@/context/Context";
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from "@/context/MenuContext";
import { useShopFilter } from "@/context/ShopFilterContext";
import FilterAll from "./filter/FilterAll";
import { sortingOptions } from "@/data/products/productCategories";
import { openModalShopFilter } from "@/utlis/aside";
import he from "he";

const itemPerRow = [2, 3, 4];

export default function Shop1({ search }) {
  const { currency } = useMenu();
  const locale = useLocale();
  const t = useTranslations();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  const [selectedColView, setSelectedColView] = useState(3);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("popularity");

  const {
    rawProducts,
    setRawProducts,
    priceRange,
    setPriceRange,
    stockAvailability,
    promotionalOnly,
  } = useShopFilter();

  // Fetch *all* products in two requests (get total, then fetch)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1) get total count
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
        // 2) fetch total
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
        setRawProducts(sortItems(norm, sortOption));
      } catch (e) {
        console.error("Error fetching products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [search, sortOption, setRawProducts]);

  // Initialize priceRange
  useEffect(() => {
    if (!rawProducts.length) return;
    const vals = rawProducts.map((p) => p.price).filter((v) => !isNaN(v));
    if (!vals.length) return;
    setPriceRange([Math.floor(Math.min(...vals)), Math.ceil(Math.max(...vals))]);
  }, [rawProducts, setPriceRange]);

  // sort util
  const sortItems = (items, opt) => {
    switch (opt) {
      case "popularity":
        return [...items].sort((a, b) => (b.sales || 0) - (a.sales || 0));
      case "date":
        return [...items].sort((a, b) => (b.product_id || 0) - (a.product_id || 0));
      case "price":
        return [...items].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return [...items].sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return items;
    }
  };
  const handleSortChange = (e) => {
    const v = e.target.value;
    setSortOption(v);
    setRawProducts((prev) => sortItems(prev, v));
  };

  // final filtered list
  const filteredProducts = useMemo(() => {
    const [low, high] = priceRange;
    return sortItems(
      rawProducts
        .filter((p) => {
          if (stockAvailability === "in_stock") return p.product_qty > 0;
          if (stockAvailability === "upcoming") return p.product_qty <= 0;
          return true;
        })
        .filter((p) => {
          const pr = p.price;
          if (isNaN(pr)) return false;
          if (low === 0 && high === 0) return true;
          return pr >= low && pr <= high;
        })
        .filter((p) =>
          promotionalOnly ? p.discount != null || p.sale_price != null : true
        ),
      sortOption
    );
  }, [
    rawProducts,
    priceRange,
    stockAvailability,
    promotionalOnly,
    sortOption,
  ]);

  // URL helpers
  const clean = (s) =>
    s
      .replace(/&amp;/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase();
  const isSubcat = (cat, sub) =>
    sub
      ? clean(sub.subcategory_name)
      : ["gift-sets", "hair-mist", "extrait-de-parfum"].includes(clean(cat))
      ? clean(cat)
      : "online-exclusive";

  const discPrice = (elm) => {
    const now = new Date(Date.now() + 4 * 3600e3)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    if (
      elm.discount &&
      now >= elm.discount.start_date &&
      now <= elm.discount.end_date
    ) {
      const sale = (elm.price - (elm.price * elm.discount.value) / 100).toFixed(
        2
      );
      return (
        <>
          <span className="money price price-old">
            {elm.price}
            {currency.symbol}
          </span>{" "}
          <span className="money price price-sale">
            {sale}
            {currency.symbol}
          </span>
        </>
      );
    } else if (elm.sale_price) {
      return (
        <>
          <span className="money price price-old">
            {elm.price}
            {currency.symbol}
          </span>{" "}
          <span className="money price price-sale">
            {elm.sale_price.toFixed(2)}
            {currency.symbol}
          </span>
        </>
      );
    }
    return (
      <span className="money price">
        {elm.price}
        {currency.symbol}
      </span>
    );
  };

  return (
    <>
      <section className="full-width_padding">
        <div
          className="full-width_border border-2"
          style={{ borderColor: "#eeeeee" }}
        >
          <div className="shop-banner position-relative">
            <div
              className="background-img"
              style={{ backgroundColor: "#eeeeee" }}
            >
              <Image
                loading="lazy"
                src="/assets/images/shop/multiple-products-banner.jpg"
                width={1759}
                height={420}
                alt="Pattern"
                className="slideshow-bg__img object-fit-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4 pb-lg-3"></div>

      <section className="shop-main container d-flex">
        <div className="shop-sidebar side-sticky bg-body">
          <div
            onClick={openModalShopFilter}
            className="aside-header d-flex d-lg-none align-items-center"
          >
            <h3 className="text-uppercase fs-6 mb-0">Filter</h3>
            <button className="btn-close-lg js-close-aside btn-close-aside ms-auto" />
          </div>
          <div className="pt-4 pt-lg-0" />
          <FilterAll />
        </div>

        <div className="shop-list flex-grow-1">
          <div className="d-flex justify-content-between mb-4 pb-md-2">
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <BreadCumb category={null} subcategory={null} />
            </div>

            <div className="shop-acs d-flex align-items-center justify-content-center">
              <select
                className="shop-acs__select w-auto border mx-4 p-2"
                value={sortOption}
                onChange={handleSortChange}
              >
                {sortingOptions.map((o, i) => (
                  <option key={i} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <div className="col-size align-items-center d-none d-lg-flex ms-4">
                <span className="text-uppercase fw-medium me-2">View</span>
                {itemPerRow.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColView(c)}
                    className={`btn-link fw-medium me-2 ${
                      selectedColView === c ? "btn-link_active" : ""
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="shop-filter d-flex align-items-center order-0 order-md-3 d-lg-none">
                <button
                  className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                  onClick={openModalShopFilter}
                >
                  <svg
                    className="d-inline-block align-middle me-2"
                    width="14"
                    height="10"
                  >
                    <use href="#icon_filter" />
                  </svg>
                  <span className="text-uppercase fw-medium align-middle">
                    {t("Filter")}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className={`products-grid row row-cols-2 row-cols-md-3 row-cols-lg-${selectedColView}`}
          >
            {filteredProducts.map((elm, i) => (
              <div key={i} className="product-card-wrapper">
                <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                  <div className="pc__img-wrapper">
                    <Link
                      href={`/${locale}/shop/${clean(
                        elm.category_name
                      )}/${isSubcat(elm.category_name, elm.subcategory)}/${clean(
                        elm.product_name
                      )}`}
                    >
                      {elm.images && (
                        <>
                          {JSON.parse(elm.images)[0] && (
                            <Image
                              loading="lazy"
                              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(
                                elm.images
                              )[0]}`}
                              width={330}
                              height={400}
                              alt={elm.product_name}
                              className="pc__img"
                            />
                          )}
                          {JSON.parse(elm.images)[1] && (
                            <Image
                              loading="lazy"
                              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(
                                elm.images
                              )[1]}`}
                              width={330}
                              height={400}
                              alt={elm.product_name}
                              className="pc__img pc__img-second"
                            />
                          )}
                        </>
                      )}
                    </Link>

                    {/* restored label_name */}
                    {elm.label_name && (
                      <div
                        className="product-label text-uppercase text-white top-0 left-auto right-0 mt-2 mx-2"
                        style={{ backgroundColor: elm.label_color }}
                      >
                        {elm.label_name}
                      </div>
                    )}

                    {elm.product_qty <= 0 ? (
                      <div
                        className="product-label text-uppercase text-white top-0 start-0 mt-2 mx-2"
                        style={{ backgroundColor: "#dc3545" }}
                      >
                        Out Of Stock
                      </div>
                    ) : (
                      elm.discount && (
                        <div
                          className="product-label text-uppercase text-white top-0 start-0 mt-2 mx-2"
                          style={{ backgroundColor: "#198754" }}
                        >
                          Sale {elm.discount.value}%
                        </div>
                      )
                    )}

                    {elm.product_qty > 0 &&
                      (isAddedToCartProducts(elm.product_id) ? (
                        <button className="pc__atc btn anim_appear-bottom position-absolute border-0 text-uppercase fw-medium">
                          {t("Already Added")}
                        </button>
                      ) : (
                        <button
                          className="pc__atc btn anim_appear-bottom position-absolute border-0 text-uppercase fw-medium"
                          onClick={() =>
                            addProductToCart({
                              ...elm,
                              category_name: elm.category_name,
                              subcategory_name: elm.subcategory?.subcategory_name,
                            })
                          }
                        >
                          {t("Add To Cart")}
                        </button>
                      ))}
                  </div>

                  <div className="pc__info position-relative">
                    <p className="pc__category">{t(elm.category_name)}</p>
                    <h6 className="pc__title">
                      <Link
                        href={`/${locale}/shop/${clean(
                          elm.category_name
                        )}/${isSubcat(elm.category_name, elm.subcategory)}/${clean(
                          elm.product_name
                        )}`}
                      >
                        {t(he.decode(elm.product_name))}
                      </Link>
                    </h6>
                    <div className="product-card__price d-flex">
                      {discPrice(elm)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && <Pagination1 />}

          {!loading && (
            <p className="mb-5 text-center fw-medium">
              {t("Showing")} {filteredProducts.length} {t("items")}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
