import React, { useEffect, useRef } from "react";

import { useContextElement } from "@/context/Context";

const TamaraWidget = () => {

    const { totalPrice } = useContextElement();
    const widgetRef = useRef(null);

    useEffect(() => {
        // Setup global config BEFORE loading script
        window.tamaraSettings = {
        lang: "en",
        country: "AE",
        publicKey: "258c1cec-32f2-4290-9fde-83b3018848e9",
        };

        const script = document.createElement("script");
        script.src = "https://cdn-sandbox.tamara.co/widget-v2/tamara-widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
        document.body.removeChild(script);
        delete window.tamaraSettings;
        };
    }, []);

    useEffect(() => {
        if (widgetRef.current && totalPrice != null && !isNaN(totalPrice)) {
            widgetRef.current.setAttribute("amount", totalPrice.toFixed(2));
        }
    }, [totalPrice]);

    return totalPrice > 0 ? (
        <tamara-widget
            ref={widgetRef}
            type="tamara-summary"
            inline-type="3"
            inline-variant="outlined"
            config='{"theme":"light","badgePosition":"","showExtraContent":"","hidePayInX":false}'
        ></tamara-widget>
    ) : null;
};

export default TamaraWidget;
