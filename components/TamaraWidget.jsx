import React, { useEffect, useRef, useState } from "react";

const TamaraWidget = ({ amount, inlineType, inlineVariant }) => {
    const widgetKey = `tamara-widget-${amount}`; // key to force re-render
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        if (scriptLoadedRef.current) return;

        window.tamaraSettings = {
            lang: "en",
            country: "AE",
            publicKey: "258c1cec-32f2-4290-9fde-83b3018848e9",
        };

        const script = document.createElement("script");
        script.src = "https://cdn-sandbox.tamara.co/widget-v2/tamara-widget.js";
        script.async = true;
        script.onload = () => {
            scriptLoadedRef.current = true;
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            delete window.tamaraSettings;
            scriptLoadedRef.current = false;
        };
    }, []);

    return (
        <tamara-widget
            key={widgetKey}
            type="tamara-summary"
            amount={amount}
            inline-type={inlineType}
            inline-variant={inlineVariant}
            config='{"theme":"light","badgePosition":"","showExtraContent":"","hidePayInX":false}'
        />
    );
};

export default TamaraWidget;
