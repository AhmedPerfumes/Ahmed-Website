"use client";

import { useEffect, useState } from "react";

/**
 * Shared, cached access to the active Buy X Get Y campaigns.
 *
 * BogoFeature.jsx (checkout only) applies the actual pricing. This module only
 * exposes the campaign rules so product cards, the cart drawer, the cart page
 * and checkout can show badges / progress without each fetching them again.
 */

let cachedCampaigns = null;
let inflight = null;

const loadCampaigns = () => {
  if (cachedCampaigns) return Promise.resolve(cachedCampaigns);
  if (inflight) return inflight;

  inflight = fetch(`${process.env.NEXT_PUBLIC_API_URL}api/bogoProducts`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch bogoProducts");
      return res.json();
    })
    .then((data) => {
      // Same validity rule BogoFeature.jsx uses
      cachedCampaigns = (data.bogoProducts || []).filter(
        (promo) => promo.campaign && Array.isArray(promo.buy_products)
      );
      return cachedCampaigns;
    })
    .catch(() => {
      // Don't cache failures, so a later mount can retry
      return [];
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
};

export const useBogoCampaigns = () => {
  const [campaigns, setCampaigns] = useState(cachedCampaigns || []);

  useEffect(() => {
    let active = true;
    loadCampaigns().then((list) => {
      if (active) setCampaigns(list);
    });
    return () => {
      active = false;
    };
  }, []);

  return campaigns;
};

const sameId = (a, b) => String(a) === String(b);

/** First active campaign whose "buy" list contains this product. */
export const getCampaignForProduct = (campaigns, productId) => {
  if (!productId || !campaigns?.length) return null;
  return (
    campaigns.find((c) => c.buy_products.some((p) => sameId(p.product_id, productId))) || null
  );
};

/**
 * Progress for every campaign that has at least one product in the cart.
 * Mirrors the unlock rule in BogoFeature.jsx: free items are granted for every
 * `buy_quantity` qualifying units in the cart (gift items are not counted).
 */
export const getBogoProgress = (campaigns, cartProducts) => {
  if (!campaigns?.length || !cartProducts?.length) return [];

  return campaigns
    .map((campaign) => {
      const buy = Number(campaign.buy_quantity) || 1;
      const get = Number(campaign.get_quantity) || 1;

      const qty = cartProducts.reduce((sum, item) => {
        if (item.is_gift) return sum;
        const qualifies = campaign.buy_products.some((p) => sameId(p.product_id, item.product_id));
        return qualifies ? sum + (Number(item.quantity) || 0) : sum;
      }, 0);

      if (qty === 0) return null;

      const sets = Math.floor(qty / buy);
      const unlocked = sets > 0;
      const remainder = qty % buy;

      return {
        campaign: campaign.campaign,
        buy,
        get,
        qty,
        unlocked,
        freeQty: sets * get,
        needed: unlocked ? 0 : buy - qty,
        percent: unlocked ? 100 : Math.min(100, (remainder / buy) * 100),
      };
    })
    .filter(Boolean);
};
