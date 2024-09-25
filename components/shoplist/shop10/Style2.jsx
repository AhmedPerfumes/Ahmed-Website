"use client";

import { products54 } from "@/data/products/fashion";
import React from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import he from 'he';

export default function Style2({ category, subcategory, products }) {

  const indexToSwap = 1;
  let objectFound = false;

  for (let index = 0; index < products.length; index++) {
    if (products[index] && products[index].collection_name === 'New Launch') {
        // Swap only if the condition is met and not the same index
        if (index !== indexToSwap) {
            // Perform the swap
            const temp = products[indexToSwap];
            products[indexToSwap] = products[index];
            products[index] = temp;
            objectFound = true;
        }
        break; // Stop the loop after the swap
    }
}
  
// console.log(products);

  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { addProductToQuickView } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  return (
    <div
      className="products-grid row row-cols-2 row-cols-md-3 row-cols-lg-3"
      id="products-grid-2"
    >
      {products.map((elm, i) => (
        <div key={i} className="product-card-wrapper">
          <div className="product-card mb-3 mb-md-4 mb-xxl-5">
            <div className={i != 1 ? "pc__img-wrapper" : ""}>
              {
                i != 1 ? (
                  <Swiper
                    slidesPerView={1}
                    className="swiper-container background-img js-swiper-slider"
                    modules={[Navigation]}
                    id={`style-2${elm?.product_id.toString()}`}
                    navigation={{
                      prevEl: `#style-2${elm?.product_id.toString()} .pc__img-prev`,
                      nextEl: `#style-2${elm?.product_id.toString()} .pc__img-next`,
                    }}
                  >
                    {elm?.images && JSON.parse(elm.images).map((image, ind) => (
                      <SwiperSlide key={ind} className="swiper-slide">
                        <Link href={`/shop/${category}/${subcategory?.split(" ").join('-').toLowerCase()}/${elm.product_name.split(' ').join('-').toLowerCase()}`}>
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
                  <>
                    <Link href={`/shop/${category}/${subcategory?.split(" ").join('-').toLowerCase()}/${elm.product_name.split(' ').join('-').toLowerCase()}`}>
                      <Image
                        loading="lazy"
                        src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                        width="500"
                        height="0"
                        layout="intrinsic"
                        className=""
                        alt="image"
                      />
                    </Link>
                    <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                      <h2 className="fs-40 fw-normal text-uppercase mb-0 text-white">
                        { elm.product_name }
                      </h2>
                      <p className="mb-4 text-white">Exclusive Launch</p>
                      <a
                        className="btn btn-outline-primary border-0 fs-base text-uppercase fw-medium btn-55 d-inline-flex align-items-center"
                        href={`/product16_v11/${elm.product_id}`}
                      >
                        <span>Explore</span>
                      </a>
                    </div>
                  </>
                )
              }
              {i != 1 ? (
                <div className="anim_appear-bottom position-absolute bottom-0 start-0 w-100 d-none d-sm-flex align-items-center">
                  {
                    isAddedToCartProducts(elm?.product_id) ? 
                    elm.product_qty > 0 && <button
                        className="btn btn-primary flex-grow-1 fs-base ps-3 ps-xxl-4 pe-0 border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                        title="Already Added"
                      >
                      Already Added
                    </button> : elm.product_qty > 0 && <button
                      className="btn btn-primary flex-grow-1 fs-base ps-3 ps-xxl-4 pe-0 border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                      onClick={() => addProductToCart(elm)}
                      title="Add to Cart"
                    >
                      Add To Cart
                    </button>
                  }
                  <button
                    className="btn btn-primary flex-grow-1 fs-base ps-0 pe-3 pe-xxl-4 border-0 text-uppercase fw-medium js-quick-view"
                    data-bs-toggle="modal"
                    data-bs-target="#quickView"
                    title="Quick view"
                    onClick={() => addProductToQuickView(elm)}
                  >
                    Quick View
                  </button>
                </div>
              ) : null}
              {/* {i != 1 ? (
                <button
                  className={`pc__btn-wl position-absolute bg-body rounded-circle border-0 text-primary js-add-wishlist ${
                    isAddedtoWishlist(elm.product_id) ? "active" : ""
                  }`}
                  onClick={() => toggleWishlist(elm)}
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
              ) : null} */}
            </div>
            {i != 1 ? (
              <div className="pc__info position-relative">
                {/* <p className="pc__category text-beige">{elm.category}</p> */}
                <h6 className="pc__title">
                  <Link href={`/shop/${category}/${subcategory?.split(" ").join('-').toLowerCase()}/${elm?.product_name.split(' ').join('-').toLowerCase()}`}>{elm?.product_name && he.decode(elm?.product_name)}</Link>
                </h6>
                <div className="product-card__price d-flex">
                  <span className="money price">{elm?.price}د.إ</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
