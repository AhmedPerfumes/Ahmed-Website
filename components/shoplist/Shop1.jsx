"use client";
import { products51 } from "@/data/products/fashion";
import { Swiper, SwiperSlide } from "swiper/react";
import Star from "../common/Star";
import ColorSelection from "../common/ColorSelection";
import { Navigation } from "swiper/modules";
import Pagination1 from "../common/Pagination1";
import { useEffect, useState } from "react";
import BreadCumb from "./BreadCumb";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
const itemPerRow = [2, 3, 4];
import Image from "next/image";
import { openModalShopFilter } from "@/utlis/aside";
import {
  menuCategories,
  sortingOptions,
} from "@/data/products/productCategories";
import he from 'he';

export default function Shop1({ search }) {
  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const [selectedColView, setSelectedColView] = useState(3);

  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  // const [currentCategory, setCurrentCategory] = useState(menuCategories[0]);
  // const [filtered, setFiltered] = useState(products51);
  // useEffect(() => {
  //   if (currentCategory == "All") {
  //     setFiltered(products51);
  //   } else {
  //     setFiltered(
  //       products51.filter((elm) => elm.filterCategory2 == currentCategory)
  //     );
  //   }
  // }, [currentCategory]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Pagination state
  const limit = 6; // Number of items per page
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const offset = 1500;
  const fetchData = async (page) => {
    setLoading(true);
    // console.log(`${process.env.NEXT_PUBLIC_API_URL}api/allProducts?page=${page}&limit=${limit}&search=${search?.split('-').join(' ')}`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/allProducts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: page,
        limit: limit,
        search: search ? search.split('-').join(' ') : '',
      }),
    });
    const newData = await response.json();
    const { data, total, to } = newData;
    if (data.length === 0) {
      setHasMore(false);
    }
    // console.log(...data);
    setProducts((prevData) => [...prevData, ...data]); // Append new data
    setTotalPages(total);
    setCurrentPage(to);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page, limit]); // Fetch data on page change

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + offset < document.documentElement.offsetHeight || loading || !hasMore) return;
      setPage((prevPage) => prevPage + 1); // Load next page
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]); // Clean up on component unmount

  function removeSpecialCharactersAndAmp(str) {
    // Remove the specific word "&amp;"
    let cleanedStr = str.replace(/&amp;/g, '');

    // Remove all special characters
    cleanedStr = cleanedStr.replace(/[^\w\s-]/g, '');

    // Replace multiple spaces with a single space and trim
    cleanedStr = cleanedStr.replace(/\s+/g, ' ').trim();

    return cleanedStr;
  }

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
                width="1759"
                height="420"
                alt="Pattern"
                className="slideshow-bg__img object-fit-cover"
              />
            </div>

            {/* <div className="shop-banner__content container position-absolute start-50 top-50 translate-middle">
              <h2 className="stroke-text h1 smooth-16 text-uppercase fw-bold mb-3 mb-xl-4 mb-xl-5">
                Shop
              </h2>
              <ul className="d-flex flex-wrap list-unstyled text-uppercase h6">
                {menuCategories.map((elm, i) => (
                  <li key={i} className="me-3 me-xl-4 pe-1">
                    <a
                      onClick={() => setCurrentCategory(elm)}
                      className={`menu-link menu-link_us-s ${
                        currentCategory == elm ? "menu-link_active" : ""
                      }`}
                    >
                      {elm}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}
            {/* <!-- /.shop-banner__content --> */}
          </div>
          {/* <!-- /.shop-banner position-relative --> */}
        </div>
        {/* <!-- /.full-width_border --> */}
      </section>
      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container">
        <div className="d-flex justify-content-between mb-4 pb-md-2">
          <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
            <BreadCumb category={null} subcategory={null}/>
          </div>

          <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
            <select
              className="shop-acs__select form-select w-auto border-0 py-0 order-1 order-md-0"
              aria-label="Sort Items"
              name="total-number"
            >
              {sortingOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0"></div>

            <div className="col-size align-items-center order-1 d-none d-lg-flex">
              <span className="text-uppercase fw-medium me-2">View</span>
              {itemPerRow.map((elm, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColView(elm)}
                  className={`btn-link fw-medium me-2 js-cols-size ${
                    selectedColView == elm ? "btn-link_active" : ""
                  } `}
                >
                  {elm}
                </button>
              ))}
            </div> */}
            {/* <!-- /.col-size --> */}

            <div className="shop-asc__seprator mx-3 bg-light d-none d-lg-block order-md-1"></div>

            <div className="shop-filter d-flex align-items-center order-0 order-md-3">
              <button
                className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                onClick={openModalShopFilter}
              >
                <svg
                  className="d-inline-block align-middle me-2"
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_filter" />
                </svg>
                <span className="text-uppercase fw-medium d-inline-block align-middle">
                  Filter
                </span>
              </button>
            </div>
            {/* <!-- /.col-size d-flex align-items-center ms-auto ms-md-3 --> */}
          </div>
          {/* <!-- /.shop-acs --> */}
        </div>
        {/* <!-- /.d-flex justify-content-between --> */}

        <div
          className={`products-grid row row-cols-2 row-cols-md-3 row-cols-lg-${selectedColView}`}
          id="products-grid"
        >
          {products?.map((elm, i) => (
            <div key={i} className="product-card-wrapper">
              <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                <div className="pc__img-wrapper">
                  <Swiper
                    className="swiper swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden background-img js-swiper-slider"
                    slidesPerView={1}
                    modules={[Navigation]}
                    navigation={{
                      prevEl: ".prev" + i,
                      nextEl: ".next" + i,
                    }}
                  >
                    {elm?.images && JSON.parse(elm.images).map((image, ind) => (
                      <SwiperSlide key={ind} className="swiper-slide">
                        <Link href={`/shop/${removeSpecialCharactersAndAmp(elm.category_name).split(' ').join('-').toLowerCase()}/${elm.subcategory && removeSpecialCharactersAndAmp(elm.subcategory.subcategory_name).split(" ").join('-').toLowerCase()}/${removeSpecialCharactersAndAmp(elm.product_name).split(' ').join('-').toLowerCase()}`}>
                          <Image
                            loading="lazy"
                            src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image}`}
                            width="330"
                            height="400"
                            alt="Cropped Faux leather Jacket"
                            className="pc__img"
                          />
                        </Link>
                        {elm?.label_name && (
                          <div style={{ backgroundColor: elm.label_color }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2">
                            { elm?.label_name }
                          </div>
                        )}
                        {elm.product_qty <= 0 && (
                          <div style={{ backgroundColor: '#dc3545' }} className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2">
                            Out Of Stock
                          </div>
                        )}
                      </SwiperSlide>
                    ))}

                    <span
                      className={`cursor-pointer pc__img-prev ${"prev" + i} `}
                    >
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_prev_sm" />
                      </svg>
                    </span>
                    <span
                      className={`cursor-pointer pc__img-next ${"next" + i} `}
                    >
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
                  {
                    isAddedToCartProducts(elm?.product_id) ? 
                    elm.product_qty > 0 && <button
                        className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                        title="Already Added"
                      >
                      Already Added
                    </button> : elm.product_qty > 0 && <button
                      className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                      onClick={() => addProductToCart(elm)}
                      title="Add to Cart"
                    >
                      Add To Cart
                    </button>
                  }
                  {/* {elm.product_qty > 0 && <button
                    className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                    onClick={() => addProductToCart(elm)}
                    title={
                      isAddedToCartProducts(elm.product_id)
                        ? "Already Added"
                        : "Add to Cart"
                    }
                  >
                    {isAddedToCartProducts(elm.product_id)
                      ? "Already Added"
                      : "Add To Cart"}
                  </button>} */}
                </div>

                <div className="pc__info position-relative">
                  <p className="pc__category">{elm.category_name}</p>
                  <h6 className="pc__title">
                    <Link href={`/shop/${removeSpecialCharactersAndAmp(elm.category_name).split(' ').join('-').toLowerCase()}/${elm.subcategory && removeSpecialCharactersAndAmp(elm.subcategory.subcategory_name).split(" ").join('-').toLowerCase()}/${removeSpecialCharactersAndAmp(elm.product_name).split(' ').join('-').toLowerCase()}`}>{elm?.product_name && he.decode(elm?.product_name)}</Link>
                  </h6>
                  <div className="product-card__price d-flex">
                    {/* {elm.price ? (
                      <>
                        {" "}
                        <span className="money price price-old">
                          ${elm.price}
                        </span>
                        <span className="money price price-sale">
                          ${elm.price}
                        </span>
                      </>
                    ) : ( */}
                      <span className="money price">{elm.price}د.إ</span>
                    {/* )} */}
                  </div>
                  {/* {elm.colors && (
                    <div className="d-flex align-items-center mt-1">
                      {" "}
                      <ColorSelection />{" "}
                    </div>
                  )}
                  {elm.reviews && (
                    <div className="product-card__review d-flex align-items-center">
                      <div className="reviews-group d-flex">
                        <Star stars={elm.rating} />
                      </div>
                      <span className="reviews-note text-lowercase text-secondary ms-1">
                        {elm.reviews}
                      </span>
                    </div>
                  )} */}

                  {/* <button
                    className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                      isAddedtoWishlist(elm.product_id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(elm.product_id)}
                    title="Add To Wishlist"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_heart" />
                    </svg>
                  </button> */}
                </div>
                {elm.discont && (
                  <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                    <div className="pc-labels__right ms-auto">
                      <span className="pc-label pc-label_sale d-block text-white">
                        -{elm.discont}%
                      </span>
                    </div>
                  </div>
                )}
                {elm.isNew && (
                  <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                    <div className="pc-labels__left">
                      <span className="pc-label pc-label_new d-block bg-white">
                        NEW
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* <!-- /.products-grid row --> */}
        {/* {loading && <p>Loading...</p>} */}
        {!loading && <p className="mb-5 text-center fw-medium">SHOWING {currentPage} {currentPage? 'of': ''} {totalPages} items</p>}
        {loading && <Pagination1 />}

        {/* <div className="text-center">
          <Link className="btn-link btn-link_lg text-uppercase fw-medium" href="#">
            Show More
          </Link>
        </div> */}
      </section>
    </>
  );
}
