"use client";

import { isDiscountCurrentlyActive } from "@/components/common/ProductCard";

/**
 * Sale page tabs: one "Buy X Get Y" tab and one "Discounts" tab.
 * Each tab holds the ids of the products that belong to it; a tab with no products is omitted.
 */
export const buildOffers = ({ products = [], bogoCampaigns = [] }) => {
  const known = new Set(products.map((p) => String(p.product_id)));

  const bogoIds = new Set();
  bogoCampaigns.forEach((c) =>
    c.buy_products.forEach((p) => {
      const id = String(p.product_id);
      if (known.has(id)) bogoIds.add(id);
    })
  );

  const discountIds = new Set(
    products
      .filter((p) => p.discount && isDiscountCurrentlyActive(p.discount))
      .map((p) => String(p.product_id))
  );

  const offers = [];
  if (bogoIds.size) offers.push({ key: "bogo", productIds: bogoIds, count: bogoIds.size });
  if (discountIds.size) offers.push({ key: "discounts", productIds: discountIds, count: discountIds.size });
  return offers;
};
