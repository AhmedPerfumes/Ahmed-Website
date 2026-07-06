// "use client";
// import React, { useEffect } from "react";
// import { usePathname, useSearchParams } from "next/navigation";

// export const FacebookPixelEvents = () => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     import("react-facebook-pixel")
//       .then((x) => x.default)
//       .then((ReactPixel) => {
//         ReactPixel.init("235034997951707"); // Replace with your Facebook Pixel ID
//         ReactPixel.pageView();

//         // Example: Track a conversion event with a token
//         // const conversionToken = "EAADhP2FyWZAMBO6CAWMq5YxAjtKauCOOulAhpS3ZAvDJ2NP7XXUrOhR9u7ZCzZComTVtFxVFM6c2SZA0yAztBPLoX5UqecbwC3Kss4tvlk0wvMcp4Fx45tT5838bQgO8HUWd6z6It4zZA8uxPNiBzvNLlXkW9rg55Kv5GraBn2sxaN8kzFuHBICRbooLPAY1xyQAZDZD"; // Replace with your dynamic token logic

//         // ReactPixel.track("Lead", {
//         //   currency: "AED", // Adjust as needed
//         //   value: '100.0', // Adjust the value as appropriate for your use case
//         //   token: conversionToken, // Add the token
//         // });
//       });
//   }, [pathname, searchParams]);

//   return null;
// };

"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useContextElement } from "@/context/Context";

export const FacebookPixelEvents = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { cartProducts, totalPrice } = useContextElement();
    const [cartData, setCartData] = useState({ items: [], total: 0 });

    // Keep cartData in sync with the real cart context
    useEffect(() => {
        setCartData({
            items: (cartProducts || []).map((item) => ({
                id: item.product_id?.toString(),
            })),
            total: totalPrice || 0,
        });
    }, [cartProducts, totalPrice]);

    useEffect(() => {
        const loadFacebookPixel = () => {
            if (!window.fbq) {
                (function (f, b, e, v, n, t, s) {
                    if (f.fbq) return;
                    n = f.fbq = function () {
                        n.callMethod
                            ? n.callMethod.apply(n, arguments)
                            : n.queue.push(arguments);
                    };
                    if (!f._fbq) f._fbq = n;
                    n.push = n;
                    n.loaded = !0;
                    n.version = "2.0";
                    n.queue = [];
                    t = b.createElement(e);
                    t.async = !0;
                    t.src = v;
                    s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s);
                })(
                    window,
                    document,
                    "script",
                    "https://connect.facebook.net/en_US/fbevents.js"
                );

                // Disable Meta's automatic button-click detection.
                // This prevents spurious 'Purchase' and 'SubscribedButtonClick' events
                // from firing on form submits / add-to-cart buttons.
                fbq("set", "autoConfig", false, "235034997951707");
                fbq("init", "235034997951707");
                fbq("track", "PageView");
            }
        };

        loadFacebookPixel();

        // Track PageView on route change
        fbq("track", "PageView");

        // Track InitiateCheckout ONCE when user visits the checkout page.
        // Guard conditions:
        //   1. Must be on the checkout path
        //   2. Cart must have real items (not empty — avoids firing before localStorage loads)
        //   3. sessionStorage flag prevents double-fire if cartData state update re-triggers this effect
        if (pathname.includes("shop-checkout")) {
            if (cartData.items.length > 0 && !sessionStorage.getItem("__initCheckoutTracked")) {
                sessionStorage.setItem("__initCheckoutTracked", "1");
                fbq("track", "InitiateCheckout", {
                    content_ids: cartData.items.map((item) => item.id),
                    content_type: "product",
                    value: cartData.total,
                    currency: "AED",
                });
            }
        } else {
            // Clear the flag when user leaves checkout so it fires again on a new visit
            sessionStorage.removeItem("__initCheckoutTracked");
        }
        // NOTE: The Purchase event is NOT tracked here.
        // It is fired on the order confirmation pages (shop-order-complete & shop-order-payment-complete)
        // to ensure it only triggers after a successful order, not on button click.
    }, [pathname, searchParams, cartData]);


    return null;
};
