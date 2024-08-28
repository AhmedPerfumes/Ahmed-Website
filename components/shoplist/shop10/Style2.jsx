"use client";

import { products54 } from "@/data/products/fashion";
import React from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

export default function Style2() {
  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { setQuickViewItem } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  return (
    <div
      className="products-grid row row-cols-2 row-cols-md-3 row-cols-lg-3"
      id="products-grid-2"
    >
      {products54.map((elm, i) => (
        <div key={i} className="product-card-wrapper">
          <div className="product-card mb-3 mb-md-4 mb-xxl-5">
            <div className={i != 1 ? "pc__img-wrapper" : ""}>
              {
                i != 1 ? (
                  <Swiper
                    slidesPerView={1}
                    className="swiper-container background-img js-swiper-slider"
                    modules={[Navigation]}
                    id={`style-2${elm.id.toString()}`}
                    navigation={{
                      prevEl: `#style-2${elm.id.toString()} .pc__img-prev`,
                      nextEl: `#style-2${elm.id.toString()} .pc__img-next`,
                    }}
                  >
                    <SwiperSlide className="swiper-slide">
                      <Link href={`/product16_v11/${elm.id}`}>
                        <Image
                          loading="lazy"
                          src={elm.imgSrc}
                          width="330"
                          height="400"
                          alt="Cropped Faux leather Jacket"
                          className="pc__img"
                        />
                      </Link>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                      <Link href={`/product1_simple/${elm.id}`}>
                        <Image
                          loading="lazy"
                          src={elm.imgSrc2}
                          width="330"
                          height="400"
                          alt="Cropped Faux leather Jacket"
                          className="pc__img"
                        />
                      </Link>
                    </SwiperSlide>
                    {i != 1 ? (
                      <>
                        <span className="cursor-pointer pc__img-prev">
                          <svg
                            width="7"
                            height="11"
                            viewBox="0 0 7 11"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <use href="#icon_prev_sm" />
                          </svg>
                        </span>
                        <span className="cursor-pointer pc__img-next">
                          <svg
                            width="7"
                            height="11"
                            viewBox="0 0 7 11"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <use href="#icon_next_sm" />
                          </svg>
                        </span>
                      </>
                    ) : null}
                  </Swiper>
                ) : (
                  // <div className="">
                  // <div className="">
                  <>
                    <Link href="/product16_v11/1">
                      <Image
                        loading="lazy"
                        src="/assets/images/home/demo7/laathani-web.jpg"
                        width="500"
                        height="0"
                        layout="intrinsic"
                        className=""
                        alt="image"
                      />
                    </Link>
                    <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                      <h2 className="fs-40 fw-normal text-uppercase mb-0 text-white">
                        Laathani
                      </h2>
                      <p className="mb-4 text-white">Exclusive Launch</p>
                      <a
                        className="btn btn-outline-primary border-0 fs-base text-uppercase fw-medium btn-55 d-inline-flex align-items-center"
                        href="/product16_v11/1"
                      >
                        <span>Explore</span>
                      </a>
                    </div>
                  </>
                )
                // </div>
                // </div>
              }
              {i != 1 ? (
                <div className="anim_appear-bottom position-absolute bottom-0 start-0 w-100 d-none d-sm-flex align-items-center">
                  <button
                    className="btn btn-primary flex-grow-1 fs-base ps-3 ps-xxl-4 pe-0 border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                    onClick={() => addProductToCart(elm.id)}
                    title={
                      isAddedToCartProducts(elm.id)
                        ? "Already Added"
                        : "Add to Cart"
                    }
                  >
                    {isAddedToCartProducts(elm.id)
                      ? "Already Added"
                      : "Add To Cart"}
                  </button>
                  <button
                    className="btn btn-primary flex-grow-1 fs-base ps-0 pe-3 pe-xxl-4 border-0 text-uppercase fw-medium js-quick-view"
                    data-bs-toggle="modal"
                    data-bs-target="#quickView"
                    title="Quick view"
                    onClick={() => setQuickViewItem(elm)}
                  >
                    Quick View
                  </button>
                </div>
              ) : null}
              {i != 1 ? (
                <button
                  className={`pc__btn-wl position-absolute bg-body rounded-circle border-0 text-primary js-add-wishlist ${
                    isAddedtoWishlist(elm.id) ? "active" : ""
                  }`}
                  onClick={() => toggleWishlist(elm.id)}
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
                </button>
              ) : null}
            </div>
            {i != 1 ? (
              <div className="pc__info position-relative">
                <p className="pc__category text-beige">{elm.category}</p>
                <h6 className="pc__title">
                  <Link href={`/product1_simple/${elm.id}`}>{elm.title}</Link>
                </h6>
                <div className="product-card__price d-flex">
                  <span className="money price">${elm.price}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
