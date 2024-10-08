"use client";
import { useContextElement } from "@/context/Context";
import { products51 } from "@/data/products/fashion";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import he from 'he';

export default function RelatedSlider({ relatedProds }) {
  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { setQuickViewItem } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const swiperOptions = {
    autoplay: false,
    slidesPerView: 4,
    slidesPerGroup: 4,
    effect: "none",
    loop: true,
    modules: [Pagination, Navigation],
    pagination: {
      el: "#related_products .products-pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: {
      nextEl: ".ssn11",
      prevEl: ".ssp11",
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 30,
      },
    },
  };

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
    <section className="products-carousel container">
      <h2 className="h3 text-uppercase mb-4 pb-xl-2 mb-xl-4">
        Related <strong>Products</strong>
      </h2>

      <div id="related_products" className="position-relative">
        <Swiper
          {...swiperOptions}
          className="swiper-container js-swiper-slider"
          data-settings=""
        >
          {relatedProds && relatedProds.map((elm, i) => (
            <SwiperSlide key={i} className="swiper-slide product-card">
              <div className="pc__img-wrapper">
                <Link href={`/shop/${removeSpecialCharactersAndAmp(elm.category_name).split(' ').join('-').toLowerCase()}/${elm.subcategory && removeSpecialCharactersAndAmp(elm.subcategory.subcategory_name).split(" ").join('-').toLowerCase()}/${removeSpecialCharactersAndAmp(elm.product_name).split(' ').join('-').toLowerCase()}`}>
                  {elm?.images && JSON.parse(elm.images).map((image, ind) => (
                      <Image
                        loading="lazy"
                        src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image}`}
                        width="330"
                        height="400"
                        alt="Cropped Faux leather Jacket"
                        className="pc__img"
                      />
                    ))}
                    {/* <Image
                      loading="lazy"
                      src="/assets/images/products/product_1-1.jpg"
                      width="330"
                      height="400"
                      alt="Cropped Faux leather Jacket"
                      className="pc__img pc__img-second"
                    /> */}
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
              </div>

              <div className="pc__info position-relative">
                <p className="pc__category">{elm.category_name}</p>
                <h6 className="pc__title">
                  <Link href={`/shop/${removeSpecialCharactersAndAmp(elm.category_name).split(' ').join('-').toLowerCase()}/${elm.subcategory && removeSpecialCharactersAndAmp(elm.subcategory.subcategory_name).split(" ").join('-').toLowerCase()}/${removeSpecialCharactersAndAmp(elm.product_name).split(' ').join('-').toLowerCase()}`}>{elm?.product_name && he.decode(elm?.product_name)}</Link>
                </h6>
                <div className="product-card__price d-flex">
                  <span className="money price">{elm.price}د.إ</span>
                </div>

                {/* <button
                  className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                    isAddedtoWishlist(elm.product_id) ? "active" : ""
                  }`}
                  title="Add To Wishlist"
                  onClick={() => toggleWishlist(elm.product_id)}
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
            </SwiperSlide>
          ))}

          {/* <!-- /.swiper-wrapper --> */}
        </Swiper>
        {/* <!-- /.swiper-container js-swiper-slider --> */}

        <div className="cursor-pointer products-carousel__prev ssp11 position-absolute top-50 d-flex align-items-center justify-content-center">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_prev_md" />
          </svg>
        </div>
        {/* <!-- /.products-carousel__prev --> */}
        <div className="cursor-pointer products-carousel__next ssn11 position-absolute top-50 d-flex align-items-center justify-content-center">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_next_md" />
          </svg>
        </div>
        {/* <!-- /.products-carousel__next --> */}

        <div className="products-pagination mt-4 mb-5 d-flex align-items-center justify-content-center"></div>
        {/* <!-- /.products-pagination --> */}
      </div>
      {/* <!-- /.position-relative --> */}
    </section>
  );
}
