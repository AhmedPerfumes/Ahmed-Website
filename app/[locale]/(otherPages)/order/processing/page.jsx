"use client"; // Required for using hooks

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderProcessing() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Processing your payment, please wait...');

    useEffect(() => {
        // Read the cartId from the URL
        const cartId = searchParams.get('cartId');

        if (!cartId) {
            setStatus('Error: No payment session ID found.');
            return;
        }

        let attempts = 0;
        const maxAttempts = 20; // Poll for 60 seconds max (20 attempts * 3s)

        // Function to call your Laravel API
        const checkStatus = async () => {
            attempts++;
            
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
                const response = await fetch(`${apiUrl}api/order-status/${cartId}`);
                
                if (!response.ok) {
                    throw new Error('Server responded with an error.');
                }

                const data = await response.json();

                if (data.status === 'completed') {
                    // SUCCESS: The backend has created the order.
                    setStatus('Order confirmed! Redirecting...');
                    clearInterval(intervalId); // Stop polling
                    // Redirect to the final "thank you" page
                    router.push(`/order-complete?q=${btoa(data.order_code)}`);
                } else if (attempts >= maxAttempts) {
                    // TIMEOUT: The backend is taking too long.
                    setStatus('Confirmation is taking longer than expected.');
                    clearInterval(intervalId);
                }
                // If status is 'pending', do nothing and let the interval run again.

            } catch (err) {
                setStatus('Error: Could not connect to the server.');
                clearInterval(intervalId);
            }
        };

        const intervalId = setInterval(checkStatus, 3000);

        // Cleanup function to stop polling if the user navigates away
        return () => clearInterval(intervalId);

    }, [searchParams, router]);

    return (
        <div style={{ textAlign: 'center', marginTop: '5rem', fontFamily: 'sans-serif' }}>
            <h1>{status}</h1>
            <p>Please do not close this window or press the back button.</p>
            <div className="spinner"></div> 
            <style jsx>{`
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #09f;
                    margin: 2rem auto;
                    animation: spin 1s ease infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}