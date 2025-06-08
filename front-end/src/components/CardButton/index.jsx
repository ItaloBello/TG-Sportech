import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

const CardButton = ({ label, colorButton = "#14AE5C", link, onClick }) => {
  const button = (
    <button
      className="card-button"
      style={{ borderColor: colorButton, color: colorButton }}
      onClick={onClick}
      type="button"
    >
      <p>{label}</p>
    </button>
  );
  return link ? <Link to={link}>{button}</Link> : button;
};

export default CardButton;