export const openCart = () => {
    document
      .getElementById("cartDrawerOverlay")
      .classList.add("page-overlay_visible");
    document.getElementById("cartDrawer").classList.add("aside_visible");

    // ---- ViewCart event — debounced (max once per 60 seconds) ----
    // Fires on cart icon / "View Cart" button clicks across all headers.
    // Condition: must have 60s gap between fires to prevent spam.
    try {
      const DEBOUNCE_MS = 60 * 1000; // 60 seconds
      const lastFired = parseInt(sessionStorage.getItem("__viewCartFired") || "0", 10);
      const now = Date.now();

      if (now - lastFired > DEBOUNCE_MS) {
        sessionStorage.setItem("__viewCartFired", now.toString());

        // GA4 view_cart (TikTok listener maps to ViewContent)
        if (typeof window !== "undefined") {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "view_cart" });

          // Meta Pixel explicit ViewContent
          if (typeof window.fbq === "function") {
            window.fbq("trackCustom", "ViewCart");
          }
        }
      }
    } catch (e) { /* tracking errors must never break cart open */ }
  };