import React from "react";

export default function BreadCumb({ category, subcategory }) {
  // console.log(category, subcategory);
  return (
    <>
      <a href="/" className="menu-link menu-link_us-s text-uppercase fw-medium">
        Home
      </a>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
        /
      </span>
      <a href="/shop-1" className="menu-link menu-link_us-s text-uppercase fw-medium">
        Shop
      </a>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
      {category ? `/` : ``}
      </span>
      <a href={subcategory ? `/product-category/${category}` : `#`} className="menu-link menu-link_us-s text-uppercase fw-medium">
        {category?.split("-").join(" ")}
      </a>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
      {subcategory ? `/` : ``}
      </span>
      <a href="#" className="menu-link menu-link_us-s text-uppercase fw-medium">
        {subcategory && subcategory.split("-").join(" ")}
      </a>
    </>
  );
}
