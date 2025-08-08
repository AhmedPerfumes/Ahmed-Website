"use client";

import { createContext, useContext, useState, useMemo } from "react";

const ShopFilterContext = createContext();
export const useShopFilter = () => {
  const ctx = useContext(ShopFilterContext);
  if (!ctx) throw new Error("useShopFilter must be used inside ShopFilterProvider");
  return ctx;
};

export function ShopFilterProvider({ children }) {
  const [rawProducts, setRawProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]); // [min, max]
  const [stockAvailability, setStockAvailability] = useState("all"); 
  const [promotionalOnly, setPromotionalOnly] = useState(false);

  const value = useMemo(
    () => ({
      rawProducts,
      setRawProducts,
      priceRange,
      setPriceRange,
      stockAvailability,
      setStockAvailability,
      promotionalOnly,
      setPromotionalOnly,
    }),
    [rawProducts, priceRange, stockAvailability, promotionalOnly]
  );

  return (
    <ShopFilterContext.Provider value={value}>
      {children}
    </ShopFilterContext.Provider>
  );
}
