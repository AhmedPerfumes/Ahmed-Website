"use client";
import Link from "next/link";
import CartLength from "./components/CartLength";
import Nav from "./components/Nav";
import { openCart } from "@/utlis/openCart";
import User from "./components/User";
import { currencyOptions, languageOptions2 } from "@/data/footer";
import { slideData1000 } from "@/data/heroslides";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header14() {
  const pathname = usePathname();

  const swiperOptions = {
    autoplay: {
      delay: 5000,
    },
    modules: [Autoplay, Navigation, EffectFade],
    pagination: false,
    slidesPerView: 1,
    effect: "fade",
    loop: true,
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const containerRef = useRef(null);

  //Inline style for transitions
  const headerStyle = {
    transition: "max-height 0.8s ease-in-out, opacity 0.5s ease-in-out",
    overflow: isHeaderOpen ? "visible" : "hidden",
    maxHeight: isHeaderOpen ? "1000px" : "0",
    opacity: isHeaderOpen ? 1 : 1,
  };

  return (
    <>
      <header
        id="header"
        className={`header sticky_disabled w-100 border-bottom`}
        style={pathname == "/" ? headerStyle : {}}
      >
        <Swiper
          className="swiper-container js-swiper-slider slideshow type4 slideshow-navigation-white-sm swiper-container-fade swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events bg-black"
          {...swiperOptions}
          style={{ height: "3rem" }}
        >
          {slideData1000.map((elm, i) => (
            <SwiperSlide
              key={i}
              style={{ textTransform: "uppercase", fontSize: "12px" }}
              className="swiper-slide text-center"
            >
              <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                <a className="p animate animate_fade animate_btt animate_delay-5 lh-2rem text-white">
                  {elm.description.split(" ").slice(0, 13).join(" ")}
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          ref={containerRef}
          className={`header-tools__item hover-container ${
            isPopupOpen ? "js-content_visible" : ""
          }`}
        >
          <div className="search-popup js-hidden-content">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="search-field container"
            >
              <p className="text-uppercase text-secondary fw-medium mb-4">
                What are you looking for?
              </p>
              <div className="position-relative">
                <input
                  className="search-field__input search-popup__input w-100 fw-medium"
                  type="text"
                  name="search-keyword"
                  placeholder="Search products"
                />
                <button className="btn-icon search-popup__submit" type="submit">
                  <svg
                    className="d-block"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="#icon_search" />
                  </svg>
                </button>
                <button
                  className="btn-icon btn-close-lg search-popup__reset"
                  type="reset"
                ></button>
              </div>

              <div className="search-popup__results">
                <div className="sub-menu search-suggestion">
                  <h6 className="sub-menu__title fs-base">Quicklinks</h6>
                  <ul className="sub-menu__list list-unstyled">
                    <li className="sub-menu__item">
                      <Link href="/shop-2" className="menu-link menu-link_us-s">
                        Marj
                      </Link>
                    </li>
                    <li className="sub-menu__item">
                      <a href="#" className="menu-link menu-link_us-s">
                        Rose Noir
                      </a>
                    </li>
                    <li className="sub-menu__item">
                      <Link href="/shop-3" className="menu-link menu-link_us-s">
                        Oud Lavender
                      </Link>
                    </li>
                    <li className="sub-menu__item">
                      <a href="#" className="menu-link menu-link_us-s">
                        Oud Classic
                      </a>
                    </li>
                    <li className="sub-menu__item">
                      <a href="#" className="menu-link menu-link_us-s">
                        Oud &amp; Roses
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="search-result row row-cols-5"></div>
              </div>
            </form>
          </div>
        </div>

        <div className="header-desk_type_8">
          <div className="header-middle">
            <div className="container-fluid d-flex align-items-center my-2 px-5">
              <div className="flex-1 d-flex align-items-center gap-3">
                <div className="heeader-top__right flex-1 d-flex gap-1">
                  <select
                    className="form-select form-select-sm bg-transparent color-black"
                    name="store-currency"
                  >
                    {currencyOptions.map((option, index) => (
                      <option
                        key={index}
                        className="footer-select__option"
                        value={option.value}
                      >
                        {option.text}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select form-select-sm bg-transparent color-black"
                    name="store-language"
                  >
                    {languageOptions2.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="logo">
                <a href="/">
                  <img
                    src="https://www.ahmed-perfume.com/wp-content/uploads/2022/01/Ahmed-logo.svg"
                    width="200px"
                    alt="Ahmed"
                  />
                </a>
              </div>
              <div className="header-tools d-flex align-items-center flex-1 justify-content-end me-2">
                <form className="header-search search-field d-none d-xxl-flex mx-4">
                  <input
                    className="header-search__input w-100"
                    type="text"
                    name="search-keyword"
                    placeholder="Search products..."
                    onClick={() => setIsPopupOpen((pre) => !pre)}
                  />
                  <button
                    className="btn header-search__btn"
                    type="button"
                    onClick={() => setIsPopupOpen((pre) => !pre)}
                  >
                    <svg
                      className="d-block"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isPopupOpen ? (
                        <use href="#icon_close" />
                      ) : (
                        <use href="#icon_search" />
                      )}
                    </svg>
                  </button>
                </form>

                <div className="header-tools__item hover-container">
                  <a className="js-open-aside" href="#">
                    <User />
                  </a>
                </div>

                <Link className="header-tools__item" href="/account_wishlist">
                  <svg
                    className="d-block"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="#icon_heart" />
                  </svg>
                </Link>

                <a
                  onClick={() => openCart()}
                  className="header-tools__item header-tools__cart js-open-aside"
                >
                  <svg
                    className="d-block"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="#icon_cart" />
                  </svg>
                  <span className="cart-amount d-block position-absolute js-cart-items-count">
                    <CartLength />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="header-bottom">
            <div className="container">
              <nav className="navigation w-100 d-flex align-items-center justify-content-center py-2">
                <ul className="navigation__list list-unstyled d-flex my-1">
                  <Nav />
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <nav className="navigation text-center position-absolute d-none d-lg-block menu-button btn">
        <a
          className="navigation__item"
          href="#"
          onClick={() => setIsHeaderOpen((prev) => !prev)}
        >
          Menu
        </a>
      </nav>
    </>
  );
}
