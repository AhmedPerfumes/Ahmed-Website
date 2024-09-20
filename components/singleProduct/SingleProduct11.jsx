"use client";
import React, { useState } from "react";
import Slider4 from "./sliders/Slider4";
import BreadCumb from "./BreadCumb";
import Star from "../common/Star";
import Size from "./Size";
import Description from "./Description";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import Clolor2 from "./Clolor2";
import Link from "next/link";
import ShareComponent from "../common/ShareComponent";
import { useContextElement } from "@/context/Context";
import he from 'he';

export default function SingleProduct11({ category, subcategory, product }) {
  const { cartProducts, setCartProducts } = useContextElement();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const isIncludeCard = () => {
    const item = cartProducts.filter((elm) => elm.product_id == product.product_id)[0];
    return item;
  };
  const setQuantityCartItem = (id, quantity) => {
    if (isIncludeCard()) {
      if (quantity >= 1 && quantity <= product.product_qty) {
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
      setQuantity((quantity <= product.product_qty && quantity >= 1) ? quantity : product.product_qty);
      setError(null);
      if(quantity > product.product_qty) {
        setError("Quantity is more than available quantity");
      } else {
        setError(null);
      }
    }
  };
  const addToCart = () => {
    if (!isIncludeCard()) {
      const item = product;
      item.quantity = quantity;
      setCartProducts((pre) => [...pre, item]);
    }
  };

  return (
    <>
      {Object.keys(product).length > 0 ? <><section className="product-single container product-single__type-9">
        <div className="row">
          <div className="col-lg-7">
            <Slider4 product={ product }/>
          </div>
          <div className="col-lg-5">
            <div className="d-flex justify-content-between mb-4 pb-md-2">
              <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
                <BreadCumb category={ category } subcategory={ subcategory }/>
              </div>
              {/* <!-- /.breadcrumb --> */}
            </div>
            <h1 className="product-single__name">{product?.product_name && he.decode(product?.product_name)}</h1>
            {/* <div className="product-single__rating">
            <div className="reviews-group d-flex">
              <Star stars={5} />
            </div>
            <span className="reviews-note text-lowercase text-secondary ms-1">
              8k+ reviews
            </span>
          </div> */}
            <div className="product-single__price">
              <span className="current-price"> {product.price}د.إ</span>
            </div>
            <div className="product-single__short-desc">
              <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
            </div>
            <h6 style={{ color: "red" }}>{error && error}</h6>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="product-single__addtocart">
                <div className="qty-control position-relative">
                  <input
                    type="number"
                    name="quantity"
                    value={
                      isIncludeCard() ? isIncludeCard().quantity : quantity
                    }
                    min="1"
                    onChange={(e) =>
                      setQuantityCartItem(product.product_id, e.target.value)
                    }
                    className="qty-control__number text-center"
                    readOnly
                  />
                  <div
                    onClick={() =>
                      setQuantityCartItem(
                        product.product_id,
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
                        product.product_id,
                        isIncludeCard()?.quantity + 1 || quantity + 1
                      )
                    }
                    className="qty-control__increase"
                  >
                    +
                  </div>
                </div>
                {/* <!-- .qty-control --> */}
                <button
                  type="submit"
                  className="btn btn-primary btn-addtocart js-open-aside"
                  onClick={() => addToCart()}
                >
                  {isIncludeCard() ? "Already Added" : "Add to Cart"}
                </button>
              </div>
            </form>
            <div className="product-single__addtolinks">
              {/* <a href="#" className="menu-link menu-link_us-s add-to-wishlist">
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
              <ShareComponent title={product.title} />
            </div>
            <div className="product-single__meta-info">
              <div className="meta-item">
                <label>Estimated delivery:</label>
                <span> 3 - 5 days</span>
              </div>
              <div className="meta-item">
                <label>Categories: </label>
                <span>{ category.split('-').join(' ').toUpperCase() }, { subcategory.split('-').join(' ').toUpperCase() }</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-single product-single__type-9 bg-dark text-white d-flex align-items-center justify-content-center p-5">
        <div className="product-single__details-list">
          <h2 className="product-single__details-list__title text-white">
            Description
          </h2>
          <div className="product-single__details-list__content">
            <Description />
          </div>
          <h2 className="product-single__details-list__title text-white">
            Fragrance Notes
          </h2>
          <div className="product-single__details-list__content">
            <AdditionalInfo />
          </div>
        </div>
      </section></> : <h2 className="h4 text-center text-uppercase mb-4 pb-xl-2 mb-xl-4">No Product Found</h2>}
    </>
  );
}
