// components/InfoCard.jsx
import React from "react";
import "./InfoCard.css";

const InfoCard = ({
  icon,
  title,
  description,
  layout = "column", // column | row
  onClick,
  clickable = false,
}) => {
  return (
    <div className={`info-card ${layout} ${clickable ? "clickable" : ""}`} onClick={clickable ? onClick : undefined}>
      {/* Icon */}
      {icon && ( <img src={icon} alt="icon" className="info-card-icon" />  )}

      {/* Text */}
      <div className="info-card-text">
        {title && <h6 className="info-card-title">{title}</h6>}
        {description && ( <p className="info-card-desc">{description}</p> )}
      </div>
    </div>
  );
};

export default InfoCard;
