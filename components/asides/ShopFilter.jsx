"use client";

import { useEffect } from "react";
import { closeModalShopFilter } from "@/utlis/aside";
import FilterAll from "../shoplist/filter/FilterAll";
import { useShopFilter } from "@/context/ShopFilterContext";

export default function ShopFilter() {
  const { rawProducts } = useShopFilter();

  useEffect(() => {
    const pageOverlay = document.getElementById("pageOverlay");
    if (pageOverlay) {
      pageOverlay.addEventListener("click", closeModalShopFilter);
    }
    return () => {
      if (pageOverlay) {
        pageOverlay.removeEventListener("click", closeModalShopFilter);
      }
    };
  }, []);

  return (
    <div className="aside-filters aside aside_right" id="shopFilterAside">
      <div className="aside-header d-flex align-items-center">
        <h3 className="text-uppercase fs-6 mb-0">Filter</h3>
        <button
          onClick={() => closeModalShopFilter()}
          className="btn-close-lg js-close-aside btn-close-aside ms-auto"
        />
      </div>
      <div className="aside-content">
        <FilterAll products={rawProducts} />
      </div>
    </div>
  );
}
