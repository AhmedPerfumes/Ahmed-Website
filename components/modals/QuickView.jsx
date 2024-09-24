"use client";
import { useContextElement } from "@/context/Context";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Size from "../singleProduct/Size";
import Colors from "../singleProduct/Colors";
import Image from "next/image";
import ShareComponent from "../common/ShareComponent";
import { useState } from "react";
import he from 'he';

export default function QuickView() {
  const { quickViewItem } = useContextElement();
  const { isAddedToCartProducts } = useContextElement();
  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const swiperOptions = {
    slidesPerView: 1,
    slidesPerGroup: 1,
    effect: "none",
    modules: [Navigation],
    loop: false,
    navigation: {
      nextEl:
        ".modal-dialog.quick-view .product-single__media .swiper-button-next",
      prevEl:
        ".modal-dialog.quick-view .product-single__media .swiper-button-prev",
    },
  };
  const swiperSlideItems = [
    // quickViewItem.image ? `${process.env.NEXT_PUBLIC_API_URL}storage/${quickViewItem.image}` : `${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(quickViewItem.images)[0]}`,
    // quickViewItem.image ? `${process.env.NEXT_PUBLIC_API_URL}storage/${quickViewItem.image}` : `${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(quickViewItem.images)[0]}`,
    // quickViewItem.image ? `${process.env.NEXT_PUBLIC_API_URL}storage/${quickViewItem.image}` : `${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(quickViewItem.images)[0]}`,
    // quickViewItem.image ? `${process.env.NEXT_PUBLIC_API_URL}storage/${quickViewItem.image}` : `${process.env.NEXT_PUBLIC_API_URL}storage/${JSON.parse(quickViewItem.images)[0]}`,
  ];
  const { cartProducts, setCartProducts } = useContextElement();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const isIncludeCard = () => {
    const item = cartProducts.filter((elm) => elm.product_id == quickViewItem.product_id)[0];
    return item;
  };
  const setQuantityCartItem = (id, quantity) => {
    if (isIncludeCard()) {
      if (quantity >= 1 && quantity <= quickViewItem.product_qty) {
        setError(null);
        const item = cartProducts.filter((elm) => elm.product_id == id)[0];
        const items = [...cartProducts];
        const itemIndex = items.indexOf(item);
        item.quantity = quantity;
        items[itemIndex] = item;
        setCartProducts(items);
      } else {
        setError("Quantity is more than available quantity");
      }
    } else {
      setQuantity((quantity <= quickViewItem.product_qty && quantity >= 1) ? quantity : quickViewItem.product_qty);
      setError(null);
      if(quantity > quickViewItem.product_qty) {
        setError("Quantity is more than available quantity");
      } else {
        setError(null);
      }
    }
  };
  const addToCart = () => {
    if (!isIncludeCard()) {
      const item = quickViewItem;
      item.quantity = quantity;
      setCartProducts((pre) => [...pre, item]);
    }
  };
  return (
    <div className="modal fade" id="quickView" tabIndex="-1">
      <div className="modal-dialog quick-view modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div className="product-single">
            <div className="product-single__media m-0">
              <div className="product-single__image position-relative w-100">
                <Swiper
                  {...swiperOptions}
                  className="swiper-container js-swiper-slider"
                >
                  {JSON.parse(quickViewItem.images).map((image, i) => (
                    <SwiperSlide
                      key={i}
                      className="swiper-slide product-single__image-item"
                    >
                      <Image
                        loading="lazy"
                        width={500}
                        height={700}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        src={`${process.env.NEXT_PUBLIC_API_URL}storage/${image}`}
                        alt="image"
                      />
                    </SwiperSlide>
                  ))}

                  <div className="cursor-pointer swiper-button-prev">
                    <svg
                      width="7"
                      height="11"
                      viewBox="0 0 7 11"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_prev_sm" />
                    </svg>
                  </div>
                  <div className="cursor-pointer swiper-button-next">
                    <svg
                      width="7"
                      height="11"
                      viewBox="0 0 7 11"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_next_sm" />
                    </svg>
                  </div>
                </Swiper>
              </div>
            </div>
            <div className="product-single__detail">
              <h1 className="product-single__name">{he.decode(quickViewItem.product_name)}</h1>
              <div className="product-single__price">
                <span className="current-price">{quickViewItem.price}د.إ</span>
              </div>
              <div className="product-single__short-desc">
                <div dangerouslySetInnerHTML={{ __html: quickViewItem.description }}>
                </div>
              </div>
              <h6 style={{ color: "red" }}>{error && error}</h6>
              <form onSubmit={(e) => e.preventDefault()}>
                {/* <div className="product-single__swatches">
                  <div className="product-swatch text-swatches">
                    <label>Sizes</label>
                    <div className="swatch-list">
                      <Size />
                    </div>
                    <a
                      href="#"
                      className="sizeguide-link"
                      data-bs-toggle="modal"
                      data-bs-target="#sizeGuide"
                    >
                      Size Guide
                    </a>
                  </div>
                  <div className="product-swatch color-swatches">
                    <label>Color</label>
                    <div className="swatch-list">
                      <Colors />
                    </div>
                  </div>
                </div> */}
                {quickViewItem.product_qty > 0 &&
                <div className="product-single__addtocart">
                  <div className="qty-control position-relative">
                    <input
                      type="number"
                      name="quantity"
                      value={
                        isIncludeCard() ? isIncludeCard().quantity : quantity
                      }
                      readOnly
                      min="1"
                      onChange={(e) =>
                        setQuantityCartItem(quickViewItem.product_id, e.target.value)
                      }
                      className="qty-control__number text-center"
                    />
                    <div
                      onClick={() =>
                        setQuantityCartItem(
                          quickViewItem.product_id,
                          isIncludeCard()?.quantity - 1 || quantity - 1
                        )
                      }
                      className="qty-control__reduce"
                    >
                      -
                    </div>
                    <div
                      onClick={() =>
                        setQuantityCartItem(
                          quickViewItem.product_id,
                          isIncludeCard()?.quantity + 1 || quantity + 1
                        )
                      }
                      className="qty-control__increase"
                    >
                      +
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart()}
                    className="btn btn-primary btn-addtocart js-open-aside"
                  >
                    {isAddedToCartProducts(quickViewItem.product_id)
                      ? "Already Added"
                      : "Add To Cart"}
                  </button>
                </div>
                }
              </form>
              <div className="product-single__addtolinks">
                {/* <a
                  href="#"
                  className={`menu-link menu-link_us-s add-to-wishlist  ${
                    isAddedtoWishlist(quickViewItem.product_id) ? "active" : ""
                  }`}
                  onClick={() => toggleWishlist(quickViewItem.product_id)}
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
                  <span>Add to Wishlist</span>
                </a> */}
                <ShareComponent title={he.decode(quickViewItem.product_name)} />
              </div>
              {/* <div className="product-single__meta-info mb-0">
                <div className="meta-item">
                  <label>SKU:</label>
                  <span>N/A</span>
                </div>
                <div className="meta-item">
                  <label>Categories:</label>
                  <span>Casual & Urban Wear, Jackets, Men</span>
                </div>
                <div className="meta-item">
                  <label>Tags:</label>
                  <span>biker, black, bomber, leather</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
