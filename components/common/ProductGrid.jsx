"use client";
import { useEffect, useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from "@/context/MenuContext";
import { useContextElement } from "@/context/Context";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Slider from "rc-slider";
import Image from "next/image";
import Link from "next/link";
import he from "he";
import Pagination1 from "@/components/common/Pagination1";
import { sortingOptions } from "@/data/products/productCategories"; // Import sorting options

import "swiper/css";
import "swiper/css/navigation";
import "rc-slider/assets/index.css";
import LabelIcon from "@/components/labels/LabelIcon";

export default function ProductGrid({ category, subcategory }) {
  const locale = useLocale();
  const t = useTranslations();
  const { currency } = useMenu();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState("popularity");
  const [price, setPrice] = useState([0, 500]); // Default price range
  const [isDDActive, setIsDDActive] = useState(false);
  const limit = 12; // Items per page
  const offset = 2500; // Scroll offset for infinite loading
  const ref = useRef(null);

  // Fetch products with pagination and optional category filter
  useEffect(() => {
    const fetchExportProducts = async (page) => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/exportProducts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page,
            limit,
            category_id: 19, // Optional filter by category
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch export products");
        }

        const data = await response.json();
        const rawProducts = Array.isArray(data) ? data : data.data || [];

        // Filter products with specific label
        // const filteredByLabel = rawProducts.filter(
        //   (product) => product.label_name === "Buy 1 Get 1 Free"
        // );

        const filteredByLabel = rawProducts.filter((product) =>
          product.labels?.some(label => label.label_name === "Buy 1 Get 1 Free")
        );

        // Apply price filter
        const filteredByPrice = filteredByLabel.filter(
          (product) => product.price >= price[0] && product.price <= price[1]
        );

        setProducts((prev) => sortItems([...prev, ...filteredByLabel], sortOption));
        setFilteredProducts((prev) => sortItems([...prev, ...filteredByPrice], sortOption));

        const total = data.total || rawProducts.length;
        const to = data.to || filteredByLabel.length;
        setTotalPages(Math.ceil(total / limit));
        setCurrentPage(to);
        if (filteredByLabel.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching export products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExportProducts(page);
  }, [page, limit]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + offset <
          document.documentElement.offsetHeight ||
        loading ||
        !hasMore
      )
        return;
      setPage((prevPage) => prevPage + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Handle click outside for price filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDDActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Sorting function
  const sortItems = (items, option) => {
    switch (option) {
      case "popularity":
        return [...items].sort((a, b) => (b.sales || 0) - (a.sales || 0));
      case "date":
        return [...items].sort((a, b) => b.product_id - a.product_id);
      case "price":
        return [...items].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...items].sort((a, b) => b.price - a.price);
      default:
        return items;
    }
  };

  // Handle sort change
  const handleSortChange = (event) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    setProducts(sortItems(products, newSortOption));
    setFilteredProducts(sortItems(filteredProducts, newSortOption));
  };

  // Handle price filter change
  const handleFilterChange = (value) => {
    setPrice(value);
    const filtered = products.filter(
      (product) => product.price >= value[0] && product.price <= value[1]
    );
    setFilteredProducts(sortItems(filtered, sortOption));
  };

  // Price display with discount logic
  const discPrice = (elm) => {
    const currentUTC = new Date();
    const currentGST = new Date(currentUTC.getTime() + 4 * 60 * 60 * 1000);
    const currentDateTime = currentGST.toISOString().slice(0, 19).replace("T", " ");

    if (elm?.discount) {
      if (
        new Date(currentDateTime) >= new Date(elm.discount.start_date) &&
        new Date(currentDateTime) <= new Date(elm.discount.end_date)
      ) {
        const discounted = (elm.price - (elm.price * elm.discount.value) / 100).toFixed(2);
        return (
          <>
            <span className="money price price-old">
              {elm.price}
              {currency.symbol}
            </span>
            <span className="money price price-sale">
              {discounted}
              {currency.symbol}
            </span>
          </>
        );
      }
    }
    return (
      <span className="money price">
        {elm.price}
        {currency.symbol}
      </span>
    );
  };

  // Clean URL slugs
  const removeSpecialCharacters = (str) =>
    str?.replace(/&amp;/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim();

  const isSubcategory = (category, subcategory) => {
    let subcat = "";
    if (subcategory) {
      return (subcat = removeSpecialCharacters(subcategory.subcategory_name)
        .split(" ")
        .join("-")
        .toLowerCase());
    } else {
      const cleanedCategory = removeSpecialCharacters(category);
      if (cleanedCategory === "gift-sets") return "gift-sets";
      if (cleanedCategory === "hair-mist") return "hair-mist";
      if (cleanedCategory === "extrait-de-parfum") return "extrait-de-parfum";
      return "online-exclusive";
    }
  };

  if (loading && page === 1) return <Pagination1 />;

  return (
    <>
    {/* Image Banner  */}
    <div
  className="mx-auto position-relative overflow-hidden w-100"
  style={{
    maxWidth: "1410px",
    height: "auto",
    aspectRatio: "1410 / 570", // Keeps aspect ratio
  }}
>
  <Image
    src="/assets/images/campaigns/Bogo.jpg"
    alt="Banner Image"
    fill
    style={{ objectFit: "cover" }}
    priority
  />
</div>

      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container">
        <div className="d-flex justify-content-between mb-4 pb-md-2">
         
          <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
            <select
              className="shop-acs__select form-select w-auto border-0 py-0 order-1 order-md-0"
              aria-label="Sort Items"
              name="sort-option"
              value={sortOption}
              onChange={handleSortChange}
            >
              {sortingOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            <div
              ref={ref}
              className={`position-relative hover-container d-none d-lg-block px-1 ${
                isDDActive ? "js-content_visible" : ""
              }`}
            >
              <div onClick={() => setIsDDActive((pre) => !pre)} className="js-hover__open">
                <span className="multi-select__actor fw-medium text-uppercase js-no-update">
                  {t("Price")}
                </span>
              </div>
              <div className="filters-container js-hidden-content mt-2">
                <Slider
                  range
                  formatLabel={() => ``}
                  max={500}
                  min={0}
                  defaultValue={price}
                  onChange={(value) => handleFilterChange(value)}
                  id="slider"
                />
                <div className="price-range__info d-flex align-items-center mt-2">
                  <div className="me-auto">
                    <span className="text-secondary">{t("Min Price")}: </span>
                    <span className="price-range__max">
                      {price[0]}
                      {currency.symbol}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary">{t("Max Price")}: </span>
                    <span className="price-range__min">
                      {price[1]}
                      {currency.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="products-grid row row-cols-2 row-cols-md-3 row-cols-lg-4" id="products-grid">
          {filteredProducts.map((elm, i) => (
            <div key={i} className="product-card-wrapper">
              <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                <div className="pc__img-wrapper">
                  <Swiper
                    className="swiper swiper-container background-img js-swiper-slider"
                    slidesPerView={1}
                    modules={[Navigation]}
                    navigation={{
                      prevEl: `.prev${i}`,
                      nextEl: `.next${i}`,
                    }}
                  >
                    {elm?.images &&
                      JSON.parse(elm.images).map((image, ind) => (
                        <SwiperSlide key={ind} className="swiper-slide">
                          <Link
                            href={`/${locale}/shop/${removeSpecialCharacters(category).split(" ").join("-").toLowerCase()}/${isSubcategory(
                              category,
                              subcategory
                            )}/${removeSpecialCharacters(elm.product_name).split(" ").join("-").toLowerCase()}`}
                          >
                            <Image
                              loading="lazy"
                              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image}`}
                              width={330}
                              height={400}
                              alt={elm.product_name}
                              className="pc__img"
                            />
                          </Link>
                          {/* {elm.label_name && (
                            <div
                              style={{ backgroundColor: elm.label_color }}
                              className="product-label text-uppercase text-white top-0 left-auto right-0 mt-2 mx-2"
                            >
                              {elm.label_name}
                            </div>
                          )} */}
                          {Array.isArray(elm.labels) && elm.labels.length > 0 && (
                            <div
                              className="d-flex flex-column position-absolute top-0 end-0 mt-2 me-2"
                              style={{ gap: "4px" }}
                            >
                              {elm.labels.map((lbl, idx) => (
                                <LabelIcon
                                  key={idx}
                                  name={lbl.label_name}
                                  title={lbl.label_name}
                                  icon={lbl.label_color}
                                  size={50}
                                />
                              ))}
                            </div>
                          )}
                          
                          {/* Legacy single label */}
                          {!Array.isArray(elm.labels) && elm.label_name && (
                            <div className="position-absolute top-0 end-0 mt-2 me-2">
                              <LabelIcon
                                name={elm.label_name}
                                title={elm.label_name}
                                size={50}
                              />
                            </div>
                          )}
                          {elm.product_qty <= 0 ? (
                            <div
                              style={{ backgroundColor: "#dc3545" }}
                              className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2"
                            >
                              {t("Out Of Stock")}
                            </div>
                          ) : (
                            elm.discount && (
                              <div
                                style={{ backgroundColor: "#198754" }}
                                className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2 z-index-1"
                              >
                                {t("Sale")} {elm.discount.value}%
                              </div>
                            )
                          )}
                        </SwiperSlide>
                      ))}
                    <span className={`cursor-pointer pc__img-prev prev${i}`}>
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_prev_sm" />
                      </svg>
                    </span>
                    <span className={`cursor-pointer pc__img-next next${i}`}>
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_next_sm" />
                      </svg>
                    </span>
                  </Swiper>
                  {elm.product_qty > 0 && (
                    <button
                      className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                      onClick={() =>
                        !isAddedToCartProducts(elm.product_id) &&
                        addProductToCart({
                          ...elm,
                          category_name: category,
                          subcategory_name: subcategory?.subcategory_name || subcategory,
                        })
                      }
                      title={isAddedToCartProducts(elm.product_id) ? t("Already Added") : t("Add To Cart")}
                    >
                      {isAddedToCartProducts(elm.product_id) ? t("Already Added") : t("Add To Cart")}
                    </button>
                  )}
                </div>
                <div className="pc__info position-relative">
                  <p className="pc__category">{t(category)}</p>
                  <h6 className="pc__title">
                    <Link
                      href={`/${locale}/shop/${removeSpecialCharacters(category).split(" ").join("-").toLowerCase()}/${isSubcategory(
                        category,
                        subcategory
                      )}/${removeSpecialCharacters(elm.product_name).split(" ").join("-").toLowerCase()}`}
                    >
                      {t(he.decode(elm.product_name))}
                    </Link>
                  </h6>
                  <div className="product-card__price d-flex">{discPrice(elm)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && (
          <p className="mb-5 text-center fw-medium">
            {t("SHOWING")} {currentPage || filteredProducts.length} {t("of")} {totalPages || filteredProducts.length}{" "}
            {t("items")}
          </p>
        )}
        {loading && <Pagination1 />}
      </section>
    </>
  );
}