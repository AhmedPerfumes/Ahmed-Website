"use client";
import { useEffect } from "react";

export default function NonCriticalCSS() {
    useEffect(() => {
        // Dynamically load non-critical CSS after hydration
        import("rc-slider/assets/index.css");
        import("tippy.js/dist/tippy.css");
        import("react-tooltip/dist/react-tooltip.css");
    }, []);

    return null;
}
