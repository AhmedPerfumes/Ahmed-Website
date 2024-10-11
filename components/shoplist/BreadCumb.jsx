import React from "react";
import Link from "next/link";

export default function BreadCumb({ category, subcategory }) {
  // console.log(category, subcategory);
  return (
    <>
      <Link href="/" className="menu-link menu-link_us-s text-uppercase fw-medium">
        Home
      </Link>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
        /
      </span>
      <Link href="/shop" className="menu-link menu-link_us-s text-uppercase fw-medium">
        Shop
      </Link>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
      {category ? `/` : ``}
      </span>
      <Link href={subcategory ? `/product-category/${category}` : `#`} className="menu-link menu-link_us-s text-uppercase fw-medium">
        {category?.split("-").join(" ")}
      </Link>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
      {subcategory ? `/` : ``}
      </span>
      <Link href="#" className="menu-link menu-link_us-s text-uppercase fw-medium">
        {subcategory && subcategory.split("-").join(" ")}
      </Link>
    </>
  );
}
