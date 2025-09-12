import React, { useState } from "react";
import { Globe } from "lucide-react";

export default function LanguageSelector({ language, onLanguageChange }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  const baseContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem', // gap-2
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // bg-white/80
    borderRadius: '0.75rem', // rounded-xl
    padding: '0.25rem', // p-1
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', // shadow-sm
    border: '1px solid rgba(192, 160, 98, 0.2)', // border-[#c0a062]/20
  };

  const buttonBaseStyle = {
    borderRadius: '0.5rem', // rounded-lg
    fontSize: '0.75rem', // text-xs
    padding: '0.5rem 1rem', // size="sm" equivalent
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const activeButtonStyle = {
    backgroundColor: '#c0a062', // bg-[#c0a062]
    color: 'white',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', // shadow-sm
  };

  const inactiveButtonStyle = {
    backgroundColor: 'transparent',
    color: '#a18650', // text-[#a18650]
  };

  const getButtonStyle = (buttonLang) => {
    const isActive = language === buttonLang;
    let style = { ...buttonBaseStyle };

    if (isActive) {
      style = { ...style, ...activeButtonStyle };
    } else {
      style = { ...style, ...inactiveButtonStyle };
      if (hoveredButton === buttonLang) {
        style.backgroundColor = 'rgba(192, 160, 98, 0.1)'; // hover:bg-[#c0a062]/10
      }
    }
    return style;
  };

  return (
    <div style={baseContainerStyle}>
      <button
        style={getButtonStyle("en")}
        onClick={() => onLanguageChange("en")}
        onMouseEnter={() => setHoveredButton("en")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        EN
      </button>
      <button
        style={getButtonStyle("ar")}
        onClick={() => onLanguageChange("ar")}
        onMouseEnter={() => setHoveredButton("ar")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        عر
      </button>
    </div>
  );
}