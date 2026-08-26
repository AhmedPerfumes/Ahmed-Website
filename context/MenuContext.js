'use client';
import React, { createContext, useContext, useMemo } from 'react';

const MenuContext = createContext({
  categoriesSubCategories: [],
  isLoading: false,
  error: null,
  vatTax: 0.0,
  shippingServiceCharges: [],
  currency: 'د.إ',
  homeSliders: [],
  popUp: [],
  topHeader: [],
});

export function MenuProvider({ children, initialData }) {
  const value = useMemo(() => ({
    categoriesSubCategories: initialData?.productCategories || [],
    vatTax: initialData?.tax ?? 0.0,
    shippingServiceCharges: initialData?.shipping_service_charges || [],
    currency: initialData?.currency || 'د.إ',
    homeSliders: initialData?.home_sliders || [],
    popUp: initialData?.pop_up || [],
    topHeader: initialData?.top_header || [],
    isLoading: !initialData,
    error: null,
  }), [initialData]);

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}