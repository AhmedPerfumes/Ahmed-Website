"use client";
import {
  additionalShopPageitems,
  blogmenuItems,
  homePages,
  othersMenuItems,
  shopDetails,
  shopList,
  collections
} from "@/data/menu";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav({ categoriesSubCategories }) {

  const pathname = usePathname();
  // console.log(searchParams.get('category'));
  const isMenuActive = (menu) => {
    return menu.split("/")[3] == pathname.split("/")[3];
  };
  const isActiveParentMenu = (menu) => {
    return menu.split("/")[2] == pathname.split("/")[2];
  };

  useEffect(() => {
    function setBoxMenuPosition(menu) {
      const scrollBarWidth = 17; // You might need to calculate or define this value
      const limitR = window.innerWidth - menu.offsetWidth - scrollBarWidth;
      const limitL = 0;
      const menuPaddingLeft = parseInt(
        window.getComputedStyle(menu, null).getPropertyValue("padding-left")
      );
      const parentPaddingLeft = parseInt(
        window
          .getComputedStyle(menu.previousElementSibling, null)
          .getPropertyValue("padding-left")
      );
      const centerPos =
        menu.previousElementSibling.offsetLeft -
        menuPaddingLeft +
        parentPaddingLeft;

      let menuPos = centerPos;
      if (centerPos < limitL) {
        menuPos = limitL;
      } else if (centerPos > limitR) {
        menuPos = limitR;
      }

      menu.style.left = `${menuPos}px`;
    }
    document.querySelectorAll(".box-menu").forEach((el) => {
      setBoxMenuPosition(el);
    });
  }, []);

  let categoriesSubCategoriesBody = categoriesSubCategories.map((item, i) => {
    return (
      <li className="navigation__item" key={i}>
        <Link
          href={`/product-category/${item.name.split(' ').join('-').toLowerCase()}`}
          className={`navigation__link
          ${isActiveParentMenu(`/product-category/${item.name.split(' ').join('-').toLowerCase()}`) ? "menu-active" : ""}
          `}
        >
          { item.name }
        </Link>
        { item.name != 'Hair Mist' &&
          <div className="mega-menu">
            <div className="container d-flex">
              <div className="col pe-4">
                <p href="#" className="sub-menu__title">
                PRODUCT TYPES
                </p>
                <ul className="sub-menu__list list-unstyled">
                  {item.productSubCategories.map((elm, ind) => (
                    <li key={ind} className="sub-menu__item">
                      <Link
                        href={`/product-category/${item.name.split(' ').join('-').toLowerCase()}/${elm.name.split(' ').join('-').toLowerCase()}`}
                        className={`menu-link menu-link_us-s ${
                          isMenuActive(`/product-category/${item.name.split(' ').join('-').toLowerCase()}/${elm.name.split(' ').join('-').toLowerCase()}`) ? "menu-active" : ""
                        }`}
                      >
                        {elm.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mega-menu__media col pe-4">
                <div className="position-relative">
                  <Link href="/product16_v11/1">
                    <Image
                      loading="lazy"
                      className="mega-menu__img"
                      src={`http://localhost/farmart/public/storage/${item.icon_image}`}
                      width={902}
                      height={990}
                      style={{ height: "fit-content" }}
                      alt="New Horizons"
                    />
                  </Link>
                </div>
              </div>

              <div className="mega-menu__media col pe-4">
                <div className="position-relative">
                  <Link href="/product16_v11/1">
                    <Image
                      loading="lazy"
                      className="mega-menu__img"
                      src={`http://localhost/farmart/public/storage/${item.menu_image2}`}
                      width={902}
                      height={990}
                      style={{ height: "fit-content" }}
                      alt="New Horizons"
                    />
                  </Link>
                </div>
              </div>
            </div>
            {/* <!-- /.container d-flex --> */}
          </div>
        }
      </li>
    );
  });

  return (
    <>
      { categoriesSubCategoriesBody && categoriesSubCategoriesBody }
    </>
  );
}
