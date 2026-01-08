"use client";
import { currencyOptions, languageOptions } from "@/data/footer";

import { socialLinks } from "@/data/socials";

import React, { use, useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import CartLength from "./components/CartLength";
import UserLoggedIn from "./components/UserLoggedIn";
import { openCart } from "@/utlis/openCart";
import MobileNav from "./components/MobileNav";
import Image from "next/image";
import Link from "next/link";
import User from "./components/User";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { slideData1000 } from "@/data/heroslides";
import { useUser } from "../../context/UserContext";
import { IoLocationOutline } from "react-icons/io5";
import { IoReorderTwoSharp } from "react-icons/io5";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "../../i18n/routing";
import { useMenu } from "@/context/MenuContext";
export default function MobileHeader() {
  const { topHeader } = useMenu();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
      const t = useTranslations();

   //  const pathname = usePathname();
  
      const { isLoggedIn } = useUser();

  const [scrollDirection, setScrollDirection] = useState("down");

  const [searchKeyWord, setSearchKeyWord] = useState("");

  // Inside MobileHeader function
const [searchSuggestions, setSearchSuggestions] = useState([]);
const [isSearching, setIsSearching] = useState(false);

useEffect(() => {
    const fetchSuggestions = async () => {
        if (searchKeyWord.trim().length < 2) {
            setSearchSuggestions([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}api/search-suggestions?keyword=${searchKeyWord}`
            );
            const result = await response.json();
            if (result.success) {
                setSearchSuggestions(result.data);
            }
        } catch (err) {
            console.error("Mobile search error:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
}, [searchKeyWord]);


  const handleChange = (event) => {
    setSearchKeyWord(event.target.value);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setScrollDirection("down");
        } else {
          // Scrolling up
          setScrollDirection("up");
        }
      } else {
        // Below 250px
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    const lastScrollY = { current: window.scrollY };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLangChange = (e) => {
    // console.log(pathname, e.target.value);
    router.push(pathname, { locale: e.target.value });
  };

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

  const onSearch = (event) => {
    event.preventDefault();
    window.location.href = `/${locale}/shop?q=${removeSpecialCharactersAndAmp(
      searchKeyWord
    )
      .split(" ")
      .join("-")}`;
  };

  function removeSpecialCharactersAndAmp(str) {
    // Remove the specific word "&amp;"
    let cleanedStr = str.replace(/&amp;/g, "");

    // Remove all special characters
    cleanedStr = cleanedStr.replace(/[^\w\s-]/g, "");

    // Replace multiple spaces with a single space and trim
    cleanedStr = cleanedStr.replace(/\s+/g, " ").trim();

    return cleanedStr;
  }

  return (
    <div
      className={`header-mobile header_sticky ${
        scrollDirection == "up" ? "header_sticky-active" : "position-relative"
      } `}
    >
      {/* <Swiper
          className="swiper-container js-swiper-slider slideshow type4 slideshow-navigation-white-sm swiper-container-fade swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events bg-black"
          {...swiperOptions}
          style={{ height: "2.5rem" }}
      >
          {slideData1000.map((elm, i) => (
              <SwiperSlide
                  key={i}
                  style={{
                      textTransform: "uppercase",
                      fontSize: "12px",
                  }}
                  className="swiper-slide text-center"
              >
                  <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                      <Link
                          href={`/${locale}/${elm.btnLink}`}
                          className="animate animate_fade animate_btt animate_delay-5 lh-2rem text-white"
                      >
                          {t(
                              elm.description
                                  .split(" ")
                                  .slice(0, 13)
                                  .join(" ")
                          )}
                      </Link>
                  </div>
              </SwiperSlide>
          ))}
      </Swiper> */}

      <style jsx global>{`
        @keyframes marquee-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(-50%); } 
          100% { transform: translateX(0); }
        }
          .mobile-search-results {
    background: white;
    width: 100%;
    max-height: 70vh; /* Don't cover the whole screen, let them see the context */
    overflow-y: auto;
    border: 1px solid #eee;
    border-top: none;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.mobile-suggestion-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #f5f5f5;
    text-decoration: none !important;
}

.mobile-suggestion-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
}

.mobile-suggestion-info {
    flex-grow: 1;
    margin: 0 12px;
    overflow: hidden;
}

.mobile-suggestion-name {
    display: block;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
}

.mobile-suggestion-price {
    font-size: 13px;
    color: #a67b30;
    font-weight: 600;
}
      `}</style>
      <div 
          className="bg-black d-flex align-items-center" 
          style={{ height: "2.5rem", overflow: "hidden" }}
      >
          
          {/* Marquee Track: The element that gets the animation. Must contain two copies of the content. */}
          <div 
              className="d-flex align-items-center" 
              style={{ 
                  whiteSpace: "nowrap", 
                  width: "fit-content", // Crucial for marquee effect
                  willChange: "transform", 
                  // Apply animation based on locale
                  animation: locale === 'ar' ? "marquee-rtl 90s linear infinite" : "marquee-ltr 90s linear infinite",
                  height: "100%"
              }}
          >
              
              {/*
                Loop over the topHeader items multiple times (e.g., 20)
                to create a continuous stream of repeated announcements.
              */}
              {[...Array(20)].map((_, idx) => (
                  topHeader.map((elm, i) => (
                      <span 
                          key={`${idx}-${i}`} 
                          className="d-flex align-items-center flex-nowrap" 
                          style={{ 
                              textTransform: "uppercase", 
                              fontSize: "12px" 
                          }}
                      >
                          <Link
                              href={`/${locale}/${elm.color}`}
                              className="text-white text-decoration-none mx-4"
                              style={{ display: "inline-block" }}
                          >
                              {/* Translate and display the truncated title */}
                              {t(
                                  elm.title
                                      .split(" ")
                                      .slice(0, 13)
                                      .join(" ")
                              )}
                          </Link>
                          {/* Separator */}
                          <span className="text-white">-</span>
                      </span>
                  ))
              ))}
              
          </div>
      </div>
      
      <div className="container d-flex align-items-center h-100">
        <Link className="mobile-nav-activator d-block position-relative" href="#">
          <svg
            className="nav-icon"
            width="25"
            height="18"
            viewBox="0 0 25 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="#icon_nav" />
          </svg>
          <span className="btn-close-lg position-absolute top-0 start-0 w-100"></span>
        </Link>

        <div className="logo">
          <a href="/">
            <Image
              src="/assets/images/about/AhmedLogo.png"
              width={70}
              height={70}
              alt="Ahmed"
              className=""
            />
          </a>
        </div>
        {/* <!-- /.logo --> */}

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
      {/* <!-- /.container --> */}

      <nav className="header-mobile__navigation navigation d-flex flex-column w-100 position-absolute top-100 bg-body overflow-auto">
        <div className="container">
         <form onSubmit={onSearch} className="search-field position-relative mt-4 mb-3">
    <div className="position-relative d-flex align-items-center">
        <input
            className="search-field__input w-100 border rounded-1 form-control shadow-sm"
            type="text"
            name="search-keyword"
            placeholder={locale === 'ar' ? "ابحث عن المنتجات" : "Search products"}
            value={searchKeyWord}
            onChange={handleChange}
            style={{ 
                height: '45px', 
                paddingLeft: locale === 'ar' ? '3rem' : '1rem', 
                paddingRight: locale === 'ar' ? '1rem' : '3rem', 
                textAlign: locale === 'ar' ? 'right' : 'left'
            }}
        />
        {/* ... existing search buttons ... */}
    </div>

    {/* MOBILE SUGGESTIONS DROPDOWN */}
    {(isSearching || searchSuggestions.length > 0) && (
        <div className="mobile-search-results position-absolute start-0 top-100 w-100" style={{ zIndex: 999 }}>
            {isSearching && (
                <div className="p-3 text-center fs-13 text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    {t("Searching...")}
                </div>
            )}

            {!isSearching && searchSuggestions.map((item, index) => (
                <Link 
                    key={index}
                    href={`/${locale}${item.url_path}`}
                    className="mobile-suggestion-item"
                    onClick={() => {
                        setSearchKeyWord("");
                        setSearchSuggestions([]);
                    }}
                >
                    <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}storage/${item.image}`} 
                        alt={item.name}
                        className="mobile-suggestion-img"
                    />
                    <div className="mobile-suggestion-info">
                        <span className="mobile-suggestion-name">{item.name}</span>
                        <span className="mobile-suggestion-price">{item.price} {t("AED")}</span>
                    </div>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </Link>
            ))}

            {/* "View All" Link for Mobile */}
            {!isSearching && searchSuggestions.length > 0 && (
                <Link 
                    href={`/${locale}/shop?q=${searchKeyWord}`}
                    className="d-block text-center p-3 fs-13 fw-bold text-uppercase border-top bg-light text-dark"
                    onClick={() => {
                        setSearchKeyWord("");
                        setSearchSuggestions([]);
                    }}
                >
                    {t("View All Results")}
                </Link>
            )}
        </div>
    )}
