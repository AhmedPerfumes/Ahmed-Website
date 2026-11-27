"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMenu } from "../../../context/MenuContext";
import { useLocale, useTranslations } from "next-intl";
import { useUaeTheme } from "@/utils/uaeTheme";

export default function MobileNav() {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const { categoriesSubCategories, isLoading: isMenuLoading, error, homeSliders } = useMenu();
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const isUaeTheme = useUaeTheme();

  const isSaleLink = (link) => {
    if (!link) return false;
    const s = String(link).toLowerCase();
    return s === "sale" || s === "/sale" || s.includes("/sale");
  };

  const saleBanner = Array.isArray(homeSliders)
    ? homeSliders.find((s) => isSaleLink(s.link))
    : null;

  const isMenuActive = (menu) => menu.split("/")[3] === pathname.split("/")[4];
  const isActiveParentMenu = (menu, itemName) => {
    if (itemName === "Gift Sets" && pathname?.includes("/corporate-gifting")) {
      return true;
    }
    return menu.split("/")[2] === pathname.split("/")[3];
  };
  const isActiveExportMenu = (menu) => menu.split("/")[1] === pathname.split("/")[2];

  useEffect(() => {
    const selectors = {
      mobileMenuActivator: ".mobile-nav-activator",
      mobileMenu: ".navigation",
      mobileMenuActiveClass: "mobile-menu-opened",
    };

    const mobileMenuActivator = document.querySelector(selectors.mobileMenuActivator);
    const mobileDropdown = document.querySelector(selectors.mobileMenu);

    const toggleMobileMenu = (event) => {
      event?.preventDefault();
      if (document.body.classList.contains(selectors.mobileMenuActiveClass)) {
        document.body.classList.remove(selectors.mobileMenuActiveClass);
        document.body.style.paddingRight = "";
        if (mobileDropdown) mobileDropdown.style.paddingRight = "";
      } else {
        document.body.classList.add(selectors.mobileMenuActiveClass);
        document.body.style.paddingRight = "scrollWidth";
        if (mobileDropdown) mobileDropdown.style.paddingRight = "scrollWidth";
      }
    };

    if (mobileMenuActivator) {
      mobileMenuActivator.addEventListener("click", toggleMobileMenu);
    }

    return () => {
      if (mobileMenuActivator) {
        mobileMenuActivator.removeEventListener("click", toggleMobileMenu);
      }
    };
  }, []);

  useEffect(() => {
    document.body.classList.remove("mobile-menu-opened");
    document.body.style.paddingRight = "";
    const mobileDropdown = document.querySelector(".navigation");
    if (mobileDropdown) mobileDropdown.style.paddingRight = "";
  }, [pathname]);

  if (isMenuLoading) return <div></div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <style jsx>{`
        .sub-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-in-out;
        }
        .sub-menu.open {
          max-height: 1000px;
        }
        .toggle-button {
          background: none;
          border: none;
          padding: 0 10px;
          margin-left: ${locale === 'ar' ? '0' : 'auto'};
          margin-right: ${locale === 'ar' ? 'auto' : '0'};
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
        }
        .sub-menu__item {
          padding-left: ${locale === 'ar' ? '0' : '1.5rem'};
          padding-right: ${locale === 'ar' ? '1.5rem' : '0'};
        }
      `}</style>

      {categoriesSubCategories?.map((item, i) => {
        const isOpen = openCategoryIndex === i;
        const isGiftSets = item.name === "Gift Sets";
        const hasSubCategories = (item.productSubCategories?.length > 0) || isGiftSets;
        const categorySlug = !isGiftSets
          ? `/${locale}/product-category/${item.name.split(" ").join("-").toLowerCase()}`
          : `/${locale}/product-category/gift-sets`;

        return (
          <li key={i} className={`navigation__item d-flex flex-column border-bottom${isOpen ? " is-expanded" : ""}`}>
            <div className="d-flex align-items-center w-100 py-2">
              <Link
                href={categorySlug}
                className={`navigation__link text-start flex-grow-1 ${isActiveParentMenu(categorySlug, item.name) ? "menu-active fw-bold" : ""
                  }`}
                style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}
              >
                {t(item.name)}
              </Link>
              {hasSubCategories && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link click if nested
                    setOpenCategoryIndex(isOpen ? null : i);
                  }}
                  className={`toggle-button${isOpen ? " is-open" : ""}`}
                  aria-label="Toggle sub-menu"
                >
                  {isOpen ? "−" : "+"}
                </button>
              )}
            </div>

            <div className={`sub-menu ${isOpen && hasSubCategories ? "open" : ""}`}>
              {isOpen && hasSubCategories && (
                <div className={isUaeTheme ? "uae-mobile-submenu-panel" : undefined}>
                  {isUaeTheme && (
                    <div className="uae-mobile-submenu-heading">
                      <span className="uae-mobile-submenu-diamond" aria-hidden="true" />
                      <span>{t("PRODUCT TYPES")}</span>
                    </div>
                  )}
                  <ul className="list-unstyled mb-0 pb-2">
                    {(!item.productSubCategories || item.productSubCategories.length === 0) && isGiftSets && (
                      <li className="sub-menu__item">
                        <Link
                          href={`/${locale}/product-category/gift-sets`}
                          className={`menu-link d-block py-1 text-secondary ${pathname?.includes('/product-category/gift-sets') ? "menu-active text-dark fw-medium" : ""}`}
                          style={{
                            textAlign: locale === 'ar' ? 'right' : 'left',
                            fontSize: '0.825rem'
                          }}
                        >
                          {t("Gift Sets")}
                        </Link>
                      </li>
                    )}
                    {item.productSubCategories?.map((elm, j) => (
                      <li key={j} className="sub-menu__item">
                        <Link
                          href={
                            !isGiftSets
                              ? `/${locale}/product-category/${item.name.split(" ").join("-").toLowerCase()}/${elm.name.split(" ").join("-").toLowerCase()}`
                              : `/${locale}/product-category/gift-sets`
                          }
                          className={`menu-link d-block py-1 text-secondary ${isMenuActive(`/product-category/${item.name.split(" ").join("-").toLowerCase()}/${elm.name.split(" ").join("-").toLowerCase()}`)
                            ? "menu-active text-dark fw-medium"
                            : ""
                            }`}
                          style={{
                            textAlign: locale === 'ar' ? 'right' : 'left',
                            fontSize: '0.825rem'
                          }}
                        >
                          {t(elm.name)}
                        </Link>
                      </li>
                    ))}
                    {isGiftSets && (
                      <li className="sub-menu__item">
                        <Link
                          href={`/${locale}/corporate-gifting`}
                          className={`menu-link d-block py-1 text-secondary ${pathname?.includes("/corporate-gifting")
                            ? "menu-active text-dark fw-medium"
                            : ""
                            }`}
                          style={{
                            textAlign: locale === 'ar' ? 'right' : 'left',
                            fontSize: '0.825rem'
                          }}
                        >
                          {t("Corporate Gift Sets")}
                        </Link>
                      </li>
                    )}
                  </ul>

                  {/* Mobile Mega-Menu Editorial Media Strip (when UAE theme is active) */}
                  {isUaeTheme && (item.icon_image || item.menu_image2) && (
                    <div className="uae-mobile-mega-media">
                      {item.icon_image && (
                        <Link href={categorySlug} className="uae-mobile-mega-card">
                          <Image
                            loading="lazy"
                            src={`${process.env.NEXT_PUBLIC_API_URL}storage/${item.icon_image}`}
                            width={320}
                            height={220}
                            alt={item.name}
                            className="uae-mobile-mega-img"
                          />
                        </Link>
                      )}
                      {item.menu_image2 && (
                        <Link href={categorySlug} className="uae-mobile-mega-card">
                          <Image
                            loading="lazy"
                            src={`${process.env.NEXT_PUBLIC_API_URL}storage/${item.menu_image2}`}
                            width={320}
                            height={220}
                            alt={item.name}
                            className="uae-mobile-mega-img"
                          />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
      {saleBanner && (
        <li key="sale" className="navigation__item border-bottom py-2">
          <Link
            href={`/${locale}/${saleBanner.link || "sale"}`}
            className={`navigation__link d-block text-start ${isActiveExportMenu(`/sale`) ? "menu-active fw-bold" : ""}`}
            style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}
          >
            {t("Sale")}
          </Link>
        </li>
      )}

      <li key="export" className="navigation__item border-bottom py-2">
        <Link
          href={`/${locale}/export`}
          className={`navigation__link d-block text-start ${isActiveExportMenu(`/export`) ? "menu-active fw-bold" : ""}`}
          style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}
        >
          {t("Worldwide Distribution")}
        </Link>
      </li>
    </>
  );
}
