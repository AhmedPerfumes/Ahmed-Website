"use client";

import { isDiscountCurrentlyActive } from "@/components/common/ProductCard";

/**
 * Sale page tabs: "Buy X Get Y", "Percentage Off" (discount_type === "percent"),
 * and "Flat Discount" (discount_type === "amount").
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

  const percentDiscountIds = new Set();
  const amountDiscountIds = new Set();
  const otherDiscountIds = new Set();

  products.forEach((p) => {
    if (!p.discount || !isDiscountCurrentlyActive(p.discount)) return;
    const id = String(p.product_id);
    const type = String(p.discount.discount_type || "").trim().toLowerCase();

    if (type === "percent") {
      percentDiscountIds.add(id);
    } else if (type === "amount") {
      amountDiscountIds.add(id);
    } else {
      otherDiscountIds.add(id);
    }
  });

  const offers = [];
  if (bogoIds.size) offers.push({ key: "bogo", productIds: bogoIds, count: bogoIds.size });
  if (percentDiscountIds.size) {
    offers.push({ key: "percent", productIds: percentDiscountIds, count: percentDiscountIds.size });
  }
  if (amountDiscountIds.size) {
    offers.push({ key: "amount", productIds: amountDiscountIds, count: amountDiscountIds.size });
  }
  if (otherDiscountIds.size) {
    offers.push({ key: "discounts", productIds: otherDiscountIds, count: otherDiscountIds.size });
  }
  return offers;
};
