import React from "react";
import "./styles.css"
import { Link } from "react-router-dom";

const CardButton = ({ label, colorButton, link }) => {
 
  return (
    <Link to={link}>
    <button className="card-button" style={{ borderColor:colorButton, color:colorButton }}>
        <p>{label}</p>
    </button>
    </Link>
  );
};

export default CardButton;
