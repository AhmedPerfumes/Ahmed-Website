'use client';

import { useEffect } from 'react';

export default function BotPenguinWidget() {
    useEffect(() => {
        const scriptId = 'messenger-widget-b';

        // Function to load the script
        const loadScript = () => {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdn.botpenguin.com/website-bot.js';
            script.defer = true;
            script.innerHTML = '68db6a190f482854b719e190,68da29387c3c0348c646bc29';
            document.body.appendChild(script);
        };

        loadScript();

        return () => {
            // Cleanup BotPenguin elements on unmount
            const selectors = [
                'botpenguin-root',
                '#botpenguin-web-widget',
                '#BotPenguin-messenger',
                '#botpenguin-launcher-12',
                'iframe[src*="botpenguin"]',
                'div[id^="botpenguin"]',
                `#${scriptId}`,
                'script[src*="botpenguin"]' 
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });

            // Clean up global object
            if (window.BotPenguin) {
                delete window.BotPenguin;
            }
        };
    }, []);

    return null;
}
