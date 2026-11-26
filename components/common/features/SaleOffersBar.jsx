"use client";

import React from "react";
import { useTranslations } from "next-intl";
import "./SaleOffersBar.css";

/**
 * Sale page tabs: All / Buy X Get Y / Percentage Off / Flat Discount.
 * Selecting a tab filters the product grid; a tab only appears when it has products.
 * Styling lives in SaleOffersBar.css.
 */

function Tab({ selected, onClick, label }) {
  return (
    <button type="button" className="sale-tab" aria-pressed={selected} onClick={onClick}>
      {label}
    </button>
  );
}

export default function SaleOffersBar({ offers, selectedKey, onSelect }) {
  const t = useTranslations();

  // Nothing to switch between when there is only one kind of sale
  if (offers.length < 2) return null;

  const labels = {
    bogo: t("Buy X Get Y"),
    percent: t("Percentage Off"),
    amount: t("Flat Discount"),
    discounts: t("Discounts"),
  };

  return (
    <div className="sale-tabs" role="group" aria-label={t("Current offers")}>
      <div className="sale-tabs__track">
        <Tab selected={!selectedKey} onClick={() => onSelect(null)} label={t("All offers")} />
        {offers.map((o) => (
          <Tab
            key={o.key}
            selected={selectedKey === o.key}
            onClick={() => onSelect(o.key)}
            label={labels[o.key] || t("Discounts")}
          />
        ))}
      </div>
    </div>
  );
}
