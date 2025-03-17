import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const MenuItem = ({ src, alt, link, label, color }) => {
  return (
    <div className="menu-item">
      <Link style={{color:color}} to={link}>
        <img src={src} alt={alt} />
        <p>{label}</p>
      </Link>
    </div>
  );
};

export default MenuItem;
