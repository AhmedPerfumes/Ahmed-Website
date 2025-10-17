// components/HandleCancel.tsx
'use client';

import { useEffect } from 'react';

export default function TamaraPaymentRedirect() {
   useEffect(() => {
    const hash = window.location.hash; // e.g. http://localhost:3000/en/tamara-payment-redirect#/success?paymentStatus=approved&orderId=19e69f43-8532-4667-826f-2a15054358c3 http://localhost:3000/en/tamara-payment-redirect#/cancel?paymentStatus=canceled?orderId=657fa338-5ceb-48fd-8f6f-b91727d3fb5c

    if (!hash) return;

    // 1. Remove the "#/" or "#" prefix
    const raw = hash.startsWith('#/') ? hash.slice(2) : hash.slice(1);

    // 2. Split route from the rest
    const [route, ...queryParts] = raw.split('?');

    // Join remaining query parts with "&" to sanitize multiple "?" issues
    const fixedQueryString = queryParts.join('&'); 
    const params = new URLSearchParams(fixedQueryString);

    const orderId = params.get('orderId');
    // const paymentStatus = params.get('paymentStatus');

    // console.log('000Route:', route);
    // console.log('000Payment Status:', paymentStatus);
    console.log('000Order ID:', orderId);

    // Handle success or cancel logic
    if (orderId) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}api/tamaraPaymentResponse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((json) => {
          console.log("Tamara API Response:", json);
        })
        .catch((err) => {
          console.error("Failed to fetch coupons:", err)          
        })
        .finally(() => {
        //   window.location.href = `/en/thank-you?orderId=${orderId}`; // Redirect to Thank You page
        });
    }

  }, []);

  return null;
}
