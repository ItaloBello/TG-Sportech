import React from "react";
import { Link } from "react-router-dom";
import "./styles.css"

const ButtonItem = ({ label, link, color }) => {
  return (
    <>
      <Link className="button-item" to={link} style={{ color: color }}>
        <span>{label}</span>
      </Link>
    </>
  );
};

export default ButtonItem;
