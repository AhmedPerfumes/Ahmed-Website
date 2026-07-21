"use client";
import React, { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Loyalty() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: '12px 20px' }}>
      <div 
        className={`stagger-item ${mounted ? 'is-visible' : ''}`}
        style={{ 
          background: '#F9FAFB', 
          border: '1px solid #EBEBEB',
          borderRadius: 24, 
          padding: '60px 20px',
          textAlign: "center",
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ 
          width: 60, height: 60, 
          background: '#fff', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
        </div>
        <h2 style={{ fontWeight: 600, marginBottom: 8, fontSize: 22, color: '#111', fontFamily: "'Kanit-Regular', sans-serif" }}>
          Loyalty Program
        </h2>
        <p style={{ color: '#666', fontSize: 15, margin: 0, fontFamily: "'Kanit-Regular', sans-serif" }}>
          <span className="badge bg-dark fw-normal px-2 py-1 mt-1" style={{ borderRadius: '4px', fontSize: '11px', letterSpacing: '0.5px' }}>COMING SOON</span>
        </p>
      </div>    
    </div>
  );
}
