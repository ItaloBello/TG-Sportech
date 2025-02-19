import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ src, alt, link, label, color }) => {
  return (
    <div className="menu-item">
      <Link style={{color:color}}>
        <img src={src} alt={alt} />
        <p>{label}</p>
      </Link>
    </div>
  );
};

export default MenuItem;
