import React from "react";
import Link from "next/link";

export default function BreadCumb({ category, subcategory, product }) {
  return (
    <>
      <Link href="/" className="menu-link menu-link_us-s text-uppercase fw-medium">
        Home
      </Link>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
        /
      </span>
      <Link href="#" className="menu-link menu-link_us-s text-uppercase fw-medium">
        Shop
      </Link>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
        /
      </span>
      <Link href={category != 'gift-sets' ? `/product-category/${category}` : '/product-category/gift-sets'} className="menu-link menu-link_us-s text-uppercase fw-medium">
        { category.split('-').join(' ').toUpperCase() }
      </Link>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
        /
      </span>
      <Link href={category != 'gift-sets' ? `/product-category/${category}/${subcategory}` : '/product-category/gift-sets'} className="menu-link menu-link_us-s text-uppercase fw-medium">
        { subcategory.split('-').join(' ').toUpperCase() }
      </Link>
    </>
  );
}
