import React from "react";
import "./styles.css"
import { Link } from "react-router-dom";

const CardButton = ({ label, colorButton = "#14AE5C", link, onClick}) => {
 
  return (
    <Link to={link}>
    <button className="card-button" style={{ borderColor:colorButton, color:colorButton }} onClick={onClick}>
        <p>{label}</p>
    </button>
    </Link>
  );
};

export default CardButton;
