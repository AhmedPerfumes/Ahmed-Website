import React, { useState } from "react";
import { ExternalLink, Star } from "lucide-react";

export default function ProductCard({ product, language }) {
  const [isHovered, setIsHovered] = useState(false);

  // Use the correct property names from perfume_data.json
  const name = product.name;
  const description = product.profile;
  const category = product.type || product.olfactory_profile?.split(' - ')[0]; // Use 'type' or guess from profile

  // CSS for the main card container, including the hover effect
  const cardStyle = {
    overflow: 'hidden',
    border: '1px solid rgba(192, 160, 98, 0.2)',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
    boxShadow: isHovered ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 1px 2px 0 rgba(0,0,0,0.05)',
    cursor: 'pointer'
  };

  // CSS for the content padding
  const cardContentStyle = {
    padding: '1rem'
  };

  // CSS for the icon container
  const iconContainerStyle = {
    width: '4rem',
    height: '4rem',
    background: 'linear-gradient(to bottom right, #f5f5f4, #e7e5e4)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  // CSS for the badge
  const badgeStyle = {
    backgroundColor: 'rgba(192, 160, 98, 0.1)',
    color: '#a18650',
    border: '1px solid rgba(192, 160, 98, 0.2)',
    borderRadius: '0.5rem',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 500
  };

  return (
    <div 
      style={cardStyle} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={cardContentStyle}>
        <div className="d-flex" style={{ gap: '1rem' }}>
          <div style={iconContainerStyle}>
            <Star style={{ width: '2rem', height: '2rem', color: '#c0a062' }} />
          </div>
          
          <div style={{ flex: '1', minWidth: '0' }}>
            <h4
              className="fw-semibold text-truncate"
              style={{ color: '#44403c' }}
            >
              {name}
            </h4>
            <p
              className="mt-1"
              style={{
                fontSize: '0.875rem',
                color: '#78716c',
                WebkitLineClamp: 2, // Equivalent of line-clamp-2
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                display: '-webkit-box',
                lineHeight: '1.5'
              }}
            >
              {description}
            </p>
            
            <div className="d-flex align-items-center justify-content-between mt-3">
              <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                {category && (
                  <span style={badgeStyle}>
                    {category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}