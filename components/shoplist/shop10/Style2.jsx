"use client";

import { products54 } from "@/data/products/fashion";
import React from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import he from "he";
import { useLocale, useTranslations } from "next-intl";
import { useMenu } from "@/context/MenuContext";
import LabelIcon from "@/components/labels/LabelIcon";

import { renderPrice } from "@/utlis/priceRenderer";

export default function Style2({ category, subcategory, products }) {
  const { isLoading: isMenuLoading, error: isMenuError, currency } = useMenu();
  const locale = useLocale();
  const t = useTranslations();
  const indexToSwap = 1;

  console.log("products",products);
  

  for (let index = 0; index < products.length; index++) {
    if (products[index] && products[index].collection_name === "New Launch") {
      if (index !== indexToSwap) {
        const temp = products[indexToSwap];
        products[indexToSwap] = products[index];
        products[index] = temp;
      }
      break;
    }
  }

  function capitalizeEachWord(str) {
    return str
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  }

  function removeSpecialCharactersAndAmp(str) {
    let cleanedStr = str?.replace(/&amp;/g, "");
    cleanedStr = cleanedStr?.replace(/[^\w\s-]/g, "");
    cleanedStr = cleanedStr?.replace(/\s+/g, " ").trim();
    return cleanedStr;
  }

  let subcat = "";
  if (subcategory != null) {
    subcat = removeSpecialCharactersAndAmp(subcategory)
      .split(" ")
      .join("-")
      .toLowerCase();
  } else {
    if (removeSpecialCharactersAndAmp(category) == "gift-sets") {
      subcat = "gift-sets";
    } else if (removeSpecialCharactersAndAmp(category) == "hair-mist") {
      subcat = "hair-mist";
    } else if (removeSpecialCharactersAndAmp(category) == "extrait-de-parfum") {
      subcat = "extrait-de-parfum";
    } else {
      subcat = "online-exclusive";
    }
  }

  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { addProductToQuickView } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  // const price = (elm) => {
  //   const currentUTC = new Date(); // Current UTC time
  //   const currentGST = new Date(currentUTC.getTime() + (4 * 60 * 60 * 1000)); // Add 4 hours for GST
  //   const current_date_time = currentGST.toISOString().slice(0, 19).replace("T", " ");
  //   if(elm?.discount) {
  //     if(new Date(current_date_time) >= new Date(elm.discount.start_date) && new Date(current_date_time) <= new Date(elm.discount.end_date)) {
  //       if(elm.discount.discount_type == "percent") {
  //         return <><span className="money price price-old">{elm?.price}{ currency.symbol }</span> <span className="money price price-sale"> {(elm.price - (elm.price / 100 * elm.discount.value)).toFixed(2)}{ currency.symbol }</span></>;
  //       } else if(elm.discount.discount_type == "amount") {
  //         return <><span className="money price price-old">{elm?.price}{ currency.symbol }</span> <span className="money price price-sale"> {(elm.price - elm.discount.value).toFixed(2)}{ currency.symbol }</span></>;
  //       }
  //     } else {
  //       return <span className="money price">{elm?.price}{ currency.symbol }</span>;
  //     }
  //   }
  //   // else if(elm?.sale_price) {
  //   //   return <><span className="money price price-old">{elm?.price}{ currency.symbol }</span> <span className="money price price-sale"> {((elm.sale_price)).toFixed(2)}{ currency.symbol }</span></>;
  //   // }
  //   else {
  //     return <span className="money price">{elm?.price}{ currency.symbol }</span>;
  //   }
  // };

  return (
    <div
      className="products-grid row row-cols-2 row-cols-md-3 row-cols-lg-3"
      id="products-grid-2"
    >
      {products.map((elm, i) => (
        <div key={i} className="product-card-wrapper">
          <div className="product-card mb-3 mb-md-4 mb-xxl-5">
            <div className={i != 1 ? "pc__img-wrapper" : ""}>
              {i != 1 ? (
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
                  <SwiperSlide key={i} className="swiper-slide">
                    <Link
                      href={`/${locale}/shop/${removeSpecialCharactersAndAmp(
                        category
                      )}/${subcat}/${removeSpecialCharactersAndAmp(
                        elm?.product_name
                      )
                        .split(" ")
                        .join("-")
                        .toLowerCase()}`}
                    >
                      {elm?.images && (
                        <>
                          {JSON.parse(elm.images)[0] && (
                            <Image
                              loading="lazy"
                              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${
                                JSON.parse(elm.images)[0]
                              }`}
                              width="500"
                              height="500"
                              alt="img"
                              className="pc__img"
                            />
                          )}
                          {JSON.parse(elm.images)[1] && (
                            <Image
                              loading="lazy"
                              src={`${process.env.NEXT_PUBLIC_API_URL}storage/${
                                JSON.parse(elm.images)[1]
                              }`}
                              width="500"
                              height="500"
                              alt="img"
                              className="pc__img pc__img-second"
                            />
                          )}
                        </>
                      )}
                    </Link>

                    {/* ✅ Labels */}
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
                      elm.discount && elm. discount.discount_type == 'percent' && (
                        <div
                          style={{ backgroundColor: "#198754" }}
                          className="product-label text-uppercase text-white top-0 left-0 mt-2 mx-2"
                        >
                          Sale {elm.discount.value}%
                        </div>
                      )
                    )}

                    {/* ✅ Mobile + desktop Add to Cart button (like Shop1) */}
                    {elm.product_qty > 0 &&
                      (isAddedToCartProducts(elm.product_id) ? (
                        <button
                          className="pc__atc btn btn-secondary text-white anim_appear-bottom position-absolute border-0 text-uppercase fw-medium"
                          onClick={() =>
                            addProductToCart(
                              {
                                ...elm,
                                category_name: capitalizeEachWord(
                                  category.split("-").join(" ")
                                ),
                                subcategory_name: capitalizeEachWord(
                                  subcat.split("-").join(" ")
                                ),
                              },
                              true // increase qty
                            )
                          }
                        >
                          {t("Add More")}
                        </button>
                      ) : (
                        <button
                          className="pc__atc btn btn-primary anim_appear-bottom position-absolute border-0 text-uppercase fw-medium"
                          onClick={() =>
                            addProductToCart({
                              ...elm,
                              category_name: capitalizeEachWord(
                                category.split("-").join(" ")
                              ),
                              subcategory_name: capitalizeEachWord(
                                subcat.split("-").join(" ")
                              ),
                            })
                          }
                        >
                          {t("Add To Cart")}
                        </button>
                      ))}
                  </SwiperSlide>

                  <span className="cursor-pointer pc__img-prev">
                    <svg width="7" height="11" viewBox="0 0 7 11">
                      <use href="#icon_prev_sm" />
                    </svg>
                  </span>
                  <span className="cursor-pointer pc__img-next">
                    <svg width="7" height="11" viewBox="0 0 7 11">
                      <use href="#icon_next_sm" />
                    </svg>
                  </span>
                </Swiper>
              ) : (
                // Hero product
                <>
                  <Link
                    href={`/${locale}/shop/${removeSpecialCharactersAndAmp(
                      category
                    )}/${subcat}/${removeSpecialCharactersAndAmp(
                      elm.permalink?.key
                    )?.toLowerCase()}`}
                  >
                    <Image
                      loading="lazy"
                      src={`${process.env.NEXT_PUBLIC_API_URL}storage/${elm.image}`}
                      width="500"
                      height="0"
                      layout="intrinsic"
                      alt="image"
                    />
                  </Link>
                  <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                    <h2 className="fs-30 fw-normal text-uppercase mb-0 text-white cat-title">
                      {elm?.product_name && he.decode(elm?.product_name)}
                    </h2>
                    <p className="mb-4 text-white">{t("Exclusive Launch")}</p>
                    <Link
                      className="btn btn-outline-primary rounded-pill border-0 fs-base text-uppercase fw-medium btn-45 d-inline-flex align-items-center"
                      href={`/${locale}/shop/${removeSpecialCharactersAndAmp(
                        category
                      )}/${subcat}/${removeSpecialCharactersAndAmp(
                        elm.permalink?.key
                      )?.toLowerCase()}`}
                    >
                      <span>Explore</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            {i != 1 && (
              <div className="pc__info position-relative">
                <h6 className="pc__title">
                  <Link
                    href={`/${locale}/shop/${removeSpecialCharactersAndAmp(
                      category
                    )}/${subcat}/${removeSpecialCharactersAndAmp(
                      elm?.product_name
                    )
                      ?.split(" ")
                      .join("-")
                      .toLowerCase()}`}
                  
                  >
                    {
                      locale == 'ar' ? elm?.product_name_ar : elm?.product_name
                    }
                    {/* {elm?.product_name && t(he.decode(elm?.product_name))} */}
                  </Link>
                </h6>
                <div className="product-card__price d-flex">
                  {/* { price(elm) } */}
                  { renderPrice(elm, currency) }
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
