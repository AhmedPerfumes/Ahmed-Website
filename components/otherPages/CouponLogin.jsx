"use client";
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CouponLogin() {
    const [password, setPassword] = useState('');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale || 'en';

    const handleLogin = (e) => {
        e.preventDefault();
        
        // This must match your ADMIN_PASSWORD in .env.local
        // In a real production app, you'd use a server action for this check
        const secret = "Brand@1."; 

        if (password === secret) {
            // Set cookie for 24 hours
            document.cookie = `admin-token=${password}; path=/; max-age=86400; SameSite=Strict`;
            
            // Redirect to your coupon register page
            router.push(`/${locale}/couponRegister`);
        } else {
            alert("Invalid Admin Password");
        }
    };


    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg border-0" style={{ width: '400px' }}>
                <div className="card-body p-5 text-center">
                    <h3 className="fw-bold mb-4 text-dark">Ahmed Admin</h3>
                    <p className="text-muted small mb-4">Enter your password to access internal tools.</p>
                    
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <input 
                                type="password" 
                                className="form-control form-control-lg" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-dark btn-lg w-100 shadow-sm">
                            Unlock Tools
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}