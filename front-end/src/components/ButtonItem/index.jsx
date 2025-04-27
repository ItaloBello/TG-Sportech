import React from "react";
import { Link } from "react-router-dom";
import "./styles.css"

const ButtonItem = ({ label, link, color, onClick }) => {
  return (
    <div className="button-item" onClick={onClick}>
      <Link className="button-item__link" to={link} style={{ color: color }}>
        <span>{label}</span>
      </Link>
    </div>
  );
};

export default ButtonItem;
