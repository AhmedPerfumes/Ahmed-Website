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
import { products51 } from "@/data/products/fashion";
import { useState } from "react";

import { Navigation } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import Link from "next/link";
import Star from "@/components/common/Star";
import { useContextElement } from "@/context/Context";
import ColorSelection from "@/components/common/ColorSelection";
const itemPerRow = [2, 3, 4];
import Image from "next/image";
import { openModalShopFilter } from "@/utlis/aside";
import { sortingOptions } from "@/data/products/productCategories";

import { useSearchParams } from "next/navigation";

export default function Shop10() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { setQuickViewItem } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const [selectedColView, setSelectedColView] = useState(3);
  return (
    <section className="shop-main container">
      <div className="d-flex justify-content-between mb-4 pb-md-2 border-bottom border-dark">
        <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
          <BreadCumb />
        </div>
        {/* <!-- /.breadcrumb --> */}

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

          <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0"></div>

          {/* <div className="col-size align-items-center order-1 d-none d-lg-flex">
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

          {/* <div className="shop-asc__seprator mx-3 bg-light d-none d-lg-block order-md-1"></div> */}

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

      <div className="products-grid">
        <div className="mb-4 mb-xl-5"></div>

        <h2 className="section-title fw-normal mb-3 pb-2 text-center">
          {subcategory == null ? "Oriental Fragrance" : ""}
        </h2>
        <Style2 />
        {subcategory == null ? (
          <>
            <div className="border-bottom"></div>

            <div className="mb-4 mb-xl-5"></div>

            <h2 className="section-title fw-normal mb-3 pb-2 text-center">
              Occidental Fragrance
            </h2>
            <Style2 />
            <div className="border-bottom"></div>

            <div className="mb-4 mb-xl-5"></div>

            <h2 className="section-title fw-normal mb-3 pb-2 text-center">
              Women Fragrances
            </h2>
            <Style2 />
            <div className="border-bottom"></div>

            <div className="mb-4 mb-xl-5"></div>

            <h2 className="section-title fw-normal mb-3 pb-2 text-center">
              Men Fragrances
            </h2>
            <Style2 />
            <div className="border-bottom"></div>

            <div className="mb-4 mb-xl-5"></div>

            <h2 className="section-title fw-normal mb-3 pb-2 text-center">
              Unisex Fragrance
            </h2>
            <Style2 />
          </>
        ) : null}

        {/* <div className="mb-4 mb-xl-5"></div>

        <h2 className="section-title fw-normal mb-3 pb-2">Women Fragrances</h2>
        <Style3 />

        <div className="mb-4 mb-xl-5"></div>

        <h2 className="section-title fw-normal mb-3 pb-2">Men Fragrances</h2>
        <Style4 />

        <div className="mb-4 mb-xl-5"></div> */}

        {/* <h2 className="section-title fw-normal mb-3 pb-2">Oriental Fragrances</h2>
        <Style5 />

        <div className="mb-4 mb-xl-5"></div> */}

        {/* <h2 className="section-title fw-normal mb-3 pb-2">List Style v6</h2>
        <Style6 />

        <div className="mb-4 mb-xl-5"></div>

        <h2 className="section-title fw-normal mb-3 pb-2">List Style v7</h2>
        <Style7 />

        <div className="mb-4 mb-xl-5"></div>

        <h2 className="section-title fw-normal mb-3 pb-2">List Style v8</h2>
        <Style8 />

        <div className="mb-4 mb-xl-5"></div>

        <h2 className="section-title fw-normal mb-3 pb-2">List Style v9</h2>
        <Style9 />

        <h2 className="section-title fw-normal mb-3 pb-2">List Style v10</h2>
        <Style10 /> */}
      </div>
    </section>
  );
}
