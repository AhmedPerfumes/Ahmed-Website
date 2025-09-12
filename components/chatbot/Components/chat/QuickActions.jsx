import React, { useState } from "react";
import { Package, Search, MessageCircle, MapPin } from "lucide-react";

export default function QuickActions({ onAction, language }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  const actions = [
    {
      key: "track_order",
      icon: Package,
      label: language === "ar" ? "تتبع الطلب" : "Track Order",
    },
    {
      key: "product_recommendation",
      icon: Search,
      label: language === "ar" ? "اقتراح عطور" : "Recommend",
    },
    {
      key: "contact_support",
      icon: MessageCircle,
      label: language === "ar" ? "الدعم الفني" : "Support",
    },
    {
      key: "store_locations",
      icon: MapPin,
      label: language === "ar" ? "المتاجر" : "Stores",
    },
  ];

  const containerStyle = {
    padding: '0.75rem 1rem', // px-4 py-3
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // bg-white/80
    backdropFilter: 'blur(4px)', // backdrop-blur-sm
    borderTop: '1px solid rgba(192, 160, 98, 0.2)', // border-t border-[#c0a062]/20
  };

  const actionsContainerStyle = {
    display: 'flex',
    gap: '0.5rem', // gap-2
    overflowX: 'auto', // overflow-x-auto
  };
  
  const buttonBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem', // gap-2
    whiteSpace: 'nowrap', // whitespace-nowrap
    border: '1px solid rgba(192, 160, 98, 0.3)', // border-[#c0a062]/30
    borderRadius: '0.5rem', // rounded-md (assuming default for sm size)
    padding: '0.5rem 1rem', // size="sm" equivalent
    backgroundColor: 'transparent',
    color: '#a18650', // text-[#a18650]
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
  };

  const getButtonHoverStyle = (key) => {
    if (hoveredButton === key) {
      return {
        backgroundColor: 'rgba(192, 160, 98, 0.1)', // hover:bg-[#c0a062]/10
        borderColor: 'rgba(192, 160, 98, 0.5)', // hover:border-[#c0a062]/50
      };
    }
    return {};
  };

  const iconStyle = {
    width: '1rem', // w-4
    height: '1rem', // h-4
  };

  return (
    <div style={containerStyle}>
      <div className="mx-auto" style={{ maxWidth: '48rem' }}>
        <div style={actionsContainerStyle}>
          {actions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <button
                key={action.key}
                style={{ ...buttonBaseStyle, ...getButtonHoverStyle(action.key) }}
                onClick={() => onAction(action.key)}
                onMouseEnter={() => setHoveredButton(action.key)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <ActionIcon style={iconStyle} />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}