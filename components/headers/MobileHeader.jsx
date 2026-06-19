"use client";
import { currencyOptions, languageOptions } from "@/data/footer";

import { socialLinks } from "@/data/socials";

import React, { use, useEffect, useState, useRef } from "react";
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

  const [searchKeyWord, setSearchKeyWord] = useState("");

  // Inside MobileHeader function
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef(null);
  const [currentCountryLink, setCurrentCountryLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentOrigin = window.location.origin;
      const matchedOption = currencyOptions.find(option => 
        option.link && (currentOrigin.includes(option.link) || option.link.includes(currentOrigin))
      );
      if (matchedOption) {
        setCurrentCountryLink(matchedOption.link);
      } else {
        setCurrentCountryLink(currencyOptions[0].link);
      }
    }
  }, []);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

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
    <>
      <div className="bg-black d-flex align-items-center d-lg-none" style={{ height: "2.5rem", overflow: "hidden" }}>
        <div
          className="marquee-track marquee-ltr"
          dir="ltr"
        >
          <div className="marquee-content d-flex align-items-center">
            {topHeader.map((elm, i) => (
              <span key={i} className="d-flex align-items-center flex-nowrap">
                <Link href={`/${locale}/${elm.color}`} className="text-white text-decoration-none mx-4" style={{ textTransform: "uppercase", fontSize: "10px", whiteSpace: "nowrap" }}>
                  {t(elm.title)}
                </Link>
                <span className="text-white">-</span>
              </span>
            ))}
          </div>
          {/* Duplicate 1 */}
          <div className="marquee-content d-flex align-items-center">
            {topHeader.map((elm, i) => (
              <span key={`dup1-${i}`} className="d-flex align-items-center flex-nowrap">
                <Link href={`/${locale}/${elm.color}`} className="text-white text-decoration-none mx-4" style={{ textTransform: "uppercase", fontSize: "10px", whiteSpace: "nowrap" }}>
                  {t(elm.title)}
                </Link>
                <span className="text-white">-</span>
              </span>
            ))}
          </div>
          {/* Duplicate 2 */}
          <div className="marquee-content d-flex align-items-center">
            {topHeader.map((elm, i) => (
              <span key={`dup2-${i}`} className="d-flex align-items-center flex-nowrap">
                <Link href={`/${locale}/${elm.color}`} className="text-white text-decoration-none mx-4" style={{ textTransform: "uppercase", fontSize: "10px", whiteSpace: "nowrap" }}>
                  {t(elm.title)}
                </Link>
                <span className="text-white">-</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="header-mobile header_sticky header_sticky-active" style={{ position: 'sticky', top: 0, zIndex: 100 }} >
        <div className="container position-relative h-100 overflow-hidden" style={{ minHeight: '60px' }}>
          {/* Default Header Content Wrapper */}
          <div
            className="w-100 h-100 d-flex align-items-center justify-content-between px-3"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: isSearchActive ? 0 : 1,
              transform: isSearchActive ? "translateY(-15px)" : "translateY(0)",
              pointerEvents: isSearchActive ? "none" : "auto",
            }}
          >
            <Link className="mobile-nav-activator d-block position-relative" href="#">
              <svg
                className="nav-icon"
                width="20"
                height="15"
                viewBox="0 0 25 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_nav" />
              </svg>
              <span className="btn-close-lg position-absolute top-0 start-0 w-100"></span>
            </Link>

            <div
              className="logo"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1
              }}
            >
              <a href="/">
                <Image
                  src="/assets/images/logo/Mobile.svg"
                  width={140}
                  height={50}
                  alt="Ahmed"
                  className=""
                />
              </a>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Mobile Search Trigger Icon next to Cart */}
              <a
                onClick={() => setIsSearchActive(true)}
                className="header-tools__item"
                style={{ cursor: "pointer" }}
              >
                <svg
                  className="d-block"
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_search" />
                </svg>
              </a>

              <a
                onClick={() => openCart()}
                className="header-tools__item header-tools__cart js-open-aside"
              >
                <svg
                  className="d-block"
                  width="18"
                  height="18"
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

          {/* Search Field Content Wrapper */}
          <div
            className="w-100 h-100 d-flex align-items-center gap-2 px-3 py-2"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: isSearchActive ? 1 : 0,
              transform: isSearchActive ? "translateY(0)" : "translateY(15px)",
              pointerEvents: isSearchActive ? "auto" : "none",
            }}
          >
            <a
              onClick={() => {
                setIsSearchActive(false);
                setSearchKeyWord("");
                setSearchSuggestions([]);
              }}
              className="header-tools__item p-1"
              style={{ cursor: "pointer" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </a>

            <form onSubmit={onSearch} className="flex-grow-1 position-relative m-0">
              <input
                ref={searchInputRef}
                className="w-100 border rounded-pill px-3 shadow-sm form-control"
                type="text"
                placeholder={locale === 'ar' ? "ابحث عن المنتجات..." : "Search products..."}
                value={searchKeyWord}
                onChange={handleChange}
                style={{
                  height: '38px',
                  fontSize: '14px',
                  paddingRight: locale === 'ar' ? '1rem' : '2.5rem',
                  paddingLeft: locale === 'ar' ? '2.5rem' : '1rem',
                  textAlign: locale === 'ar' ? 'right' : 'left'
                }}
              />
              <button
                type="submit"
                className="btn-icon position-absolute top-50 translate-middle-y bg-transparent border-0"
                style={{
                  right: locale === 'ar' ? 'auto' : '10px',
                  left: locale === 'ar' ? '10px' : 'auto',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <use href="#icon_search" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Floating Mobile Suggestions Dropdown (Only visible when active in header) */}
        {isSearchActive && (isSearching || searchSuggestions.length > 0) && (
          <div className="mobile-search-results position-absolute start-0 top-100 w-100 bg-white border-top shadow-lg" style={{ zIndex: 999, maxHeight: '80vh', overflowY: 'auto' }}>
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
                className="mobile-suggestion-item d-flex align-items-center gap-3 p-3 border-bottom text-decoration-none text-dark"
                onClick={() => {
                  setSearchKeyWord("");
                  setSearchSuggestions([]);
                  setIsSearchActive(false);
                }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}storage/${item.image}`}
                  alt={item.name}
                  className="mobile-suggestion-img"
                  style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div className="mobile-suggestion-info flex-grow-1">
                  <span className="mobile-suggestion-name d-block fw-medium fs-14 text-start">{item.name}</span>
                  <span className="mobile-suggestion-price text-muted fs-13 text-start d-block">{item.price} {t("AED")}</span>
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
                className="d-block text-center p-3 fs-13 fw-bold text-uppercase border-top bg-light text-dark text-decoration-none"
                onClick={() => {
                  setSearchKeyWord("");
                  setSearchSuggestions([]);
                  setIsSearchActive(false);
                }}
              >
                {t("View All Results")}
              </Link>
            )}
          </div>
        )}
        {/* <!-- /.container --> */}

        <nav className="header-mobile__navigation navigation d-flex flex-column w-100 position-absolute top-100 bg-body overflow-auto">


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
            <div className="container mt-2 mb-2 pb-3 border-bottom">
              <div className="d-flex align-items-center justify-content-between gap-2">
                {/* Find a Store Button */}
                <Link 
                  href={`/${locale}/store-locator`}
                  className="d-flex align-items-center justify-content-center p-2 rounded text-decoration-none border"
                  style={{
                    backgroundColor: '#fcfcfc',
                    color: '#111',
                    borderColor: '#f0f0f0',
                    height: '42px',
                    flex: '1 1 0px',
                    minWidth: '0'
                  }}
                >
                  <IoLocationOutline size={16} className="text-warning me-1 flex-shrink-0" />
                  <span className="text-uppercase fw-bold text-truncate" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                    {t("Find a store")}
                  </span>
                </Link>

                {/* Language Selector */}
                <div 
                  className="d-flex flex-column justify-content-center px-2 py-1 border rounded" 
                  style={{ borderColor: '#f0f0f0', backgroundColor: '#fcfcfc', height: '42px', flex: '1 1 0px', minWidth: '0' }}
                >
                  <span 
                    className="text-uppercase fw-semibold text-muted text-start" 
                    style={{ fontSize: '8px', letterSpacing: '0.5px', display: 'block', lineHeight: '1', marginBottom: '2px' }}
                  >
                    {t("Language")}
                  </span>
                  <select
                    className="form-select form-select-sm border-0 bg-transparent p-0 shadow-none fw-semibold text-dark text-start"
                    aria-label="Language selector"
                    name="store-language"
                    value={locale}
                    onChange={handleLangChange}
                    style={{ fontSize: '11px', cursor: 'pointer', outline: 'none', width: '100%', maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}
                  >
                    {languageOptions.map((option, index) => (
                      <option key={index} className="text-dark bg-white" value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Selector */}
                <div 
                  className="d-flex flex-column justify-content-center px-2 py-1 border rounded" 
                  style={{ borderColor: '#f0f0f0', backgroundColor: '#fcfcfc', height: '42px', flex: '1 1 0px', minWidth: '0' }}
                >
                  <span 
                    className="text-uppercase fw-semibold text-muted text-start" 
                    style={{ fontSize: '8px', letterSpacing: '0.5px', display: 'block', lineHeight: '1', marginBottom: '2px' }}
                  >
                    {t("Country")}
                  </span>
                  <select
                    className="form-select form-select-sm border-0 bg-transparent p-0 shadow-none fw-semibold text-dark text-start"
                    aria-label="Country selector"
                    name="store-country"
                    value={currentCountryLink}
                    onChange={(e) => window.open(e.target.value, "_self")}
                    style={{ fontSize: '11px', cursor: 'pointer', outline: 'none', width: '100%', maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}
                  >
                    {currencyOptions.map((option, index) => (
                      <option key={index} className="text-dark bg-white" value={option.link}>
                        {t(option.text)}
                      </option>
                    ))}
                  </select>
                </div>
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
    </>
  );
}
