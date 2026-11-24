"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useContextElement } from "@/context/Context";
import { useBogoCampaigns, getBogoProgress } from "@/utils/bogo";

/**
 * Buy X Get Y progress bar, e.g. "Buy 3 Get 1 Free — Add 1 more product to get your free item".
 * Renders one bar per active campaign that has products in the cart, nothing otherwise.
 */
export default function BogoProgress({ className = "" }) {
  const t = useTranslations();
  const { cartProducts } = useContextElement();
  const campaigns = useBogoCampaigns();

  const progress = useMemo(
    () => getBogoProgress(campaigns, cartProducts),
    [campaigns, cartProducts]
  );

  if (!progress.length) return null;

  return (
    <div className={`bogo-progress ${className}`}>
      {progress.map((p) => (
        <div
          key={p.campaign}
          className="mb-2"
          style={{
            border: `1px solid ${p.unlocked ? "#D4AF37" : "#EAEAEA"}`,
            background: p.unlocked ? "#FCFBF7" : "#FFFFFF",
            borderRadius: "6px",
            padding: "10px 12px",
            textAlign: "center",
            transition: "all 0.4s ease",
          }}
        >
          <strong
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: "#2C2C2C",
            }}
          >
            {t("Buy {buy} Get {get} Free", { buy: p.buy, get: p.get })}
          </strong>

          <div style={{ fontSize: "13px", color: "#666", margin: "4px 0 8px" }}>
            {p.unlocked ? (
              <span style={{ color: "#B8942B", fontWeight: 600 }}>
                ✨ {t("Free item unlocked! It is applied at checkout")}
              </span>
            ) : (
              t("Add {count} more to get your free item", { count: p.needed })
            )}
          </div>

          <div
            className="progress"
            style={{ height: "4px", borderRadius: "4px", backgroundColor: "#F0F0F0", overflow: "hidden" }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${p.percent}%`,
                background: "linear-gradient(90deg, #E5C158, #D4AF37)",
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "4px",
              }}
              aria-valuenow={Math.round(p.percent)}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