</form>
          {/* <!-- /.header-search --> */}
        </div>
        {/* <!-- /.container --> */}

        <div className="container">
          <div className="overflow-hidden">
            <ul className="navigation__list list-unstyled position-relative">
              <MobileNav />
            </ul>
            {/* <!-- /.navigation__list --> */}
          </div>
          {/* <!-- /.overflow-hidden --> */}
        </div>
        {/* <!-- /.container --> */}

        <div className="border-top mt-2 pb-2">
          {/* <div className="customer-links border-bottom container mt-2 mb-2 pb-2">
            {!isLoggedIn ? (
                <Link
                    className="js-open-aside"
                    href="#"
                >
                    <User />
                    <span className="d-inline-block ms-2 text-uppercase align-middle fw-medium">
                      My Account
                    </span>
                </Link>
            ) : (
                <Link href="/account_dashboard">
                    <UserLoggedIn />
                </Link>
            )}
          </div> */}
          <div className="customer-links border-bottom container mt-2 mb-2 pb-2">
            <Link href={`/${locale}/order-tracking`}>
                <IoReorderTwoSharp size={20} />
                <span className="d-inline-block ms-2 text-uppercase align-middle fw-medium">
                {t("Track Your Order")}
              </span>
            </Link>
          </div>
          <div className="customer-links border-bottom container mt-2 mb-2 pb-2">
          <Link href={`/${locale}/store-locator`}>
              <IoLocationOutline size={20} />
              <span className="d-inline-block ms-2 text-uppercase align-middle fw-medium">
              {t("Find a store")}
            </span>
          </Link>
          </div>
      <div className="d-flex">
          <div className="container d-flex align-items-center">
            <label className="me-2 text-secondary">{t("Language")}</label>
            <select
              className="form-select form-select-sm bg-transparent border-0"
              aria-label="Default select example"
              name="store-language"
              value={locale}
              onChange={handleLangChange}
            >
              {languageOptions.map((option, index) => (
                <option
                  key={index}
                  className="footer-select__option"
                  value={option.value}
                >
                  {option.text}
                </option>
              ))}
            </select>
          </div>

          <div className="container d-flex align-items-center">
            <label className="me-2 text-secondary">{t("Country")}</label>
            <select
              className="form-select form-select-sm bg-transparent border-0"
              aria-label="Default select example"
              name="store-language"
              onChange={(e) => window.open(e.target.value,"_self")}
            >
              {currencyOptions.map((option, index) => (
                <option
                  key={index}
                  className="footer-select__option"
                  value={option.link}
                >
                  {t(option.text)}
                </option>
              ))}
            </select>
          </div>
          </div>
          

          <ul className="container social-links list-unstyled d-flex flex-wrap mb-0">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="footer__social-link d-block"
                >
                  <svg
                    className={link.className}
                    width={link.width}
                    height={link.height}
                    viewBox={link.viewBox}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href={link.icon} />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* <!-- /.navigation --> */}
    </div>
  );
}
