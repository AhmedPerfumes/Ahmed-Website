"use client";

import React from "react";
import he from "he";
import { useBogoCampaigns, getCampaignForProduct } from "@/utils/bogo";

/**
 * Small Buy X Get Y badge for product tiles (related / family sliders).
 * Shows the promotion name; renders nothing when the product is not in an active campaign.
 * Place it inside a `position: relative` image wrapper.
 *
 * @param productId  product to check
 * @param stacked    true when a Sale badge is already shown at the top-left, so this sits below it
 * @param getLabel   optional (buy, get) => string used when the promotion has no name. It is passed
 *                   in (not translated here) so this works on pages without the next-intl provider.
 */
export default function BogoBadge({ productId, stacked = false, getLabel }) {
  const campaigns = useBogoCampaigns();
  const campaign = getCampaignForProduct(campaigns, productId);

  if (!campaign) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: stacked ? "36px" : "8px",
        insetInlineStart: "8px",
        zIndex: 3,
        maxWidth: "calc(100% - 16px)",
        backgroundColor: "#D4AF37",
        color: "#fff",
        padding: "3px 8px",
        borderRadius: "3px",
        fontSize: "0.625rem",
        fontWeight: 600,
        lineHeight: 1.4,
        pointerEvents: "none",
      }}
    >
      {campaign.name
        ? he.decode(campaign.name)
        : (getLabel || ((b, g) => `Buy ${b} Get ${g} Free`))(
            Number(campaign.buy_quantity) || 1,
            Number(campaign.get_quantity) || 1
          )}
    </div>
  );
}
