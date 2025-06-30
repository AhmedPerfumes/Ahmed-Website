"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "../../../context/MenuContext";
import { useLocale, useTranslations } from "next-intl";

export default function MobileNav() {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);

  const isMenuActive = (menu) => menu.split("/")[3] === pathname.split("/")[4];
  const isActiveParentMenu = (menu) => menu.split("/")[2] === pathname.split("/")[3];
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

  const { categoriesSubCategories, isLoading: isMenuLoading, error } = useMenu();

  if (isMenuLoading) return <div></div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <style jsx>{`
        .sub-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 1.3s ease;
        }
        .sub-menu.open {
          max-height: 500px;
        }
        .toggle-button {
          background: none;
          border: none;
          padding: 0;
          margin-left: auto;
          font-size: 1.25rem;
          line-height: 1;
        }
      `}</style>

      {categoriesSubCategories?.map((item, i) => {
        const isOpen = openCategoryIndex === i;
        const hasSubCategories = item.productSubCategories?.length > 0;
        const categorySlug = item.name !== "Gift Sets"
          ? `/${locale}/product-category/${item.name.split(" ").join("-").toLowerCase()}`
          : `/${locale}/product-category/gift-sets`;

        return (
          <li key={i} className="navigation__item d-flex flex-column">
            <div className="d-flex align-items-center w-100">
              <Link
                href={categorySlug}
                className={`navigation__link text-start flex-grow-1 ${
                  isActiveParentMenu(categorySlug) ? "menu-active" : ""
                }`}
              >
                {t(item.name)}
              </Link>
              {hasSubCategories && (
                <button
                  type="button"
                  onClick={() => setOpenCategoryIndex(isOpen ? null : i)}
                  className="toggle-button fw-bold"
                  aria-label="Toggle sub-menu"
                >
                  {isOpen ? "-" : "+"}
                </button>
              )}
            </div>

            <div className={`sub-menu ${isOpen && hasSubCategories ? "open" : ""}`}>
              {isOpen && hasSubCategories && (
                <ul className="list-unstyled">
                  {item.productSubCategories.map((elm, j) => (
                    <li key={j} className="sub-menu__item">
                      <Link
                        href={
                          item.name !== "Gift Sets"
                            ? `/${locale}/product-category/${item.name.split(" ").join("-").toLowerCase()}/${elm.name.split(" ").join("-").toLowerCase()}`
                            : `/${locale}/product-category/gift-sets`
                        }
                        className={`menu-link menu-link_us-s ${
                          isMenuActive(`/product-category/${item.name.split(" ").join("-").toLowerCase()}/${elm.name.split(" ").join("-").toLowerCase()}`)
                            ? "menu-active"
                            : ""
                        }`}
                      >
                        {t(elm.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}

      <li key="export" className="navigation__item">
        <Link
          href={`/${locale}/export`}
          className={`navigation__link ${isActiveExportMenu(`/export`) ? "menu-active" : ""}`}
        >
          {t("Worldwide Distribution")}
        </Link>
      </li>
    </>
  );
}
